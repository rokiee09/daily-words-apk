import json

# words.json dosyasını oku
with open("public/words.json", "r", encoding="utf-8") as f:
    words = json.load(f)

print(f"📚 Toplam kelime sayısı: {len(words)}")

# Duplicate'ları bul ve temizle
seen_words = set()
unique_words = []

for word in words:
    if word["word"] not in seen_words:
        seen_words.add(word["word"])
        unique_words.append(word)

print(f"🧹 Duplicate temizlendikten sonra: {len(unique_words)}")
print(f"🗑️  Silinen duplicate sayısı: {len(words) - len(unique_words)}")

# Temizlenmiş listeyi kaydet
with open("public/words_clean.json", "w", encoding="utf-8") as f:
    json.dump(unique_words, f, ensure_ascii=False, indent=2)

print("✅ Temizlenmiş dosya: public/words_clean.json")

# Örnek duplicate'ları göster
word_counts = {}
for word in words:
    word_counts[word["word"]] = word_counts.get(word["word"], 0) + 1

duplicates = {word: count for word, count in word_counts.items() if count > 1}
print(f"\n🔍 En çok duplicate olan kelimeler:")
for word, count in sorted(duplicates.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"  {word}: {count} kez")


