export function getDailyWords(words, date = new Date()) {
  // Öğrenilen kelimeleri localStorage'dan al
  let learnedWords = [];
  try {
    learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
  } catch (e) {
    learnedWords = [];
  }
  
  // Henüz öğrenilmemiş kelimeleri filtrele
  const unlearnedWords = words.filter(w => !learnedWords.includes(w.word));
  
  if (unlearnedWords.length === 0) {
    return [];
  }
  
  // Tarih bazlı seed oluştur (her gün farklı kelimeler için)
  const dateString = date.toISOString().slice(0, 10); // YYYY-MM-DD formatı
  const [year, month, day] = dateString.split('-').map(Number);
  const seed = year * 10000 + month * 100 + day; // Benzersiz günlük seed
  
  // Seed bazlı pseudo-random sıralama
  const shuffled = [...unlearnedWords].sort((a, b) => {
    const hashA = (a.word.length * seed + a.word.charCodeAt(0)) % 1000;
    const hashB = (b.word.length * seed + b.word.charCodeAt(0)) % 1000;
    return hashA - hashB;
  });
  
  // İlk 5 kelimeyi al ve tekrar kontrolü yap
  const selectedWords = [];
  const usedWords = new Set();
  
  for (const word of shuffled) {
    if (selectedWords.length >= 5) break;
    
    // Eğer bu kelime daha önce seçilmediyse ekle
    if (!usedWords.has(word.word)) {
      selectedWords.push(word);
      usedWords.add(word.word);
    }
  }
  
  return selectedWords;
} 