// ============================================================
// REEN BANK - COMPLETE SCRIPT.JS
// ============================================================

// ============================================================
// BANK DATA
// ============================================================

let bankData = {
  user: {
    name: "",
    email: "",
    accountNumber: "",
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

  notifications: [],
};

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let selectedAccountId = null;

// ==========================================================
// REEN BANK BEAUTIFUL MODAL
// ==========================================================

function showReenModal(
  title,
  message,
  type = "info",
  confirmText = "Okay",
  cancelText = "",
) {
  // Remove existing modal
  const existingModal = document.getElementById("reenGlobalModal");

  if (existingModal) {
    existingModal.remove();
  }

  let icon = "i";
  let iconClass = "bg-[#e9f9f3] text-[#2db889]";

  if (type === "success") {
    icon = "✓";
    iconClass = "bg-[#d9f7ec] text-[#2db889]";
  }

  if (type === "error") {
    icon = "!";
    iconClass = "bg-red-50 text-red-500";
  }

  if (type === "warning") {
    icon = "!";
    iconClass = "bg-orange-50 text-orange-500";
  }

  if (type === "logout") {
    icon = "↪";
    iconClass = "bg-[#e9f9f3] text-[#2db889]";
  }

  const modal = document.createElement("div");

  modal.id = "reenGlobalModal";

  modal.className =
    "fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5";

  modal.innerHTML = `
    <div
      class="bg-white w-full max-w-[400px] rounded-3xl p-8 text-center shadow-2xl"
      style="animation: reenGlobalModalPop .3s ease-out;"
    >

      <!-- ICON -->
      <div
        class="mx-auto w-16 h-16 rounded-full ${iconClass} flex items-center justify-center text-3xl font-bold"
      >
        ${icon}
      </div>

      <!-- BRAND -->
      <p
        class="text-[#2db889] text-[10px] font-bold tracking-[0.2em] mt-5"
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

      <!-- BUTTONS -->
      <div class="flex gap-3 mt-6">

        ${
          cancelText
            ? `
              <button
                type="button"
                id="reenModalCancel"
                class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
              >
                ${cancelText}
              </button>
            `
            : ""
        }

        <button
          type="button"
          id="reenModalConfirm"
          class="flex-1 py-3 rounded-xl bg-[#2db889] hover:bg-[#27a97d] text-white font-semibold transition hover:shadow-lg"
        >
          ${confirmText}
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // Animation
  if (!document.getElementById("reenGlobalModalStyles")) {
    const style = document.createElement("style");

    style.id = "reenGlobalModalStyles";

    style.textContent = `
      @keyframes reenGlobalModalPop {
        0% {
          opacity: 0;
          transform: scale(.85) translateY(20px);
        }

        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Confirm
  const confirmButton = document.getElementById("reenModalConfirm");

  if (confirmButton) {
    confirmButton.addEventListener("click", function () {
      modal.remove();
    });
  }

  // Cancel
  const cancelButton = document.getElementById("reenModalCancel");

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      modal.remove();
    });
  }

  // Click outside
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.remove();
    }
  });

  return modal;
}

// ============================================================
// DEFAULT ACCOUNTS
// ============================================================

function getDefaultAccounts() {
  return [
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
  ];
}

// ============================================================
// LOAD BANK DATA
// ============================================================

function loadBankData() {
  const savedData = localStorage.getItem("reenBankData");

  if (!savedData) {
    bankData = {
      user: {
        name: "",
        email: "",
        accountNumber: "",
      },

      accounts: getDefaultAccounts(),

      transactions: [],

      notifications: [],
    };

    saveBankData();

    return;
  }

  try {
    const saved = JSON.parse(savedData);

    bankData = {
      user: saved.user || {
        name: "",
        email: "",
        accountNumber: "",
      },

      accounts:
        Array.isArray(saved.accounts) && saved.accounts.length > 0
          ? saved.accounts
          : getDefaultAccounts(),

      transactions: Array.isArray(saved.transactions) ? saved.transactions : [],

      notifications: Array.isArray(saved.notifications)
        ? saved.notifications
        : [],
    };

    // Make sure every account has a number balance

    bankData.accounts.forEach((account) => {
      account.balance = Number(account.balance) || 0;
    });

    // Make sure every transaction has a number amount

    bankData.transactions.forEach((transaction) => {
      transaction.amount = Number(transaction.amount) || 0;
    });

    saveBankData();
  } catch (error) {
    console.error("Could not load Reen Bank data:", error);

    bankData = {
      user: {
        name: "",
        email: "",
        accountNumber: "",
      },

      accounts: getDefaultAccounts(),

      transactions: [],

      notifications: [],
    };

    saveBankData();
  }
}

// ============================================================
// SAVE BANK DATA
// ============================================================

function saveBankData() {
  localStorage.setItem("reenBankData", JSON.stringify(bankData));
}

// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(amount) {
  return `₦${Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ============================================================
// TOTAL BALANCE
// ============================================================

function getTotalBalance() {
  return bankData.accounts.reduce((total, account) => {
    return total + Number(account.balance || 0);
  }, 0);
}

// ============================================================
// TOTAL INCOME
// ============================================================

function getTotalIncome() {
  return bankData.transactions
    .filter((transaction) => transaction.type === "Deposit")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
}

// ============================================================
// TOTAL EXPENSE
// ============================================================

function getTotalExpense() {
  return bankData.transactions
    .filter((transaction) => transaction.type === "Withdrawal")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
}

// ============================================================
// CURRENT DATE + TIME
// ============================================================

function getCurrentDate() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[now.getMonth()];

  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

// ============================================================
// SIDEBAR
// ============================================================

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  sidebar.classList.toggle("-translate-x-full");
}

// ============================================================
// FAQ
// ============================================================

function toggleFAQ(button) {
  if (!button) return;

  const answer = button.nextElementSibling;

  const icon = button.querySelector(".faq-icon");

  if (!answer) return;

  answer.classList.toggle("hidden");

  if (icon) {
    icon.textContent = answer.classList.contains("hidden") ? "+" : "−";
  }
}

// ============================================================
// LOAD USER INFORMATION
// ============================================================

function loadUserInformation() {
  const savedUser = localStorage.getItem("reenBankUser");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);

      if (user.name) {
        bankData.user.name = user.name;
      }

      if (user.email) {
        bankData.user.email = user.email;
      }

      if (user.accountNumber) {
        bankData.user.accountNumber = user.accountNumber;
      }
    } catch (error) {
      console.log("Could not load user information.");
    }
  }

  // Profile name

  document
    .querySelectorAll("#userName, #dashboardUserName, #profileDisplayName")
    .forEach((element) => {
      if (element) {
        element.textContent = bankData.user.name || "User";
      }
    });

  // Profile email

  document
    .querySelectorAll("#userEmail, #dashboardUserEmail, #profileDisplayEmail")
    .forEach((element) => {
      if (element) {
        element.textContent = bankData.user.email || "";
      }
    });

  // Apply saved profile picture

  applyProfileImage();
}

// ============================================================
// DASHBOARD NUMBERS
// ============================================================

function updateDashboardNumbers() {
  const totalBalance = document.getElementById("totalBalance");

  const totalIncome = document.getElementById("totalIncome");

  const totalExpense = document.getElementById("totalExpense");

  if (totalBalance) {
    totalBalance.textContent = formatMoney(getTotalBalance());
  }

  if (totalIncome) {
    totalIncome.textContent = formatMoney(getTotalIncome());
  }

  if (totalExpense) {
    totalExpense.textContent = formatMoney(getTotalExpense());
  }
}

// ============================================================
// CREATE ACCOUNT MODAL
// ============================================================

function openCreateAccountModal() {
  const modal = document.getElementById("createAccountModal");

  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const input = document.getElementById("newAccountName");

  const error = document.getElementById("accountCreateError");

  if (input) {
    input.value = "";
    input.focus();
  }

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }
}

// ============================================================
// CLOSE CREATE ACCOUNT MODAL
// ============================================================

function closeCreateAccountModal() {
  const modal = document.getElementById("createAccountModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// ============================================================
// CREATE ACCOUNT
// ============================================================

function createAccount() {
  createNewAccount();
}

// ============================================================
// CREATE NEW ACCOUNT
// ============================================================

function createNewAccount() {
  const nameInput = document.getElementById("newAccountName");

  const typeInput = document.getElementById("newAccountType");

  const error = document.getElementById("accountCreateError");

  if (!nameInput) return;

  const accountName = nameInput.value.trim();

  const accountType = typeInput ? typeInput.value : "Savings";

  if (!accountName) {
    if (error) {
      error.textContent = "Please enter an account name.";

      error.classList.remove("hidden");
    } else {
      alert("Please enter an account name.");
    }

    return;
  }

  const newAccount = {
    id: Date.now(),

    name: accountName,

    type: accountType,

    balance: 0,
  };

  bankData.accounts.push(newAccount);

  // SAVE

  saveBankData();

  // NOTIFICATION

  addNotification(
    "Account Created",
    `${accountName} was created successfully.`,
    "success",
  );

  // UPDATE EVERYTHING

  refreshAllPages();

  // CLOSE MODAL

  closeCreateAccountModal();

  // SUCCESS POPUP

  showSuccessMessage(
    "Account Created",
    `${accountName} has been created successfully. Your new account starts with ₦0.00.`,
  );
}

// ============================================================
// DASHBOARD ACCOUNT CARDS
// ============================================================

function renderDashboardAccounts() {
  const container = document.getElementById("dashboardAccounts");

  if (!container) return;

  container.innerHTML = "";

  bankData.accounts.forEach((account) => {
    const card = document.createElement("div");

    card.className = `
        bg-green
        rounded-2xl
        p-5
        shadow-sm
        border
        border-gray-100
        hover:shadow-md
        transition-all
        duration-300
      `;

    card.innerHTML = `

        <div
          class=" relative
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <p
              class="
                text-xs
                text-gray-400
              "
            >
              ${account.type}
            </p>

            <h3
              class="
                font-bold
                text-lg
                mt-1
              "
            >
              ${account.name}
            </h3>

          </div>


          

        </div>


        <div
          class=" relative
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              class="
                text-xs
                text-gray-400
                mb-1
              "
            >
              Available Balance
            </p>


            <p
              id="dashboardBalance-${account.id}"
              data-hidden="false"
              class="
                text-2xl
                font-bold
              "
            >
              ${formatMoney(account.balance)}
            </p>

          </div>


          <button
            type="button"
            onclick="toggleDashboardBalance(${account.id})"
            class=" 
              absolute
              top-0.1
              right-0.5
              w-10
              h-10
              rounded-full
              bg-gray-100
              flex
              items-center
              justify-center
              hover:bg-gray-200
              transition
            "
          >

            <img
              id="dashboardEye-${account.id}"
              src="hide account numbers.png"
              alt="Hide balance"
              class="w-5 h-5"
            >

          </button>

        </div>


        <div
          class=" relative
            flex
            gap-3
            mt-5
          "
        >

          <button
            onclick="openFundAccount(${account.id})"
            class="
              flex-1
              bg-[#2db889]
              text-white
              py-3
              rounded-xl
              font-semibold
              hover:bg-[#239c73]
              transition
            "
          >
            Fund
          </button>


          <button
            onclick="openWithdraw(${account.id})"
            class="
              flex-1
              border
              border-gray-200
              py-3
              rounded-xl
              font-semibold
              hover:bg-gray-50
              transition
            "
          >
            Withdraw
          </button>

        </div>

      `;

    container.appendChild(card);
  });
}

// ============================================================
// DASHBOARD BALANCE HIDE / SHOW
// ============================================================

function toggleDashboardBalance(accountId) {
  const balance = document.getElementById(`dashboardBalance-${accountId}`);

  const icon = document.getElementById(`dashboardEye-${accountId}`);

  if (!balance) return;

  const hidden = balance.dataset.hidden === "true";

  if (hidden) {
    const account = bankData.accounts.find((item) => item.id == accountId);

    if (!account) return;

    balance.textContent = formatMoney(account.balance);

    balance.dataset.hidden = "false";

    if (icon) {
      icon.src = "hide account numbers.png";

      icon.alt = "Hide balance";
    }
  } else {
    balance.textContent = "••••••••";

    balance.dataset.hidden = "true";

    if (icon) {
      icon.src = "hide account numbers.png";

      icon.alt = "Show balance";
    }
  }
}

// ============================================================
// VIEW ACCOUNT
// ============================================================

function viewAccount(accountId) {
  window.location.href = `main account.html?id=${accountId}`;
}

// ============================================================
// RECENT TRANSACTIONS
// ============================================================

function renderRecentTransactions() {
  const container = document.getElementById("recentTransactions");

  if (!container) return;

  container.innerHTML = "";

  const transactions = [...(bankData.transactions || [])].reverse();

  if (transactions.length === 0) {
    container.innerHTML = `

      <div
        class="
          py-8
          text-center
        "
      >

        <p
          class="
            text-gray-400
            text-sm
          "
        >
          No transactions yet
        </p>

      </div>

    `;

    return;
  }

  transactions.slice(0, 5).forEach((transaction) => {
    const isDeposit = transaction.type === "Deposit";

    const account = bankData.accounts.find(
      (item) => item.id == transaction.accountId,
    );

    const accountName = account ? account.name : "Account";

    const row = document.createElement("div");

    row.className = `
          flex
          items-center
          justify-between
          gap-4
          py-4
          border-b
          border-gray-100
          last:border-none
        `;

    row.innerHTML = `

          <div
            class="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            <div
              class="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                shrink-0
                ${isDeposit ? "bg-[#d9f7ec]" : "bg-red-50"}
              "
            >

              <span
                class="
                  text-lg
                  font-bold
                  ${isDeposit ? "text-[#2db889]" : "text-red-500"}
                "
              >
                ${isDeposit ? "+" : "−"}
              </span>

            </div>


            <div
              class="min-w-0"
            >

              <p
                class="
                  text-sm
                  font-semibold
                  truncate
                "
              >
                ${transaction.description || transaction.type}
              </p>


              <p
                class="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                ${accountName}
              </p>

            </div>

          </div>


          <div
            class="
              text-right
              shrink-0
            "
          >

            <p
              class="
                text-sm
                font-bold
                ${isDeposit ? "text-[#2db889]" : "text-red-500"}
              "
            >
              ${isDeposit ? "+" : "-"}
              ${formatMoney(transaction.amount)}
            </p>


            <p
              class="
                text-xs
                text-gray-400
                mt-1
              "
            >
              ${transaction.date || ""}
            </p>

          </div>

        `;

    container.appendChild(row);
  });
}

// ============================================================
// DASHBOARD TRANSACTIONS
// ============================================================

function renderDashboardTransactions() {
  const container = document.getElementById("dashboardTransactions");

  if (!container) return;

  container.innerHTML = "";

  const transactions = [...(bankData.transactions || [])].reverse();

  if (transactions.length === 0) {
    container.innerHTML = `

      <div
        class="
          py-8
          text-center
        "
      >

        <p
          class="
            text-gray-400
            text-sm
          "
        >
          No transactions yet
        </p>


        <p
          class="
            text-gray-300
            text-xs
            mt-1
          "
        >
          Fund or withdraw from an account
          to see activity.
        </p>

      </div>

    `;

    return;
  }

  transactions.forEach((transaction) => {
    const account = bankData.accounts.find(
      (item) => item.id == transaction.accountId,
    );

    const accountName = account ? account.name : "Account";

    const isDeposit = transaction.type === "Deposit";

    const row = document.createElement("div");

    row.className = `
        flex
        items-center
        justify-between
        gap-4
        py-4
        border-b
        border-gray-100
        last:border-none
      `;

    row.innerHTML = `

        <div
          class="
            flex
            items-center
            gap-3
            min-w-0
          "
        >

          <div
            class="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              shrink-0
              ${isDeposit ? "bg-[#d9f7ec]" : "bg-red-50"}
            "
          >

            <span
              class="
                text-lg
                font-bold
                ${isDeposit ? "text-[#2db889]" : "text-red-500"}
              "
            >
              ${isDeposit ? "+" : "−"}
            </span>

          </div>


          <div
            class="min-w-0"
          >

            <p
              class="
                text-sm
                font-semibold
                truncate
              "
            >
              ${transaction.description || transaction.type}
            </p>


            <p
              class="
                text-xs
                text-gray-400
                mt-1
              "
            >
              ${accountName}
              •
              ${transaction.date || ""}
            </p>

          </div>

        </div>


        <div
          class="
            text-right
            shrink-0
          "
        >

          <p
            class="
              text-sm
              font-bold
              ${isDeposit ? "text-[#2db889]" : "text-red-500"}
            "
          >
            ${isDeposit ? "+" : "-"}
            ${formatMoney(transaction.amount)}
          </p>


          <span
            class="
              inline-block
              mt-1
              text-[10px]
              px-2
              py-1
              rounded-full
              ${
                isDeposit
                  ? "bg-[#e9f9f3] text-[#2db889]"
                  : "bg-red-50 text-red-500"
              }
            "
          >
            ${transaction.status || "Completed"}
          </span>

        </div>

      `;

    container.appendChild(row);
  });
}

// ============================================================
// OPEN FUND ACCOUNT
// ============================================================

function openFundAccount(accountId) {
  selectedAccountId = accountId;

  const account = bankData.accounts.find((item) => item.id == accountId);

  if (!account) return;

  const modal = document.getElementById("fundModal");

  if (!modal) {
    alert("Fund Account modal is missing.");

    return;
  }

  const accountName = document.getElementById("fundAccountName");

  const currentBalance = document.getElementById("fundCurrentBalance");

  const amount = document.getElementById("fundAmount");

  const error = document.getElementById("fundError");

  if (accountName) {
    accountName.textContent = account.name;
  }

  if (currentBalance) {
    currentBalance.textContent = formatMoney(account.balance);
  }

  if (amount) {
    amount.value = "";
  }

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }

  modal.classList.remove("hidden");

  modal.classList.add("flex");
}

// ============================================================
// CLOSE FUND MODAL
// ============================================================

function closeFundModal() {
  const modal = document.getElementById("fundModal");

  if (!modal) return;

  modal.classList.add("hidden");

  modal.classList.remove("flex");

  selectedAccountId = null;
}

// ============================================================
// FUND ACCOUNT
// ============================================================

function fundAccount() {
  const amountInput = document.getElementById("fundAmount");

  const error = document.getElementById("fundError");

  if (!amountInput) return;

  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    if (error) {
      error.textContent = "Please enter a valid amount.";

      error.classList.remove("hidden");
    } else {
      alert("Please enter a valid amount.");
    }

    return;
  }

  const account = bankData.accounts.find(
    (item) => item.id == selectedAccountId,
  );

  if (!account) {
    if (error) {
      error.textContent = "Account could not be found.";

      error.classList.remove("hidden");
    }

    return;
  }

  // UPDATE ACCOUNT BALANCE

  account.balance = Number(account.balance || 0) + amount;

  // ADD TRANSACTION

  bankData.transactions.push({
    id: Date.now(),

    accountId: account.id,

    type: "Deposit",

    description: "Fund Account",

    amount: amount,

    status: "Completed",

    date: getCurrentDate(),
  });

  // SAVE

  saveBankData();

  // NOTIFICATION

  addNotification(
    "Money Added",
    `${formatMoney(amount)} was added to ${account.name}.`,
    "success",
  );

  // REFRESH EVERYTHING

  refreshAllPages();

  // CLOSE MODAL

  closeFundModal();

  // SUCCESS

  showSuccessMessage(
    "Money Added Successfully",
    `${formatMoney(amount)} has been added to ${account.name}.`,
  );
}

// ============================================================
// OPEN WITHDRAW
// ============================================================

function openWithdraw(accountId) {
  selectedAccountId = accountId;

  const account = bankData.accounts.find((item) => item.id == accountId);

  if (!account) return;

  const modal = document.getElementById("withdrawModal");

  if (!modal) {
    alert("Withdraw modal is missing.");

    return;
  }

  const accountName = document.getElementById("withdrawAccountName");

  const currentBalance = document.getElementById("withdrawCurrentBalance");

  const amount = document.getElementById("withdrawAmount");

  const error = document.getElementById("withdrawError");

  if (accountName) {
    accountName.textContent = account.name;
  }

  if (currentBalance) {
    currentBalance.textContent = formatMoney(account.balance);
  }

  if (amount) {
    amount.value = "";
  }

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }

  modal.classList.remove("hidden");

  modal.classList.add("flex");
}

// ============================================================
// CLOSE WITHDRAW MODAL
// ============================================================

function closeWithdrawModal() {
  const modal = document.getElementById("withdrawModal");

  if (!modal) return;

  modal.classList.add("hidden");

  modal.classList.remove("flex");

  selectedAccountId = null;
}

// ============================================================
// WITHDRAW MONEY
// ============================================================

function withdrawMoney() {
  const amountInput = document.getElementById("withdrawAmount");

  const error = document.getElementById("withdrawError");

  if (!amountInput) return;

  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    if (error) {
      error.textContent = "Please enter a valid amount.";

      error.classList.remove("hidden");
    }

    return;
  }

  const account = bankData.accounts.find(
    (item) => item.id == selectedAccountId,
  );

  if (!account) {
    if (error) {
      error.textContent = "Account could not be found.";

      error.classList.remove("hidden");
    }

    return;
  }

  if (amount > Number(account.balance)) {
    if (error) {
      error.textContent = "Insufficient balance.";

      error.classList.remove("hidden");
    }

    return;
  }

  // REMOVE MONEY

  account.balance = Number(account.balance) - amount;

  // ADD TRANSACTION

  bankData.transactions.push({
    id: Date.now(),

    accountId: account.id,

    type: "Withdrawal",

    description: "Withdrawal",

    amount: amount,

    status: "Completed",

    date: getCurrentDate(),
  });

  // SAVE

  saveBankData();

  // NOTIFICATION

  addNotification(
    "Withdrawal Completed",
    `${formatMoney(amount)} was withdrawn from ${account.name}.`,
    "warning",
  );

  // REFRESH

  refreshAllPages();

  // CLOSE

  closeWithdrawModal();

  // SUCCESS

  showSuccessMessage(
    "Withdrawal Successful",
    `${formatMoney(amount)} has been withdrawn from ${account.name}.`,
  );
}

// ============================================================
// ACCOUNTS PAGE
// ============================================================

function renderAccountsPage() {
  const container = document.getElementById("accountsContainer");

  if (!container) return;

  container.innerHTML = "";

  const emptyState = document.getElementById("accountsEmptyState");

  if (bankData.accounts.length === 0) {
    if (emptyState) {
      emptyState.classList.remove("hidden");
    }

    return;
  }

  if (emptyState) {
    emptyState.classList.add("hidden");
  }

  bankData.accounts.forEach((account, index) => {
    const card = document.createElement("div");

    card.className = `
        relative
        bg-[#d4f4e8]
        rounded-2xl
        p-6
        shadow-sm
        ${
          index === 0
            ? "border-2 border-purple-500"
            : "border border-transparent"
        }
        hover:-translate-y-1
        transition-all
        duration-300
      `;

    card.innerHTML = `

        <div
          class="
            flex
            items-start
            justify-between
            mb-8
          "
        >

          <div>

            <p
              class="
                text-xs
                text-[#161618]
                font-semibold
              "
            >
              ${account.name}
            </p>

            <p
              class="
                text-xs
                text-gray-500
                mt-1
              "
            >
              ${account.type}
            </p>

          </div>


          

        </div>


        <p
          class="
            text-xs
            text-gray-500
            mb-1
          "
        >
          Account Balance
        </p>


        <div
          class="
            flex
            items-center
            gap-3
            mb-7
          "
        >

          <p
            id="accountBalance-${account.id}"
            data-hidden="false"
            class="
              text-3xl
              font-bold
            "
          >
            ${formatMoney(account.balance)}
          </p>


          <button
            type="button"
            onclick="toggleAccountBalance(${account.id})"
            class="
              w-8
              h-8
              rounded-full
              bg-white/70
              flex
              items-center
              justify-center
            "
          >

            <img
              id="accountEye-${account.id}"
              src="hide account numbers.png"
              alt="Hide balance"
              class="w-4 h-4"
            >

          </button>

        </div>


        <div
          class="
            flex
            gap-3
          "
        >

          <button
            onclick="openFundAccount(${account.id})"
            class="
              flex-1
              bg-[#2db889]
              text-white
              py-3
              rounded-xl
              font-semibold
              hover:bg-[#239c73]
              transition
            "
          >
            Fund
          </button>


          <button
            onclick="openWithdraw(${account.id})"
            class="
              flex-1
              bg-white
              text-gray-700
              py-3
              rounded-xl
              font-semibold
              hover:bg-gray-50
              transition
            "
          >
            Withdraw
          </button>

        </div>

      `;

    container.appendChild(card);
  });
}

// ============================================================
// ACCOUNT BALANCE HIDE / SHOW
// ============================================================

function toggleAccountBalance(accountId) {
  const balance = document.getElementById(`accountBalance-${accountId}`);

  const icon = document.getElementById(`accountEye-${accountId}`);

  if (!balance) return;

  const hidden = balance.dataset.hidden === "true";

  if (hidden) {
    const account = bankData.accounts.find((item) => item.id == accountId);

    if (!account) return;

    balance.textContent = formatMoney(account.balance);

    balance.dataset.hidden = "false";

    if (icon) {
      icon.src = "hide account numbers.png";

      icon.alt = "Hide balance";
    }
  } else {
    balance.textContent = "••••••••";

    balance.dataset.hidden = "true";

    if (icon) {
      icon.src = "hide account numbers.png";

      icon.alt = "Show balance";
    }
  }
}

// ============================================================
// ACCOUNTS SUMMARY
// ============================================================

function updateAccountsSummary() {
  const totalBalance = document.getElementById("accountsTotalBalance");

  const totalIncome = document.getElementById("accountsTotalIncome");

  const totalExpense = document.getElementById("accountsTotalExpense");

  if (totalBalance) {
    totalBalance.textContent = formatMoney(getTotalBalance());
  }

  if (totalIncome) {
    totalIncome.textContent = formatMoney(getTotalIncome());
  }

  if (totalExpense) {
    totalExpense.textContent = formatMoney(getTotalExpense());
  }
}

// ============================================================
// CREATE ACCOUNT FROM ACCOUNTS PAGE
// ============================================================

function createAccountFromAccountsPage() {
  createNewAccount();
}

// ============================================================
// ACCOUNTS PAGE TRANSACTIONS
// ============================================================

function renderAccountsTransactions() {
  const container = document.getElementById("accountsTransactions");

  if (!container) return;

  container.innerHTML = "";

  const transactions = [...(bankData.transactions || [])].reverse();

  if (transactions.length === 0) {
    container.innerHTML = `

      <div
        class="
          py-10
          text-center
        "
      >

        <p
          class="
            text-gray-400
            text-sm
          "
        >
          No transactions yet.
        </p>

      </div>

    `;

    return;
  }

  transactions.forEach((transaction) => {
    const account = bankData.accounts.find(
      (item) => item.id == transaction.accountId,
    );

    const accountName = account ? account.name : "Account";

    const isDeposit = transaction.type === "Deposit";

    const row = document.createElement("div");

    row.className = `
        flex
        items-center
        justify-between
        px-6
        py-4
        border-b
        border-gray-100
        last:border-none
      `;

    row.innerHTML = `

        <div
          class="
            flex
            items-center
            gap-3
          "
        >

          <div
            class="
              w-9
              h-9
              rounded-full
              ${isDeposit ? "bg-[#2db889]" : "bg-[#ef5260]"}
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >
            ${isDeposit ? "+" : "−"}
          </div>


          <div>

            <p
              class="
                text-sm
                font-semibold
              "
            >
              ${transaction.description || transaction.type}
            </p>

            <p
              class="
                text-xs
                text-gray-400
                mt-1
              "
            >
              ${accountName}
              •
              ${transaction.date || ""}
            </p>

          </div>

        </div>


        <div
          class="
            text-right
          "
        >

          <p
            class="
              font-bold
              ${isDeposit ? "text-[#2db889]" : "text-[#ef5260]"}
            "
          >
            ${isDeposit ? "+" : "-"}
            ${formatMoney(transaction.amount)}
          </p>


          <p
            class="
              text-xs
              text-gray-400
              mt-1
            "
          >
            ${transaction.status || "Completed"}
          </p>

        </div>

      `;

    container.appendChild(row);
  });
}

// ============================================================
// TRANSACTION ACCOUNT CARDS
// ============================================================

function renderTransactionAccounts() {
  const container = document.getElementById("transactionAccounts");

  if (!container) return;

  container.innerHTML = "";

  bankData.accounts.forEach((account, index) => {
    const card = document.createElement("div");

    card.className = `
        bg-[#d4f4e8]
        rounded-xl
        p-5
        border-l-4
        ${index === 0 ? "border-[#6546a5]" : "border-transparent"}
        hover:-translate-y-1
        hover:shadow-lg
        transition-all
        duration-300
      `;

    card.innerHTML = `

        <div
          class="
            flex
            items-start
            justify-between
          "
        >

          <div>

            <p
              class="
                text-xs
                font-semibold
                text-[#6546a5]
              "
            >
              ${account.name}
            </p>


            <p
              class="
                text-2xl
                font-bold
                mt-1
              "
            >
              ${formatMoney(account.balance)}
            </p>

          </div>


          <button
            type="button"
            onclick="toggleTransactionAccountBalance(${account.id})"
            class="
              p-1
            "
          >

            <img
              id="transactionEye-${account.id}"
              src="hide account numbers.png"
              alt="Account visibility"
              class="w-4 h-4"
            >

          </button>

        </div>

      `;

    container.appendChild(card);
  });
}

// ============================================================
// TRANSACTION ACCOUNT BALANCE
// ============================================================

function toggleTransactionAccountBalance(accountId) {
  const account = bankData.accounts.find((item) => item.id == accountId);

  const card = document.getElementById(`transactionEye-${accountId}`);

  if (!account || !card) return;

  const balance = card
    .closest("div")
    ?.parentElement?.querySelector("p.text-2xl");

  if (!balance) return;

  const hidden = balance.dataset.hidden === "true";

  if (hidden) {
    balance.textContent = formatMoney(account.balance);

    balance.dataset.hidden = "false";

    card.src = "hide account numbers.png";
  } else {
    balance.textContent = "••••••••";

    balance.dataset.hidden = "true";

    card.src = ".eye-off.png";
  }
}

// ======================================================
// TRANSACTIONS PAGE - EXACT ROW STYLE
// ======================================================

function renderTransactionsPage() {
  const container = document.getElementById("transactionsList");

  if (!container) return;

  container.innerHTML = "";

  // ==========================================
  // ACCOUNT CARDS
  // ==========================================

  const accountsWrapper = document.createElement("div");

  accountsWrapper.className = `
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    gap-6
    mb-16
  `;

  bankData.accounts.forEach((account, index) => {
    const card = document.createElement("div");

    card.className = `
      relative
      h-[85px]
      rounded-xl
      bg-[#d4f4e8]
      px-6
      py-4
      overflow-hidden
      ${index === 0 ? "border-l-[5px] border-[#5427a8]" : ""}
    `;

    card.innerHTML = `

      <!-- ACCOUNT NAME -->

      <p class="
        text-[12px]
        font-medium
        text-[#33217d]
        mb-1
      ">
        ${account.name}
      </p>


      <!-- BALANCE -->

      <p
        id="transactionAccountBalance-${account.id}"
        class="
          text-[19px]
          font-bold
          text-[#202020]
        "
      >
        ${formatMoney(account.balance)}
      </p>


      <!-- EYE ICON -->

      <button
        type="button"
        onclick="toggleTransactionBalance(${account.id})"
        class="
          absolute
          right-5
          top-5
          w-5
          h-5
          flex
          items-center
          justify-center
        "
      >

        <img
          id="transactionAccountEye-${account.id}"
          src="hide account numbers.png"
          alt="Hide balance"
          class="w-4 h-4 object-contain"
        >

      </button>

    `;

    accountsWrapper.appendChild(card);
  });

  container.appendChild(accountsWrapper);

  // ==========================================
  // TRANSACTION ROW CONTAINER
  // ==========================================

  const transactionWrapper = document.createElement("div");

  transactionWrapper.className = `
    w-full
  `;

  // ==========================================
  // NO TRANSACTIONS
  // ==========================================

  if (!bankData.transactions || bankData.transactions.length === 0) {
    transactionWrapper.innerHTML = `

      <div class="
        py-16
        text-center
        text-gray-400
      ">

        <p class="text-sm">
          No transactions yet.
        </p>

        <p class="
          text-xs
          text-gray-300
          mt-2
        ">
          Fund or withdraw from an account to see your transactions here.
        </p>

      </div>

    `;

    transactionWrapper.classList.add("mt-8");

    container.appendChild(transactionWrapper);

    return;
  }

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  const transactions = [...bankData.transactions].reverse();

  transactions.forEach((transaction) => {
    const isDeposit = transaction.type === "Deposit";

    // ==========================================
    // ICON
    // ==========================================

    const iconBackground = isDeposit ? "bg-[#2db889]" : "bg-[#ef5260]";

    const icon = isDeposit ? "+" : "−";

    // ==========================================
    // AMOUNT
    // ==========================================

    const amountColor = isDeposit ? "text-[#2db889]" : "text-[#ef5260]";

    const amountSign = isDeposit ? "+" : "-";

    // ==========================================
    // STATUS
    // ==========================================

    let statusBackground = "bg-[#d0d0d0]";
    let statusText = "text-[#555555]";

    if (transaction.status === "Completed") {
      statusBackground = "bg-[#2db889]";
      statusText = "text-white";
    }

    if (transaction.status === "Canceled") {
      statusBackground = "bg-[#ef5260]";
      statusText = "text-white";
    }

    if (transaction.status === "Pending") {
      statusBackground = "bg-[#d0d0d0]";
      statusText = "text-[#555555]";
    }

    // ==========================================
    // ACCOUNT
    // ==========================================

    const account = bankData.accounts.find(
      (item) => item.id == transaction.accountId,
    );

    const customerName =
      bankData.user && bankData.user.name
        ? bankData.user.name
        : "Oluwaben Jamin";

    // ==========================================
    // ROW
    // ==========================================

    const row = document.createElement("div");

    row.className = `
      w-full
      min-h-[52px]
      flex
      items-center
      border-b
      border-[#dedede]
      py-2
      transition
      hover:bg-white/40
    `;

    row.innerHTML = `

      <!-- ================================= -->
      <!-- PLUS / MINUS -->
      <!-- ================================= -->

      <div class="
        w-[9%]
        flex
        justify-start
        pl-2
      ">

        <div class="
          w-[27px]
          h-[27px]
          rounded-full
          ${iconBackground}
          text-white
          flex
          items-center
          justify-center
          text-[20px]
          font-normal
        ">
          ${icon}
        </div>

      </div>


      <!-- ================================= -->
      <!-- CUSTOMER -->
      <!-- ================================= -->

      <div class="
        w-[18%]
        text-left
      ">

        <p class="
          text-[12px]
          text-[#8a8a8a]
          truncate
        ">
          ${customerName}
        </p>

      </div>


      <!-- ================================= -->
      <!-- TRANSACTION TYPE -->
      <!-- ================================= -->

      <div class="
        w-[18%]
        text-left
      ">

        <p class="
          text-[12px]
          text-[#8a8a8a]
          truncate
        ">
          ${transaction.description || transaction.type}
        </p>

      </div>


      <!-- ================================= -->
      <!-- DATE -->
      <!-- ================================= -->

      <div class="
        w-[20%]
        text-left
      ">

        <p class="
          text-[12px]
          text-[#8a8a8a]
          whitespace-nowrap
        ">
          ${transaction.date || getCurrentDate()}
        </p>

      </div>


      <!-- ================================= -->
      <!-- AMOUNT -->
      <!-- ================================= -->

      <div class="
        w-[16%]
        text-left
      ">

        <p class="
          text-[13px]
          font-medium
          ${amountColor}
          whitespace-nowrap
        ">
          ${amountSign}${formatMoney(transaction.amount)}
        </p>

      </div>


      <!-- ================================= -->
      <!-- STATUS -->
      <!-- ================================= -->

      <div class="
        w-[19%]
        flex
        justify-end
        pr-2
      ">

        <span class="
          w-[137px]
          h-[27px]
          flex
          items-center
          justify-center
          rounded-[6px]
          text-[11px]
          font-medium
          ${statusBackground}
          ${statusText}
        ">
          ${transaction.status || "Completed"}
        </span>

      </div>

    `;

    transactionWrapper.appendChild(row);
  });

  container.appendChild(transactionWrapper);
}

// ======================================================
// TRANSACTION PAGE BALANCE EYE
// ======================================================

function toggleTransactionBalance(accountId) {
  const balance = document.getElementById(
    `transactionAccountBalance-${accountId}`,
  );

  const eye = document.getElementById(`transactionAccountEye-${accountId}`);

  if (!balance || !eye) return;

  const account = bankData.accounts.find((item) => item.id == accountId);

  if (!account) return;

  const hidden = balance.dataset.hidden === "true";

  if (hidden) {
    balance.textContent = formatMoney(account.balance);

    balance.dataset.hidden = "false";

    eye.src = "hide account numbers.png";

    eye.alt = "Hide balance";
  } else {
    balance.textContent = "••••••••";

    balance.dataset.hidden = "true";

    eye.src = "hide account numbers.png";

    eye.alt = "Show balance";
  }
}

// ============================================================
// PROFILE IMAGE STORAGE
// ============================================================

function getSavedProfileImage() {
  const profileData = localStorage.getItem("reenBankProfile");

  if (profileData) {
    try {
      const profile = JSON.parse(profileData);

      if (profile && profile.profileImage) {
        return profile.profileImage;
      }
    } catch (error) {
      console.log("Profile image could not be loaded.");
    }
  }

  return ".profile-image.png";
}

// ============================================================
// APPLY PROFILE IMAGE TO EVERY PAGE
// ============================================================

function applyProfileImage() {
  const image = getSavedProfileImage();

  // IDs commonly used in your pages

  const selectors = [
    "#profilePreview",

    "#headerProfileImage",

    "#dashboardProfileImage",

    "#userProfileImage",

    "#profileImage",

    "#navProfileImage",

    "[data-profile-image]",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.tagName === "IMG") {
        element.src = image;
      }
    });
  });

  // Also find your default profile image

  document.querySelectorAll('img[src*="profile-image"]').forEach((element) => {
    element.src = image;
  });
}

// ==========================================================
// LOAD PROFILE PAGE
// ==========================================================

function loadProfilePage() {
  const profileName = document.getElementById("profileName");

  // Not on profile page
  if (!profileName) {
    return;
  }

  let user = {};
  let profile = {};

  try {
    user = JSON.parse(localStorage.getItem("reenBankUser")) || {};
  } catch (error) {
    user = {};
  }

  try {
    profile = JSON.parse(localStorage.getItem("reenBankProfile")) || {};
  } catch (error) {
    profile = {};
  }

  const name = profile.name || user.name || "User";

  const email = profile.email || user.email || "";

  // ========================================================
  // FORM
  // ========================================================

  profileName.value = name;

  const profileEmail = document.getElementById("profileEmail");

  if (profileEmail) {
    profileEmail.value = email;
  }

  const profilePhone = document.getElementById("profilePhone");

  if (profilePhone) {
    profilePhone.value = profile.phone || "";
  }

  const profileGender = document.getElementById("profileGender");

  if (profileGender) {
    profileGender.value = profile.gender || "";
  }

  const profileAddress = document.getElementById("profileAddress");

  if (profileAddress) {
    profileAddress.value = profile.address || "";
  }

  // ========================================================
  // DISPLAY NAME
  // ========================================================

  const displayName = document.getElementById("profileDisplayName");

  if (displayName) {
    displayName.textContent = name;
  }

  // ========================================================
  // DISPLAY EMAIL
  // ========================================================

  const displayEmail = document.getElementById("profileDisplayEmail");

  if (displayEmail) {
    displayEmail.textContent = email;
  }

  // ========================================================
  // ACCOUNT NUMBER
  // ========================================================

  // ========================================================
  // PROFILE IMAGE
  // ========================================================

  const savedImage = profile.profileImage || ".profile-image.png";

  const profilePreview = document.getElementById("profilePreview");

  if (profilePreview) {
    profilePreview.src = savedImage;
  }

  // Also update header
  const headerImage = document.getElementById("headerProfileImage");

  if (headerImage) {
    headerImage.src = savedImage;
  }
}

// ============================================================
// SAVE PROFILE CHANGES
// ============================================================

function saveProfileChanges() {
  const nameInput = document.getElementById("profileName");

  const emailInput = document.getElementById("profileEmail");

  const phoneInput = document.getElementById("profilePhone");

  const genderInput = document.getElementById("profileGender");

  const addressInput = document.getElementById("profileAddress");

  if (!nameInput || !emailInput) {
    return;
  }

  const name = nameInput.value.trim();

  const email = emailInput.value.trim();

  const phone = phoneInput ? phoneInput.value.trim() : "";

  const gender = genderInput ? genderInput.value : "";

  const address = addressInput ? addressInput.value.trim() : "";

  if (!name || !email) {
    alert("Name and email are required.");

    return;
  }

  let oldProfile = {};

  try {
    oldProfile = JSON.parse(localStorage.getItem("reenBankProfile")) || {};
  } catch (error) {
    oldProfile = {};
  }

  const profile = {
    ...oldProfile,

    name: name,

    email: email,

    phone: phone,

    gender: gender,

    address: address,
  };

  // SAVE PROFILE

  localStorage.setItem("reenBankProfile", JSON.stringify(profile));

  // SAVE USER

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("reenBankUser")) || {};
  } catch (error) {
    user = {};
  }

  user.name = name;

  user.email = email;

  localStorage.setItem("reenBankUser", JSON.stringify(user));

  // UPDATE BANK DATA

  bankData.user.name = name;

  bankData.user.email = email;

  saveBankData();

  // UPDATE PAGE

  loadProfilePage();

  loadUserInformation();

  // NOTIFICATION

  addNotification(
    "Profile Updated",
    "Your profile information was updated successfully.",
    "success",
  );

  // SUCCESS

  showSuccessMessage(
    "Profile Updated",
    "Your profile information has been saved successfully.",
  );
}

// ==========================================================
// PROFILE IMAGE UPLOAD
// ==========================================================

function previewProfileImage(event) {
  const file = event.target.files && event.target.files[0];

  if (!file) {
    return;
  }

  // ========================================================
  // CHECK FILE TYPE
  // ========================================================

  if (!file.type.startsWith("image/")) {
    showReenModal(
      "Invalid Image",
      "Please choose a JPG, JPEG, PNG, WEBP or other valid image file.",
      "error",
    );

    event.target.value = "";

    return;
  }

  // ========================================================
  // CHECK FILE SIZE
  // ========================================================

  // Maximum original file size: 10 MB

  if (file.size > 10 * 1024 * 1024) {
    showReenModal(
      "Image Too Large",
      "Please choose an image smaller than 10 MB.",
      "warning",
    );

    event.target.value = "";

    return;
  }

  // ========================================================
  // READ IMAGE
  // ========================================================

  const reader = new FileReader();

  reader.onload = function (e) {
    const image = new Image();

    image.onload = function () {
      // ====================================================
      // RESIZE IMAGE
      // ====================================================

      const maxSize = 600;

      let width = image.width;

      let height = image.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round(height * (maxSize / width));

          width = maxSize;
        } else {
          width = Math.round(width * (maxSize / height));

          height = maxSize;
        }
      }

      // ====================================================
      // CREATE CANVAS
      // ====================================================

      const canvas = document.createElement("canvas");

      canvas.width = width;

      canvas.height = height;

      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0, width, height);

      // ====================================================
      // COMPRESS IMAGE
      // ====================================================

      const compressedImage = canvas.toDataURL("image/jpeg", 0.82);

      // ====================================================
      // SAVE PROFILE IMAGE
      // ====================================================

      let profile = {};

      try {
        profile = JSON.parse(localStorage.getItem("reenBankProfile")) || {};
      } catch (error) {
        profile = {};
      }

      profile.profileImage = compressedImage;

      localStorage.setItem("reenBankProfile", JSON.stringify(profile));

      // ====================================================
      // SHOW IMMEDIATELY ON PROFILE PAGE
      // ====================================================

      const profilePreview = document.getElementById("profilePreview");

      if (profilePreview) {
        profilePreview.src = compressedImage;
      }

      // ====================================================
      // SHOW IMMEDIATELY IN HEADER
      // ====================================================

      const headerImage = document.getElementById("headerProfileImage");

      if (headerImage) {
        headerImage.src = compressedImage;
      }

      // ====================================================
      // UPDATE ALL PROFILE IMAGES ON PAGE
      // ====================================================

      updateAllProfileImages(compressedImage);

      // ====================================================
      // SUCCESS MESSAGE
      // ====================================================

      if (typeof showSuccessMessage === "function") {
        showSuccessMessage("Profile picture updated successfully.");
      }
    };

    image.onerror = function () {
      showReenModal(
        "Image Error",
        "We couldn't load that image. Please choose another image.",
        "error",
      );
    };

    image.src = e.target.result;
  };

  reader.onerror = function () {
    showReenModal(
      "Upload Failed",
      "We couldn't read the selected image. Please try again.",
      "error",
    );
  };

  reader.readAsDataURL(file);
}
// ============================================================
// RESET PROFILE
// ============================================================

function resetProfileForm() {
  loadProfilePage();

  showSuccessMessage(
    "Profile Reset",
    "Your saved profile information has been loaded again.",
  );
}

// ============================================================
// ACCOUNT NUMBER
// ============================================================

function generateAccountNumber() {
  const existing = localStorage.getItem("reenAccountNumber");

  if (existing) {
    return existing;
  }

  const number = "10" + Math.floor(10000000 + Math.random() * 90000000);

  localStorage.setItem("reenAccountNumber", number);

  bankData.user.accountNumber = number;

  saveBankData();

  return number;
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

function changePassword() {
  const currentInput = document.getElementById("currentPassword");

  const newInput = document.getElementById("newPassword");

  if (!currentInput || !newInput) {
    return;
  }

  const currentPassword = currentInput.value;

  const newPassword = newInput.value;

  if (!currentPassword || !newPassword) {
    alert("Please fill in both password fields.");

    return;
  }

  if (newPassword.length < 6) {
    alert("Your new password must be at least 6 characters.");

    return;
  }

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("reenBankUser"));
  } catch (error) {
    user = null;
  }

  if (!user) {
    alert("User account could not be found.");

    return;
  }

  if (user.password && currentPassword !== user.password) {
    alert("Your current password is incorrect.");

    return;
  }

  user.password = newPassword;

  localStorage.setItem("reenBankUser", JSON.stringify(user));

  currentInput.value = "";

  newInput.value = "";

  addNotification(
    "Password Changed",
    "Your password was changed successfully.",
    "success",
  );

  showSuccessMessage(
    "Password Changed",
    "Your password has been changed successfully.",
  );
}

// ============================================================
// SUCCESS POPUP
// BIG BEAUTIFUL VERSION
// ============================================================

function showSuccessMessage(
  title = "Success!",
  message = "Your task was completed successfully.",
) {
  const old = document.getElementById("reenSuccessModal");

  if (old) {
    old.remove();
  }

  const modal = document.createElement("div");

  modal.id = "reenSuccessModal";

  modal.className = `
    fixed
    inset-0
    z-[99999]
    flex
    items-center
    justify-center
    p-5
    bg-black/50
    backdrop-blur-md
  `;

  modal.innerHTML = `

    <style>

      @keyframes reenModalIn {

        0% {
          opacity: 0;
          transform: scale(.65) translateY(30px);
        }

        70% {
          transform: scale(1.03) translateY(0);
        }

        100% {
          opacity: 1;
          transform: scale(1);
        }

      }


      @keyframes reenCheck {

        0% {
          stroke-dashoffset: 100;
        }

        100% {
          stroke-dashoffset: 0;
        }

      }


      @keyframes reenRing {

        0% {
          transform: scale(.8);
          opacity: .8;
        }

        100% {
          transform: scale(1.5);
          opacity: 0;
        }

      }


      @keyframes reenGlow {

        0%, 100% {
          box-shadow:
            0 0 0 0
            rgba(45,184,137,.25);
        }

        50% {
          box-shadow:
            0 0 0 18px
            rgba(45,184,137,0);
        }

      }


      @keyframes reenStar {

        0% {
          opacity: 0;
          transform: scale(.3);
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: 0;
          transform: scale(1.4);
        }

      }


      .reen-success-card {

        animation:
          reenModalIn
          .55s
          cubic-bezier(.2,.8,.2,1)
          forwards;

      }


      .reen-success-icon {

        animation:
          reenGlow
          2s
          ease-in-out
          infinite;

      }


      .reen-success-ring {

        animation:
          reenRing
          1.5s
          ease-out
          infinite;

      }


      .reen-success-check {

        stroke-dasharray: 100;
        stroke-dashoffset: 100;

        animation:
          reenCheck
          .7s
          ease-out
          .35s
          forwards;

      }


      .reen-success-star {

        animation:
          reenStar
          1.4s
          ease-out
          infinite;

      }

    </style>


    <div
      class="
        reen-success-card
        relative
        w-full
        max-w-[440px]
        overflow-hidden
        rounded-[32px]
        bg-white
        p-8
        sm:p-10
        text-center
        shadow-[0_30px_100px_rgba(0,0,0,.25)]
      "
    >

      <!-- DECORATION -->

      <div
        class="
          absolute
          -top-24
          -right-24
          w-48
          h-48
          rounded-full
          bg-[#2db889]/10
        "
      ></div>


      <div
        class="
          absolute
          -bottom-24
          -left-24
          w-48
          h-48
          rounded-full
          bg-[#2db889]/10
        "
      ></div>


      <!-- SMALL STARS -->

      <div
        class="
          reen-success-star
          absolute
          top-16
          left-12
          text-[#2db889]
          text-xl
        "
      >
        ✦
      </div>


      <div
        class="
          reen-success-star
          absolute
          top-28
          right-12
          text-[#2db889]
          text-sm
        "
      >
        ✦
      </div>


      <!-- ICON -->

      <div
        class="
          relative
          w-32
          h-32
          mx-auto
          mb-7
        "
      >

        <div
          class="
            reen-success-ring
            absolute
            inset-0
            rounded-full
            border-4
            border-[#2db889]/20
          "
        ></div>


        <div
          class="
            reen-success-icon
            relative
            w-32
            h-32
            rounded-full
            bg-[#e9f9f3]
            flex
            items-center
            justify-center
          "
        >

          <div
            class="
              w-24
              h-24
              rounded-full
              bg-[#2db889]
              flex
              items-center
              justify-center
            "
          >

            <svg
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
            >

              <circle
                cx="31"
                cy="31"
                r="29"
                stroke="white"
                stroke-width="2"
                opacity=".3"
              />

              <path
                class="reen-success-check"
                d="M17 32L27 42L46 21"
                stroke="white"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />

            </svg>

          </div>

        </div>

      </div>


      <!-- BRAND -->

      <p
        class="
          text-[#2db889]
          text-xs
          font-extrabold
          tracking-[.28em]
          mb-3
        "
      >
        REEN BANK
      </p>


      <!-- TITLE -->

      <h2
        class="
          text-3xl
          sm:text-4xl
          font-extrabold
          text-[#202020]
          mb-3
        "
      >
        ${title}
      </h2>


      <!-- MESSAGE -->

      <p
        class="
          text-gray-500
          text-sm
          sm:text-base
          leading-7
          max-w-sm
          mx-auto
          mb-8
        "
      >
        ${message}
      </p>


      <!-- DONE BUTTON -->

      <button
        type="button"
        onclick="closeSuccessMessage()"
        class="
          w-full
          bg-[#2db889]
          text-white
          py-4
          rounded-2xl
          font-bold
          text-base
          shadow-lg
          shadow-[#2db889]/20
          hover:bg-[#239c73]
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-200
        "
      >
        Done
      </button>


      <p
        class="
          text-[11px]
          text-gray-400
          mt-5
        "
      >
        Your Reen Bank activity has been saved.
      </p>

    </div>

  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    closeSuccessMessage();
  }, 5000);
}

// ==========================================================
// UPDATE ALL PROFILE IMAGES
// ==========================================================

function updateAllProfileImages(image) {
  if (!image) {
    return;
  }

  const profileImages = document.querySelectorAll(
    "#profilePreview, #headerProfileImage, .reen-profile-image",
  );

  profileImages.forEach(function (img) {
    img.src = image;
  });
}

// ==========================================================
// LOAD SAVED PROFILE IMAGE
// ==========================================================

function loadSavedProfileImage() {
  let profile = {};

  try {
    profile = JSON.parse(localStorage.getItem("reenBankProfile")) || {};
  } catch (error) {
    console.error("Could not load saved profile:", error);

    return;
  }

  const savedImage = profile.profileImage;

  // No custom image yet
  if (!savedImage) {
    return;
  }

  // ========================================================
  // PROFILE PAGE IMAGE
  // ========================================================

  const profilePreview = document.getElementById("profilePreview");

  if (profilePreview) {
    profilePreview.src = savedImage;
  }

  // ========================================================
  // HEADER IMAGE
  // ========================================================

  const headerProfileImage = document.getElementById("headerProfileImage");

  if (headerProfileImage) {
    headerProfileImage.src = savedImage;
  }

  // ========================================================
  // ANY OTHER PROFILE IMAGES
  // ========================================================

  updateAllProfileImages(savedImage);
}

// ============================================================
// CLOSE SUCCESS POPUP
// ============================================================

function closeSuccessMessage() {
  const modal = document.getElementById("reenSuccessModal");

  if (!modal) return;

  modal.style.opacity = "0";

  modal.style.transition = "opacity .2s ease";

  setTimeout(() => {
    if (modal) {
      modal.remove();
    }
  }, 200);
}

// ==========================================================
// UPDATE DASHBOARD STATISTICS
// ==========================================================

function updateDashboardStatistics() {
  const incomeElement = document.getElementById("incomeStatistic");

  const expenseElement = document.getElementById("expenseStatistic");

  const incomeBar = document.getElementById("incomeBar");

  const expenseBar = document.getElementById("expenseBar");

  // If the Statistics section is not on this page
  if (!incomeElement || !expenseElement || !incomeBar || !expenseBar) {
    return;
  }

  // Make sure transactions exist
  const transactions = Array.isArray(bankData.transactions)
    ? bankData.transactions
    : [];

  // ========================================================
  // INCOME
  // ========================================================

  const income = transactions
    .filter(function (transaction) {
      return transaction.type === "Deposit";
    })
    .reduce(function (total, transaction) {
      return total + Number(transaction.amount || 0);
    }, 0);

  // ========================================================
  // EXPENSE
  // ========================================================

  const expense = transactions
    .filter(function (transaction) {
      return transaction.type === "Withdrawal";
    })
    .reduce(function (total, transaction) {
      return total + Number(transaction.amount || 0);
    }, 0);

  // ========================================================
  // DISPLAY MONEY
  // ========================================================

  incomeElement.textContent = formatMoney(income);

  expenseElement.textContent = formatMoney(expense);

  // ========================================================
  // CALCULATE BAR WIDTHS
  // ========================================================

  const largestAmount = Math.max(income, expense, 1);

  let incomePercentage = (income / largestAmount) * 100;

  let expensePercentage = (expense / largestAmount) * 100;

  // Keep bars between 0 and 100
  incomePercentage = Math.min(Math.max(incomePercentage, 0), 100);

  expensePercentage = Math.min(Math.max(expensePercentage, 0), 100);

  // ========================================================
  // ANIMATE BARS
  // ========================================================

  incomeBar.style.width = `${incomePercentage}%`;

  expenseBar.style.width = `${expensePercentage}%`;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

function addNotification(title, message, type = "success") {
  if (!Array.isArray(bankData.notifications)) {
    bankData.notifications = [];
  }

  bankData.notifications.push({
    id: Date.now(),

    title: title,

    message: message,

    type: type,

    date: getCurrentDate(),

    read: false,
  });

  // Keep last 50 notifications

  if (bankData.notifications.length > 50) {
    bankData.notifications = bankData.notifications.slice(-50);
  }

  saveBankData();

  renderNotifications();
}

// ============================================================
// NOTIFICATION ICON
// ============================================================

function setupNotificationSystem() {
  const buttons = document.querySelectorAll(
    `
        #notificationButton,
        #notificationIcon,
        #notificationsButton,
        #notificationBell,
        [data-notification-button],
        img[src*="notification"]
      `,
  );

  buttons.forEach((element) => {
    const button = element.closest("button") || element;

    if (button.dataset.reenNotificationReady) {
      return;
    }

    button.dataset.reenNotificationReady = "true";

    button.addEventListener("click", function (event) {
      event.preventDefault();

      event.stopPropagation();

      toggleNotificationPanel();
    });

    addNotificationBadge(button);
  });

  // If the page does not have a notification icon,
  // create one so the system still works.

  if (buttons.length === 0) {
    createAutomaticNotificationButton();
  }

  renderNotifications();
}

// ============================================================
// AUTOMATIC NOTIFICATION BUTTON
// ============================================================

function createAutomaticNotificationButton() {
  if (document.getElementById("reenAutoNotificationButton")) {
    return;
  }

  const button = document.createElement("button");

  button.id = "reenAutoNotificationButton";

  button.className = `
    fixed
    top-5
    right-5
    z-[9000]
    w-12
    h-12
    rounded-full
    bg-white
    shadow-lg
    border
    border-gray-100
    flex
    items-center
    justify-center
    hover:scale-105
    transition
  `;

  button.innerHTML = `
    <span class="text-xl">
      🔔
    </span>
  `;

  button.onclick = function () {
    toggleNotificationPanel();
  };

  document.body.appendChild(button);

  addNotificationBadge(button);
}

// ============================================================
// ADD NOTIFICATION BADGE
// ============================================================

function addNotificationBadge(button) {
  if (!button) return;

  if (button.querySelector(".reen-notification-badge")) {
    return;
  }

  const badge = document.createElement("span");

  badge.className = `
    reen-notification-badge
    absolute
    -top-1
    -right-1
    min-w-[18px]
    h-[18px]
    px-1
    rounded-full
    bg-red-500
    text-white
    text-[10px]
    font-bold
    flex
    items-center
    justify-center
    border-2
    border-white
  `;

  badge.style.display = "none";

  button.style.position = "relative";

  button.appendChild(badge);
}

// ============================================================
// RENDER NOTIFICATION BADGES
// ============================================================

function renderNotificationBadges() {
  const unread = bankData.notifications.filter(
    (notification) => !notification.read,
  ).length;

  document.querySelectorAll(".reen-notification-badge").forEach((badge) => {
    if (unread > 0) {
      badge.style.display = "flex";

      badge.textContent = unread > 99 ? "99+" : unread;
    } else {
      badge.style.display = "none";
    }
  });
}

// ============================================================
// NOTIFICATION PANEL
// ============================================================

function createNotificationPanel() {
  if (document.getElementById("reenNotificationPanel")) {
    return;
  }

  const panel = document.createElement("div");

  panel.id = "reenNotificationPanel";

  panel.className = `
    fixed
    top-20
    right-5
    z-[8999]
    w-[360px]
    max-w-[calc(100vw-32px)]
    bg-white
    rounded-2xl
    shadow-2xl
    border
    border-gray-100
    overflow-hidden
    hidden
  `;

  panel.innerHTML = `

    <div
      class="
        px-5
        py-4
        border-b
        border-gray-100
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h3
          class="
            font-bold
            text-lg
          "
        >
          Notifications
        </h3>

        <p
          id="notificationUnreadText"
          class="
            text-xs
            text-gray-400
            mt-1
          "
        >
          No new notifications
        </p>

      </div>


      <button
        type="button"
        onclick="markAllNotificationsRead()"
        class="
          text-xs
          font-semibold
          text-[#2db889]
          hover:underline
        "
      >
        Mark all read
      </button>

    </div>


    <div
      id="notificationList"
      class="
        max-h-[420px]
        overflow-y-auto
      "
    ></div>

  `;

  document.body.appendChild(panel);
}

// ============================================================
// RENDER NOTIFICATIONS
// ============================================================

function renderNotifications() {
  createNotificationPanel();

  const list = document.getElementById("notificationList");

  const unreadText = document.getElementById("notificationUnreadText");

  if (!list) return;

  list.innerHTML = "";

  const notifications = [...(bankData.notifications || [])].reverse();

  const unread = notifications.filter((item) => !item.read).length;

  if (unreadText) {
    unreadText.textContent =
      unread > 0
        ? `${unread} unread notification${unread === 1 ? "" : "s"}`
        : "No new notifications";
  }

  if (notifications.length === 0) {
    list.innerHTML = `

      <div
        class="
          py-12
          px-6
          text-center
        "
      >

        <div
          class="
            w-14
            h-14
            rounded-full
            bg-[#e9f9f3]
            mx-auto
            flex
            items-center
            justify-center
            mb-4
          "
        >

          <span class="text-2xl">
            🔔
          </span>

        </div>


        <p
          class="
            font-semibold
            text-gray-600
          "
        >
          No notifications
        </p>


        <p
          class="
            text-xs
            text-gray-400
            mt-1
          "
        >
          Your Reen Bank activity will appear here.
        </p>

      </div>

    `;

    renderNotificationBadges();

    return;
  }

  notifications.forEach((notification) => {
    const item = document.createElement("div");

    let icon = "✓";

    let iconClass = "bg-[#e9f9f3] text-[#2db889]";

    if (notification.type === "warning") {
      icon = "!";

      iconClass = "bg-orange-50 text-orange-500";
    }

    if (notification.type === "danger") {
      icon = "!";

      iconClass = "bg-red-50 text-red-500";
    }

    item.className = `
        px-5
        py-4
        border-b
        border-gray-100
        last:border-none
        ${notification.read ? "bg-white" : "bg-[#f5fcf9]"}
        hover:bg-gray-50
        cursor-pointer
        transition
      `;

    item.innerHTML = `

        <div
          class="
            flex
            gap-3
          "
        >

          <div
            class="
              w-9
              h-9
              rounded-full
              shrink-0
              flex
              items-center
              justify-center
              font-bold
              ${iconClass}
            "
          >
            ${icon}
          </div>


          <div
            class="min-w-0 flex-1"
          >

            <div
              class="
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <p
                class="
                  text-sm
                  font-bold
                  text-gray-800
                "
              >
                ${notification.title}
              </p>


              ${
                !notification.read
                  ? `
                    <span
                      class="
                        w-2
                        h-2
                        rounded-full
                        bg-[#2db889]
                        shrink-0
                      "
                    ></span>
                  `
                  : ""
              }

            </div>


            <p
              class="
                text-xs
                text-gray-500
                mt-1
                leading-5
              "
            >
              ${notification.message}
            </p>


            <p
              class="
                text-[10px]
                text-gray-400
                mt-2
              "
            >
              ${notification.date || ""}
            </p>

          </div>

        </div>

      `;

    item.addEventListener("click", function () {
      notification.read = true;

      saveBankData();

      renderNotifications();
    });

    list.appendChild(item);
  });

  renderNotificationBadges();
}

// ============================================================
// TOGGLE NOTIFICATION PANEL
// ============================================================

function toggleNotificationPanel() {
  createNotificationPanel();

  const panel = document.getElementById("reenNotificationPanel");

  if (!panel) return;

  panel.classList.toggle("hidden");

  renderNotifications();
}

// ============================================================
// MARK ALL NOTIFICATIONS READ
// ============================================================

function markAllNotificationsRead() {
  bankData.notifications.forEach((notification) => {
    notification.read = true;
  });

  saveBankData();

  renderNotifications();
}

// ============================================================
// CLOSE NOTIFICATION PANEL
// ============================================================

document.addEventListener("click", function (event) {
  const panel = document.getElementById("reenNotificationPanel");

  if (!panel) return;

  const clickedInsidePanel = panel.contains(event.target);

  const clickedNotification = event.target.closest(
    "#notificationButton, #notificationIcon, #notificationsButton, #notificationBell, [data-notification-button]",
  );

  if (!clickedInsidePanel && !clickedNotification) {
    panel.classList.add("hidden");
  }
});

// ==========================================
// BEAUTIFUL LOGOUT MODAL
// ==========================================

function logoutUser() {
  // Remove an existing logout modal if there is one
  const oldModal = document.getElementById("reenLogoutModal");

  if (oldModal) {
    oldModal.remove();
  }

  // Create modal
  const modal = document.createElement("div");

  modal.id = "reenLogoutModal";

  modal.className =
    "fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5";

  modal.innerHTML = `
    
    <div
      class="bg-white w-full max-w-[420px] rounded-3xl p-8 text-center shadow-2xl"
      style="animation: reenLogoutPop 0.3s ease-out;"
    >

      <!-- LOGOUT ICON -->
      <div
        class="mx-auto w-20 h-20 rounded-full bg-[#e9f9f3] flex items-center justify-center"
      >

        <div
          class="w-14 h-14 rounded-full bg-[#d9f7ec] flex items-center justify-center"
        >

          <span
            class="text-[#2db889] text-3xl font-bold"
          >
            <img
                  src="arrow-right-from-bracket-solid.png"
                  alt="Change photo"
                  class="w-11 h-15 object-contain"
                />
          </span>

        </div>

      </div>


      <!-- REEN BANK -->
      <p
        class="text-[#2db889] text-[10px] font-bold tracking-[0.25em] mt-5"
      >
        REEN BANK
      </p>


      <!-- TITLE -->
      <h2
        class="text-2xl font-bold text-gray-800 mt-2"
      >
        Are you sure you want to logout?
      </h2>


      <!-- MESSAGE -->
      <p
        class="text-sm text-gray-500 leading-6 mt-3"
      >
        You will be signed out of your Reen Bank account.
        You can log in again anytime.
      </p>


      <!-- BUTTONS -->
      <div class="flex gap-3 mt-7">

        <!-- CANCEL -->
        <button
          type="button"
          id="cancelReenLogout"
          class="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all duration-200"
        >
          Cancel
        </button>


        <!-- LOGOUT -->
        <button
          type="button"
          id="confirmReenLogout"
          class="flex-1 py-3.5 rounded-xl bg-[#2db889] hover:bg-[#27a97d] text-white font-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Logout
        </button>

      </div>

    </div>
  `;

  // Add modal to page
  document.body.appendChild(modal);

  // ==========================================
  // MODAL ANIMATION
  // ==========================================

  if (!document.getElementById("reenLogoutAnimation")) {
    const style = document.createElement("style");

    style.id = "reenLogoutAnimation";

    style.textContent = `

      @keyframes reenLogoutPop {

        0% {
          opacity: 0;
          transform: scale(0.85) translateY(25px);
        }

        60% {
          opacity: 1;
          transform: scale(1.03) translateY(0);
        }

        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

      }

    `;

    document.head.appendChild(style);
  }

  // ==========================================
  // CANCEL BUTTON
  // ==========================================

  const cancelButton = document.getElementById("cancelReenLogout");

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      modal.remove();
    });
  }

  // ==========================================
  // CONFIRM LOGOUT BUTTON
  // ==========================================

  const confirmButton = document.getElementById("confirmReenLogout");

  if (confirmButton) {
    confirmButton.addEventListener("click", function () {
      // Mark user as logged out
      localStorage.removeItem("reenLoggedIn");

      // Remove modal
      modal.remove();

      // Go to login page
      window.location.href = "login page.html";
    });
  }

  // ==========================================
  // CLICK OUTSIDE MODAL = CLOSE
  // ==========================================

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

// ============================================================
// GO TO PROFILE
// ============================================================

function goToProfile() {
  window.location.href = "./Profile.html";
}

// ============================================================
// UPGRADE
// ============================================================

// ==========================================================
// UPGRADE TO PRO
// ==========================================================

function upgradeToPro() {
  if (typeof showReenModal === "function") {
    showReenModal(
      "Upgrade to PRO",
      "PRO features are coming soon. You'll be able to sign in on more than one device.",
      "success",
      "Okay",
    );
  } else {
    console.log("Upgrade to PRO clicked");
  }
}

// ======================================================
// SEARCH
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();

    // TRANSACTION PAGE
    const rows = document.querySelectorAll(".transaction-row");

    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();

      if (text.includes(searchText)) {
        row.style.display = "grid";
      } else {
        row.style.display = "none";
      }
    });

    // ACCOUNT CARDS
    const cards = document.querySelectorAll(".transaction-account-card");

    cards.forEach(function (card) {
      const text = card.textContent.toLowerCase();

      if (text.includes(searchText)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ================================
// GENERATE ACCOUNT NUMBER
// ================================

function generateAccountNumber() {
  // Generate a 10-digit account number
  return "10" + Math.floor(10000000 + Math.random() * 90000000);
}

// ================================
// GET OR CREATE ACCOUNT NUMBER
// ================================

function getAccountNumber() {
  let accountNumber = localStorage.getItem("reenAccountNumber");

  // If the user does not have an account number yet
  if (!accountNumber) {
    accountNumber = generateAccountNumber();

    localStorage.setItem("reenAccountNumber", accountNumber);
  }

  return accountNumber;
}

// ================================
// DISPLAY HEADER USER INFORMATION
// ================================

function loadHeaderUserInformation() {
  const userNameElement = document.getElementById("headerUserName");

  const accountNumberElement = document.getElementById("profileAccountNumber");

  // Get saved user information
  let user = null;

  try {
    const savedUser = localStorage.getItem("reenBankUser");

    if (savedUser) {
      user = JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Could not load user information:", error);
  }

  // Also check bankData
  if (!user && typeof bankData !== "undefined") {
    user = bankData.user;
  }

  // ================================
  // USER NAME
  // ================================

  if (userNameElement) {
    const name = user?.name || bankData?.user?.name || "User";

    userNameElement.textContent = name;
  }

  // ================================
  // ACCOUNT NUMBER
  // ================================

  if (accountNumberElement) {
    const accountNumber = getAccountNumber();

    accountNumberElement.textContent = accountNumber;
  }
}

// ============================================================
// REFRESH ALL PAGES
// ============================================================

function refreshAllPages() {
  // DASHBOARD

  renderDashboardAccounts();

  renderDashboardTransactions();

  renderRecentTransactions();

  updateDashboardNumbers();

  // ACCOUNTS

  renderAccountsPage();

  updateAccountsSummary();

  renderAccountsTransactions();

  // TRANSACTIONS

  renderTransactionAccounts();

  renderTransactionsPage();

  // PROFILE

  applyProfileImage();

  loadUserInformation();

  // NOTIFICATIONS

  renderNotifications();

  renderNotificationBadges();

  updateDashboardStatistics();
}

// ============================================================
// DOM LOADED
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  // Load saved bank information

  loadBankData();

  // Load saved user information

  loadUserInformation();
  loadHeaderUserInformation();

  // Profile page

  if (
    document.getElementById("profileName") ||
    document.getElementById("profileEmail") ||
    document.getElementById("profilePreview")
  ) {
    loadProfilePage();
  }

  // Render everything

  refreshAllPages();

  // Notification system

  setupNotificationSystem();

  // Apply saved profile picture

  applyProfileImage();
  loadSavedProfileImage();
});
