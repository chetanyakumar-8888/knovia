import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Groq from 'groq-sdk';

const AiAssistant = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doubt');

  // Doubt Solver State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your CBSE AI Tutor 👋 Ask me any question from your syllabus — Physics, Chemistry, Biology, Maths, or any other subject!' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Revision Planner State
  const [examDate, setExamDate] = useState('');
  const [examClass, setExamClass] = useState('12');
  const [examSubjects, setExamSubjects] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [revisionPlan, setRevisionPlan] = useState(null);

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Social Science', 'History', 'Geography', 'Economics'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || thinking) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setThinking(true);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: `You are an expert CBSE tutor for Class 6-12 Indian students. 
Answer questions clearly and concisely. 
Use simple language a student can understand.
For formulas, write them clearly.
Always relate answers to CBSE syllabus.
Keep answers under 200 words unless the question needs more detail.`
          },
          ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ]
      });

      const answer = response.choices[0]?.message?.content || 'Sorry, I could not answer that. Please try again!';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }]);
    }
    setThinking(false);
  };

  const toggleSubject = (sub) => {
    setExamSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const generateRevisionPlan = async () => {
    if (!examDate || examSubjects.length === 0) {
      alert('Please select exam date and at least one subject!');
      return;
    }

    setPlanLoading(true);
    setRevisionPlan(null);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const today = new Date();
      const exam = new Date(examDate);
      const daysLeft = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `Create a detailed CBSE exam revision plan for a Class ${examClass} student.

Exam date: ${examDate} (${daysLeft} days from today)
Subjects to cover: ${examSubjects.join(', ')}

Create a day-by-day revision schedule. Format EXACTLY like this:

REVISION PLAN — ${daysLeft} Days to Exam

📊 OVERVIEW
Total days: ${daysLeft}
Subjects: ${examSubjects.join(', ')}
Strategy: [1-2 sentence strategy]

📅 DAILY SCHEDULE

Day 1 (${new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toDateString()}):
- Morning (2hrs): [Subject - Topic]
- Evening (2hrs): [Subject - Topic]
- Night (1hr): [Quick revision/practice]

Day 2 (${new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toDateString()}):
- Morning (2hrs): [Subject - Topic]
- Evening (2hrs): [Subject - Topic]
- Night (1hr): [Quick revision/practice]

[Continue for all ${Math.min(daysLeft, 7)} days]

⚡ QUICK TIPS
- [Tip 1]
- [Tip 2]
- [Tip 3]`
        }]
      });

      setRevisionPlan(response.choices[0]?.message?.content);
    } catch (err) {
      alert('Failed to generate plan. Please try again!');
    }
    setPlanLoading(false);
  };

  const formatPlan = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('REVISION PLAN')) {
        return <h2 key={i} className="text-2xl font-bold text-white mb-4">{line}</h2>;
      }
      if (line.match(/^[📊📅⚡]/)) {
        return <h3 key={i} className="text-lg font-bold text-purple-400 mt-6 mb-3">{line}</h3>;
      }
      if (line.match(/^Day \d+/)) {
        return <p key={i} className="font-bold text-indigo-300 mt-4 mb-1">{line}</p>;
      }
      if (line.startsWith('•')) {
        return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{line.substring(1)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
    });
  };

  const quickQuestions = [
    "What is Newton's Second Law?",
    "Explain photosynthesis",
    "What is Ohm's Law?",
    "Explain the water cycle",
    "What is DNA replication?",
    "Explain acid-base reactions",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-6">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group shrink-0">
            <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
          <div onClick={() => navigate('/')} className="flex items-center gap-2 border-l border-white/10 pl-6 cursor-pointer hover:opacity-80">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Knovia</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Assistant 🤖</h1>
          <p className="text-slate-400">Solve doubts instantly & plan your exam revision</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-slate-900 border border-white/10 rounded-2xl mb-8 max-w-sm mx-auto">
          <button onClick={() => setActiveTab('doubt')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'doubt' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}>
            <MessageIcon className="w-4 h-4" /> Doubt Solver
          </button>
          <button onClick={() => setActiveTab('planner')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'planner' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}>
            <CalendarIcon className="w-4 h-4" /> Revision Planner
          </button>
        </div>

        {/* DOUBT SOLVER TAB */}
        {activeTab === 'doubt' && (
          <div>
            {/* Quick Questions */}
            <div className="flex flex-wrap gap-2 mb-6">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => setInput(q)}
                  className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-purple-900/50 border border-white/10 hover:border-purple-500/50 text-xs text-slate-300 hover:text-white transition-all">
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 mb-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-purple-400 font-semibold">🤖 AI Tutor</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask any CBSE question..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button onClick={handleSendMessage} disabled={!input.trim() || thinking}
                className="w-14 h-14 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 flex items-center justify-center transition-colors">
                <SendIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Clear chat */}
            {messages.length > 1 && (
              <button
                onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I am your CBSE AI Tutor 👋 Ask me any question from your syllabus!' }])}
                className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                🗑️ Clear conversation
              </button>
            )}
          </div>
        )}

        {/* REVISION PLANNER TAB */}
        {activeTab === 'planner' && (
          <div>
            {!revisionPlan ? (
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  Plan Your Exam Revision
                </h2>

                {/* Class + Exam Date */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Your Class</label>
                    <select value={examClass} onChange={e => setExamClass(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      {['6','7','8','9','10','11','12'].map(c => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Exam Date</label>
                    <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"/>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-8">
                  <label className="block text-sm text-slate-400 mb-3">Select Subjects to Revise</label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map(sub => (
                      <button key={sub} onClick={() => toggleSubject(sub)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          examSubjects.includes(sub)
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'
                        }`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                  {examSubjects.length > 0 && (
                    <p className="text-xs text-purple-400 mt-2">{examSubjects.length} subject(s) selected</p>
                  )}
                </div>

                <button onClick={generateRevisionPlan} disabled={planLoading || !examDate || examSubjects.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  {planLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating your plan...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Revision Plan
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 sm:p-8 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-purple-400" />
                      Your Revision Plan
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                      AI Generated ✓
                    </span>
                  </div>
                  <div className="space-y-1">
                    {formatPlan(revisionPlan)}
                  </div>
                </div>
                <button onClick={() => setRevisionPlan(null)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-semibold flex items-center justify-center gap-2">
                  ↺ Generate New Plan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const StarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const SparklesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>);
const MessageIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const CalendarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>);
const SendIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>);

export default AiAssistant;