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
  // Tamamen rastgele karıştır
  const shuffled = [...unlearnedWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
} 