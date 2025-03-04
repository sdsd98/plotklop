
document.addEventListener("DOMContentLoaded", function () {
    const button = document.createElement("button");
    button.innerText = "🔊 Click to Adjust Volume... Maybe?";
    button.style.fontSize = "20px";
    button.style.padding = "15px";
    button.style.margin = "20px";
    button.style.position = "absolute";
    button.style.left = "50%";
    button.style.top = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.transition = "all 0.5s ease";

    let volume = 50; 
    let clickCount = 0; 

    button.addEventListener("click", function () {
        clickCount++;
        
        // Random effects
        const actions = [
            () => {
                volume = Math.floor(Math.random() * 100);
                alert(`Volume set to ${volume}, but you will NEVER hear a difference.`);
            },
            () => {
                volume += 5;
                alert(`You increased the volume to ${volume}. Wow. Amazing. Nothing changed.`);
            },
            () => {
                volume -= 5;
                alert(`You decreased the volume to ${volume}. Congratulations, you played yourself.`);
            },
            () => {
                button.innerText = ["🔇 Muted", "🔊 MAX", "🎵 Meh", "🤔 Confused", "💥 BOOM", "🔥🔥🔥"][Math.floor(Math.random() * 6)];
            },
            () => {
                document.body.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                alert("Why did the background change? No one knows.");
            },
            () => {
                button.style.left = Math.random() * window.innerWidth + "px";
                button.style.top = Math.random() * window.innerHeight + "px";
                alert("Oops, the button is escaping. Quick, click it!");
            },
            () => {
                window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            },
            () => {
                document.title = `Volume: ${Math.floor(volume)} (but is it real?)`;
            },
            () => {
                document.body.style.fontSize = `${Math.random() * 50 + 10}px`;
                alert("Why is the text huge now? Why did you click this?");
            },
            () => {
                alert(`You've clicked this button ${clickCount} times. Are you OK?`);
            },
            () => {
                const audio = new Audio("https://www.myinstants.com/media/sounds/fart-with-extra-reverb.mp3");
                audio.play();
                alert("Enjoy your new 'volume' settings.");
            },
            () => {
                button.innerText = "🔴 ERROR: VOLUME OVERLOAD!";
                setTimeout(() => { button.innerText = "🔊 Click to Adjust Volume... Maybe?"; }, 3000);
            },
            () => {
                alert("This button is tired. Give it a break.");
                button.disabled = true;
                setTimeout(() => { button.disabled = false; }, 5000);
            },
            () => {
                alert("Would you like to enable premium volume features?");
                setTimeout(() => { alert("Just kidding. There are no features."); }, 2000);
            },
            () => {
                let w = window.open("", "", "width=400,height=200");
                w.document.write("<h1>Congratulations! 🎉</h1><p>You just won... nothing.</p>");
                w.document.write("<button onclick='window.close()'>Close this useless window</button>");
            },
            () => {
                alert("Secret Debug Mode Activated... Just kidding.");
            },
            () => {
                document.body.style.filter = "invert(1)";
                setTimeout(() => { document.body.style.filter = "none"; }, 3000);
                alert("Welcome to dark mode. It will be gone in 3 seconds.");
            },
            () => {
                button.style.fontSize = `${Math.random() * 50 + 10}px`;
                alert("Oops, the button text is now huge!");
            },
            () => {
                let spin = 0;
                let interval = setInterval(() => {
                    spin += 10;
                    button.style.transform = `translate(-50%, -50%) rotate(${spin}deg)`;
                    if (spin >= 360) clearInterval(interval);
                }, 50);
                alert("The volume button is now dizzy.");
            },
            () => {
                button.style.transition = "none";
                button.style.left = `${Math.random() * window.innerWidth}px`;
                button.style.top = `${Math.random() * window.innerHeight}px`;
                setTimeout(() => { button.style.transition = "all 0.5s ease"; }, 500);
                alert("STOP MOVING, BUTTON!");
            },
            () => {
                if (Math.random() > 0.5) {
                    alert("Your speakers are now muted forever. Just kidding.");
                } else {
                    alert("Your speakers are now at 9000% volume. Also kidding.");
                }
            }
        ];

        
        actions[Math.floor(Math.random() * actions.length)]();
    });

    document.body.appendChild(button);
});
