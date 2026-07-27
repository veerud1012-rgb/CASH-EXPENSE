import { 
  Banknote, 
  QrCode, 
  FileCheck, 
  Building, 
  CreditCard, 
  Wallet, 
  Globe, 
  CircleDollarSign,
  Smartphone
} from 'lucide-react';
import { PaymentMethod } from '../types';

export function getPaymentMethodIcon(method: PaymentMethod) {
  switch (method) {
    case 'Cash':
      return Banknote;
    case 'UPI':
      return Smartphone;
    case 'Cheque':
      return FileCheck;
    case 'Bank Transfer':
    case 'Net Banking':
      return Building;
    case 'Credit Card':
    case 'Debit Card':
      return CreditCard;
    case 'Wallet':
      return Wallet;
    case 'QR Payment':
      return QrCode;
    default:
      return CircleDollarSign;
  }
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'UPI',
  'Cheque',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Wallet',
  'Net Banking',
  'QR Payment',
  'Other'
];
