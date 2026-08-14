const form = document.getElementById('regForm');

function setError(inputEl, errorEl, isValid) {
  if (isValid) {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
    errorEl.classList.remove('show');
  } else {
    inputEl.classList.remove('valid');
    inputEl.classList.add('invalid');
    errorEl.classList.add('show');
  }
}

// ---- Full name ----
const name = document.getElementById('name');
const nameError = document.getElementById('nameError');
function validateName() {
  const ok = name.value.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name.value.trim());
  setError(name, nameError, ok);
  return ok;
}
name.addEventListener('input', validateName);

// ---- Email ----
const email = document.getElementById('email');
const emailError = document.getElementById('emailError');
function validateEmail() {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  setError(email, emailError, ok);
  return ok;
}
email.addEventListener('input', validateEmail);

// ---- Phone ----
const phone = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');
phone.addEventListener('input', () => {
  phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
});
function validatePhone() {
  const ok = /^\d{10}$/.test(phone.value.trim());
  setError(phone, phoneError, ok);
  return ok;
}
phone.addEventListener('input', validatePhone);

// ---- Password strength ----
const password = document.getElementById('password');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

function getStrength(val) {
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

function validatePassword() {
  const score = getStrength(password.value);
  const pct = Math.min((score / 5) * 100, 100);
  strengthFill.style.width = pct + '%';

  let label = 'Too weak';
  let color = 'var(--danger)';
  if (score >= 4) { label = 'Strong 💪'; color = 'var(--success)'; }
  else if (score >= 3) { label = 'Good'; color = 'var(--warning)'; }
  else if (score >= 2) { label = 'Weak'; color = '#fb923c'; }
  else if (password.value.length === 0) { label = 'Password strength'; color = 'rgba(255,255,255,0.25)'; }

  strengthFill.style.background = color;
  strengthLabel.textContent = label;
  strengthLabel.style.color = password.value.length === 0 ? 'rgba(255,255,255,0.7)' : color;

  return password.value.length >= 6;
}
password.addEventListener('input', () => { validatePassword(); validateConfirm(); });

// ---- Confirm password ----
const confirmPassword = document.getElementById('confirmPassword');
const confirmError = document.getElementById('confirmError');
const confirmOk = document.getElementById('confirmOk');

function validateConfirm() {
  if (confirmPassword.value.length === 0) {
    confirmError.classList.remove('show');
    confirmOk.classList.remove('show');
    confirmPassword.classList.remove('valid', 'invalid');
    return false;
  }
  const match = confirmPassword.value === password.value;
  confirmPassword.classList.toggle('valid', match);
  confirmPassword.classList.toggle('invalid', !match);
  confirmError.classList.toggle('show', !match);
  confirmOk.classList.toggle('show', match);
  return match;
}
confirmPassword.addEventListener('input', validateConfirm);

// ---- Show/hide password ----
function attachToggle(toggleId, inputEl) {
  const toggle = document.getElementById(toggleId);
  toggle.addEventListener('click', () => {
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? '🙈' : '👁️';
  });
}
attachToggle('togglePass1', password);
attachToggle('togglePass2', confirmPassword);

// ---- Date of birth (min age 13) ----
const dob = document.getElementById('dob');
const dobError = document.getElementById('dobError');
function validateDob() {
  if (!dob.value) { setError(dob, dobError, false); return false; }
  const dobDate = new Date(dob.value);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
  const ok = age >= 13 && age < 120;
  setError(dob, dobError, ok);
  return ok;
}
dob.addEventListener('change', validateDob);

// ---- Gender ----
const genderError = document.getElementById('genderError');
function validateGender() {
  const ok = document.querySelector('input[name="gender"]:checked') !== null;
  genderError.classList.toggle('show', !ok);
  return ok;
}
document.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener('change', validateGender));

// ---- Country ----
const country = document.getElementById('country');
const countryError = document.getElementById('countryError');
function validateCountry() {
  const ok = country.value !== '';
  setError(country, countryError, ok);
  return ok;
}
country.addEventListener('change', validateCountry);

// ---- Terms ----
const terms = document.getElementById('terms');
const termsError = document.getElementById('termsError');
function validateTerms() {
  const ok = terms.checked;
  termsError.classList.toggle('show', !ok);
  return ok;
}
terms.addEventListener('change', validateTerms);

// ---- Submit ----
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const validations = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validatePassword(),
    validateConfirm(),
    validateDob(),
    validateGender(),
    validateCountry(),
    validateTerms()
  ];

  const allValid = validations.every(v => v === true);

  if (!allValid) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  document.getElementById('successText').textContent =
    `Welcome, ${name.value.trim()}! Your account has been created successfully.`;
  document.getElementById('successOverlay').classList.add('show');
});

document.getElementById('closeSuccess').addEventListener('click', () => {
  document.getElementById('successOverlay').classList.remove('show');
  form.reset();
  strengthFill.style.width = '0%';
  strengthLabel.textContent = 'Password strength';
  strengthLabel.style.color = 'rgba(255,255,255,0.7)';
  document.querySelectorAll('.valid, .invalid').forEach(el => el.classList.remove('valid', 'invalid'));
  document.querySelectorAll('.error-msg.show, .hint-ok.show').forEach(el => el.classList.remove('show'));
});
