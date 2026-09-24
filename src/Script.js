// =========================
// FAQ FUNCTIONALITY
// =========================

function toggleFAQ(button) {

    // Get the answer below the button
    const answer = button.nextElementSibling;

    // Get the + / - icon
    const icon = button.querySelector(".faq-icon");

    // Show or hide the answer
    answer.classList.toggle("hidden");

    // Change + to - and - back to +
    if (answer.classList.contains("hidden")) {
        icon.textContent = "+";
    } else {
        icon.textContent = "−";
    }
}