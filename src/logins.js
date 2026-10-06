// ==========================================================
// REEN BANK - LOGIN / REGISTER / OTP
// ==========================================================

console.log("======================================");
console.log("REEN BANK - logins.js LOADED");
console.log("======================================");

// ==========================================================
// LOCAL STORAGE KEYS
// ==========================================================

const REEN_USER_KEY = "reenBankUser";
const REEN_PENDING_USER_KEY = "reenPendingUser";
const REEN_OTP_KEY = "reenRegistrationOTP";
const REEN_BANK_DATA_KEY = "reenBankData";

// ==========================================================
// BEAUTIFUL REEN BANK MODAL
// ==========================================================

function showBankModal(title, message, type = "error", buttonText = "Okay") {
  // Remove existing modal
  const oldModal = document.getElementById("reenBankModal");

  if (oldModal) {
    oldModal.remove();
  }

  let icon = "!";
  let iconBackground = "#fee2e2";
  let iconColor = "#ef4444";

  if (type === "success") {
    icon = "✓";
    iconBackground = "#d9f7ec";
    iconColor = "#32b98a";
  }

  if (type === "warning") {
    icon = "!";
    iconBackground = "#fff7ed";
    iconColor = "#f97316";
  }

  const modal = document.createElement("div");

  modal.id = "reenBankModal";

  modal.className =
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999] p-5";

  modal.innerHTML = `

    <div
      id="reenBankModalCard"
      class="bg-white w-full max-w-[390px] rounded-3xl p-8 text-center shadow-2xl"
      style="
        animation: reenModalPop 0.3s ease-out;
      "
    >

      <!-- ICON -->

      <div
        class="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
        style="
          background:${iconBackground};
          color:${iconColor};
        "
      >
        ${icon}
      </div>


      <!-- BRAND -->

      <p
        class="text-[#32b98a] text-[10px] font-bold tracking-[0.2em] mt-5"
      >
        REEN BANK
      </p>


      <!-- TITLE -->

      <h2
        class="text-xl font-bold text-gray-800 mt-2"
      >
        ${title}
      </h2>


      <!-- MESSAGE -->

      <p
        class="text-sm text-gray-500 leading-6 mt-3"
      >
        ${message}
      </p>


      <!-- BUTTON -->

      <button
        type="button"
        id="reenBankModalButton"
        class="w-full mt-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
        style="
          background:#32b98a;
        "
      >
        ${buttonText}
      </button>

    </div>
  `;

  document.body.appendChild(modal);

  // Add animation once
  if (!document.getElementById("reenBankModalStyles")) {
    const style = document.createElement("style");

    style.id = "reenBankModalStyles";

    style.textContent = `

      @keyframes reenModalPop {

        0% {
          opacity: 0;
          transform: scale(0.85) translateY(20px);
        }

        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

      }

      @keyframes reenCheckPop {

        0% {
          transform: scale(0);
        }

        70% {
          transform: scale(1.15);
        }

        100% {
          transform: scale(1);
        }

      }

    `;

    document.head.appendChild(style);
  }

  // Button

  const button = document.getElementById("reenBankModalButton");

  if (button) {
    button.addEventListener("click", function () {
      modal.remove();
    });
  }

  // Click outside

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

// ==========================================================
// CREATE ACCOUNT NUMBER
// ==========================================================

function createNewAccountNumber() {
  let accountNumber = "";

  for (let i = 0; i < 10; i++) {
    accountNumber += Math.floor(Math.random() * 10);
  }

  return accountNumber;
}

// ==========================================================
// CREATE FRESH BANK DATA
// ==========================================================

function createFreshBankData(user) {
  return {
    user: {
      name: user.name || "",
      email: user.email || "",
      accountNumber: user.accountNumber || "",
    },

    accounts: [
      {
        id: 1,
        name: "Main Account",
        type: "Current",
        balance: 0,
      },

      {
        id: 2,
        name: "School Savings",
        type: "Savings",
        balance: 0,
      },

      {
        id: 3,
        name: "Holiday Plan",
        type: "Savings",
        balance: 0,
      },
    ],

    transactions: [],
  };
}

// ==========================================================
// SAVE FRESH BANK DATA
// ==========================================================

function saveFreshBankData(user) {
  const freshData = createFreshBankData(user);

  localStorage.setItem(REEN_BANK_DATA_KEY, JSON.stringify(freshData));

  return freshData;
}

// ==========================================================
// REGISTER USER
// ==========================================================

