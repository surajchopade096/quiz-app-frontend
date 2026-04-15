let timeLeft = 3600; // 60 minutes in seconds
let timerInterval;
let questions = [];
let current = 0;
let answers = [];

// 1. INITIALIZE EVERYTHING
async function initQuiz() {
    // Restore time from storage if it exists
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
        timeLeft = parseInt(savedTime);
    }

    // Restore answers from storage if they exist
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (savedAnswers) {
        answers = savedAnswers;
    }

    await loadQuestions();
    startTimer();
}

// 2. FETCH QUESTIONS
async function loadQuestions() {
    const lang = localStorage.getItem("language");
    try {
        questions = await apiRequest(`/quiz/questions?language=${lang}`);
        showQuestion();
    } catch (error) {
        console.error("Failed to load questions:", error);
        alert("Error loading quiz. Please try again.");
    }
}

// 3. THE TIMER LOGIC
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        document.getElementById("timer").innerText =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // Sync time to local storage
        localStorage.setItem("timeLeft", timeLeft);

        // Warning alerts
        if (timeLeft === 600) alert("⚠️ Only 10 minutes left!");
        if (timeLeft === 300) alert("⏳ Only 5 minutes left!");

        // Auto Submit
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Auto submitting...");
            submitQuiz();
        }
    }, 1000);
}

// 4. DISPLAY QUESTION
function showQuestion() {
    // Safety check: ensure questions are loaded
    if (!questions || questions.length === 0) {
        document.getElementById("question").innerText = "Loading questions...";
        return;
    }

    const q = questions[current];

    // Merged: Displays "Q1: What is..." format
    document.getElementById("question").innerText = `Q${current + 1}: ${q.question}`;

    let optionsHTML = "";
    q.options.forEach((opt, i) => {
        // Logic to keep the radio button 'checked' if navigating back/forth
        const isChecked = answers[current] && answers[current].selected === i ? "checked" : "";
        
        optionsHTML += `
            <div class="option-item" style="margin: 10px 0; display: flex; align-items: center;">
                <input type="radio" name="opt" id="opt${i}" onclick="select(${i})" ${isChecked}>
                <label for="opt${i}" style="margin-left: 10px; cursor: pointer; width: 100%;">
                    ${opt}
                </label>
            </div>
        `;
    });

    document.getElementById("options").innerHTML = optionsHTML;
}

// 5. SELECTION & NAVIGATION
function select(i) {
    answers[current] = {
        questionId: questions[current]._id,
        selected: i
    };
    // Save progress instantly
    localStorage.setItem("answers", JSON.stringify(answers));
}

function next() {
    if (current < questions.length - 1) {
        current++;
        showQuestion();
    }
}

function prev() {
    if (current > 0) {
        current--;
        showQuestion();
    }
}

// 6. SUBMISSION
async function submitQuiz() {
    // 1. Stop the clock immediately
    clearInterval(timerInterval);

    // 2. Calculate actual time used
    const actualTimeTaken = 3600 - timeLeft;

    // 3. Send data to Backend
    const res = await apiRequest("/quiz/submit", "POST", {
        answers: answers.filter(a => a !== null), // Removes skipped questions
        timeTaken: actualTimeTaken, 
        language: localStorage.getItem("language")
    });

    // 4. Cleanup temporary progress
    localStorage.removeItem("answers");
    localStorage.removeItem("timeLeft");

    // 5. Save final score and redirect
    localStorage.setItem("result", JSON.stringify(res));
    window.location.href = "result.html";
}

// GO!
initQuiz();