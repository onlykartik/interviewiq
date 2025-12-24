import { useEffect, useState } from 'react';
import { getTodayQuiz } from '../api';

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

    setAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  }

  function submitQuestion(qIndex) {
    if (revealed[qIndex]) return;

    const q = questions[qIndex];
    const selectedIndex = answers[qIndex];

    const correctIndex =
      q.correct_index !== undefined
        ? q.correct_index
        : q.options.findIndex(opt => opt === q.correct_answer);

    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setRevealed(prev => ({
      ...prev,
      [qIndex]: true
    }));
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Today’s Quiz</h1>

      {questions.map((q, qIndex) => {
        const selected = answers[qIndex];
        const isRevealed = revealed[qIndex];

        const correctIndex =
          q.correct_index !== undefined
            ? q.correct_index
            : q.options.findIndex(opt => opt === q.correct_answer);

        return (
          <div key={qIndex} style={{ marginBottom: '30px' }}>
            <strong>{qIndex + 1}. {q.question}</strong>

            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {q.options.map((opt, oIndex) => {
                let bg = '#fff';

                if (isRevealed) {
                  if (oIndex === correctIndex) bg = '#d4edda';
                  else if (oIndex === selected) bg = '#f8d7da';
                } else if (oIndex === selected) {
                  bg = '#e9ecef';
                }

                return (
                  <li
                    key={oIndex}
                    onClick={() => selectAnswer(qIndex, oIndex)}
                    style={{
                      padding: '8px',
                      margin: '6px 0',
                      border: '1px solid #ccc',
                      cursor: isRevealed ? 'default' : 'pointer',
                      backgroundColor: bg
                    }}
                  >
                    {opt}
                  </li>
                );
              })}
            </ul>

            {!isRevealed && selected !== undefined && (
              <button onClick={() => submitQuestion(qIndex)}>
                Submit
              </button>
            )}

            {isRevealed && (
              <p style={{ marginTop: '8px' }}>
                {selected === correctIndex ? '✅ Correct' : '❌ Wrong'}
                <br />
                <strong>Correct answer:</strong> {q.options[correctIndex]}
                {q.explanation && (
                  <>
                    <br />
                    <em>{q.explanation}</em>
                  </>
                )}
              </p>
            )}
          </div>
        );
      })}

      {questions.length > 0 && (
        <h2 style={{ marginTop: '20px' }}>
          Score: {score} / {questions.length}
        </h2>
      )}
    </div>
  );
}