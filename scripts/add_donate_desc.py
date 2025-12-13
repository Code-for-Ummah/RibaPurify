#!/usr/bin/env python3
# Add donate description translations to all languages

translations = {
    "hi": '    donate_here: "यहाँ दान करें",\n    donate_here_desc: "सार्वजनिक दान में दें बिना पुरस्कार (सवाब) की उम्मीद के — यह एक शुद्धि अधिनियम (तथीर) है, दान (सदका) नहीं। यहाँ कुछ सत्यापित संगठन हैं:",\n    donate_remove_immediately: "इस राशि को तुरंत हटा दें।",\n    donate_region_global: "वैश्विक",\n    donate_region_uk_global: "यूके, वैश्विक",\n    donate_region_usa_global: "यूएसए, वैश्विक",\n    donate_region_your_area: "आपका क्षेत्र",',
    "fr": '    donate_here: "Faire un don ici",\n    donate_here_desc: "Donnez à des œuvres caritatives publiques sans attendre de récompense (Sawab) — c\'est un acte de purification (Tathir), pas une charité (Sadaqah). Voici quelques organisations vérifiées:",\n    donate_remove_immediately: "Retirez ce montant immédiatement.",\n    donate_region_global: "Global",\n    donate_region_uk_global: "Royaume-Uni, Global",\n    donate_region_usa_global: "États-Unis, Global",\n    donate_region_your_area: "Votre région",',
    "ar": '    donate_here: "تبرع هنا",\n    donate_here_desc: "تبرع للأعمال الخيرية العامة دون توقع أجر (ثواب) — هذا عمل تطهير (تطهير)، وليس صدقة. إليك بعض المنظمات الموثوقة:",\n    donate_remove_immediately: "أزل هذا المبلغ فورًا.",\n    donate_region_global: "عالمي",\n    donate_region_uk_global: "المملكة المتحدة، عالمي",\n    donate_region_usa_global: "الولايات المتحدة، عالمي",\n    donate_region_your_area: "منطقتك",',
    "ur": '    donate_here: "یہاں عطیہ کریں",\n    donate_here_desc: "عوامی خیرات میں دیں بغیر اجر (ثواب) کی توقع کے — یہ پاکیزگی کا عمل (تطہیر) ہے، صدقہ نہیں۔ یہاں کچھ تصدیق شدہ تنظیمیں ہیں:",\n    donate_remove_immediately: "اس رقم کو فوری طور پر ہٹا دیں۔",\n    donate_region_global: "عالمی",\n    donate_region_uk_global: "برطانیہ، عالمی",\n    donate_region_usa_global: "امریکہ، عالمی",\n    donate_region_your_area: "آپ کا علاقہ",',
    "bn": '    donate_here: "এখানে দান করুন",\n    donate_here_desc: "পুরস্কার (সওয়াব) আশা না করে পাবলিক দাতব্যে দিন — এটি একটি পরিশোধন কাজ (তাথির), দাতব্য (সাদাকাহ) নয়। এখানে কিছু যাচাইকৃত সংস্থা রয়েছে:",\n    donate_remove_immediately: "এই পরিমাণ অবিলম্বে সরান।",\n    donate_region_global: "বৈশ্বিক",\n    donate_region_uk_global: "যুক্তরাজ্য, বৈশ্বিক",\n    donate_region_usa_global: "মার্কিন যুক্তরাষ্ট্র, বৈশ্বিক",\n    donate_region_your_area: "আপনার এলাকা",',
    "id": '    donate_here: "Donasi di Sini",\n    donate_here_desc: "Berikan kepada amal publik tanpa mengharapkan pahala (Sawab) — ini adalah tindakan pembersihan (Tathir), bukan amal (Sadaqah). Berikut beberapa organisasi terverifikasi:",\n    donate_remove_immediately: "Hapus jumlah ini segera.",\n    donate_region_global: "Global",\n    donate_region_uk_global: "Inggris, Global",\n    donate_region_usa_global: "Amerika, Global",\n    donate_region_your_area: "Wilayah Anda",',
    "ms": '    donate_here: "Derma di Sini",\n    donate_here_desc: "Beri kepada amal awam tanpa mengharapkan ganjaran (Sawab) — ini adalah tindakan pembersihan (Tathir), bukan sedekah (Sadaqah). Berikut beberapa organisasi yang disahkan:",\n    donate_remove_immediately: "Keluarkan jumlah ini dengan segera.",\n    donate_region_global: "Global",\n    donate_region_uk_global: "UK, Global",\n    donate_region_usa_global: "Amerika, Global",\n    donate_region_your_area: "Kawasan Anda",',
    "zh": '    donate_here: "在此捐赠",\n    donate_here_desc: "向公共慈善机构捐赠，不期望回报（萨瓦布）——这是净化行为（塔希尔），而不是慈善（萨达卡）。以下是一些经过验证的组织：",\n    donate_remove_immediately: "立即清除此金额。",\n    donate_region_global: "全球",\n    donate_region_uk_global: "英国，全球",\n    donate_region_usa_global: "美国，全球",\n    donate_region_your_area: "您的地区",',
    "de": '    donate_here: "Hier spenden",\n    donate_here_desc: "Geben Sie an öffentliche Wohltätigkeitsorganisationen, ohne eine Belohnung (Sawab) zu erwarten — dies ist eine Reinigungshandlung (Tathir), keine Wohltätigkeit (Sadaqah). Hier sind einige verifizierte Organisationen:",\n    donate_remove_immediately: "Entfernen Sie diesen Betrag sofort.",\n    donate_region_global: "Global",\n    donate_region_uk_global: "Großbritannien, Global",\n    donate_region_usa_global: "USA, Global",\n    donate_region_your_area: "Ihre Region",',
    "ru": '    donate_here: "Пожертвовать здесь",\n    donate_here_desc: "Жертвуйте на общественную благотворительность, не ожидая награды (Саваб) — это акт очищения (Татхир), а не милостыня (Садака). Вот несколько проверенных организаций:",\n    donate_remove_immediately: "Немедленно удалите эту сумму.",\n    donate_region_global: "Глобально",\n    donate_region_uk_global: "Великобритания, Глобально",\n    donate_region_usa_global: "США, Глобально",\n    donate_region_your_area: "Ваш регион",',
    "nl": '    donate_here: "Doneer hier",\n    donate_here_desc: "Geef aan openbare liefdadigheid zonder beloning (Sawab) te verwachten — dit is een zuivering (Tathir), geen liefdadigheid (Sadaqah). Hier zijn enkele geverifieerde organisaties:",\n    donate_remove_immediately: "Verwijder dit bedrag onmiddellijk.",\n    donate_region_global: "Wereldwijd",\n    donate_region_uk_global: "VK, Wereldwijd",\n    donate_region_usa_global: "VS, Wereldwijd",\n    donate_region_your_area: "Uw gebied",',
    "he": '    donate_here: "תרום כאן",\n    donate_here_desc: "תרום לצדקה ציבורית מבלי לצפות לתגמול (סוואב) — זהו מעשה טיהור (טאת\'יר), לא צדקה (סדקה). הנה כמה ארגונים מאומתים:",\n    donate_remove_immediately: "הסר את הסכום הזה מיד.",\n    donate_region_global: "עולמי",\n    donate_region_uk_global: "בריטניה, עולמי",\n    donate_region_usa_global: "ארה\\"ב, עולמי",\n    donate_region_your_area: "האזור שלך",',
    "tr": '    donate_here: "Buradan Bağış Yapın",\n    donate_here_desc: "Mükafat (Sevap) beklemeden kamu hayır kurumlarına verin — bu bir temizleme eylemidir (Tathir), hayır (Sadaka) değildir. İşte bazı doğrulanmış kuruluşlar:",\n    donate_remove_immediately: "Bu tutarı hemen kaldırın.",\n    donate_region_global: "Küresel",\n    donate_region_uk_global: "İngiltere, Küresel",\n    donate_region_usa_global: "ABD, Küresel",\n    donate_region_your_area: "Bölgeniz",',
    "bs": '    donate_here: "Doniraj ovdje",\n    donate_here_desc: "Donirajte javnoj dobrotvornoj organizaciji bez očekivanja nagrade (Sevap) — ovo je čin čišćenja (Tathir), a ne dobrotvorna djela (Sadaka). Evo nekih provjerenih organizacija:",\n    donate_remove_immediately: "Odmah uklonite ovaj iznos.",\n    donate_region_global: "Globalno",\n    donate_region_uk_global: "UK, Globalno",\n    donate_region_usa_global: "SAD, Globalno",\n    donate_region_your_area: "Vaše područje",',
    "sq": '    donate_here: "Dhuro këtu",\n    donate_here_desc: "Jepni për bamirësi publike pa pritur shpërblim (Sevap) — ky është një akt pastrimi (Tathir), jo bamirësi (Sadaka). Këtu janë disa organizata të verifikuara:",\n    donate_remove_immediately: "Hiq këtë shumë menjëherë.",\n    donate_region_global: "Globale",\n    donate_region_uk_global: "Mbretëria e Bashkuar, Globale",\n    donate_region_usa_global: "SHBA, Globale",\n    donate_region_your_area: "Zona juaj",'
}

# Read the file
with open('translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply all replacements
for lang, trans_text in translations.items():
    # Find the donate_here line for each language and replace it with full translation
    search_pattern = f'    donate_here: "'
    if search_pattern in content:
        # Find position of donate_here for this language
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if f'  {lang}:' in line:
                # Found the language section, now find donate_here
                for j in range(i, min(i+300, len(lines))):
                    if '    donate_here: "' in lines[j]:
                        # Replace just this line with all new translations
                        lines[j] = trans_text
                        break
                break
        content = '\n'.join(lines)

# Write back
with open('translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added donate description translations to all 15 languages!")
