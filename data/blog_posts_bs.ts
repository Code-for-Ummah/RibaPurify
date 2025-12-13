export const BLOG_POSTS_BS = [
  {
    title: "Razumijevanje ribe",
    excerpt: "Znanje je prvi korak ka finansijskoj čistoći.",
    category: "Fikh",
    readTime: "7 min",
    date: "12. dec 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Šta je riba?
Riba je arapska riječ koja znači "povećanje" ili "višak". U islamskoj finansijskoj praksi, riba označava kamatu ili lihvarenje — fiksno, unaprijed određeno povećanje na zajam ili dug, što je strogo zabranjeno (haram).

Ova zabrana nije samo protiv iskorištavanja; to je temeljno načelo islamske ekonomije koje promoviše pravednost, pravičnost i dijeljenje rizika.

Zašto je riba zabranjena?
Kur'an i Sunnet jasno i snažno zabranjuju ribu. Smatra se jednim od velikih grijeha jer stvara sistem u kojem se bogatstvo stvara od novca samog, bez stvarne proizvodne aktivnosti ili podijeljenog rizika.

"O vi koji vjerujete, bojte se Allaha i ostavite ono što je ostalo od ribe, ako ste vjernici. A ako ne učinite, tad znajte da vam je Allah i Poslanik Njegov objavio rat." (Kur'an 2:278-279)
`
  },
  {
    title: "Riba: tipovi, problem konvencionalnog bankarstva i kako očistiti imovinu",
    excerpt: "Tipovi ribe, zašto je konvencionalno bankarstvo problematično i koraci za čišćenje imovine.",
    category: "Vodič",
    readTime: "6 min",
    date: "13. dec 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Tipovi ribe
- Riba an-Nasiyah (kamatа na dug): Najčešći oblik — kamata koja se naplaćuje na posuđeni novac. Kamata koju dobijete na običnom štednom računu je primjer.
- Riba al-Fadl (riba u zamjeni): Nejednaka razmjena iste robe u različitim količinama. Rjeđa u modernom bankarstvu, ali princip je isti — osigurati pravičnost u trgovanju.

Problem konvencionalnog bankarstva
Konvencionalne banke rade po modelu zasnovanom na kamati. Kada uložite novac na štednju, banka taj novac koristi za davanje kredita s kamatom. 'Profit' ili kamata koju dobijete je dio tih zabranjenih transakcija. Za muslimana, svjesno primanje ribe je ozbiljna stvar, zato je identifikacija i čišćenje takve imovine vjerska obaveza.

Kako očistiti svoju imovinu od ribe
1. Izračunajte tačan iznos: Koristite alat koji precizno utvrđuje ukupnu kamatu koju ste primili.  
2. Podijelite taj iznos: Cijeli iznos kamate treba dati siromašnima i potrebitima; ne smije se koristiti za vlastite troškove, poreze ili poklone.  
3. Nijet je bitan: Namjera treba biti čišćenje imovine od haram sredstava, ne traženje nagrade za sadaku.

Slijedeći ove korake, možete osigurati da je vaša imovina čista i osloboditi se duhovnog tereta ribe.
`
  },

  {
    title: "Paradoks parsera",
    excerpt: "Zašto smo odabrali lokalni regex umjesto cloud AI za čitanje vaših bankovnih izvještaja.",
    category: "Tehničko",
    readTime: "4 min",
    date: "12. okt 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Čitanje bankovnih izvještaja uvijek nosi rizik. Većina aplikacija šalje vaš PDF u oblak da izvuče tekst. Ali po pitanju privatnosti, to nam nije bilo prihvatljivo.

Zato smo napravili 100% lokalni motor sa PDF.js i Tesseract. Parsing se dešava direktno u vašem browseru - Chrome ili Safari - sirovi podaci ne idu nigdje.

Različiti formati banaka nas jako mučili, ali transakcije kamate imaju fiksne obrasce. Zato je regex radio bolje od AI.`
  },
  {
    title: "Razumijevanje AAOIFI 13",
    excerpt: "Globalni standard za uklanjanje haram prihoda - jednostavno objašnjenje.",
    category: "Fikh",
    readTime: "6 min",
    date: "15. okt 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standard 13 objašnjava kako rukovati prihodima od riba. Osnovno pravilo: novac od kamata mora izaći iz vašeg vlasništva.

Ključne tačke:
1. Niyat tathir (čišćenje), ne sadaqa za sevap  
2. Dajte za javno dobro ili siromašnima  
3. Ne koristiti za poreze, rate kredita ili lične troškove  

Naša logika računanja se oslanja na ovaj standard.`
  },
  {
    title: "Razgovor o riba sa roditeljima",
    excerpt: "Kako pristojno razgovarati o kamatama štednje sa starijima.",
    category: "Vodič",
    readTime: "5 min",
    date: "01. nov 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Mnogi naši roditelji su odrasli u vrijeme bez islamskog bankarstva. Za njih kamate na štednji su besplatni novac ili nadoknada inflacije.

Ne recite odmah 'haram!' - efekat je obrnut. S adabom:
- Bez optužbi  
- Objasnite baraka vs iznos  
- Ponudite pomoć: 'Izračunaću i pomognem u čišćenju'

Održavanje porodičnih veza je i farz.`
  },
  {
    title: "GCC vs Indijsko bankarstvo",
    excerpt: "Riba obrasci u GCC platnim računima vs NRE/NRO Indija.",
    category: "Vodič",
    readTime: "4 min",
    date: "10. nov 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
GCC banke imaju 'Islamsko okno', ali budite oprezni s kreditnim karticama.

U Indiji NRE/NRO automatski isplate kamate:
- GCC: 'Profit Rate' (često halal)  
- Indija: 'Quarterly Interest Credit' (riba)

Naš parser ih razlikuje.`
  },
  {
    title: "Fikh uklanjanja",
    excerpt: "Očišćeni novac kuda? Javni radovi ili lična milostinja?",
    category: "Fikh",
    readTime: "7 min",
    date: "20. nov 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Riba novac ide u 'masalih ammah' (javno dobro):
- Mostovi, putevi, javni WC  
- Bolnice/škole za siromašne  
- Pomoć kod katastrofa  

Ne:
- Gradnja džamija  
- Štampa Kurana  
- Lične kazne/porezi  

Haram novac samo treba izaći.`
  },
  {
    title: "Nagrade kreditnih kartica: halal?",
    excerpt: "Kešbek, bodovi, milje - razumijte sivu zonu.",
    category: "Vodič",
    readTime: "5 min",
    date: "01. dec 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Nagrade kreditnih kartica 3 tipa:
1. Kešbek: Većina ulema smatra halal (popust trgovca)  
2. Bodovi/Milje: Kategorija hibah  
3. Bazirano na riba: Ako je povezano s kamatama koje plaćate - haram  

Naša app označava sumnjive.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Dva glavna tipa riba u islamskom fikh.",
    category: "Fikh",
    readTime: "8 min",
    date: "05. dec 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba 2 tipa:
1. Riba al-Fadl: Nejednaka razmjena istih robe  
2. Riba al-Nasiah: Dodatak za odgađanje (moderno bankarstvo)

Drugi tip odgovara današnjim kreditima/kartama.`
  },
  {
    title: "Povijest novca u Islamu",
    excerpt: "Od zlatnog dinara do papirnatih valuta.",
    category: "Fikh",
    readTime: "10 min",
    date: "10. dec 2024",
    author: "History Desk",
    role: "Contributor",
    color: "bg-yellow-500",
    content: `
Vrijeme Poslanika ﷺ: zlatni-srebrni novčići, vrijednost u novčiću.

Danas: fiat valuta bez intrinzične vrijednosti, samo državni dekret.

Uleme se slažu: papir novac = zlato/srebro po riba pravilima. Posudba $100 za $110 = riba nasiah.`
  },
  {
    title: "Halal investiranje 101",
    excerpt: "Šerijatski kompatibilne investicije.",
    category: "Vodič",
    readTime: "6 min",
    date: "15. dec 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: Bazirano na imovini  
2. Šerijatske dionice  
3. Nekretnine  
4. Zlato/robe (spot)`
  },
  {
    title: "Digitalno bankarstvo & Šerijat",
    excerpt: "Neobankovi mijenjaju islamske finansije.",
    category: "Tehničko",
    readTime: "5 min",
    date: "20. dec 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobankovi grade šerijatske sustave od nule, ne krpe konvencionalne banke.`
  },
  {
    title: "Što je riba?",
    excerpt: "Definicija kamate, zašto haram & kako očistiti imovinu.",
    category: "Fikh",
    readTime: "7 min",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = fiksni dodatak na zajam - striktno haram u Islamu.

**Zašto haram:** Kur'an prijeti ratom (2:278-279)

**Tipovi:**
- Riba nasiah: kamata zbog vremena  
- Riba fadl: nepoštena razmjena  

**Čišćenje:**
1. Izračunajte ukupne kamate  
2. Dajte siromašnima/javnim radovima  
3. Niyat čišćenja, ne sadaqa`
  }
];

export default BLOG_POSTS_BS;
