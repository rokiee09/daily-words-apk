import React, { useState, useEffect } from 'react';
import { speakWord, speakSentence, stopSpeaking } from './utils/speech.js';
import { recordTestResult, recordDailyStudy } from './utils/stats.js';

function Quiz({ onClose, dailyWords, onTestComplete }) {
  console.log("Quiz component render edildi, props:", { onClose, dailyWords, onTestComplete });
  
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    console.log("Quiz useEffect çalıştı"); // Debug
    console.log("dailyWords prop:", dailyWords); // Debug
    console.log("dailyWords type:", typeof dailyWords); // Debug
    console.log("dailyWords length:", dailyWords?.length); // Debug
    
    // Sadece mini test açılıyor
    console.log("Mini test açılıyor"); // Debug
    generateQuestions();
  }, [dailyWords]); // dailyWords dependency ekledik

  const generateQuestions = () => {
    console.log("generateQuestions çalıştı, dailyWords:", dailyWords);
    
    if (!dailyWords || dailyWords.length === 0) {
      console.log("dailyWords yok veya boş!");
      return;
    }
    
    const data = dailyWords;
    const daily = data.slice(0, 5); // 5 kelime
    
    console.log("Seçilen günlük kelimeler:", daily);
    
    const questions = [
      // 2 çoktan seçmeli (anlam)
      ...daily.slice(0, 2).map((w, index) => {
        // Diğer günlük kelimelerden yanlış cevaplar al
        const availableWrongs = daily.filter(x => x.word !== w.word && x.meaning);
        
        let wrongs = [];
        if (availableWrongs.length >= 3) {
          wrongs = availableWrongs.slice(0, 3).map(x => x.meaning);
        } else {
          // Eğer yeterli yanlış cevap yoksa, genel kelimeler ekle
          wrongs = ["büyük", "yeni", "iyi"];
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
    
    console.log("Oluşturulan sorular:", questions);
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
    
    console.log(`🔍 Quiz.jsx - handleAnswer çağrıldı:`, {
      currentStep: currentStep,
      answer: answer,
      question: currentQ,
      answerType: typeof answer
    });
    
    if (currentQ.type === "mc") {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === "tf") {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === "match") {
      isCorrect = answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
    } else if (currentQ.type === "fill") {
      isCorrect = answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
    }
    
    console.log(`🔍 Quiz.jsx - Cevap kontrolü:`, {
      isCorrect: isCorrect,
      expected: currentQ.correct,
      received: answer
    });
    
    if (isCorrect) {
      setScore(score + 1);
      console.log(`🔍 Quiz.jsx - Skor güncellendi: ${score} → ${score + 1}`);
    }
    
    // userAnswers'ı güncelle
    const newUserAnswers = { ...userAnswers, [currentStep]: answer };
    console.log(`🔍 Quiz.jsx - userAnswers güncellendi:`, {
      old: userAnswers,
      new: newUserAnswers,
      currentStep: currentStep
    });
    
    setUserAnswers(newUserAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Son soru - userAnswers güncellendikten sonra finishTest'i çağır
      console.log(`🔍 Quiz.jsx - Son soru, finishTest çağrılıyor`);
      setTimeout(() => {
        finishTest(newUserAnswers);
      }, 0);
    }
  };

  const finishTest = (userAnswers) => {
    setShowResult(true);
    
    // Debug: localStorage'ı kontrol et
    console.log("🔍 Quiz.jsx - finishTest başladı");
    console.log("🔍 Quiz.jsx - Mevcut score state:", score);
    console.log("🔍 Quiz.jsx - Parametre olarak gelen userAnswers:", userAnswers);
    console.log("🔍 Quiz.jsx - Questions:", questions);
    
    // userAnswers objesinin detaylı içeriğini göster
    console.log("🔍 Quiz.jsx - userAnswers detaylı analiz:");
    Object.keys(userAnswers).forEach(key => {
      console.log(`  Soru ${parseInt(key) + 1}:`, {
        index: key,
        answer: userAnswers[key],
        question: questions[key],
        isAnswerPresent: userAnswers[key] !== undefined && userAnswers[key] !== null
      });
    });
    
    // Doğru skor hesapla - parametre olarak gelen userAnswers'dan
    const correctAnswers = Object.values(userAnswers).filter((answer, index) => {
      const currentQ = questions[index];
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
      
      console.log(`🔍 Quiz.jsx - Soru ${index + 1}:`, {
        type: currentQ.type,
        answer: answer,
        correct: currentQ.correct,
        isCorrect: isCorrect,
        answerType: typeof answer,
        answerLength: answer ? answer.length : 'undefined'
      });
      
      return isCorrect;
    }).length;
    
    // Test sonucunu kaydet - hesaplanan doğru skor ile
    const testResult = {
      date: new Date().toISOString(),
      score: correctAnswers, // Hesaplanan doğru skor
      total: questions.length,
      testType: "daily"
    };

    console.log("🔍 Quiz.jsx - Test sonucu oluşturuldu:", testResult);
    console.log("🔍 Quiz.jsx - Hesaplanan doğru skor:", correctAnswers);
    console.log("🔍 Quiz.jsx - Questions length:", questions.length);
    console.log("🔍 Quiz.jsx - User answers:", userAnswers);

    // Test sonuçlarını localStorage'a kaydet
    const testResults = JSON.parse(localStorage.getItem("testResults") || "[]");
    console.log("🔍 Quiz.jsx - Mevcut testResults:", testResults);
    
    testResults.push(testResult);
    localStorage.setItem("testResults", JSON.stringify(testResults));
    
    console.log("🔍 Quiz.jsx - Güncellenmiş testResults:", testResults);

    // İstatistikleri güncelle - hesaplanan doğru skor ile
    console.log("🔍 Quiz.jsx - recordTestResult çağrılıyor:", { correctAnswers, questionsLength: questions.length });
    recordTestResult(correctAnswers, questions.length);
    
    // Eğer günlük test başarılıysa, kelimeleri öğrenildi olarak işaretle
    if (testResult.score >= 4) {
      const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
      const newLearned = dailyWords.map(w => w.word).filter(w => !learnedWords.includes(w));
      localStorage.setItem("learnedWords", JSON.stringify([...learnedWords, ...newLearned]));
      
      // Günlük çalışma kaydı
      recordDailyStudy();
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
    
    generateQuestions();
  };

  if (questions.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Kelimeler yükleniyor...</div>
      </div>
    );
  }

  if (showResult) {
    // Doğru skor hesapla - userAnswers'dan
    const finalScore = Object.values(userAnswers).filter((answer, index) => {
      const currentQ = questions[index];
      if (currentQ.type === "mc") {
        return answer === currentQ.correct;
      } else if (currentQ.type === "tf") {
        return answer === currentQ.correct;
      } else if (currentQ.type === "match") {
        return answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
      } else if (currentQ.type === "fill") {
        return answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
      }
      return false;
    }).length;
    
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassed = finalScore >= 4;
    
    console.log("Sonuç gösterimi:", { finalScore, total: questions.length, percentage, isPassed });
    
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Test Tamamlandı!</h2>
        <div style={{ fontSize: "2rem", margin: "20px 0", color: isPassed ? "#28a745" : "#dc3545" }}>
          {finalScore}/{questions.length} ({percentage}%)
        </div>
        
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#28a745", marginBottom: "10px" }}>
            {isPassed ? "🎉 Tebrikler! Günlük kelimeleri öğrendiniz!" : "😔 Daha fazla çalışmanız gerekiyor."}
          </h2>
          <p style={{ fontSize: "18px", color: "#666" }}>
            {isPassed ? "Günlük kelimeleri başarıyla öğrendiniz!" : "Daha fazla çalışmanız gerekiyor."}
          </p>
        </div>
        
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
          
          {!isPassed && (
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
        <h2>Günlük Test</h2>
        <div style={{ fontSize: "1.2rem" }}>
          {currentStep + 1}/{questions.length}
        </div>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
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