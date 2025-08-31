// Authentication JavaScript

// Sample user data (in real app, this would be in a database)
let users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123',
        type: 'customer'
    },
    {
        id: 2,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@haircuttinghub.com',
        phone: '+1234567891',
        password: 'admin123',
        type: 'admin'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize forms
    initializeForms();
    
    // Check if user is already logged in
    checkExistingLogin();
});

function initializeForms() {
    // Login form submission
    document.getElementById('login').addEventListener('submit', handleLogin);
    
    // Signup form submission
    document.getElementById('signup').addEventListener('submit', handleSignup);
    
    // Password confirmation validation
    document.getElementById('signup-confirm-password').addEventListener('input', validatePasswordMatch);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginType = document.querySelector('input[name="login-type"]:checked').value;
    
    // Validate credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showError('Invalid email or password!');
        return;
    }
    
    // Check if login type matches user type
    if (loginType === 'admin' && user.type !== 'admin') {
        showError('Admin access denied! Please use customer login.');
        return;
    }
    
    // Store user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userLoggedIn', 'true');
    
    // Show success and redirect
    if (loginType === 'admin') {
        showSuccess('Admin Login Successful!', 'Redirecting to admin panel...', () => {
            window.location.href = 'admin.html';
        });
    } else {
        showSuccess('Login Successful!', 'Welcome back to Hair Cutting Hub!', () => {
            window.location.href = 'index.html';
        });
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validate form
    if (!validateSignupForm(firstName, lastName, email, phone, password, confirmPassword)) {
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showError('Account with this email already exists!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        phone,
        password,
        type: 'customer'
    };
    
    users.push(newUser);
    
    // Store user session
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('userLoggedIn', 'true');
    
    // Show success and redirect
    showSuccess('Account Created Successfully!', 'Welcome to Hair Cutting Hub!', () => {
        window.location.href = 'index.html';
    });
}

function validateSignupForm(firstName, lastName, email, phone, password, confirmPassword) {
    // Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showError('Please fill in all required fields!');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address!');
        return false;
    }
    
    // Validate phone format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showError('Please enter a valid phone number!');
        return false;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showError('Password must be at least 6 characters long!');
        return false;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return false;
    }
    
    // Check terms agreement
    if (!document.getElementById('agree-terms').checked) {
        showError('Please agree to the Terms & Conditions!');
        return false;
    }
    
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const confirmInput = document.getElementById('signup-confirm-password');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.style.borderColor = '#EF4444';
    } else {
        confirmInput.style.borderColor = '#E5E7EB';
    }
}

function switchToSignup() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
}

function switchToLogin() {
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
}

function showSuccess(title, message, callback) {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.add('active');
    
    // Store callback for later use
    window.successCallback = callback;
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    if (window.successCallback) {
        setTimeout(window.successCallback, 300);
    }
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the error notification
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #EF4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

function checkExistingLogin() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (isLoggedIn === 'true' && currentUser.email) {
        // User is already logged in, redirect based on type
        if (currentUser.type === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error-notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Demo credentials helper
console.log('Demo Credentials:');
console.log('Customer: john@example.com / password123');
console.log('Admin: admin@haircuttinghub.com / admin123');