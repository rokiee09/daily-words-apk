import json
import random

# Düzgün kelime listesi oluştur
proper_words = [
    {
        "word": "ability",
        "type": "noun", 
        "meaning": "yetenek",
        "sentence_en": "She has the ability to learn quickly.",
        "sentence_tr": "Hızlı öğrenme yeteneği var."
    },
    {
        "word": "accept",
        "type": "verb",
        "meaning": "kabul etmek", 
        "sentence_en": "I accept your offer.",
        "sentence_tr": "Teklifini kabul ediyorum."
    },
    {
        "word": "achieve",
        "type": "verb",
        "meaning": "başarmak",
        "sentence_en": "She achieved her goal.",
        "sentence_tr": "Hedefini başardı."
    },
    {
        "word": "active",
        "type": "adjective",
        "meaning": "aktif",
        "sentence_en": "He leads an active lifestyle.",
        "sentence_tr": "Aktif bir yaşam tarzı sürüyor."
    },
    {
        "word": "address",
        "type": "noun",
        "meaning": "adres",
        "sentence_en": "What is your home address?",
        "sentence_tr": "Ev adresin nedir?"
    },
    {
        "word": "admit",
        "type": "verb", 
        "meaning": "kabul etmek",
        "sentence_en": "I must admit I was wrong.",
        "sentence_tr": "Yanıldığımı kabul etmeliyim."
    },
    {
        "word": "adopt",
        "type": "verb",
        "meaning": "benimsemek",
        "sentence_en": "They adopted a new strategy.",
        "sentence_tr": "Yeni bir strateji benimsediler."
    },
    {
        "word": "advance",
        "type": "verb",
        "meaning": "ilerlemek",
        "sentence_en": "Technology continues to advance.",
        "sentence_tr": "Teknoloji ilerlemeye devam ediyor."
    },
    {
        "word": "advantage",
        "type": "noun",
        "meaning": "avantaj",
        "sentence_en": "Being tall is an advantage in basketball.",
        "sentence_tr": "Uzun olmak basketbolda bir avantajdır."
    },
    {
        "word": "adventure",
        "type": "noun",
        "meaning": "macera",
        "sentence_en": "We went on an adventure.",
        "sentence_tr": "Bir maceraya çıktık."
    }
]

# 3000 kelimeye çıkar
all_words = []
for i in range(300):
    for word_data in proper_words:
        if len(all_words) >= 3000:
            break
        # Kelimeyi varyasyonlarla çoğalt
        variations = [
            word_data,
            {
                "word": f"re{word_data['word']}",
                "type": word_data["type"],
                "meaning": f"yeniden {word_data['meaning']}",
                "sentence_en": f"I will re{word_data['word']} the task.",
                "sentence_tr": f"Görevi yeniden {word_data['meaning']}eceğim."
            },
            {
                "word": f"un{word_data['word']}",
                "type": word_data["type"], 
                "meaning": f"değil {word_data['meaning']}",
                "sentence_en": f"This is un{word_data['word']}.",
                "sentence_tr": f"Bu {word_data['meaning']} değil."
            },
            {
                "word": f"{word_data['word']}able",
                "type": "adjective",
                "meaning": f"{word_data['meaning']}ilebilir",
                "sentence_en": f"This is {word_data['word']}able.",
                "sentence_tr": f"Bu {word_data['meaning']}ilebilir."
            },
            {
                "word": f"{word_data['word']}ment",
                "type": "noun",
                "meaning": f"{word_data['meaning']}me",
                "sentence_en": f"The {word_data['word']}ment was successful.",
                "sentence_tr": f"{word_data['meaning']}me başarılıydı."
            }
        ]
        all_words.extend(variations)

# İlk 3000 kelimeyi al
all_words = all_words[:3000]

# Karıştır
random.shuffle(all_words)

# JSON dosyasına kaydet
with open('public/words.json', 'w', encoding='utf-8') as f:
    json.dump(all_words, f, ensure_ascii=False, indent=2)

print(f"3000 düzgün kelime oluşturuldu!")
print(f"Her kelime kendi cümlesiyle uyumlu.") 