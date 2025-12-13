# 🏗 Architecture Overview

## 📐 System Design

RibaPurify is built on a **zero-knowledge, local-first architecture** that ensures complete privacy while delivering professional-grade performance.

---

## 🎯 Design Principles

### 1. **Privacy First**
- No server communication for financial data
- Client-side processing only
- localStorage for persistence (user-controlled)

### 2. **Performance First**
- Code splitting for optimal loading
- RequestAnimationFrame throttling
- GPU-accelerated animations
- React.memo for expensive components

### 3. **Shariah First**
- AAOIFI Standard 13 compliance
- Multi-madhab considerations
- Authentic scholar references

### 4. **Accessibility First**
- WCAG 2.1 AA compliance (target)
- Keyboard navigation
- Screen reader support
- 16 languages

---

## 📂 Project Structure

```
RibaPurify/
├── src/
│   ├── index.tsx              # Main app component (4792 lines)
│   ├── translations.ts        # 16 languages (3432 lines)
│   ├── data/
│   │   ├── blog_posts_en.ts   # English blog posts
│   │   ├── blog_posts_ar.ts   # Arabic blog posts
│   │   ├── blog_posts_ur.ts   # Urdu blog posts
│   │   └── ... (16 languages)
│   └── assets/
│       └── fonts/             # Noto Sans Arabic (optimized)
├── public/
│   └── index.html             # Entry point
├── vite.config.ts             # Build configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── README.md                  # Documentation
├── CONTRIBUTING.md            # Contribution guide
├── LICENSE                    # MIT License
└── .gitignore                 # Git ignore rules
```

---

## 🔄 Data Flow

### Upload Flow

```
User Upload
    ↓
File Type Detection (PDF/CSV/Image)
    ↓
┌─────────────────────────────────────┐
│  PDF.js (PDF)                       │
│  PapaParse (CSV)                    │
│  Tesseract.js (OCR for images)     │
└─────────────────────────────────────┘
    ↓
Transaction Extraction
    ↓
Riba Classification (Keyword Matching)
    ↓
State Management (useState)
    ↓
UI Rendering (React)
    ↓
localStorage Persistence
```

### Navigation Flow

```
User Action
    ↓
navigateToView() callback
    ↓
┌─────────────────────────────────────┐
│  1. Update activeView state         │
│  2. Push to navigation history      │
│  3. Update browser history          │
└─────────────────────────────────────┘
    ↓
Smooth Fade Transition (300ms)
    ↓
New View Rendered
```

### Back Button Flow

```
Browser Back Button
    ↓
popState Event Listener
    ↓
┌─────────────────────────────────────┐
│  1. Check navigation history        │
│  2. Pop last state                  │
│  3. Update activeView               │
└─────────────────────────────────────┘
    ↓
Smooth Fade Transition (300ms)
    ↓
Previous View Restored
```

---

## 🧩 Core Components

### 1. **App Component** (`index.tsx`)
Main orchestrator containing all views and state management.

**Key State:**
```tsx
const [activeView, setActiveView] = useState<ViewState>('dashboard');
const [language, setLanguage] = useState<LanguageCode>('en');
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [ribaTotal, setRibaTotal] = useState(0);
```

**Key Functions:**
```tsx
navigateToView(view: ViewState) // Navigation with history
handleFileUpload(file: File)     // File processing
classifyTransaction(desc: string) // Riba detection
```

### 2. **Dashboard View**
File upload interface with drag-and-drop, format selection, and privacy badges.

### 3. **Learn View**
Educational content with methodology, FAQs, and Shariah resources.

### 4. **Results View**
Transaction table with Riba/Halal/Shubhah categorization, export, and disposal guidance.

### 5. **BlogPage Component**
Knowledge hub with articles in 16 languages, lazy-loaded for performance.

### 6. **BottomNav Component** (Mobile)
7-button navigation: Home, Method, Learn, FAB, Clean, About, Donate.

### 7. **FloatingActionButton**
Central button with 4 quick actions: Learn, Clean, About, Donate.

---

## 🛠 Tech Stack Details

### **React 19**
- Concurrent features for smooth UX
- useState for local state
- useEffect for side effects
- useCallback for memoized functions
- useMemo for expensive calculations
- React.memo for component memoization

### **TypeScript 5.8**
- Strict mode enabled
- Interface-driven development
- Type safety for transactions, translations

### **Vite 6**
- Lightning-fast HMR (Hot Module Replacement)
- ES modules for modern browsers
- Code splitting for optimal loading

### **Tailwind CSS**
- Utility-first styling
- Mobile-first responsive design
- Dark mode support (`dark:` variants)

---

## ⚡ Performance Optimizations

### 1. **Code Splitting**
```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'pdf-vendor': ['pdfjs-dist'],
  'blog-translations': [
    './src/data/blog_posts_en',
    './src/data/blog_posts_ar',
    // ... 16 languages
  ],
  'ui-vendor': ['lucide-react', 'dompurify']
}
```

**Result:**
- Main: 450KB
- React: 194KB
- PDF: 448KB
- Blog: 184KB
- UI: 22KB

