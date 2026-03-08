import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuiz } from "../services/groq";
import { saveQuizResult } from "../services/supabase";

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('start'); // 'start', 'quiz', 'results'
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const selectedClass = location.state?.selectedClass || "10";
  const selectedSubject = location.state?.selectedSubject || "Science";
  const selectedChapter = location.state?.selectedChapter || "Chemical Reactions and Equations";

  // Timer logic
  useEffect(() => {
    let timer;
    if (step === 'quiz' && !isAnswerRevealed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerRevealed) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [step, isAnswerRevealed, timeLeft]);

  const handleTimeUp = () => {
    setIsAnswerRevealed(true);
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const responseText = await generateQuiz(selectedClass, selectedSubject, selectedChapter);
      
      let parsedData;
      try {
        parsedData = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
      } catch (err) {
        // Fallback robust json extraction from markdown
        const match = responseText.match(/\[[\s\S]*\]/) || responseText.match(/\{[\s\S]*\}/);
        if (match) {
          parsedData = JSON.parse(match[0]);
        } else {
          throw new Error("Could not parse JSON from AI response");
        }
      }

      let mcqs = Array.isArray(parsedData) ? parsedData : (parsedData.questions || parsedData.mcqs || []);
      
      if (mcqs && mcqs.length > 0) {
        // Sanitize correctAnswers
        const sanitizedMcqs = mcqs.map(q => {
          let correctIdx = q.correctAnswer;
          if (typeof correctIdx === 'string') {
            const up = correctIdx.toUpperCase();
            if (["A", "B", "C", "D"].includes(up)) correctIdx = ["A", "B", "C", "D"].indexOf(up);
            else if (q.options?.includes(correctIdx)) correctIdx = q.options.indexOf(correctIdx);
            else if (!isNaN(parseInt(correctIdx, 10))) correctIdx = parseInt(correctIdx, 10);
          }
          return {
            ...q,
            correctAnswer: (typeof correctIdx === 'number' && correctIdx >= 0 && correctIdx < q.options.length) ? correctIdx : 0
          };
        });

        setQuizQuestions(sanitizedMcqs);
        setStep('quiz');
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(60);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
      } else {
        alert("Failed to generate valid quiz questions.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating quiz: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (index) => {
    if (isAnswerRevealed) return;
    
    setSelectedAnswer(index);
    setIsAnswerRevealed(true);
    
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setTimeLeft(60);
    } else {
      setStep('results');
      try {
        await saveQuizResult(
          selectedSubject,
          selectedChapter, 
          selectedClass,
          score,
          quizQuestions.length
        );
      } catch (err) {
        console.error("Failed to save quiz result:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <span className="text-lg font-semibold text-slate-200">Quiz Runner</span>
          </div>
          {step === 'quiz' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10">
              <TimerIcon className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
              <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-200'}`}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        
        {/* START SCREEN */}
        {step === 'start' && (
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 text-center animate-[fade-in_0.3s_ease-out]">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <BrainCircuitIcon className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-purple-400 font-medium mb-3">
              <span>{selectedSubject}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-6">{selectedChapter}</h1>
            
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-2">
                <FileQuestionIcon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">10 MCQs + 5 Short Qs</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-2">
                <TargetIcon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">15 Total Points</span>
              </div>
            </div>

            <div className="max-w-md mx-auto mb-10 text-left">
              <label className="block text-sm font-medium text-slate-400 mb-3 text-center">Select Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                      difficulty === diff 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  Start Quiz
                </>
              )}
            </button>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {step === 'quiz' && (
          <div className="animate-[fade-in_0.3s_ease-out]">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-10 mb-8 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full bg-slate-800 border border-white/10 text-sm font-medium text-slate-300 shadow-xl">
                {difficulty} Level
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-relaxed mt-2">
                {quizQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {quizQuestions[currentQuestion].options.map((option, idx) => {
                const isCorrect = idx === quizQuestions[currentQuestion].correctAnswer;
                const isSelected = selectedAnswer === idx;
                
                let optionClasses = "w-full p-4 sm:p-6 rounded-2xl border text-left transition-all flex items-center justify-between group ";
                
                if (!isAnswerRevealed) {
                  optionClasses += "bg-slate-900/50 border-white/10 hover:border-purple-500/50 hover:bg-slate-800 cursor-pointer";
                } else {
                  if (isCorrect) {
                    optionClasses += "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                  } else if (isSelected && !isCorrect) {
                    optionClasses += "bg-rose-500/10 border-rose-500 text-rose-300";
                  } else {
                    optionClasses += "bg-slate-900/20 border-white/5 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={isAnswerRevealed}
                    className={optionClasses}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-medium text-sm
                        ${isAnswerRevealed ? (isCorrect ? 'border-emerald-500/50 bg-emerald-500/20' : (isSelected ? 'border-rose-500/50 bg-rose-500/20' : 'border-white/10 bg-slate-800')) : 'border-white/20 bg-slate-800 group-hover:border-purple-500'}
                      `}>
                        {['A', 'B', 'C', 'D'][idx]}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                    
                    {isAnswerRevealed && isCorrect && <CheckCircleIcon className="w-6 h-6 text-emerald-500" />}
                    {isAnswerRevealed && isSelected && !isCorrect && <XCircleIcon className="w-6 h-6 text-rose-500" />}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswerRevealed && (
              <div className="flex justify-end animate-[fade-in_0.3s_ease-out]">
                <button 
                  onClick={handleNextQuestion}
                  className="px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SCREEN */}
        {step === 'results' && (
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 sm:p-12 text-center animate-[fade-in_0.5s_ease-out] relative overflow-hidden">
            {/* Confetti-like bg effect if score is good */}
            {score / quizQuestions.length > 0.5 && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
            )}
            
            <h2 className="text-2xl font-bold text-slate-200 mb-8">Quiz Completed!</h2>
            
            {/* Circular Progress (CSS based) */}
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="96" cy="96" r="88" 
                  className="stroke-slate-800 fill-none" 
                  strokeWidth="12" 
                />
                <circle 
                  cx="96" cy="96" r="88" 
                  className={`fill-none transition-all duration-1000 ease-out ${score / quizQuestions.length >= 0.7 ? 'stroke-emerald-500' : (score / quizQuestions.length >= 0.4 ? 'stroke-yellow-500' : 'stroke-rose-500')}`}
                  strokeWidth="12" 
                  strokeDasharray="552.9"
                  strokeDashoffset={552.9 - (552.9 * (score / quizQuestions.length))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold">{Math.round((score / quizQuestions.length) * 100)}%</span>
                <span className="text-sm text-slate-400 mt-1">Accuracy</span>
              </div>
            </div>

            <p className="text-xl text-slate-300 mb-2">
              You scored <strong className="text-white">{score}</strong> out of <strong className="text-white">{quizQuestions.length}</strong>
            </p>
            <p className="text-slate-500 mb-10">
              {score / quizQuestions.length >= 0.7 ? "Outstanding performance! You're ready for the exam." : "Good effort! Review the notes and try again to improve."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleStartQuiz}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcwIcon className="w-5 h-5 text-slate-400" />
                Try Again
              </button>
              <button className="px-6 py-3.5 rounded-xl bg-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <BookOpenIcon className="w-5 h-5 text-white/80" />
                Review Answers
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Icons
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const ArrowRightIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const BrainCircuitIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>);
const FileQuestionIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5"/></svg>);
const TargetIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const PlayIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const TimerIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>);
const CheckCircleIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>);
const XCircleIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>);
const RotateCcwIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>);
const BookOpenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);

export default Quiz;
