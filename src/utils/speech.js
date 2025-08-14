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

// En iyi sesi bul (Türkçe sesi İngilizce gibi kullan)
async function findBestVoice() {
  const voices = await waitForVoices();
  
  // Önce en-US sesleri ara
  const usVoices = voices.filter(voice => voice.lang === 'en-US');
  if (usVoices.length > 0) {
    return usVoices[0];
  }
  
  // en-US yoksa, mevcut sesi kullan ama zorla İngilizce yap
  const availableVoice = voices[0];
  console.log('Using available voice:', availableVoice.name, availableVoice.lang);
  return availableVoice;
}

// Kelimeyi sesli oku
export async function speakWord(word) {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi sesi bul
  const voice = await findBestVoice();
  
  // Kelimeyi temizle
  const cleanWord = word.replace(/[^a-zA-Z\s]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanWord);
  
  // Zorla İngilizce yap
  utterance.lang = 'en-US';
  utterance.rate = 0.6;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  // Ses ayarla
  if (voice) {
    utterance.voice = voice;
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

  // En iyi sesi bul
  const voice = await findBestVoice();
  
  // Cümleyi temizle
  const cleanSentence = sentence.replace(/[^a-zA-Z\s.,!?]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanSentence);
  
  // Zorla İngilizce yap
  utterance.lang = 'en-US';
  utterance.rate = 0.5;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  // Ses ayarla
  if (voice) {
    utterance.voice = voice;
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