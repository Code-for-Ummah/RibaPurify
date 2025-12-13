// processWorker.ts
// Web Worker for heavy file processing (PDF, OCR, CSV)

// Types
type Currency = 'USD' | 'GBP' | 'EUR' | 'INR' | 'SAR' | 'AED' | 'MYR' | 'IDR';
type Category = 'income' | 'shopping' | 'utilities' | 'transfer' | 'riba' | 'uncategorized';
type Confidence = 'high' | 'medium' | 'low';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  originalText: string;
  isRiba: boolean;
  currency: Currency;
  category: Category;
  confidence: Confidence;
  page: number;
  reason?: string;
}

// PDF.js Dynamic Import
let pdfjsLib: any = null;
const getPdfJs = async () => {
  if (pdfjsLib) return pdfjsLib;
  const version = '4.8.69';
  const pdfjs = await import(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/+esm`);
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  pdfjsLib = pdfjs;
  return pdfjs;
};

// Tesseract Dynamic Import (Lazy Load)
let tesseractModule: any = null;
const getTesseract = async () => {
  if (tesseractModule) return tesseractModule;
  tesseractModule = await import('tesseract.js');
  return tesseractModule;
};

// PapaParse Import
import Papa from 'papaparse';

// Optimized Line Bucketing Algorithm
const processPageText = (items: any[]) => {
  const rows: Record<string, any[]> = {};
  const Y_TOLERANCE = 4; // pixels

  items.forEach(item => {
    const existingY = Object.keys(rows).find(y => Math.abs(parseFloat(y) - item.y) < Y_TOLERANCE);
    
    if (existingY) {
      rows[existingY].push(item);
    } else {
      rows[item.y.toString()] = [item];
    }
  });

  // Sort rows top-to-bottom
  const sortedY = Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a));

  // Process each row
  return sortedY.map(y => {
    const rowItems = rows[y].sort((a, b) => a.x - b.x);
    return rowItems.map(i => i.str).join(" ");
  });
};

// Detect dominant currency
const detectDominantCurrency = (text: string): Currency => {
  const currencies = {
    SAR: (text.match(/SAR/gi) || []).length,
    AED: (text.match(/AED/gi) || []).length,
    INR: (text.match(/INR|₹/gi) || []).length,
    MYR: (text.match(/MYR|RM/gi) || []).length,
    IDR: (text.match(/IDR/gi) || []).length,
    GBP: (text.match(/GBP|£/gi) || []).length,
    EUR: (text.match(/EUR|€/gi) || []).length,
    USD: (text.match(/USD|\$/gi) || []).length,
  };
  return (Object.keys(currencies) as Currency[]).reduce((a, b) => currencies[a] > currencies[b] ? a : b, 'USD');
};

// Detect category
const detectCategory = (line: string): { category: Category; isRiba: boolean; confidence: Confidence; reason?: string } => {
  const lowerLine = line.toLowerCase();
  
  // High confidence RIBA indicators
  if (lowerLine.match(/interest|late fee|finance charge|overdraft|cash advance fee|apr|annual percentage rate/i)) {
    return { category: 'riba', isRiba: true, confidence: 'high', reason: 'Interest-bearing transaction' };
  }
  
  // Medium confidence
  if (lowerLine.match(/penalty|charge|fee/i) && lowerLine.match(/late|overdue|past due/i)) {
    return { category: 'riba', isRiba: true, confidence: 'medium', reason: 'Late payment fee' };
  }
  
  // Halal indicators
  if (lowerLine.match(/salary|cashback|refund|reward/i)) {
    return { category: 'income', isRiba: false, confidence: 'high' };
  }
  
  return { category: 'uncategorized', isRiba: false, confidence: 'low' };
};

// Parse transaction amount
const parseTransactionAmount = (line: string, dateStr: string | null): number => {
  let cleanLine = line;
  if (dateStr) {
    cleanLine = cleanLine.replace(dateStr, '');
  }
  
  const amountMatches = cleanLine.match(/[\d,]+\.?\d{0,2}/g);
  if (!amountMatches) return 0;
  
  const amounts = amountMatches.map(m => parseFloat(m.replace(/,/g, ''))).filter(a => a > 0);
  return amounts.length > 0 ? Math.max(...amounts) : 0;
};

// Main processing function
const processFiles = async (files: any[]) => {
  try {
    const allLines: { text: string; page: number }[] = [];
    
    for (const fileData of files) {
      // Reconstruct File from transferred ArrayBuffer
      const blob = new Blob([fileData.buffer], { type: fileData.type });
      const file = new File([blob], fileData.name, { type: fileData.type });
      
      console.log('Processing file:', file.name, file.type, 'Size:', file.size);
      
      // CSV Processing (Fast & Accurate)
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        
        parsed.data.forEach((row: any, idx: number) => {
          const rowText = Object.values(row).join(' ');
          if (rowText.trim().length > 5) {
            allLines.push({ text: rowText.trim(), page: 1 });
          }
        });
        console.log('CSV parsed:', parsed.data.length, 'rows');
        continue;
      }
      
      // PDF Processing
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          console.log('Loading PDF engine...');
          const pdfjs = await getPdfJs();
          if (!pdfjs) throw new Error("Could not load PDF engine");
          
          console.log('Parsing PDF...');
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          console.log('PDF loaded:', pdf.numPages, 'pages');
        
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Map items with coordinates
            const items = textContent.items.map((item: any) => ({
              str: item.str,
              x: item.transform[4],
              y: item.transform[5]
            }));
            
            // Use optimized line bucketing
            const lines = processPageText(items);
            lines.forEach(lineText => {
              if (lineText.trim().length > 5) {
                allLines.push({ text: lineText.trim(), page: i });
              }
            });
            
            // Memory cleanup
            textContent.items = [];
          }
          
          // Cleanup PDF document
          await pdf.destroy();
          continue;
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError);
          // Continue to try OCR fallback
        }
      }
      
      // Image OCR (Lazy loaded)
      if (file.type.startsWith('image/')) {
        const Tesseract = await getTesseract();
        const tesseractFn = Tesseract.createWorker || Tesseract.default?.createWorker;
        if (!tesseractFn) throw new Error("Tesseract not loaded");
        
        const worker = await tesseractFn('eng');
        const ret = await worker.recognize(file);
        const lines = ret.data.text.split('\n');
        
        lines.forEach((l: string) => {
          if (l.trim().length > 5) allLines.push({ text: l.trim(), page: 1 });
        });
        
        await worker.terminate();
      }
    }
    
    // Pre-Scan for Dominant Currency
    const fullText = allLines.map(l => l.text).join(' ');
    const dominantCurrency = detectDominantCurrency(fullText);
    
    // Parse Text
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
    
    // Filter duplicates & invalid amounts
    const cleanTxns = newTransactions.filter((t, index, self) => 
      !isNaN(t.amount) && 
      t.amount > 0 &&
      index === self.findIndex((x) => (
        x.description === t.description && x.amount === t.amount && x.date === t.date
      ))
    );
    
    return cleanTxns;
  } catch (err) {
    throw err;
  }
};

// Worker message handler
self.onmessage = async (event) => {
  const { files, action } = event.data;
  
  console.log('Worker received:', action, 'with', files?.length, 'files');
  
  try {
    if (action === 'process') {
      const result = await processFiles(files);
      console.log('Worker processed:', result.length, 'transactions');
      self.postMessage({ success: true, result });
    }
  } catch (error: any) {
    console.error('Worker error:', error);
    self.postMessage({ success: false, error: error.message });
  }
};
