# 🕌 RibaPurify - Purify Your Wealth from Riba

<img width="1429" height="749" alt="Screenshot 2025-12-14 at 4 43 30 AM" src="https://github.com/user-attachments/assets/040cd912-ed84-439c-a3b5-5dcddd31cbcf" />

<div align="center">

**Zero-Knowledge · Local-First · Shariah-Compliant**

*"Allah has permitted trade and has forbidden Riba (interest)." - Quran 2:275*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

</div>

---

## 📖 Table of Contents

- [🎯 Vision & Mission](#-vision--mission)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [💡 How It Works](#-how-it-works)
- [🌍 Multi-Language Support](#-multi-language-support)
- [🔒 Privacy & Security](#-privacy--security)
- [🛠 Tech Stack](#-tech-stack)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Vision & Mission

### **The Problem**
Banking systems worldwide mix prohibited interest (Riba) with halal money by default. For Muslims, manually separating this is tedious, anxiety-inducing, and error-prone. Many Muslims unknowingly carry impure wealth, violating one of Islam's most serious prohibitions.

### **Our Solution**
RibaPurify automates Riba detection **locally on your device** with absolute privacy. We provide a tool that is:
- ✅ **Precise** - AI-powered transaction classification
- ✅ **Private** - Zero data ever leaves your device
- ✅ **Free** - Forever, for the entire Ummah
- ✅ **Shariah-Compliant** - Adheres to AAOIFI Standard 13

### **The Vision**
Building the **"Bitwarden of Islamic Finance"** - A privacy-first, uncompromising, and accessible tool that helps Muslims worldwide fulfill their religious obligation with peace of mind.

---

## ✨ Features

### 🔍 **Intelligent Riba Detection**
- **PDF Support** - Reads bank statements directly
- **CSV Support** - 10x faster, 100% accurate
- **OCR Support** - Scan images of statements
- **Multi-Currency** - Supports USD, EUR, GBP, AED, SAR, PKR, INR, BDT
- **Smart Classification** - Distinguishes between Riba, Shubhah (doubtful), and Halal

### 🛡️ **Zero-Knowledge Privacy**
- **Local-First Architecture** - All processing happens in your browser
- **No Server Uploads** - Your financial data never leaves your hands
- **Offline Capable** - Works without internet after first load
- **No Tracking** - Zero analytics, zero cookies, zero surveillance

### 📚 **Knowledge Hub**
- **16 Languages** - Articles in Arabic, Urdu, Hindi, Bengali, and more
- **Fiqh Resources** - Fatwas from AAOIFI, ECFR, AMJA
- **Disposal Guidance** - Step-by-step instructions for purification
- **Scholar Resources** - Authentic Islamic sources

### 💰 **Purification Management**
- **History Tracking** - Monitor your purification journey
- **Certificate Export** - Generate PDF certificates
- **Donation Links** - Verified charities for disposal
- **Dua Integration** - Islamic supplications for protection

### 🎨 **Professional UX**
- **Smooth Animations** - 60fps with GPU acceleration
- **Mobile Optimized** - 7-button navigation, touch gestures
- **Dark Patterns** - Grid backgrounds, blur effects
- **Back Navigation** - Browser history integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Code-for-Ummah/RibaPurify.git

# Navigate to directory
cd RibaPurify

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
# Build output is in /dist folder
npm run build

# Deploy dist/ folder to your hosting provider
```

---

## 💡 How It Works

### 1️⃣ **Upload**
Drop your bank statement (PDF, CSV, or image) into the browser.

### 2️⃣ **Local Processing**
- PDF.js extracts text from PDFs
- Tesseract.js performs OCR on images
- PapaParse handles CSV files
- All processing happens **in your browser**

### 3️⃣ **Classification**
Smart keyword matching categorizes transactions:
- **Riba (Haram)** - Interest paid, late fees, overdraft charges
- **Shubhah (Doubtful)** - Signup bonuses, unclear fees
- **Halal (Permissible)** - Cashback, refunds, transfers

### 4️⃣ **Review & Purify**
- Review detected transactions
- Manually adjust classifications
- Export purification certificate
- Dispose according to Shariah guidelines

---

## 🌍 Multi-Language Support

RibaPurify supports **16 languages** with full translations:

| Language | Code | Native Name | Status |
|----------|------|-------------|--------|
| English | `en` | English | ✅ |
| Arabic | `ar` | العربية | ✅ |
| Urdu | `ur` | اردو | ✅ |
| Hindi | `hi` | हिंदी | ✅ |
| Bengali | `bn` | বাংলা | ✅ |
| Indonesian | `id` | Bahasa Indonesia | ✅ |
| Malay | `ms` | Bahasa Melayu | ✅ |
| Chinese | `zh` | 简体中文 | ✅ |
| French | `fr` | Français | ✅ |
| German | `de` | Deutsch | ✅ |
| Russian | `ru` | Русский | ✅ |
| Dutch | `nl` | Nederlands | ✅ |
| Hebrew | `he` | עברית | ✅ |
| Turkish | `tr` | Türkçe | ✅ |
| Bosnian | `bs` | Bosanski | ✅ |
| Albanian | `sq` | Shqip | ✅ |

**Blog & Knowledge Hub** - Fully translated articles on Riba, disposal methods, and Islamic finance.

---

## 🌱 ScreenShots

(Landing Page)

<img width="1234" height="751" alt="Screenshot 2025-12-14 at 4 49 02 AM" src="https://github.com/user-attachments/assets/b54d0ab8-b445-4f5f-8662-561025006685" />
<img width="1215" height="743" alt="Screenshot 2025-12-14 at 4 49 14 AM" src="https://github.com/user-attachments/assets/fbc62229-9622-4d12-9948-1d7d21d78301" />

More will be added later inshaAllah




## 🔒 Privacy & Security

### **How We Protect Your Data**

1. **No Server Communication**
   - Zero files uploaded to external servers
   - All processing happens client-side
   - No API calls with financial data

2. **No Tracking**
   - No Google Analytics
   - No cookies
   - No user profiling

3. **Open Source**
   - Fully transparent codebase
   - Community auditable
   - No hidden telemetry

4. **Local Storage Only**
   - Data stored in browser localStorage
   - You control deletion
   - No cloud backups

### **Security Best Practices**
- Regular dependency updates
- Terser minification with console removal
- CSP headers recommended for deployment
- HTTPS required for production

---

## 🛠 Tech Stack

### **Frontend**
- **React 19** - Latest with concurrent features
- **TypeScript** - Type safety
- **Vite 6** - Lightning-fast builds (4.96s)
- **Tailwind CSS** - Utility-first styling

### **PDF Processing**
- **PDF.js** - Mozilla's PDF rendering engine
- **Tesseract.js** - OCR for scanned documents
- **PapaParse** - CSV parsing

### **UI/UX**
- **Lucide Icons** - Beautiful icon set
- **DOMPurify** - XSS protection
- **CSS Animations** - 60fps GPU-accelerated

### **Optimization**
- **Code Splitting** - 5 vendor chunks
- **Terser** - Production minification
- **RequestAnimationFrame** - Smooth scrolling
- **React.memo** - Prevent re-renders

### **Bundle Size**
```
Main Bundle:     450.60 KB (minified)
React Vendor:    194.59 KB
PDF Vendor:      448.41 KB
Blog Data:       184.14 KB
UI Vendor:       22.71 KB

Total:           ~1.3 MB (excellent for features)
Build Time:      4.96s
```

---

## 🤝 Contributing

We welcome contributions from the Ummah! 

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Areas for Contribution**
- 🌐 **Translations** - Add new languages
- 📝 **Blog Content** - Write Islamic finance articles
- 🎨 **UI/UX** - Design improvements
- 🐛 **Bug Fixes** - Report and fix issues
- 📚 **Documentation** - Improve docs
- 🧪 **Testing** - Write unit tests

### **Guidelines**
- Follow existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Why MIT?**
We chose MIT to ensure:
- ✅ **Maximum Freedom** - Use, modify, distribute freely
- ✅ **Commercial Use** - Build derivative products
- ✅ **No Copyleft** - No restrictive licensing
- ✅ **Ummah First** - Benefit the entire Muslim community

---

## 🌟 Acknowledgments

### **Allah (SWT)**
All praise to Allah who guided us to create this tool.

### **Islamic Scholars**
- AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)
- ECFR (European Council for Fatwa and Research)
- AMJA (Assembly of Muslim Jurists of America)

### **Open Source Community**
- Mozilla (PDF.js)
- Tesseract OCR Team
- React Team
- Vite Team

### **Contributors**
Thank you to all who contributed to making this project better!

---

## 📧 Contact & Support

- **GitHub Issues** - [Report bugs](https://github.com/Code-for-Ummah/RibaPurify/issues)
- **Email** - contact@codeforummah.gmail.com
- **Website** - )

---

## 🕌 For the Ummah

> *"By Allah, I don't have any 'Future Plans' to monetize your data or sell you credit cards. This tool is an Amanah (trust). Use it, purify your wealth, and make Dua for the Ummah."*

Built with ❤️ by Muslims, for Muslims.

**May Allah accept this effort and purify our wealth. Ameen.**

---

<div align="center">

### ⭐ Star this repository if it helped you!

[![GitHub stars](https://img.shields.io/github/stars/Code-for-Ummah/RibaPurify?style=social)](https://github.com/Code-for-Ummah/RibaPurify/stargazers)

</div>
