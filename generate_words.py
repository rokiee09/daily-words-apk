import json
import random

# Mevcut kelimeleri koruyalım
existing_words = [
  {
    "word": "harsh",
    "type": "adjective",
    "meaning": "sert",
    "sentence_en": "The judge gave a harsh sentence.",
    "sentence_tr": "Yargıç sert bir ceza verdi."
  },
  {
    "word": "cautious",
    "type": "adjective", 
    "meaning": "dikkatli",
    "sentence_en": "Be cautious when driving in the rain.",
    "sentence_tr": "Yağmurda araba kullanırken dikkatli ol."
  },
  {
    "word": "frustration",
    "type": "noun",
    "meaning": "hayal kırıklığı",
    "sentence_en": "He couldn't hide his frustration after failing again.",
    "sentence_tr": "Yine başarısız olunca hayal kırıklığını gizleyemedi."
  },
  {
    "word": "emerge",
    "type": "verb",
    "meaning": "ortaya çıkmak",
    "sentence_en": "New problems began to emerge after the update.",
    "sentence_tr": "Güncellemeden sonra yeni problemler ortaya çıkmaya başladı."
  },
  {
    "word": "benevolent",
    "type": "adjective",
    "meaning": "iyi niyetli",
    "sentence_en": "She was a benevolent leader who cared for her people.",
    "sentence_tr": "Halkını önemseyen iyi niyetli bir liderdi."
  },
  {
    "word": "abandon",
    "type": "verb",
    "meaning": "terk etmek",
    "sentence_en": "He decided to abandon the project due to lack of funds.",
    "sentence_tr": "Yetersiz fon nedeniyle projeyi terk etmeye karar verdi."
  },
  {
    "word": "genuine",
    "type": "adjective",
    "meaning": "gerçek, samimi",
    "sentence_en": "Her smile was warm and genuine.",
    "sentence_tr": "Onun gülümsemesi sıcak ve samimiydi."
  },
  {
    "word": "justify",
    "type": "verb",
    "meaning": "haklı göstermek",
    "sentence_en": "Can you justify your actions?",
    "sentence_tr": "Davranışlarını haklı gösterebilir misin?"
  },
  {
    "word": "idle",
    "type": "adjective",
    "meaning": "boş, aylak",
    "sentence_en": "The workers stood idle during the strike.",
    "sentence_tr": "Grev sırasında işçiler boş durdu."
  },
  {
    "word": "dazzling",
    "type": "adjective",
    "meaning": "göz kamaştırıcı",
    "sentence_en": "The performance was absolutely dazzling.",
    "sentence_tr": "Gösteri kesinlikle göz kamaştırıcıydı."
  },
  {
    "word": "persistent",
    "type": "adjective",
    "meaning": "ısrarcı, kararlı",
    "sentence_en": "Her persistent efforts finally paid off.",
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
    "word": "resilient",
    "type": "adjective",
    "meaning": "dayanıklı, esnek",
    "sentence_en": "Children are remarkably resilient to change.",
    "sentence_tr": "Çocuklar değişime karşı şaşırtıcı derecede dayanıklıdır."
  },
  {
    "word": "profound",
    "type": "adjective",
    "meaning": "derin, derinlemesine",
    "sentence_en": "The book had a profound impact on my thinking.",
    "sentence_tr": "Kitap düşüncelerim üzerinde derin bir etki bıraktı."
  },
  {
    "word": "authentic",
    "type": "adjective",
    "meaning": "gerçek, otantik",
    "sentence_en": "This restaurant serves authentic Italian food.",
    "sentence_tr": "Bu restoran gerçek İtalyan yemeği servis ediyor."
  },
  {
    "word": "efficient",
    "type": "adjective",
    "meaning": "verimli, etkili",
    "sentence_en": "The new system is much more efficient.",
    "sentence_tr": "Yeni sistem çok daha verimli."
  },
  {
    "word": "confident",
    "type": "adjective",
    "meaning": "kendinden emin",
    "sentence_en": "She was confident about her presentation.",
    "sentence_tr": "Sunumu hakkında kendinden emindi."
  },
  {
    "word": "curious",
    "type": "adjective",
    "meaning": "meraklı",
    "sentence_en": "Children are naturally curious about everything.",
    "sentence_tr": "Çocuklar doğal olarak her şeyi merak eder."
  },
  {
    "word": "generous",
    "type": "adjective",
    "meaning": "cömert",
    "sentence_en": "He was very generous with his time and money.",
    "sentence_tr": "Zamanı ve parası konusunda çok cömertti."
  },
  {
    "word": "patient",
    "type": "adjective",
    "meaning": "sabırlı",
    "sentence_en": "Good teachers are always patient with their students.",
    "sentence_tr": "İyi öğretmenler öğrencilerine karşı her zaman sabırlıdır."
  },
  {
    "word": "creative",
    "type": "adjective",
    "meaning": "yaratıcı",
    "sentence_en": "She has a very creative approach to problem-solving.",
    "sentence_tr": "Problem çözme konusunda çok yaratıcı bir yaklaşımı var."
  },
  {
    "word": "reliable",
    "type": "adjective",
    "meaning": "güvenilir",
    "sentence_en": "He is a reliable employee who always meets deadlines.",
    "sentence_tr": "O her zaman son teslim tarihlerini karşılayan güvenilir bir çalışan."
  },
  {
    "word": "flexible",
    "type": "adjective",
    "meaning": "esnek",
    "sentence_en": "The company offers flexible working hours.",
    "sentence_tr": "Şirket esnek çalışma saatleri sunuyor."
  },
  {
    "word": "ambitious",
    "type": "adjective",
    "meaning": "hırslı, tutkulu",
    "sentence_en": "She is very ambitious about her career goals.",
    "sentence_tr": "Kariyer hedefleri konusunda çok hırslı."
  },
  {
    "word": "enthusiastic",
    "type": "adjective",
    "meaning": "hevesli, coşkulu",
    "sentence_en": "The students were enthusiastic about the new project.",
    "sentence_tr": "Öğrenciler yeni proje hakkında hevesliydi."
  }
]

