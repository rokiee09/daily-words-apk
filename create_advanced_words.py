import json
import random

# Oxford 3000'den daha zor kelimeler
advanced_words = [
    {
        "word": "accomplish",
        "type": "verb",
        "meaning": "başarmak, tamamlamak",
        "sentence_en": "She accomplished all her goals for the year.",
        "sentence_tr": "Yıl için tüm hedeflerini başardı."
    },
    {
        "word": "endeavor",
        "type": "noun",
        "meaning": "çaba, gayret",
        "sentence_en": "His endeavor to learn a new language was successful.",
        "sentence_tr": "Yeni bir dil öğrenme çabası başarılı oldu."
    },
    {
        "word": "perseverance",
        "type": "noun",
        "meaning": "azim, sebat",
        "sentence_en": "Success comes through perseverance and hard work.",
        "sentence_tr": "Başarı azim ve çok çalışma ile gelir."
    },
    {
        "word": "resilient",
        "type": "adjective",
        "meaning": "dayanıklı, esnek",
        "sentence_en": "She is very resilient in the face of challenges.",
        "sentence_tr": "Zorluklar karşısında çok dayanıklı."
    },
    {
        "word": "profound",
        "type": "adjective",
        "meaning": "derin, derinlemesine",
        "sentence_en": "The book had a profound impact on my thinking.",
        "sentence_tr": "Kitap düşüncelerim üzerinde derin bir etki bıraktı."
    },
    {
        "word": "eloquent",
        "type": "adjective",
        "meaning": "güzel konuşan, belagatli",
        "sentence_en": "His eloquent speech moved the entire audience.",
        "sentence_tr": "Onun belagatli konuşması tüm dinleyicileri etkiledi."
    },
    {
        "word": "authentic",
        "type": "adjective",
        "meaning": "gerçek, otantik",
        "sentence_en": "This restaurant serves authentic Italian cuisine.",
        "sentence_tr": "Bu restoran otantik İtalyan mutfağı sunuyor."
    },
    {
        "word": "innovative",
        "type": "adjective",
        "meaning": "yenilikçi, yaratıcı",
        "sentence_en": "The company is known for its innovative products.",
        "sentence_tr": "Şirket yenilikçi ürünleriyle tanınıyor."
    },
    {
        "word": "sophisticated",
        "type": "adjective",
        "meaning": "sofistike, karmaşık",
        "sentence_en": "She has a sophisticated taste in art.",
        "sentence_tr": "Sanatta sofistike bir zevki var."
    },
    {
        "word": "arbitrary",
        "type": "adjective",
        "meaning": "keyfi, rastgele",
        "sentence_en": "The decision seemed completely arbitrary.",
        "sentence_tr": "Karar tamamen keyfi görünüyordu."
    },
    {
        "word": "comprehensive",
        "type": "adjective",
        "meaning": "kapsamlı, geniş",
        "sentence_en": "The report provides a comprehensive analysis.",
        "sentence_tr": "Rapor kapsamlı bir analiz sunuyor."
    },
    {
        "word": "persistent",
        "type": "adjective",
        "meaning": "ısrarcı, kalıcı",
        "sentence_en": "His persistent efforts finally paid off.",
        "sentence_tr": "Onun ısrarcı çabaları sonunda meyvesini verdi."
    },
    {
        "word": "elaborate",
        "type": "adjective",
        "meaning": "ayrıntılı, karmaşık",
        "sentence_en": "The plan was very elaborate and well-thought-out.",
        "sentence_tr": "Plan çok ayrıntılı ve iyi düşünülmüştü."
    },
    {
        "word": "profound",
        "type": "adjective",
        "meaning": "derin, derinlemesine",
        "sentence_en": "The philosopher had profound insights about life.",
        "sentence_tr": "Filozofun hayat hakkında derin içgörüleri vardı."
    },
    {
        "word": "authentic",
        "type": "adjective",
        "meaning": "gerçek, otantik",
        "sentence_en": "The painting was confirmed to be authentic.",
        "sentence_tr": "Tablonun gerçek olduğu doğrulandı."
    },
    {
        "word": "resilient",
        "type": "adjective",
        "meaning": "dayanıklı, esnek",
        "sentence_en": "Children are often more resilient than adults.",
        "sentence_tr": "Çocuklar genellikle yetişkinlerden daha dayanıklıdır."
    },
    {
        "word": "sophisticated",
        "type": "adjective",
        "meaning": "sofistike, karmaşık",
        "sentence_en": "The software uses sophisticated algorithms.",
        "sentence_tr": "Yazılım sofistike algoritmalar kullanıyor."
    },
    {
        "word": "innovative",
        "type": "adjective",
        "meaning": "yenilikçi, yaratıcı",
        "sentence_en": "The team came up with an innovative solution.",
        "sentence_tr": "Ekip yenilikçi bir çözüm buldu."
    },
    {
        "word": "eloquent",
        "type": "adjective",
        "meaning": "güzel konuşan, belagatli",
        "sentence_en": "The writer is known for his eloquent prose.",
        "sentence_tr": "Yazar belagatli nesriyle tanınıyor."
    },
    {
        "word": "comprehensive",
        "type": "adjective",
        "meaning": "kapsamlı, geniş",
        "sentence_en": "The course offers comprehensive training.",
        "sentence_tr": "Kurs kapsamlı eğitim sunuyor."
    },
    {
        "word": "persistent",
        "type": "adjective",
        "meaning": "ısrarcı, kalıcı",
        "sentence_en": "The persistent rain ruined our picnic.",
        "sentence_tr": "Israrcı yağmur pikniğimizi mahvetti."
    },
    {
        "word": "elaborate",
        "type": "adjective",
        "meaning": "ayrıntılı, karmaşık",
        "sentence_en": "The wedding had an elaborate ceremony.",
        "sentence_tr": "Düğünün ayrıntılı bir töreni vardı."
    },
    {
        "word": "arbitrary",
        "type": "adjective",
        "meaning": "keyfi, rastgele",
        "sentence_en": "The rules seemed arbitrary and unfair.",
        "sentence_tr": "Kurallar keyfi ve adaletsiz görünüyordu."
    },
    {
        "word": "endeavor",
        "type": "noun",
        "meaning": "çaba, gayret",
        "sentence_en": "Learning a new language is a worthwhile endeavor.",
        "sentence_tr": "Yeni bir dil öğrenmek değerli bir çabadır."
    },
    {
        "word": "perseverance",
        "type": "noun",
        "meaning": "azim, sebat",
        "sentence_en": "His perseverance in the face of failure was admirable.",
        "sentence_tr": "Başarısızlık karşısındaki azmi takdire şayandı."
    },
    {
        "word": "accomplish",
        "type": "verb",
        "meaning": "başarmak, tamamlamak",
        "sentence_en": "They accomplished their mission successfully.",
        "sentence_tr": "Görevlerini başarıyla tamamladılar."
    },
    {
        "word": "sophisticated",
        "type": "adjective",
        "meaning": "sofistike, karmaşık",
        "sentence_en": "The city has a sophisticated public transport system.",
        "sentence_tr": "Şehrin sofistike bir toplu taşıma sistemi var."
    },
    {
        "word": "innovative",
        "type": "adjective",
        "meaning": "yenilikçi, yaratıcı",
        "sentence_en": "The company is always looking for innovative ideas.",
        "sentence_tr": "Şirket her zaman yenilikçi fikirler arıyor."
    },
    {
        "word": "authentic",
        "type": "adjective",
        "meaning": "gerçek, otantik",
        "sentence_en": "The restaurant serves authentic Mexican food.",
        "sentence_tr": "Restoran otantik Meksika yemeği sunuyor."
    },
    {
        "word": "resilient",
        "type": "adjective",
        "meaning": "dayanıklı, esnek",
        "sentence_en": "The economy has proven to be very resilient.",
        "sentence_tr": "Ekonomi çok dayanıklı olduğunu kanıtladı."
    }
]

# Kelimeleri karıştır
random.shuffle(advanced_words)

# JSON dosyasına kaydet
with open('public/advanced_words.json', 'w', encoding='utf-8') as f:
    json.dump(advanced_words, f, ensure_ascii=False, indent=2)

print(f"{len(advanced_words)} zor kelime oluşturuldu!")
print("Dosya: public/advanced_words.json") 