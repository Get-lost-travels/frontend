import { register } from '../../api/auth.js';

export function initializeRegister() {
    console.log("Initializing register form...");
    
    setTimeout(() => {
        const form = document.getElementById('registerForm');
        const registerBtn = document.getElementById('registerBtn');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

 
        if (!form || !registerBtn) {
            console.error("Required elements not found!");
            return;
        }

        let isSubmitting = false;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isSubmitting) {
                console.log("Form is already being submitted");
                return;
            }

            console.log("Form submitted");
            
            try {
                isSubmitting = true;

                registerBtn.disabled = true;
                registerBtn.textContent = 'Registering...';

                const username = usernameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                console.log("Form values:", { username, email, password: '***' });

                if (!username || !email || !password) {
                    throw new Error('Please fill in all fields');
                }

                console.log("Making API call to register...");
                const response = await register(username, email, password);
                console.log("Registration response:", response);
                
                alert('Registration successful! Please log in.');
                
                window.history.pushState({}, '', '/login');
                window.dispatchEvent(new Event('popstate'));

            } catch (error) {
                console.error("Registration error:", error);
                alert(error.response?.data?.message || error.message || 'Registration failed');
            } finally {
                isSubmitting = false;
                registerBtn.disabled = false;
                registerBtn.textContent = 'Register';
            }
        });
    }, 100); 
} 