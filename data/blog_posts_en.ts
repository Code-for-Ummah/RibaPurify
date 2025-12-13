export const BLOG_POSTS_EN = [
{
    title: "Understanding Riba",
    excerpt: "Knowledge is the first step toward financial purity.",
    category: "Fiqh",
    readTime: "7 min",
    date: "Dec 12, 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
What is Riba?
Riba is an Arabic word meaning 'increase' or 'excess.' In Islamic finance, riba refers to interest or usury — a fixed, predetermined increase on a loan or debt, which is strictly prohibited (haram).

This ban is not only about avoiding exploitation. It is a core principle of Islamic economics that promotes fairness, justice, and risk-sharing.

Why is Riba prohibited?
The Qur'an and the Sunnah clearly and strongly forbid riba. It is considered a major sin because it creates a system where wealth grows from money itself without any real productive activity or shared risk.

"O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers. And if you do not, then be informed of a war [against you] from Allah and His Messenger." (Qur'an 2:278-279) `
  },

{
    title: "Riba: Types, the Problem with Conventional Banking, and How to Purify",
    excerpt: "Types of riba, why conventional banking is problematic, and steps to purify your wealth.",
    category: "Guide",
    readTime: "6 min",
    date: "Dec 13, 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
Types of Riba
- Riba an-Nasiyah (interest on debt): The most common form — interest charged on borrowed money. The interest from a conventional savings account is an example.
- Riba al-Fadl (interest in barter): Unequal exchange of the same commodity. Less common in modern banking, but the principle ensures fairness in trade.

The problem with conventional banking
Conventional banks run on an interest model. When you deposit money, the bank uses it to make interest-bearing loans. The 'profit' or 'interest' you get is part of those prohibited transactions. For a Muslim, knowingly taking riba is serious, so identifying and purifying such wealth is a religious duty.

How to purify your wealth from riba
1. Calculate the exact amount: Use a tool that accurately finds the total interest you received.  
2. Give it away: The full amount should be given to the poor and needy; it cannot be used for your own expenses, taxes, or as gifts.  
3. Intention matters: Your intention should be to cleanse your wealth from haram funds, not to earn the reward of sadaqah.

Following these steps helps make your wealth pure and frees you from the spiritual burden of riba.`
  }


  ,{
    title: "The Parser Paradox",
    excerpt: "Why we chose a local system over cloud AI to read your bank statements.",
    category: "Technical",
    readTime: "4 min",
    date: "Oct 12, 2024",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
Reading bank statements is always risky. Most apps upload your PDF to the cloud to extract text. That felt wrong for privacy.

So we built a fully local engine using PDF.js and Tesseract. That means everything runs in your browser — Chrome or Safari — and nothing leaves your machine.

We ran into trouble with many different bank formats, but interest entries usually follow fixed patterns. For this task, regex worked better than LLMs.`
  },
  {
    title: "Understanding AAOIFI 13",
    excerpt: "The global standard for disposing of impermissible income, explained simply.",
    category: "Fiqh",
    readTime: "6 min",
    date: "Oct 15, 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI Standard 13 explains how to handle income that comes from riba. Plainly put: money that came from interest must be removed from your ownership.

Key points:
1. The intention should be purification (tathir), not seeking charity reward.  
2. Give the money to public welfare or the poor.  
3. Do not use it to pay your own taxes, loans, or personal expenses.

Our calculation logic is based on this standard.`
  },
  {
    title: "Talking to Parents about Riba",
    excerpt: "How to discuss savings interest with elders in a respectful way.",
    category: "Guide",
    readTime: "5 min",
    date: "Nov 01, 2024",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
Many of our parents grew up when Islamic banking wasn't available. To them, savings interest can look like free money or a way to beat inflation.

Saying "this is haram" bluntly can backfire. Use manners:
- Don't accuse them.  
- Explain blessing (barakah) versus amount.  
- Offer to help — "I can calculate and help purify it."

Keeping family ties is also important and required.`
  },
  {
    title: "Gulf vs India Banking",
    excerpt: "Riba patterns in GCC salary accounts vs NRE/NRO accounts in India.",
    category: "Guide",
    readTime: "4 min",
    date: "Nov 10, 2024",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
Banks in the Gulf often provide 'Islamic windows', which helps, but you still need to be careful with credit cards.

In India, NRE/NRO accounts usually accrue interest by default:
- GCC: 'Profit Rate' (often a halal structure)  
- India: 'Quarterly Interest' (riba)

Our parser is tuned to detect these regional differences.`
  },
  {
    title: "The Fiqh of Disposal",
    excerpt: "Where should purified money go — public works or personal charity?",
    category: "Fiqh",
    readTime: "7 min",
    date: "Nov 20, 2024",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
After removing riba money, the general consensus is to spend it on public benefit (masalih ammah).
Examples:
- Build bridges, roads, or public toilets.  
- Hospitals and schools for the poor.  
- Disaster relief programs.

Avoid:
- Building mosques (mosques should be built with pure money).  
- Printing Qur'ans.  
- Paying your own fines or taxes.

The goal is to remove impure money from private ownership and use it for public good.`
  },
  {
    title: "Credit Card Rewards: Halal?",
    excerpt: "Understanding the grey area around cashback, points, and miles.",
    category: "Guide",
    readTime: "5 min",
    date: "Dec 01, 2024",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
Credit card rewards usually fall into three categories:
1. Cashback: Many scholars consider this halal (seen as a discount from the merchant/processor).  
2. Points/Miles: Generally treated as a gift (hibah).  
3. Riba-based rewards: If the reward is directly linked to the interest you pay, it is haram.

Our app marks cashback as 'Halal' by default but flags ambiguous bonuses for your review.`
  },
  {
    title: "Riba al-Fadl vs Riba al-Nasi'ah",
    excerpt: "The two main types of prohibited interest in Islamic jurisprudence.",
    category: "Fiqh",
    readTime: "8 min",
    date: "Dec 05, 2024",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
Riba is not a single idea. In fiqh there are two main types: riba al-fadl and riba al-nasi'ah.

Riba al-fadl is unequal exchange of the same commodity (gold, silver, dates, wheat, etc.) where quantities differ in a hand-to-hand trade. Example: exchanging 10 grams of high-quality gold for 12 grams of lower-quality gold is prohibited.

Riba al-nasi'ah, called 'riba of delay', is most relevant to modern banking. It involves increasing a debt in exchange for delaying payment. This matches interest on loans, credit card debt, and savings accounts. Understanding these distinctions clarifies why modern interest is prohibited.`
  },
  {
    title: "The History of Money in Islam",
    excerpt: "From gold dinars to paper currency: how money's meaning changed.",
    category: "Fiqh",
    readTime: "10 min",
    date: "Dec 10, 2024",
    author: "History Desk",
    role: "Contributor",
    color: "bg-yellow-500",
    content: `
In the Prophet's time, gold dinars and silver dirhams were used. Value was in the coin itself.

Today we use paper money, which has no intrinsic value and relies on government backing.

Scholars say paper money takes the ruling of gold/silver regarding riba. So lending $100 to get $110 is riba al-nasi'ah, just like lending gold for more gold.`
  },
  {
    title: "Halal Investing 101",
    excerpt: "Practical Shariah-compliant investment options today.",
    category: "Guide",
    readTime: "6 min",
    date: "Dec 15, 2024",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
Investing is encouraged in Islam if it's halal.

Main avenues:
1. Sukuk: asset-backed instruments instead of debt-based bonds.  
2. Shariah-compliant equities: stocks of companies not involved in haram activities and with low debt.  
3. Real estate: generally halal and encouraged.  
4. Gold/commodities: spot trading is permitted.

Tools like RibaPurify help clean your bank accounts so your investment capital is pure.`
  },
  {
    title: "Digital Banking & Shariah",
    excerpt: "How neobanks are changing Islamic finance.",
    category: "Technical",
    readTime: "5 min",
    date: "Dec 20, 2024",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
Neobanks and fintechs are building Shariah-compliant tools from the ground up instead of retrofitting old banks.
Examples: transaction screening (like our app), automated zakat calculation on savings, and ethical crowdfunding platforms.

Technology is neutral; how we code the logic decides whether it serves halal or haram.`
  },

  /* Two new posts added from the provided text, translated into plain English */
  
  
];

export default BLOG_POSTS_EN;
