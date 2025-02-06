document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    //  localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    let validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
        alert("Přihlášení úspěšné!");

       
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

       
        window.location.href = "index.html";
        console.log("Redirecting to index.html...");
    } else {
        errorMessage.textContent = "Špatné uživatelské jméno nebo heslo!";
        errorMessage.style.color = "red";
    }
});

if (!localStorage.getItem("users")) {
    let defaultUsers = [
        { username: "admin", email: "admin@example.com", password: "1234" }
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
}