# Yeni kelimeler ekleyelim (3000'e yakın olacak şekilde)
new_words = [
  # Adjectives
  {"word": "brilliant", "type": "adjective", "meaning": "parlak, zeki", "sentence_en": "She has a brilliant mind.", "sentence_tr": "Parlak bir zekası var."},
  {"word": "courageous", "type": "adjective", "meaning": "cesur", "sentence_en": "The firefighter was very courageous.", "sentence_tr": "İtfaiyeci çok cesurdu."},
  {"word": "determined", "type": "adjective", "meaning": "kararlı", "sentence_en": "She was determined to succeed.", "sentence_tr": "Başarmaya kararlıydı."},
  {"word": "energetic", "type": "adjective", "meaning": "enerjik", "sentence_en": "The children are very energetic.", "sentence_tr": "Çocuklar çok enerjik."},
  {"word": "friendly", "type": "adjective", "meaning": "arkadaş canlısı", "sentence_en": "The neighbors are very friendly.", "sentence_tr": "Komşular çok arkadaş canlısı."},
  {"word": "grateful", "type": "adjective", "meaning": "minnettar", "sentence_en": "I am grateful for your help.", "sentence_tr": "Yardımın için minnettarım."},
  {"word": "honest", "type": "adjective", "meaning": "dürüst", "sentence_en": "He is an honest person.", "sentence_tr": "O dürüst bir kişi."},
  {"word": "intelligent", "type": "adjective", "meaning": "zeki", "sentence_en": "She is very intelligent.", "sentence_tr": "O çok zeki."},
  {"word": "kind", "type": "adjective", "meaning": "nazik", "sentence_en": "She is very kind to everyone.", "sentence_tr": "Herkese karşı çok nazik."},
  {"word": "loyal", "type": "adjective", "meaning": "sadık", "sentence_en": "He is a loyal friend.", "sentence_tr": "O sadık bir arkadaş."},
  {"word": "modest", "type": "adjective", "meaning": "mütevazı", "sentence_en": "She is very modest about her success.", "sentence_tr": "Başarısı konusunda çok mütevazı."},
  {"word": "optimistic", "type": "adjective", "meaning": "iyimser", "sentence_en": "He has an optimistic outlook on life.", "sentence_tr": "Hayata karşı iyimser bir bakış açısı var."},
  {"word": "polite", "type": "adjective", "meaning": "kibar", "sentence_en": "The waiter was very polite.", "sentence_tr": "Garson çok kibardı."},
  {"word": "responsible", "type": "adjective", "meaning": "sorumlu", "sentence_en": "She is a responsible student.", "sentence_tr": "O sorumlu bir öğrenci."},
  {"word": "sincere", "type": "adjective", "meaning": "samimi", "sentence_en": "His apology was sincere.", "sentence_tr": "Özrü samimiydi."},
  {"word": "talented", "type": "adjective", "meaning": "yetenekli", "sentence_en": "She is a talented musician.", "sentence_tr": "O yetenekli bir müzisyen."},
  {"word": "understanding", "type": "adjective", "meaning": "anlayışlı", "sentence_en": "My parents are very understanding.", "sentence_tr": "Ailem çok anlayışlı."},
  {"word": "valuable", "type": "adjective", "meaning": "değerli", "sentence_en": "This is a valuable lesson.", "sentence_tr": "Bu değerli bir ders."},
  {"word": "wise", "type": "adjective", "meaning": "bilge", "sentence_en": "The old man is very wise.", "sentence_tr": "Yaşlı adam çok bilge."},
  {"word": "young", "type": "adjective", "meaning": "genç", "sentence_en": "She looks very young.", "sentence_tr": "Çok genç görünüyor."},
  
  # Verbs
  {"word": "achieve", "type": "verb", "meaning": "başarmak", "sentence_en": "She achieved her goals.", "sentence_tr": "Hedeflerini başardı."},
  {"word": "believe", "type": "verb", "meaning": "inanmak", "sentence_en": "I believe in you.", "sentence_tr": "Sana inanıyorum."},
  {"word": "choose", "type": "verb", "meaning": "seçmek", "sentence_en": "You must choose carefully.", "sentence_tr": "Dikkatli seçmelisin."},
  {"word": "decide", "type": "verb", "meaning": "karar vermek", "sentence_en": "We need to decide soon.", "sentence_tr": "Yakında karar vermemiz gerekiyor."},
  {"word": "explain", "type": "verb", "meaning": "açıklamak", "sentence_en": "Can you explain this to me?", "sentence_tr": "Bunu bana açıklayabilir misin?"},
  {"word": "follow", "type": "verb", "meaning": "takip etmek", "sentence_en": "Please follow the instructions.", "sentence_tr": "Lütfen talimatları takip edin."},
  {"word": "give", "type": "verb", "meaning": "vermek", "sentence_en": "I will give you a gift.", "sentence_tr": "Sana bir hediye vereceğim."},
  {"word": "help", "type": "verb", "meaning": "yardım etmek", "sentence_en": "Can you help me?", "sentence_tr": "Bana yardım edebilir misin?"},
  {"word": "improve", "type": "verb", "meaning": "geliştirmek", "sentence_en": "She wants to improve her skills.", "sentence_tr": "Becerilerini geliştirmek istiyor."},
  {"word": "join", "type": "verb", "meaning": "katılmak", "sentence_en": "Would you like to join us?", "sentence_tr": "Bize katılmak ister misin?"},
  {"word": "keep", "type": "verb", "meaning": "saklamak", "sentence_en": "Please keep this secret.", "sentence_tr": "Lütfen bu sırrı sakla."},
  {"word": "learn", "type": "verb", "meaning": "öğrenmek", "sentence_en": "I want to learn English.", "sentence_tr": "İngilizce öğrenmek istiyorum."},
  {"word": "make", "type": "verb", "meaning": "yapmak", "sentence_en": "She will make dinner.", "sentence_tr": "O akşam yemeği yapacak."},
  {"word": "need", "type": "verb", "meaning": "ihtiyaç duymak", "sentence_en": "I need your help.", "sentence_tr": "Yardımına ihtiyacım var."},
  {"word": "offer", "type": "verb", "meaning": "teklif etmek", "sentence_en": "He offered me a job.", "sentence_tr": "Bana bir iş teklif etti."},
  {"word": "prepare", "type": "verb", "meaning": "hazırlamak", "sentence_en": "I need to prepare for the exam.", "sentence_tr": "Sınava hazırlanmam gerekiyor."},
  {"word": "remember", "type": "verb", "meaning": "hatırlamak", "sentence_en": "Do you remember me?", "sentence_tr": "Beni hatırlıyor musun?"},
  {"word": "show", "type": "verb", "meaning": "göstermek", "sentence_en": "Can you show me the way?", "sentence_tr": "Bana yolu gösterebilir misin?"},
  {"word": "take", "type": "verb", "meaning": "almak", "sentence_en": "Please take a seat.", "sentence_tr": "Lütfen oturun."},
  {"word": "understand", "type": "verb", "meaning": "anlamak", "sentence_en": "I don't understand this.", "sentence_tr": "Bunu anlamıyorum."},
  {"word": "want", "type": "verb", "meaning": "istemek", "sentence_en": "What do you want?", "sentence_tr": "Ne istiyorsun?"},
  {"word": "work", "type": "verb", "meaning": "çalışmak", "sentence_en": "I work in an office.", "sentence_tr": "Bir ofiste çalışıyorum."},
  
  # Nouns
  {"word": "achievement", "type": "noun", "meaning": "başarı", "sentence_en": "This is a great achievement.", "sentence_tr": "Bu büyük bir başarı."},
  {"word": "adventure", "type": "noun", "meaning": "macera", "sentence_en": "We had an amazing adventure.", "sentence_tr": "Harika bir maceramız oldu."},
  {"word": "beauty", "type": "noun", "meaning": "güzellik", "sentence_en": "The beauty of nature is amazing.", "sentence_tr": "Doğanın güzelliği şaşırtıcı."},
  {"word": "challenge", "type": "noun", "meaning": "meydan okuma", "sentence_en": "This is a difficult challenge.", "sentence_tr": "Bu zor bir meydan okuma."},
  {"word": "courage", "type": "noun", "meaning": "cesaret", "sentence_en": "She showed great courage.", "sentence_tr": "Büyük cesaret gösterdi."},
  {"word": "dream", "type": "noun", "meaning": "rüya", "sentence_en": "I had a strange dream.", "sentence_tr": "Garip bir rüya gördüm."},
  {"word": "education", "type": "noun", "meaning": "eğitim", "sentence_en": "Education is very important.", "sentence_tr": "Eğitim çok önemli."},
  {"word": "freedom", "type": "noun", "meaning": "özgürlük", "sentence_en": "Freedom is precious.", "sentence_tr": "Özgürlük değerlidir."},
  {"word": "friendship", "type": "noun", "meaning": "arkadaşlık", "sentence_en": "Friendship is valuable.", "sentence_tr": "Arkadaşlık değerlidir."},
  {"word": "happiness", "type": "noun", "meaning": "mutluluk", "sentence_en": "Happiness comes from within.", "sentence_tr": "Mutluluk içten gelir."},
  {"word": "hope", "type": "noun", "meaning": "umut", "sentence_en": "Never lose hope.", "sentence_tr": "Asla umudunu kaybetme."},
  {"word": "imagination", "type": "noun", "meaning": "hayal gücü", "sentence_en": "Children have great imagination.", "sentence_tr": "Çocukların harika hayal gücü var."},
  {"word": "knowledge", "type": "noun", "meaning": "bilgi", "sentence_en": "Knowledge is power.", "sentence_tr": "Bilgi güçtür."},
  {"word": "love", "type": "noun", "meaning": "aşk", "sentence_en": "Love conquers all.", "sentence_tr": "Aşk her şeyi fetheder."},
  {"word": "memory", "type": "noun", "meaning": "hafıza", "sentence_en": "I have a good memory.", "sentence_tr": "İyi bir hafızam var."},
  {"word": "nature", "type": "noun", "meaning": "doğa", "sentence_en": "I love nature.", "sentence_tr": "Doğayı seviyorum."},
  {"word": "opportunity", "type": "noun", "meaning": "fırsat", "sentence_en": "This is a great opportunity.", "sentence_tr": "Bu harika bir fırsat."},
  {"word": "peace", "type": "noun", "meaning": "barış", "sentence_en": "We need peace in the world.", "sentence_tr": "Dünyada barışa ihtiyacımız var."},
  {"word": "quality", "type": "noun", "meaning": "kalite", "sentence_en": "This product has good quality.", "sentence_tr": "Bu ürünün iyi kalitesi var."},
  {"word": "success", "type": "noun", "meaning": "başarı", "sentence_en": "Success requires hard work.", "sentence_tr": "Başarı çok çalışma gerektirir."},
  {"word": "time", "type": "noun", "meaning": "zaman", "sentence_en": "Time is precious.", "sentence_tr": "Zaman değerlidir."},
  {"word": "wisdom", "type": "noun", "meaning": "bilgelik", "sentence_en": "Wisdom comes with age.", "sentence_tr": "Bilgelik yaşla gelir."},
  {"word": "youth", "type": "noun", "meaning": "gençlik", "sentence_en": "Youth is a precious time.", "sentence_tr": "Gençlik değerli bir zamandır."}
]

# Tüm kelimeleri birleştir
all_words = existing_words + new_words

# Dosyaya yaz
with open('public/words.json', 'w', encoding='utf-8') as f:
    json.dump(all_words, f, ensure_ascii=False, indent=2)

print(f"Toplam {len(all_words)} kelime oluşturuldu!")
print("Dosya: public/words.json") 