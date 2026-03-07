import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSubject, setSelectedSubject] = useState('Science');

  const subjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const recentActivity = [
    { title: 'Chemical Reactions and Equations', subject: 'Science', time: '2 hours ago', progress: 85 },
    { title: 'Polynomials', subject: 'Mathematics', time: 'Yesterday', progress: 100 },
    { title: 'The Rise of Nationalism in Europe', subject: 'Social Science', time: '2 days ago', progress: 40 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Knovia
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
              <FlameIcon className="w-4 h-4" />
              <span>5 day streak</span>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Student! 👋</h1>
            <p className="text-slate-400">Ready to conquer your syllabus today?</p>
          </div>
          
          {/* Selectors */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none w-full sm:w-40 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none w-full sm:w-48 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <ActionCard 
                  title="Study Now" 
                  description="Resume your learning journey"
                  icon={<BookOpenIcon className="w-6 h-6 text-purple-400" />}
                  color="purple"
                  onClick={() => navigate('/study')}
                />
                <ActionCard 
                  title="Take Quiz" 
                  description="Test your knowledge"
                  icon={<FileQuestionIcon className="w-6 h-6 text-indigo-400" />}
                  color="indigo"
                  onClick={() => navigate('/quiz')}
                />
                <ActionCard 
                  title="Virtual Lab" 
                  description="Interactive experiments"
                  icon={<FlaskConicalIcon className="w-6 h-6 text-pink-400" />}
                  color="pink"
                  onClick={() => navigate('/lab')}
                />
                <ActionCard 
                  title="Upload Lecture" 
                  description="Get AI notes from video"
                  icon={<VideoIcon className="w-6 h-6 text-fuchsia-400" />}
                  color="fuchsia"
                  onClick={() => navigate('/lecture')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Recent Activity</h2>
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${idx !== recentActivity.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <BookTextIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200 line-clamp-1">{activity.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="px-2 py-0.5 rounded-md bg-white/5">{activity.subject}</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:w-32 shrink-0">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" 
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-400 w-8">{activity.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weekly Goal */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-lg font-semibold text-slate-200">Weekly Goal</h2>
                <TargetIcon className="w-5 h-5 text-purple-400" />
              </div>
              
              <div className="relative z-10 text-center mb-6">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">12</span>
                  <span className="text-slate-400">/ 15 hrs</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Almost there! Keep going.</p>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>80%</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shrink-0">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 w-[80%] rounded-full relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[progress_1s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Mobile (shows only on mobile since desktop has it in navbar) */}
            <div className="sm:hidden p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <FlameIcon className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-500">5 Day Streak!</h3>
                <p className="text-xs text-orange-400/80">You're on fire. Don't stop now.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ActionCard = ({ title, description, icon, color, onClick }) => {
  const colorMap = {
    purple: 'hover:border-purple-500/50 hover:bg-purple-500/5 group-hover:text-purple-400',
    indigo: 'hover:border-indigo-500/50 hover:bg-indigo-500/5 group-hover:text-indigo-400',
    pink: 'hover:border-pink-500/50 hover:bg-pink-500/5 group-hover:text-pink-400',
    fuchsia: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 group-hover:text-fuchsia-400',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col text-left p-5 rounded-2xl bg-slate-900/50 border border-white/5 transition-all group ${colorMap[color]}`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
        {icon}
      </div>
      <h3 className={`text-lg font-semibold text-slate-200 mb-1 transition-colors ${colorMap[color].split(' ').pop()}`}>{title}</h3>
      <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{description}</p>
    </button>
  );
};

// Icons
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const FlameIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const BookOpenIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const FileQuestionIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5"/></svg>
);
const FlaskConicalIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>
);
const VideoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const BookTextIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
);
const TargetIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default Dashboard;
