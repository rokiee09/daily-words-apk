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
  
  // Seed bazlı pseudo-random sıralama - daha iyi karıştırma
  const shuffled = [...unlearnedWords].sort((a, b) => {
    // Daha karmaşık hash fonksiyonu
    const hashA = (a.word.length * seed + a.word.charCodeAt(0) + a.word.charCodeAt(a.word.length - 1)) % 10000;
    const hashB = (b.word.length * seed + b.word.charCodeAt(0) + b.word.charCodeAt(b.word.length - 1)) % 10000;
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
  
  // Eğer 5 kelime bulunamadıysa, kalan kelimelerden rastgele seç
  if (selectedWords.length < 5 && unlearnedWords.length > selectedWords.length) {
    const remainingWords = unlearnedWords.filter(w => !usedWords.has(w.word));
    const additionalWords = remainingWords.slice(0, 5 - selectedWords.length);
    selectedWords.push(...additionalWords);
  }
  
  return selectedWords;
} 