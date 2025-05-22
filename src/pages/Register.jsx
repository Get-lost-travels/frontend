import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
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
      const { username, email, password } = form;
      
      if (!username || !email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      const result = await register(username, email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      // Show success message and redirect to login
      alert('Registration successful! Please log in.');
      route('/login', true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="flex h-screen">
      <div class="w-1/2 bg-[#16325B] flex flex-col justify-center items-center px-16 text-white">
        <h1 class="text-[34px] font-bold text-[#FFDC7F] mb-2">CREATE ACCOUNT</h1>
        <p class="text-[14px] font-semibold text-[#cbd5e1] mb-8">Please fill in your details to register.</p>

        {error && (
          <div class="w-full max-w-md bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} class="w-full max-w-md">
          <label class="block text-[#FFDC7F] text-[14px] font-medium mb-2">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            class="w-full p-3 rounded-md bg-[#227B94] text-white placeholder-white/60 text-[14px] font-medium mb-4 focus:outline-none"
            required
          />

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
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <p class="mt-6 text-sm text-center text-white">
            Already have an account? 
            <a href="/login" class="text-[#FFDC7F] font-medium hover:underline ml-1">
              Sign in here
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

export default Register; 