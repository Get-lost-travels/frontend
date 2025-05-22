import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const { email, password } = form;
      
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      const result = await login(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      route('/explore', true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="flex h-screen">
      <div class="w-1/2 bg-[#16325B] flex flex-col justify-center items-center px-16 text-white">
        <h1 class="text-[34px] font-bold text-[#FFDC7F] mb-2">WELCOME BACK</h1>
        <p class="text-[14px] font-semibold text-[#cbd5e1] mb-8">Please enter your login details.</p>

        {error && (
          <div class="w-full max-w-md bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} class="w-full max-w-md">
          <label class="block text-[#FFDC7F] text-[14px] font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            class="w-full p-3 rounded-md bg-[#227B94] text-white placeholder-white/60 text-[14px] font-medium mb-4 focus:outline-none"
            required
          />

          <label class="block text-[#FFDC7F] text-[14px] font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="**********"
            class="w-full p-3 rounded-md bg-[#227B94] text-white placeholder-white/60 text-[14px] font-medium mb-6 focus:outline-none"
            required
          />

          <button 
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-[#FFDC7F] text-[#16325B] cursor-pointer text-[14px] font-bold py-3 rounded-md shadow-md hover:bg-yellow-300 mb-4 disabled:opacity-70">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>


          <p class="mt-6 text-sm text-center text-white">
            Don't have an account? 
            <a href="/register" class="text-[#FFDC7F] font-medium hover:underline ml-1">
              Sign up for free!
            </a>
          </p>
        </form>
      </div>

      <div class="w-1/2 h-full">
        <img
          src="/images/plane.png"
          alt="Airplane"
          class="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Login; 