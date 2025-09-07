const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('signup-email');
    const emailError = document.getElementById('email-error');

    const passwordInput = document.getElementById('signup-password');
    const passwordError = document.getElementById('password-error');

    const confirmInput = document.getElementById('signup-confirm-password');
    const confirmError = document.getElementById('confirm-error');

    // Real-time email validation
    emailInput.addEventListener('input', () => {
      if (!emailInput.value.includes('@')) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.style.borderColor = "red";
      } else {
        emailError.textContent = "";
        emailInput.style.borderColor = "#ddd";
      }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', () => {
      if (passwordInput.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        passwordInput.style.borderColor = "red";
      } else {
        passwordError.textContent = "";
        passwordInput.style.borderColor = "#ddd";
      }

      // Check confirm password
      if (confirmInput.value && passwordInput.value !== confirmInput.value) {
        confirmError.textContent = "Passwords do not match.";
        confirmInput.style.borderColor = "red";
      } else {
        confirmError.textContent = "";
        confirmInput.style.borderColor = "#ddd";
      }
    });

    // Real-time confirm password check
    confirmInput.addEventListener('input', () => {
      if (passwordInput.value !== confirmInput.value) {
        confirmError.textContent = "Passwords do not match.";
        confirmInput.style.borderColor = "red";
      } else {
        confirmError.textContent = "";
        confirmInput.style.borderColor = "#ddd";
      }
    });

    // Submit validation
    form.addEventListener('submit', (e) => {
      let valid = true;

      if (!emailInput.value.includes('@')) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.style.borderColor = "red";
        valid = false;
      }

      if (passwordInput.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        passwordInput.style.borderColor = "red";
        valid = false;
      }

      if (passwordInput.value !== confirmInput.value) {
        confirmError.textContent = "Passwords do not match.";
        confirmInput.style.borderColor = "red";
        valid = false;
      }

      if (!valid) e.preventDefault();
    });