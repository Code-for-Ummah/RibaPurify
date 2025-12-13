const BLOG_POSTS_TR = [
  {
    title: "Riba'yı Anlamak",
    excerpt: "Bilgi, mali saflığa giden ilk adımdır.",
    category: "Fıkıh",
    readTime: "7 dk",
    date: "12 Ara 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Riba nedir?
Riba, 'artış' veya 'fazlalık' anlamına gelen Arapça bir kelimedir. İslami finansta riba, faiz veya tefecilik demektir — bir borç veya kredi üzerine sabit, önceden belirlenmiş bir artış, kesinlikle yasak (haram)dır.

Bu yasak sadece istismardan kaçınmak için değil. Adalet, eşitlik ve risk paylaşımını destekleyen İslami ekonominin temel ilkesidir.

Riba neden yasak?
Kuran ve Sünnet, riba'yı açık ve kesin şekilde yasaklar. Büyük günah olarak kabul edilir çünkü zenginliğin, herhangi bir gerçek üretken faaliyet veya risk paylaşımı olmadan paranın kendisinden büyüdüğü bir sistem yaratır.

"Ey iman edenler! Allah'tan korkun ve eğer gerçek müminlerseniz, ribadan kalan kısmı bırakın. Eğer bunu yapmazsanız, bilin ki Allah ve Rasulü size savaş ilan eder." (Kuran 2:278-279)
`
  },
  {
    title: "Riba: Türleri, Geleneksel Bankacılık Sorunu ve Nasıl Arındırılır",
    excerpt: "Riba türleri, geleneksel bankacılık neden sorunludur ve serveti arındırma adımları.",
    category: "Rehber",
    readTime: "6 dk",
    date: "13 Ara 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Riba Türleri
- **Riba an-Nasiyah (borç faizi)**: En yaygın form — ödünç alınan para üzerinden alınan faiz. Geleneksel tasarruf hesabındaki faiz bir örnektir.
- **Riba al-Fadl (takas ribasÄ±)**: Aynı emtianın eşit olmayan değişimi. Modern bankacılıkta daha az yaygın, ama ilke ticarette adaleti sağlar.

Geleneksel bankacılık sorunu
Geleneksel bankalar faiz modeli üzerinden çalışır. Para yatırdığınızda, banka bunu faizli krediler vermek için kullanır. Aldığınız 'kâr' veya 'faiz', bu yasak işlemlerin bir parçasıdır. Bir Müslüman için bilerek riba kabul etmek ciddidir, bu yüzden bu fonları belirlemek ve arındırmak dini bir görevdir.

Serveti riba'dan nasıl arındırılır
1. **Tam miktarı hesaplayın**: Aldığınız toplam faizi bulmak için doğru bir araç kullanın.
2. **Hepsini verin**: Tam miktar fakirlere ve muhtaçlara verilmeli; kendi harcamalarınız, vergiler veya hediyeler için kullanılamaz.
3. **Niyet önemlidir**: Niyetiniz, serveti haram fonlardan arındırmak olmalı, sadaka için ödül almak değil.

Bu adımları izleyerek servetinizi temiz hale getirin ve riba'nın manevi yükünden kurtulun.
`
  },
  {
    title: "Parser Paradoksu",
    excerpt: "Banka dökümlerinizi okumak için neden bulut AI yerine yerel regex seçtik.",
    category: "Teknik",
    readTime: "4 dk",
    date: "12 Eki 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Banka dökümü okumak her zaman riskli. Çoğu uygulama PDF'inizi buluta yükleyip metin çıkarıyor. Ama gizlilik açısından bu bizim için hiç uygun değildi.

Bu yüzden PDF.js ve Tesseract ile %100 yerel motor yaptık. Parsing direkt tarayıcınızda çalışıyor - Chrome ya da Safari - ham veriler dışarı çıkmıyor.

Farklı banka formatları başımızı fena ağrıttı ama faiz işlemleri sabit pattern'lerde geliyor. Bu yüzden regex AI'dan daha iyi iş çıkardı.`
  },
  {
    title: "AAOIFI 13'ü Anlayın",
    excerpt: "Haram geliri temizleme global standardı - basitçe.",
    category: "Fıkıh",
    readTime: "6 dk",
    date: "15 Eki 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI 13 riba gelirini nasıl yöneteceğinizi anlatıyor. Temel kural: Faizden gelen para mülkiyetinizden çıkmalı.

Önemli noktalar:
1. Niyet tazkiye (temizleme), sadaka sevabı değil  
2. Kamu yararı veya fakirlere verin  
3. Vergi, kredi taksidi, kişisel harcamalara kullanmayın  

Hesaplama mantığımız bu standarda dayalı.`
  },
  {
    title: "Anne-babaya riba konuşması",
    excerpt: "Tasarruf faizi konusunda büyüklerle saygılı nasıl konuşulur.",
    category: "Kılavuz",
    readTime: "5 dk",
    date: "01 Kas 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Çok annemiz-babamız İslami bankacılığın olmadığı dönemde büyüdü. Onlara göre tasarruf faizi bedava para veya enflasyon tazminatı.

Doğrudan 'haram!' demeyin - ters teper. Adab ile:
- Suçlama yapmayın  
- Bereket vs miktar açıklayın  
- Yardım teklif edin: 'Hesaplarım, tazkiye'de yardım edeyim'

Akrabalık bağları korumak da farz.`
  },
  {
    title: "GCC vs Hindistan Bankacılığı",
    excerpt: "GCC maaş hesapları vs Hindistan NRE/NRO riba pattern'leri.",
    category: "Kılavuz",
    readTime: "4 dk",
    date: "10 Kas 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
GCC bankaları 'İslam Penceresi' sunuyor ama kredi kartlarında dikkatli olun.

Hindistan'da NRE/NRO otomatik faiz veriyor:
- GCC: 'Kar Oranı' (genelde helal)  
- Hindistan: 'Çeyreklik Faiz Kredisi' (riba)

Parser'ımız ikisini ayırıyor.`
  },
  {
    title: "Temizleme Fıkhı",
    excerpt: "Temizlenmiş para nereye? Kamu işleri mi kişisel sadaka mı?",
    category: "Fıkıh",
    readTime: "7 dk",
    date: "20 Kas 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Riba parası 'masalih ammeh' (kamu yararı) işlerine:
- Köprüler, yollar, umumi tuvaletler  
- Fakir hastaneleri/okulları  
- Afet yardımları  

Yapmayın:
- Cami inşası  
- Kur'an basımı  
- Kişisel ceza/vergi ödemesi  

Haram para sadece çıksın.`
  },
  {
    title: "Kredi Kartı Ödülleri: Helal mi?",
    excerpt: "Nakit iade, puan, mil - gri alanları anlayın.",
    category: "Kılavuz",
    readTime: "5 dk",
    date: "01 Ara 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Kredi kartı ödülleri 3 tip:
1. Nakit iade: Çoğu alim helal görür (tüccar indirimi)  
2. Puan/Mil: Hibe kategorisi  
3. Riba temelli: Ödediğiniz faizle bağlantılıysa haram  

Uygulamamız şüpheli olanları işaretler.`
  },
  {
    title: "Riba el-Fadl vs Riba en-Nesiye",
    excerpt: "İslam fıkhında ribanın iki ana türü.",
    category: "Fıkıh",
    readTime: "8 dk",
    date: "05 Ara 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba 2 tür:
1. Riba el-Fadl: Aynı malın eşit olmayan değişimi  
2. Riba en-Nesiye: Erteleme için fazlalık (modern bankacılık)

İkinci tür bugünkü kredilere/kartlara uyuyor.`
  },
  {
  title: "İslam'da Para Tarihi",
  excerpt: "Altın dinardan kâğıt paraya.",
  category: "Fıkıh",
  readTime: "10 dk",
  date: "10 Aralık 2024",
  author: "History Desk",
  role: "Contributor",
  color: "bg-yellow-500",
  content: `
Peygamber ﷺ devri: altın-gümüş sikkeler, değer sikke kendisinde.

Bugün: fiat para, içsel değeri yok, sadece devlet emri.

Âlimler hemfikir: kâğıt para = altın/gümüş riba kurallarında. $100 borç verip $110 istemek = riba nesi'e.`
},
  {
    title: "Helal Yatırım 101",
    excerpt: "Şeriat uyumlu yatırım seçenekleri.",
    category: "Kılavuz",
    readTime: "6 dk",
    date: "15 Ara 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: Varlık temelli  
2. Şeriat uyumlu hisseler  
3. Gayrimenkul  
4. Altın/emtia (spot)`
  },
  {
    title: "Dijital Bankacılık & Şeriat",
    excerpt: "Neobanklar İslami finansı değiştiriyor.",
    category: "Teknik",
    readTime: "5 dk",
    date: "20 Ara 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobanklar şeriat uyumlu sistemleri sıfırdan kuruyor, geleneksel bankalara yama yapmıyor.`
  },
  {
    title: "Riba nedir?",
    excerpt: "Faiz tanımı, neden haram & servet nasıl temizlenir.",
    category: "Fıkıh",
    readTime: "7 dk",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = Borca sabit fazlalık - İslam'da kesin haram.

**Neden haram:** Kur'an savaş tehdidi (2:278-279)

**Türleri:**
- Riba nese: Zaman faizi  
- Riba fadl: Adaletsiz takas  

**Temizleme:**
1. Toplam faizi hesapla  
2. Fakirlere/kamu işlerine ver  
3. Niyet tazkiye, sadaka değil`
  }
];

export { BLOG_POSTS_TR };