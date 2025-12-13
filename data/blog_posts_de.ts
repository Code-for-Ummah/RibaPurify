const BLOG_POSTS_DE = [
  {
    title: "Riba verstehen",
    excerpt: "Wissen ist der erste Schritt zur finanziellen Reinheit.",
    category: "Fiqh",
    readTime: "7 Min",
    date: "12. Dez. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Was ist Riba?
Riba ist ein arabisches Wort und bedeutet wörtlich "Zunahme" oder "Mehr". In der islamischen Finanzlehre steht Riba für Zins oder Wucher — eine feste, vorher vereinbarte Erhöhung auf ein Darlehen oder eine Schuld, die im Islam strikt verboten (haram) ist.

Dieses Verbot geht über bloßes Ausbeutungsvermeiden hinaus. Es ist ein Grundprinzip der islamischen Ökonomie, das Gerechtigkeit, Fairness und Risikoaufteilung fördern soll.

Warum ist Riba verboten?
Der Koran und die Sunna verbieten Riba klar und deutlich. Riba gilt als große Sünde, weil sie ein System schafft, in dem Vermögen aus Geld selbst wächst, ohne echte produktive Tätigkeit oder geteiltes Risiko.

"O die ihr glaubt, fürchtet Allah und lasst das, was an Zinsen euch noch zusteht, wenn ihr Gläubige seid. Und wenn ihr es nicht tut, so wisset, dass Allah und Sein Gesandter euch den Krieg erklärt haben." (Koran 2:278-279)
`
  },
  {
    title: "Riba: Typen, Problem des konventionellen Bankwesens und wie man reinigt",
    excerpt: "Arten von Riba, warum konventionelles Banking problematisch ist und Schritte zur Reinigung Ihres Vermögens.",
    category: "Anleitung",
    readTime: "6 Min",
    date: "13. Dez. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Arten von Riba
- Riba an-Nasiyah (Zins auf Schuld): Die häufigste Form — Zinsen, die auf geliehenes Geld erhoben werden. Das, was ein konventionelles Sparkonto an Zinsen auszahlt, ist ein Beispiel.
- Riba al-Fadl (Riba im Tausch): Ungleicher Austausch gleicher Waren in unterschiedlichen Mengen. In modernen Banken seltener sichtbar, aber das Prinzip dient der Fairness im Handel.

Das Problem mit konventionellem Banking
Konventionelle Banken arbeiten mit einem zinsbasierten Modell. Wenn Sie Geld auf ein Sparkonto legen, nutzt die Bank dieses Geld, um zinsbringende Kredite zu vergeben. Der "Profit" oder die Zinsen, die Sie erhalten, stammen aus diesen verbotenen Transaktionen. Für einen Muslim ist das bewusste Annehmen von Riba ernsthaft, daher ist das Erkennen und Reinigen solcher Gelder eine religiöse Pflicht.

Wie Sie Ihr Vermögen von Riba reinigen
1. Berechnen Sie den genauen Betrag: Nutzen Sie ein Tool, das die insgesamt erhaltenen Zinsen präzise ermittelt.  
2. Geben Sie es weg: Der volle Betrag der Zinsen sollte an Arme und Bedürftige gegeben werden; er darf nicht für eigene Ausgaben, Steuern oder Geschenke verwendet werden.  
3. Die Absicht zählt: Ihre Absicht muss die Reinigung des Vermögens von haram Mitteln sein, nicht das Erzielen von Belohnung durch Sadaqa.

Wenn Sie diese Schritte befolgen, wird Ihr Vermögen rein und Sie befreien sich von der spirituellen Last der Riba.
`
  },

  {
    title: "Das Parser-Paradoxon",
    excerpt: "Warum wir lokales Regex statt Cloud-AI für Ihre Bankauszüge gewählt haben.",
    category: "Technik",
    readTime: "4 Min",
    date: "12. Okt. 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Bankauszüge lesen ist immer riskant. Die meisten Apps laden Ihr PDF in die Cloud hoch um Text zu extrahieren. Privacy-mäßig war das für uns total inakzeptabel.

Deshalb haben wir einen 100% lokalen Motor mit PDF.js und Tesseract gebaut. Parsing läuft direkt in Ihrem Browser - Chrome oder Safari - Rohdaten gehen nirgendwo hin.

Unterschiedliche Bankformate haben uns Kopfschmerzen gemacht, aber Zins-Transaktionen haben feste Muster. Deshalb war Regex besser als KI.`
  },
  {
    title: "AAOIFI 13 verstehen",
    excerpt: "Globaler Standard für unreines Einkommen - einfach erklärt.",
    category: "Fiqh",
    readTime: "6 Min",
    date: "15. Okt. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standard 13 erklärt wie man Riba-Einkommen behandelt. Grundregel: Geld aus Zinsen muss aus Ihrem Besitz entfernt werden.

Wichtige Punkte:
1. Intention Reinigung (Tathir), kein Sadaqa für Belohnung  
2. Für öffentliches Wohl oder Arme spenden  
3. Nicht für Steuern, Kredite oder private Ausgaben nutzen  

Unsere Berechnungslogik basiert darauf.`
  },
  {
    title: "Riba mit Eltern besprechen",
    excerpt: "Wie man Sparzinsen respektvoll mit Älteren bespricht.",
    category: "Anleitung",
    readTime: "5 Min",
    date: "01. Nov. 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Viele Eltern sind in Zeiten ohne islamische Banken groß geworden. Für sie sind Sparzinsen Gratisgeld oder Inflationsausgleich.

Nicht direkt "Haram!" rufen - das schlägt nach hinten. Mit Adab vorgehen:
- Keine Vorwürfe  
- Baraka vs Betrag erklären  
- Hilfe anbieten: "Ich rechne es aus und helfe bei Reinigung"

Familienbande pflegen ist auch Fard.`
  },
  {
    title: "GCC vs Indien Banking",
    excerpt: "Riba-Muster Gehaltskonten GCC vs NRE/NRO Indien.",
    category: "Anleitung",
    readTime: "4 Min",
    date: "10. Nov. 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
GCC-Banken haben "Islamic Window", aber Kreditkarten brauchen Vorsicht.

Indien NRE/NRO zahlen automatisch Zinsen:
- GCC: "Profit Rate" (oft halal)  
- Indien: "Quarterly Interest Credit" (Riba)

Unser Parser unterscheidet beides.`
  },
  {
    title: "Fiqh der Entsorgung",
    excerpt: "Reines Geld wohin? Öffentliche Arbeiten oder private Wohltätigkeit?",
    category: "Fiqh",
    readTime: "7 Min",
    date: "20. Nov. 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Riba-Geld geht in "Masalih Ammah" (öffentliches Interesse):
- Brücken, Straßen, öffentliche Toiletten  
- Krankenhäuser/Schulen für Arme  
- Katastrophenhilfe  

Nicht:
- Moscheen bauen  
- Koran drucken  
- Persönliche Strafen/Steuern zahlen  

Haram-Geld muss nur raus.`
  },
  {
    title: "Kreditkarten-Belohnungen: Halal?",
    excerpt: "Cashback, Punkte, Meilen - Grauzone verstehen.",
    category: "Anleitung",
    readTime: "5 Min",
    date: "01. Dez. 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Kreditkarten-Belohnungen 3 Typen:
1. Cashback: Viele Gelehrte halal (Händlerrabatt)  
2. Punkte/Meilen: Hibah-Kategorie  
3. Riba-basiert: Bei direktem Zinsbezug haram  

Unsere App markiert Verdächtiges.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Zwei Haupttypen Riba im islamischen Recht.",
    category: "Fiqh",
    readTime: "8 Min",
    date: "05. Dez. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba 2 Typen:
1. Riba al-Fadl: Ungleicher Tausch gleicher Ware  
2. Riba al-Nasiah: Extra für Verzögerung (moderne Banken)

Typ 2 passt zu aktuellen Krediten/Karten.`
  },
  {
    title: "Geldgeschichte im Islam",
    excerpt: "Vom Gold-Dinar zur Papierwährung.",
    category: "Fiqh",
    readTime: "10 Min",
    date: "10. Dez. 2024",
    author: "History Desk",
    role: "Contributor",
    color: "bg-yellow-500",
    content: `
Prophetenzeit ﷺ: Gold-Silbermünzen, Wert im Münze selbst.

Heute: Fiat-Währung ohne intrinsischen Wert, nur Staatsdekret.

Gelehrte einig: Papiergeld = Gold/Silber bei Riba-Regeln. $100 verleihen für $110 zurück = Riba an-Nasiah.`
  },
  {
    title: "Halal-Investment 101",
    excerpt: "Schariakonforme Investitionsoptionen.",
    category: "Anleitung",
    readTime: "6 Min",
    date: "15. Dez. 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk: Asset-basiert  
2. Scharia-konforme Aktien  
3. Immobilien  
4. Gold/Rohstoffe (Spot)`
  },
  {
    title: "Digitalbanking & Scharia",
    excerpt: "Neobanken verändern islamische Finanzlandschaft.",
    category: "Technik",
    readTime: "5 Min",
    date: "20. Dez. 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobanken bauen schariakonforme Systeme von Grund auf, kein Patch auf konventionellen Banken.`
  },
  {
    title: "Was ist Riba?",
    excerpt: "Zins-Definition, warum haram & Vermögen reinigen.",
    category: "Fiqh",
    readTime: "7 Min",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = fester Zinszuschlag auf Kredite - streng haram im Islam.

**Warum haram:** Koran droht Krieg (2:278-279)

**Typen:**
- Riba nasiah: Zinsen durch Zeit  
- Riba fadl: Ungleicher Handel  

**Reinigung:**
1. Gesamt-Zinsen berechnen  
2. Armen/öffentliche Arbeiten geben  
3. Intention Reinigung, kein Sadaqa`
  }
];

export { BLOG_POSTS_DE };
