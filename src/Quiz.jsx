import React, { useState, useEffect } from 'react';
import { speakWord, speakSentence, stopSpeaking } from './utils/speech.js';

function Quiz({ onClose, dailyWords, onTestComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isFavoriteTest, setIsFavoriteTest] = useState(false);
  const [favoriteWords, setFavoriteWords] = useState([]);

  useEffect(() => {
    // Favori kelimeleri kontrol et
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.length >= 3) { // 5'ten 3'e düşürdük
      setIsFavoriteTest(true);
      setFavoriteWords(favorites);
      generateFavoriteQuestions(favorites);
    } else {
      generateQuestions();
    }
  }, []);

  const generateFavoriteQuestions = (favorites) => {
    console.log("Favori kelimeler:", favorites); // Debug
    const shuffled = [...favorites].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3); // 5'ten 3'e düşürdük
    console.log("Seçilen kelimeler:", selected); // Debug
    
    const questions = [
      // 1 yazım sorusu (eşleştirme)
      {
        type: "match",
        word: selected[0].word,
        correct: selected[0].word,
        question: `${selected[0].word} kelimesini yazın`
      },
      // 1 telaffuz sorusu (doğru/yanlış)
      {
        type: "tf",
        word: selected[1].word,
        correct: true,
        question: `${selected[1].word} kelimesinin telaffuzu doğru mu?`
      },
      // 1 cümle tamamlama (boşluk doldurma)
      {
        type: "fill",
        word: selected[2].word,
        correct: selected[2].word,
        sentence: selected[2].sentence_en.replace(selected[2].word, "_____")
      }
    ];
    
    console.log("Oluşturulan sorular:", questions); // Debug
    setQuestions(questions);
  };

  const generateQuestions = () => {
    if (!dailyWords || dailyWords.length === 0) return;
    
    const data = dailyWords;
    const daily = data.slice(0, 5); // 5 kelime
    
    const questions = [
      // 2 çoktan seçmeli (anlam)
      ...daily.slice(0, 2).map((w, index) => {
        const availableWrongs = data.filter(x => 
          x.word !== w.word && 
          x.meaning && 
          x.meaning.trim() !== '' &&
          !daily.some(d => d.word === x.word)
        );
        
        let wrongs = [];
        if (availableWrongs.length >= 3) {
          wrongs = shuffle(availableWrongs).slice(0, 3).map(x => x.meaning);
        } else {
          wrongs = ["bilinmiyor", "farklı anlam", "benzer kelime"];
        }
        
        const options = shuffle([w.meaning, ...wrongs]);
        
        return {
          type: "mc",
          word: w.word,
          correct: w.meaning,
          options
        };
      }),
      // 1 doğru/yanlış (anlam kontrolü)
      {
        type: "tf",
        word: daily[2].word,
        correct: Math.random() > 0.5,
        question: `${daily[2].word} kelimesinin anlamı "${daily[2].meaning}" mi?`
      },
      // 1 eşleştirme (anlam)
      {
        type: "match",
        word: daily[3].word,
        correct: daily[3].meaning,
        question: `${daily[3].word} kelimesinin anlamını yazın`
      },
      // 1 boşluk doldurma (cümle)
      {
        type: "fill",
        word: daily[4].word,
        correct: daily[4].word,
        sentence: daily[4].sentence_en.replace(daily[4].word, "_____")
      }
    ];
    
    setQuestions(questions);
  };

  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = (answer) => {
    const currentQ = questions[currentStep];
    let isCorrect = false;
    
    if (currentQ.type === "mc") {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === "tf") {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === "match") {
      isCorrect = answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
    } else if (currentQ.type === "fill") {
      isCorrect = answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
    }
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setUserAnswers({ ...userAnswers, [currentStep]: answer });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setShowResult(true);
    
    // Test sonucunu kaydet
    const testResult = {
      date: new Date().toISOString(),
      score: score + (userAnswers[currentStep] ? 1 : 0),
      total: questions.length,
      isFavoriteTest,
      testType: isFavoriteTest ? "favorite" : "daily"
    };
    
    // Test sonuçlarını localStorage'a kaydet
    const testResults = JSON.parse(localStorage.getItem("testResults") || "[]");
    testResults.push(testResult);
    localStorage.setItem("testResults", JSON.stringify(testResults));
    
    // Eğer günlük test başarılıysa ve favori test değilse, kelimeleri öğrenildi olarak işaretle
    if (!isFavoriteTest && testResult.score >= 4) {
      const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
      const newLearned = dailyWords.map(w => w.word).filter(w => !learnedWords.includes(w));
      localStorage.setItem("learnedWords", JSON.stringify([...learnedWords, ...newLearned]));
    }
    
    if (onTestComplete) {
      onTestComplete(testResult);
    }
  };

  const handleNextDay = () => {
    // Yeni gün için kelimeleri sıfırla
    localStorage.removeItem("dailyWords");
    onClose();
  };

  const handleRetry = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers({});
    
    if (isFavoriteTest) {
      generateFavoriteQuestions(favoriteWords);
    } else {
      generateQuestions();
    }
  };

  if (questions.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Kelimeler yükleniyor...</div>
      </div>
    );
  }

  if (showResult) {
    const finalScore = score + (userAnswers[currentStep] ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassed = finalScore >= 4;
    
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Test Tamamlandı!</h2>
        <div style={{ fontSize: "2rem", margin: "20px 0", color: isPassed ? "#28a745" : "#dc3545" }}>
          {finalScore}/{questions.length} ({percentage}%)
        </div>
        
        {isPassed ? (
          <div style={{ color: "#28a745", marginBottom: "20px" }}>
            {isFavoriteTest ? "Favori test başarılı!" : "Tebrikler! Günlük kelimeleri öğrendiniz!"}
          </div>
        ) : (
          <div style={{ color: "#dc3545", marginBottom: "20px" }}>
            {isFavoriteTest ? "Favori test başarısız. Tekrar deneyin!" : "Daha fazla çalışmanız gerekiyor."}
          </div>
        )}
        
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={handleRetry}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "white",
              cursor: "pointer"
            }}
          >
            Tekrar Dene
          </button>
          
          {!isFavoriteTest && isPassed && (
            <button 
              onClick={handleNextDay}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                border: "none",
                borderRadius: "8px",
                background: "#28a745",
                color: "white",
                cursor: "pointer"
              }}
            >
              Yeni Gün
            </button>
          )}
          
          <button 
            onClick={onClose}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              background: "#6c757d",
              color: "white",
              cursor: "pointer"
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>{isFavoriteTest ? "Favori Test" : "Günlük Test"}</h2>
        <div style={{ fontSize: "1.2rem" }}>
          {currentStep + 1}/{questions.length}
        </div>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
          Skor: {score}
        </div>
        <div style={{ 
          width: "100%", 
          height: "8px", 
          background: "#e9ecef", 
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{ 
            width: `${((currentStep + 1) / questions.length) * 100}%`, 
            height: "100%", 
            background: "#007bff",
            transition: "width 0.3s ease"
          }}></div>
        </div>
      </div>

      {/* Çoktan Seçmeli Soru */}
      {currentQ.type === "mc" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#111" }}>
            <b>{currentQ.word}</b> kelimesinin anlamı nedir?
            <button 
              onClick={() => speakWord(currentQ.word)}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                background: "#007bff",
                color: "white",
                cursor: "pointer"
              }}
            >
              🔊 Telaffuz
            </button>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {currentQ.options.map((opt, index) => (
              <button 
                key={`mc-${currentStep}-${index}-${opt}`}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  background: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  color: "#000000",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "#ddd";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Doğru/Yanlış Soru */}
      {currentQ.type === "tf" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#111" }}>
            {currentQ.question}
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button 
              onClick={() => handleAnswer(true)}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                border: "2px solid #28a745",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#28a745",
                cursor: "pointer",
                fontWeight: "500"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#28a745";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#ffffff";
                e.target.style.color = "#28a745";
              }}
            >
              ✅ Doğru
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                border: "2px solid #dc3545",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#dc3545",
                cursor: "pointer",
                fontWeight: "500"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#dc3545";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#ffffff";
                e.target.style.color = "#dc3545";
              }}
            >
              ❌ Yanlış
            </button>
          </div>
        </div>
      )}

      {/* Eşleştirme Soru */}
      {currentQ.type === "match" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#111" }}>
            {currentQ.question}
            <button 
              onClick={() => speakWord(currentQ.word)}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                background: "#007bff",
                color: "white",
                cursor: "pointer"
              }}
            >
              🔊 Telaffuz
            </button>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Kelimeyi yazın..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer(e.target.value);
                }
              }}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "18px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#000000",
                fontWeight: "500"
              }}
            />
          </div>
          <button 
            onClick={() => {
              const input = document.querySelector('input');
              if (input) handleAnswer(input.value);
            }}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "white",
              cursor: "pointer"
            }}
          >
            Cevabı Gönder
          </button>
        </div>
      )}

      {/* Boşluk Doldurma Soru */}
      {currentQ.type === "fill" && (
        <div>
          <div style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#111" }}>
            Boşluğu doldurun:
          </div>
          <div style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#333", fontStyle: "italic" }}>
            {currentQ.sentence}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Eksik kelimeyi yazın..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer(e.target.value);
                }
              }}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "18px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#000000",
                fontWeight: "500"
              }}
            />
          </div>
          <button 
            onClick={() => {
              const input = document.querySelector('input');
              if (input) handleAnswer(input.value);
            }}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "white",
              cursor: "pointer"
            }}
          >
            Cevabı Gönder
          </button>
        </div>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button 
          onClick={onClose}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            background: "#6c757d",
            color: "white",
            cursor: "pointer"
          }}
        >
          Testi İptal Et
        </button>
      </div>
    </div>
  );
}

export default Quiz; 