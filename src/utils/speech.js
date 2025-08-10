// Web Speech API desteğini kontrol et
export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}

// En iyi İngilizce sesi bul
function findBestEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  
  // Öncelik sırası: en-US Female > en-GB Female > en-US > en-GB > diğer İngilizce
  const bestVoice = voices.find(voice => 
    voice.lang === 'en-US' && voice.name.includes('Female')
  ) || voices.find(voice => 
    voice.lang === 'en-GB' && voice.name.includes('Female')
  ) || voices.find(voice => 
    voice.lang === 'en-US'
  ) || voices.find(voice => 
    voice.lang === 'en-GB'
  ) || voices.find(voice => 
    voice.lang.startsWith('en')
  );
  
  return bestVoice;
}

// Kelimeyi sesli oku
export function speakWord(word, lang = 'en-US') {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = findBestEnglishVoice();
  
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US'; // Zorla İngilizce yap
  utterance.rate = 0.7; // Biraz yavaş oku
  utterance.pitch = 1.1; // Hafif yüksek ton
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
    utterance.lang = englishVoice.lang; // Sesin dilini kullan
  }

  // İngilizce telaffuz için ek ayarlar
  utterance.rate = 0.7; // Biraz yavaş
  utterance.pitch = 1.1; // Hafif yüksek ton

  window.speechSynthesis.speak(utterance);
}

// Cümleyi sesli oku
export function speakSentence(sentence, lang = 'en-US') {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = findBestEnglishVoice();
  
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'en-US'; // Zorla İngilizce yap
  utterance.rate = 0.6; // Cümle için daha yavaş
  utterance.pitch = 1.05; // Hafif yüksek ton
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
    utterance.lang = englishVoice.lang; // Sesin dilini kullan
  }

  // İngilizce telaffuz için ek ayarlar
  utterance.rate = 0.6; // Cümle için yavaş
  utterance.pitch = 1.05; // Hafif yüksek ton

  window.speechSynthesis.speak(utterance);
}

// Sesli okumayı durdur
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
} 