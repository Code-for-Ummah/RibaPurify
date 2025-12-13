
export const BLOG_POSTS_ID = [
  {
    title: "Memahami Riba",
    excerpt: "Pengetahuan adalah langkah pertama menuju kemurnian finansial.",
    category: "Fiqh",
    readTime: "7 menit",
    date: "12 Desember 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Apa itu Riba?
Riba adalah kata Arab yang artinya 'pertambahan' atau 'kelebihan'. Dalam keuangan Islam, riba merujuk pada bunga atau rente — peningkatan tetap dan sudah ditentukan di awal atas pinjaman atau hutang, yang sangat dilarang (haram).

Larangan ini bukan cuma buat hindari eksploitasi. Ini prinsip inti ekonomi Islam yang mempromosikan keadilan, kesetaraan, dan berbagi risiko.

Kenapa Riba dilarang?
Al-Quran dan Sunnah dengan jelas dan tegas melarang riba. Dianggap dosa besar karena menciptakan sistem di mana kekayaan tumbuh dari uang itu sendiri tanpa aktivitas produktif nyata atau berbagi risiko.

"Wahai orang-orang yang beriman! Bertakwalah kepada Allah dan tinggalkan sisa riba jika kamu orang beriman. Jika kamu tidak melakukannya, maka umumkanlah perang dari Allah dan Rasul-Nya." (Al-Quran 2:278-279)
`
  },
  {
    title: "Riba: Jenis, Masalah Bank Konvensional, dan Cara Memurnikan",
    excerpt: "Jenis-jenis riba, kenapa perbankan konvensional bermasalah, dan langkah memurnikan harta.",
    category: "Panduan",
    readTime: "6 menit",
    date: "13 Desember 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Jenis-jenis Riba
- **Riba an-Nasiyah (bunga hutang)**: Bentuk paling umum — bunga yang dikenakan pada uang pinjaman. Bunga dari rekening tabungan konvensional adalah contohnya.
- **Riba al-Fadl (riba dalam barter)**: Pertukaran tidak setara dari komoditas yang sama. Kurang umum di perbankan modern, tapi prinsipnya memastikan keadilan dalam perdagangan.

Masalah perbankan konvensional
Bank konvensional jalan pakai model bunga. Waktu Anda nabung, bank pakai uang itu buat kasih pinjaman berbunga. 'Keuntungan' atau 'bunga' yang Anda dapat itu bagian dari transaksi yang dilarang. Buat Muslim, terima riba dengan sadar itu serius, makanya identifikasi dan bersihkan harta itu kewajiban agama.

Cara memurnikan harta dari riba
1. **Hitung jumlah pasti**: Pakai tool yang akurat nemuin total bunga yang Anda terima.
2. **Berikan semuanya**: Jumlah penuh harus dikasih ke orang miskin dan yang butuh; gak boleh dipakai buat pengeluaran sendiri, pajak, atau hadiah.
3. **Niat itu penting**: Niat Anda harus buat membersihkan harta dari dana haram, bukan buat dapetin pahala sedekah.

Ikutin langkah-langkah ini bikin harta Anda murni dan bebas dari beban spiritual riba.
`
  },
  {
    title: "Paradoks Parsing Data",
    excerpt: "Kenapa kami pilih regex lokal daripada AI cloud buat baca statement bank Anda.",
    category: "Teknis",
    readTime: "4 menit",
    date: "12 Oktober 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Membaca statement bank itu selalu riskan. Kebanyakan app upload PDF Anda ke cloud, baru extract teksnya. Tapi soal privasi, ini bukan pilihan bagus buat kami.

Makanya kami bikin engine lokal penuh pakai PDF.js dan Tesseract. Artinya parsing jalan langsung di browser Anda - Chrome atau Safari - data mentah nggak kemana-mana.

Format bank yang beda-beda bikin pusing, tapi transaksi bunga biasanya punya pola tetap. Makanya regex lebih jago dari AI buat kasus ini.`
  },
  {
    title: "Pahami AAOIFI 13",
    excerpt: "Standar global buang income haram - bahasa gampang.",
    category: "Fiqh",
    readTime: "6 menit",
    date: "15 Oktober 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standar 13 jelasin cara handle income riba. Intinya: uang dari bunga harus keluar dari kepemilikan Anda.

Poin penting:
1. Niat purifikasi (tathir), bukan sedekah buat pahala  
2. Kasih ke public welfare atau orang miskin  
3. Jangan dipakai bayar pajak, cicilan atau keperluan pribadi  

Logika kalkulasi kami ikut standar ini.`
  },
  {
    title: "Ngobrol Riba sama Orang Tua",
    excerpt: "Cara bicara soal bunga tabungan sama orang tua dengan sopan.",
    category: "Panduan",
    readTime: "5 menit",
    date: "01 November 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Banyak orang tua kami besar di zaman banking syariah belum ada. Buat mereka bunga tabungan itu duit gratis atau kompensasi inflasi.

Jangan langsung bilang 'haram!' - efeknya malah buruk. Pakai adab:
- Jangan nuduh  
- Jelasin barokah vs jumlah uang  
- Tawarin bantu: 'Saya hitung dan bantu purifikasi ya'

Jaga silaturahmi juga wajib bro.`
  },
  {
    title: "GCC vs India Banking",
    excerpt: "Pola riba di gaji GCC vs NRE/NRO India.",
    category: "Panduan",
    readTime: "4 menit",
    date: "10 November 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
Bank GCC punya 'Islamic Window', tapi kartu kredit tetap hati-hati.

Di India NRE/NRO otomatis kasih bunga:
- GCC: 'Profit Rate' (sering halal)  
- India: 'Quarterly Interest Credit' (riba)

Parser kami bedain keduanya.`
  },
  {
    title: "Fiqh Pembuangan",
    excerpt: "Uang bersih kemana? Pekerjaan umum atau sedekah pribadi?",
    category: "Fiqh",
    readTime: "7 menit",
    date: "20 November 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Uang riba dibuang ke 'masalih ammah' alias kepentingan umum:
- Jembatan, jalan, toilet umum  
- Rumah sakit & sekolah orang miskin  
- Bantuan bencana  

Jangan:
- Bangun masjid  
- Cetak Al-Quran  
- Bayar denda/tax pribadi  

Uang haram cuma perlu keluar.`
  },
  {
    title: "Hadiah Kartu Kredit: Halal?",
    excerpt: "Cashback, poin, miles - zona abu-abu yang harus dipahami.",
    category: "Panduan",
    readTime: "5 menit",
    date: "01 Desember 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Hadiah kartu kredit ada 3 jenis:
1. Cashback: Banyak ulama anggap halal (diskon merchant)  
2. Poin/Miles: Masuk kategori hibah  
3. Berbasis riba: Kalau terkait bunga yang Anda bayar, haram  

App kami flag yang mencurigakan.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Dua jenis riba utama dalam fiqh Islam.",
    category: "Fiqh",
    readTime: "8 menit",
    date: "05 Desember 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba ada 2 jenis:
1. Riba al-Fadl: Tukar barang sejenis tapi jumlah nggak sama  
2. Riba al-Nasiah: Tambahan karena penundaan (banking modern)

Jenis kedua cocok sama pinjaman & kartu kredit hari ini.`
  },
  {
  title: "Sejarah Uang dalam Islam",
  excerpt: "Dari Dinar Emas ke Mata Uang Kertas.",
  category: "Fiqh",
  readTime: "10 menit",
  date: "10 Desember 2024",
  author: "History Desk",
  role: "Contributor",
  color: "bg-yellow-500",
  content: `
Zaman Nabi ﷺ pakai koin emas-perak. Nilainya ada di koin itu sendiri.

Sekarang uang kertas - nggak ada nilai intrinsik, cuma dekrit pemerintah.

Ulama sepakat: uang kertas hukumnya sama seperti emas/perak soal riba. Pinjam $100 minta balik $110 = riba nasiah.`
},
  {
    title: "Investasi Halal 101",
    excerpt: "Pilihan investasi syariah compliant.",
    category: "Panduan",
    readTime: "6 menit",
    date: "15 Desember 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: Berbasis aset  
2. Saham syariah compliant  
3. Properti  
4. Emas/komoditas (spot)`
  },
  {
    title: "Bank Digital & Syariah",
    excerpt: "Neobank ubah landscape keuangan Islam.",
    category: "Teknis",
    readTime: "5 menit",
    date: "20 Desember 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobank bangun sistem syariah dari awal, bukan patch bank konvensional.`
  },
  {
    title: "Apa Itu Riba?",
    excerpt: "Definisi bunga, kenapa haram & cara bersihkan harta.",
    category: "Fiqh",
    readTime: "7 menit",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = tambahan tetap di pinjaman - haram keras dalam Islam.

**Kenapa haram:** Al-Quran ancam perang (2:278-279)

**Jenis:**
- Riba nasiah: Bunga karena waktu  
- Riba fadl: Tukar tidak adil  

**Cara bersihkan:**
1. Hitung total bunga  
2. Kasih ke miskin/pekerjaan umum  
3. Niat purifikasi, bukan sedekah`
  }
];
export default BLOG_POSTS_ID;
          