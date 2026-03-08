import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Save quiz result
export async function saveQuizResult(subject, chapter, className, score, total) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: user.id,
      subject,
      chapter,
      class: className,
      score,
      total
    })
  return { data, error }
}

// Save note
export async function saveNote(title, subject, className, content) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('saved_notes')
    .insert({
      user_id: user.id,
      title,
      subject,
      class: className,
      content
    })
  return { data, error }
}

// Get quiz results
export async function getQuizResults() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return data || []
}

// Get saved notes
export async function getSavedNotes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('saved_notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return data || []
}

// Delete note
export async function deleteNote(id) {
  const { error } = await supabase
    .from('saved_notes')
    .delete()
    .eq('id', id)
  return { error }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default supabase