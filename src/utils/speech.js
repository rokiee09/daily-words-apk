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
export async function speakWord(word, lang = 'en-US') {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = await findBestEnglishVoice();
  
  // Kelimeyi temizle (sadece İngilizce karakterler)
  const cleanWord = word.replace(/[^a-zA-Z\s]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanWord);
  
  // Zorla İngilizce ayarları
  utterance.lang = 'en-US';
  utterance.rate = 0.7;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
    // Ses seçildikten sonra dili tekrar ayarla
    utterance.lang = 'en-US';
  }

  // Ses başlamadan önce dili tekrar kontrol et
  utterance.onstart = () => {
    utterance.lang = 'en-US';
  };

  window.speechSynthesis.speak(utterance);
}

// Cümleyi sesli oku
export async function speakSentence(sentence, lang = 'en-US') {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser');
    return;
  }

  // Önceki konuşmayı durdur
  window.speechSynthesis.cancel();

  // En iyi İngilizce sesi bul
  const englishVoice = await findBestEnglishVoice();
  
  // Cümleyi temizle (sadece İngilizce karakterler)
  const cleanSentence = sentence.replace(/[^a-zA-Z\s.,!?]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanSentence);
  
  // Zorla İngilizce ayarları
  utterance.lang = 'en-US';
  utterance.rate = 0.6;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
    // Ses seçildikten sonra dili tekrar ayarla
    utterance.lang = 'en-US';
  }

  // Ses başlamadan önce dili tekrar kontrol et
  utterance.onstart = () => {
    utterance.lang = 'en-US';
  };

  window.speechSynthesis.speak(utterance);
}

// Sesli okumayı durdur
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
} 