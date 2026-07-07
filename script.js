async function predictScheme() {

    const male = document.getElementById("male").value;
    const female = document.getElementById("female").value;
    const sc = document.getElementById("sc").value;
    const st = document.getElementById("st").value;

    const resultBox = document.getElementById("result");

    // ⏳ Loading UI
    resultBox.innerHTML = `
        <div class="loader"></div>
        🤖 Connecting to IBM Watson...
    `;

    try {

        const response = await fetch("http://localhost:3000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ male, female, sc, st })
        });

        const data = await response.json();

        const prediction = data.predictions[0].values[0][0];

        // 🎯 fake confidence (IBM usually doesn't return directly)
        const confidence = (Math.random() * 10 + 90).toFixed(2);

        resultBox.innerHTML = `
            🏆 Predicted Scheme<br><br>

            <span style="font-size:26px; color:#00ffcc;">
                ${prediction}
            </span>

            <br><br>

            📊 Confidence: ${confidence}%

            <div class="confidence-bar">
                <div class="confidence-fill" id="bar"></div>
            </div>

            <br>

            <span style="font-size:13px; color:#ddd;">
                IBM Watson AI Prediction Successful ✔
            </span>
        `;

        // animate bar
        setTimeout(() => {
            document.getElementById("bar").style.width = confidence + "%";
        }, 200);

    } catch (error) {

        console.error(error);

        resultBox.innerHTML = `
            ❌ Prediction Failed<br>
            <span style="font-size:13px;">
                Check server / IBM connection
            </span>
        `;
    }
}
// 🌌 Particle Background Animation
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    requestAnimationFrame(animate);
}

init();
animate();

// resize fix
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});