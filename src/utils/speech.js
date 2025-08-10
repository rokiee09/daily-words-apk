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
  
  // Öncelik sırası: en-US > en-GB > diğer İngilizce
  const bestVoice = voices.find(voice => 
    voice.lang === 'en-US'
  ) || voices.find(voice => 
    voice.lang === 'en-GB'
  ) || voices.find(voice => 
    voice.lang.startsWith('en')
  );
  
  return bestVoice;
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
  
  // Basit ayarlar
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

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
  
  // Basit ayarlar
  utterance.lang = 'en-US';
  utterance.rate = 0.7;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Sesli okumayı durdur
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
} 