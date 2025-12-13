/* PRODUCTION DEPLOY CONFIG - netlify.toml:
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; worker-src 'self' blob:; connect-src 'self';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
*/

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Upload, FileText, Shield, Info, Trash2, 
  AlertTriangle, CheckCircle, HelpCircle, 
  Settings, ChevronDown, ChevronRight, X,
  Globe, BookOpen, Home, PieChart,
  Download, RefreshCw, Heart, ExternalLink,
  Search, Filter, ArrowRight, User, Users, LogOut,
  Menu, XCircle, Clock, RotateCcw,
  ChevronLeft, List, Printer, Plus, UploadCloud,
  FileJson, FileSpreadsheet, Mail, AlertCircle
} from 'lucide-react';
import DOMPurify from 'dompurify'; /* PRIORITY 1 FIXED: XSS Protection */



import { PurificationAnimation, CursorTrail } from './Animations';
import { TRANSLATIONS, LANGUAGES, Language } from './translations';


// --- Error Boundary Component ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined };
  
  static getDerivedStateFromError(error: Error) { 
    return { hasError: true, error }; 
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) { 
    console.error('ErrorBoundary caught:', error, info); 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The application encountered an error. Please refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- PDF.js Worker Setup ---
const getPdfJs = async () => {
  const pdfjs = await import('pdfjs-dist');
  // @ts-ignore
  const pdfWorker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
  return { getDocument: pdfjs.getDocument };
};

// --- TYPES ---
type ViewState = 'dashboard' | 'knowledge' | 'methodology' | 'manifesto' | 'purification' | 'settings' | 'donate' | 'contact';
type ProcessingState = 'idle' | 'analyzing' | 'complete' | 'error';
type Currency = 'USD' | 'GBP' | 'EUR' | 'INR' | 'SAR' | 'AED' | 'MYR' | 'IDR';
// type Language imported from translations
type FatwaSource = 'global' | 'ecfr' | 'amja' | 'local';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  originalText: string;
  isRiba: boolean;
  currency: Currency;
  category: 'income' | 'shopping' | 'utilities' | 'transfer' | 'riba' | 'uncategorized';
  confidence: 'high' | 'medium' | 'low';
  page: number; // Added page number
  reason?: string;
}

interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
  fatwaSource: FatwaSource;
}

interface PurificationRecord {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  statementName: string;
  itemsCount: number;
  status: 'pending' | 'disposed';
  notes?: string;
}

// --- CONSTANTS ---




// --- HELPERS ---

// Map currencies to specific locales for correct symbol formatting (e.g. ₹ for INR)
const currencyLocales: Record<string, string> = {
  'USD': 'en-US', // $
  'GBP': 'en-GB', // £
  'EUR': 'de-DE', // €
  'INR': 'en-IN', // ₹
  'SAR': 'en-SA', // SAR or ر.س
  'AED': 'en-AE', // AED
  'MYR': 'en-MY', // RM
  'IDR': 'id-ID'  // Rp
};

const formatCurrency = (amount: number, currency: Currency) => {
  try {
    const locale = currencyLocales[currency] || 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl (rare for standard codes)
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const detectDominantCurrency = (fullText: string): Currency => {
    const counts: Record<string, number> = {
        'GBP': (fullText.match(/£|GBP/g) || []).length,
        'USD': (fullText.match(/\$|USD/g) || []).length,
        'EUR': (fullText.match(/€|EUR/g) || []).length,
        'INR': (fullText.match(/₹|INR|Rs\.?|Rupees/gi) || []).length,
        'SAR': (fullText.match(/SAR|ر.س/g) || []).length,
        'AED': (fullText.match(/AED/g) || []).length,
        'MYR': (fullText.match(/MYR|RM/g) || []).length,
        'IDR': (fullText.match(/IDR|Rp/g) || []).length,
    };
    
    // Find key with max value
    const bestMatch = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    // If no currency symbols found, try to guess from timezone
    if (counts[bestMatch] === 0) {
       try {
         const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
         if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) return 'INR';
         if (tz.includes('Riyadh') || tz.includes('Saudi')) return 'SAR';
         if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) return 'AED';
         if (tz.includes('Jakarta')) return 'IDR';
         if (tz.includes('Kuala_Lumpur')) return 'MYR';
         if (tz.includes('London')) return 'GBP';
         if (tz.includes('Berlin') || tz.includes('Paris') || tz.includes('Madrid')) return 'EUR';
       } catch (e) {}
       return 'USD'; // Ultimate fallback
    }

    return (bestMatch as Currency);
};


// Robust Amount Parser Helper
// Solves issue where page number "1" is detected instead of "189.00"
// Strategy: Enforce 2 decimal places strict check, filter out account numbers/dates
const parseTransactionAmount = (line: string, dateMatch: string | null): number => {
  let clean = line;
  if (dateMatch) clean = clean.replace(dateMatch, ''); // Remove date
  
  // Remove noise: account numbers (long sequences of digits), specific 'page' numbers if at end
  // Remove sequences of digits > 4 that don't have separators, to avoid years like 2023 if missed by date regex or account nums
  clean = clean.replace(/\b\d{5,}\b/g, ''); 

  // Strict regex: requires decimal point or comma followed by 2 digits.
  // Supports 1,234.56 (US/UK) or 1.234,56 (EU)
  // This actively ignores single integers like "1" or "2"
  const decimalMatches = clean.match(/(\d{1,3}(?:,\d{3})*\.\d{2})\b|(\d{1,3}(?:\.\d{3})*,\d{2})\b/g);

  if (!decimalMatches || decimalMatches.length === 0) return 0;

  // If multiple matches, we take the first one found that fits the format.
  // Usually, checking the line context helps, but simply taking the first one is safer than last (balance).
  
  const raw = decimalMatches[0];
  
  // Normalize to float
  // If it has ',' as decimal separator (at the end e.g. ,00)
  if (raw.match(/,\d{2}$/)) {
     return parseFloat(raw.replace(/\./g, '').replace(',', '.'));
  }
  // Else assume '.' is decimal
  return parseFloat(raw.replace(/,/g, ''));
};

// --- LOGIC ---

// Advanced Category Detection with Scoring
const detectCategory = (text: string): { category: Transaction['category']; isRiba: boolean; confidence: Transaction['confidence']; reason?: string } => {
  const lower = text.toLowerCase();
  
  // High Confidence Riba (Explicit keywords)
  if (/(?:credit|gross|net|paid)\s*interest|int\.?\s*pd|fawaid|overdraft\s*interest|finance\s*charge|nsf\s*fee|non-sufficient\s*funds/i.test(lower)) {
    return { category: 'riba', isRiba: true, confidence: 'high', reason: "Explicit Interest/Finance Charge" };
  }
  
  // Medium Confidence Riba (Fees, Penalties, Arrears)
  if (/late\s*fee|penalty|arrears|deficiency|past\s*due/i.test(lower)) {
    return { category: 'riba', isRiba: true, confidence: 'medium', reason: "Penalty/Late Fee" };
  }

  // General Interest Keyword check (Medium confidence if not caught above)
  if (/interest/i.test(lower)) {
    return { category: 'riba', isRiba: true, confidence: 'medium', reason: "Contains word 'interest'" };
  }

  // Utilities / Service Fees (Halal but Gray area sometimes)
  if (/service\s*fee|maintenance\s*fee|annual\s*fee|monthly\s*fee/i.test(lower)) {
    return { category: 'utilities', isRiba: false, confidence: 'low', reason: "Bank Service Fee" };
  }

  // Halal Indicators
  if (/cashback|refund|return|deposit|transfer|salary|payroll/i.test(lower)) {
    return { category: 'income', isRiba: false, confidence: 'high' };
  }

  // Shubhah Indicators
  if (/dividend|profit|bonus|reward/i.test(lower)) {
    return { category: 'uncategorized', isRiba: false, confidence: 'medium', reason: "Ambiguous Reward/Profit" }; 
  }

  return { category: 'shopping', isRiba: false, confidence: 'low' }; 
};


// --- HOOKS ---

const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved) return saved as Language;
    
    // Smart Detect via TimeZone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Asia/Dubai') || tz.includes('Riyadh')) return 'ar';
      if (tz.includes('Calcutta')) return 'hi';
      if (tz.includes('Karachi')) return 'ur';
      if (tz.includes('Jakarta')) return 'id';
      if (tz.includes('Berlin')) return 'de';
      if (tz.includes('Moscow')) return 'ru';
      if (tz.includes('Paris')) return 'fr';
    } catch (e) {
      console.warn("Timezone detection failed", e);
    }
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    const langConfig = LANGUAGES.find(l => l.code === language);
    const dir = langConfig?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Remove all language-specific font classes
    document.documentElement.classList.remove('font-urdu', 'font-english', 'font-russian', 'font-chinese');
    
    // Apply language-specific fonts
    if (language === 'ur') {
      if (!document.getElementById('scheherazade-font')) {
        const link = document.createElement('link');
        link.id = 'scheherazade-font';
        link.rel = 'stylesheet';
        link.href = "https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap";
        document.head.appendChild(link);
      }
      if (!document.getElementById('urdu-font-style')) {
        const style = document.createElement('style');
        style.id = 'urdu-font-style';
        style.innerHTML = `.font-urdu * {font-family: 'Scheherazade New', serif !important;}`;
        document.head.appendChild(style);
      }
      document.documentElement.classList.add('font-urdu');
    } 
    else if (language === 'en') {
      if (!document.getElementById('raleway-font')) {
        const link = document.createElement('link');
        link.id = 'raleway-font';
        link.rel = 'stylesheet';
        link.href = "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
      if (!document.getElementById('english-font-style')) {
        const style = document.createElement('style');
        style.id = 'english-font-style';
        style.innerHTML = `.font-english * {font-family: 'Raleway', sans-serif !important; letter-spacing: 0.01em;}`;
        document.head.appendChild(style);
      }
      document.documentElement.classList.add('font-english');
    }
    else if (language === 'ru') {
      if (!document.getElementById('playfair-font')) {
        const link = document.createElement('link');
        link.id = 'playfair-font';
        link.rel = 'stylesheet';
        link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
      if (!document.getElementById('russian-font-style')) {
        const style = document.createElement('style');
        style.id = 'russian-font-style';
        style.innerHTML = `.font-russian * {font-family: 'Playfair Display', serif !important; letter-spacing: 0.005em;}`;
        document.head.appendChild(style);
      }
      document.documentElement.classList.add('font-russian');
    }
    else if (language === 'zh') {
      if (!document.getElementById('noto-serif-sc-font')) {
        const link = document.createElement('link');
        link.id = 'noto-serif-sc-font';
        link.rel = 'stylesheet';
        link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap";
        document.head.appendChild(link);
      }
      if (!document.getElementById('chinese-font-style')) {
        const style = document.createElement('style');
        style.id = 'chinese-font-style';
        style.innerHTML = `.font-chinese * {font-family: 'Noto Serif SC', serif !important; font-display: swap;}`;
        document.head.appendChild(style);
      }
      document.documentElement.classList.add('font-chinese');
    }
  }, [language]);

  const t = useCallback((key: keyof typeof TRANSLATIONS['en']) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    // @ts-ignore
    return dict[key] || TRANSLATIONS['en'][key] || key;
  }, [language]);

  return { language, setLanguage, t };
};

// --- COMPONENTS ---

// Tooltip Component
const Tooltip = ({ text, children, position = 'top' }: { text: string, children: React.ReactNode, position?: 'top' | 'bottom' }) => {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <div 
        className={`
          absolute ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
          px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl
          opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100
          pointer-events-none z-50 whitespace-nowrap
        `}
      >
        {text}
        {/* Arrow */}
        <div 
          className={`
            absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45
            ${position === 'bottom' ? '-top-1' : '-bottom-1'}
          `}
        />
      </div>
    </div>
  );
};

