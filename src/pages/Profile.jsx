import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizResults, getSavedNotes, deleteNote, getCurrentUser } from "../services/supabase";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setEditName(currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || '');
    setEditClass(currentUser?.user_metadata?.class || '10');
    const results = await getQuizResults();
    setQuizResults(results);
    const notes = await getSavedNotes();
    setSavedNotes(notes);
    setLoading(false);
  }

  const handleDeleteNote = async (id) => {
    const success = await deleteNote(id);
    if (success) loadData();
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: editName, class: editClass }
    });
    if (error) {
      alert('Failed to update profile. Try again!');
    } else {
      await loadData();
      setEditMode(false);
      alert('Profile updated successfully! ✅');
    }
    setSaving(false);
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Chemistry': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Biology': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'Mathematics': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <svg className="w-10 h-10 animate-spin text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-slate-400 font-medium">Loading profile data...</p>
      </div>
    );
  }

  const totalQuizzes = quizResults?.length || 0;
  const avgScoreCalc = totalQuizzes > 0
    ? Math.round(quizResults.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) / totalQuizzes)
    : 0;
  const totalNotes = savedNotes?.length || 0;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userClass = user?.user_metadata?.class ? `Class ${user.user_metadata.class}` : "Student";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group shrink-0">
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Knovia</span>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-400">Student Profile</span>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PenIcon className="w-5 h-5 text-purple-400" />
              Edit Profile
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Your Class</label>
                <select
                  value={editClass}
                  onChange={e => setEditClass(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  {['6','7','8','9','10','11','12'].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditMode(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={saving || !editName.trim()}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-8 gap-8 grid lg:grid-cols-3">

        {/* LEFT COLUMN */}
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">

          {/* Profile Card */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-1 mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-transparent">
                  <span className="text-2xl font-bold text-white">{userInitials}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">{userName}</h1>
              <p className="text-purple-400 font-medium mb-1">{userClass}</p>
              <p className="text-xs text-slate-500 mb-6 flex items-center justify-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" /> {user?.email}
              </p>
              <button onClick={() => setEditMode(true)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-white/10 flex items-center justify-center gap-2">
                <PenIcon className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Real Stats */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-200">Your Stats</h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-slate-400 font-medium">Total Quizzes</span>
              </div>
              <span className="text-2xl font-bold text-white">{totalQuizzes}</span>
            </div>

            <div className="border-t border-white/5" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <TargetIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-slate-400 font-medium">Avg Quiz Score</span>
              </div>
              <span className="text-2xl font-bold text-white">{avgScoreCalc}%</span>
            </div>

            <div className="border-t border-white/5" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <BookmarkIcon className="w-5 h-5 text-pink-400" />
                </div>
                <span className="text-slate-400 font-medium">Saved Notes</span>
              </div>
              <span className="text-2xl font-bold text-white">{totalNotes}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-8 animate-[fade-in_0.5s_ease-out]">

          {/* Quiz Results */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-indigo-400" />
              Quiz History
            </h2>
            {quizResults && quizResults.length > 0 ? (
              <div className="space-y-3">
                {quizResults.slice(0, 6).map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">{result.chapter}</h3>
                      <span className="text-xs text-slate-500">{result.subject} • Class {result.class_name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${(result.score / result.total_questions) >= 0.7 ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {result.score}/{result.total_questions}
                      </div>
                      <div className="text-xs text-slate-500">
                        {Math.round((result.score / result.total_questions) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 mb-2">No quizzes taken yet.</p>
                <span className="text-sm text-purple-400">Head to Quiz to start testing yourself!</span>
              </div>
            )}
          </div>

          {/* Saved Notes */}
          <div>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-pink-400" />
                Saved Notes
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {savedNotes && savedNotes.length > 0 ? (
                savedNotes.map(note => (
                  <div key={note.id} className="bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col group transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getSubjectColor(note.subject)}`}>{note.subject}</span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-200 mb-1">{note.chapter}</h3>
                    <p className="text-xs text-slate-500 mb-6">Saved on {new Date(note.created_at).toLocaleDateString()}</p>
                    <button className="mt-auto w-full py-2.5 rounded-lg bg-slate-800 group-hover:bg-purple-600 border border-white/5 group-hover:border-transparent text-slate-300 group-hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      Open Notes <ArrowRightIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center border-2 border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-500 mb-2">You haven't saved any notes yet.</p>
                  <span className="text-sm text-purple-400">Head to the Study Room to start saving!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const ArrowRightIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>);
const StarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const CalendarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>);
const PenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>);
const BookOpenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>);
const TargetIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const BookmarkIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>);
const TrashIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>);
const FileQuestionIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><circle cx="12" cy="18" r="1" /><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5" /></svg>);
const FlaskConicalIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>);
const BookTextIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>);

export default Profile;