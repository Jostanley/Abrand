import { supabase } from '../supabaseClient';

/**
 * SIGN UP
 */
export const signUp = async (email, password, firstName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
      },
    });

    if (error) throw error;

    const user = data.user;

    // Create user row in "users" table (best-effort)
    await supabase.from('users').insert([
      {
        user_id: user.id,
        email: user.email,
        plan: 'free',
        total_content_generated: 0,
        total_tokens_used: 0,
      },
    ]);

    return { success: true, user: { uid: user.id, email: user.email } };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: getErrorMessage(error.message) };
  }
};

/**
 * LOGIN
 */
export const logIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, user: { uid: data.user.id, email: data.user.email } };
  } catch (error) {
    console.error('Login error:', error.message);
    return { success: false, error: getErrorMessage(error.message) };
  }
};

/**
 * LOG OUT
 */
export const logOut = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: getErrorMessage(error.message) };
  }
};

/**
 * AUTH STATE CHANGE — returns unsubscribe function
 */
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
};

/**
 * GET CURRENT USER
 */
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

/**
 * ERROR MESSAGES
 */
export const getErrorMessage = (message) => {
  if (!message) return 'An error occurred. Please try again';
  if (message.includes('User already registered')) return 'This email is already registered';
  if (message.includes('Invalid login credentials')) return 'Incorrect email or password';
  if (message.includes('Password should be at least')) return 'Password should be at least 6 characters';
  if (message.includes('network')) return 'Network error. Check your connection';
  return message;
};
