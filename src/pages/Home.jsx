import { h } from 'preact';

const Home = () => {
  return (
    <div class="flex h-screen bg-[#16325B] text-white">
        <div class="container mx-auto px-4 flex flex-col items-center justify-center">
            <h1 class="text-5xl font-bold text-[#FFDC7F] mb-8">Welcome to Get Lost Travels</h1>
            <p class="text-xl mb-12 text-center max-w-2xl">Your journey begins here. Book agencies to your favorite destinations with ease.</p>
            
            <div class="flex gap-6">
                <a href="/login" class="px-8 py-3 bg-[#FFDC7F] text-[#16325B] rounded-md font-bold hover:bg-yellow-300 transition-colors">
                    Login
                </a>
                <a href="/register" class="px-8 py-3 bg-white text-[#16325B] rounded-md font-bold hover:bg-gray-100 transition-colors">
                    Register
                </a>
            </div>
        </div>
    </div>
  );
};

export default Home; 