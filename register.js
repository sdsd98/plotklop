// register.js - Node.js version for saving data to user_data.txt

const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("📝 Register New User");

rl.question("Username: ", (username) => {
    rl.question("Email: ", (email) => {
        rl.question("Password: ", async (password) => {
            if (!username || !email || !password) {
                console.log("⚠️ All fields are required!");
                rl.close();
                return;
            }

            if (!validateEmail(email)) {
                console.log("⚠️ Invalid email format!");
                rl.close();
                return;
            }

            const hashedPassword = hashPassword(password);  // Hash the password
            const userData = `${username}, ${email}, ${hashedPassword}\n`;

            fs.appendFile('user_data.txt', userData, (err) => {
                if (err) {
                    console.log("❌ Error saving data!");
                } else {
                    console.log("✅ Registration successful! Data saved to user_data.txt.");
                }
                rl.close();
            });
        });
    });
});

// Function to hash the password using SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Function to validate email format
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
