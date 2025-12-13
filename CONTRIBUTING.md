# Contributing to RibaPurify 🤝

First off, **JazakAllah Khair** (May Allah reward you with goodness) for considering contributing to RibaPurify! This project is an Amanah (trust) for the Ummah, and every contribution helps Muslims worldwide purify their wealth.

## 📖 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Translation Guidelines](#translation-guidelines)
- [Blog Content Guidelines](#blog-content-guidelines)

---

## 🕌 Code of Conduct

### Our Islamic Values
This project adheres to Islamic ethics and values:

- **Ihsan (Excellence)** - Strive for the best quality code
- **Amanah (Trustworthiness)** - Respect user privacy and data
- **Adab (Good Manners)** - Be respectful in all interactions
- **Niyyah (Intention)** - Keep the intention pure for Allah's sake

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the Ummah
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Political or divisive discussions unrelated to the project
- Publishing others' private information

---

## 🛠 How Can I Contribute?

### 1️⃣ **Report Bugs**

If you find a bug, please create an issue with:
- **Clear title** - Describe the issue in one line
- **Steps to reproduce** - How to trigger the bug
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - Browser, OS, device type

**Example:**
```
Title: PDF upload fails on Safari iOS 15

Steps:
1. Open RibaPurify on Safari iOS 15
2. Click "Upload PDF"
3. Select a 5MB bank statement PDF

Expected: PDF should upload and parse
Actual: Nothing happens, console shows error
```

### 2️⃣ **Suggest Features**

We love ideas! Create an issue with:
- **Feature description** - What you want
- **Use case** - Why it's needed
- **Shariah compliance** - Does it align with Islamic values?
- **Implementation ideas** - Optional technical details

### 3️⃣ **Translate to New Languages**

We need help with:
- Somali, Swahili, Persian, Pashto, Kurdish
- Improving existing translations
- Adding region-specific terminology

See [Translation Guidelines](#translation-guidelines) below.

### 4️⃣ **Write Blog Content**

Help us educate the Ummah:
- Articles on Riba and Islamic finance
- Fatwas from reputable scholars
- Disposal methods in different countries
- Real-world case studies

See [Blog Content Guidelines](#blog-content-guidelines) below.

### 5️⃣ **Improve Code**

Areas we need help:
- **Performance** - Optimize parsing, rendering
- **Accessibility** - WCAG 2.1 AA compliance
- **Mobile UX** - Better touch interactions
- **Testing** - Unit tests, E2E tests
- **Documentation** - Code comments, JSDoc

---

## 💻 Development Setup

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm or yarn**
- **Git**

### Fork & Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/RibaPurify.git
cd RibaPurify

# Add upstream remote
git remote add upstream https://github.com/Code-for-Ummah/RibaPurify.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📐 Coding Standards

### TypeScript
- Use **TypeScript** for all new code
- Define interfaces for props and state
- Avoid `any` type - use `unknown` if needed
- Use strict mode

**Example:**
```tsx
interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: 'riba' | 'halal' | 'shubhah';
}

const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  // Component code
};
```

### React
- Use **functional components** with hooks
- Prefer `const` over `let`
- Use `React.memo` for expensive components
- Extract reusable logic into custom hooks

**Example:**
```tsx
const useRibaDetection = (transactions: Transaction[]) => {
  const [ribaTotal, setRibaTotal] = useState(0);
  
  useEffect(() => {
    const total = transactions
      .filter(t => t.category === 'riba')
      .reduce((sum, t) => sum + t.amount, 0);
    setRibaTotal(total);
  }, [transactions]);
  
  return ribaTotal;
};
```

### Styling
- Use **Tailwind CSS** utility classes
- Follow mobile-first approach
- Use `dark:` variants for dark mode
- Keep responsive breakpoints consistent

**Example:**
```tsx
<div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
    Riba Detected
  </h2>
</div>
```

### Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Implement virtualization for long lists
- Lazy load heavy components

**Example:**
```tsx
const ribaTotal = useMemo(() => 
  transactions
    .filter(t => t.category === 'riba')
    .reduce((sum, t) => sum + t.amount, 0),
  [transactions]
);

const handleExport = useCallback(() => {
  exportToPDF(transactions);
}, [transactions]);
```

---

## 📝 Commit Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation only
- **style** - Formatting, missing semicolons, etc
- **refactor** - Code restructuring
- **perf** - Performance improvement
- **test** - Adding tests
- **chore** - Maintenance tasks

### Examples

**Good:**
```
feat(translations): Add Somali language support

- Added so.json with complete translations
- Updated language selector
- Added Somali blog posts

Closes #123
```

**Good:**
```
fix(pdf): Handle malformed bank statement PDFs

Previous code crashed on PDFs with non-standard encoding.
Now gracefully falls back to OCR.

Fixes #456
```

**Bad:**
```
fixed stuff
```

---

## 🔄 Pull Request Process

### 1️⃣ **Create a Feature Branch**

```bash
git checkout -b feature/somali-translations
```

### 2️⃣ **Make Your Changes**

- Write clean, documented code
- Follow coding standards above
- Test thoroughly

### 3️⃣ **Commit with Good Messages**

```bash
git add .
git commit -m "feat(translations): Add Somali language support"
```

### 4️⃣ **Sync with Upstream**

```bash
git fetch upstream
git rebase upstream/main
```

### 5️⃣ **Push to Your Fork**

```bash
git push origin feature/somali-translations
```

### 6️⃣ **Open Pull Request**

- Go to GitHub and click "New Pull Request"
- Fill out the template:
  - **What** - What does this PR do?
  - **Why** - Why is this change needed?
  - **How** - How did you implement it?
  - **Screenshots** - If UI changes
  - **Testing** - How did you test it?

### 7️⃣ **Address Review Comments**

- Be open to feedback
- Make requested changes
- Push updates to the same branch

### 8️⃣ **Squash & Merge**

Once approved, maintainers will merge your PR!

---

## 🌐 Translation Guidelines

### Adding a New Language

1. **Create Translation File**

```bash
cp src/data/translations/en.json src/data/translations/so.json
```

2. **Translate All Keys**

- Keep keys identical to English
- Translate values accurately
- Preserve formatting (`{variable}` placeholders)
- Use formal/respectful tone

3. **Test Translations**

```bash
npm run dev
# Change language to Somali and check all screens
```

4. **Add Language to Selector**

Edit `src/components/LanguageSelector.tsx`:

```tsx
const languages = [
  // ... existing languages
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' }
];
```

5. **Add Blog Posts**

Create `src/data/blog_posts_so.ts` with translated articles.

### Translation Quality Standards

- **Accuracy** - Preserve meaning, not just words
- **Cultural Sensitivity** - Use appropriate Islamic terminology
- **Clarity** - Avoid ambiguity
- **Consistency** - Use same terms throughout
- **Formality** - Use respectful, formal tone

### Islamic Terms

**Keep these in Arabic** with transliteration:
- Riba (ربا)
- Halal (حلال)
- Haram (حرام)
- Shubhah (شبهة)
- Zakat (زكاة)
- Sadaqah (صدقة)

---

## 📚 Blog Content Guidelines

### Article Structure

```markdown
# Title

## Introduction
Brief overview (2-3 sentences)

## Main Content
Detailed explanation with headings

## Shariah Rulings
Relevant fatwas and scholar opinions

## Practical Steps
Actionable guidance

## Sources
- Scholar citations
- Fatwa references
- Quranic verses
```

### Content Requirements

- **Authenticity** - Cite reputable scholars (AAOIFI, ECFR, AMJA)
- **Clarity** - Simple language, avoid jargon
- **Practicality** - Actionable advice
- **Balance** - Present different scholarly opinions fairly
- **Evidence** - Provide Quranic/Hadith sources

### Example Blog Post

```typescript
{
  id: 'riba-definition',
  title: 'What is Riba? A Complete Guide',
  excerpt: 'Understanding the prohibition of interest in Islam',
  content: `
    # What is Riba?
    
    Riba (ربا) literally means "increase" or "growth" in Arabic...
    
    ## Types of Riba
    
    ### 1. Riba al-Nasiah (Interest)
    Interest charged on loans...
    
    ### 2. Riba al-Fadl (Excess)
    Unequal exchange of commodities...
    
    ## Shariah Ruling
    
    According to AAOIFI Standard 13...
    
    ## How to Purify
    
    1. Calculate total Riba received
    2. Donate to charity immediately
    3. Make sincere repentance
    
    ## Sources
    
    - Quran 2:275-280
    - AAOIFI Shariah Standard 13
    - ECFR Fatwa 18/2
  `,
  category: 'fiqh',
  date: '2024-01-15',
  readTime: 5
}
```

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] PDF upload (small, medium, large files)
- [ ] CSV upload (valid, invalid formats)
- [ ] OCR image processing
- [ ] Transaction classification accuracy
- [ ] Mobile responsive design
- [ ] Dark mode
- [ ] All languages
- [ ] Browser back button
- [ ] Export functionality

### Browser Testing

Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## 🆘 Getting Help

- **Discord** - [Join our community](https://discord.gg/codeforummah)
- **GitHub Issues** - Ask questions in issues
- **Email** - contact@codeforummah.org

---

## 🌟 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to contributor-only discussions
- Rewarded by Allah for helping the Ummah (Insha'Allah)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**JazakAllah Khair for contributing! May Allah accept your efforts. Ameen.**

Built with ❤️ by Muslims, for Muslims.
