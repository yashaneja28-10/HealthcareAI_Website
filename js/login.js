document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const userInput = document.getElementById("emailPhone").value;
    const password = document.getElementById("password").value;

    if (userInput && password) {
        localStorage.setItem("user", userInput); // Store user login
        window.location.href = "index.html"; // Redirect to homepage
    } else {
        alert("Please enter valid details");
    }
});
