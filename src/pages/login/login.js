import { login } from '../../api/auth.js';

export function initializeLogin() {
    console.log("Initializing login form...");
    
    setTimeout(() => {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!form || !loginBtn) {
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

            console.log("Login form submitted");
            
            try {
                isSubmitting = true;
                loginBtn.disabled = true;
                loginBtn.textContent = 'Logging in...';

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                console.log("Login attempt for email:", email);

                if (!email || !password) {
                    throw new Error('Please fill in all fields');
                }

                await login(email, password);

                console.log("Login successful!");

                window.history.pushState({}, '', '/explore');
                window.dispatchEvent(new Event('popstate'));

            } catch (error) {
                console.error("Login error:", error);
                alert(error.response?.data?.message || error.message || 'Login failed');
            } finally {
                isSubmitting = false;
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }, 100);
} 