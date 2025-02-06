document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    e
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    let validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
        alert("Přihlášení úspěšné!");
        window.location.href = "index.html"; // Redirect  login
    } else {
        errorMessage.textContent = "Špatné uživatelské jméno nebo heslo!";
    }
});

