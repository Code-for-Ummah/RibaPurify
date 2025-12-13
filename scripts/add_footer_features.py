#!/usr/bin/env python3

# Add footer feature translations to all 15 non-English languages

translations = {
    "hi": '''    footer_tagline: "पूर्ण गोपनीयता के साथ अपनी संपत्ति को रिबा से शुद्ध करें। शून्य-ज्ञान, स्थानीय-प्रथम, शरिया-अनुपालन।",
    footer_quick_links: "त्वरित लिंक",
    footer_features: "मुख्य विशेषताएं",
    footer_feature_privacy: "पूर्ण गोपनीयता",
    footer_feature_privacy_desc: "सभी डेटा आपके डिवाइस पर रहता है",
    footer_feature_local: "स्थानीय प्रसंस्करण",
    footer_feature_local_desc: "इंटरनेट की आवश्यकता नहीं",
    footer_feature_shariah: "शरिया अनुपालन",
    footer_feature_shariah_desc: "सत्यापित पद्धति",
    footer_contact: "संपर्क करें",
    footer_copyright: "उम्मत के लिए अमानत के साथ निर्मित।",''',
    
    "fr": '''    footer_tagline: "Purifiez votre richesse du Riba avec une confidentialité totale. Zéro connaissance, local d'abord, conforme à la charia.",
    footer_quick_links: "Liens Rapides",
    footer_features: "Fonctionnalités Clés",
    footer_feature_privacy: "Confidentialité Totale",
    footer_feature_privacy_desc: "Toutes les données restent sur votre appareil",
    footer_feature_local: "Traitement Local",
    footer_feature_local_desc: "Pas besoin d'internet",
    footer_feature_shariah: "Conforme à la Charia",
    footer_feature_shariah_desc: "Méthodologie vérifiée",
    footer_contact: "Contact",
    footer_copyright: "Construit avec Amanat pour l'Oummah.",''',
    
    "ar": '''    footer_tagline: "طهر ثروتك من الربا بخصوصية كاملة. معرفة صفرية، محلي أولاً، متوافق مع الشريعة.",
    footer_quick_links: "روابط سريعة",
    footer_features: "المميزات الرئيسية",
    footer_feature_privacy: "خصوصية كاملة",
    footer_feature_privacy_desc: "جميع البيانات تبقى على جهازك",
    footer_feature_local: "معالجة محلية",
    footer_feature_local_desc: "لا يتطلب اتصال بالإنترنت",
    footer_feature_shariah: "متوافق مع الشريعة",
    footer_feature_shariah_desc: "منهجية موثقة",
    footer_contact: "اتصل بنا",
    footer_copyright: "بني بأمانة من أجل الأمة.",''',
    
    "ur": '''    footer_tagline: "مکمل رازداری کے ساتھ اپنی دولت کو ربا سے پاک کریں۔ صفر علم، مقامی پہلے، شریعت کے مطابق۔",
    footer_quick_links: "فوری لنکس",
    footer_features: "اہم خصوصیات",
    footer_feature_privacy: "مکمل رازداری",
    footer_feature_privacy_desc: "تمام ڈیٹا آپ کے ڈیوائس پر رہتا ہے",
    footer_feature_local: "مقامی پروسیسنگ",
    footer_feature_local_desc: "انٹرنیٹ کی ضرورت نہیں",
    footer_feature_shariah: "شریعت کے مطابق",
    footer_feature_shariah_desc: "تصدیق شدہ طریقہ کار",
    footer_contact: "رابطہ",
    footer_copyright: "امت کے لیے امانت کے ساتھ تیار کیا گیا۔",''',
    
    "bn": '''    footer_tagline: "সম্পূর্ণ গোপনীয়তার সাথে রিবা থেকে আপনার সম্পদ পরিশুদ্ধ করুন। শূন্য-জ্ঞান, স্থানীয়-প্রথম, শরীয়াহ-সম্মত।",
    footer_quick_links: "দ্রুত লিংক",
    footer_features: "প্রধান বৈশিষ্ট্য",
    footer_feature_privacy: "সম্পূর্ণ গোপনীয়তা",
    footer_feature_privacy_desc: "সব ডেটা আপনার ডিভাইসে থাকে",
    footer_feature_local: "স্থানীয় প্রক্রিয়াকরণ",
    footer_feature_local_desc: "ইন্টারনেট প্রয়োজন নেই",
    footer_feature_shariah: "শরীয়াহ সম্মত",
    footer_feature_shariah_desc: "যাচাইকৃত পদ্ধতি",
    footer_contact: "যোগাযোগ",
    footer_copyright: "উম্মাহর জন্য আমানত সহকারে নির্মিত।",''',
    
    "id": '''    footer_tagline: "Bersihkan kekayaan Anda dari Riba dengan privasi lengkap. Zero-knowledge, lokal-pertama, sesuai Syariah.",
    footer_quick_links: "Tautan Cepat",
    footer_features: "Fitur Utama",
    footer_feature_privacy: "Privasi Lengkap",
    footer_feature_privacy_desc: "Semua data tetap di perangkat Anda",
    footer_feature_local: "Pemrosesan Lokal",
    footer_feature_local_desc: "Tidak perlu internet",
    footer_feature_shariah: "Sesuai Syariah",
    footer_feature_shariah_desc: "Metodologi terverifikasi",
    footer_contact: "Kontak",
    footer_copyright: "Dibangun dengan Amanah untuk Umat.",''',
    
    "ms": '''    footer_tagline: "Bersihkan kekayaan anda dari Riba dengan privasi lengkap. Zero-knowledge, tempatan-dahulu, patuh Syariah.",
    footer_quick_links: "Pautan Pantas",
    footer_features: "Ciri Utama",
    footer_feature_privacy: "Privasi Lengkap",
    footer_feature_privacy_desc: "Semua data kekal dalam peranti anda",
    footer_feature_local: "Pemprosesan Tempatan",
    footer_feature_local_desc: "Tidak perlu internet",
    footer_feature_shariah: "Patuh Syariah",
    footer_feature_shariah_desc: "Metodologi disahkan",
    footer_contact: "Hubungi",
    footer_copyright: "Dibina dengan Amanah untuk Ummah.",''',
    
    "zh": '''    footer_tagline: "以完全隐私净化您的财富免受利巴。零知识、本地优先、符合伊斯兰教法。",
    footer_quick_links: "快速链接",
    footer_features: "核心功能",
    footer_feature_privacy: "完全隐私",
    footer_feature_privacy_desc: "所有数据保留在您的设备上",
    footer_feature_local: "本地处理",
    footer_feature_local_desc: "无需互联网",
    footer_feature_shariah: "符合伊斯兰教法",
    footer_feature_shariah_desc: "经过验证的方法",
    footer_contact: "联系我们",
    footer_copyright: "为乌玛以阿曼那建造。",''',
    
    "de": '''    footer_tagline: "Reinigen Sie Ihr Vermögen von Riba mit völliger Privatsphäre. Null-Wissen, lokal-zuerst, Scharia-konform.",
    footer_quick_links: "Schnelllinks",
    footer_features: "Hauptmerkmale",
    footer_feature_privacy: "Vollständige Privatsphäre",
    footer_feature_privacy_desc: "Alle Daten bleiben auf Ihrem Gerät",
    footer_feature_local: "Lokale Verarbeitung",
    footer_feature_local_desc: "Kein Internet erforderlich",
    footer_feature_shariah: "Scharia-konform",
    footer_feature_shariah_desc: "Verifizierte Methodik",
    footer_contact: "Kontakt",
    footer_copyright: "Mit Amanah für die Ummah gebaut.",''',
    
    "ru": '''    footer_tagline: "Очистите свое богатство от Риба с полной конфиденциальностью. Нулевое знание, локальный подход, соответствие шариату.",
    footer_quick_links: "Быстрые Ссылки",
    footer_features: "Ключевые Особенности",
    footer_feature_privacy: "Полная Конфиденциальность",
    footer_feature_privacy_desc: "Все данные остаются на вашем устройстве",
    footer_feature_local: "Локальная Обработка",
    footer_feature_local_desc: "Интернет не требуется",
    footer_feature_shariah: "Соответствие Шариату",
    footer_feature_shariah_desc: "Проверенная методология",
    footer_contact: "Контакты",
    footer_copyright: "Создано с Аманатом для Уммы.",''',
    
    "nl": '''    footer_tagline: "Zuiver uw rijkdom van Riba met volledige privacy. Nul-kennis, lokaal-eerst, Sharia-conform.",
    footer_quick_links: "Snelle Links",
    footer_features: "Belangrijkste Kenmerken",
    footer_feature_privacy: "Volledige Privacy",
    footer_feature_privacy_desc: "Alle gegevens blijven op uw apparaat",
    footer_feature_local: "Lokale Verwerking",
    footer_feature_local_desc: "Geen internet nodig",
    footer_feature_shariah: "Sharia-conform",
    footer_feature_shariah_desc: "Geverifieerde methodologie",
    footer_contact: "Contact",
    footer_copyright: "Gebouwd met Amanah voor de Ummah.",''',
    
    "he": '''    footer_tagline: "טהר את עושרך מריבא עם פרטיות מלאה. אפס ידע, מקומי ראשון, תואם לשריעה.",
    footer_quick_links: "קישורים מהירים",
    footer_features: "תכונות מפתח",
    footer_feature_privacy: "פרטיות מלאה",
    footer_feature_privacy_desc: "כל הנתונים נשארים במכשיר שלך",
    footer_feature_local: "עיבוד מקומי",
    footer_feature_local_desc: "לא נדרש אינטרנט",
    footer_feature_shariah: "תואם שריעה",
    footer_feature_shariah_desc: "מתודולוגיה מאומתת",
    footer_contact: "צור קשר",
    footer_copyright: "נבנה עם אמאנה עבור האומה.",''',
    
    "tr": '''    footer_tagline: "Tam gizlilikle servetinizi Riba'dan arındırın. Sıfır-bilgi, yerel-önce, Şeriat uyumlu.",
    footer_quick_links: "Hızlı Bağlantılar",
    footer_features: "Ana Özellikler",
    footer_feature_privacy: "Tam Gizlilik",
    footer_feature_privacy_desc: "Tüm veriler cihazınızda kalır",
    footer_feature_local: "Yerel İşleme",
    footer_feature_local_desc: "İnternet gerekli değil",
    footer_feature_shariah: "Şeriat Uyumlu",
    footer_feature_shariah_desc: "Doğrulanmış metodoloji",
    footer_contact: "İletişim",
    footer_copyright: "Ümmet için Emanet ile inşa edildi.",''',
    
    "bs": '''    footer_tagline: "Očistite svoje bogatstvo od Riba uz potpunu privatnost. Nulto znanje, lokalno-prvo, usklađeno sa Šerijatom.",
    footer_quick_links: "Brze Veze",
    footer_features: "Ključne Karakteristike",
    footer_feature_privacy: "Potpuna Privatnost",
    footer_feature_privacy_desc: "Svi podaci ostaju na vašem uređaju",
    footer_feature_local: "Lokalna Obrada",
    footer_feature_local_desc: "Internet nije potreban",
    footer_feature_shariah: "Usklađeno sa Šerijatom",
    footer_feature_shariah_desc: "Provjerena metodologija",
    footer_contact: "Kontakt",
    footer_copyright: "Izgrađeno s Amanetom za Ummet.",''',
    
    "sq": '''    footer_tagline: "Pastroni pasurinë tuaj nga Riba me privatësi të plotë. Zero-njohuri, lokale-së pari, në përputhje me Sheriatin.",
    footer_quick_links: "Lidhje të Shpejta",
    footer_features: "Veçori Kryesore",
    footer_feature_privacy: "Privatësi e Plotë",
    footer_feature_privacy_desc: "Të gjitha të dhënat mbeten në pajisjen tuaj",
    footer_feature_local: "Përpunim Lokal",
    footer_feature_local_desc: "Nuk kërkohet internet",
    footer_feature_shariah: "Në përputhje me Sheriatin",
    footer_feature_shariah_desc: "Metodologji e verifikuar",
    footer_contact: "Kontakti",
    footer_copyright: "Ndërtuar me Amanet për Umetin.",''',
}

file_path = 'translations.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for lang, new_translation in translations.items():
    # Find the old footer pattern for each language
    old_pattern = f'    footer_tagline:'
    
    # Find the language section
    lang_start = content.find(f'{lang}: {{')
    if lang_start == -1:
        print(f"❌ Could not find language section for {lang}")
        continue
    
    # Find the footer_tagline in this language section
    footer_start = content.find(old_pattern, lang_start)
    if footer_start == -1:
        print(f"❌ Could not find footer_tagline for {lang}")
        continue
    
    # Find the end of the old footer section (up to and including footer_copyright)
    footer_end = content.find('footer_copyright:', footer_start)
    if footer_end == -1:
        print(f"❌ Could not find footer_copyright for {lang}")
        continue
    
    # Find the end of the footer_copyright line
    line_end = content.find(',\n', footer_end)
    if line_end == -1:
        print(f"❌ Could not find end of footer_copyright line for {lang}")
        continue
    
    # Replace the old footer section with new one
    old_footer = content[footer_start:line_end+1]
    content = content.replace(old_footer, new_translation + '\n', 1)
    print(f"✅ Updated {lang}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All footer feature translations added!")
