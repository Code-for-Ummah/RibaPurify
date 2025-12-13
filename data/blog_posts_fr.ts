const BLOG_POSTS_FR = [
  {
    title: "Comprendre le riba",
    excerpt: "La connaissance est le premier pas vers la pureté financière.",
    category: "Fiqh",
    readTime: "7 min",
    date: "12 déc. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
Qu'est‑ce que le riba ?
Riba est un mot arabe qui signifie littéralement « augmentation » ou « excès ». En finance islamique, le riba désigne l'intérêt ou l'usure — une majoration fixe et prédéterminée sur un prêt ou une dette, strictement interdite (haram).

Cette interdiction ne vise pas seulement à éviter l'exploitation ; c'est un principe central de l'économie islamique qui promeut l'équité, la justice et le partage du risque.

Pourquoi le riba est‑il interdit ?
Le Coran et la Sunna interdisent clairement le riba. Il est considéré comme un grand péché car il crée un système où la richesse croît à partir de l'argent lui‑même, sans activité productive ni partage du risque.

« Ô vous qui avez cru, craignez Allah et laissez ce qui reste [de l'intérêt] si vous êtes croyants. Et si vous ne le faites pas, sachez qu'Allah et Son Messager vous déclarent la guerre. » (Coran 2:278-279) `
  },

  {
    title: "Riba : types, problème des banques conventionnelles et comment purifier",
    excerpt: "Types de riba, pourquoi la banque conventionnelle pose problème, et étapes pour purifier votre patrimoine.",
    category: "Guide",
    readTime: "6 min",
    date: "13 déc. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Types de riba
- **Riba an‑Nasiyah (intérêt sur la dette)** : forme la plus courante — intérêt appliqué à l'argent emprunté. L'intérêt versé par un compte d'épargne classique en est un exemple.
- **Riba al‑Fadl (riba dans le troc)** : échange inégal de la même marchandise en quantités différentes. Moins visible dans la banque moderne, mais le principe vise à garantir l'équité dans le commerce.

Le problème des banques conventionnelles
Les banques conventionnelles fonctionnent sur un modèle basé sur l'intérêt. Quand vous déposez de l'argent, la banque l'utilise pour accorder des prêts à intérêt. Le « profit » ou l'intérêt que vous recevez provient de ces opérations interdites. Pour un musulman, accepter sciemment du riba est grave ; identifier et purifier ces fonds est donc un devoir religieux.

Comment purifier votre patrimoine du riba
1. **Calculez le montant exact** : utilisez un outil fiable pour déterminer précisément le total des intérêts reçus.  
2. **Donnez la somme** : le montant total doit être distribué aux pauvres et aux nécessiteux ; il ne peut pas servir à vos dépenses personnelles, impôts ou cadeaux.  
3. **L'intention compte** : la niyya doit être la purification (tathir) de votre richesse, pas la recherche de la récompense d'une sadaqa.

En suivant ces étapes, vous rendez votre patrimoine pur et vous vous libérez du fardeau spirituel du riba.`
  },

  {
    title: "Le paradoxe du parseur",
    excerpt: "Pourquoi on a choisi regex local au lieu d'IA cloud pour lire vos relevés bancaires.",
    category: "Technique",
    readTime: "4 min",
    date: "12 oct. 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Lire un relevé bancaire c'est toujours risqué. La plupart des apps uploadent votre PDF sur un cloud pour extraire le texte. Mais niveau privacy, c'était pas du tout notre délire.

Du coup on a monté un moteur 100% local avec PDF.js et Tesseract. Ça veut dire que le parsing se fait direct dans votre navigateur - Chrome ou Safari - rien ne sort.

Les formats bancaires tous différents nous ont bien fait galérer, mais les lignes d'intérêts ont toujours le même pattern. Du coup regex a cartonné mieux que l'IA.`
  },
  {
    title: "Comprendre AAOIFI 13",
    excerpt: "Le standard mondial pour virer les revenus haram - en langage simple.",
    category: "Fiqh",
    readTime: "6 min",
    date: "15 oct. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standard 13 explique comment gérer les revenus de riba. Le principe de base : l'argent venant des intérêts doit sortir de votre propriété.

Points clés :
1. Intention de purification (tathir), pas de sadaqa pour la récompense  
2. Donner pour le bien public ou aux pauvres  
3. Ne pas utiliser pour taxes, prêts ou dépenses perso  

Notre logique de calcul suit ce standard.`
  },
  {
    title: "Parler riba avec les parents",
    excerpt: "Comment aborder les intérêts d'épargne avec les aînés respectueusement.",
    category: "Guide",
    readTime: "5 min",
    date: "01 nov. 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Beaucoup de nos parents ont grandi à une époque sans banque islamique. Pour eux les intérêts d'épargne c'est de l'argent gratuit ou compensation inflation.

Dire direct "c'est haram !" ça fait l'effet inverse. Faites avec adab :
- Pas d'accusation  
- Expliquez barakah vs montant  
- Proposez de l'aide : "Je calcule et aide à purifier"

Maintenir les liens familiaux c'est aussi fard.`
  },
  {
    title: "Golfe vs Inde banking",
    excerpt: "Patterns riba comptes salaire GCC vs NRE/NRO Inde.",
    category: "Guide",
    readTime: "4 min",
    date: "10 nov. 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
Banques GCC ont "Islamic Window" mais méfiez-vous des cartes de crédit.

En Inde NRE/NRO génèrent intérêts auto :
- GCC : "Profit Rate" (souvent halal)  
- Inde : "Quarterly Interest Credit" (riba)

Notre parser fait la différence.`
  },
  {
    title: "Fiqh de l'élimination",
    excerpt: "L'argent purifié où va-t-il ? Travaux publics ou charité perso ?",
    category: "Fiqh",
    readTime: "7 min",
    date: "20 nov. 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
Argent riba va dans "masalih ammah" (intérêt public) :
- Ponts, routes, toilettes publiques  
- Hôpitaux/écoles pour pauvres  
- Aide catastrophes  

À éviter :
- Construire mosquées  
- Imprimer Coran  
- Payer amendes/impôts perso  

L'argent haram doit juste sortir.`
  },
  {
    title: "Récompenses carte : halal ?",
    excerpt: "Cashback, points, miles - comprendre la zone grise.",
    category: "Guide",
    readTime: "5 min",
    date: "01 déc. 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Récompenses cartes en 3 types :
1. Cashback :多数 savants considèrent halal (remise marchand)  
2. Points/Miles : catégorie hibah  
3. Basé riba : si lié aux intérêts payés, haram  

Notre app flag les suspects.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasiah",
    excerpt: "Les deux types principaux de riba en droit islamique.",
    category: "Fiqh",
    readTime: "8 min",
    date: "05 déc. 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba en 2 types :
1. Riba al-Fadl : échange inégal de même genre  
2. Riba al-Nasiah : extra pour délai (banque moderne)

Le 2ème correspond aux prêts/cartes actuelles.`
  },
  {
    title: "Histoire de l'argent en Islam",
    excerpt: "Du dinar d'or à la monnaie papier.",
    category: "Fiqh",
    readTime: "10 min",
    date: "10 déc. 2024",
    author: "History Desk",
    role: "Contributor",
    color: "bg-yellow-500",
    content: `
Époque Prophète ﷺ: pièces or-argent, valeur dans la pièce elle-même.

Aujourd'hui: monnaie papier sans valeur intrinsèque, juste décret gouvernemental.

Les savants s'accordent: papier-monnaie = or/argent pour règles riba. Prêter $100 pour recevoir $110 = riba nasiah.`
  },
  {
    title: "Investissement halal 101",
    excerpt: "Choix d'investissement conformes à la charia.",
    category: "Guide",
    readTime: "6 min",
    date: "15 déc. 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. Sukuk : adossé aux actifs  
2. Actions charia-conformes  
3. Immobilier  
4. Or/commodités (spot)`
  },
  {
    title: "Banque digitale & charia",
    excerpt: "Neobanques changent le paysage finance islamique.",
    category: "Technique",
    readTime: "5 min",
    date: "20 déc. 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobanques construisent charia-compliant dès le départ, pas de patch sur banques classiques.`
  },
  {
    title: "Qu'est-ce que le riba ?",
    excerpt: "Définition intérêts, pourquoi haram & comment purifier sa richesse.",
    category: "Fiqh",
    readTime: "7 min",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
Riba = extra fixe sur prêt - strictement haram en Islam.

**Pourquoi haram :** Coran menace guerre (2:278-279)

**Types :**
- Riba nasiah : intérêts temporels  
- Riba fadl : échange injuste  

**Purification :**
1. Calculer total intérêts  
2. Donner pauvres/travaux publics  
3. Intention purification, pas sadaqa`
  }
];

export { BLOG_POSTS_FR };
