
const BLOG_POSTS_NL = [
  {
    title: "Riba begrijpen",
    excerpt: "Kennis is de eerste stap naar financiële zuiverheid.",
    category: "Fiqh",
    readTime: "7 min",
    date: "12 dec 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Wat is Riba?
Riba is een Arabisch woord dat 'toename' of 'overschot' betekent. In islamitisch financieel verkeer verwijst riba naar rente of woeker — een vaste, vooraf bepaalde toename op een lening of schuld, die strikt verboden (haram) is.

Dit verbod is niet alleen om uitbuiting te voorkomen. Het is een kernprincipe van de islamitische economie die rechtvaardigheid, gelijkheid en het delen van risico bevordert.

Waarom is Riba verboden?
De Koran en Soennah verbieden riba duidelijk en streng. Het wordt als grote zonde beschouwd omdat het een systeem creëert waar rijkdom groeit uit geld zelf zonder echte productieve activiteit of risicodeling.

"O jullie die geloven! Vrees Allah en laat de rest van riba achter als je gelovig bent. Als je dit niet doet, weet dan dat Allah en Zijn Boodschapper oorlog tegen je verklaren." (Koran 2:278-279)
`
  },
  {
    title: "Riba: soorten, probleem traditioneel bankieren, en hoe te zuiveren",
    excerpt: "Soorten riba, waarom traditioneel bankieren problematisch is, en stappen om rijkdom te zuiveren.",
    category: "Gids",
    readTime: "6 min",
    date: "13 dec 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Soorten Riba
- **Riba an-Nasiyah (schuldrente)**: Meest voorkomende vorm — rente die in rekening wordt gebracht op geleend geld. Rente van een gewone spaarrekening is een voorbeeld.
- **Riba al-Fadl (riba in ruil)**: Ongelijke uitwisseling van dezelfde grondstof. Minder gebruikelijk in modern bankieren, maar het principe zorgt voor eerlijkheid in handel.

Probleem traditioneel bankieren
Traditionele banken werken met een rentemodel. Als je geld stort, gebruikt de bank dat om rentedragende leningen te verstrekken. De 'winst' of 'rente' die je krijgt is onderdeel van die verboden transacties. Voor een moslim is bewust riba accepteren serieus, daarom is het identificeren en zuiveren van zulke fondsen een religieuze plicht.

Hoe rijkdom zuiveren van riba
1. **Bereken exact bedrag**: Gebruik een nauwkeurig hulpmiddel om het totale ontvangen rentebedrag te vinden.
2. **Geef alles weg**: Het volledige bedrag moet aan armen en behoeftigen worden gegeven; het mag niet worden gebruikt voor eigen uitgaven, belasting of geschenken.
3. **Intentie is belangrijk**: Je intentie moet zijn om rijkdom te zuiveren van haram fondsen, niet om beloningen voor sadaqah te krijgen.

Door deze stappen te volgen maak je je rijkdom zuiver en bevrijd je jezelf van de spirituele last van riba.
`
  },
  {
    title: "Het Parser Paradox",
    excerpt: "Waarom we lokale regex kozen ipv cloud AI voor je bankafschriften.",
    category: "Techniek",
    readTime: "4 min",
    date: "12 okt. 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Bankafschriften lezen is altijd riskant. De meeste apps uploaden je PDF naar de cloud om tekst eruit te halen. Maar privacy-wise was dat niks voor ons.

Daarom bouwden we een 100% lokale engine met PDF.js en Tesseract. Parsing gebeurt gewoon in je browser - Chrome of Safari - ruwe data gaat nergens heen.

Verschillende bankformaten gaven ons flink kopzorgen, maar rente-transacties hebben vaste patronen. Regex werkte daarom beter dan AI.`
  },
  {
    title: "AAOIFI 13 begrijpen",
    excerpt: "Wereldwijde standaard onrein inkomen wegdoen - simpel uitgelegd.",
    category: "Fiqh",
    readTime: "6 min",
    date: "15 okt. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standaard 13 legt uit hoe riba-inkomen te behandelen. Simpel: geld uit rente moet uit je bezit.

Belangrijke punten:
1. Intentie zuivering (tathir), geen sadaqa voor beloning  
2. Geef voor publiek welzijn of armen  
3. Niet gebruiken voor belastingen, leningen of privé uitgaven  

Onze reklogica volgt deze standaard.`
  },
  {
    title: "Riba met ouders bespreken",
    excerpt: "Hoe spaarrente bespreek je respectvol met ouderen.",
    category: "Gids",
    readTime: "5 min",
    date: "01 nov. 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Veel ouders groeiden op zonder islamitisch bankieren. Voor hen is spaarrente gratis geld of inflatiecompense.

Zeg niet direct 'haram!' - dat werkt averechts. Met adab:
- Geen verwijten  
- Barakah vs bedrag uitleggen  
- Hulp aanbieden: 'Ik reken uit en help zuiveren'

Familiebanden onderhouden is ook fard.`
  },
  {
    title: "GCC vs India Banking",
    excerpt: "Riba-patronen GCC salarisrekeningen vs India NRE/NRO.",
    category: "Gids",
    readTime: "4 min",
    date: "10 nov. 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
GCC banken hebben 'Islamic Window', maar creditcards vereisen voorzichtigheid.

India NRE/NRO keren automatisch rente uit:
- GCC: 'Profit Rate' (vaak halal)  
- India: 'Quarterly Interest Credit' (riba)

Onze parser onderscheidt beide.`
  },
  {
    title: "Fiqh van wegdoen",
    excerpt: "Gezuiverd geld waarheen? Openbare werken of privé goeddoen?",
    category: "Fiqh",
    readTime: "7 min",
    date: "20 nov. 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Riba-geld gaat naar 'masalih ammah' (publiek belang):
- Bruggen, wegen, openbare toiletten  
- Ziekenhuizen/scholen voor armen  
- Rampenhulp  

Niet:
- Moskeeën bouwen  
- Koran drukken  
- Persoonlijke boetes/belastingen betalen  

Haram geld moet gewoon weg.`
  },
  {
    title: "Creditcard beloningen: halal?",
    excerpt: "Cashback, punten, miles - grijze zone begrijpen.",
    category: "Gids",
    readTime: "5 min",
    date: "01 dec. 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Creditcard beloningen 3 types:
1. Cashback: Veel geleerden halal (korting handelaar)  
2. Punten/Miles: Hibah categorie  
3. Riba-gebaseerd: Als direct gelinkt aan betaalde rente, haram  

Onze app markeert verdachtjes.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Twee hoofdvormen riba in islamitisch recht.",
    category: "Fiqh",
    readTime: "8 min",
    date: "05 dec. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba 2 types:
1. Riba al-Fadl: ongelijke ruil gelijke goederen  
2. Riba al-Nasiah: extra voor uitstel (moderne banken)

Type 2 past bij huidige leningen/kaart-schulden.`
  },
  {
  title: "Geschiedenis geld in Islam",
  excerpt: "Van gouden dinar tot papiergeld.",
  category: "Fiqh",
  readTime: "10 min",
  date: "10 dec. 2024",
  author: "History Desk",
  role: "Contributor",
  color: "bg-yellow-500",
  content: `
Profeet ﷺ tijd: goud-zilver munten, waarde in munt zelf.

Nu: fiat geld zonder intrinsieke waarde, alleen overheid decreet.

Geleerden eens: papiergeld = goud/zilver voor riba regels. $100 lenen voor $110 terug = riba nasiah.`
}
,
  {
    title: "Halal investeren 101",
    excerpt: "Sharia-conforme investeringsopties.",
    category: "Gids",
    readTime: "6 min",
    date: "15 dec. 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: asset-gebaseerd  
2. Sharia-conforme aandelen  
3. Vastgoed  
4. Goud/commodities (spot)`
  },
  {
    title: "Digitaal bankieren & Sharia",
    excerpt: "Neobanken veranderen islamitische financiën.",
    category: "Techniek",
    readTime: "5 min",
    date: "20 dec. 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobanken bouwen sharia-compliant vanaf nul, geen pleisters op conventionele banken.`
  },
  {
    title: "Wat is riba?",
    excerpt: "Rente definitie, waarom haram & vermogen zuiveren.",
    category: "Fiqh",
    readTime: "7 min",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = vaste extra op lening - streng haram in Islam.

**Waarom haram:** Koran dreigt oorlog (2:278-279)

**Types:**
- Riba nasiah: rente door tijd  
- Riba fadl: oneerlijke ruil  

**Zuiveren:**
1. Totale rente berekenen  
2. Geven aan armen/openbare werken  
3. Intentie zuivering, geen sadaqa`
  }
];

export { BLOG_POSTS_NL };