### 2. **RequestAnimationFrame Throttling**
```typescript
useEffect(() => {
  let rafId: number;
  const handleResize = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      setIsMobile(window.innerWidth < 768);
      rafId = 0;
    });
  };
  window.addEventListener('resize', handleResize, { passive: true });
}, []);
```

### 3. **Passive Event Listeners**
```typescript
{ passive: true } // Non-blocking scroll/resize
```

### 4. **CSS Containment**
```css
.container {
  contain: layout style paint;
  content-visibility: auto;
}
```

### 5. **GPU Acceleration**
```css
.animate {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

### 6. **React.memo**
```typescript
const MobileCard = React.memo(({ transaction }: Props) => {
  // Component never re-renders unless transaction changes
});
```

### 7. **Lazy Loading**
```typescript
const currentPosts = useMemo(() => {
  // Load only visible blog posts
  return allPosts.slice(0, 15);
}, [allPosts]);
```

---

## 🔒 Security Considerations

### 1. **XSS Prevention**
```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

### 2. **File Validation**
```typescript
const validTypes = ['application/pdf', 'text/csv', 'image/png', 'image/jpeg'];
if (!validTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

### 3. **Size Limits**
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large');
}
```

### 4. **localStorage Encryption**
Currently plain-text, but future improvement:
```typescript
// TODO: Encrypt before storing
const encrypted = encryptData(JSON.stringify(transactions));
localStorage.setItem('transactions', encrypted);
```

---

## 🌐 Internationalization (i18n)

### Translation System

**Structure:**
```typescript
interface Translations {
  [key: string]: {
    hero_title: string;
    hero_subtitle: string;
    cta_upload: string;
    // ... 200+ keys
  };
}
```

**Usage:**
```typescript
const t = translations[language];
<h1>{t.hero_title}</h1>
```

**Blog System:**
```typescript
// Dynamic import for code splitting
const blogModule = await import(`./data/blog_posts_${language}.ts`);
const posts = blogModule.blogPosts;
```

---

## 📱 Mobile Optimization

### Responsive Breakpoints
```typescript
const isMobile = window.innerWidth < 768;   // Mobile
const isTablet = window.innerWidth < 1024;  // Tablet
const isDesktop = window.innerWidth >= 1024; // Desktop
```

### Mobile-Specific Features
- **BottomNav** - 7-button navigation (55px height)
- **Touch Gestures** - Swipe support (future)
- **Reduced Animations** - 8 particles vs 15 on desktop
- **Pagination** - 15 items vs 30 on desktop
- **Grid Opacity** - 50% vs 30% on desktop

---

## 🧪 Testing Strategy

### Manual Testing
- ✅ PDF upload (small, medium, large)
- ✅ CSV upload (valid, invalid)
- ✅ OCR image processing
- ✅ Mobile responsive design
- ✅ Dark mode
- ✅ All 16 languages
- ✅ Browser back button
- ✅ Export functionality

### Future Automated Testing
```typescript
// Unit tests with Jest
describe('classifyTransaction', () => {
  it('should detect interest as Riba', () => {
    const result = classifyTransaction('Interest Paid $50');
    expect(result).toBe('riba');
  });
});

// E2E tests with Playwright
test('should upload and analyze CSV', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('#file-upload', 'test.csv');
  await expect(page.locator('.riba-total')).toBeVisible();
});
```

---

## 🚀 Deployment

### Build Process

```bash
npm run build
```

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      (450KB)
│   ├── react-vendor-[hash].js (194KB)
│   ├── pdf-vendor-[hash].js  (448KB)
│   └── ... (other chunks)
└── fonts/
    └── NotoSansArabic-[hash].woff2
```

### Hosting Options

1. **Vercel** (Recommended)
   - Zero config
   - Auto HTTPS
   - Edge network
   - Free tier

2. **Netlify**
   - Drag & drop deployment
   - Auto HTTPS
   - Form handling

3. **GitHub Pages**
   - Free static hosting
   - Custom domain support

4. **Self-Hosted**
   - Nginx/Apache
   - Full control
   - HTTPS with Let's Encrypt

### Environment Variables
None needed - 100% client-side!

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Encryption** - localStorage encryption
- [ ] **Export Formats** - Excel, JSON
- [ ] **Custom Rules** - User-defined Riba keywords
- [ ] **Multi-Account** - Multiple bank statements
- [ ] **Zakat Calculator** - Integrated Zakat calculation
- [ ] **PWA** - Offline-first Progressive Web App
- [ ] **Browser Extension** - Auto-detect Riba on banking sites
- [ ] **Mobile Apps** - React Native iOS/Android

### Performance Goals
- [ ] **<3s Initial Load** - Currently 4.96s build
- [ ] **<100ms Interaction** - Instant UI updates
- [ ] **<50KB Main Bundle** - Further code splitting

### Accessibility Goals
- [ ] **WCAG 2.1 AAA** - Highest accessibility standard
- [ ] **Screen Reader Testing** - VoiceOver, NVDA
- [ ] **Keyboard Shortcuts** - Power user features

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📧 Contact

- **GitHub Issues** - Technical discussions
- **Email** - contact@codeforummah.org
- **Discord** - Community chat

---

Built with ❤️ by Muslims, for Muslims.

**May Allah accept this effort and guide the Ummah. Ameen.**
