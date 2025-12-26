import { useEffect, useState } from 'react';
import { getTodayQuiz } from '../api';
import { CheckCircle2, XCircle, Info, Trophy, ChevronRight } from 'lucide-react';

export default function TodayQuiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadQuiz() {
      const res = await getTodayQuiz();
      if (res.success) {
        setQuestions(res.data);
      }
    }
    loadQuiz();
  }, []);

  function selectAnswer(qIndex, optionIndex) {
    if (revealed[qIndex]) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  }

  function submitQuestion(qIndex) {
    if (revealed[qIndex]) return;

    const q = questions[qIndex];
    const selectedIndex = answers[qIndex];
    const correctIndex = q.correct_index !== undefined
        ? q.correct_index
        : q.options.findIndex(opt => opt === q.correct_answer);

    if (selectedIndex === correctIndex) {
      setScore(prev => prev + 1);
    }

    setRevealed(prev => ({ ...prev, [qIndex]: true }));
  }

  const completionPercentage = questions.length > 0 
    ? (Object.keys(revealed).length / questions.length) * 100 
    : 0;

  return (
    <div className="quiz-container" style={styles.container}>
      <style>{`
        .option-item { transition: all 0.2s ease; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; padding: 14px; margin-bottom: 10px; list-style: none; display: flex; align-items: center; justify-content: space-between; }
        .option-item:hover:not(.disabled) { border-color: #2563eb; background: #f8fafc; }
        .option-item.selected { border-color: #2563eb; background: #eff6ff; }
        .option-item.correct { border-color: #22c55e; background: #f0fdf4; color: #166534; }
        .option-item.wrong { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
        .submit-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: #2563eb; color: white; font-weight: 700; cursor: pointer; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        @media (max-width: 600px) { .quiz-container { padding: 16px 16px 100px 16px !important; } }
      `}</style>

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Daily Quiz</h1>
          <p style={styles.subtitle}>Sharpen your technical knowledge</p>
        </div>
        <div style={styles.scoreBadge}>
          <Trophy size={18} /> {score} / {questions.length}
        </div>
      </header>

      {/* Progress Bar */}
      <div style={styles.progressTrack}>
        <div style={{...styles.progressBar, width: `${completionPercentage}%`}}></div>
      </div>

      {questions.map((q, qIndex) => {
        const selected = answers[qIndex];
        const isRevealed = revealed[qIndex];
        const correctIndex = q.correct_index !== undefined
            ? q.correct_index
            : q.options.findIndex(opt => opt === q.correct_answer);

        return (
          <div key={qIndex} style={styles.quizCard}>
            <div style={styles.qHeader}>
              <span style={styles.qNumber}>Question {qIndex + 1}</span>
            </div>
            
            <h3 style={styles.questionText}>{q.question}</h3>

            <ul style={{ padding: 0, margin: '20px 0' }}>
              {q.options.map((opt, oIndex) => {
                let statusClass = "";
                if (isRevealed) {
                  if (oIndex === correctIndex) statusClass = "correct";
                  else if (oIndex === selected) statusClass = "wrong";
                  else statusClass = "disabled";
                } else if (oIndex === selected) {
                  statusClass = "selected";
                }

                return (
                  <li
                    key={oIndex}
                    onClick={() => selectAnswer(qIndex, oIndex)}
                    className={`option-item ${statusClass} ${isRevealed ? 'disabled' : ''}`}
                  >
                    <span style={{ fontWeight: '500' }}>{opt}</span>
                    {isRevealed && oIndex === correctIndex && <CheckCircle2 size={18} />}
                    {isRevealed && oIndex === selected && oIndex !== correctIndex && <XCircle size={18} />}
                  </li>
                );
              })}
            </ul>

            {!isRevealed && selected !== undefined && (
              <button className="submit-btn" onClick={() => submitQuestion(qIndex)}>
                Check Answer <ChevronRight size={18} />
              </button>
            )}

            {isRevealed && (
              <div style={{
                ...styles.feedbackBox,
                backgroundColor: selected === correctIndex ? '#f0fdf4' : '#fff7ed',
                borderColor: selected === correctIndex ? '#22c55e' : '#fb923c'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {selected === correctIndex 
                    ? <CheckCircle2 size={20} color="#22c55e" /> 
                    : <Info size={20} color="#fb923c" />
                  }
                  <strong style={{ color: '#1e293b' }}>
                    {selected === correctIndex ? 'Brilliant!' : 'Keep Learning'}
                  </strong>
                </div>
                
                {q.explanation && (
                  <p style={styles.explanationText}>
                    <strong>Insight:</strong> {q.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: { maxWidth: '650px', margin: '0 auto', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  scoreBadge: { display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: '#2563eb', padding: '8px 16px', borderRadius: '12px', fontWeight: '700' },
  progressTrack: { width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#2563eb', transition: 'width 0.4s ease' },
  quizCard: { background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  qHeader: { marginBottom: '12px' },
  qNumber: { fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  questionText: { fontSize: '18px', fontWeight: '700', color: '#1e293b', lineHeight: '1.4', margin: 0 },
  feedbackBox: { padding: '16px', borderRadius: '12px', border: '1px solid', marginTop: '16px' },
  explanationText: { fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }
};