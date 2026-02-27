import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // make sure this file exists

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toggle, setToggle] = useState(false)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
 const togglepassword = ()=>{
   setToggle((prev)=>!prev)
 }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Supabase login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        throw new loginError;
       }
       alert("login successfully")
      navigate('/createContent');

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0f0f] text-white relative">
      <div className="w-full max-w-md bg-[#0f0f0f] p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

           <div className ="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex direction-row">
          <input
            type={toggle ?"text":"password"}
            placeholder="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className = "border-none focus:outline-none"
          />
          <button onClick = {togglepassword}>{toggle ? "hide" : "show"}</button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loading &&
       <div className={"w-3/4 h-1/5 bg-gray-700 absolute z-100 flex align-center justify-center py-15 text-2xl"}>
         <div>logging in. wait...</div>
       </div>}
        <div className="w-full max-w-md mt-6 p-6 rounded-xl shadow-md text-white-700 flex justify-between font-semibold">
          <button onClick ={()=>navigate('/resetpassword')}>Forgotten password</button>
          <button onClick={() => navigate('/signup')}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;