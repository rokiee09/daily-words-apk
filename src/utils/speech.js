// Web Speech API desteğini kontrol et
export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}

// Seslerin yüklenmesini bekle
function waitForVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}

// En iyi İngilizce sesi bul
async function findBestEnglishVoice() {
  const voices = await waitForVoices();
  
  // Sadece en-US sesleri kabul et
  const usVoices = voices.filter(voice => voice.lang === 'en-US');
  
  if (usVoices.length === 0) {
    console.warn('No en-US voices found, using default');
    return null;
  }
  
  // Kadın sesi tercih et
  const femaleVoice = usVoices.find(voice => 
    voice.name.toLowerCase().includes('female') || 
    voice.name.toLowerCase().includes('woman') ||
    voice.name.toLowerCase().includes('girl')
  );
  
  return femaleVoice || usVoices[0];
}

// Kelimeyi sesli oku
export async function speakWord(word) {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = await findBestEnglishVoice();
  
  // Kelimeyi temizle
  const cleanWord = word.replace(/[^a-zA-Z\s]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanWord);
  
  // Zorla İngilizce yap
  utterance.lang = 'en-US';
  utterance.rate = 0.7;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  // Sadece en-US sesi kullan
  if (englishVoice && englishVoice.lang === 'en-US') {
    utterance.voice = englishVoice;
  }

  // Hata durumunda tekrar dene
  utterance.onerror = (event) => {
    console.error('Speech error:', event);
    // Tekrar dene
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  window.speechSynthesis.speak(utterance);
}

// Cümleyi sesli oku
export async function speakSentence(sentence) {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = await findBestEnglishVoice();
  
  // Cümleyi temizle
  const cleanSentence = sentence.replace(/[^a-zA-Z\s.,!?]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanSentence);
  
  // Zorla İngilizce yap
  utterance.lang = 'en-US';
  utterance.rate = 0.6;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  // Sadece en-US sesi kullan
  if (englishVoice && englishVoice.lang === 'en-US') {
    utterance.voice = englishVoice;
  }

  // Hata durumunda tekrar dene
  utterance.onerror = (event) => {
    console.error('Speech error:', event);
    // Tekrar dene
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  window.speechSynthesis.speak(utterance);
}

// Sesli okumayı durdur
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
} 