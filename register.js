document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const registerMessage = document.getElementById("registerMessage");

   
    if (!username || !email || !password) {
        registerMessage.textContent = "Všechna pole jsou povinná!";
        registerMessage.style.color = "red";
        return;
    }

   
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    let userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        registerMessage.textContent = "Uživatelské jméno nebo e-mail už existuje!";
        registerMessage.style.color = "red";
        return;
    }

   
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Registrace úspěšná! Můžete se přihlásit.";
    registerMessage.style.color = "green";

    
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});
