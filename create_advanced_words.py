import json
import random

# Daha zor ve günlük hayatta kullanılan kelimeler
advanced_words = [
    # İş ve Kariyer
    {"word": "accomplish", "type": "verb", "meaning": "başarmak", "sentence_en": "She accomplished her goals through hard work.", "sentence_tr": "O zorlu çalışma ile hedeflerini başardı."},
    {"word": "achieve", "type": "verb", "meaning": "elde etmek", "sentence_en": "He achieved success in his career.", "sentence_tr": "O kariyerinde başarı elde etti."},
    {"word": "accomplishment", "type": "noun", "meaning": "başarı", "sentence_en": "This project is a great accomplishment.", "sentence_tr": "Bu proje büyük bir başarı."},
    {"word": "advance", "type": "verb", "meaning": "ilerlemek", "sentence_en": "Technology continues to advance rapidly.", "sentence_tr": "Teknoloji hızla ilerlemeye devam ediyor."},
    {"word": "advantage", "type": "noun", "meaning": "avantaj", "sentence_en": "Speaking English gives you an advantage.", "sentence_tr": "İngilizce konuşmak size avantaj sağlar."},
    
    # Teknoloji ve İnternet
    {"word": "algorithm", "type": "noun", "meaning": "algoritma", "sentence_en": "The algorithm processes data efficiently.", "sentence_tr": "Algoritma veriyi verimli şekilde işler."},
    {"word": "artificial", "type": "adjective", "meaning": "yapay", "sentence_en": "Artificial intelligence is changing the world.", "sentence_tr": "Yapay zeka dünyayı değiştiriyor."},
    {"word": "automation", "type": "noun", "meaning": "otomasyon", "sentence_en": "Automation reduces manual work.", "sentence_tr": "Otomasyon manuel işi azaltır."},
    {"word": "bandwidth", "type": "noun", "meaning": "bant genişliği", "sentence_en": "High bandwidth allows fast internet.", "sentence_tr": "Yüksek bant genişliği hızlı internet sağlar."},
    {"word": "browser", "type": "noun", "meaning": "tarayıcı", "sentence_en": "I use Chrome as my web browser.", "sentence_tr": "Web tarayıcım olarak Chrome kullanıyorum."},
    
    # Sağlık ve Fitness
    {"word": "beneficial", "type": "adjective", "meaning": "faydalı", "sentence_en": "Exercise is beneficial for health.", "sentence_tr": "Egzersiz sağlık için faydalıdır."},
    {"word": "cardiovascular", "type": "adjective", "meaning": "kardiyovasküler", "sentence_en": "Running improves cardiovascular health.", "sentence_tr": "Koşmak kardiyovasküler sağlığı iyileştirir."},
    {"word": "endurance", "type": "noun", "meaning": "dayanıklılık", "sentence_en": "Swimming builds endurance.", "sentence_tr": "Yüzme dayanıklılık geliştirir."},
    {"word": "flexibility", "type": "noun", "meaning": "esneklik", "sentence_en": "Yoga improves flexibility.", "sentence_tr": "Yoga esnekliği artırır."},
    {"word": "nutrition", "type": "noun", "meaning": "beslenme", "sentence_en": "Good nutrition is essential for health.", "sentence_tr": "İyi beslenme sağlık için gereklidir."},
    
    # Eğitim ve Öğrenme
    {"word": "comprehensive", "type": "adjective", "meaning": "kapsamlı", "sentence_en": "This is a comprehensive study guide.", "sentence_tr": "Bu kapsamlı bir çalışma rehberi."},
    {"word": "curriculum", "type": "noun", "meaning": "müfredat", "sentence_en": "The curriculum covers all important topics.", "sentence_tr": "Müfredat tüm önemli konuları kapsar."},
    {"word": "evaluate", "type": "verb", "meaning": "değerlendirmek", "sentence_en": "Teachers evaluate student performance.", "sentence_tr": "Öğretmenler öğrenci performansını değerlendirir."},
    {"word": "knowledge", "type": "noun", "meaning": "bilgi", "sentence_en": "Knowledge is power.", "sentence_tr": "Bilgi güçtür."},
    {"word": "research", "type": "noun", "meaning": "araştırma", "sentence_en": "Research shows that exercise helps learning.", "sentence_tr": "Araştırma egzersizin öğrenmeye yardımcı olduğunu gösteriyor."},
    
    # İş ve Ekonomi
    {"word": "budget", "type": "noun", "meaning": "bütçe", "sentence_en": "We need to stick to our budget.", "sentence_tr": "Bütçemize sadık kalmamız gerekiyor."},
    {"word": "investment", "type": "noun", "meaning": "yatırım", "sentence_en": "Education is the best investment.", "sentence_tr": "Eğitim en iyi yatırımdır."},
    {"word": "profit", "type": "noun", "meaning": "kar", "sentence_en": "The company made a good profit this year.", "sentence_tr": "Şirket bu yıl iyi kar elde etti."},
    {"word": "revenue", "type": "noun", "meaning": "gelir", "sentence_en": "Online sales increased our revenue.", "sentence_tr": "Online satışlar gelirimizi artırdı."},
    {"word": "strategy", "type": "noun", "meaning": "strateji", "sentence_en": "We need a new marketing strategy.", "sentence_tr": "Yeni bir pazarlama stratejisine ihtiyacımız var."},
    
    # Çevre ve Sürdürülebilirlik
    {"word": "environmental", "type": "adjective", "meaning": "çevresel", "sentence_en": "Environmental protection is important.", "sentence_tr": "Çevre koruması önemlidir."},
    {"word": "sustainable", "type": "adjective", "meaning": "sürdürülebilir", "sentence_en": "We need sustainable energy sources.", "sentence_tr": "Sürdürülebilir enerji kaynaklarına ihtiyacımız var."},
    {"word": "renewable", "type": "adjective", "meaning": "yenilenebilir", "sentence_en": "Solar power is renewable energy.", "sentence_tr": "Güneş enerjisi yenilenebilir enerjidir."},
    {"word": "pollution", "type": "noun", "meaning": "kirlilik", "sentence_en": "Air pollution affects our health.", "sentence_tr": "Hava kirliliği sağlığımızı etkiler."},
    {"word": "conservation", "type": "noun", "meaning": "koruma", "sentence_en": "Water conservation is essential.", "sentence_tr": "Su tasarrufu gereklidir."},
    
    # Sosyal Medya ve İletişim
    {"word": "influence", "type": "noun", "meaning": "etki", "sentence_en": "Social media has great influence on people.", "sentence_tr": "Sosyal medyanın insanlar üzerinde büyük etkisi var."},
    {"word": "engagement", "type": "noun", "meaning": "katılım", "sentence_en": "High engagement means more interaction.", "sentence_tr": "Yüksek katılım daha fazla etkileşim demektir."},
    {"word": "viral", "type": "adjective", "meaning": "viral", "sentence_en": "The video went viral on social media.", "sentence_tr": "Video sosyal medyada viral oldu."},
    {"word": "trending", "type": "adjective", "meaning": "trend", "sentence_en": "This topic is trending on Twitter.", "sentence_tr": "Bu konu Twitter'da trend."},
    {"word": "hashtag", "type": "noun", "meaning": "hashtag", "sentence_en": "Use hashtags to increase visibility.", "sentence_tr": "Görünürlüğü artırmak için hashtag kullanın."},
    
    # Seyahat ve Turizm
    {"word": "destination", "type": "noun", "meaning": "varış noktası", "sentence_en": "Paris is a popular tourist destination.", "sentence_tr": "Paris popüler bir turist varış noktası."},
    {"word": "accommodation", "type": "noun", "meaning": "konaklama", "sentence_en": "We found good accommodation in the city.", "sentence_tr": "Şehirde iyi konaklama bulduk."},
    {"word": "itinerary", "type": "noun", "meaning": "seyahat planı", "sentence_en": "Our itinerary includes three cities.", "sentence_tr": "Seyahat planımız üç şehri içeriyor."},
    {"word": "landmark", "type": "noun", "meaning": "önemli yer", "sentence_en": "The Eiffel Tower is a famous landmark.", "sentence_tr": "Eyfel Kulesi ünlü bir önemli yerdir."},
    {"word": "sightseeing", "type": "noun", "meaning": "gezme", "sentence_en": "We did a lot of sightseeing in Rome.", "sentence_tr": "Roma'da çok gezme yaptık."},
    
    # Yemek ve Mutfak
    {"word": "cuisine", "type": "noun", "meaning": "mutfak", "sentence_en": "Italian cuisine is famous worldwide.", "sentence_tr": "İtalyan mutfağı dünya çapında ünlüdür."},
    {"word": "ingredient", "type": "noun", "meaning": "malzeme", "sentence_en": "Fresh ingredients make better food.", "sentence_tr": "Taze malzemeler daha iyi yemek yapar."},
    {"word": "recipe", "type": "noun", "meaning": "tarif", "sentence_en": "This recipe is easy to follow.", "sentence_tr": "Bu tarif takip etmesi kolay."},
    {"word": "appetizer", "type": "noun", "meaning": "başlangıç yemeği", "sentence_en": "We ordered appetizers before the main course.", "sentence_tr": "Ana yemekten önce başlangıç yemeği sipariş ettik."},
    {"word": "dessert", "type": "noun", "meaning": "tatlı", "sentence_en": "Chocolate cake is my favorite dessert.", "sentence_tr": "Çikolatalı kek favori tatlım."},
    
    # Spor ve Rekreatif Aktiviteler
    {"word": "tournament", "type": "noun", "meaning": "turnuva", "sentence_en": "The tennis tournament starts next week.", "sentence_tr": "Tenis turnuvası gelecek hafta başlıyor."},
    {"word": "championship", "type": "noun", "meaning": "şampiyona", "sentence_en": "They won the championship last year.", "sentence_tr": "Geçen yıl şampiyonayı kazandılar."},
    {"word": "competition", "type": "noun", "meaning": "yarışma", "sentence_en": "The competition was very tough.", "sentence_tr": "Yarışma çok zordu."},
    {"word": "performance", "type": "noun", "meaning": "performans", "sentence_en": "His performance in the game was excellent.", "sentence_tr": "Oyundaki performansı mükemmeldi."},
    {"word": "achievement", "type": "noun", "meaning": "başarı", "sentence_en": "Winning the medal was a great achievement.", "sentence_tr": "Madalyayı kazanmak büyük bir başarıydı."}
]

# Kelimeleri karıştır
random.shuffle(advanced_words)

# JSON dosyasına kaydet
with open('public/advanced_words.json', 'w', encoding='utf-8') as f:
    json.dump(advanced_words, f, ensure_ascii=False, indent=2)

print(f"✅ {len(advanced_words)} adet gelişmiş kelime oluşturuldu!")
print("📁 Dosya: public/advanced_words.json")
print("\nİlk 10 kelime:")
for i, word in enumerate(advanced_words[:10]):
    print(f"{i+1}. {word['word']} - {word['meaning']}") 