function registerUser() {
  console.log("REGISTER BUTTON CLICKED");

  const nameInput = document.getElementById("registerName");

  const emailInput = document.getElementById("registerEmail");

  const passwordInput = document.getElementById("registerPassword");

  const termsInput = document.getElementById("terms");

  if (!nameInput || !emailInput || !passwordInput || !termsInput) {
    showBankModal(
      "Something went wrong",
      "We couldn't find the registration fields. Please refresh the page and try again.",
      "error",
    );

    return;
  }

  const name = nameInput.value.trim();

  const email = emailInput.value.trim();

  const password = passwordInput.value.trim();

  const termsAccepted = termsInput.checked;

  // ========================================================
  // NAME
  // ========================================================

  if (!name) {
    showBankModal(
      "Name Required",
      "Please enter your full name before continuing.",
      "error",
    );

    nameInput.focus();

    return;
  }

  // ========================================================
  // EMAIL
  // ========================================================

  if (!email) {
    showBankModal(
      "Email Required",
      "Please enter your email address.",
      "error",
    );

    emailInput.focus();

    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showBankModal(
      "Invalid Email",
      "Please enter a valid email address.",
      "error",
    );

    emailInput.focus();

    return;
  }

  // ========================================================
  // PASSWORD
  // ========================================================

  if (!password) {
    showBankModal(
      "Password Required",
      "Please create a password for your Reen Bank account.",
      "error",
    );

    passwordInput.focus();

    return;
  }

  if (password.length < 6) {
    showBankModal(
      "Password Too Short",
      "Your password must contain at least 6 characters.",
      "warning",
    );

    passwordInput.focus();

    return;
  }

  // ========================================================
  // TERMS
  // ========================================================

  if (!termsAccepted) {
    showBankModal(
      "Terms Required",
      "Please agree to the Terms, Privacy Policy and Fees before creating your account.",
      "warning",
    );

    return;
  }

  // ========================================================
  // CREATE USER
  // ========================================================

  const accountNumber = createNewAccountNumber();

  const newUser = {
    name: name,
    email: email,
    password: password,
    accountNumber: accountNumber,
  };

  // ========================================================
  // CLEAR OLD CUSTOMER DATA
  // ========================================================

  localStorage.removeItem("reenBankProfile");

  localStorage.removeItem("reenHiddenBalances");

  localStorage.removeItem("reenNotifications");

  // ========================================================
  // SAVE PENDING USER
  // ========================================================

  localStorage.setItem(REEN_PENDING_USER_KEY, JSON.stringify(newUser));

  // ========================================================
  // GENERATE OTP
  // ========================================================

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  localStorage.setItem(REEN_OTP_KEY, otp);

  // ========================================================
  // SHOW OTP IN CONSOLE
  // ========================================================

  console.log("");
  console.log("======================================");

  console.log("REEN BANK VERIFICATION");

  console.log("OTP: " + otp);

  console.log("======================================");

  // ========================================================
  // GO TO OTP PAGE
  // ========================================================

  window.location.href = "OTP.html";
}

// ==========================================================
// MASK EMAIL
// ==========================================================

function maskEmail(email) {
  if (!email) {
    return "your email";
  }

  const parts = email.split("@");

  if (parts.length !== 2) {
    return email;
  }

  const username = parts[0];

  const domain = parts[1];

  if (username.length <= 2) {
    return username.charAt(0) + "****@" + domain;
  }

  return (
    username.substring(0, 2) +
    "****" +
    username.substring(username.length - 1) +
    "@" +
    domain
  );
}

// ==========================================================
// LOAD OTP PAGE EMAIL
// ==========================================================

function loadOTPEmail() {
  const emailElement = document.getElementById("maskedEmail");

  const pendingUser = localStorage.getItem(REEN_PENDING_USER_KEY);

  const savedOTP = localStorage.getItem(REEN_OTP_KEY);

  if (emailElement && pendingUser) {
    try {
      const user = JSON.parse(pendingUser);

      emailElement.textContent = maskEmail(user.email);
    } catch (error) {
      console.error("Could not read pending user:", error);
    }
  }

  // ========================================================
  // SHOW OTP IN CONSOLE
  // ========================================================

  if (savedOTP) {
    console.log("");
    console.log("======================================");

    console.log("REEN BANK VERIFICATION");

    console.log(
      "%cYOUR 6-DIGIT OTP: " + savedOTP,
      "background:#32b98a;color:white;font-size:22px;font-weight:bold;padding:12px 18px;border-radius:8px;",
    );

    console.log("======================================");
  }
}

// ==========================================================
// GET ENTERED OTP
// ==========================================================

function getEnteredOTP() {
  const otpBoxes = document.querySelectorAll(".otp-box");

  if (!otpBoxes.length) {
    return "";
  }

  return Array.from(otpBoxes)
    .map(function (box) {
      return box.value;
    })
    .join("");
}

// ==========================================================
// CLEAR OTP BOXES
// ==========================================================

function clearOTPBoxes() {
  const otpBoxes = document.querySelectorAll(".otp-box");

  otpBoxes.forEach(function (box) {
    box.value = "";
  });

  if (otpBoxes.length > 0) {
    otpBoxes[0].focus();
  }
}

