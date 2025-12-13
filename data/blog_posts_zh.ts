const BLOG_POSTS_ZH = [
  {
    title: "理解利瓦（Riba）",
    excerpt: "知识是通向财务纯洁的第一步。",
    category: "教法",
    readTime: "7 分钟",
    date: "2024年12月12日",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-green-500",
    content: `
什么是利瓦？
利瓦（Riba）是阿拉伯语词汇，意思是"增加"或"额外"。在伊斯兰金融中，利瓦指的是利息或高利贷——贷款或债务上预先确定的固定增长，这是严格禁止的（哈拉姆）。

这个禁令不仅是为了避免剥削。它是伊斯兰经济学的核心原则，促进公平、正义和风险共担。

为什么利瓦被禁止？
古兰经和圣训明确且严格地禁止利瓦。它被认为是大罪，因为它创造了一个财富从金钱本身增长的系统，没有任何真正的生产活动或共担风险。

"信道的人们啊！你们要敬畏真主，要放弃余欠的利息，如果你们是信士。如果你们不这样做，那么，你们就应当知道真主和使者将对你们宣战。"（古兰经 2:278-279）
`
  },
  {
    title: "利瓦：类型、传统银行问题及如何净化",
    excerpt: "利瓦类型，传统银行为何有问题，以及净化财富的步骤。",
    category: "指南",
    readTime: "6 分钟",
    date: "2024年12月13日",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-600",
    content: `
利瓦的类型
- **Riba an-Nasiyah（债务利息）**：最常见的形式——借贷资金收取的利息。传统储蓄账户的利息就是例子。
- **Riba al-Fadl（交换中的利瓦）**：同类商品的不等量交换。在现代银行中较少见，但原则是确保交易公平。

传统银行的问题
传统银行基于利息模式运作。当你存钱时，银行用它发放有息贷款。你获得的"利润"或"利息"是这些被禁交易的一部分。对穆斯林来说，明知故犯地接受利瓦是严重的事，因此识别和净化这些财富是宗教义务。

如何从利瓦中净化你的财富
1. **精确计算金额**：使用能准确找出你收到的总利息的工具。
2. **施舍出去**：全部金额应给予穷人和需要帮助的人；不能用于自己的开支、税款或礼物。
3. **意图很重要**：你的意图应该是净化财富，而不是为了获得施舍的回报。

遵循这些步骤能让你的财富纯洁，摆脱利瓦的精神负担。
`
  },
  {
    title: "数据解析悖论",
    excerpt: "为什么我们选择本地正则而非云端AI来读取你的银行对账单。",
    category: "技术",
    readTime: "4 分钟",
    date: "2024年10月12日",
    author: "Team RibaPurify",
    role: "Core Devs",
    color: "bg-blue-500",
    content: `
读银行对账单总是风险很高。大多数应用会把你的PDF上传到云端服务器提取文本。但隐私方面这对我们来说完全不可接受。

所以我们建了完全本地的引擎，用PDF.js和Tesseract。意思是解析直接在你浏览器里完成—Chrome或Safari—原始数据不会外传。

不同银行格式五花八门给我们造成很大麻烦，但利息交易通常有固定模式。正则表达式比AI更靠谱。`
  },
  {
    title: "理解AAOIFI 13",
    excerpt: "全球非合规收入处置标准—通俗解释。",
    category: "教法",
    readTime: "6 分钟",
    date: "2024年10月15日",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-emerald-500",
    content: `
AAOIFI第13号标准说明如何处理来自利瓦（riba）的收入。核心原则：来自利息的钱必须脱离你的所有权。

关键要点：
1. 意图是净化（tathir），不是为了功德的施舍  
2. 捐给公共福利或穷人  
3. 不能用于缴税、分期付款或个人开支  

我们的计算逻辑基于此标准。`
  },
  {
    title: "跟父母谈利瓦",
    excerpt: "如何礼貌地跟长辈讨论储蓄账户利息问题。",
    category: "指南",
    readTime: "5 分钟",
    date: "2024年11月1日",
    author: "Community",
    role: "Contributor",
    color: "bg-purple-500",
    content: `
我们很多父母成长的时代伊斯兰银行还没出现。对他们来说储蓄利息就是免费钱或通胀补偿。

别直接说"这是禁忌！"—效果适得其反。用礼貌方式：
- 别指责  
- 解释祝福（barakah）vs金额  
- 主动帮忙："我帮您计算并协助净化"

维护亲情也是义务。`
  },
  {
    title: "海湾vs印度银行",
    excerpt: "GCC薪资账户vs印度NRE/NRO的利瓦模式。",
    category: "指南",
    readTime: "4 分钟",
    date: "2024年11月10日",
    author: "Finance Expert",
    role: "Analyst",
    color: "bg-orange-500",
    content: `
海湾银行提供"伊斯兰窗口"，但信用卡仍需谨慎。

印度NRE/NRO自动产生利息：
- GCC："利润率"（通常合法）  
- 印度："季度利息贷记"（利瓦）

我们的解析器能区分两者。`
  },
  {
    title: "处置的教法",
    excerpt: "净化后的钱去哪？公共工程还是个人慈善？",
    category: "教法",
    readTime: "7 分钟",
    date: "2024年11月20日",
    author: "Scholar Panel",
    role: "Fiqh Council",
    color: "bg-teal-500",
    content: `
利瓦资金应用于"公共利益"（masalih ammah）：
- 桥梁、道路、公共厕所  
- 穷人医院、学校  
- 灾难救援  

禁止：
- 建清真寺  
- 印古兰经  
- 付个人罚款/税款  

禁忌资金只需排出即可。`
  },
  {
    title: "信用卡奖励：合法？",
    excerpt: "现金返还、积分、里程—灰色地带解析。",
    category: "指南",
    readTime: "5 分钟",
    date: "2024年12月1日",
    author: "Team RibaPurify",
    role: "Research",
    color: "bg-indigo-500",
    content: `
信用卡奖励分三类：
1. 现金返还：多数学者认为合法（商户折扣）  
2. 积分/里程：赠礼（hibah）范畴  
3. 利瓦相关：若直接关联你支付的利息，则禁忌  

我们的应用会标记可疑项目。`
  },
  {
    title: "利瓦·法德尔vs利瓦·纳西阿",
    excerpt: "伊斯兰法学中的两种主要利瓦。",
    category: "教法",
    readTime: "8 分钟",
    date: "2024年12月5日",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-red-500",
    content: `
利瓦分两类：
1. 利瓦·法德尔：同类商品不等价交换  
2. 利瓦·纳西阿：延期交换的额外（现代银行）

后者对应当今贷款和信用卡债务。`
  },
  {
  title: "伊斯兰货币史",
  excerpt: "从金第纳尔到纸币。",
  category: "教法",
  readTime: "10 分钟",
  date: "2024年12月10日",
  author: "History Desk",
  role: "Contributor",
  color: "bg-yellow-500",
  content: `
先知时代用金银币，币本身就有价值。

现在用纸币，没内在价值，全靠政府命令。

学者同意：纸币在利瓦问题上跟金银同等。借100美元要还110美元就是利瓦·纳西阿。`
},
  {
    title: "合法投资101",
    excerpt: "符合教法的投资选择。",
    category: "指南",
    readTime: "6 分钟",
    date: "2024年12月15日",
    author: "Finance Team",
    role: "Analyst",
    color: "bg-cyan-500",
    content: `
1. 苏库克：资产支持  
2. 教法合规股票  
3. 房地产  
4. 黄金/大宗商品（现货）`
  },
  {
    title: "数字银行与教法",
    excerpt: "新银行如何改变伊斯兰金融格局。",
    category: "技术",
    readTime: "5 分钟",
    date: "2024年12月20日",
    author: "Tech Lead",
    role: "Developer",
    color: "bg-slate-500",
    content: `
新银行从零开始构建教法合规系统，而非修补传统银行。`
  },
  {
    title: "什么是利瓦？",
    excerpt: "利息定义、禁忌原因及财富净化方法。",
    category: "教法",
    readTime: "7 分钟",
    date: "—",
    author: "Shariah Board",
    role: "Advisors",
    color: "bg-gray-500",
    content: `
利瓦=贷款固定额外金额—伊斯兰中严格禁忌。

**为何禁忌：**《古兰经》宣战警告（2:278-279）

**类型：**
- 利瓦·纳西阿：时间利息  
- 利瓦·法德尔：不公平交易  

**净化方法：**
1. 计算总利息  
2. 捐给穷人/公共工程  
3. 意图净化，非施舍`
  }
];
export { BLOG_POSTS_ZH };