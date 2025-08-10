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

// Yaygın kelimelerin telaffuzunu düzelt
function improvePronunciation(word) {
  const pronunciationMap = {
    'the': 'thee',
    'a': 'ay',
    'an': 'an',
    'and': 'and',
    'or': 'or',
    'but': 'but',
    'in': 'in',
    'on': 'on',
    'at': 'at',
    'to': 'too',
    'for': 'for',
    'of': 'of',
    'with': 'with',
    'by': 'by',
    'from': 'from',
    'about': 'about',
    'through': 'through',
    'during': 'during',
    'before': 'before',
    'after': 'after'
  };
  
  const lowerWord = word.toLowerCase();
  return pronunciationMap[lowerWord] || word;
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
  
  // Kelimeyi temizle ve telaffuzunu iyileştir
  const cleanWord = word.replace(/[^a-zA-Z\s]/g, '');
  const improvedWord = improvePronunciation(cleanWord);
  
  const utterance = new SpeechSynthesisUtterance(improvedWord);
  
  // Zorla İngilizce ayarları - ÇOKLU KONTROL
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
    // Ses başladıktan sonra da dili kontrol et
    if (utterance.voice) {
      utterance.voice.lang = 'en-US';
    }
  };

  // Ses başlamadan önce son kontrol
  utterance.onboundary = () => {
    utterance.lang = 'en-US';
  };

  // Hata durumunda tekrar dene
  utterance.onerror = (event) => {
    console.warn('Speech error, retrying with different settings:', event);
    // Hata durumunda basit ayarlarla tekrar dene
    const retryUtterance = new SpeechSynthesisUtterance(improvedWord);
    retryUtterance.lang = 'en-US';
    retryUtterance.rate = 0.8;
    retryUtterance.pitch = 1;
    retryUtterance.volume = 1;
    window.speechSynthesis.speak(retryUtterance);
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
  
  // Zorla İngilizce ayarları - ÇOKLU KONTROL
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
    // Ses başladıktan sonra da dili kontrol et
    if (utterance.voice) {
      utterance.voice.lang = 'en-US';
    }
  };

  // Ses başlamadan önce son kontrol
  utterance.onboundary = () => {
    utterance.lang = 'en-US';
  };

  // Hata durumunda tekrar dene
  utterance.onerror = (event) => {
    console.warn('Speech error, retrying with different settings:', event);
    // Hata durumunda basit ayarlarla tekrar dene
    const retryUtterance = new SpeechSynthesisUtterance(cleanSentence);
    retryUtterance.lang = 'en-US';
    retryUtterance.rate = 0.7;
    retryUtterance.pitch = 1;
    retryUtterance.volume = 1;
    window.speechSynthesis.speak(retryUtterance);
  };

  window.speechSynthesis.speak(utterance);
}

// Sesli okumayı durdur
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
} 