// ==========================================================
// OTP BOXES
// ==========================================================

function setupOTPInputs() {
  const otpBoxes = document.querySelectorAll(".otp-box");

  if (!otpBoxes.length) {
    return;
  }

  otpBoxes.forEach(function (box, index) {
    // INPUT

    box.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");

      if (this.value && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    // BACKSPACE

    box.addEventListener("keydown", function (event) {
      if (event.key === "Backspace" && !this.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });

    // ARROW LEFT

    box.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();

        otpBoxes[index - 1].focus();
      }
    });

    // ARROW RIGHT

    box.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight" && index < otpBoxes.length - 1) {
        event.preventDefault();

        otpBoxes[index + 1].focus();
      }
    });

    // PASTE

    box.addEventListener("paste", function (event) {
      event.preventDefault();

      const pastedOTP = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      pastedOTP.split("").forEach(function (digit, i) {
        if (otpBoxes[i]) {
          otpBoxes[i].value = digit;
        }
      });

      if (pastedOTP.length > 0) {
        const focusIndex = Math.min(pastedOTP.length, otpBoxes.length - 1);

        otpBoxes[focusIndex].focus();
      }
    });
  });

  otpBoxes[0].focus();
}

// ==========================================================
// VERIFY OTP
// ==========================================================

function verifyOTP() {
  console.log("VERIFY OTP CLICKED");

  const enteredOTP = getEnteredOTP();

  const savedOTP = localStorage.getItem(REEN_OTP_KEY);

  if (enteredOTP.length !== 6) {
    showBankModal(
      "Incomplete Code",
      "Please enter all 6 digits of the verification code.",
      "warning",
    );

    return;
  }

  if (!savedOTP || enteredOTP !== savedOTP) {
    showBankModal(
      "Invalid OTP",
      "The verification code you entered is incorrect. Please check the code and try again.",
      "error",
    );

    return;
  }

  // ========================================================
  // GET USER
  // ========================================================

  const pendingUser = localStorage.getItem(REEN_PENDING_USER_KEY);

  if (!pendingUser) {
    showBankModal(
      "Session Expired",
      "Your registration session could not be found. Please register again.",
      "warning",
    );

    return;
  }

  let user;

  try {
    user = JSON.parse(pendingUser);
  } catch (error) {
    showBankModal(
      "Something Went Wrong",
      "We couldn't read your registration information. Please register again.",
      "error",
    );

    return;
  }

  // ========================================================
  // SAVE VERIFIED USER
  // ========================================================

  localStorage.setItem(REEN_USER_KEY, JSON.stringify(user));

  // ========================================================
  // CREATE FRESH BANK
  // ========================================================

  saveFreshBankData(user);

  // ========================================================
  // REMOVE TEMP DATA
  // ========================================================

  localStorage.removeItem(REEN_PENDING_USER_KEY);

  localStorage.removeItem(REEN_OTP_KEY);

  // ========================================================
  // SHOW SUCCESS MODAL
  // ========================================================

  const existingModal = document.getElementById("registrationSuccessModal");

  if (existingModal) {
    existingModal.classList.remove("hidden");

    existingModal.classList.add("flex");
  } else {
    showBankModal(
      "Registration Successful",
      "Your Reen Bank account has been created successfully.",
      "success",
      "Continue to Login",
    );
  }
}

// ==========================================================
// GO TO LOGIN
// ==========================================================

function goToLogin() {
  window.location.href = "login page.html";
}

// ==========================================================
// RESEND OTP
// ==========================================================

function resendOTP() {
  const pendingUser = localStorage.getItem(REEN_PENDING_USER_KEY);

  if (!pendingUser) {
    showBankModal(
      "Registration Expired",
      "Your registration session has expired. Please register again.",
      "warning",
      "Register Again",
    );

    setTimeout(function () {
      window.location.href = "register page.html";
    }, 1800);

    return;
  }

  const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

  localStorage.setItem(REEN_OTP_KEY, newOTP);

  console.log(
    "%cNEW REEN BANK OTP: " + newOTP,
    "background:#32b98a;color:white;font-size:20px;font-weight:bold;padding:10px;",
  );

  clearOTPBoxes();

  startOTPTimer();

  showBankModal(
    "New Code Sent",
    "A new 6-digit verification code has been generated. Check your email and enter the new code.",
    "success",
  );
}

// ==========================================================
// OTP TIMER
// ==========================================================

let otpTimeRemaining = 45;
let otpTimerInterval = null;

