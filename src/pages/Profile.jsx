import React from 'react';

const Profile = () => {
  // Mock Data
  const student = {
    name: "Rohan Sharma",
    initials: "RS",
    classLevel: "Class 11",
    joined: "January 2026",
    stats: {
      chaptersStudied: 42,
      avgScore: "88%",
      streak: 5,
      studyHours: 124
    }
  };

  const activityFeed = [
    { id: 1, title: "Chemical Reactions", subject: "Chemistry", type: "Quiz", score: "9/10", time: "2 hours ago" },
    { id: 2, title: "Laws of Motion", subject: "Physics", type: "Study", time: "Yesterday, 4:30 PM" },
    { id: 3, title: "Cell Division", subject: "Biology", type: "Lab", time: "Monday, 11:15 AM" },
    { id: 4, title: "Polynomials", subject: "Mathematics", type: "Study", time: "Sunday, 6:00 PM" },
    { id: 5, title: "Real Numbers", subject: "Mathematics", type: "Quiz", score: "10/10", time: "Saturday, 2:45 PM" }
  ];

  const savedNotes = [
    { id: 1, title: "Acids, Bases & Salts", subject: "Chemistry", date: "Mar 5" },
    { id: 2, title: "Current Electricity", subject: "Physics", date: "Mar 2" },
    { id: 3, title: "Human Digestive System", subject: "Biology", date: "Feb 28" },
    { id: 4, title: "The French Revolution", subject: "Social Science", date: "Feb 25" }
  ];

  const weeklyData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.2 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.0 },
    { day: "Fri", hours: 2.8 },
    { day: "Sat", hours: 5.5 },
    { day: "Sun", hours: 4.5 }
  ];
  const maxHours = Math.max(...weeklyData.map(d => d.hours)) + 1; // Chart scaling

  // Subject Badge Helper
  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Chemistry': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Biology': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'Mathematics': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      
      {/* Navbar Option 2 (with Knovia Logo as per earlier specs) */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group shrink-0">
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Knovia
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-400">Student Profile</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8 gap-8 grid lg:grid-cols-3">
        
        {/* LEFT COLUMN: Profile & Progress */}
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
          
          {/* Profile Card */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-1 mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-transparent">
                  <span className="text-2xl font-bold text-white">{student.initials}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">{student.name}</h1>
              <p className="text-purple-400 font-medium mb-1">{student.classLevel}</p>
              <p className="text-xs text-slate-500 mb-6 flex items-center justify-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" /> Member since {student.joined}
              </p>
              
              <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-white/10 flex items-center justify-center gap-2">
                <PenIcon className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-indigo-400" />
              Weekly Progress
            </h2>
            
            <div className="h-48 flex items-end justify-between gap-2 mt-4 relative">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 bottom-[25%] border-t border-white/5" />
              <div className="absolute inset-x-0 bottom-[50%] border-t border-white/5" />
              <div className="absolute inset-x-0 bottom-[75%] border-t border-white/5" />
              
              {weeklyData.map((day, idx) => {
                const heightPercent = (day.hours / maxHours) * 100;
                const isToday = day.day === "Wed"; // Mocking today
                return (
                  <div key={idx} className="flex flex-col items-center w-full relative z-10">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 hover:opacity-100 absolute -top-8 bg-slate-800 border border-white/10 text-xs px-2 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {day.hours} hrs
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[32px] rounded-t-lg transition-all hover:brightness-125 hover:-translate-y-1 ${
                        isToday 
                          ? 'bg-gradient-to-t from-purple-600 to-indigo-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                          : 'bg-slate-800 border border-b-0 border-white/10'
                      }`} 
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Label */}
                    <span className={`text-[10px] sm:text-xs mt-3 font-medium ${isToday ? 'text-purple-400' : 'text-slate-500'}`}>
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Stats, Activity, Notes */}
        <div className="lg:col-span-2 space-y-8 animate-[fade-in_0.5s_ease-out]">
          
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 transition-colors">
              <BookOpenIcon className="w-6 h-6 text-purple-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">{student.stats.chaptersStudied}</div>
              <div className="text-sm font-medium text-slate-400">Chapters Studied</div>
            </div>
            
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-colors">
              <TargetIcon className="w-6 h-6 text-indigo-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">{student.stats.avgScore}</div>
              <div className="text-sm font-medium text-slate-400">Avg Quiz Score</div>
            </div>
            
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-[20px]" />
              <FlameIcon className="w-6 h-6 text-orange-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">{student.stats.streak} <span className="text-lg text-orange-400">🔥</span></div>
              <div className="text-sm font-medium text-slate-400">Day Streak</div>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-colors">
              <ClockIcon className="w-6 h-6 text-emerald-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">{student.stats.studyHours}h</div>
              <div className="text-sm font-medium text-slate-400">Total Hours</div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-200">Recent Activity</h2>
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {activityFeed.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-slate-900 ${idx !== activityFeed.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.type === 'Quiz' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                    item.type === 'Lab' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  }`}>
                    {item.type === 'Quiz' ? <FileQuestionIcon className="w-5 h-5" /> : 
                     item.type === 'Lab' ? <FlaskConicalIcon className="w-5 h-5" /> : 
                     <BookTextIcon className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                      <h3 className="font-semibold text-slate-200 truncate">{item.title}</h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{item.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getSubjectColor(item.subject)}`}>
                        {item.subject}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-600 block" />
                        {item.type} {item.score && <span className="text-emerald-400 font-medium ml-1">({item.score})</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Notes Grid */}
          <div>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-pink-400" />
                Saved Notes
              </h2>
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">View Collection</button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {savedNotes.map(note => (
                <div key={note.id} className="bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col group transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getSubjectColor(note.subject)}`}>
                      {note.subject}
                    </span>
                    <button className="text-slate-500 hover:text-rose-400 transition-colors p-1">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-slate-200 mb-1">{note.title}</h3>
                  <p className="text-xs text-slate-500 mb-6">Saved on {note.date}</p>
                  
                  <button className="mt-auto w-full py-2.5 rounded-lg bg-slate-800 group-hover:bg-purple-600 border border-white/5 group-hover:border-transparent text-slate-300 group-hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                    Open Notes <ArrowRightIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Icons definition
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const ArrowRightIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const StarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const CalendarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>);
const PenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>);
const BarChartIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>);
const BookOpenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const TargetIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const FlameIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
const ClockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const FileQuestionIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5"/></svg>);
const FlaskConicalIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>);
const BookTextIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>);
const BookmarkIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>);
const TrashIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>);

export default Profile;
