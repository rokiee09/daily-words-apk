import json

words = [
    {"word": "abandon", "type": "verb", "meaning": "terk etmek", "sentence_en": "He had to abandon his car in the snow.", "sentence_tr": "Arabasını karda terk etmek zorunda kaldı."},
    {"word": "ability", "type": "noun", "meaning": "yetenek", "sentence_en": "She has the ability to learn quickly.", "sentence_tr": "Hızlı öğrenme yeteneği var."},
    {"word": "able", "type": "adjective", "meaning": "yapabilir", "sentence_en": "Are you able to help me?", "sentence_tr": "Bana yardım edebilir misin?"},
    {"word": "about", "type": "preposition", "meaning": "hakkında", "sentence_en": "What is this book about?", "sentence_tr": "Bu kitap ne hakkında?"},
    {"word": "above", "type": "preposition", "meaning": "üstünde", "sentence_en": "The bird flew above the trees.", "sentence_tr": "Kuş ağaçların üstünde uçtu."},
    {"word": "accept", "type": "verb", "meaning": "kabul etmek", "sentence_en": "I accept your offer.", "sentence_tr": "Teklifini kabul ediyorum."},
    {"word": "access", "type": "noun", "meaning": "erişim", "sentence_en": "You need a password to access the file.", "sentence_tr": "Dosyaya erişmek için şifre gerekiyor."},
    {"word": "accident", "type": "noun", "meaning": "kaza", "sentence_en": "There was a car accident on the highway.", "sentence_tr": "Otoyolda bir araba kazası oldu."},
    {"word": "accomplish", "type": "verb", "meaning": "başarmak", "sentence_en": "She accomplished her goal.", "sentence_tr": "Hedefini başardı."},
    {"word": "account", "type": "noun", "meaning": "hesap", "sentence_en": "I opened a bank account.", "sentence_tr": "Bir banka hesabı açtım."},
    {"word": "achieve", "type": "verb", "meaning": "elde etmek", "sentence_en": "He achieved his dream of becoming a doctor.", "sentence_tr": "Doktor olma hayalini gerçekleştirdi."},
    {"word": "active", "type": "adjective", "meaning": "aktif", "sentence_en": "She leads a very active lifestyle.", "sentence_tr": "Çok aktif bir yaşam tarzı sürüyor."},
    {"word": "activity", "type": "noun", "meaning": "aktivite", "sentence_en": "Swimming is a great activity.", "sentence_tr": "Yüzme harika bir aktivitedir."},
    {"word": "actual", "type": "adjective", "meaning": "gerçek", "sentence_en": "The actual cost was higher than expected.", "sentence_tr": "Gerçek maliyet beklenenden yüksekti."},
    {"word": "add", "type": "verb", "meaning": "eklemek", "sentence_en": "Please add some salt to the soup.", "sentence_tr": "Lütfen çorbaya biraz tuz ekle."},
    {"word": "address", "type": "noun", "meaning": "adres", "sentence_en": "What is your home address?", "sentence_tr": "Ev adresin nedir?"},
    {"word": "admit", "type": "verb", "meaning": "kabul etmek", "sentence_en": "I must admit I was wrong.", "sentence_tr": "Yanıldığımı kabul etmeliyim."},
    {"word": "adult", "type": "noun", "meaning": "yetişkin", "sentence_en": "Children need adult supervision.", "sentence_tr": "Çocukların yetişkin gözetimine ihtiyacı var."},
    {"word": "advance", "type": "verb", "meaning": "ilerlemek", "sentence_en": "Technology continues to advance rapidly.", "sentence_tr": "Teknoloji hızla ilerlemeye devam ediyor."},
    {"word": "advantage", "type": "noun", "meaning": "avantaj", "sentence_en": "Being tall is an advantage in basketball.", "sentence_tr": "Basketbolda uzun olmak bir avantajdır."}
]

with open('public/words.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print(f"Created {len(words)} words in words.json") 