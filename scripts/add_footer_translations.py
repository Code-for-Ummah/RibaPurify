#!/usr/bin/env python3
# Add footer translations to all languages

translations = {
    "hi": '    donate_region_your_area: "आपका क्षेत्र",\n    footer_tagline: "पूर्ण गोपनीयता के साथ अपनी संपत्ति को रिबा से शुद्ध करें। शून्य-ज्ञान, स्थानीय-प्रथम, शरिया-अनुपालन।",\n    footer_quick_links: "त्वरित लिंक",\n    footer_contact: "संपर्क करें",\n    footer_copyright: "उम्मत के लिए अमानत के साथ निर्मित।",',
    "fr": '    donate_region_your_area: "Votre région",\n    footer_tagline: "Purifiez votre richesse du Riba avec une confidentialité totale. Zéro connaissance, local d\'abord, conforme à la charia.",\n    footer_quick_links: "Liens rapides",\n    footer_contact: "Contact",\n    footer_copyright: "Construit avec Amanah pour l\'Oummah.",',
    "ar": '    donate_region_your_area: "منطقتك",\n    footer_tagline: "طهر ثروتك من الربا بخصوصية كاملة. معرفة صفرية، محلي أولاً، متوافق مع الشريعة.",\n    footer_quick_links: "روابط سريعة",\n    footer_contact: "اتصل بنا",\n    footer_copyright: "بُني بأمانة للأمة.",',
    "ur": '    donate_region_your_area: "آپ کا علاقہ",\n    footer_tagline: "مکمل رازداری کے ساتھ اپنی دولت کو ربا سے پاک کریں۔ صفر علم، مقامی پہلے، شریعت کے مطابق۔",\n    footer_quick_links: "فوری لنکس",\n    footer_contact: "رابطہ",\n    footer_copyright: "امت کے لیے امانت کے ساتھ بنایا گیا۔",',
    "bn": '    donate_region_your_area: "আপনার এলাকা",\n    footer_tagline: "সম্পূর্ণ গোপনীয়তার সাথে রিবা থেকে আপনার সম্পদ পরিশুদ্ধ করুন। শূন্য-জ্ঞান, স্থানীয়-প্রথম, শরীয়াহ-সম্মত।",\n    footer_quick_links: "দ্রুত লিঙ্ক",\n    footer_contact: "যোগাযোগ",\n    footer_copyright: "উম্মাহর জন্য আমানত দিয়ে নির্মিত।",',
    "id": '    donate_region_your_area: "Wilayah Anda",\n    footer_tagline: "Bersihkan kekayaan Anda dari Riba dengan privasi lengkap. Zero-knowledge, lokal-pertama, sesuai Syariah.",\n    footer_quick_links: "Tautan Cepat",\n    footer_contact: "Kontak",\n    footer_copyright: "Dibangun dengan Amanah untuk Umat.",',
    "ms": '    donate_region_your_area: "Kawasan Anda",\n    footer_tagline: "Bersihkan kekayaan anda dari Riba dengan privasi lengkap. Zero-knowledge, tempatan-dahulu, patuh Syariah.",\n    footer_quick_links: "Pautan Pantas",\n    footer_contact: "Hubungi",\n    footer_copyright: "Dibina dengan Amanah untuk Ummah.",',
    "zh": '    donate_region_your_area: "您的地区",\n    footer_tagline: "以完全隐私净化您的财富免受利巴。零知识、本地优先、符合伊斯兰教法。",\n    footer_quick_links: "快速链接",\n    footer_contact: "联系我们",\n    footer_copyright: "为乌玛用阿玛纳建造。",',
    "de": '    donate_region_your_area: "Ihre Region",\n    footer_tagline: "Reinigen Sie Ihr Vermögen von Riba mit völliger Privatsphäre. Null-Wissen, lokal-zuerst, Scharia-konform.",\n    footer_quick_links: "Schnelllinks",\n    footer_contact: "Kontakt",\n    footer_copyright: "Mit Amanah für die Ummah gebaut.",',
    "ru": '    donate_region_your_area: "Ваш регион",\n    footer_tagline: "Очистите свое богатство от Риба с полной конфиденциальностью. Нулевое знание, локальный подход, соответствие шариату.",\n    footer_quick_links: "Быстрые ссылки",\n    footer_contact: "Контакты",\n    footer_copyright: "Создано с Аманой для Уммы.",',
    "nl": '    donate_region_your_area: "Uw gebied",\n    footer_tagline: "Zuiver uw rijkdom van Riba met volledige privacy. Nul-kennis, lokaal-eerst, Sharia-conform.",\n    footer_quick_links: "Snelle links",\n    footer_contact: "Contact",\n    footer_copyright: "Gebouwd met Amanah voor de Ummah.",',
    "he": '    donate_region_your_area: "האזור שלך",\n    footer_tagline: "טהר את עושרך מריבא עם פרטיות מלאה. אפס ידע, מקומי ראשון, תואם לשריעה.",\n    footer_quick_links: "קישורים מהירים",\n    footer_contact: "צור קשר",\n    footer_copyright: "נבנה עם אמנה עבור האומה.",',
    "tr": '    donate_region_your_area: "Bölgeniz",\n    footer_tagline: "Tam gizlilikle servetinizi Riba\'dan arındırın. Sıfır-bilgi, yerel-önce, Şeriat uyumlu.",\n    footer_quick_links: "Hızlı Bağlantılar",\n    footer_contact: "İletişim",\n    footer_copyright: "Ümmet için Emanet ile inşa edilmiştir.",',
    "bs": '    donate_region_your_area: "Vaše područje",\n    footer_tagline: "Očistite svoje bogatstvo od Riba uz potpunu privatnost. Nulto znanje, lokalno-prvo, usklađeno sa Šerijatom.",\n    footer_quick_links: "Brzi linkovi",\n    footer_contact: "Kontakt",\n    footer_copyright: "Izgrađeno sa Amanetom za Ummet.",',
    "sq": '    donate_region_your_area: "Zona juaj",\n    footer_tagline: "Pastroni pasurinë tuaj nga Riba me privatësi të plotë. Zero-njohuri, lokale-së pari, në përputhje me Sheriatin.",\n    footer_quick_links: "Lidhje të Shpejta",\n    footer_contact: "Kontakti",\n    footer_copyright: "Ndërtuar me Amanet për Umetin.",'
}

# Read the file
with open('translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply all replacements
for lang, trans_text in translations.items():
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if f'  {lang}:' in line:
            # Found the language section, now find donate_region_your_area
            for j in range(i, min(i+300, len(lines))):
                if '    donate_region_your_area: "' in lines[j]:
                    # Replace this line with all new translations
                    lines[j] = trans_text
                    break
            break
    content = '\n'.join(lines)

# Write back
with open('translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added footer translations to all 15 languages!")