function startOTPTimer() {
  const timer = document.getElementById("otpTimer");

  if (!timer) {
    return;
  }

  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
  }

  otpTimeRemaining = 45;

  timer.textContent = "0:45 remaining";

  timer.classList.remove("text-red-500");

  timer.classList.add("text-emerald-500");

  otpTimerInterval = setInterval(function () {
    otpTimeRemaining--;

    const seconds = otpTimeRemaining.toString().padStart(2, "0");

    timer.textContent = "0:" + seconds + " remaining";

    if (otpTimeRemaining <= 0) {
      clearInterval(otpTimerInterval);

      timer.textContent = "Code expired";

      timer.classList.remove("text-emerald-500");

      timer.classList.add("text-red-500");
    }
  }, 1000);
}

// ==========================================================
// LOGIN USER
// ==========================================================

function loginUser() {
  console.log("LOGIN BUTTON CLICKED");

  const emailInput = document.getElementById("loginEmail");

  const passwordInput = document.getElementById("loginPassword");

  if (!emailInput || !passwordInput) {
    showBankModal(
      "Something Went Wrong",
      "We couldn't find the login fields. Please refresh the page and try again.",
      "error",
    );

    return;
  }

  const email = emailInput.value.trim();

  const password = passwordInput.value.trim();

  // EMAIL

  if (!email) {
    showBankModal(
      "Email Required",
      "Please enter your email address.",
      "error",
    );

    emailInput.focus();

    return;
  }

  // PASSWORD

  if (!password) {
    showBankModal("Password Required", "Please enter your password.", "error");

    passwordInput.focus();

    return;
  }

  // GET SAVED USER

  const savedUser = localStorage.getItem(REEN_USER_KEY);

  if (!savedUser) {
    showBankModal(
      "No Account Found",
      "We couldn't find a registered Reen Bank account. Please register first.",
      "warning",
    );

    return;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    showBankModal(
      "Account Error",
      "Your saved account information could not be read. Please register again.",
      "error",
    );

    return;
  }

  // EMAIL CHECK

  if (email.toLowerCase() !== String(user.email || "").toLowerCase()) {
    showBankModal(
      "Incorrect Email",
      "The email address you entered doesn't match your Reen Bank account.",
      "error",
    );

    emailInput.focus();

    return;
  }

  // PASSWORD CHECK

  if (password !== String(user.password || "")) {
    showBankModal(
      "Incorrect Password",
      "The password you entered is incorrect. Please try again.",
      "error",
    );

    passwordInput.focus();

    return;
  }

  // LOGIN SUCCESS

  localStorage.setItem("reenLoggedIn", "true");

  showLoginSuccessModal();
}

// ==========================================================
// LOGIN SUCCESS MODAL
// ==========================================================

function showLoginSuccessModal() {
  const oldModal = document.getElementById("reenLoginSuccessModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");

  modal.id = "reenLoginSuccessModal";

  modal.className =
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999] p-5";

  modal.innerHTML = `

    <div
      class="bg-white w-full max-w-[390px] rounded-3xl p-8 text-center shadow-2xl"
      style="animation:reenModalPop 0.3s ease-out;"
    >

      <div
        class="mx-auto w-20 h-20 rounded-full bg-[#d9f7ec] flex items-center justify-center"
      >

        <div
          class="w-14 h-14 rounded-full bg-[#32b98a] text-white flex items-center justify-center text-3xl font-bold"
        >
          ✓
        </div>

      </div>


      <p
        class="text-[#32b98a] text-[10px] font-bold tracking-[0.2em] mt-5"
      >
        REEN BANK
      </p>


      <h2
        class="text-2xl font-bold text-gray-800 mt-2"
      >
        Login Successful
      </h2>


      <p
        class="text-sm text-gray-500 leading-6 mt-3"
      >
        Welcome back! You have successfully signed in to your Reen Bank account.
      </p>


      <button
        type="button"
        id="loginSuccessContinue"
        class="w-full mt-6 py-3 rounded-xl bg-[#32b98a] hover:bg-[#27a97d] text-white font-semibold transition"
      >
        Continue to Dashboard
      </button>

    </div>

  `;

  document.body.appendChild(modal);

  const continueButton = document.getElementById("loginSuccessContinue");

  if (continueButton) {
    continueButton.addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });
  }

  setTimeout(function () {
    if (document.body.contains(modal)) {
      window.location.href = "dashboard.html";
    }
  }, 2500);
}

// ==========================================================
// LOGIN ENTER KEY
// ==========================================================

function setupLoginForm() {
  const email = document.getElementById("loginEmail");

  const password = document.getElementById("loginPassword");

  if (email) {
    email.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        loginUser();
      }
    });
  }

  if (password) {
    password.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        loginUser();
      }
    });
  }
}

// ==========================================================
// PAGE INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("logins.js DOM READY");

  loadOTPEmail();

  setupOTPInputs();

  startOTPTimer();

  setupLoginForm();

  const resendButton = document.getElementById("resendOTP");

  if (resendButton) {
    resendButton.addEventListener("click", function () {
      resendOTP();
    });
  }
});
