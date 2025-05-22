import { h } from 'preact';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size] || 'w-8 h-8';

  return (
    <div class="flex items-center justify-center w-full h-full">
      <div class={`${sizeClass} border-4 border-[#FFDC7F] border-t-[#16325B] rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner; 