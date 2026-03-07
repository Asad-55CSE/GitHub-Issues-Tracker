var ADMIN_USERNAME = "admin";
var ADMIN_PASSWORD = "admin123";

function handleLogin() {
    var username = document.getElementById("username-input").value.trim();
    var password = document.getElementById("password-input").value.trim();
    var errorMsg = document.getElementById("error-msg");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        
        localStorage.setItem("isLoggedIn", "true");
        
        window.location.href = "main.html";
    } else {
        errorMsg.classList.remove("hidden");
    }
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        handleLogin();
    }
});
