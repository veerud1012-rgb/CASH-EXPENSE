import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { OCRResult } from '../../types';
import { 
  X, 
  Scan, 
  Upload, 
  Camera, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Building, 
  Calendar, 
  Tag, 
  ArrowRight
} from 'lucide-react';

export const ReceiptUploadModal: React.FC = () => {
  const { 
    isOCRModalOpen, 
    setIsOCRModalOpen, 
    processReceiptOCR, 
    addTransaction, 
    categories,
    user 
  } = useApp();

  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  // Editable parsed fields state
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [billNumber, setBillNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Camera stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  if (!isOCRModalOpen) return null;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      alert('Camera access denied or unavailable on this device.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setFileBase64(dataUrl);
      setFileName('camera_capture_receipt.jpg');

      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);

      runOCR(dataUrl, 'image/jpeg');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFileBase64(base64);
      runOCR(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const runOCR = async (base64Data: string, mimeType: string) => {
    setIsLoading(true);
    try {
      const res = await processReceiptOCR(base64Data, mimeType);
      setOcrResult(res);

      if (res) {
        setMerchant(res.merchantName || '');
        setAmount(res.totalAmount ? res.totalAmount.toString() : '');
        setDate(res.date || new Date().toISOString().split('T')[0]);
        setCategory(res.suggestedCategory || 'Office Expense');
        if (res.paymentMethod) setPaymentMethod(res.paymentMethod);
        if (res.billNumber) setBillNumber(res.billNumber);
        if (res.address || res.phoneNumber) {
          setNotes(`Merchant Addr: ${res.address || ''}, Phone: ${res.phoneNumber || ''}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    await addTransaction({
      type: 'expense',
      title: `Bill: ${merchant || 'Receipt Expense'}`,
      description: `AI OCR extracted receipt from ${merchant}`,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      time: ocrResult?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      category: category || 'Office Expense',
      paymentType: paymentMethod as any,
      referenceNumber: billNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      vendorOrCustomer: merchant || 'Store Vendor',
      notes,
      receiptUrl: fileBase64 || undefined,
      receiptFileName: fileName,
      ocrData: ocrResult || undefined,
      status: 'Completed'
    });

    setIsOCRModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#E53935] flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Receipt OCR Scanner</span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Upload or capture receipt to extract bill details automatically</p>
            </div>
          </div>

          <button
            onClick={() => setIsOCRModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setMode('upload'); setCameraActive(false); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'upload' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Bill Image / PDF</span>
            </button>
            <button
              onClick={() => { setMode('camera'); startCamera(); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'camera' ? 'bg-[#E53935] text-white shadow-md' : 'text-slate-500'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Capture via Camera</span>
            </button>
          </div>

          {/* Camera View Mode */}
          {mode === 'camera' && (
            <div className="relative bg-black rounded-2xl overflow-hidden min-h-[260px] flex items-center justify-center border border-slate-800">
              <video ref={videoRef} className="w-full h-64 object-cover" />
              {cameraActive && (
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 px-6 py-2.5 rounded-full bg-[#E53935] text-white font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition"
                >
                  <Camera className="w-4 h-4" /> Snap Bill Receipt
                </button>
              )}
            </div>
          )}

          {/* Upload Drop Zone Mode */}
          {mode === 'upload' && !fileBase64 && (
            <label className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center block cursor-pointer hover:border-[#E53935] transition group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[#E53935] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                Drag & Drop Receipt or Click to Upload
              </div>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, and PDF bills up to 10MB</p>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          )}

          {/* Loading Animation State */}
          {isLoading && (
            <div className="py-8 text-center space-y-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              <RefreshCw className="w-8 h-8 text-[#E53935] animate-spin mx-auto" />
              <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
                <span>Gemini AI is reading receipt...</span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">Auto-detecting merchant, amount, GST tax, and category</p>
            </div>
          )}

          {/* Parsed Result Form Preview */}
          {fileBase64 && !isLoading && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <img src={fileBase64} alt="Receipt" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{fileName}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI OCR Extraction Successful
                  </div>
                </div>
                <button
                  onClick={() => { setFileBase64(null); setOcrResult(null); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold hover:bg-slate-300 transition"
                >
                  Change Bill
                </button>
              </div>

              {ocrResult?.duplicateDetected && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Warning: Potential duplicate bill detected for amount {user.currency}{amount}!</span>
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Merchant / Vendor</label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Bill Amount ({user.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 font-bold font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Suggested Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {categories.filter(c => c.type === 'expense').map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setIsOCRModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTransaction}
                  className="px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/30 flex items-center gap-2 cursor-pointer active:scale-95 transition"
                >
                  <span>Save Record</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
