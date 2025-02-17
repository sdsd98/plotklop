// login.js - Node.js script to log in by reading user_data.txt

const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

// Set up readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("🔐 Welcome! Please log in.");

rl.question("Username: ", (username) => {
    rl.question("Password: ", async (password) => {
        if (!username || !password) {
            console.log("⚠️ Username and password are required!");
            rl.close();
            return;
        }

        fs.readFile('user_data.txt', 'utf8', async (err, data) => {
            if (err) {
                console.log("❌ Error loading user data!");
                rl.close();
                return;
            }

            const users = data.split('\n').filter(line => line).map(line => {
                const [storedUsername, storedEmail, storedPassword] = line.split(', ');
                return { username: storedUsername, email: storedEmail, password: storedPassword };
            });

            const validUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());

            if (!validUser) {
                console.log("❌ Invalid username or password!");
                rl.close();
                return;
            }

            const hashedPassword = hashPassword(password);

            if (hashedPassword === validUser.password) {
                console.log("✅ Login successful!");
            } else {
                console.log("❌ Invalid username or password!");
            }
            rl.close();
        });
    });
});

// Hash password for comparison
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
