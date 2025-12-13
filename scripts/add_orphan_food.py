#!/usr/bin/env python3
# Add orphan and food donation options to all languages

translations = {
    "hi": {
        "search": '    donate_infrastructure: "सार्वजनिक बुनियादी ढांचा",\n    donate_infrastructure_desc: "सड़कें, पुल, सामुदायिक सुविधाएं",\n  },',
        "replace": '    donate_infrastructure: "सार्वजनिक बुनियादी ढांचा",\n    donate_infrastructure_desc: "सड़कें, पुल, सामुदायिक सुविधाएं",\n    donate_orphans: "अनाथ सहायता",\n    donate_orphans_desc: "अनाथों और कमजोर बच्चों की देखभाल",\n    donate_food: "भोजन कार्यक्रम",\n    donate_food_desc: "भूखों को खिलाएं और खाद्य सुरक्षा प्रदान करें",\n  },'
    },
    "fr": {
        "search": '    donate_infrastructure: "Infrastructure publique",\n    donate_infrastructure_desc: "Routes, ponts, installations communautaires",\n  },',
        "replace": '    donate_infrastructure: "Infrastructure publique",\n    donate_infrastructure_desc: "Routes, ponts, installations communautaires",\n    donate_orphans: "Soutien aux orphelins",\n    donate_orphans_desc: "Prendre soin des orphelins et enfants vulnérables",\n    donate_food: "Programmes alimentaires",\n    donate_food_desc: "Nourrir les affamés et assurer la sécurité alimentaire",\n  },'
    },
    "ar": {
        "search": '    donate_infrastructure: "البنية التحتية العامة",\n    donate_infrastructure_desc: "طرق، جسور، مرافق مجتمعية",\n  },',
        "replace": '    donate_infrastructure: "البنية التحتية العامة",\n    donate_infrastructure_desc: "طرق، جسور، مرافق مجتمعية",\n    donate_orphans: "دعم الأيتام",\n    donate_orphans_desc: "رعاية الأيتام والأطفال المستضعفين",\n    donate_food: "برامج الغذاء",\n    donate_food_desc: "إطعام الجوعى وتوفير الأمن الغذائي",\n  },'
    },
    "ur": {
        "search": '    donate_infrastructure: "عوامی بنیادی ڈھانچہ",\n    donate_infrastructure_desc: "سڑکیں، پل، کمیونٹی سہولیات",\n  },',
        "replace": '    donate_infrastructure: "عوامی بنیادی ڈھانچہ",\n    donate_infrastructure_desc: "سڑکیں، پل، کمیونٹی سہولیات",\n    donate_orphans: "یتیموں کی مدد",\n    donate_orphans_desc: "یتیموں اور کمزور بچوں کی دیکھ بھال",\n    donate_food: "خوراک کے پروگرام",\n    donate_food_desc: "بھوکوں کو کھانا کھلائیں اور خوراک کی حفاظت فراہم کریں",\n  },'
    },
    "bn": {
        "search": '    donate_infrastructure: "সর্বজনীন অবকাঠামো",\n    donate_infrastructure_desc: "রাস্তা, সেতু, সম্প্রদায়ের সুবিধা",\n  },',
        "replace": '    donate_infrastructure: "সর্বজনীন অবকাঠামো",\n    donate_infrastructure_desc: "রাস্তা, সেতু, সম্প্রদায়ের সুবিধা",\n    donate_orphans: "এতিম সহায়তা",\n    donate_orphans_desc: "এতিম এবং দুর্বল শিশুদের যত্ন নিন",\n    donate_food: "খাদ্য কর্মসূচি",\n    donate_food_desc: "ক্ষুধার্তদের খাওয়ান এবং খাদ্য নিরাপত্তা প্রদান করুন",\n  },'
    },
    "id": {
        "search": '    donate_infrastructure: "Infrastruktur Umum",\n    donate_infrastructure_desc: "Jalan, jembatan, fasilitas komunitas",\n  },',
        "replace": '    donate_infrastructure: "Infrastruktur Umum",\n    donate_infrastructure_desc: "Jalan, jembatan, fasilitas komunitas",\n    donate_orphans: "Dukungan Anak Yatim",\n    donate_orphans_desc: "Merawat anak yatim dan anak-anak rentan",\n    donate_food: "Program Makanan",\n    donate_food_desc: "Memberi makan yang lapar dan menyediakan keamanan pangan",\n  },'
    },
    "ms": {
        "search": '    donate_infrastructure: "Infrastruktur Awam",\n    donate_infrastructure_desc: "Jalan, jambatan, kemudahan komuniti",\n  },',
        "replace": '    donate_infrastructure: "Infrastruktur Awam",\n    donate_infrastructure_desc: "Jalan, jambatan, kemudahan komuniti",\n    donate_orphans: "Sokongan Anak Yatim",\n    donate_orphans_desc: "Menjaga anak yatim dan kanak-kanak rentan",\n    donate_food: "Program Makanan",\n    donate_food_desc: "Memberi makan yang lapar dan menyediakan keselamatan makanan",\n  },'
    },
    "zh": {
        "search": '    donate_infrastructure: "公共基础设施",\n    donate_infrastructure_desc: "道路、桥梁、社区设施",\n  },',
        "replace": '    donate_infrastructure: "公共基础设施",\n    donate_infrastructure_desc: "道路、桥梁、社区设施",\n    donate_orphans: "孤儿援助",\n    donate_orphans_desc: "照顾孤儿和弱势儿童",\n    donate_food: "食物计划",\n    donate_food_desc: "喂养饥饿者并提供食品安全",\n  },'
    },
    "de": {
        "search": '    donate_infrastructure: "Öffentliche Infrastruktur",\n    donate_infrastructure_desc: "Straßen, Brücken, Gemeinschaftseinrichtungen",\n  },',
        "replace": '    donate_infrastructure: "Öffentliche Infrastruktur",\n    donate_infrastructure_desc: "Straßen, Brücken, Gemeinschaftseinrichtungen",\n    donate_orphans: "Waisenhilfe",\n    donate_orphans_desc: "Pflege für Waisen und gefährdete Kinder",\n    donate_food: "Lebensmittelprogramme",\n    donate_food_desc: "Die Hungrigen ernähren und Ernährungssicherheit bieten",\n  },'
    },
    "ru": {
        "search": '    donate_infrastructure: "Общественная инфраструктура",\n    donate_infrastructure_desc: "Дороги, мосты, общественные объекты",\n  },',
        "replace": '    donate_infrastructure: "Общественная инфраструктура",\n    donate_infrastructure_desc: "Дороги, мосты, общественные объекты",\n    donate_orphans: "Поддержка сирот",\n    donate_orphans_desc: "Забота о сиротах и уязвимых детях",\n    donate_food: "Продовольственные программы",\n    donate_food_desc: "Кормить голодных и обеспечивать продовольственную безопасность",\n  },'
    },
    "nl": {
        "search": '    donate_infrastructure: "Openbare infrastructuur",\n    donate_infrastructure_desc: "Wegen, bruggen, gemeenschapsvoorzieningen",\n  },',
        "replace": '    donate_infrastructure: "Openbare infrastructuur",\n    donate_infrastructure_desc: "Wegen, bruggen, gemeenschapsvoorzieningen",\n    donate_orphans: "Wezenondersteuning",\n    donate_orphans_desc: "Zorg voor wezen en kwetsbare kinderen",\n    donate_food: "Voedselprogramma\'s",\n    donate_food_desc: "Voed de hongerigen en bied voedselzekerheid",\n  },'
    },
    "he": {
        "search": '    donate_infrastructure: "תשתית ציבורית",\n    donate_infrastructure_desc: "כבישים, גשרים, מתקני קהילה",\n  },',
        "replace": '    donate_infrastructure: "תשתית ציבורית",\n    donate_infrastructure_desc: "כבישים, גשרים, מתקני קהילה",\n    donate_orphans: "תמיכה ביתומים",\n    donate_orphans_desc: "טיפול ביתומים וילדים פגיעים",\n    donate_food: "תוכניות מזון",\n    donate_food_desc: "להאכיל את הרעבים ולספק ביטחון תזונתי",\n  },'
    },
    "tr": {
        "search": '    donate_infrastructure: "Kamu Altyapısı",\n    donate_infrastructure_desc: "Yollar, köprüler, topluluk tesisleri",\n  },',
        "replace": '    donate_infrastructure: "Kamu Altyapısı",\n    donate_infrastructure_desc: "Yollar, köprüler, topluluk tesisleri",\n    donate_orphans: "Yetim Desteği",\n    donate_orphans_desc: "Yetimlere ve savunmasız çocuklara bakım",\n    donate_food: "Gıda Programları",\n    donate_food_desc: "Açları doyurun ve gıda güvenliği sağlayın",\n  },'
    },
    "bs": {
        "search": '    donate_infrastructure: "Javna infrastruktura",\n    donate_infrastructure_desc: "Putevi, mostovi, objekti zajednice",\n  },',
        "replace": '    donate_infrastructure: "Javna infrastruktura",\n    donate_infrastructure_desc: "Putevi, mostovi, objekti zajednice",\n    donate_orphans: "Podrška siročadi",\n    donate_orphans_desc: "Briga o siročadi i ranjivoj djeci",\n    donate_food: "Programi hrane",\n    donate_food_desc: "Hranite gladne i osigurajte sigurnost hrane",\n  },'
    },
    "sq": {
        "search": '    donate_infrastructure: "Infrastrukturë Publike",\n    donate_infrastructure_desc: "Rrugë, ura, objekteve komunitare",\n  },',
        "replace": '    donate_infrastructure: "Infrastrukturë Publike",\n    donate_infrastructure_desc: "Rrugë, ura, objekteve komunitare",\n    donate_orphans: "Mbështetje për Jetimë",\n    donate_orphans_desc: "Kujdesi për jetimët dhe fëmijët e cenueshëm",\n    donate_food: "Programe Ushqimore",\n    donate_food_desc: "Ushqejë të uritur dhe sigurojë sigurinë ushqimore",\n  },'
    }
}

# Read the file
with open('translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply all replacements
for lang, trans in translations.items():
    content = content.replace(trans['search'], trans['replace'])

# Write back
with open('translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added orphan and food donation translations to all languages!")
