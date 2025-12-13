
const BLOG_POSTS_MS = [
  {
    title: "Memahami Riba",
    excerpt: "Pengetahuan adalah langkah pertama ke arah kesucian kewangan.",
    category: "Fiqh",
    readTime: "7 minit",
    date: "12 Dis 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Apa itu Riba?
Riba adalah perkataan Arab yang bermaksud 'pertambahan' atau 'lebihan'. Dalam kewangan Islam, riba merujuk kepada faedah atau riba — pertambahan tetap dan telah ditentukan ke atas pinjaman atau hutang, yang sangat diharamkan (haram).

Larangan ini bukan sekadar untuk elak eksploitasi. Ia prinsip teras ekonomi Islam yang menggalakkan keadilan, kesaksamaan, dan berkongsi risiko.

Mengapa Riba diharamkan?
Al-Quran dan Sunnah dengan jelas dan tegas mengharamkan riba. Ia dianggap dosa besar kerana mewujudkan sistem di mana kekayaan tumbuh dari wang itu sendiri tanpa sebarang aktiviti produktif sebenar atau perkongsian risiko.

"Wahai orang-orang yang beriman! Bertakwalah kepada Allah dan tinggalkan baki riba jika kamu orang beriman. Jika kamu tidak berbuat demikian, maka ketahuilah bahawa Allah dan Rasul-Nya mengisytiharkan perang terhadap kamu." (Al-Quran 2:278-279)
`
  },
  {
    title: "Riba: Jenis, Masalah Perbankan Konvensional, dan Cara Menyucikan",
    excerpt: "Jenis-jenis riba, mengapa perbankan konvensional bermasalah, dan langkah-langkah menyucikan harta.",
    category: "Panduan",
    readTime: "6 minit",
    date: "13 Dis 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Jenis-jenis Riba
- **Riba an-Nasiyah (faedah hutang)**: Bentuk paling biasa — faedah yang dikenakan ke atas wang pinjaman. Faedah dari akaun simpanan konvensional adalah contohnya.
- **Riba al-Fadl (riba dalam pertukaran)**: Pertukaran tidak sama rata komoditi yang sama. Kurang biasa dalam perbankan moden, tetapi prinsipnya memastikan keadilan dalam perdagangan.

Masalah perbankan konvensional
Bank konvensional beroperasi menggunakan model faedah. Bila anda simpan duit, bank guna wang itu untuk bagi pinjaman berbunga. 'Keuntungan' atau 'faedah' yang anda dapat adalah sebahagian daripada transaksi yang diharamkan. Bagi seorang Muslim, menerima riba dengan sedar adalah serius, sebab itu mengenal pasti dan menyucikan dana tersebut adalah kewajipan agama.

Cara menyucikan harta dari riba
1. **Kira jumlah sebenar**: Guna alat yang tepat untuk cari jumlah keseluruhan faedah yang anda terima.
2. **Beri semuanya**: Jumlah penuh mesti diberi kepada orang miskin dan yang memerlukan; tidak boleh digunakan untuk perbelanjaan sendiri, cukai, atau hadiah.
3. **Niat itu penting**: Niat anda mestilah untuk menyucikan harta dari dana haram, bukan untuk dapat pahala sedekah.

Ikut langkah-langkah ini jadikan harta anda suci dan bebas daripada beban spiritual riba.
`
  },
  {
    title: "Paradoks Parsing Data",
    excerpt: "Kenapa kami pilih regex lokal berbanding AI awan untuk baca penyata bank anda.",
    category: "Teknikal",
    readTime: "4 minit",
    date: "12 Oktober 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Baca penyata bank sentiasa berisiko. Kebanyakan app muat naik PDF anda ke awan, baru ekstrak teks. Tapi soal privasi, ini bukan pilihan bagus untuk kami.

Makanya kami buat enjin lokal sepenuhnya guna PDF.js dan Tesseract. Maksudnya parsing berjalan terus di pelayar anda - Chrome atau Safari - data mentah tak keluar langsung.

Format bank berbeza-beza buat pening, tapi transaksi faedah biasanya ada corak tetap. Jadi regex lagi power dari AI untuk kes ini.`
  },
  {
    title: "Faham AAOIFI 13",
    excerpt: "Standard global buang pendapatan haram - bahasa mudah.",
    category: "Fiqh",
    readTime: "6 minit",
    date: "15 Oktober 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standard 13 terang cara urus pendapatan riba. Intinya: wang dari faedah kena keluar dari milik anda.

Poin penting:
1. Niat pembersihan (tathir), bukan sedekah untuk pahala  
2. Beri untuk kebajikan awam atau orang miskin  
3. Jangan guna bayar cukai, ansuran atau perbelanjaan peribadi  

Logik pengiraan kami ikut standard ini.`
  },
  {
    title: "Bercakap Riba dengan Ibu Bapa",
    excerpt: "Cara berbual pasal faedah simpanan dengan orang tua secara sopan.",
    category: "Panduan",
    readTime: "5 minit",
    date: "01 November 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Ramai ibu bapa kami besar masa banking syariah belum wujud. Bagi mereka faedah simpanan tu duit percuma atau ganti inflasi.

Jangan terus kata 'haram!' - nanti backlash. Guna adab:
- Jangan tuduh  
- Terang barakah vs jumlah wang  
- Tawarkan bantu: 'Saya kira dan tolong purifikasi ya'

Jaga silaturahim pun wajib bro.`
  },
  {
    title: "GCC vs India Banking",
    excerpt: "Pola riba gaji GCC vs NRE/NRO India.",
    category: "Panduan",
    readTime: "4 minit",
    date: "10 November 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
Bank GCC ada 'Islamic Window', tapi kad kredit kena berhati-hati.

Di India NRE/NRO auto beri faedah:
- GCC: 'Profit Rate' (sering halal)  
- India: 'Quarterly Interest Credit' (riba)

Parser kami bezakan kedua-duanya.`
  },
  {
    title: "Fiqh Pembuangan",
    excerpt: "Wang bersih kemana? Kerja awam atau sedekah peribadi?",
    category: "Fiqh",
    readTime: "7 minit",
    date: "20 November 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Wang riba dibuang ke 'masalih ammah' iaitu kepentingan awam:
- Jambatan, jalan, tandas awam  
- Hospital & sekolah orang miskin  
- Bantuan bencana  

Jangan:
- Bina masjid  
- Cetak Al-Quran  
- Bayar denda/cukai peribadi  

Wang haram cuma kena keluar.`
  },
  {
    title: "Hadiah Kad Kredit: Halal?",
    excerpt: "Cashback, mata, miles - zon kelabu yang perlu faham.",
    category: "Panduan",
    readTime: "5 minit",
    date: "01 Disember 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Hadiah kad kredit ada 3 jenis:
1. Cashback: Ramai ulama anggap halal (diskaun pedagang)  
2. Mata/Miles: Kategori hibah  
3. Berasaskan riba: Kalau berkait faedah yang anda bayar, haram  

App kami tanda yang syak.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Dua jenis riba utama dalam fiqh Islam.",
    category: "Fiqh",
    readTime: "8 minit",
    date: "05 Disember 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba ada 2 jenis:
1. Riba al-Fadl: Tukar barang sejenis tapi jumlah tak sama  
2. Riba al-Nasiah: Tambahan sebab penangguhan (banking moden)

Jenis kedua match pinjaman & kad kredit hari ini.`
  },
  {
  title: "Sejarah Wang dalam Islam",
  excerpt: "Dari Dinar Emas ke Mata Wang Kertas.",
  category: "Fiqh",
  readTime: "10 minit",
  date: "10 Disember 2024",
  author: "History Desk",
  role: "Contributor",
  color: "bg-yellow-500",
  content: `
Zaman Nabi ﷺ guna syiling emas-perak. Nilai ada dalam syiling tu.

Sekarang wang kertas - takde nilai intrinsik, cuma perintah kerajaan.

Ulama setuju: wang kertas hukum sama macam emas/perak pasal riba. Pinjam $100 minta balik $110 = riba nasiah.`
},
  {
    title: "Pelaburan Halal 101",
    excerpt: "Pilihan pelaburan patuh syariah.",
    category: "Panduan",
    readTime: "6 minit",
    date: "15 Disember 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: Berasaskan aset  
2. Saham patuh syariah  
3. Harta tanah  
4. Emas/komoditi (spot)`
  },
  {
    title: "Bank Digital & Syariah",
    excerpt: "Neobank ubah landskap kewangan Islam.",
    category: "Teknikal",
    readTime: "5 minit",
    date: "20 Disember 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobank bina sistem syariah dari awal, bukan patch bank konvensional.`
  },
  {
    title: "Apa Itu Riba?",
    excerpt: "Definisi faedah, kenapa haram & cara bersihkan harta.",
    category: "Fiqh",
    readTime: "7 minit",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = tambahan tetap dalam pinjaman - haram tegas dalam Islam.

**Kenapa haram:** Al-Quran ugut perang (2:278-279)

**Jenis:**
- Riba nasiah: Faedah sebab masa  
- Riba fadl: Tukar tak adil  

**Cara bersihkan:**
1. Kira total faedah  
2. Beri orang miskin/kerja awam  
3. Niat pembersihan, bukan sedekah`
  }
];

export { BLOG_POSTS_MS };