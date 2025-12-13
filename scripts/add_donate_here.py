#!/usr/bin/env python3
# Add donate_here translation to all languages

translations = {
    "hi": {
        "search": '    donate_food_desc: "भूखों को खिलाएं और खाद्य सुरक्षा प्रदान करें",\n  },',
        "replace": '    donate_food_desc: "भूखों को खिलाएं और खाद्य सुरक्षा प्रदान करें",\n    donate_here: "यहाँ दान करें",\n  },'
    },
    "fr": {
        "search": '    donate_food_desc: "Nourrir les affamés et assurer la sécurité alimentaire",\n  },',
        "replace": '    donate_food_desc: "Nourrir les affamés et assurer la sécurité alimentaire",\n    donate_here: "Faire un don ici",\n  },'
    },
    "ar": {
        "search": '    donate_food_desc: "إطعام الجوعى وتوفير الأمن الغذائي",\n  },',
        "replace": '    donate_food_desc: "إطعام الجوعى وتوفير الأمن الغذائي",\n    donate_here: "تبرع هنا",\n  },'
    },
    "ur": {
        "search": '    donate_food_desc: "بھوکوں کو کھانا کھلائیں اور خوراک کی حفاظت فراہم کریں",\n  },',
        "replace": '    donate_food_desc: "بھوکوں کو کھانا کھلائیں اور خوراک کی حفاظت فراہم کریں",\n    donate_here: "یہاں عطیہ کریں",\n  },'
    },
    "bn": {
        "search": '    donate_food_desc: "ক্ষুধার্তদের খাওয়ান এবং খাদ্য নিরাপত্তা প্রদান করুন",\n  },',
        "replace": '    donate_food_desc: "ক্ষুধার্তদের খাওয়ান এবং খাদ্য নিরাপত্তা প্রদান করুন",\n    donate_here: "এখানে দান করুন",\n  },'
    },
    "id": {
        "search": '    donate_food_desc: "Memberi makan yang lapar dan menyediakan keamanan pangan",\n  },',
        "replace": '    donate_food_desc: "Memberi makan yang lapar dan menyediakan keamanan pangan",\n    donate_here: "Donasi di Sini",\n  },'
    },
    "ms": {
        "search": '    donate_food_desc: "Memberi makan yang lapar dan menyediakan keselamatan makanan",\n  },',
        "replace": '    donate_food_desc: "Memberi makan yang lapar dan menyediakan keselamatan makanan",\n    donate_here: "Derma di Sini",\n  },'
    },
    "zh": {
        "search": '    donate_food_desc: "喂养饥饿者并提供食品安全",\n  },',
        "replace": '    donate_food_desc: "喂养饥饿者并提供食品安全",\n    donate_here: "在此捐赠",\n  },'
    },
    "de": {
        "search": '    donate_food_desc: "Die Hungrigen ernähren und Ernährungssicherheit bieten",\n  },',
        "replace": '    donate_food_desc: "Die Hungrigen ernähren und Ernährungssicherheit bieten",\n    donate_here: "Hier spenden",\n  },'
    },
    "ru": {
        "search": '    donate_food_desc: "Кормить голодных и обеспечивать продовольственную безопасность",\n  },',
        "replace": '    donate_food_desc: "Кормить голодных и обеспечивать продовольственную безопасность",\n    donate_here: "Пожертвовать здесь",\n  },'
    },
    "nl": {
        "search": '    donate_food_desc: "Voed de hongerigen en bied voedselzekerheid",\n  },',
        "replace": '    donate_food_desc: "Voed de hongerigen en bied voedselzekerheid",\n    donate_here: "Doneer hier",\n  },'
    },
    "he": {
        "search": '    donate_food_desc: "להאכיל את הרעבים ולספק ביטחון תזונתי",\n  },',
        "replace": '    donate_food_desc: "להאכיל את הרעבים ולספק ביטחון תזונתי",\n    donate_here: "תרום כאן",\n  },'
    },
    "tr": {
        "search": '    donate_food_desc: "Açları doyurun ve gıda güvenliği sağlayın",\n  },',
        "replace": '    donate_food_desc: "Açları doyurun ve gıda güvenliği sağlayın",\n    donate_here: "Buradan Bağış Yapın",\n  },'
    },
    "bs": {
        "search": '    donate_food_desc: "Hranite gladne i osigurajte sigurnost hrane",\n  },',
        "replace": '    donate_food_desc: "Hranite gladne i osigurajte sigurnost hrane",\n    donate_here: "Doniraj ovdje",\n  },'
    },
    "sq": {
        "search": '    donate_food_desc: "Ushqejë të uritur dhe sigurojë sigurinë ushqimore",\n  }',
        "replace": '    donate_food_desc: "Ushqejë të uritur dhe sigurojë sigurinë ushqimore",\n    donate_here: "Dhuro këtu",\n  }'
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