// 1. Language Switcher
const LanguageSwitcher = ({ current, onChange }: { current: Language, onChange: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === current);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <span className="text-lg">{currentLang?.flag || '🌐'}</span>
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">{currentLang?.name || 'Language'}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden max-h-96 overflow-y-auto">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${current === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
              style={{ color: '#0f172a' }} // Explicit color
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span className={lang.fontClass}>{lang.name}</span>
              </div>
              {current === lang.code && <CheckCircle size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// New Helper for Export
const exportCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Description', 'Amount', 'Currency', 'Category', 'Status', 'Confidence'];
  const rows = transactions.map(t => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    t.amount,
    t.currency,
    t.category,
    t.isRiba ? 'Riba' : 'Halal',
    t.confidence
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Purification_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Toggle Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ${
      checked ? 'bg-red-500' : 'bg-emerald-500'
    }`}
  >
    <div 
      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} 
    />
  </button>
);

// Mobile Transaction Card
const MobileTransactionCard = React.memo(({ tObj, onToggleStatus, formatCurrency, t }: any) => (
  <div className={`p-4 rounded-2xl border mb-3 transition-all duration-200 ${
    tObj.isRiba ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'
  }`} style={{contain: 'layout style paint', contentVisibility: 'auto'}}>
    <div className="flex justify-between items-center">
      <div className="flex-1 mr-4">
        <p className="font-bold text-slate-900 text-base mb-0.5 line-clamp-1">{tObj.description}</p>
        <p className="text-xs text-slate-400 font-medium">{tObj.date}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <p className={`font-mono font-bold text-base ${tObj.isRiba ? 'text-red-600' : 'text-emerald-600'}`}>
          {formatCurrency(tObj.amount, tObj.currency)}
        </p>
        <Toggle checked={tObj.isRiba} onChange={() => onToggleStatus(tObj.id)} />
      </div>
    </div>
  </div>
));

// 2. Dashboard
// Verif Log Accordion (Mobile)
const VerifLogAccordion = ({ transactions, isOpen, onToggle, formatCurrency, t }: any) => {
  const ribaTransactions = transactions.filter((t: any) => t.isRiba);
  
  if (ribaTransactions.length === 0) return null;

  return (
    <div className="md:hidden mb-6 bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-red-50/30 text-red-800"
      >
        <div className="flex items-center gap-2 font-bold">
          <List size={18} />
          {t('verif_log')}
          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
            {ribaTransactions.length}
          </span>
        </div>
        {isOpen ? <ChevronDown size={20} className="rotate-180 transition-transform" /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 bg-white">
          {ribaTransactions.map((t: any, idx: number) => (
            <div key={idx} className="p-3 flex justify-between items-start text-sm">
              <div>
                <p className="font-mono font-bold text-slate-700 text-xs">{t.date}</p>
                <p className="text-slate-500 text-xs truncate max-w-[150px]">{t.description}</p>
              </div>
              <p className="font-mono font-bold text-red-600">
                {formatCurrency(t.amount, t.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ 
  userProfile, 
  onUpload, 
  processingState, 
  transactions, 
  history,
  onProcess, 
  onReset,
  onToggleStatus, 
  t,
  navigateToView,
  files,
  setFiles,
  onUploadClick,
  isMobile
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showVerifLog, setShowVerifLog] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 15 : 25);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const totalRiba = transactions
    .filter((txn: Transaction) => txn.isRiba)
    .reduce((sum: number, txn: Transaction) => sum + txn.amount, 0);
    
  const totalVolume = transactions.reduce((sum: number, txn: Transaction) => sum + txn.amount, 0);
  const purityScore = totalVolume > 0 ? Math.round(((totalVolume - totalRiba) / totalVolume) * 100) : 100;

  // Add global CSS performance optimizations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { -webkit-tap-highlight-color: transparent; }
      .card, .transaction-card { contain: layout style; }
      button, a { touch-action: manipulation; }
      img { content-visibility: auto; }
      .smooth-scroll { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const topSources = useMemo(() => {
    const sourceMap = new Map<string, number>();
    transactions.filter((txn: Transaction) => txn.isRiba).forEach((txn: Transaction) => {
      const source = txn.description.split(' ')[0] || 'Bank';
      sourceMap.set(source, (sourceMap.get(source) || 0) + txn.amount);
    });
    return Array.from(sourceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [transactions]);
  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Generate PDF Certificate (Enhanced Professional Version)
  const generatePDFCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const ribaItems = transactions.filter((t: Transaction) => t.isRiba);
    const certificateId = `RIBA-${Date.now()}`;
    
    // Calculate Totals by Currency
    const totalsByCurrency = ribaItems.reduce((acc: Record<string, number>, item: Transaction) => {
      acc[item.currency] = (acc[item.currency] || 0) + item.amount;
      return acc;
    }, {});

    const CURRENCY_DISPLAY: Record<string, { symbol: string; name: string; flag: string }> = {
      USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
      GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
      EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
      INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
      SAR: { symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
      AED: { symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
      MYR: { symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
      IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
      CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
      AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
      JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
      CNY: { symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
      CHF: { symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
      SGD: { symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
      HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
      NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
      KRW: { symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
      TRY: { symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
      BRL: { symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
      RUB: { symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
      ZAR: { symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
      PKR: { symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
      BDT: { symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
      EGP: { symbol: '£', name: 'Egyptian Pound', flag: '🇪🇬' },
      QAR: { symbol: '﷼', name: 'Qatari Riyal', flag: '🇶🇦' },
      KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
      OMR: { symbol: '﷼', name: 'Omani Rial', flag: '🇴🇲' },
      BHD: { symbol: '.د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
      DZD: { symbol: 'د.ج', name: 'Algerian Dinar', flag: '🇩🇿' },
      IQD: { symbol: 'ع.د', name: 'Iraqi Dinar', flag: '🇮🇶' },
      JOD: { symbol: 'د.ا', name: 'Jordanian Dinar', flag: '🇯🇴' },
      LBP: { symbol: 'ل.ل', name: 'Lebanese Pound', flag: '🇱🇧' },
      LYD: { symbol: 'ل.د', name: 'Libyan Dinar', flag: '🇱🇾' },
      MAD: { symbol: 'د.م.', name: 'Moroccan Dirham', flag: '🇲🇦' },
      ILS: { symbol: '₪', name: 'Israeli Shekel', flag: '🇵🇸' },
      SOS: { symbol: 'S', name: 'Somali Shilling', flag: '🇸🇴' },
      SDG: { symbol: 'ج.س.', name: 'Sudanese Pound', flag: '🇸🇩' },
      SYP: { symbol: '£', name: 'Syrian Pound', flag: '🇸🇾' },
      TND: { symbol: 'د.ت', name: 'Tunisian Dinar', flag: '🇹🇳' },
      YER: { symbol: '﷼', name: 'Yemeni Rial', flag: '🇾🇪' },
      MRU: { symbol: 'UM', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
      DJF: { symbol: 'Fdj', name: 'Djiboutian Franc', flag: '🇩🇯' },
      KMF: { symbol: 'CF', name: 'Comorian Franc', flag: '🇰🇲' },
    };

    const currencyRows = Object.entries(totalsByCurrency).map(([curr, amount]) => {
      const info = CURRENCY_DISPLAY[curr] || { symbol: curr, name: curr, flag: '🏳️' };
      return `
        <div class="currency-row">
          <div class="currency-info">
            <span class="currency-flag">${info.flag}</span>
            <span class="currency-name">${info.name}</span>
          </div>
          <div class="currency-amount">${info.symbol} ${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount as number)}</div>
        </div>
      `;
    }).join('');

    // Sort items by date
    const sortedItems = [...ribaItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate date range
    const dateRange = sortedItems.length > 0 
      ? `${sortedItems[0].date} to ${sortedItems[sortedItems.length - 1].date}`
      : 'N/A';
    
    // Calculate total amount across all currencies
    const grandTotal = Object.values(totalsByCurrency).reduce((a: number, b: number) => a + b, 0) as number;
    const averageAmount = sortedItems.length > 0 ? grandTotal / sortedItems.length : 0;

    // Generate transaction rows
    let logRows = '';
    sortedItems.forEach((item: Transaction, index: number) => {
      const info = CURRENCY_DISPLAY[item.currency] || { symbol: item.currency, name: item.currency, flag: '' };
      
      logRows += `
        <tr class="log-row">
          <td class="log-cell" style="width: 40px; color: #94a3b8;">${index + 1}</td>
          <td class="log-cell">${item.date}</td>
          <td class="log-cell">${item.description}</td>
          <td class="log-cell text-right" style="font-family: monospace; font-weight: 600;">${info.symbol} ${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 }).format(item.amount)}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${t('dir') || 'ltr'}">
      <head>
        <title>Purification Certificate - RibaPurify</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
          
          @font-face {
            font-family: 'KFGQPC HAFS';
            src: url('/fonts/KFGQPC-Uthmanic-Script-HAFS.woff2') format('woff2'),
                 url('/fonts/KFGQPC-Uthmanic-Script-HAFS.woff') format('woff'),
                 url('/fonts/KFGQPC-Uthmanic-Script-HAFS.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 0; 
            margin: 0; 
            background: #f1f5f9;
            color: #1e293b;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .page-container {
            width: 100%;
            max-width: 800px;
            margin: 20px;
            padding: 40px;
            background: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            border: 3px solid #1e293b;
            outline: 1px solid #94a3b8;
            outline-offset: -6px;
          }

          .corner {
            position: absolute;
            width: 24px;
            height: 24px;
            border: 1px solid #94a3b8;
            z-index: 5;
          }
          .top-left { top: 12px; left: 12px; border-right: none; border-bottom: none; }
          .top-right { top: 12px; right: 12px; border-left: none; border-bottom: none; }
          .bottom-left { bottom: 12px; left: 12px; border-right: none; border-top: none; }
          .bottom-right { bottom: 12px; right: 12px; border-left: none; border-top: none; }

          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-family: 'Cinzel', serif;
            font-size: 80px;
            font-weight: 700;
            color: rgba(203, 213, 225, 0.15);
            z-index: 50;
            pointer-events: none;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 12px;
            border: 6px solid rgba(203, 213, 225, 0.15);
            padding: 20px 40px;
            border-radius: 16px;
          }

          .content { position: relative; z-index: 10; }

          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 15px;
          }
          .logo-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 16px;
            object-fit: contain;
          }
          .brand-name {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
          }
          h1 {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -1px;
            font-family: serif;
          }

          .ayah-box {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 2px;
            border: 1px solid #e2e8f0;
            position: relative;
          }
          .ayah-box::before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 60px;
            color: #e2e8f0;
            font-family: serif;
          }
          .ayah-arabic {
            font-family: 'KFGQPC HAFS', 'Amiri', serif;
            font-size: 24px;
            color: #059669;
            margin-bottom: 8px;
            line-height: 1.8;
          }
          .ayah-ref {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            font-family: serif;
          }
          .ayah-translation {
            font-size: 13px;
            color: #475569;
            font-style: italic;
            margin-top: 12px;
            line-height: 1.6;
          }

          .summary-box {
            background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
            border: 2px solid #fca5a5;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .summary-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #991b1b;
            margin-bottom: 8px;
            font-weight: 700;
          }
          .summary-amount {
            font-size: 32px;
            font-weight: 700;
            color: #dc2626;
            font-family: monospace;
            margin: 8px 0;
          }
          .summary-meta {
            margin-top: 12px;
            font-size: 13px;
            color: #7f1d1d;
          }

          .section-title {
            font-size: 13px;
            font-weight: 700;
            color: #475569;
            margin: 20px 0 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e2e8f0;
          }

          .log-table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 12px;
            margin-bottom: 20px;
          }
          .log-header { 
            text-align: left; 
            border-bottom: 2px solid #e2e8f0; 
            padding: 10px 8px; 
            color: #64748b; 
            font-weight: 600; 
            text-transform: uppercase; 
            font-size: 10px; 
            letter-spacing: 1px; 
            background: #f8fafc;
          }
          .log-row { 
            border-bottom: 1px solid #f1f5f9; 
          }
          .log-cell { 
            padding: 10px 8px; 
            color: #334155; 
          }
          .text-right { text-align: right; }

          .guidance-box {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 15px;
            margin-bottom: 20px;
          }
          .guidance-title {
            font-weight: 700;
            color: #9a3412;
            margin-bottom: 10px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .guidance-text {
            color: #7c2d12;
            line-height: 1.7;
            font-size: 12px;
          }

          .disclaimer-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .disclaimer-title {
            font-weight: 700;
            color: #475569;
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .disclaimer-text {
            color: #64748b;
            line-height: 1.6;
            font-size: 11px;
          }

          /* Digital seal */
          .digital-seal {
            position: absolute;
            right: 40px;
            bottom: 100px;
            width: 120px;
            height: 120px;
            border: 3px solid rgba(139, 92, 246, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(243, 232, 255, 0.8) 100%);
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
            transform: rotate(-15deg);
            z-index: 10;
          }
          
          .seal-text {
            text-align: center;
            font-weight: bold;
            color: #6b21a8;
            line-height: 1.3;
          }
          
          
          
          .seal-date {
            font-size: 9px;
            font-weight: normal;
          }
          
          .seal-badge {
            font-size: 24px;
            margin-bottom: 5px;
          }
          
          /* Page numbering */
          @page {
            margin: 20mm;
            @bottom-center {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 10px;
              color: #64748b;
            }
          }
          
          .page-number {
            position: fixed;
            bottom: 10px;
            right: 50%;
            transform: translateX(50%);
            font-size: 10px;
            color: #64748b;
          }

          .footer {
            text-align: center;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
            margin-top: 40px;
          }
          .footer-text {
            font-size: 11px;
            color: #64748b;
            line-height: 1.8;
            margin-bottom: 12px;
          }
          .timestamp {
            margin-top: 15px;
            font-size: 11px;
            color: #94a3b8;
            font-weight: 600;
          }

          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            z-index: 1000;
            transition: all 0.2s;
          }
          .print-btn:hover { 
            background: #1d4ed8;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
          }

          @media print {
            body { padding: 0; background: white; }
            .page-container { box-shadow: none; margin: 0; }
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        
        <div class="page-container">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="watermark">PURIFIED</div>
          
          <div class="content">
            <div class="header">
              <img src="${window.location.origin}/favicon.svg" alt="RibaPurify Logo" class="logo-icon" onerror="this.style.display='none'" />
              <div class="brand-name">RibaPurify</div>
              <h1>${t('puri_cert_header')}</h1>
            </div>

            <div class="ayah-box">
              <div class="ayah-arabic"> ۗ يَمْحَقُ ٱللَّهُ ٱلرِّبَوٰا۟ وَيُرْبِى ٱلصَّدَقَـٰتِ</div>
              <div class="ayah-ref">Surah Al-Baqarah (2:276)</div>
              <div class="ayah-translation">"Allah deprives interest of all blessing, whereas He blesses charity with growth."</div>
            </div>

            <div class="summary-box">
              <div class="summary-label">${t('puri_cert_total_riba')}</div>
              <div class="summary-amount">${currencyRows.split('currency-amount')[1]?.match(/>(.*?)</)?.[1] || (Object.values(totalsByCurrency).reduce((a: number, b: number) => a + b, 0) as number).toFixed(2)}</div>
              <div class="summary-meta">${sortedItems.length} ${t('puri_transactions')} ${t('puri_identified_across')} ${Object.keys(totalsByCurrency).length} ${t('puri_currencies')}</div>
            </div>

            <div class="section-title">${t('puri_cert_logs')}</div>
            <table class="log-table">
              <thead>
                <tr>
                  <th class="log-header" style="width: 40px;">#</th>
                  <th class="log-header">${t('puri_cert_date')}</th>
                  <th class="log-header">${t('puri_cert_source')}</th>
                  <th class="log-header text-right">${t('puri_cert_amount')}</th>
                </tr>
              </thead>
              <tbody>
                ${logRows}
              </tbody>
            </table>

            <div class="guidance-box">
              <div class="guidance-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                ${t('puri_cert_guidance_title')}
              </div>
              <div class="guidance-text" style="margin-bottom: 20px;">
                ${t('puri_cert_guidance_text')}
              </div>
              <div class="guidance-steps" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; border-top: 1px dashed #fdba74; padding-top: 15px;">
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">1. ${t('puri_step_1_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_1_desc')}</div>
                </div>
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">2. ${t('puri_step_2_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_2_desc')}</div>
                </div>
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">3. ${t('puri_step_3_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_3_desc')}</div>
                </div>
              </div>
            </div>

            <div class="disclaimer-box">
              <div class="disclaimer-title">${t('puri_cert_disclaimer_label')}</div>
              <div class="disclaimer-text">
                ${t('puri_cert_disclaimer')}
              </div>
            </div>

            

            <div class="footer">
              <div class="footer-text">
                <strong>${t('puri_cert_confirmation')}</strong><br><br>
                ${t('puri_cert_privacy')}<br>
                <strong>${t('puri_cert_id')}:</strong> ${certificateId}
              </div>
              <div class="timestamp">${t('puri_cert_generated')}: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div class="page-number">Page 1</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // If we have transactions and processing is complete, show Results View
  if (processingState === 'complete' && transactions.length > 0) {
    const currency = transactions[0]?.currency || 'USD';
    const ribaTransactions = transactions.filter((t: Transaction) => t.isRiba);
    
    // Calculate totals by currency
    const totalsByCurrency = ribaTransactions.reduce((acc: Record<string, number>, txn: Transaction) => {
      acc[txn.currency] = (acc[txn.currency] || 0) + txn.amount;
      return acc;
    }, {});
    
    const currenciesDetected = Object.keys(totalsByCurrency);
    const isMultiCurrency = currenciesDetected.length > 1;
    
    return (
      <div className="max-w-7xl mx-auto py-4 md:py-8 px-4 pb-24 md:pb-8"> {/* Added pb-24 for mobile nav space */}
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-end gap-3 mb-6">
          <button 
            onClick={generatePDFCertificate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Printer size={16} />
            {t('export_certificate_pdf')}
          </button>
          <button 
            onClick={() => { setFiles([]); onReset(); }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            <RotateCcw size={16} />
            {t('dash_reset_btn')}
          </button>
        </div>

        {/* Pro Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Total Riba Card - Multi-Currency Support */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <AlertTriangle size={80} className="text-red-600" />
            </div>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-1">{t('total_riba')}</p>
            
            {isMultiCurrency ? (
              <div className="space-y-2">
                {Object.entries(totalsByCurrency).map(([curr, amt]) => (
                  <div key={curr} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">{curr}</span>
                    <h3 className="text-2xl font-mono font-bold text-red-600 tracking-tight">
                      {formatCurrency(amt as number, curr as Currency)}
                    </h3>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-red-100">
                  <p className="text-xs text-slate-400">
                    💡 {currenciesDetected.length} currencies detected
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-mono font-bold text-red-600 tracking-tight">
                  {formatCurrency(totalRiba, currency)}
                </h2>
                <p className="text-xs text-slate-400 mt-2">Detected across {ribaTransactions.length} transactions</p>
              </>
            )}
          </div>

          {/* Purity Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Shield size={80} className="text-emerald-600" />
             </div>
             <p className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-1">{t('financial_purity_score')}</p>
             <div className="flex items-end gap-2">
               <h2 className="text-3xl md:text-4xl font-mono font-bold text-slate-800 tracking-tight">
                 {purityScore}%
               </h2>
               <span className="text-sm text-slate-400 mb-1.5">Halal Volume</span>
             </div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
               <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${purityScore}%` }} />
             </div>
          </div>

          {/* Top Sources (Simplified) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-3">{t('riba_sources')}</h3>
             <div className="space-y-2">
               {topSources.map(([name, amount], i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                   <span className="font-medium text-slate-700 truncate max-w-[120px]">{name}</span>
                   <span className="text-red-600 font-mono">
                     {formatCurrency(amount, currency)}
                   </span>
                 </div>
               ))}
               {topSources.length === 0 && <p className="text-slate-400 italic text-sm">{t('dash_none_detected')}</p>}
             </div>
          </div>
        </div>

        {/* Verif Log Accordion (Mobile) */}
        <VerifLogAccordion 
          transactions={transactions} 
          isOpen={showVerifLog} 
          onToggle={() => setShowVerifLog(!showVerifLog)} 
          formatCurrency={formatCurrency}
          t={t}
        />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Transaction List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
              {/* Pagination Controls */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                 <div className="flex items-center gap-2">
                   <span className="text-sm text-slate-500 hidden md:inline">Show</span>
                   <select 
                      className="bg-white border border-slate-200 rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                   >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                   </select>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors will-change-transform"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                      {currentPage} / {totalPages}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                 </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{t('confidence')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentTransactions.map((tObj: Transaction) => (
                      <tr key={tObj.id} className={`hover:bg-slate-50 transition-colors will-change-auto ${tObj.isRiba ? 'bg-red-50/30' : ''}`} style={{contain: 'layout style'}}>
                        <td className="p-4 text-sm text-slate-600 font-mono whitespace-nowrap">{tObj.date}</td>
                        <td className="p-4 text-sm text-slate-800 font-medium">
                          {tObj.description}
                          {tObj.reason && tObj.isRiba && (
                            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <Info size={10} /> {tObj.reason}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-sm font-mono text-right font-bold text-slate-700">
                          {formatCurrency(tObj.amount, tObj.currency)}
                        </td>
                        <td className="p-4 text-center">
                          {tObj.isRiba ? (
                              <span 
                                onClick={() => onToggleStatus(tObj.id)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition-colors"
                              >
                                {t('action_riba')}
                              </span>
                          ) : (
                              <span 
                                onClick={() => onToggleStatus(tObj.id)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 cursor-pointer hover:bg-emerald-200 transition-colors"
                              >
                                {t('action_halal')}
                              </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                            <span className={`text-xs font-bold ${
                              tObj.confidence === 'high' ? 'text-green-600' : 
                              tObj.confidence === 'medium' ? 'text-yellow-600' : 'text-slate-400'
                            }`}>
                              {tObj.confidence.toUpperCase()}
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden p-4 bg-slate-50 min-h-[400px]">
                {currentTransactions.map((tObj: Transaction) => (
                  <MobileTransactionCard 
                    key={tObj.id} 
                    tObj={tObj} 
                    onToggleStatus={onToggleStatus} 
                    formatCurrency={formatCurrency}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Verification Log Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                 <h3 className="font-bold flex items-center gap-2">
                   <List size={18} />
                   {t('verif_log')}
                 </h3>
                 <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">{ribaTransactions.length}</span>
              </div>
              <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
                {ribaTransactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm italic">
                    {t('dash_none_detected')}
                  </div>
                ) : (
                  ribaTransactions.map((t: Transaction, idx: number) => (
                    <div key={idx} className="p-3 hover:bg-red-50 transition-colors flex justify-between items-start group">
                      <div>
                        <p className="text-xs font-mono font-bold text-slate-700">{t.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-red-600 font-mono">
                           {formatCurrency(t.amount, t.currency)}
                         </p>
                         <p className="text-[10px] text-slate-400 truncate max-w-[100px] ml-auto">
                           {t.description.substring(0, 15)}...
                         </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Donate Section */}
        <div id="donate-section" className="mt-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl shadow-lg border border-orange-200 p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('donate_here')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              <strong>{t('donate_remove_immediately')}</strong> {t('donate_here_desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Islamic Relief Worldwide', url: 'https://www.islamic-relief.org', region: t('donate_region_global'), color: 'blue' },
              { name: 'Penny Appeal', url: 'https://www.pennyappeal.org', region: t('donate_region_uk_global'), color: 'green' },
              { name: 'Human Appeal', url: 'https://humanappeal.org.uk', region: t('donate_region_uk_global'), color: 'purple' },
              { name: 'Zakat Foundation', url: 'https://www.zakat.org', region: t('donate_region_usa_global'), color: 'emerald' },
              { name: 'UNHCR', url: 'https://www.unhcr.org', region: t('donate_region_global'), color: 'cyan' },
              { name: 'Local Masjid / Community', url: '#', region: t('donate_region_your_area'), color: 'amber' }
            ].map((org, i) => (
              <a
                key={i}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-white hover:bg-gradient-to-br rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                onClick={org.url === '#' ? (e) => e.preventDefault() : undefined}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-slate-800 transition-colors">
                    {org.name}
                  </h3>
                  <ExternalLink className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </div>
                <p className="text-sm text-slate-600">{org.region}</p>
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-orange-200">
            <p className="text-center text-sm text-slate-600 max-w-2xl mx-auto">
              <strong>Important:</strong> Do not intend Sawab (reward) when disposing of this amount. 
              It can also be given to public works (roads, hospitals, schools) or those in dire need.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // File Selection View
  if (files.length > 0 && processingState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 pb-24 md:pb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <FileText className="text-blue-600" />
          {t('dash_selected')} {files.length}
        </h2>
        <div className="grid gap-4 mb-8">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="text-slate-700 font-medium truncate">{f.name}</span>
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500">
                <XCircle size={20} />
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={() => onProcess(files)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          {t('dash_process_btn')}
        </button>
      </div>
    );
  }

  // Processing View
  if (processingState === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw size={48} className="text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-800">{t('status_processing')}</h2>
        <p className="text-slate-500 mt-2">{t('dash_processing_sub')}</p>
      </div>
    );
  }

  // Error View
  if (processingState === 'error') {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('status_error')}</h2>
        <p className="text-slate-500 max-w-md mb-8">Make sure you are uploading a standard bank statement PDF or a clear image.</p>
        <button 
          onClick={() => { setFiles([]); onReset(); }}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      </div>
     );
  }

  // Landing / Hero View
  return (
    <div className="max-w-4xl mx-auto text-center py-20 px-4 pb-24 md:pb-20">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
        {t('hero_title')}
      </h1>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        {t('hero_desc')}
      </p>
      
      {/* Mobile: Compact Summary or Scan Prompt */}
      <div className="md:hidden mb-8">
        <div 
          onClick={onUploadClick}
          className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <div className="bg-white p-3 rounded-full shadow-sm">
            <Upload size={24} className="text-blue-600" />
          </div>
          <p className="font-bold text-blue-700">Tap to Scan Statement</p>
        </div>
      </div>

      {/* Desktop: Large Drop Zone */}
      <div 
        className={`
          hidden md:block relative group cursor-pointer border-3 border-dashed rounded-3xl p-8 md:p-16 transition-all duration-300
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-102 ring-4 ring-blue-100' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={onUploadClick}
        role="button"
        tabIndex={0}
        aria-label={t('upload_btn') || 'Upload bank statement'}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onUploadClick(); } }} /* PRIORITY 2 FIXED: Keyboard nav + ARIA */
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`p-6 rounded-full bg-white shadow-lg transition-transform duration-500 ${isDragging ? 'scale-110 rotate-12' : 'group-hover:scale-110'}`}>
            <Upload size={48} className="text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">
              {isDragging ? t('drop_text') : t('upload_btn')}
            </h3>
            <p className="text-slate-500">{t('hero_subtitle')}</p>
          </div>
        </div>
      </div>
      
      {/* Methodology Teaser */}
      <div className="text-center mt-8 mb-12">
         <p className="text-slate-600 mb-2">{t('meth_landing_teaser')}</p>
         <button onClick={() => navigateToView('methodology')} className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
           {t('nav_meth')} <ArrowRight size={16} />
         </button>
      </div>

      {/* FAQ Section on Landing */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-slate-900 mb-10 text-center">{t('faq_title')}</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800 text-lg">{t(`faq_${i}_q`)}</span>
                {openFaq === i ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {t(`faq_${i}_ans`)}
                </div>
              )}
            </div>
          ))}

          {/* Future Plans Special FAQ */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden transition-all duration-200">
            <button
              onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-pink-50/20 transition-colors"
            >
              <span className="font-semibold text-slate-900 text-lg flex items-center gap-3">
                <Heart className="text-pink-500 fill-pink-500" size={24} />
                {t('faq_future_q')}
              </span>
               {openFaq === 4 ? <ChevronDown className="text-pink-400" /> : <ChevronRight className="text-pink-400" />}
            </button>
            {openFaq === 4 && (
              <div className="px-6 pb-6 text-slate-700 leading-relaxed italic border-t border-pink-100 pt-4 bg-pink-50/10">
                "{t('faq_future_ans')}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Methodology View
const MethodologyView = ({ t, userProfile }: any) => {
  // Ensure userProfile is safe to use
  const profile = userProfile || { fatwaSource: 'global' };

  const getFatwaNote = () => {
    switch (profile.fatwaSource) {
      case 'ecfr':
        return t('meth_note_ecfr');
      case 'amja':
        return t('meth_note_amja');
      default:
        return t('meth_note_global');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 pb-24 md:pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('meth_title')}</h1>
        <div 
          className="text-xl text-slate-600 max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(t('meth_intro').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')) /* PRIORITY 1 FIXED */
          }}
        />
      </div>

      {/* Process Steps */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover-card">
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">{t('meth_step_1')}</h3>
          <p className="text-slate-600 leading-relaxed">{t('meth_step_1_desc')}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover-card">
          <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
            <Filter size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">{t('meth_step_2')}</h3>
          <p className="text-slate-600 leading-relaxed">{t('meth_step_2_desc')}</p>
        </div>
      </div>

      {/* Spectrum of Riba */}
      <div className="bg-slate-50 rounded-3xl p-6 md:p-12 border border-slate-200 mb-16">
         <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('meth_spectrum_title')}</h3>
         <div className="grid md:grid-cols-3 gap-6">
           <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
             <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2"><XCircle size={18}/> {t('meth_haram_title')}</h4>
             <ul className="text-sm text-red-900/80 space-y-2 list-disc list-inside methodology-list">
               {t('meth_haram_items').split(',').map((item:string, i:number) => <li key={i}>{item.trim()}</li>)}
             </ul>
           </div>
           <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl">
             <h4 className="font-bold text-yellow-700 mb-2 flex items-center gap-2"><HelpCircle size={18}/> {t('meth_shubhah_title')}</h4>
             <ul className="text-sm text-yellow-900/80 space-y-2 list-disc list-inside methodology-list">
               {t('meth_shubhah_items').split(',').map((item:string, i:number) => <li key={i}>{item.trim()}</li>)}
             </ul>
           </div>
           <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
             <h4 className="font-bold text-emerald-700 mb-2 flex items-center gap-2"><CheckCircle size={18}/> {t('meth_halal_title')}</h4>
             <ul className="text-sm text-emerald-900/80 space-y-2 list-disc list-inside methodology-list">
               {t('meth_halal_items').split(',').map((item:string, i:number) => <li key={i}>{item.trim()}</li>)}
             </ul>
           </div>
         </div>
      </div>

      {/* Deep Dive & Edge Cases */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('meth_deep_title')}</h3>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><BookOpen size={18} className="text-blue-500"/> {t('meth_fatwa_section')}</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{t('meth_fatwa_text')}</p>
            
            {/* Dynamic Note */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">{t('meth_active_ruling')}</span>
              <p className="text-sm text-blue-800">{getFatwaNote()}</p>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <CheckCircle size={12} className="mr-1" /> {t('meth_badge_ecfr')}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <CheckCircle size={12} className="mr-1" /> {t('meth_badge_amja')}
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><PieChart size={18} className="text-blue-500"/> {t('meth_disposal_section')}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{t('meth_disposal_text')}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-orange-500"/> {t('meth_edge_section')}</h4>
             <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-700 text-sm mb-1">{t('meth_edge_title_cashback')}</p>
                  <p className="text-xs text-slate-500">{t('meth_edge_cashback')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-700 text-sm mb-1">{t('meth_edge_title_rewards')}</p>
                  <p className="text-xs text-slate-500">{t('meth_edge_rewards')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-700 text-sm mb-1">{t('meth_edge_title_crypto')}</p>
                  <p className="text-xs text-slate-500">{t('meth_edge_crypto')}</p>
                </div>
             </div>
          </div>
          
          {/* External Resources */}
          <div className="pt-12 border-t border-slate-100 mt-12">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">{t('meth_resources_title')}</h4>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <a href="https://aaoifi.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <BookOpen size={20} className="text-blue-600" />
                 </div>
                 <span className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">AAOIFI</span>
                 <span className="text-xs text-slate-500 text-center">Global Islamic Finance Standards</span>
                 <div className="flex items-center gap-1 mt-3 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Visit Site <ExternalLink size={10}/>
                 </div>
               </a>

               <a href="https://www.amjaonline.org" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Globe size={20} className="text-blue-600" />
                 </div>
                 <span className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">AMJA</span>
                 <span className="text-xs text-slate-500 text-center">American Muslim Jurists</span>
                 <div className="flex items-center gap-1 mt-3 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Visit Site <ExternalLink size={10}/>
                 </div>
               </a>

               <a href="https://www.e-c-f-r.org" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Users size={20} className="text-blue-600" />
                 </div>
                 <span className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">ECFR</span>
                 <span className="text-xs text-slate-500 text-center">European Council for Fatwa</span>
                 <div className="flex items-center gap-1 mt-3 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Visit Site <ExternalLink size={10}/>
                 </div>
               </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Manifesto View
const ManifestoView = ({ t }: any) => (
  <div className="max-w-5xl mx-auto py-16 px-4 pb-24 md:pb-16">
    {/* Hero */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
        <Heart size={12} className="fill-current" /> Our Mission
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
        {t('man_title')}
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        {t('man_subtitle')}
      </p>
    </div>

    {/* Problem / Solution Split */}
    <div className="grid md:grid-cols-2 gap-8 mb-24">
      <div className="bg-red-50/50 p-6 md:p-10 rounded-3xl border border-red-100 hover:border-red-200 transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <XCircle size={120} className="text-red-500" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
            <XCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('man_prob')}</h3>
          <p className="text-lg text-slate-700 leading-relaxed">{t('man_prob_desc')}</p>
        </div>
      </div>

      <div className="bg-emerald-50/50 p-6 md:p-10 rounded-3xl border border-emerald-100 hover:border-emerald-200 transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <CheckCircle size={120} className="text-emerald-500" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('man_sol')}</h3>
          <p className="text-lg text-slate-700 leading-relaxed">{t('man_sol_desc')}</p>
        </div>
      </div>
    </div>

    {/* Core Values Grid */}
    <div className="mb-24">
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{t('man_values_title')}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: t('man_val_1'), desc: t('man_val_1_d'), color: 'blue' },
          { icon: FileText, title: t('man_val_2'), desc: t('man_val_2_d'), color: 'purple' },
          { icon: Heart, title: t('man_val_3'), desc: t('man_val_3_d'), color: 'pink' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover-card text-center">
            <div className={`w-14 h-14 mx-auto bg-${item.color}-50 rounded-2xl flex items-center justify-center text-${item.color}-600 mb-6`}>
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Privacy Architecture Highlight */}
    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
      {/* Abstract Background - disabled on mobile for performance */}
      <div className="absolute inset-0 opacity-20 hidden md:block">
         <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_60%)] animate-spin-slow" />
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <Shield size={64} className="mx-auto text-blue-400 mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('arch_privacy')}</h2>
        <p className="text-xl text-slate-300 leading-relaxed mb-8">
          {t('arch_privacy_desc')}
        </p>
        <div className="inline-flex gap-4 items-center justify-center text-sm font-mono text-blue-300 bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700">
           <span>No Servers</span>
           <span>•</span>
           <span>No Analytics</span>
           <span>•</span>
           <span>Open Source</span>
        </div>
      </div>
    </div>
  </div>
);

// 5. Purification View
const PurificationView = ({ history, onClearHistory, t, setActiveView, setHistory, transactions, onUpload }: any) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'disposed'>('pending');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const pendingItems = history.filter((r: PurificationRecord) => r.status === 'pending' || !r.status);
  const disposedItems = history.filter((r: PurificationRecord) => r.status === 'disposed');

  const totalPending = pendingItems.reduce((acc: number, r: PurificationRecord) => acc + r.amount, 0);
  const totalDisposed = disposedItems.reduce((acc: number, r: PurificationRecord) => acc + r.amount, 0);

  const handleMarkDisposed = (id: string) => {
    // In a real app, we would update the state in App.tsx, but here we might need to pass a setter or dispatch
    // Assuming setHistory is passed or we can't update it easily without it.
    // Let's assume setHistory is passed as a prop now.
    if (setHistory) {
      setHistory((prev: PurificationRecord[]) => prev.map(r => r.id === id ? { ...r, status: 'disposed' } : r));
    }
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const certificateId = `PURI-${Date.now()}`;

    // Calculate Totals by Currency
    const totalsByCurrency = disposedItems.reduce((acc: Record<string, number>, item: PurificationRecord) => {
      acc[item.currency] = (acc[item.currency] || 0) + item.amount;
      return acc;
    }, {});

    const CURRENCY_DISPLAY: Record<string, { symbol: string; name: string; flag: string }> = {
      USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
      GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
      EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
      INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
      SAR: { symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
      AED: { symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
      MYR: { symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
      IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
      CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
      AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
      JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
      CNY: { symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
      CHF: { symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
      SGD: { symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
      HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
      NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
      KRW: { symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
      TRY: { symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
      BRL: { symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
      RUB: { symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
      ZAR: { symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
      PKR: { symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
      BDT: { symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
      EGP: { symbol: '£', name: 'Egyptian Pound', flag: '🇪🇬' },
      QAR: { symbol: '﷼', name: 'Qatari Riyal', flag: '🇶🇦' },
      KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
      OMR: { symbol: '﷼', name: 'Omani Rial', flag: '🇴🇲' },
      BHD: { symbol: '.د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
      DZD: { symbol: 'د.ج', name: 'Algerian Dinar', flag: '🇩🇿' },
      IQD: { symbol: 'ع.د', name: 'Iraqi Dinar', flag: '🇮🇶' },
      JOD: { symbol: 'د.ا', name: 'Jordanian Dinar', flag: '🇯🇴' },
      LBP: { symbol: 'ل.ل', name: 'Lebanese Pound', flag: '🇱🇧' },
      LYD: { symbol: 'ل.د', name: 'Libyan Dinar', flag: '🇱🇾' },
      MAD: { symbol: 'د.م.', name: 'Moroccan Dirham', flag: '🇲🇦' },
      ILS: { symbol: '₪', name: 'Israeli Shekel', flag: '🇵🇸' }, // Used in Palestine
      SOS: { symbol: 'S', name: 'Somali Shilling', flag: '🇸🇴' },
      SDG: { symbol: 'ج.س.', name: 'Sudanese Pound', flag: '🇸🇩' },
      SYP: { symbol: '£', name: 'Syrian Pound', flag: '🇸🇾' },
      TND: { symbol: 'د.ت', name: 'Tunisian Dinar', flag: '🇹🇳' },
      YER: { symbol: '﷼', name: 'Yemeni Rial', flag: '🇾🇪' },
      MRU: { symbol: 'UM', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
      DJF: { symbol: 'Fdj', name: 'Djiboutian Franc', flag: '🇩🇯' },
      KMF: { symbol: 'CF', name: 'Comorian Franc', flag: '🇰🇲' },
    };

    const currencyRows = Object.entries(totalsByCurrency).map(([curr, amount]) => {
      const info = CURRENCY_DISPLAY[curr] || { symbol: curr, name: curr, flag: '🏳️' };
      return `
        <div class="currency-row">
          <div class="currency-info">
            <span class="currency-flag">${info.flag}</span>
            <span class="currency-name">${info.name}</span>
          </div>
          <div class="currency-amount">${info.symbol} ${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount as number)}</div>
        </div>
      `;
    }).join('');

    // Sort items by date
    const sortedItems = [...disposedItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Generate rows with gap detection
    let logRows = '';
    const GAP_THRESHOLD = 40 * 24 * 60 * 60 * 1000; // 40 days in ms

    sortedItems.forEach((item: PurificationRecord, index: number) => {
      const info = CURRENCY_DISPLAY[item.currency] || { symbol: item.currency, name: item.currency, flag: '' };
      
      // Check for gap
      if (index > 0) {
        const prevDate = new Date(sortedItems[index - 1].date).getTime();
        const currDate = new Date(item.date).getTime();
        if (currDate - prevDate > GAP_THRESHOLD) {
           logRows += `
             <tr class="log-row gap-row">
               <td colspan="4" class="gap-cell">
                 <div class="gap-indicator">
                   <span>⚠️ ${t('puri_cert_gap_detected')} ${new Date(prevDate).toLocaleDateString()} - ${new Date(currDate).toLocaleDateString()}</span>
                 </div>
               </td>
             </tr>
           `;
        }
      }

      logRows += `
        <tr class="log-row">
          <td class="log-cell" style="width: 40px; color: #94a3b8;">${index + 1}</td>
          <td class="log-cell">${new Date(item.date).toLocaleDateString()}</td>
          <td class="log-cell">${item.statementName || 'Manual Entry'}</td>
          <td class="log-cell text-right" style="font-family: monospace; font-weight: 600;">${info.symbol} ${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 }).format(item.amount)}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${t('dir') || 'ltr'}">
      <head>
        <title>Purification Certificate</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
          
          @font-face {
            font-family: 'KFGQPC HAFS';
            src: url('/fonts/KFGQPC-Uthmanic-Script-HAFS.woff2') format('woff2'),
                 url('/fonts/KFGQPC-Uthmanic-Script-HAFS.woff') format('woff'),
                 url('/fonts/KFGQPC-Uthmanic-Script-HAFS.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 0; 
            margin: 0; 
            background: #f1f5f9;
            color: #1e293b;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .page-container {
            width: 100%;
            max-width: 800px;
            margin: 40px;
            padding: 60px;
            background: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            
            /* Professional Double Border - Thinner */
            border: 3px solid #1e293b;
            outline: 1px solid #94a3b8;
            outline-offset: -6px;
          }

          /* Corner Accents */
          .corner {
            position: absolute;
            width: 24px;
            height: 24px;
            border: 1px solid #94a3b8;
            z-index: 5;
          }
          .top-left { top: 12px; left: 12px; border-right: none; border-bottom: none; }
          .top-right { top: 12px; right: 12px; border-left: none; border-bottom: none; }
          .bottom-left { bottom: 12px; left: 12px; border-right: none; border-top: none; }
          .bottom-right { bottom: 12px; right: 12px; border-left: none; border-top: none; }

          /* Watermark - Updated */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-family: 'Cinzel', serif;
            font-size: 80px;
            font-weight: 700;
            color: rgba(203, 213, 225, 0.15);
            z-index: 50; /* On top of content */
            pointer-events: none;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 12px;
            border: 6px solid rgba(203, 213, 225, 0.15);
            padding: 20px 40px;
            border-radius: 16px;
          }

          .content {
            position: relative;
            z-index: 10;
          }

          /* Header */
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
          }
          .logo-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 16px;
            object-fit: contain;
          }
          .brand-name {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
          }
          h1 {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -1px;
            font-family: serif;
          }

          /* Ayah Section */
          .ayah-box {
            text-align: center;
            margin: 30px 0;
            padding: 30px;
            background: #f8fafc;
            border-radius: 2px;
            border: 1px solid #e2e8f0;
            position: relative;
          }
          .ayah-box::before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 60px;
            color: #e2e8f0;
            font-family: serif;
          }
          .ayah-arabic {
            font-family: 'KFGQPC HAFS', 'Amiri', serif;
            font-size: 32px;
            color: #059669;
            margin-bottom: 12px;
            line-height: 2.2;
          }
          .ayah-ref {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            font-family: serif;
          }

          /* Summary Grid */
          .summary-section {
            margin-bottom: 30px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .summary-card {
            padding: 20px;
            border: 1px solid #e2e8f0;
            background: white;
          }
          .summary-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .summary-value {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
          }
          
          /* Currency List */
          .currency-list {
            background: #fef2f2;
            border: 1px solid #fee2e2;
            padding: 20px;
            margin-bottom: 20px;
          }
          .currency-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dashed #fecaca;
          }
          .currency-row:last-child { border-bottom: none; }
          .currency-info { display: flex; align-items: center; gap: 10px; }
          .currency-flag { font-size: 18px; }
          .currency-name { font-weight: 600; color: #7f1d1d; font-size: 14px; }
          .currency-amount { font-family: monospace; font-size: 18px; font-weight: 700; color: #dc2626; }

          /* Logs Table */
          .logs-section {
            margin-bottom: 30px;
          }
          .log-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .log-header { text-align: left; border-bottom: 2px solid #e2e8f0; padding: 8px; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
          .log-row { border-bottom: 1px solid #f1f5f9; }
          .gap-row { background: #fff1f2; }
          .gap-cell { padding: 12px; text-align: center; }
          .gap-indicator { 
            display: inline-block; 
            padding: 4px 12px; 
            background: #fee2e2; 
            color: #991b1b; 
            border-radius: 20px; 
            font-size: 10px; 
            font-weight: 700; 
            border: 1px solid #fecaca;
          }
          .log-cell { padding: 8px; color: #334155; }
          .text-right { text-align: right; }

          /* Guidance Section */
          .guidance-box {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 20px;
            margin-bottom: 30px;
          }
          .guidance-title {
            font-weight: 700;
            color: #9a3412;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
          }
          .guidance-text {
            font-size: 12px;
            line-height: 1.6;
            color: #7c2d12;
            text-align: justify;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
            margin-top: 40px;
          }
          .footer-text {
            font-size: 11px;
            color: #64748b;
            line-height: 1.8;
            margin-bottom: 12px;
          }
          .timestamp {
            margin-top: 15px;
            font-size: 11px;
            color: #94a3b8;
            font-weight: 600;
          }
          .page-number {
            position: fixed;
            bottom: 10px;
            right: 50%;
            transform: translateX(50%);
            font-size: 10px;
            color: #64748b;
          }

          @media print {
            body { background: white; display: block; }
            .page-container { 
              box-shadow: none; 
              margin: 0; 
              width: 100%; 
              max-width: none; 
              border: 2px solid #1e293b; /* Thinner border for print */
              padding: 30px;
            }
            .watermark { opacity: 0.1; }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          
          <div class="watermark">RibaPurify</div>
          
          <div class="content">
            <div class="header">
              <img src="${window.location.origin}/favicon.svg" alt="RibaPurify Logo" class="logo-icon" />
              <div class="brand-name">RibaPurify</div>
              <h1>${t('puri_cert_header')}</h1>
            </div>

            <div class="ayah-box">
              <div class="ayah-arabic">يَمْحَقُ اللَّهُ الرِّبَا وَيُرْبِي الصَّدَقَاتِ</div>
              <div class="ayah-ref">Surah Al-Baqarah (2:276)</div>
              <div class="ayah-translation">"Allah destroys interest and gives increase for charities."</div>
            </div>

            <div class="summary-section">
              <div class="currency-list">
                <div class="summary-label" style="color: #7f1d1d; margin-bottom: 15px;">${t('puri_cert_total_riba')}</div>
                ${currencyRows}
                
                <div class="summary-label" style="color: #7f1d1d; margin-bottom: 15px; margin-top: 20px; border-top: 1px dashed #fecaca; padding-top: 15px;">${t('puri_cert_total_amount')}</div>
                ${currencyRows}
              </div>
            </div>

            <div class="logs-section">
              <div class="summary-label" style="margin-bottom: 10px;">${t('puri_cert_logs')}</div>
              <table class="log-table">
                <thead>
                  <tr>
                    <th class="log-header">#</th>
                    <th class="log-header">${t('puri_cert_date')}</th>
                    <th class="log-header">${t('puri_cert_source')}</th>
                    <th class="log-header text-right">${t('puri_cert_amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${logRows}
                </tbody>
              </table>
            </div>

            <div class="guidance-box">
              <div class="guidance-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                ${t('puri_cert_guidance_title')}
              </div>
              <div class="guidance-text" style="margin-bottom: 20px;">
                ${t('puri_cert_guidance_text')}
              </div>
              <div class="guidance-steps" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; border-top: 1px dashed #fdba74; padding-top: 15px;">
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">1. ${t('puri_step_1_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_1_desc')}</div>
                </div>
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">2. ${t('puri_step_2_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_2_desc')}</div>
                </div>
                <div class="step">
                  <div class="step-title" style="font-weight: 700; color: #9a3412; font-size: 11px; margin-bottom: 6px; text-transform: uppercase;">3. ${t('puri_step_3_title')}</div>
                  <div class="step-desc" style="font-size: 10px; color: #7c2d12; line-height: 1.4;">${t('puri_step_3_desc')}</div>
                </div>
              </div>
            </div>

            <div class="disclaimer-box">
              <div class="disclaimer-title">${t('puri_cert_disclaimer_label')}</div>
              <div class="disclaimer-text">
                ${t('puri_cert_disclaimer')}
              </div>
            </div>

            

            <div class="footer">
              <div class="footer-text">
                <strong>${t('puri_cert_confirmation')}</strong><br><br>
                ${t('puri_cert_privacy')}<br>
                <strong>${t('puri_cert_id')}:</strong> ${certificateId}
              </div>
              <div class="timestamp">${t('puri_cert_generated')}: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div class="page-number">Page 1</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = () => { setTimeout(() => window.print(), 500); };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('nav_puri')}</h1>
          <p className="text-slate-500 mt-1">{t('puri_subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrintCertificate}
            disabled={disposedItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={18} /> {t('puri_btn_export')}
          </button>
        </div>
      </div>

      {/* Du'a Card - Moved to Top */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart size={120} className="text-emerald-600" />
        </div>
        <div className="relative z-10 text-center">
          <h3 className="text-emerald-800 font-bold mb-4">{t('puri_dua_title')}</h3>
          <p className="text-2xl md:text-3xl font-arabic leading-loose text-emerald-900 mb-4">
            {t('puri_dua_arabic')}
          </p>
          <p className="text-emerald-700 italic">"{t('puri_dua_trans')}"</p>
        </div>
      </div>

      {/* Guidance Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs">1</span>
                {t('puri_step_1_title')}
            </div>
            <p className="text-xs text-orange-900 leading-relaxed">
                {t('puri_step_1_desc')}
            </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs">2</span>
                {t('puri_step_2_title')}
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
                {t('puri_step_2_desc')}
            </p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-xs">3</span>
                {t('puri_step_3_title')}
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
                {t('puri_step_3_desc')}
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === 'pending' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('puri_tab_pending')}
          {pendingItems.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
              {pendingItems.length}
            </span>
          )}
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
        <button
          onClick={() => setActiveTab('disposed')}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === 'disposed' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('puri_tab_disposed')}
          {activeTab === 'disposed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-6">
          {/* Upload New Statement Box - Inside Pending */}
          <div 
            onClick={() => {
                if (onUpload) {
                    if (setActiveView) setActiveView('dashboard');
                } else if (setActiveView) {
                    setActiveView('dashboard');
                }
            }}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-700 group-hover:text-blue-700">{t('puri_analyze_new')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('puri_analyze_desc')}</p>
          </div>

          {/* Pending List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{t('puri_pending_items')}</h3>
              <span className="font-mono font-bold text-red-600 text-lg">
                {t('puri_total_interest')}: {totalPending.toLocaleString()} USD
              </span>
            </div>
            {pendingItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
                <p>{t('puri_all_caught_up')}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pendingItems.map((record: PurificationRecord) => (
                  <div key={record.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800">{record.statementName}</p>
                        {record.notes && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{record.notes}</span>}
                      </div>
                      <p className="text-sm text-slate-500 font-mono">{record.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-red-600 text-lg">
                        {record.amount.toFixed(2)} {record.currency}
                      </span>
                      <button
                        onClick={() => handleMarkDisposed(record.id)}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        {t('puri_btn_dispose')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upload New Statement Box - Inside Disposed */}
          <div 
            onClick={() => {
                if (onUpload) {
                    if (setActiveView) setActiveView('dashboard');
                } else if (setActiveView) {
                    setActiveView('dashboard');
                }
            }}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-700 group-hover:text-blue-700">{t('puri_analyze_new')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('puri_analyze_desc')}</p>
          </div>

          {/* Disposed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t('puri_total_purified')}</p>
              <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">{totalDisposed.toLocaleString()} USD</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t('puri_transactions')}</p>
              <p className="text-2xl font-mono font-bold text-slate-800 mt-1">{disposedItems.length}</p>
            </div>
          </div>

          {/* Disposed List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{t('puri_tab_disposed')}</h3>
              {disposedItems.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} /> {t('puri_clear')}
                </button>
              )}
            </div>
            {disposedItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p>{t('puri_no_disposed')}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {disposedItems.map((record: PurificationRecord) => (
                  <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors opacity-75">
                    <div>
                      <p className="font-medium text-slate-800 line-through decoration-slate-400">{record.statementName}</p>
                      <p className="text-sm text-slate-500 font-mono">{record.date}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 flex items-center gap-2">
                      <CheckCircle size={14} />
                      {record.amount.toFixed(2)} {record.currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('puri_clear')}?</h3>
              <p className="text-slate-500 mb-6">
                {t('puri_clear_confirm')}
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  {t('puri_cancel_btn')}
                </button>
                <button 
                  onClick={() => { onClearHistory(); setShowClearConfirm(false); }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  {t('puri_clear_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Donate Section */}
      <div className="mt-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl shadow-lg border border-orange-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('donate_here')}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            <strong>{t('donate_remove_immediately')}</strong> {t('donate_here_desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            { name: 'Islamic Relief Worldwide', url: 'https://www.islamic-relief.org', region: t('donate_region_global') },
            { name: 'Penny Appeal', url: 'https://www.pennyappeal.org', region: t('donate_region_uk_global') },
            { name: 'Human Appeal', url: 'https://humanappeal.org', region: t('donate_region_uk_global') },
            { name: 'Zakat Foundation', url: 'https://www.zakat.org', region: t('donate_region_usa_global') },
            { name: 'UNHCR', url: 'https://www.unhcr.org', region: t('donate_region_global') },
            { name: 'Local Masjid / Community', url: '#', region: t('donate_region_your_area') }
          ].map((org, i) => (
            <a
              key={i}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white hover:bg-gradient-to-br rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={org.url === '#' ? (e) => e.preventDefault() : undefined}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-slate-800 transition-colors">
                  {org.name}
                </h3>
                <ExternalLink className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
              <p className="text-sm text-slate-600">{org.region}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-orange-200">
          <p className="text-center text-sm text-slate-600 max-w-2xl mx-auto">
            <strong>Important:</strong> Do not intend Sawab (reward) when disposing of this amount. 
            It can also be given to public works (roads, hospitals, schools) or those in dire need.
          </p>
        </div>
      </div>
    </div>
  );
};

// 6. Donate View
const DonateView = ({ t, totalRiba, currency }: any) => {
  const charities = [
    { 
      name: 'Islamic Relief Worldwide', 
      url: 'https://www.islamic-relief.org', 
      region: 'Global',
      description: 'Provides humanitarian aid and development programs worldwide',
      focus: 'Emergency Relief, Education, Healthcare'
    },
    { 
      name: 'Penny Appeal', 
      url: 'https://www.pennyappeal.org', 
      region: 'UK, Global',
      description: 'UK-based charity supporting communities across the world',
      focus: 'Water, Food, Orphans'
    },
    { 
      name: 'Human Appeal', 
      url: 'https://humanappeal.org.uk', 
      region: 'UK, Global',
      description: 'International humanitarian organization',
      focus: 'Syria, Yemen, Palestine, Refugees'
    },
    { 
      name: 'Zakat Foundation', 
      url: 'https://www.zakat.org', 
      region: 'USA, Global',
      description: 'American Muslim charity focusing on Zakat distribution',
      focus: 'Zakat, Emergency Aid, Education'
    },
    { 
      name: 'UNHCR', 
      url: 'https://www.unhcr.org', 
      region: 'Global',
      description: 'UN Refugee Agency supporting displaced people',
      focus: 'Refugees, Emergency Shelter, Protection'
    },
    { 
      name: 'Local Masjid / Community', 
      url: '#', 
      region: 'Your Area',
      description: 'Support your local Islamic center and community initiatives',
      focus: 'Local Relief, Community Support'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-6 shadow-lg">
          <Heart className="text-white fill-white" size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {t('donate_title')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('donate_subtitle')}
        </p>
      </div>

      {/* Important Guidelines */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Info size={24} />
          {t('donate_guidelines_title')}
        </h2>
        <div className="space-y-3 text-amber-900">
          <div className="flex items-start gap-3">
            <span className="font-bold text-lg">1.</span>
            <p><strong>{t('donate_guideline_1_title')}</strong> {t('donate_guideline_1_desc')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-lg">2.</span>
            <p><strong>{t('donate_guideline_2_title')}</strong> {t('donate_guideline_2_desc')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-lg">3.</span>
            <p><strong>{t('donate_guideline_3_title')}</strong> {t('donate_guideline_3_desc')}</p>
          </div>
        </div>
      </div>

      {/* Charity Organizations Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {t('donate_orgs_title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity, i) => (
            <a
              key={i}
              href={charity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              onClick={charity.url === '#' ? (e) => e.preventDefault() : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-xl group-hover:text-orange-600 transition-colors">
                  {charity.name}
                </h3>
                {charity.url !== '#' && (
                  <ExternalLink className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" size={20} />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">{charity.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe size={14} />
                  <span>{charity.region}</span>
                </div>
                <div className="text-xs text-emerald-600 font-medium">
                  {charity.focus}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          {t('donate_other_ways_title')}
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-slate-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <p className="font-semibold">{t('donate_public_hospitals')}</p>
              <p className="text-sm text-slate-600">{t('donate_public_hospitals_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-semibold">{t('donate_education')}</p>
              <p className="text-sm text-slate-600">{t('donate_education_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚰</span>
            <div>
              <p className="font-semibold">{t('donate_water')}</p>
              <p className="text-sm text-slate-600">{t('donate_water_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛤️</span>
            <div>
              <p className="font-semibold">{t('donate_infrastructure')}</p>
              <p className="text-sm text-slate-600">{t('donate_infrastructure_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">👶</span>
            <div>
              <p className="font-semibold">{t('donate_orphans')}</p>
              <p className="text-sm text-slate-600">{t('donate_orphans_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍲</span>
            <div>
              <p className="font-semibold">{t('donate_food')}</p>
              <p className="text-sm text-slate-600">{t('donate_food_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Settings View
const SettingsView = ({ userProfile, setUserProfile, t }: any) => {
  const [localProfile, setLocalProfile] = useState(userProfile);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleSave = () => {
    setUserProfile(localProfile);
    localStorage.setItem('user_profile', JSON.stringify(localProfile));
    alert('Settings Saved!');
  };

  const Section = ({ title, children }: any) => (
    <div className="mb-6">
      {title && <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-4 mb-2">{title}</h3>}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 divide-y divide-slate-100 shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-24 md:pb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6 px-2">{t('settings_title')}</h1>
      
      <Section title="Account">
        <div className="p-4 flex items-center gap-4">
           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
             {localProfile.name ? localProfile.name.charAt(0).toUpperCase() : "U"}
           </div>
           <div className="flex-1 min-w-0">
             <input 
                type="text" 
                value={localProfile.name}
                onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                className="block w-full font-semibold text-lg text-slate-900 bg-transparent border-none p-0 focus:ring-0 placeholder-slate-400"
                placeholder="Your Name"
              />
             <input 
                type="email" 
                value={localProfile.email}
                onChange={(e) => setLocalProfile({...localProfile, email: e.target.value})}
                className="block w-full text-slate-500 bg-transparent border-none p-0 focus:ring-0 text-sm placeholder-slate-300"
                placeholder="email@example.com"
              />
           </div>
        </div>
      </Section>

      <Section title="Preferences">
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
             <span className="text-slate-900 font-medium">{t('fatwa_source')}</span>
             <div className="flex items-center gap-2">
               <select 
                 value={localProfile.fatwaSource}
                 onChange={(e) => setLocalProfile({...localProfile, fatwaSource: e.target.value})}
                 className="bg-transparent border-none p-0 text-slate-500 focus:ring-0 cursor-pointer text-right appearance-none pr-4"
               >
                 <option value="global">{t('fatwa_global')}</option>
                 <option value="ecfr">{t('fatwa_ecfr')}</option>
                 <option value="amja">{t('fatwa_amja')}</option>
               </select>
               <ChevronRight size={18} className="text-slate-300" />
             </div>
          </div>
      </Section>

      <Section title="App Settings">
        <div className="p-4 flex items-center justify-between">
          <span className="text-slate-900 font-medium">Notifications</span>
          <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-slate-900 font-medium">Biometric Unlock</span>
          <Toggle checked={biometric} onChange={() => setBiometric(!biometric)} />
        </div>
      </Section>

      <div className="mt-8 px-2">
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 transform duration-100"
        >
          {t('save')}
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">
          Version 1.0.2 (Build 405)
        </p>
      </div>
    </div>
  );
};


// 7. Knowledge Hub (Blog - Enhanced)
const BlogPage = ({ t, language }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); /* PRIORITY 3: Debounced search */
  const [activeTab, setActiveTab] = useState<'articles' | 'faq' | 'resources'>('articles');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const isArabic = language === 'ar';
  const isUrdu = language === 'ur';
  const isHindi = language === 'hi';
  const isBengali = language === 'bn';
  const isIndonesian = language === 'id';
  const isMalay = language === 'ms';
  const isChinese = language === 'zh';
  const isFrench = language === 'fr';
  const isGerman = language === 'de';
  const isRussian = language === 'ru';
  const isDutch = language === 'nl';
  const isHebrew = language === 'he';
  const isTurkish = language === 'tr';
  const isBosnian = language === 'bs';
  const isAlbanian = language === 'sq';

  // Only Arabic, Urdu, and Hebrew are RTL languages
  const isRTL = isArabic || isUrdu || isHebrew;
  
  const [activeCategory, setActiveCategory] = useState(
  isArabic ? "الكل" :
  isUrdu ? "سب" :
  isHindi ? "सभी" :
  isBengali ? "সব" :
  isIndonesian ? "Semua" :
  isMalay ? "Semua" :
  isChinese ? "全部" :
  isFrench ? "Tous" :
  isGerman ? "Alle" :
  isRussian ? "Все" :
  isDutch ? "Alle" :
  isHebrew ? "הכל" :
  isTurkish ? "Tümü" :
  isBosnian ? "Svi" :
  isAlbanian ? "Të gjitha" :
  "All"
);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  // FAQ Data - Multi-language
  const getFaqData = () => {
    if (isArabic) return [
      { question: "ماذا لو كسبت دخل فائدة عن غير قصد في الماضي؟", answer: "إذا لم تكن تعلم أنه محرم، فلا إثم عليك فيما مضى. ومع ذلك، بمجرد أن تعلم، يجب عليك تطهير أي دخل فائدة لا تزال تمتلكه وتجنبه في المستقبل. يقول القرآن: 'فَمَن جَاءَهُ مَوْعِظَةٌ مِّن رَّبِّهِ فَانتَهَىٰ فَلَهُ مَا سَلَفَ وَأَمْرُهُ إِلَى اللَّهِ ۖ وَمَنْ عَادَ فَأُولَٰئِكَ أَصْحَابُ النَّارِ ۖ هُمْ فِيهَا خَالِدُونَ' (2:275)" },
      { question: "هل يمكنني استخدام أموال الفائدة لدفع الضرائب أو الرسوم الحكومية؟", answer: "وفقًا لمعظم العلماء، يجب إعطاء أموال الفائدة للفقراء والمحتاجين دون نية الأجر. لا ينبغي استخدامها للمنفعة الشخصية، بما في ذلك دفع الضرائب. التخلص الصحيح هو من خلال الصدقة للمحتاجين." },
      { question: "ماذا لو لم يسمح لي البنك برفض الفائدة على حسابي؟", answer: "إذا لم تتمكن من فتح حساب بدون فوائد، ينصح العلماء بتقليل الفائدة المكتسبة والتبرع بها كلها للجمعيات الخيرية. بالإضافة إلى ذلك، ابحث بنشاط عن بدائل مصرفية إسلامية في بلدك. تقدم العديد من البنوك التقليدية الآن نوافذ مصرفية إسلامية." },
      { question: "هل هذا هو نفسه دفع الزكاة؟", answer: "لا، تطهير الفائدة (الربا) مختلف تمامًا عن الزكاة. الزكاة عمل عبادة واجب بنية كسب الأجر من الله. تطهير الفائدة هو التخلص من الكسب غير المشروع دون توقع أي مكافأة. إنهما التزامان منفصلان." },
      { question: "هل يمكنني إعطاء أموال الفائدة لأقاربي الفقراء؟", answer: "نعم، وفقًا للعديد من العلماء، يمكنك إعطاء أموال الفائدة المطهرة لأقاربك الفقراء المؤهلين لتلقي الصدقة (أولئك الذين لست ملزمًا بدعمهم ماليًا، مثل الوالدين أو الزوج أو الأطفال). في الواقع، يتم تشجيع ذلك لأن الحفاظ على روابط الأسرة يكافأ بشكل كبير في الإسلام." }
    ];
    if (isUrdu) return [
      { question: "اگر میں نے ماضی میں نادانستہ طور پر سود کی آمدنی حاصل کی ہے تو کیا ہوگا؟", answer: "اگر آپ کو نہیں معلوم تھا کہ یہ حرام ہے، تو جو گزر گیا اس پر آپ کا کوئی گناہ نہیں۔ تاہم، ایک بار جب آپ کو علم ہو جائے، تو آپ کو اپنی پاس موجود کسی بھی سود کی آمدنی کو پاک کرنا ہوگا اور مستقبل میں اس سے بچنا ہوگا۔ قرآن میں ہے: 'لیکن جو واپس آئے [سود سے نمٹنے میں] - وہ آگ کے ساتھی ہیں؛ وہ اس میں ہمیشہ رہیں گے' (2:275)" },
      { question: "کیا میں ٹیکس یا سرکاری فیس ادا کرنے کے لیے سود کی رقم استعمال کر سکتا ہوں؟", answer: "زیادہ تر علماء کے مطابق، سود کی رقم کو ثواب کی نیت کے بغیر غریبوں اور ضرورت مندوں کو دی جانی چاہیے۔ اسے ذاتی فائدے کے لیے استعمال نہیں کرنا چاہیے، بشمول ٹیکس ادا کرنا۔ مناسب ضائع کرنا ضرورت مندوں کو صدقہ کے ذریعے ہے۔" },
      { question: "اگر میرا بینک مجھے اپنے اکاؤنٹ پر سود سے انکار کرنے کی اجازت نہیں دیتا تو کیا ہوگا؟", answer: "اگر آپ سود سے پاک اکاؤنٹ نہیں کھول سکتے، تو علماء کا مشورہ ہے کہ سود کو کم سے کم کریں اور اسے تمام خیراتی اداروں کو عطیہ کریں۔ مزید برآں، اپنے ملک میں اسلامی بینکنگ کے متبادل تلاش کریں۔ بہت سے روایتی بینک اب اسلامی بینکنگ ونڈوز پیش کرتے ہیں۔" },
      { question: "کیا یہ زکوٰۃ ادا کرنے جیسا ہے؟", answer: "نہیں، سود (ربا) کو پاک کرنا زکوٰۃ سے بالکل مختلف ہے۔ زکوٰۃ اللہ سے ثواب حاصل کرنے کی نیت سے عبادت کا ایک لازمی عمل ہے۔ سود کو پاک کرنا کسی بھی انعام کی توقع کے بغیر غیر قانونی کمائی کو ضائع کرنا ہے۔ یہ الگ الگ ذمہ داریاں ہیں۔" },
      { question: "کیا میں سود کی رقم اپنے غریب رشتہ داروں کو دے سکتا ہوں؟", answer: "جی ہاں، بہت سے علماء کے مطابق، آپ پاک شدہ سود کی رقم اپنے غریب رشتہ داروں کو دے سکتے ہیں جو صدقہ وصول کرنے کے اہل ہیں (وہ جن کی مالی مدد کرنے کے لیے آپ پابند نہیں ہیں، جیسے والدین، شریک حیات، یا بچے)۔ یہ دراصل حوصلہ افزائی کی جاتی ہے کیونکہ خاندانی تعلقات کو برقرار رکھنا اسلام میں بہت زیادہ اجر دیا جاتا ہے۔" }
    ];
if (isHindi) return [
  {
    question: "अगर मैंने पहले गलती से ब्याज की कमाई ले ली हो तो?",answer: "अगर आप नहीं जानते थे कि ये हराम है तो पिछले गुनाह की पकड़ नहीं है। मगर अब जब पता चल गया है तो जो ब्याज आपके पास है उसे साफ करना जरूरी है और आगे से बचना भी। कुरान कहता है: 'जो लोग (रिबा की तरफ) लौटें—वे जहन्नम वाले हैं, और हमेशा वहीं रहेंगे' (2:275)"
  },{
    question: "क्या मैं इस ब्याज से टैक्स या सरकारी फीस भर सकता हूं?",
    answer: "अधिकतर आलिमों के मुताबिक, ब्याज की रकम गरीबों को देनी चाहिए, बिना सवाब की नीयत के। इसे अपने किसी फायदे में इस्तेमाल करना जायज़ नहीं—टैक्स भरना भी शामिल है। सही तरीका है कि इसे सिर्फ दान में दे दिया जाए।"
  },
  {
    question: "अगर मेरा बैंक ब्याज से इनकार करने का ऑप्शन ही नहीं देता तो?",
    answer: "अगर ब्याज-मुक्त खाता नहीं मिल रहा, तो जितना हो सके ब्याज को कम रखें और जितना मिले, पूरा दान कर दें। साथ ही इस्लामी बैंकिंग के ऑप्शन तलाश करते रहें—आजकल कई बैंक शरिया विंडो भी देते हैं।"
  },
  {
    question: "क्या ये ज़कात जैसा है?",
    answer: "नहीं, बिल्कुल नहीं। रिबा की सफाई ज़कात से अलग है। ज़कात इबादत है, सवाब की नीयत से दी जाती है। रिबा को देना सवाब के बिना, सिर्फ नापाक कमाई हटाने के लिए होता है। दोनों की नीयत और मकसद अलग हैं।"
  },
  {
    question: "क्या मैं ये पैसा अपने गरीब रिश्तेदारों को दे सकता हूं?",
    answer: "हाँ, अगर रिश्तेदार गरीब हैं और सदक़ा लेने के हकदार हैं, तो दे सकते हैं—बशर्ते कि वे वो लोग न हों जिन्हें आप पर खर्च करना फर्ज है (मां-बाप, बीवी-बच्चे)। ऐसे रिश्तेदारों की मदद करना अच्छा भी है और इस्लाम में सिल-ए-रहम की वजह से पसंद किया जाता है।"
  }
];
    if (isBengali) return [
      { question: "যদি আমি অতীতে অজান্তে সুদের আয় অর্জন করি তাহলে কী হবে?", answer: "যদি আপনি জানতেন না যে এটি নিষিদ্ধ, তবে যা অতিবাহিত হয়েছে তার জন্য আপনার উপর কোনো পাপ নেই। তবে, একবার আপনি সচেতন হয়ে গেলে, আপনার এখনও থাকা যেকোনো সুদের আয় পরিশুদ্ধ করতে হবে এবং ভবিষ্যতে এটি এড়াতে হবে। কোরআন বলে: 'কিন্তু যে কেউ [সুদ বা সুদখোরির সাথে লেনদেন করতে] ফিরে আসে - তারা আগুনের সঙ্গী; তারা সেখানে চিরকাল থাকবে' (2:275)" },
      { question: "আমি কি কর বা সরকারি ফি প্রদানের জন্য সুদের টাকা ব্যবহার করতে পারি?", answer: "বেশিরভাগ পণ্ডিতদের মতে, সুদের অর্থ পুরস্কারের উদ্দেশ্য ছাড়াই দরিদ্র এবং অভাবগ্রস্তদের দেওয়া উচিত। এটি ব্যক্তিগত সুবিধার জন্য ব্যবহার করা উচিত নয়, যার মধ্যে কর প্রদান অন্তর্ভুক্ত। সঠিক নিষ্পত্তি হল অভাবগ্রস্তদের দাতব্যের মাধ্যমে।" },
      { question: "আমার ব্যাংক যদি আমাকে আমার অ্যাকাউন্টে সুদ প্রত্যাখ্যান করতে অনুমতি না দেয় তাহলে কী হবে?", answer: "যদি আপনি একটি সুদমুক্ত অ্যাকাউন্ট খুলতে না পারেন, তাহলে পণ্ডিতরা পরামর্শ দেন যে অর্জিত সুদ কমাতে এবং সমস্ত দাতব্যে দান করুন। উপরন্তু, আপনার দেশে ইসলামিক ব্যাংকিং বিকল্পগুলি সক্রিয়ভাবে অনুসন্ধান করুন। অনেক প্রচলিত ব্যাংক এখন ইসলামিক ব্যাংকিং উইন্ডো অফার করে।" },
      { question: "এটি কি যাকাত প্রদানের মতো?", answer: "না, সুদ (রিবা) পরিশুদ্ধ করা যাকাত থেকে সম্পূর্ণ আলাদা। যাকাত হল আল্লাহর কাছ থেকে পুরস্কার অর্জনের উদ্দেশ্য নিয়ে উপাসনার একটি বাধ্যতামূলক কাজ। সুদ পরিশুদ্ধ করা হল কোনো পুরস্কার প্রত্যাশা না করে অবৈধ উপার্জন নিষ্পত্তি করা। এগুলি পৃথক দায়িত্ব।" },
      { question: "আমি কি সুদের টাকা আমার দরিদ্র আত্মীয়দের দিতে পারি?", answer: "হ্যাঁ, অনেক পণ্ডিতদের মতে, আপনি পরিশুদ্ধ সুদের অর্থ আপনার দরিদ্র আত্মীয়দের দিতে পারেন যারা দাতব্য গ্রহণ করার যোগ্য (যাদের আর্থিকভাবে সমর্থন করার জন্য আপনি বাধ্য নন, যেমন বাবা-মা, স্বামী বা স্ত্রী, বা সন্তান)। এটি প্রকৃতপক্ষে উৎসাহিত করা হয় কারণ পারিবারিক সম্পর্ক বজায় রাখা ইসলামে অত্যন্ত পুরস্কৃত হয়।" }
    ];
    if (isIndonesian) return [
      { question: "Bagaimana jika saya tanpa sadar mendapatkan pendapatan bunga di masa lalu?", answer: "Jika Anda tidak tahu bahwa itu dilarang, tidak ada dosa bagi Anda untuk apa yang telah berlalu. Namun, setelah Anda menyadarinya, Anda harus membersihkan pendapatan bunga yang masih Anda miliki dan menghindarinya di masa depan. Al-Qur'an menyatakan: 'Tetapi siapa pun yang kembali [ke riba] - mereka adalah penghuni Neraka; mereka akan tinggal di dalamnya selamanya' (2:275)" },
      { question: "Bisakah saya menggunakan uang bunga untuk membayar pajak atau biaya pemerintah?", answer: "Menurut sebagian besar ulama, uang bunga harus diberikan kepada orang miskin dan yang membutuhkan tanpa niat mendapat pahala. Tidak boleh digunakan untuk keuntungan pribadi, termasuk membayar pajak. Pembuangan yang tepat adalah melalui amal kepada yang membutuhkan." },
      { question: "Bagaimana jika bank saya tidak mengizinkan saya menolak bunga pada akun saya?", answer: "Jika Anda tidak dapat membuka rekening bebas bunga, para ulama menyarankan untuk meminimalkan bunga yang diperoleh dan menyumbangkan semuanya untuk amal. Selain itu, aktif mencari alternatif perbankan Islam di negara Anda. Banyak bank konvensional sekarang menawarkan layanan perbankan Islam." },
      { question: "Apakah ini sama dengan membayar Zakat?", answer: "Tidak, membersihkan bunga (Riba) sama sekali berbeda dari Zakat. Zakat adalah tindakan ibadah wajib dengan niat mendapat pahala dari Allah. Membersihkan bunga adalah membuang penghasilan haram tanpa mengharapkan pahala apa pun. Mereka adalah kewajiban yang terpisah." },
      { question: "Bisakah saya memberikan uang bunga kepada kerabat miskin saya?", answer: "Ya, menurut banyak ulama, Anda dapat memberikan uang bunga yang telah dibersihkan kepada kerabat miskin yang berhak menerima sedekah (mereka yang tidak diwajibkan untuk Anda dukung secara finansial, seperti orang tua, pasangan, atau anak-anak). Ini sebenarnya dianjurkan karena memelihara hubungan keluarga sangat dihargai dalam Islam." }
    ];
    if (isMalay) return [
      { question: "Bagaimana jika saya tanpa sengaja memperoleh pendapatan faedah pada masa lalu?", answer: "Jika anda tidak tahu bahawa ia dilarang, tidak ada dosa ke atas anda untuk apa yang telah berlalu. Walau bagaimanapun, sebaik sahaja anda menyedarinya, anda mesti membersihkan sebarang pendapatan faedah yang masih anda miliki dan mengelakkannya pada masa hadapan. Al-Quran menyatakan: 'Tetapi sesiapa yang kembali [kepada riba] - mereka adalah penghuni Neraka; mereka akan tinggal di dalamnya selama-lamanya' (2:275)" },
      { question: "Bolehkah saya menggunakan wang faedah untuk membayar cukai atau yuran kerajaan?", answer: "Menurut kebanyakan ulama, wang faedah harus diberikan kepada orang miskin dan yang memerlukan tanpa niat mendapat ganjaran. Ia tidak boleh digunakan untuk faedah peribadi, termasuk membayar cukai. Pembuangan yang betul adalah melalui sedekah kepada yang memerlukan." },
      { question: "Bagaimana jika bank saya tidak membenarkan saya menolak faedah pada akaun saya?", answer: "Jika anda tidak dapat membuka akaun tanpa faedah, ulama menasihatkan untuk meminimumkan faedah yang diperoleh dan mendermakannya semua kepada badan amal. Selain itu, cari alternatif perbankan Islam di negara anda secara aktif. Banyak bank konvensional kini menawarkan perkhidmatan perbankan Islam." },
      { question: "Adakah ini sama dengan membayar Zakat?", answer: "Tidak, membersihkan faedah (Riba) sama sekali berbeza daripada Zakat. Zakat adalah tindakan ibadah wajib dengan niat mendapat ganjaran daripada Allah. Membersihkan faedah adalah membuang pendapatan haram tanpa mengharapkan sebarang ganjaran. Mereka adalah kewajipan yang berasingan." },
      { question: "Bolehkah saya memberikan wang faedah kepada saudara-mara miskin saya?", answer: "Ya, menurut ramai ulama, anda boleh memberikan wang faedah yang telah dibersihkan kepada saudara-mara miskin yang layak menerima sedekah (mereka yang tidak diwajibkan untuk anda sokong dari segi kewangan, seperti ibu bapa, pasangan, atau anak-anak). Ini sebenarnya digalakkan kerana memelihara hubungan keluarga sangat dihargai dalam Islam." }
    ];
    if (isChinese) return [
      { question: "如果我在过去无意中赚取了利息收入怎么办？", answer: "如果你不知道这是被禁止的，那么对于过去的事情你没有罪。但是，一旦你意识到，你必须净化你仍然拥有的任何利息收入，并在未来避免它。古兰经说：'但任何返回[处理利息或高利贷]的人 - 他们是火的同伴；他们将永远留在其中'（2:275）" },
      { question: "我可以用利息钱支付税款或政府费用吗？", answer: "根据大多数学者的说法，利息钱应该无意图回报地给予穷人和有需要的人。它不应该用于个人利益，包括支付税款。正确的处置是通过慈善给予有需要的人。" },
      { question: "如果我的银行不允许我拒绝账户上的利息怎么办？", answer: "如果你无法开设无息账户，学者们建议尽量减少赚取的利息并将其全部捐赠给慈善机构。此外，积极寻找你所在国家的伊斯兰银行业替代方案。许多传统银行现在提供伊斯兰银行业务窗口。" },
      { question: "这和支付天课一样吗？", answer: "不，净化利息（里巴）与天课完全不同。天课是一种义务性的崇拜行为，意图是从真主那里获得回报。净化利息是在不期望任何回报的情况下处理非法收入。它们是单独的义务。" },
      { question: "我可以把利息钱给我的贫穷亲戚吗？", answer: "是的，根据许多学者的说法，你可以将净化的利息钱给予有资格接受慈善的贫穷亲戚（那些你没有义务在经济上支持的人，比如父母、配偶或孩子）。这实际上是被鼓励的，因为维持家庭关系在伊斯兰教中得到高度回报。" }
    ];
    if (isFrench) return [
      { question: "Que se passe-t-il si j'ai involontairement gagné un revenu d'intérêts dans le passé ?", answer: "Si vous ne saviez pas que c'était interdit, il n'y a aucun péché sur vous pour ce qui s'est passé. Cependant, une fois que vous en êtes conscient, vous devez purifier tout revenu d'intérêts que vous possédez encore et l'éviter à l'avenir. Le Coran dit : 'Mais quiconque retourne [à l'intérêt ou à l'usure] - ce sont les compagnons du Feu ; ils y resteront éternellement' (2:275)" },
      { question: "Puis-je utiliser l'argent des intérêts pour payer des impôts ou des frais gouvernementaux ?", answer: "Selon la plupart des érudits, l'argent des intérêts devrait être donné aux pauvres et aux nécessiteux sans intention de récompense. Il ne doit pas être utilisé pour un avantage personnel, y compris le paiement des impôts. L'élimination appropriée se fait par la charité aux nécessiteux." },
      { question: "Que faire si ma banque ne me permet pas de refuser les intérêts sur mon compte ?", answer: "Si vous ne pouvez pas ouvrir un compte sans intérêts, les érudits conseillent de minimiser les intérêts gagnés et de tout donner à des œuvres caritatives. De plus, recherchez activement des alternatives bancaires islamiques dans votre pays. De nombreuses banques conventionnelles proposent désormais des guichets bancaires islamiques." },
      { question: "Est-ce la même chose que de payer la Zakat ?", answer: "Non, purifier les intérêts (Riba) est complètement différent de la Zakat. La Zakat est un acte d'adoration obligatoire avec l'intention de gagner une récompense d'Allah. Purifier les intérêts consiste à se débarrasser de gains illicites sans attendre de récompense. Ce sont des obligations distinctes." },
      { question: "Puis-je donner l'argent des intérêts à mes parents pauvres ?", answer: "Oui, selon de nombreux érudits, vous pouvez donner l'argent d'intérêts purifié à des parents pauvres qui sont éligibles pour recevoir la charité (ceux que vous n'êtes pas obligé de soutenir financièrement, comme les parents, le conjoint ou les enfants). Ceci est en fait encouragé car maintenir les liens familiaux est hautement récompensé dans l'Islam." }
    ];
    if (isGerman) return [
      { question: "Was ist, wenn ich in der Vergangenheit unwissentlich Zinseinkommen verdient habe?", answer: "Wenn Sie nicht wussten, dass es verboten war, liegt keine Sünde auf Ihnen für das, was vergangen ist. Sobald Sie sich jedoch bewusst werden, müssen Sie alle Zinseinkommen, die Sie noch besitzen, reinigen und sie in Zukunft vermeiden. Der Koran besagt: 'Aber wer auch immer [zum Zinsgeschäft] zurückkehrt - das sind die Gefährten des Feuers; sie werden ewig darin bleiben' (2:275)" },
      { question: "Kann ich Zinsgeld verwenden, um Steuern oder Regierungsgebühren zu bezahlen?", answer: "Laut den meisten Gelehrten sollte Zinsgeld ohne die Absicht einer Belohnung an Arme und Bedürftige gegeben werden. Es sollte nicht für persönliche Vorteile verwendet werden, einschließlich der Zahlung von Steuern. Die richtige Entsorgung erfolgt durch Wohltätigkeit an Bedürftige." },
      { question: "Was ist, wenn meine Bank mir nicht erlaubt, Zinsen auf meinem Konto abzulehnen?", answer: "Wenn Sie kein zinsfreies Konto eröffnen können, raten Gelehrte dazu, die verdienten Zinsen zu minimieren und alles für wohltätige Zwecke zu spenden. Suchen Sie außerdem aktiv nach islamischen Bankalternativen in Ihrem Land. Viele konventionelle Banken bieten jetzt islamische Bankschalter an." },
      { question: "Ist das dasselbe wie Zakat zu zahlen?", answer: "Nein, die Reinigung von Zinsen (Riba) ist völlig anders als Zakat. Zakat ist eine obligatorische Anbetungshandlung mit der Absicht, eine Belohnung von Allah zu verdienen. Die Reinigung von Zinsen bedeutet, unrechtmäßige Einkünfte zu entsorgen, ohne irgendeine Belohnung zu erwarten. Sie sind separate Verpflichtungen." },
      { question: "Kann ich das Zinsgeld meinen armen Verwandten geben?", answer: "Ja, laut vielen Gelehrten können Sie das gereinigte Zinsgeld armen Verwandten geben, die berechtigt sind, Wohltätigkeit zu erhalten (diejenigen, die Sie nicht finanziell unterstützen müssen, wie Eltern, Ehepartner oder Kinder). Dies wird tatsächlich ermutigt, da die Aufrechterhaltung von Familienbanden im Islam hoch belohnt wird." }
    ];
    if (isRussian) return [
      { question: "Что делать, если я неосознанно получил процентный доход в прошлом?", answer: "Если вы не знали, что это было запрещено, на вас нет греха за то, что прошло. Однако, как только вы узнаете, вы должны очистить любой процентный доход, который вы все еще имеете, и избегать его в будущем. Коран гласит: 'Но кто бы ни вернулся [к ростовщичеству] - это обитатели Огня; они будут там вечно' (2:275)" },
      { question: "Могу ли я использовать процентные деньги для уплаты налогов или государственных сборов?", answer: "По мнению большинства ученых, процентные деньги должны быть отданы бедным и нуждающимся без намерения получить вознаграждение. Их не следует использовать для личной выгоды, включая уплату налогов. Правильная утилизация - через благотворительность нуждающимся." },
      { question: "Что делать, если мой банк не позволяет мне отказаться от процентов на моем счете?", answer: "Если вы не можете открыть беспроцентный счет, ученые советуют минимизировать полученные проценты и пожертвовать все это на благотворительность. Кроме того, активно ищите исламские банковские альтернативы в вашей стране. Многие обычные банки теперь предлагают исламские банковские окна." },
      { question: "Это то же самое, что и выплата Закята?", answer: "Нет, очищение процентов (Риба) совершенно отличается от Закята. Закят - это обязательный акт поклонения с намерением получить награду от Аллаха. Очищение процентов - это избавление от незаконных заработков без ожидания какой-либо награды. Это отдельные обязательства." },
      { question: "Могу ли я отдать процентные деньги моим бедным родственникам?", answer: "Да, по мнению многих ученых, вы можете отдать очищенные процентные деньги бедным родственникам, которые имеют право получать благотворительность (те, кого вы не обязаны поддерживать финансово, например, родители, супруг или дети). Это на самом деле поощряется, потому что поддержание семейных связей высоко вознаграждается в Исламе." }
    ];
    if (isDutch) return [
      { question: "Wat als ik in het verleden onbewust rente-inkomsten heb verdiend?", answer: "Als je niet wist dat het verboden was, rust er geen zonde op je voor wat voorbij is. Echter, zodra je je bewust wordt, moet je alle rente-inkomsten die je nog bezit zuiveren en het in de toekomst vermijden. De Koran zegt: 'Maar degene die terugkeert [naar rente of woeker] - dat zijn de metgezellen van het Vuur; zij zullen er eeuwig in blijven' (2:275)" },
      { question: "Kan ik rentegeld gebruiken om belastingen of overheidskosten te betalen?", answer: "Volgens de meeste geleerden moet rentegeld worden gegeven aan de armen en behoeftigen zonder de intentie van beloning. Het mag niet worden gebruikt voor persoonlijk voordeel, inclusief het betalen van belastingen. De juiste verwijdering is via liefdadigheid aan behoeftigen." },
      { question: "Wat als mijn bank me niet toestaat rente op mijn rekening te weigeren?", answer: "Als je geen rentevrije rekening kunt openen, adviseren geleerden om de verdiende rente te minimaliseren en alles aan liefdadigheid te doneren. Zoek daarnaast actief naar islamitische bankalternatieven in je land. Veel conventionele banken bieden nu islamitische bankvensters aan." },
      { question: "Is dit hetzelfde als het betalen van Zakat?", answer: "Nee, het zuiveren van rente (Riba) is volledig anders dan Zakat. Zakat is een verplichte daad van aanbidding met de intentie om beloning van Allah te verdienen. Het zuiveren van rente is het wegdoen van onwettige inkomsten zonder enige beloning te verwachten. Het zijn aparte verplichtingen." },
      { question: "Kan ik het rentegeld aan mijn arme familieleden geven?", answer: "Ja, volgens veel geleerden kun je het gezuiverde rentegeld geven aan arme familieleden die in aanmerking komen om liefdadigheid te ontvangen (degenen die je niet verplicht bent financieel te ondersteunen, zoals ouders, echtgenoot of kinderen). Dit wordt eigenlijk aangemoedigd omdat het onderhouden van familiebanden zeer wordt beloond in de Islam." }
    ];
    if (isHebrew) return [
      { question: "מה אם הרווחתי הכנסה מריבית בעבר שלא ביודעין?", answer: "אם לא ידעת שזה אסור, אין עליך חטא על מה שעבר. עם זאת, ברגע שאתה מודע, עליך לטהר כל הכנסת ריבית שעדיין יש לך ולהימנע ממנה בעתיד. הקוראן קובע: 'אבל מי שחוזר [לעסוק בריבית או בריבית] - אלה הם חברי האש; הם יישארו שם לנצח' (2:275)" },
      { question: "האם אני יכול להשתמש בכסף הריבית לתשלום מיסים או אגרות ממשלתיות?", answer: "לפי רוב החוקרים, כסף הריבית צריך להינתן לעניים ולנזקקים ללא כוונת פרס. אין להשתמש בו לטובה אישית, כולל תשלום מיסים. הסילוק הנכון הוא באמצעות צדקה לנזקקים." },
      { question: "מה אם הבנק שלי לא מאפשר לי לסרב לריבית על החשבון שלי?", answer: "אם אתה לא יכול לפתוח חשבון ללא ריבית, חוקרים מייעצים למזער את הריבית שהרווחת ולתרום הכל לצדקה. בנוסף, חפש באופן פעיל אלטרנטיבות בנקאות אסלאמיות במדינה שלך. בנקים קונבנציונליים רבים מציעים כעת חלונות בנקאות אסלאמיים." },
      { question: "האם זה אותו דבר כמו תשלום זכאת?", answer: "לא, טיהור ריבית (ריבא) שונה לחלוטין מזכאת. זכאת היא מעשה חובה של פולחן עם הכוונה להרוויח פרס מאללה. טיהור ריבית הוא סילוק רווחים לא חוקיים מבלי לצפות לכל פרס. אלה חובות נפרדות." },
      { question: "האם אני יכול לתת את כסף הריבית לקרובי המשפחה העניים שלי?", answer: "כן, לפי חוקרים רבים, אתה יכול לתת את כסף הריבית המטוהר לקרובי משפחה עניים שזכאים לקבל צדקה (אלה שאתה לא מחויב לתמוך בהם כלכלית, כמו הורים, בן זוג או ילדים). זה למעשה מעודד מכיוון ששמירה על קשרי משפחה מתוגמלת מאוד באסלאם." }
    ];
    if (isTurkish) return [
      { question: "Geçmişte bilmeden faiz geliri elde ettiysem ne olur?", answer: "Yasak olduğunu bilmiyorsanız, geçmişte olanlar için üzerinizde günah yoktur. Ancak, farkına vardığınızda, hala sahip olduğunuz herhangi bir faiz gelirini temizlemeniz ve gelecekte bundan kaçınmanız gerekir. Kuran şöyle der: 'Ancak kim [faize] geri dönerse - onlar Ateş'in dostlarıdır; orada sonsuza kadar kalacaklardır' (2:275)" },
      { question: "Faiz parasını vergi veya devlet ücretlerini ödemek için kullanabilir miyim?", answer: "Çoğu alimlere göre, faiz parası ödül niyeti olmadan fakirlere ve muhtaçlara verilmelidir. Vergi ödemek de dahil olmak üzere kişisel fayda için kullanılmamalıdır. Uygun bertaraf, muhtaçlara sadaka yoluyla yapılır." },
      { question: "Bankam hesabımdaki faizi reddetmeme izin vermiyorsa ne olur?", answer: "Faizsiz bir hesap açamıyorsanız, alimler kazanılan faizi en aza indirmeyi ve hepsini hayır kurumlarına bağışlamayı tavsiye eder. Ayrıca, ülkenizdeki İslami bankacılık alternatiflerini aktif olarak arayın. Birçok geleneksel banka artık İslami bankacılık pencereleri sunmaktadır." },
      { question: "Bu Zekat ödemekle aynı mı?", answer: "Hayır, faizi (Riba) temizlemek Zekat'tan tamamen farklıdır. Zekat, Allah'tan ödül kazanma niyetiyle ibadet edilen zorunlu bir eylemdir. Faizi temizlemek, herhangi bir ödül beklemeden yasadışı kazançları elden çıkarmaktır. Bunlar ayrı yükümlülüklerdir." },
      { question: "Faiz parasını fakir akrabalarıma verebilir miyim?", answer: "Evet, birçok alime göre, temizlenmiş faiz parasını sadaka almaya uygun fakir akrabalarınıza verebilirsiniz (mali olarak desteklemek zorunda olmadığınız kişiler, anne-baba, eş veya çocuklar gibi). Bu aslında teşvik edilmektedir çünkü aile bağlarını sürdürmek İslam'da oldukça ödüllendirilir." }
    ];
    if (isBosnian) return [
      { question: "Šta ako sam u prošlosti nesvjesno zaradio kamatni prihod?", answer: "Ako niste znali da je to zabranjeno, nema grijeha na vama za ono što je prošlo. Međutim, jednom kada postanete svjesni, morate očistiti bilo koji kamatni prihod koji još posjedujete i izbjeći ga u budućnosti. Kur'an kaže: 'Ali ko se vrati [na kamatu ili lihvu] - to su stanovnici Vatre; oni će u njoj vječno boraviti' (2:275)" },
      { question: "Mogu li koristiti novac od kamata za plaćanje poreza ili državnih taksi?", answer: "Prema većini učenjaka, novac od kamata treba dati siromašnima i potrebitima bez namjere nagrade. Ne smije se koristiti za ličnu korist, uključujući plaćanje poreza. Pravilno odlaganje je kroz dobročinstvo potrebitima." },
      { question: "Šta ako mi banka ne dopušta da odbijam kamatu na mom računu?", answer: "Ako ne možete otvoriti račun bez kamata, učenjaci savjetuju da minimizirate zarađenu kamatu i donirate sve za dobročinstvo. Dodatno, aktivno tražite islamske bankovne alternative u vašoj zemlji. Mnoge konvencionalne banke sada nude islamske bankovne prozore." },
      { question: "Je li ovo isto kao plaćanje Zekata?", answer: "Ne, čišćenje kamata (Riba) potpuno je drugačije od Zekata. Zekat je obavezna bogoslužba s namjerom da se zaslužuje nagrada od Allaha. Čišćenje kamata je odlaganje nezakonitih zarada bez očekivanja bilo kakve nagrade. To su odvojene obaveze." },
      { question: "Mogu li dati novac od kamata mojim siromašnim rođacima?", answer: "Da, prema mnogim učenjacima, možete dati očišćeni novac od kamata siromašnim rođacima koji ispunjavaju uslove za primanje dobročinstva (oni koje niste obavezni finansijski podržavati, kao što su roditelji, supružnik ili djeca). Ovo je zapravo ohrabreno jer održavanje porodičnih veza je visoko nagrađeno u Islamu." }
    ];
    if (isAlbanian) return [
      { question: "Çfarë ndodh nëse kam fituar të ardhura nga interesi në të kaluarën pa e ditur?", answer: "Nëse nuk e dije se ishte e ndaluar, nuk ka mëkat mbi ty për atë që ka kaluar. Megjithatë, pasi të bëhesh i vetëdijshëm, duhet të pastrosh çdo të ardhur nga interesi që akoma ke dhe ta shmangësh në të ardhmen. Kurani thotë: 'Por kushdo që kthehet [në interes ose fajde] - ata janë shokët e Zjarrit; ata do të qëndrojnë aty përgjithmonë' (2:275)" },
      { question: "A mund ta përdor paratë e interesit për të paguar taksa ose tarifa qeveritare?", answer: "Sipas shumicës së dijetarëve, paratë e interesit duhet t'u jepen të varfërve dhe nevojtarëve pa qëllim shpërblimi. Nuk duhet të përdoren për përfitime personale, duke përfshirë pagesën e taksave. Hedhja e duhur është përmes bamirësisë për nevojtarët." },
      { question: "Çfarë ndodh nëse banka ime nuk më lejon të refuzoj interesin në llogarinë time?", answer: "Nëse nuk mund të hapësh një llogari pa interes, dijetarët këshillojnë të minimizosh interesin e fituar dhe ta dhurosh të gjithë për bamirësi. Për më tepër, kërko në mënyrë aktive alternativa bankare islamike në vendin tënd. Shumë banka konvencionale tani ofrojnë dritare bankare islamike." },
      { question: "A është kjo e njëjtë me pagesën e Zekatit?", answer: "Jo, pastrimi i interesit (Riba) është plotësisht i ndryshëm nga Zekati. Zekati është një vepër adhurimi e detyrueshme me qëllim për të fituar shpërblim nga Allahu. Pastrimi i interesit është hedhja e të ardhurave të paligjshme pa pritur ndonjë shpërblim. Ato janë detyrime të veçanta." },
      { question: "A mund t'u jap paratë e interesit të afërmve të mi të varfër?", answer: "Po, sipas shumë dijetarëve, mund t'u japësh paratë e pastruara të interesit të afërmve të varfër që janë të pranueshëm për të marrë bamirësi (ata që nuk je i detyruar t'i mbështetësh financiarisht, si prindërit, bashkëshorti ose fëmijët). Kjo në fakt inkurajohet sepse ruajtja e lidhjeve familjare shpërblehet shumë në Islam." }
    ];
    // Default English
    return [
      { question: "What if I unknowingly earned interest income in the past?", answer: "If you didn't know it was prohibited, there is no sin on you for what has passed. However, once you become aware, you must purify any interest income you still possess and avoid it in the future. The Quran states: 'But whoever returns [to dealing in interest or usury] - those are the companions of the Fire; they will abide eternally therein' (2:275)" },
      { question: "Can I use interest money to pay taxes or government fees?", answer: "According to most scholars, interest money should be given to the poor and needy without the intention of reward. It should not be used for personal benefit, including paying taxes. The proper disposal is through charity to those in need." },
      { question: "What if my bank doesn't allow me to refuse interest on my account?", answer: "If you're unable to open an interest-free account, scholars advise to minimize the interest earned and donate it all to charity. Additionally, actively search for Islamic banking alternatives in your country. Many conventional banks now offer Islamic banking windows." },
      { question: "Is this the same as paying Zakat?", answer: "No, purifying interest (Riba) is completely different from Zakat. Zakat is an obligatory act of worship with the intention of earning reward from Allah. Purifying interest is disposing of unlawful earnings without expecting any reward. They are separate obligations." },
      { question: "Can I give the interest money to my poor relatives?", answer: "Yes, according to many scholars, you can give the purified interest money to poor relatives who are eligible to receive charity (those you're not obligated to financially support, like parents, spouse, or children). This is actually encouraged as maintaining family ties is highly rewarded in Islam." }
    ];
  };
  
  const faqData = getFaqData();

  // Tab labels with translations
  const getTabLabel = (tab: 'articles' | 'faq' | 'resources') => {
    if (tab === 'articles') {
      return isArabic ? "📚 المقالات" :
             isUrdu ? "📚 مضامین" :
             isHindi ? "📚 लेख" :
             isBengali ? "📚 নিবন্ধ" :
             isIndonesian ? "📚 Artikel" :
             isMalay ? "📚 Artikel" :
             isChinese ? "📚 文章" :
             isFrench ? "📚 Articles" :
             isGerman ? "📚 Artikel" :
             isRussian ? "📚 Статьи" :
             isDutch ? "📚 Artikelen" :
             isHebrew ? "📚 מאמרים" :
             isTurkish ? "📚 Makaleler" :
             isBosnian ? "📚 Članci" :
             isAlbanian ? "📚 Artikuj" :
             "📚 Articles";
    }
    if (tab === 'faq') {
      return isArabic ? "❓ الأسئلة الشائعة" :
             isUrdu ? "❓ عمومی سوالات" :
             isHindi ? "❓ आम सवाल" :
             isBengali ? "❓ সাধারণ প্রশ্ন" :
             isIndonesian ? "❓ FAQ" :
             isMalay ? "❓ Soalan Lazim" :
             isChinese ? "❓ 常见问题" :
             isFrench ? "❓ FAQ" :
             isGerman ? "❓ FAQ" :
             isRussian ? "❓ FAQ" :
             isDutch ? "❓ FAQ" :
             isHebrew ? "❓ שאלות נפוצות" :
             isTurkish ? "❓ SSS" :
             isBosnian ? "❓ FAQ" :
             isAlbanian ? "❓ Pyetje të Shpeshta" :
             "❓ FAQ";
    }
    return isArabic ? "📖 الموارد العلمية" :
           isUrdu ? "📖 علمی وسائل" :
           isHindi ? "📖 आलिमों के रिसोर्स" :
           isBengali ? "📖 পণ্ডিত সম্পদ" :
           isIndonesian ? "📖 Sumber Ilmiah" :
           isMalay ? "📖 Sumber Ilmiah" :
           isChinese ? "📖 学术资源" :
           isFrench ? "📖 Ressources Savantes" :
           isGerman ? "📖 Gelehrte Ressourcen" :
           isRussian ? "📖 Научные Ресурсы" :
           isDutch ? "📖 Wetenschappelijke Bronnen" :
           isHebrew ? "📖 משאבים מלומדים" :
           isTurkish ? "📖 İlmi Kaynaklar" :
           isBosnian ? "📖 Naučni Izvori" :
           isAlbanian ? "📖 Burime Dijetare" :
           "📖 Scholarly Resources";
  };

  const getFaqHeader = () => ({
    title: isArabic ? "الأسئلة الشائعة" :
           isUrdu ? "اکثر پوچھے جانے والے سوالات" :
           isHindi ? "अक्सर पूछे जाने वाले सवाल" :
           isBengali ? "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী" :
           isIndonesian ? "Pertanyaan yang Sering Diajukan" :
           isMalay ? "Soalan Lazim" :
           isChinese ? "常见问题解答" :
           isFrench ? "Questions Fréquemment Posées" :
           isGerman ? "Häufig gestellte Fragen" :
           isRussian ? "Часто Задаваемые Вопросы" :
           isDutch ? "Veelgestelde Vragen" :
           isHebrew ? "שאלות נפוצות" :
           isTurkish ? "Sıkça Sorulan Sorular" :
           isBosnian ? "Često Postavljana Pitanja" :
           isAlbanian ? "Pyetje të Bëra Shpesh" :
           "Frequently Asked Questions",
    subtitle: isArabic ? "أسئلة شائعة حول تطهير دخل الفائدة (الربا) وفقاً للإرشادات الإسلامية" :
              isUrdu ? "اسلامی رہنما خطوط کے مطابق سود (ربا) کی آمدنی کو پاک کرنے کے بارے میں عام سوالات" :
              isHindi ? "इस्लामी उसूलों के मुताबिक रिबा (ब्याज) की कमाई को साफ करने से जुड़े आम सवाल" :
              isBengali ? "ইসলামি নির্দেশিকা অনুযায়ী সুদ (রিবা) আয় পরিশুদ্ধ করার বিষয়ে সাধারণ প্রশ্ন" :
              isIndonesian ? "Pertanyaan umum tentang membersihkan pendapatan bunga (Riba) sesuai pedoman Islam" :
              isMalay ? "Soalan umum mengenai membersihkan pendapatan faedah (Riba) mengikut garis panduan Islam" :
              isChinese ? "根据伊斯兰指南净化利息（里巴）收入的常见问题" :
              isFrench ? "Questions courantes sur la purification des revenus d'intérêts (Riba) selon les directives islamiques" :
              isGerman ? "Häufige Fragen zur Reinigung von Zinserträgen (Riba) gemäß islamischen Richtlinien" :
              isRussian ? "Частые вопросы об очищении процентного дохода (Риба) согласно исламским руководствам" :
              isDutch ? "Veelgestelde vragen over het zuiveren van rente-inkomsten (Riba) volgens islamitische richtlijnen" :
              isHebrew ? "שאלות נפוצות על טיהור הכנסות ריבית (ריבא) על פי הנחיות אסלאמיות" :
              isTurkish ? "İslami yönergelere göre faiz (Riba) gelirini temizleme hakkında sık sorulan sorular" :
              isBosnian ? "Česta pitanja o čišćenju prihoda od kamata (Riba) prema islamskim smjernicama" :
              isAlbanian ? "Pyetje të shpeshta rreth pastrimit të të ardhurave nga interesi (Riba) sipas udhëzimeve islamike" :
              "Common questions about purifying interest (Riba) income according to Islamic guidelines"
  });

  const getResourcesHeader = () => ({
    title: isArabic ? "الموارد العلمية حول الربا" :
           isUrdu ? "ربا کے بارے میں علمی وسائل" :
           isHindi ? "रिबा पर आलिमों के रिसोर्स" :
           isBengali ? "রিবা সম্পর্কে পণ্ডিত সম্পদ" :
           isIndonesian ? "Sumber Ilmiah tentang Riba" :
           isMalay ? "Sumber Ilmiah mengenai Riba" :
           isChinese ? "关于里巴的学术资源" :
           isFrench ? "Ressources Savantes sur le Riba" :
           isGerman ? "Gelehrte Ressourcen über Riba" :
           isRussian ? "Научные Ресурсы о Риба" :
           isDutch ? "Wetenschappelijke Bronnen over Riba" :
           isHebrew ? "משאבים מלומדים על ריבא" :
           isTurkish ? "Riba Hakkında İlmi Kaynaklar" :
           isBosnian ? "Naučni Izvori o Ribi" :
           isAlbanian ? "Burime Dijetare mbi Riba" :
           "Scholarly Resources on Riba",
    subtitle: isArabic ? "فتاوى أصيلة ومقالات من علماء ومؤسسات إسلامية معترف بها" :
              isUrdu ? "تسلیم شدہ اسلامی علماء اور اداروں کی جانب سے مستند فتاوے اور مقالات" :
              isHindi ? "मशहूर इस्लामी आलिमों और संस्थानों के असली फतवे और लेख" :
              isBengali ? "স্বীকৃত ইসলামিক পণ্ডিত এবং প্রতিষ্ঠান থেকে প্রামাণিক ফতোয়া এবং নিবন্ধ" :
              isIndonesian ? "Fatwa dan artikel otentik dari ulama dan lembaga Islam yang diakui" :
              isMalay ? "Fatwa dan artikel sahih dari ulama dan institusi Islam yang diiktiraf" :
              isChinese ? "来自公认的伊斯兰学者和机构的真实教令和文章" :
              isFrench ? "Fatwas et articles authentiques d'érudits et institutions islamiques reconnus" :
              isGerman ? "Authentische Fatwas und Artikel von anerkannten islamischen Gelehrten und Institutionen" :
              isRussian ? "Подлинные фетвы и статьи от признанных исламских ученых и институтов" :
              isDutch ? "Authentieke fatwa's en artikelen van erkende islamitische geleerden en instellingen" :
              isHebrew ? "פסקי הלכה ומאמרים אותנטיים מחוקרים ומוסדות אסלאמיים מוכרים" :
              isTurkish ? "Tanınmış İslami alimler ve kurumlardan otantik fetvalar ve makaleler" :
              isBosnian ? "Autentične fetveove i članci od priznatih islamskih učenjaka i institucija" :
              isAlbanian ? "Fetva dhe artikuj autentikë nga dijetarë dhe institucione islamike të njohura" :
              "Authentic fatwas and articles from recognized Islamic scholars and institutions"
  });

  const getScholarlyArticleLabel = () => 
    isArabic ? "مقال علمي" :
    isUrdu ? "علمی مقالہ" :
    isHindi ? "आलिमों के लेख" :
    isBengali ? "পণ্ডিত নিবন্ধ" :
    isIndonesian ? "Artikel Ilmiah" :
    isMalay ? "Artikel Ilmiah" :
    isChinese ? "学术文章" :
    isFrench ? "Article Savant" :
    isGerman ? "Gelehrter Artikel" :
    isRussian ? "Научная Статья" :
    isDutch ? "Wetenschappelijk Artikel" :
    isHebrew ? "מאמר מלומד" :
    isTurkish ? "İlmi Makale" :
    isBosnian ? "Naučni Članak" :
    isAlbanian ? "Artikull Dijetar" :
    "Scholarly Article";

  const getWhyRibaContent = () => ({
    title: isArabic ? "لماذا يُحرَّم الربا (الفائدة)" :
           isUrdu ? "ربا (سود) کیوں حرام ہے" :
           isHindi ? "रिबा (ब्याज) क्यों हराम है" :
           isBengali ? "কেন রিবা (সুদ) নিষিদ্ধ" :
           isIndonesian ? "Mengapa Riba (Bunga) Dilarang" :
           isMalay ? "Mengapa Riba (Faedah) Diharamkan" :
           isChinese ? "为什么禁止里巴（利息）" :
           isFrench ? "Pourquoi le Riba (Intérêt) est Interdit" :
           isGerman ? "Warum Riba (Zinsen) Verboten ist" :
           isRussian ? "Почему Риба (Проценты) Запрещена" :
           isDutch ? "Waarom Riba (Rente) Verboden is" :
           isHebrew ? "מדוע ריבא (ריבית) אסורה" :
           isTurkish ? "Riba (Faiz) Neden Yasaktır" :
           isBosnian ? "Zašto je Riba (Kamata) Zabranjena" :
           isAlbanian ? "Pse Riba (Interesi) është e Ndaluar" :
           "Why Riba (Interest) is Prohibited",
    quranicTitle: isArabic ? "📖 المحظورات القرآنية:" :
                   isUrdu ? "📖 قرآنی ممانعت:" :
                   isHindi ? "📖 कुरान का हुक्म:" :
                   isBengali ? "📖 কোরআনিক নিষেধাজ্ঞা:" :
                   isIndonesian ? "📖 Larangan Al-Qur'an:" :
                   isMalay ? "📖 Larangan Al-Quran:" :
                   isChinese ? "📖 古兰经禁令:" :
                   isFrench ? "📖 Interdictions Coraniques:" :
                   isGerman ? "📖 Koranische Verbote:" :
                   isRussian ? "📖 Коранические Запреты:" :
                   isDutch ? "📖 Koranische Verboden:" :
                   isHebrew ? "📖 איסורים קוראניים:" :
                   isTurkish ? "📖 Kur'ani Yasaklar:" :
                   isBosnian ? "📖 Kuranske Zabrane:" :
                   isAlbanian ? "📖 Ndalesat Kuranore:" :
                   "📖 Quranic Prohibitions:",
    propheticTitle: isArabic ? "🕌 التحذيرات النبوية:" :
                     isUrdu ? "🕌 نبوی انتباہات:" :
                     isHindi ? "🕌 नबी ﷺ की चेतावनियाँ:" :
                     isBengali ? "🕌 নবীজির সতর্কতা:" :
                     isIndonesian ? "🕌 Peringatan Nabi:" :
                     isMalay ? "🕌 Amaran Nabi:" :
                     isChinese ? "🕌 先知的警告:" :
                     isFrench ? "🕌 Avertissements Prophétiques:" :
                     isGerman ? "🕌 Prophetische Warnungen:" :
                     isRussian ? "🕌 Пророческие Предупреждения:" :
                     isDutch ? "🕌 Profetische Waarschuwingen:" :
                     isHebrew ? "🕌 אזהרות נבואיות:" :
                     isTurkish ? "🕌 Peygamber Uyarıları:" :
                     isBosnian ? "🕌 Proročka Upozorenja:" :
                     isAlbanian ? "🕌 Paralajmërimet Profetike:" :
                     "🕌 Prophetic Warnings:",
    verse1: isArabic ? "الَّذِينَ يَأْكُلُونَ الرِّبَا لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ ۚ ذَٰلِكَ بِأَنَّهُمْ قَالُوا إِنَّمَا الْبَيْعُ مِثْلُ الرِّبَا ۗ وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا" :
            "Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan into insanity. That is because they say, 'Trade is [just] like interest.' But Allah has permitted trade and has forbidden interest.",
    verse2: isArabic ? "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِن كُنتُم مُّؤْمِنِينَ ۞ فَإِن لَّمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِّنَ اللَّهِ وَرَسُولِهِ" :
            "O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers. And if you do not, then be informed of a war [against you] from Allah and His Messenger.",
    hadith1: isArabic ? "لعن رسول الله ﷺ آكل الربا ومُوكِله وكاتبه وشاهديه، وقال: هم سواء" :
             isUrdu ? "نبی کریم ﷺ نے ربا کھانے والے، کھلانے والے، لکھنے والے اور اس کے گواہوں پر لعنت فرمائی اور فرمایا: یہ سب برابر ہیں" :
             isHindi ? "रसूल अल्लाह ﷺ ने रिबा खाने वाले, देने वाले, लिखने वाले और उसके दो गवाहों पर लानत की — और फरमाया: ये सब गुनाह में बराबर हैं।" :
             isBengali ? "নবী মুহাম্মদ ﷺ রিবা ভক্ষণকারী, প্রদানকারী, লিপিবদ্ধকারী এবং এর দুই সাক্ষীকে অভিশাপ দিয়েছেন, বলেছেন: তারা সবাই সমান" :
             isIndonesian ? "Nabi Muhammad ﷺ melaknat orang yang memakan Riba, yang memberikannya, yang mencatatnya, dan dua saksinya, dengan mengatakan: Mereka semua sama" :
             isMalay ? "Nabi Muhammad ﷺ melaknat orang yang memakan Riba, yang memberinya, yang mencatatnya, dan dua saksinya, dengan berkata: Mereka semua sama" :
             isChinese ? "先知穆罕默德ﷺ诅咒消费里巴的人、给予它的人、记录它的人以及两个见证人，说：他们都是一样的" :
             isFrench ? "Le Prophète Muhammad ﷺ a maudit celui qui consomme le Riba, celui qui le donne, celui qui l'enregistre et les deux témoins, en disant : Ils sont tous pareils" :
             isGerman ? "Der Prophet Muhammad ﷺ verfluchte denjenigen, der Riba konsumiert, denjenigen, der es gibt, denjenigen, der es aufzeichnet, und die beiden Zeugen, mit den Worten: Sie sind alle gleich" :
             isRussian ? "Пророк Мухаммад ﷺ проклял того, кто потребляет Рибу, того, кто дает ее, того, кто записывает ее, и двух свидетелей, говоря: Они все одинаковы" :
             isDutch ? "De Profeet Muhammad ﷺ vervloekte degene die Riba consumeert, degene die het geeft, degene die het vastlegt en de twee getuigen, zeggend: Ze zijn allemaal hetzelfde" :
             isHebrew ? "הנביא מוחמד ﷺ קילל את זה שצורך ריבא, את זה שנותן אותה, את זה שרושם אותה ואת שני העדים, אומר: כולם שווים" :
             isTurkish ? "Peygamber Muhammed ﷺ Riba'yı tüketen kişiye, onu verene, kaydedene ve iki şahidine lanet etti ve dedi ki: Hepsi aynı" :
             isBosnian ? "Poslanik Muhammed ﷺ je prokleo onoga ko konzumira Ribu, onoga ko je daje, onoga ko je bilježi i dva svjedoka, rekavši: Svi su isti" :
             isAlbanian ? "Profeti Muhamed ﷺ mallkoi atë që konsumon Riba, atë që e jep, atë që e regjistron dhe dy dëshmitarët, duke thënë: Ata janë të gjithë të njëjtë" :
             "The Prophet Muhammad ﷺ cursed the one who consumes Riba, the one who gives it, the one who records it, and the two witnesses to it, saying: <span class=\"font-semibold\">\"They are all the same.\"</span>",
    hadith2: isArabic ? "للربا سبعون جزءاً، أدناها مثل إتيان الرجل أمه" :
             isUrdu ? "ربا کے ستر درجے ہیں، ان میں سب سے کم درجہ ایسا ہے جیسے کوئی شخص اپنی ماں سے زنا کرے" :
             isHindi ? "रिबा के सत्तर दरजे हैं, और सबसे हल्का दरजा भी ऐसा है जैसे आदमी अपनी मां के साथ ज़िना करे (बहुत बड़ा गुनाह)।" :
             isBengali ? "রিবার সত্তরটি অংশ রয়েছে, সবচেয়ে কম গুরুতর একটি মানুষের তার মায়ের সাথে ব্যভিচারের সমতুল্য" :
             isIndonesian ? "Riba memiliki tujuh puluh segmen, yang paling ringan setara dengan seorang pria berzina dengan ibunya" :
             isMalay ? "Riba mempunyai tujuh puluh segmen, yang paling ringan adalah setara dengan seorang lelaki berzina dengan ibunya" :
             isChinese ? "里巴有七十个层次，最轻的相当于一个男人与他母亲乱伦" :
             isFrench ? "Le Riba a soixante-dix segments, le moins grave étant équivalent à un homme commettant l'inceste avec sa mère" :
             isGerman ? "Riba hat siebzig Segmente, wobei das am wenigsten schwerwiegende einem Mann gleichkommt, der Inzest mit seiner Mutter begeht" :
             isRussian ? "У Рибы семьдесят сегментов, наименее серьезный эквивалентен мужчине, совершающему инцест со своей матерью" :
             isDutch ? "Riba heeft zeventig segmenten, waarvan de minst ernstige equivalent is aan een man die incest pleegt met zijn moeder" :
             isHebrew ? "לריבא שבעים מקטעים, הקל ביותר שווה ערך לאדם שמבצע גילוי עריות עם אמו" :
             isTurkish ? "Riba'nın yetmiş bölümü vardır, en az ciddi olanı bir erkeğin annesiyle ensest yapmasına eşdeğerdir" :
             isBosnian ? "Riba ima sedamdeset segmenata, najmanji ozbiljan je jednak čovjeku koji čini incest sa svojom majkom" :
             isAlbanian ? "Riba ka shtatëdhjetë segmente, më pak seriozja është e barabartë me një burrë që kryen incest me nënën e tij" :
             "<span class=\"font-semibold\">\"Riba has seventy segments, the least serious being equivalent to a man committing incest with his mother.\"</span>"
  });

  const getPurificationGuide = () => ({
    title: isArabic ? "كيفية تطهير دخل الفائدة" :
           isUrdu ? "سود کی آمدنی کو کیسے پاک کریں" :
           isHindi ? "ब्याज की कमाई को कैसे साफ करें" :
           isBengali ? "সুদের আয় কীভাবে পরিশুদ্ধ করবেন" :
           isIndonesian ? "Cara Membersihkan Pendapatan Bunga" :
           isMalay ? "Cara Membersihkan Pendapatan Faedah" :
           isChinese ? "如何净化利息收入" :
           isFrench ? "Comment Purifier les Revenus d'Intérêts" :
           isGerman ? "Wie man Zinserträge Reinigt" :
           isRussian ? "Как Очистить Процентный Доход" :
           isDutch ? "Hoe Rente-inkomsten te Zuiveren" :
           isHebrew ? "כיצד לטהר הכנסות ריבית" :
           isTurkish ? "Faiz Gelirini Nasıl Temizleriz" :
           isBosnian ? "Kako Očistiti Prihod od Kamata" :
           isAlbanian ? "Si të Pastrosh të Ardhurat nga Interesi" :
           "How to Purify Interest Income",
    steps: isArabic ? [
      { title: "احسب إجمالي الفائدة", desc: "حدد المبلغ الدقيق للفائدة المكتسبة. راجع كشوف حسابك البنكي واجمع جميع أرصدة الفائدة." },
      { title: "تصدق بها دون نية الأجر", desc: "تبرع بالمبلغ بالكامل للفقراء والمحتاجين. يجب أن يتم ذلك دون توقع أي ثواب روحي - إنه مجرد التخلص من الكسب الحرام." },
      { title: "ابحث عن بدائل مصرفية إسلامية", desc: "ابحث عن البنوك الإسلامية في بلدك أو البنوك التقليدية التي تقدم حسابات متوافقة مع الشريعة. قلل من تراكم الفائدة المستقبلية." },
      { title: "تب بإخلاص", desc: "اصنع توبة صادقة (توبة) إلى الله والتزم بتجنب الفائدة في المستقبل." }
    ] : isUrdu ? [
      { title: "کل سود کا حساب لگائیں", desc: "حاصل شدہ سود کی صحیح رقم کا تعین کریں۔ اپنے بینک اسٹیٹمنٹس کا جائزہ لیں اور تمام سود کے کریڈٹس کو جمع کریں۔" },
      { title: "بغیر ثواب کی نیت کے صدقہ دیں", desc: "پوری رقم غریبوں اور ضرورت مندوں کو عطیہ کریں۔ یہ کسی بھی روحانی انعام کی توقع کے بغیر کیا جانا چاہیے - یہ صرف حرام کمائی سے نجات ہے۔" },
      { title: "اسلامی بینکنگ کے متبادل تلاش کریں", desc: "اپنے ملک میں اسلامی بینکوں یا شریعت کے مطابق اکاؤنٹس پیش کرنے والے روایتی بینکوں کی تحقیق کریں۔ مستقبل میں سود کی جمع کو کم سے کم کریں۔" },
      { title: "مخلصانہ توبہ کریں", desc: "اللہ سے سچی توبہ (توبہ) کریں اور مستقبل میں سود سے بچنے کا عہد کریں۔" }
    ] : isHindi ? [
      { title: "कुल ब्याज निकालें", desc: "अपने बैंक स्टेटमेंट में जितना भी ब्याज जमा हुआ है, सब जोड़कर सही रकम पता करें।" },
      { title: "बिना सवाब की नीयत के दान करें", desc: "पूरी रकम गरीबों और जरूरतमंदों को दें। इस पर सवाब की नीयत नहीं रखनी—ये बस नापाक कमाई से छुटकारा है।" },
      { title: "इस्लामी बैंकिंग देखें", desc: "जहां मुमकिन हो, शरिया-अनुपालन खाते या इस्लामी बैंकिंग के ऑप्शन तलाश करें, ताकि आगे ब्याज जमा न हो।" },
      { title: "सच्चे दिल से तौबा करें", desc: "अल्लाह से माफी मांगें और आगे से ब्याज से पूरी तरह बचने का इरादा करें।" }
    ] : isBengali ? [
      { title: "মোট সুদ গণনা করুন", desc: "অর্জিত সুদের সঠিক পরিমাণ নির্ধারণ করুন। আপনার ব্যাংক স্টেটমেন্ট পর্যালোচনা করুন এবং সমস্ত সুদ ক্রেডিট যোগ করুন।" },
      { title: "পুরস্কারের উদ্দেশ্য ছাড়াই দান করুন", desc: "সম্পূর্ণ পরিমাণ গরিব ও অভাবগ্রস্তদের দান করুন। এটি কোনো আধ্যাত্মিক পুরস্কার প্রত্যাশা না করেই করতে হবে - এটি কেবল অবৈধ উপার্জন নিষ্পত্তি।" },
      { title: "ইসলামিক ব্যাংকিং বিকল্প খুঁজুন", desc: "আপনার দেশে ইসলামিক ব্যাংক বা শরিয়াহ-সম্মত অ্যাকাউন্ট প্রদানকারী প্রচলিত ব্যাংক গবেষণা করুন। ভবিষ্যতের সুদ সঞ্চয় কমিয়ে দিন।" },
      { title: "আন্তরিকভাবে অনুতপ্ত হন", desc: "আল্লাহর কাছে আন্তরিক অনুশোচনা (তাওবা) করুন এবং ভবিষ্যতে সুদ এড়াতে প্রতিশ্রুতিবদ্ধ হন।" }
    ] : isIndonesian ? [
      { title: "Hitung Total Bunga", desc: "Tentukan jumlah pasti bunga yang diperoleh. Tinjau laporan bank Anda dan tambahkan semua kredit bunga." },
      { title: "Berikan ke Amal Tanpa Niat Pahala", desc: "Donasikan seluruh jumlah kepada orang miskin dan yang membutuhkan. Ini harus dilakukan tanpa mengharapkan pahala spiritual apa pun—ini hanya membuang penghasilan haram." },
      { title: "Cari Alternatif Perbankan Islam", desc: "Teliti bank Islam di negara Anda atau bank konvensional yang menawarkan akun yang sesuai dengan Syariah. Minimalkan akumulasi bunga di masa depan." },
      { title: "Bertobat Dengan Tulus", desc: "Buat pertobatan yang tulus (Taubat) kepada Allah dan berkomitmen untuk menghindari bunga di masa depan." }
    ] : isMalay ? [
      { title: "Kira Jumlah Faedah", desc: "Tentukan jumlah tepat faedah yang diperoleh. Semak penyata bank anda dan tambahkan semua kredit faedah." },
      { title: "Beri kepada Amal Tanpa Niat Ganjaran", desc: "Dermakan keseluruhan jumlah kepada orang miskin dan yang memerlukan. Ini mesti dilakukan tanpa mengharapkan sebarang ganjaran rohani—ia hanya membuang pendapatan haram." },
      { title: "Cari Alternatif Perbankan Islam", desc: "Selidik bank Islam di negara anda atau bank konvensional yang menawarkan akaun patuh Syariah. Minimalkan pengumpulan faedah masa depan." },
      { title: "Bertaubat Dengan Ikhlas", desc: "Buat pertaubatan yang ikhlas (Taubat) kepada Allah dan komited untuk mengelakkan faedah pada masa hadapan." }
    ] : isChinese ? [
      { title: "计算总利息", desc: "确定赚取利息的确切金额。查看您的银行对账单并加总所有利息贷项。" },
      { title: "无报酬意图地捐给慈善", desc: "将全部金额捐赠给穷人和需要帮助的人。这必须在不期望任何精神回报的情况下进行——这只是处理非法收入。" },
      { title: "寻找伊斯兰银行业替代方案", desc: "研究您所在国家的伊斯兰银行或提供符合伊斯兰教法账户的传统银行。尽量减少未来的利息积累。" },
      { title: "真诚悔改", desc: "向真主做出真诚的忏悔（陶巴），并承诺在未来避免利息。" }
    ] : isFrench ? [
      { title: "Calculer le Total des Intérêts", desc: "Déterminez le montant exact des intérêts gagnés. Examinez vos relevés bancaires et additionnez tous les crédits d'intérêts." },
      { title: "Donner à la Charité Sans Intention de Récompense", desc: "Faites don du montant total aux pauvres et aux nécessiteux. Cela doit être fait sans attendre de récompense spirituelle—c'est simplement se débarrasser de gains illicites." },
      { title: "Rechercher des Alternatives Bancaires Islamiques", desc: "Recherchez des banques islamiques dans votre pays ou des banques conventionnelles offrant des comptes conformes à la Charia. Minimisez l'accumulation future d'intérêts." },
      { title: "Se Repentir Sincèrement", desc: "Faites un repentir sincère (Tawbah) à Allah et engagez-vous à éviter les intérêts à l'avenir." }
    ] : isGerman ? [
      { title: "Gesamtzinsen Berechnen", desc: "Bestimmen Sie den genauen Betrag der verdienten Zinsen. Überprüfen Sie Ihre Kontoauszüge und addieren Sie alle Zinsgutschriften." },
      { title: "Ohne Absicht auf Belohnung Spenden", desc: "Spenden Sie den gesamten Betrag an Arme und Bedürftige. Dies muss ohne Erwartung einer spirituellen Belohnung erfolgen—es ist einfach die Entsorgung unrechtmäßiger Einkünfte." },
      { title: "Islamische Bankalternativen Suchen", desc: "Recherchieren Sie islamische Banken in Ihrem Land oder konventionelle Banken, die Scharia-konforme Konten anbieten. Minimieren Sie zukünftige Zinsansammlungen." },
      { title: "Aufrichtig Bereuen", desc: "Machen Sie eine aufrichtige Reue (Tawbah) zu Allah und verpflichten Sie sich, Zinsen in Zukunft zu vermeiden." }
    ] : isRussian ? [
      { title: "Рассчитать Общие Проценты", desc: "Определите точную сумму заработанных процентов. Проверьте свои банковские выписки и сложите все процентные кредиты." },
      { title: "Отдать на Благотворительность Без Намерения Награды", desc: "Пожертвуйте всю сумму бедным и нуждающимся. Это должно быть сделано без ожидания какой-либо духовной награды—это просто избавление от незаконных доходов." },
      { title: "Искать Исламские Банковские Альтернативы", desc: "Исследуйте исламские банки в вашей стране или обычные банки, предлагающие счета, соответствующие шариату. Минимизируйте будущее накопление процентов." },
      { title: "Искренне Покаяться", desc: "Совершите искреннее покаяние (Тавба) к Аллаху и обязуйтесь избегать процентов в будущем." }
    ] : isDutch ? [
      { title: "Totale Rente Berekenen", desc: "Bepaal het exacte bedrag aan verdiende rente. Controleer uw bankafschriften en tel alle rentebijschrijvingen op." },
      { title: "Aan Liefdadigheid Geven Zonder Intentie van Beloning", desc: "Doneer het volledige bedrag aan armen en behoeftigen. Dit moet worden gedaan zonder enige spirituele beloning te verwachten—het is simpelweg het wegdoen van onwettige inkomsten." },
      { title: "Islamitische Bankalternatieven Zoeken", desc: "Onderzoek islamitische banken in uw land of conventionele banken die sharia-conforme rekeningen aanbieden. Minimaliseer toekomstige renteophoping." },
      { title: "Oprecht Berouw Tonen", desc: "Doe oprechte berouw (Tawbah) tot Allah en verplicht u ertoe rente in de toekomst te vermijden." }
    ] : isHebrew ? [
      { title: "חשב סך ריבית", desc: "קבע את הסכום המדויק של הריבית שהרווחת. בדוק את דפי החשבון הבנקאיים שלך וחבר את כל זיכויי הריבית." },
      { title: "תן לצדקה ללא כוונה לתגמול", desc: "תרום את כל הסכום לעניים ולנזקקים. זה צריך להיעשות בלי לצפות לכל תגמול רוחני—זה פשוט סילוק של הכנסות לא חוקיות." },
      { title: "חפש אלטרנטיבות בנקאות אסלאמית", desc: "חקור בנקים אסלאמיים במדינה שלך או בנקים קונבנציונליים המציעים חשבונות תואמי שריעה. צמצם צבירת ריבית עתידית." },
      { title: "התחרט בכנות", desc: "עשה תשובה כנה (תובה) לאללה והתחייב להימנע מריבית בעתיד." }
    ] : isTurkish ? [
      { title: "Toplam Faizi Hesaplayın", desc: "Kazanılan faizin tam miktarını belirleyin. Banka ekstrelerinizi gözden geçirin ve tüm faiz alacaklarını toplayın." },
      { title: "Ödül Niyeti Olmadan Hayra Verin", desc: "Tüm miktarı fakirlere ve muhtaçlara bağışlayın. Bu, herhangi bir ruhani ödül beklemeden yapılmalıdır—bu sadece yasadışı kazançları bertaraf etmektir." },
      { title: "İslami Bankacılık Alternatifleri Arayın", desc: "Ülkenizdeki İslami bankaları veya Şeriat uyumlu hesaplar sunan geleneksel bankaları araştırın. Gelecekteki faiz birikimini en aza indirin." },
      { title: "Samimi Olarak Tövbe Edin", desc: "Allah'a samimi bir tövbe (Tevbe) yapın ve gelecekte faizden kaçınmayı taahhüt edin." }
    ] : isBosnian ? [
      { title: "Izračunaj Ukupnu Kamatu", desc: "Odredite tačan iznos zarađene kamate. Pregledajte svoje bankovne izvode i saberite sve kamatne kredite." },
      { title: "Daj u Dobrotvornost Bez Namjere Nagrade", desc: "Donirajte cijeli iznos siromašnima i potrebitima. Ovo treba učiniti bez očekivanja bilo kakve duhovne nagrade—to je jednostavno odlaganje nezakonitih prihoda." },
      { title: "Traži Islamske Bankovne Alternative", desc: "Istražite islamske banke u vašoj zemlji ili konvencionalne banke koje nude račune u skladu sa šerijatom. Minimizirajte buduće gomilanje kamata." },
      { title: "Iskreno se Pokaj", desc: "Učinite iskreno pokajanje (Tevba) Allahu i obavežite se da izbjegavate kamatu u budućnosti." }
    ] : isAlbanian ? [
      { title: "Llogarit Interesin Total", desc: "Përcaktoni shumën e saktë të interesit të fituar. Rishikoni deklaratat tuaja bankare dhe shtoni të gjitha kreditë e interesit." },
      { title: "Jep për Bamirësi Pa Qëllim Shpërblimi", desc: "Dhuroni shumën e plotë të varfërve dhe nevojtar�ve. Kjo duhet të bëhet pa pritur ndonjë shpërblim shpirtëror—është thjesht hedhja e të ardhurave të paligjshme." },
      { title: "Kërko Alternativa Bankare Islamike", desc: "Hulumtoni bankat islamike në vendin tuaj ose bankat konvencionale që ofrojnë llogari të përputhshme me Sheriatin. Minimizoni grumbullimin e ardhshëm të interesit." },
      { title: "Pendohu Sinqerisht", desc: "Bëni një pendim të sinqertë (Teubë) tek Allahu dhe angazhohuni të shmangni interesin në të ardhmen." }
    ] : [
      { title: "Calculate Total Interest", desc: "Determine the exact amount of interest earned. Review your bank statements and add up all interest credits." },
      { title: "Give to Charity Without Intention of Reward", desc: "Donate the entire amount to the poor and needy. This must be done without expecting any spiritual reward—it is simply disposing of unlawful earnings." },
      { title: "Seek Islamic Banking Alternatives", desc: "Research Islamic banks in your country or conventional banks offering Shariah-compliant accounts. Minimize future interest accumulation." },
      { title: "Repent Sincerely", desc: "Make sincere repentance (Tawbah) to Allah and commit to avoiding interest in the future." }
    ],
    niyyahNote: isArabic ? "📌 ملاحظة مهمة حول النية (نية): وفقاً لمجمع الفقه الإسلامي الدولي (القرار 13/2)، فإن التخلص من أموال الفائدة هو وسيلة للتطهير، وليس عمل عبادة. لذلك، يجب التخلي عنها دون نية كسب الأجر من الله." :
                  isUrdu ? "📌 نیت (نیّت) کے بارے میں اہم نوٹ: بین الاقوامی اسلامی فقہ اکیڈمی (قرارداد 13/2) کے مطابق، سود کی رقم کی نکاسی تطہیر کا ایک ذریعہ ہے، عبادت کا عمل نہیں۔ لہذا، اسے اللہ سے اجر حاصل کرنے کی نیت کے بغیر دے دینا چاہیے۔" :
                  isHindi ? "📌 अहम नोट (नीयत के बारे में): इंटरनेशनल इस्लामिक फिक़ह एकेडमी (फ़ैसला 13/2) के मुताबिक, ब्याज की रकम को देना इबादत नहीं, बल्कि नापाक माल से छुटकारा पाने का तरीका है। इसलिए इसे सवाब की नीयत के बिना देना चाहिए।" :
                  isBengali ? "📌 উদ্দেশ্য (নিয়্যাত) সম্পর্কে গুরুত্বপূর্ণ নোট: আন্তর্জাতিক ইসলামিক ফিকহ একাডেমি (রেজোলিউশন 13/2) অনুসারে, সুদের অর্থ নিষ্পত্তি পরিশোধনের একটি উপায়, উপাসনার কাজ নয়। তাই, এটি আল্লাহর কাছ থেকে পুরস্কার অর্জনের উদ্দেশ্য ছাড়াই দিয়ে দেওয়া উচিত।" :
                  isIndonesian ? "📌 Catatan Penting tentang Niat (Niyyah): Menurut Akademi Fikih Islam Internasional (Resolusi 13/2), pembuangan uang bunga adalah sarana pemurnian, bukan tindakan ibadah. Oleh karena itu, harus diberikan tanpa niat mendapatkan pahala dari Allah." :
                  isMalay ? "📌 Nota Penting tentang Niat (Niyyah): Menurut Akademi Fiqh Islam Antarabangsa (Resolusi 13/2), pembuangan wang faedah adalah cara pembersihan, bukan tindakan ibadah. Oleh itu, ia harus diberikan tanpa niat mendapat ganjaran dari Allah." :
                  isChinese ? "📌 关于意图（尼叶）的重要说明：根据国际伊斯兰教法学院（第13/2号决议），处理利息钱是净化的手段，而不是崇拜行为。因此，应该在不期望从真主那里获得回报的情况下给予。" :
                  isFrench ? "📌 Note Importante sur l'Intention (Niyyah) : Selon l'Académie Internationale de Jurisprudence Islamique (Résolution 13/2), l'élimination de l'argent d'intérêt est un moyen de purification, pas un acte de culte. Par conséquent, il doit être donné sans l'intention de gagner une récompense d'Allah." :
                  isGerman ? "📌 Wichtiger Hinweis zur Absicht (Niyyah): Laut der Internationalen Islamischen Fiqh-Akademie (Resolution 13/2) ist die Entsorgung von Zinsgeld ein Mittel zur Reinigung, kein Akt der Anbetung. Daher sollte es ohne die Absicht gegeben werden, eine Belohnung von Allah zu verdienen." :
                  isRussian ? "📌 Важное Замечание о Намерении (Ниййа): Согласно Международной Исламской Академии Фикха (Резолюция 13/2), избавление от процентных денег является средством очищения, а не актом поклонения. Поэтому это должно быть дано без намерения заработать награду от Аллаха." :
                  isDutch ? "📌 Belangrijke Opmerking over Intentie (Niyyah): Volgens de Internationale Islamitische Fiqh Academie (Resolutie 13/2) is het wegdoen van rentegeld een middel van zuivering, geen daad van aanbidding. Daarom moet het worden gegeven zonder de intentie om beloning van Allah te verdienen." :
                  isHebrew ? "📌 הערה חשובה על כוונה (ניה): לפי האקדמיה הבינלאומית לפיקה אסלאמית (החלטה 13/2), סילוק כספי ריבית הוא אמצעי לטיהור, לא מעשה פולחן. לכן, יש לתת אותו ללא כוונה להרוויח שכר מאללה." :
                  isTurkish ? "📌 Niyet (Niyet) Hakkında Önemli Not: Uluslararası İslam Fıkıh Akademisi'ne (Karar 13/2) göre, faiz parasının bertaraf edilmesi bir temizlik aracıdır, ibadet eylemi değildir. Bu nedenle, Allah'tan ödül kazanma niyeti olmadan verilmelidir." :
                  isBosnian ? "📌 Važna Napomena o Namjeri (Nijjet): Prema Međunarodnoj Islamskoj Akademiji Fikhа (Rezolucija 13/2), odlaganje novca od kamata je sredstvo pročišćavanja, a ne čin bogoslužja. Stoga treba biti dato bez namjere da se zaradi nagrada od Allaha." :
                  isAlbanian ? "📌 Shënim i Rëndësishëm mbi Qëllimin (Nijet): Sipas Akademisë Ndërkombëtare të Fikut Islamik (Rezoluta 13/2), hedhja e parave të interesit është një mjet pastrimi, jo akt adhurimi. Prandaj, duhet të jepet pa qëllimin e fitimit të shpërblimit nga Allahu." :
                  "📌 Important Note on Intention (Niyyah): According to the International Islamic Fiqh Academy (Resolution 13/2), the disposal of interest money is a means of purification, not an act of worship. Therefore, it should be given away without the intention of earning reward from Allah."
  });

  // Resources Data
  const resources = [
    {
      title: "AMJA Fatwa: Disposing of Interest Money",
      source: "Assembly of Muslim Jurists of America",
      url: "https://www.amjaonline.org/fatwa/en/4170/where-do-i-give-bank-interest-to-get-rid-of-it",
      description: "Comprehensive ruling on how to properly dispose of interest income according to Islamic jurisprudence."
    },
    {
      title: "Ruling on Interest and How to Dispose of It",
      source: "IslamQA.info - Sheikh Muhammad Salih al-Munajjid",
      url: "https://islamqa.info/en/answers/22905",
      description: "Detailed explanation of the prohibition of interest and the correct method for purification."
    },
    {
      title: "Riba: Usury or Interest",
      source: "Islamic Relief Worldwide",
      url: "https://islamic-relief.org/interest-riba/",
      description: "Educational article explaining the Islamic perspective on Riba and its contemporary applications."
    },
    {
      title: "Interest and Its Role in Economy and Life",
      source: "Jamaal al-Din Zarabozo",
      url: "https://www.muslim-library.com/dl/books/english_Interest_and_Its_Role_in_Economy_and_Life.pdf",
      description: "Scholarly analysis of interest-based economics and Islamic alternatives by renowned Islamic scholar and jurist."
    }
  ];

  // Select appropriate blog posts based on language
  const [currentPosts, setCurrentPosts] = useState<any[]>([]);

  /* PRIORITY 3 FIXED: Debounced search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Reset selected post when language changes
    setSelectedPost(null);
    
    const loadPosts = async () => {
      let posts;
      if (isArabic) {
        const module = await import('./data/blog_posts_ar');
        posts = module.BLOG_POSTS_AR;
      } else if (isUrdu) {
        const module = await import('./data/blog_posts_ur');
        posts = module.BLOG_POSTS_UR;
      } else if (isHindi) {
        const module = await import('./data/blog_posts_hi');
        posts = module.BLOG_POSTS_HI;
      } else if (isBengali) {
        const module = await import('./data/blog_posts_bn');
        posts = module.BLOG_POSTS_BN;
      } else if (isIndonesian) {
        const module = await import('./data/blog_posts_id');
        posts = module.BLOG_POSTS_ID;
      } else if (isMalay) {
        const module = await import('./data/blog_posts_ms');
        posts = module.BLOG_POSTS_MS;
      } else if (isChinese) {
        const module = await import('./data/blog_posts_zh');
        posts = module.BLOG_POSTS_ZH;
      } else if (isFrench) {
        const module = await import('./data/blog_posts_fr');
        posts = module.BLOG_POSTS_FR;
      } else if (isGerman) {
        const module = await import('./data/blog_posts_de');
        posts = module.BLOG_POSTS_DE;
      } else if (isRussian) {
        const module = await import('./data/blog_posts_ru');
        posts = module.BLOG_POSTS_RU;
      } else if (isDutch) {
        const module = await import('./data/blog_posts_nl');
        posts = module.BLOG_POSTS_NL;
      } else if (isHebrew) {
        const module = await import('./data/blog_posts_he');
        posts = module.BLOG_POSTS_HE;
      } else if (isTurkish) {
        const module = await import('./data/blog_posts_tr');
        posts = module.BLOG_POSTS_TR;
      } else if (isBosnian) {
        const module = await import('./data/blog_posts_bs');
        posts = module.BLOG_POSTS_BS;
      } else if (isAlbanian) {
        const module = await import('./data/blog_posts_sq');
        posts = module.BLOG_POSTS_SQ;
      } else {
        const module = await import('./data/blog_posts_en');
        posts = module.BLOG_POSTS_EN;
      }
      setCurrentPosts(posts);
    };
    loadPosts();
  }, [language]);

  
// Set categories based on language
const categories = isArabic 
  ? ["الكل", "فقه", "دليل", "تقني"]
  : isUrdu
  ? ["سب", "فقہ", "رہنمائی", "تکنیکی"]
  : isHindi
  ? ["सब", "फिक़्ह", "राहनुमाई", "टेक्निकल"]
  : isBengali
  ? ["সব", "ফিকহ", "গাইড", "টেকনিক্যাল"]
  : isIndonesian
  ? ["Semua", "Fiqh", "Panduan", "Teknis"]
  : isMalay
  ? ["Semua", "Fiqh", "Panduan", "Teknikal"]
  : isChinese
  ? ["全部", "教法", "指南", "技术"]
  : isFrench
  ? ["Tous", "Fiqh", "Guide", "Technique"]
  : isGerman
  ? ["Alle", "Fiqh", "Anleitung", "Technik"]
  : isRussian
  ? ["Все", "Фикх", "Гид", "Техника"]
  : isDutch
  ? ["Alle", "Fiqh", "Gids", "Techniek"]
  : isHebrew
  ? ["הכל", "פיקח", "מדריך", "טכני"]
  : isTurkish
  ? ["Tümü", "Fıkıh", "Kılavuz", "Teknik"]
  : isBosnian
  ? ["Svi", "Fikh", "Vodič", "Tehničko"]
  : isAlbanian
  ? ["Të gjitha", "Fikh", "Udhëzues", "Teknike"]
  : ["All", "Fiqh", "Guide", "Technical"];

// Reset category when language changes
useEffect(() => {
  setActiveCategory(
    isArabic ? "الكل" :
    isUrdu ? "سب" :
    isHindi ? "सभी" :
    isBengali ? "সব" :
    isIndonesian ? "Semua" :
    isMalay ? "Semua" :
    isChinese ? "全部" :
    isFrench ? "Tous" :
    isGerman ? "Alle" :
    isRussian ? "Все" :
    isDutch ? "Alle" :
    isHebrew ? "הכל" :
    isTurkish ? "Tümü" :
    isBosnian ? "Svi" :
    isAlbanian ? "Të gjitha" :
    "All"
  );
}, [language]);


  // Inject Scheherazade New for Urdu content and a helper class
  const urduFontStyle = isUrdu ? (
    <style dangerouslySetInnerHTML={{__html: DOMPurify.sanitize("@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap'); .font-urdu{font-family: 'Scheherazade New', serif;}")}} /> /* PRIORITY 1 FIXED */
  ) : null;

  const filteredPosts = currentPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||  /* PRIORITY 3 FIXED */
                          post.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase());
const allCategoryKey = isArabic ? "الكل" :
  isUrdu ? "سب" :
  isHindi ? "सभी" :
  isBengali ? "সব" :
  isIndonesian ? "Semua" :
  isMalay ? "Semua" :
  isChinese ? "全部" :
  isFrench ? "Tous" :
  isGerman ? "Alle" :
  isRussian ? "Все" :
  isDutch ? "Alle" :
  isHebrew ? "הכל" :
  isTurkish ? "Tümü" :
  isBosnian ? "Svi" :
  isAlbanian ? "Të gjitha" :
  "All";

    const matchesCategory = activeCategory === allCategoryKey || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Article View
  if (selectedPost) {
    return (
      <div className={`max-w-4xl mx-auto py-12 px-4 pb-24 md:pb-12 animate-in fade-in zoom-in-95 duration-300${isUrdu ? ' font-urdu' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
        {urduFontStyle}
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
        >
          <ArrowRight className={`rotate-180 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-0 group-hover:translate-x-1' : ''}`} size={20} />
          {isArabic ? "العودة للمدونة" : isUrdu ? "بلاگ پر واپس" : isHindi ? "ज्ञान केंद्र पर वापस जाएं" : isBengali ? "জ্ঞান কেন্দ্রে ফিরে যান" : isIndonesian ? "Kembali ke Pusat Pengetahuan" : isMalay ? "Kembali ke Pusat Pengetahuan" : isChinese ? "返回知识中心" : isFrench ? "Retour au Centre de Connaissances" : isGerman ? "Zurück zum Wissenszentrum" : isRussian ? "Вернуться в Центр Знаний" : isDutch ? "Terug naar Kenniscentrum" : isHebrew ? "חזור למרכז הידע" : isTurkish ? "Bilgi Merkezine Dön" : isBosnian ? "Povratak na Centar Znanja" : isAlbanian ? "Kthehu në Qendrën e Njohurive" : "Back to Knowledge Hub"}
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className={`h-48 ${selectedPost.color} relative`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
               <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                 {selectedPost.category}
               </span>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
             <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1"><Clock size={16}/> {selectedPost.readTime}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
             </div>

             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
               {selectedPost.title}
             </h1>

             <div className="flex items-center gap-4 mb-10 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${selectedPost.color}`}>
                  {selectedPost.author[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedPost.author}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{selectedPost.role}</p>
                </div>
             </div>

             <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
               {selectedPost.content.split('\n').map((paragraph: string, idx: number) => {
                 if (!paragraph.trim()) return null;
                 // Convert **text** to <strong>text</strong> with proper styling
                 const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
                 return (
                   <p key={idx} className="mb-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedParagraph) }} /> /* PRIORITY 1 FIXED */
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className={`max-w-6xl mx-auto py-12 px-4 pb-24 md:pb-12${isUrdu ? ' font-urdu' : ''}`}>
      {urduFontStyle}
      {/* Header */}
      <div className="text-center mb-12">
         <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{t('nav_know')}</h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('blog_subtitle')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'articles'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
          }`}
        >
          {getTabLabel('articles')}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'faq'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
          }`}
        >
          {getTabLabel('faq')}
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'resources'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
          }`}
        >
          {getTabLabel('resources')}
        </button>
      </div>

      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 mb-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{getFaqHeader().title}</h2>
            <p className="text-slate-600">{getFaqHeader().subtitle}</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`text-emerald-600 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5 pt-2 text-slate-600 leading-relaxed border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Section */}
      {activeTab === 'resources' && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{getResourcesHeader().title}</h2>
            <p className="text-slate-600">{getResourcesHeader().subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-emerald-600" size={20} />
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      {getScholarlyArticleLabel()}
                    </span>
                  </div>
                  <ExternalLink className="text-slate-400 group-hover:text-emerald-600 transition-colors" size={16} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3 font-medium">{resource.source}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{resource.description}</p>
              </a>
            ))}
          </div>

          {/* Why Riba is Prohibited */}
          <div className="mt-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={28} />
              {getWhyRibaContent().title}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-lg">{getWhyRibaContent().quranicTitle}</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <p className="text-slate-700 leading-relaxed mb-2 italic">
                      {getWhyRibaContent().verse1}
                    </p>
                    <p className="text-sm text-slate-500 font-semibold">— Quran 2:275</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <p className="text-slate-700 leading-relaxed mb-2 italic">
                      {getWhyRibaContent().verse2}
                    </p>
                    <p className="text-sm text-slate-500 font-semibold">— Quran 2:278-279</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-lg">{getWhyRibaContent().propheticTitle}</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <p className="text-slate-700 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getWhyRibaContent().hadith1) }} />
                    <p className="text-sm text-slate-500 font-semibold">— Sahih Muslim 1598</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <p className="text-slate-700 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getWhyRibaContent().hadith2) }} />
                    <p className="text-sm text-slate-500 font-semibold">— Ibn Majah 2274, authenticated by Al-Albani</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purification Guide */}
          <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Info className="text-emerald-600" size={28} />
              {getPurificationGuide().title}
            </h3>
            
            <div className="space-y-4">
              {getPurificationGuide().steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-lg p-5 border border-emerald-200 mt-6">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-emerald-700">{getPurificationGuide().niyyahNote.split(':')[0]}:</span> {getPurificationGuide().niyyahNote.split(':').slice(1).join(':')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Section (Original Blog) */}
      {activeTab === 'articles' && (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        
        {/* Categories - Mobile Optimized (Wrap instead of scroll) */}
        <div className="w-full md:w-auto order-2 md:order-1">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 transform scale-105' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 order-1 md:order-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={isArabic ? "بحث في المقالات..." : isUrdu ? "مضامین تلاش کریں..." : isHindi ? "लेख खोजें..." : isBengali ? "নিবন্ধ খুঁজুন..." : isIndonesian ? "Cari artikel..." : isMalay ? "Cari artikel..." : isChinese ? "搜索文章..." : isFrench ? "Rechercher des articles..." : isGerman ? "Artikel suchen..." : isRussian ? "Искать статьи..." : isDutch ? "Zoek artikelen..." : isHebrew ? "חפש מאמרים..." : isTurkish ? "Makale ara..." : isBosnian ? "Pretraži članke..." : isAlbanian ? "Kërko artikuj..." : "Search articles..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
             <div 
                key={i} 
                onClick={() => setSelectedPost(post)}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover-card flex flex-col h-full cursor-pointer"
             >
                {/* Decorative Header */}
                <div className={`h-3 bg-gradient-to-r ${post.color.replace('bg-', 'from-')} to-blue-500 group-hover:h-4 transition-all duration-300`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                     <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100`}>
                       {post.category}
                     </span>
                     <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                       <Clock size={12} />
                       {post.readTime}
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Author Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${post.color}`}>
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{post.author}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{post.role}</p>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 font-mono">{post.date}</span>
                  </div>
                </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
           <Search size={48} className="mx-auto text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">{isArabic ? "لا توجد مقالات" : isUrdu ? "کوئی مضمون نہیں ملا" : isHindi ? "कोई लेख नहीं मिला" : isBengali ? "কোন নিবন্ধ পাওয়া যায়নি" : isIndonesian ? "Tidak ada artikel ditemukan" : isMalay ? "Tiada artikel dijumpai" : isChinese ? "未找到文章" : isFrench ? "Aucun article trouvé" : isGerman ? "Keine Artikel gefunden" : isRussian ? "Статьи не найдены" : isDutch ? "Geen artikelen gevonden" : isHebrew ? "לא נמצאו מאמרים" : isTurkish ? "Makale bulunamadı" : isBosnian ? "Nema pronađenih članaka" : isAlbanian ? "Nuk u gjetën artikuj" : "No articles found"}</h3>
           <p className="text-slate-500">{isArabic ? "جرب تغيير البحث أو التصنيف." : isUrdu ? "اپنی تلاش یا زمرہ کو ایڈجسٹ کرنے کی کوشش کریں۔" : isHindi ? "अपनी खोज या श्रेणी को समायोजित करने का प्रयास करें।" : isBengali ? "আপনার অনুসন্ধান বা বিভাগ সামঞ্জস্য করার চেষ্টা করুন।" : isIndonesian ? "Coba sesuaikan pencarian atau kategori Anda." : isMalay ? "Cuba sesuaikan carian atau kategori anda." : isChinese ? "尝试调整您的搜索或类别。" : isFrench ? "Essayez d'ajuster votre recherche ou catégorie." : isGerman ? "Versuchen Sie, Ihre Suche oder Kategorie anzupassen." : isRussian ? "Попробуйте изменить поиск или категорию." : isDutch ? "Probeer uw zoekopdracht of categorie aan te passen." : isHebrew ? "נסה להתאים את החיפוש או הקטגוריה שלך." : isTurkish ? "Aramanızı veya kategorinizi ayarlamayı deneyin." : isBosnian ? "Pokušajte prilagoditi vašu pretragu ili kategoriju." : isAlbanian ? "Provo të rregullosh kërkimin ose kategorinë tënde." : "Try adjusting your search or category."}</p>
           <button 
             onClick={() => { setSearchQuery(""); setActiveCategory(isArabic ? "الكل" : isUrdu ? "سب" : isHindi ? "सभी" : isBengali ? "সব" : isIndonesian ? "Semua" : isMalay ? "Semua" : isChinese ? "全部" : isFrench ? "Tous" : isGerman ? "Alle" : isRussian ? "Все" : isDutch ? "Alle" : isHebrew ? "הכל" : isTurkish ? "Tümü" : isBosnian ? "Svi" : isAlbanian ? "Të gjitha" : "All"); }}
             className="mt-4 text-blue-600 font-bold hover:underline"
           >
             {isArabic ? "مسح الفلاتر" : isUrdu ? "فلٹرز صاف کریں" : isHindi ? "फ़िल्टर साफ़ करें" : isBengali ? "ফিল্টার সাফ করুন" : isIndonesian ? "Hapus Filter" : isMalay ? "Kosongkan Penapis" : isChinese ? "清除过滤器" : isFrench ? "Effacer les Filtres" : isGerman ? "Filter Löschen" : isRussian ? "Очистить Фильтры" : isDutch ? "Filters Wissen" : isHebrew ? "נקה מסננים" : isTurkish ? "Filtreleri Temizle" : isBosnian ? "Obriši Filtere" : isAlbanian ? "Pastro Filtrat" : "Clear Filters"}
           </button>
        </div>
      )}
        </>
      )}
    </div>
  );
};



// Bottom Navigation Component (Mobile Only)
const BottomNav = ({ activeView, navigateToView, t, onScanClick }: any) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" />
      <div className="relative flex justify-around items-end h-20 pb-4 px-4">
        
        {/* Dashboard */}
        <button
          onClick={() => navigateToView('dashboard')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={22} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
          <span className="text-[9px] font-medium">Home</span>
        </button>

        {/* Methodology */}
        <button
          onClick={() => navigateToView('methodology')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'methodology' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText size={22} strokeWidth={activeView === 'methodology' ? 2.5 : 2} />
          <span className="text-[9px] font-medium">Method</span>
        </button>

        {/* Knowledge */}
        <button
          onClick={() => navigateToView('knowledge')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'knowledge' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen size={22} strokeWidth={activeView === 'knowledge' ? 2.5 : 2} />
          <span className="text-[9px] font-medium">Learn</span>
        </button>

        {/* Scan FAB */}
        <div className="relative -top-6">
          <button
            onClick={onScanClick}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-300 text-white hover:bg-blue-700 transition-transform active:scale-95"
          >
            <Upload size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Purification */}
        <button
          onClick={() => navigateToView('purification')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'purification' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <RefreshCw size={22} strokeWidth={activeView === 'purification' ? 2.5 : 2} />
          <span className="text-[9px] font-medium">Clean</span>
        </button>

        {/* Manifesto */}
        <button
          onClick={() => navigateToView('manifesto')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'manifesto' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Info size={22} strokeWidth={activeView === 'manifesto' ? 2.5 : 2} />
          <span className="text-[9px] font-medium">About</span>
        </button>

        {/* Donate */}
        <button
          onClick={() => navigateToView('donate')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            activeView === 'donate' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Heart size={22} strokeWidth={activeView === 'donate' ? 2.5 : 2} fill={activeView === 'donate' ? 'currentColor' : 'none'} />
          <span className="text-[9px] font-medium">Donate</span>
        </button>

      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [files, setFiles] = useState<File[]>([]); // Lifted state
  const fileInputRef = useRef<HTMLInputElement>(null); // Global file input ref
  
  // Navigation history system for professional back button support
  const navigationHistory = useRef<ViewState[]>(['dashboard']);
  const isNavigatingBack = useRef(false);

  // Enhanced setActiveView with history tracking
  const navigateToView = useCallback((view: ViewState) => {
    if (isNavigatingBack.current) {
      isNavigatingBack.current = false;
      return;
    }
    
    setActiveView(view);
    navigationHistory.current.push(view);
    
    // Push to browser history for back button support
    window.history.pushState({ view, index: navigationHistory.current.length - 1 }, '', `#${view}`);
  }, []);

  // Handle browser/mobile back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        isNavigatingBack.current = true;
        setActiveView(event.state.view);
        
        // Update navigation history
        const targetIndex = event.state.index;
        if (targetIndex >= 0 && targetIndex < navigationHistory.current.length) {
          navigationHistory.current = navigationHistory.current.slice(0, targetIndex + 1);
        }
      } else if (navigationHistory.current.length > 1) {
        // Fallback: navigate to previous view in our history
        isNavigatingBack.current = true;
        navigationHistory.current.pop();
        const previousView = navigationHistory.current[navigationHistory.current.length - 1];
        setActiveView(previousView);
        window.history.replaceState(
          { view: previousView, index: navigationHistory.current.length - 1 }, 
          '', 
          `#${previousView}`
        );
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initialize with current state
    window.history.replaceState(
      { view: 'dashboard', index: 0 }, 
      '', 
      '#dashboard'
    );

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Mobile detection for performance optimizations with RAF throttling
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    let rafId: number;
    const resizeHandler = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkMobile);
    };
    window.addEventListener('resize', resizeHandler, { passive: true });
    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { name: 'User', email: '', joinedDate: new Date().toISOString().split('T')[0], fatwaSource: 'global' };
  });
  const [history, setHistory] = useState<PurificationRecord[]>(() => {
    const saved = localStorage.getItem('puri_history');
    return saved ? JSON.parse(saved) : [];
  });

  // i18n
  const { language, setLanguage, t } = useLanguage();

  // Scroll Reset with smooth behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  // Save History
  useEffect(() => {
    localStorage.setItem('puri_history', JSON.stringify(history));
  }, [history]);

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Toggle Riba Status Handler
  const toggleTransactionStatus = (id: string) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(txn => 
        txn.id === id 
          ? { ...txn, isRiba: !txn.isRiba, category: !txn.isRiba ? 'riba' : 'uncategorized' }
          : txn
      )
    );
  };

  // Global File Handler
  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      navigateToView('dashboard');
    }
  };

  // Direct file processing with async/await (no worker needed)
  const processFiles = async (files: File[]) => {
    setProcessingState('analyzing');

    try {
      /* PRIORITY 1 FIXED: Magic byte validation */
      const validateFileType = async (file: File): Promise<boolean> => {
        if (file.name.endsWith('.csv') || file.type === 'text/csv') return true; // CSV has no magic bytes
        
        const buffer = await file.slice(0, 4).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        
        // PDF: %PDF (25 50 44 46)
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
        }
        
        // JPEG: FF D8 FF
        if (file.type === 'image/jpeg' || file.name.match(/\.(jpg|jpeg)$/i)) {
          return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
        }
        
        // PNG: 89 50 4E 47
        if (file.type === 'image/png' || file.name.endsWith('.png')) {
          return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
        }
        
        return false;
      };

      // Validate files first
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      const ALLOWED_TYPES = ['application/pdf', 'text/csv', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const PROCESSING_TIMEOUT = 120000; // 2 minutes
      
      // Pre-validate files and filter out invalid ones
      const invalidFiles: {name: string, reason: string}[] = [];
      const validFilesPromises = files.map(async (file) => {
        // Size check
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push({name: file.name, reason: 'File too large (max 50MB)'});
          return null;
        }
        
        // Magic byte validation
        const isValidMagic = await validateFileType(file);
        if (!isValidMagic) {
          invalidFiles.push({name: file.name, reason: 'Invalid file format (magic byte mismatch)'});
          return null;
        }
        
        return file;
      });
      
      const validationResults = await Promise.all(validFilesPromises);
      const validFiles = validationResults.filter((f): f is File => f !== null);
      
      // If no valid files, abort
      if (validFiles.length === 0) {
        setProcessingState('idle');
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert(`All files were invalid:\n${invalidFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n')}`);
        return;
      }
      
      // If some files were invalid, notify user but continue
      if (invalidFiles.length > 0) {
        console.warn('Skipped invalid files:', invalidFiles);
        alert(`⚠️ Skipped ${invalidFiles.length} invalid file(s). Processing ${validFiles.length} valid file(s)...\n\n${invalidFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n')}`);
      }
      
      // Set timeout for processing
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Processing timeout')), PROCESSING_TIMEOUT)
      );
      
      const processingPromise = (async () => {
        const allLines: { text: string; page: number; fileName: string }[] = [];
        const fileResults: {fileName: string, success: boolean, reason?: string}[] = [];
        
        for (const file of validFiles) {
          // CSV Processing
          if (file.name.endsWith('.csv')) {
            const Papa = await import('papaparse');
            const text = await file.text();
            const parsed = Papa.default.parse(text, { header: true, skipEmptyLines: true });
            
            parsed.data.forEach((row: any) => {
              const rowText = Object.values(row).join(' ');
              if (rowText.trim().length > 5) {
                allLines.push({ text: rowText.trim(), page: 1, fileName: file.name });
              }
            });
            fileResults.push({fileName: file.name, success: true});
            continue;
          }
          
          // PDF Processing
          if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            try {
              const pdfjs = await getPdfJs();
              if (!pdfjs) throw new Error("Could not load PDF.js");
              
              const arrayBuffer = await file.arrayBuffer();
              const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
              const pdf = await loadingTask.promise;
              
              // Check if it looks like a bank statement
              let hasFinancialKeywords = false;
              let textSampleSize = 0;
              
              for (let i = 1; i <= Math.min(3, pdf.numPages); i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ').toLowerCase();
                textSampleSize += pageText.length;
                
                // Look for financial keywords (more comprehensive list)
                const financialKeywords = [
                  'balance', 'transaction', 'debit', 'credit', 'account', 'statement', 
                  'deposit', 'withdrawal', 'payment', 'interest', 'fee', 'bank',
                  'amount', 'total', 'date', 'description', 'reference', 'transfer',
                  'cheque', 'check', 'atm', 'pos', 'swift', 'iban', 'sort code',
                  'opening', 'closing', 'summary', 'charges', 'currency', '$', '£', '€'
                ];
                if (financialKeywords.some(kw => pageText.includes(kw))) {
                  hasFinancialKeywords = true;
                  break;
                }
              }
              
              // More lenient check - only reject if PDF has substantial content but zero financial keywords
              if (!hasFinancialKeywords && textSampleSize > 500) {
                await pdf.destroy();
                fileResults.push({fileName: file.name, success: false, reason: 'PDF does not appear to be a bank statement (no financial keywords found)'});
                console.warn(`Skipping ${file.name}: No financial keywords found`);
                continue; // Skip this file, continue with others
              }
              
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
              
              // Line bucketing algorithm
              const rows: Record<string, any[]> = {};
              const Y_TOLERANCE = 4;
              
              textContent.items.forEach((item: any) => {
                const y = item.transform[5];
                const x = item.transform[4];
                const str = item.str;
                
                const existingY = Object.keys(rows).find(yKey => 
                  Math.abs(parseFloat(yKey) - y) < Y_TOLERANCE
                );
                
                if (existingY) {
                  rows[existingY].push({ str, x });
                } else {
                  rows[y.toString()] = [{ str, x }];
                }
              });
              
              // Sort rows top-to-bottom, items left-to-right
              const sortedY = Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a));
              const lines = sortedY.map(y => {
                const rowItems = rows[y].sort((a, b) => a.x - b.x);
                return rowItems.map(i => i.str).join(" ");
              });
              
              lines.forEach(lineText => {
                if (lineText.trim().length > 5) {
                  allLines.push({ text: lineText.trim(), page: i, fileName: file.name });
                }
              });
            }
            
            await pdf.destroy();
            fileResults.push({fileName: file.name, success: true});
            continue;
          } catch (pdfError) {
            console.error('PDF processing error:', pdfError);
            // Fall through to OCR
          }
        }
        
        // Image OCR
        if (file.type.startsWith('image/')) {
          try {
            const Tesseract = await import('tesseract.js');
            const worker = await Tesseract.createWorker('eng');
            const ret = await worker.recognize(file);
            const ocrText = ret.data.text.toLowerCase();
            
            // Check if image contains financial text
            const financialKeywords = ['balance', 'transaction', 'debit', 'credit', 'account', 'statement', 'payment', 'interest'];
            const hasFinancialContent = financialKeywords.some(kw => ocrText.includes(kw)) || 
                                       /\d+[.,]\d{2}/.test(ocrText); // Has decimal numbers
            
            if (!hasFinancialContent && ocrText.length > 50) {
              await worker.terminate();
              fileResults.push({fileName: file.name, success: false, reason: 'No financial content in image'});
              console.warn(`Skipping ${file.name}: No financial content`);
              continue; // Skip this file
            }
            
            const lines = ret.data.text.split('\n');
            lines.forEach(l => {
              if (l.trim().length > 5) allLines.push({ text: l.trim(), page: 1, fileName: file.name });
            });
            
            await worker.terminate();
            fileResults.push({fileName: file.name, success: true});
          } catch (ocrError) {
            console.error('OCR error:', ocrError);
            fileResults.push({fileName: file.name, success: false, reason: 'OCR processing failed'});
            continue; // Skip this file
          }
        }
      }
      
      // Show processing summary
      const successCount = fileResults.filter(f => f.success).length;
      const failCount = fileResults.filter(f => !f.success).length;
      
      if (failCount > 0) {
        console.log(`Processing summary: ${successCount} succeeded, ${failCount} failed`);
        const failedFiles = fileResults.filter(f => !f.success);
        if (successCount === 0) {
          // All files failed
          setProcessingState('idle');
          setFiles([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          alert(`❌ All ${failCount} file(s) failed:\n\n${failedFiles.map(f => `• ${f.fileName}: ${f.reason}`).join('\n')}`);
          return;
        } else {
          // Some succeeded, some failed
          alert(`✅ Successfully processed ${successCount} file(s)\n⚠️ Skipped ${failCount} file(s):\n\n${failedFiles.map(f => `• ${f.fileName}: ${f.reason}`).join('\n')}`);
        }
      }
      
      // Check if we got any meaningful data
      if (allLines.length === 0) {
        setProcessingState('idle');
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert(t('error_no_data_found') || 'No readable data found in the uploaded files. Please ensure your files contain text.');
        return;
      }
      
      // Detect dominant currency
      const fullText = allLines.map(l => l.text).join(' ');
      const dominantCurrency = detectDominantCurrency(fullText);
      
      // Parse transactions
      const newTransactions: Transaction[] = [];
      const dateRegex = /(?:\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b)|(?:\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})|(?:\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i;
      
      allLines.forEach(({ text: line, page }) => {
        if (line.length < 5) return;
        
        const { category, isRiba, confidence, reason } = detectCategory(line);
        const dateMatch = line.match(dateRegex);
        const dateStr = dateMatch ? dateMatch[0] : null;
        const amount = parseTransactionAmount(line, dateStr);
        
        if (amount > 0) {
          let currency: Currency = dominantCurrency;
          if (line.includes('SAR')) currency = 'SAR';
          else if (line.includes('AED')) currency = 'AED';
          else if (line.includes('INR') || line.includes('₹')) currency = 'INR';
          else if (line.includes('MYR') || line.includes('RM')) currency = 'MYR';
          else if (line.includes('IDR')) currency = 'IDR';
          else if (line.includes('GBP') || line.includes('£')) currency = 'GBP';
          else if (line.includes('EUR') || line.includes('€')) currency = 'EUR';
          else if (line.includes('$') || line.includes('USD')) currency = 'USD';
          
          if (isRiba || (dateMatch && line.length > 15)) {
            newTransactions.push({
              id: Math.random().toString(36).substr(2, 9),
              date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
              description: line.substring(0, 80).trim() || "Transaction",
              amount: amount,
              originalText: line,
              isRiba: isRiba,
              currency: currency,
              category: category,
              confidence: confidence,
              reason: reason,
              page: page
            });
          }
        }
      });
      
      // Filter duplicates
      const cleanTxns = newTransactions.filter((t, index, self) => 
        !isNaN(t.amount) && 
        t.amount > 0 &&
        index === self.findIndex((x) => (
          x.description === t.description && x.amount === t.amount && x.date === t.date
        ))
      );
      
      setTransactions(cleanTxns);
      setProcessingState('complete');
      
      // Add to history
      const total = cleanTxns.filter(t => t.isRiba).reduce((acc, t) => acc + t.amount, 0);
      if (total > 0 || cleanTxns.length > 0) {
        setHistory(prev => [{
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          amount: total,
          currency: cleanTxns[0]?.currency || 'USD',
          statementName: `Scan ${prev.length + 1}`,
          itemsCount: cleanTxns.filter(t => t.isRiba).length,
          status: 'pending'
        }, ...prev]);
      }
      
      return cleanTxns; // Return for promise resolution
    })(); // End of processingPromise
    
    // Race between processing and timeout
    await Promise.race([processingPromise, timeoutPromise])
      .catch(err => {
        if (err.message === 'Processing timeout') {
          setProcessingState('idle');
          setFiles([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          alert(t('error_processing_timeout') || 'Processing is taking too long. Please try with a smaller file or contact support.');
        } else {
          throw err;
        }
      });
      
    } catch (err) {
      console.error('Processing error:', err);
      setProcessingState('idle');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert(t('error_processing_failed') || 'An error occurred while processing your files. Please try again.');
    }
  };

  const handleReset = () => {
    setProcessingState('idle');
    setTransactions([]);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`min-h-screen bg-white ${useMemo(() => LANGUAGES.find(l => l.code === language)?.fontClass || 'font-sans', [language])}`} style={{scrollBehavior: 'smooth'}}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        html { scroll-behavior: smooth; }
        * { transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; transition-duration: 200ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
        @media (prefers-reduced-motion: reduce) { *, html { scroll-behavior: auto !important; transition: none !important; } }
      `}</style>
      {/* Global File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleGlobalFileChange}
        className="hidden" 
        multiple 
        accept=".pdf,.png,.jpg,.jpeg,.csv"
      />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center gap-2 cursor-pointer"
             onClick={() => navigateToView('dashboard')}
          >
            <img src="/favicon.svg" alt="RibaPurify" className="w-8 h-8" />
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Riba<span className="text-blue-600">Purify</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar px-4">
            {[
              { id: 'dashboard', label: t('nav_dash'), icon: Home },
              { id: 'knowledge', label: t('nav_know'), icon: BookOpen },
              { id: 'methodology', label: t('nav_meth'), icon: FileText },
              { id: 'purification', label: t('nav_puri'), icon: RefreshCw },
              { id: 'donate', label: t('donate_title'), icon: Heart },
              { id: 'manifesto', label: t('nav_mani'), icon: Info },
            ].map(item => (
              <Tooltip key={item.id} text={item.label} position="bottom">
                <button
                  onClick={() => navigateToView(item.id as ViewState)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${activeView === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              </Tooltip>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher current={language} onChange={setLanguage} />
          </div>
        </div>
        

      </nav>

      <main className="min-h-[calc(100vh-64px)] bg-white relative overflow-x-hidden">
        {/* Background Grid Pattern - reduced on mobile for performance */}
        <div className={`absolute inset-0 pointer-events-none ${
          isMobile 
            ? 'bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-50'
            : 'bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]'
        }`} style={{willChange: 'opacity'}} />
        
        {/* Background Animations - Dashboard Only, disabled on mobile and heavy script languages for performance */}
        {activeView === 'dashboard' && !isMobile && !['zh', 'bn', 'hi'].includes(language) && (
          <>
            <PurificationAnimation />
            <CursorTrail />
          </>
        )}
        
        <div className="relative z-10 animate-in fade-in duration-300">
          {activeView === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile} 
              onProcess={processFiles}
              processingState={processingState}
              transactions={transactions}
              history={history}
              onReset={handleReset}
              onToggleStatus={toggleTransactionStatus} 
              t={t}
              navigateToView={navigateToView}
              files={files}
              setFiles={setFiles}
              onUploadClick={() => fileInputRef.current?.click()}
              isMobile={isMobile}
            />
          )}
          {activeView === 'knowledge' && <BlogPage t={t} language={language} />}
          {activeView === 'methodology' && <MethodologyView t={t} userProfile={userProfile} />}
          {activeView === 'manifesto' && <ManifestoView t={t} />}
          {activeView === 'purification' && <PurificationView history={history} setHistory={setHistory} onClearHistory={handleClearHistory} t={t} setActiveView={navigateToView} transactions={transactions} />}
          {activeView === 'donate' && <DonateView t={t} totalRiba={transactions.filter((t: Transaction) => t.isRiba).reduce((acc: number, t: Transaction) => acc + t.amount, 0)} currency={transactions[0]?.currency || 'USD'} />}
          {activeView === 'settings' && <SettingsView userProfile={userProfile} setUserProfile={setUserProfile} t={t} />}
        </div>

        {/* Footer - Only on landing page (industry standard) */}
        {activeView === 'dashboard' && processingState === 'idle' && transactions.length === 0 && files.length === 0 && (
          <footer className="relative z-10 bg-white py-8 px-4 mt-12 mb-20 md:mb-0">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">RibaPurify</h3>
                  <p className="text-sm text-slate-600">{t('footer_tagline')}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">{t('footer_quick_links')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigateToView('dashboard')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('nav_dash')}</button>
                    <button onClick={() => navigateToView('knowledge')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('nav_know')}</button>
                    <button onClick={() => navigateToView('methodology')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('nav_meth')}</button>
                    <button onClick={() => navigateToView('purification')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('nav_puri')}</button>
                    <button onClick={() => navigateToView('donate')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('donate_title')}</button>
                    <button onClick={() => navigateToView('manifesto')} className="text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 before:content-['•'] before:text-slate-400 transition-colors active:scale-95 transform">{t('nav_mani')}</button>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">{t('footer_features')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('footer_feature_privacy')}</p>
                      <p className="text-xs text-slate-600">{t('footer_feature_privacy_desc')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('footer_feature_local')}</p>
                      <p className="text-xs text-slate-600">{t('footer_feature_local_desc')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('footer_feature_shariah')}</p>
                      <p className="text-xs text-slate-600">{t('footer_feature_shariah_desc')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('footer_feature_knowledge')}</p>
                      <p className="text-xs text-slate-600">{t('footer_feature_knowledge_desc')}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">{t('footer_contact')}</h3>
                  <a href="mailto:contact.codeforummah@gmail.com" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2">
                    <Mail size={16} />
                    contact.codeforummah@gmail.com
                  </a>
                </div>
              </div>
              <div className="pt-6 text-center">
                <p className="text-xs text-slate-500">© 2025 RibaPurify. {t('footer_copyright')}</p>
              </div>
            </div>
          </footer>
        )}
      </main>

      <BottomNav 
        activeView={activeView} 
        navigateToView={navigateToView} 
        t={t} 
        onScanClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}// Force refresh
