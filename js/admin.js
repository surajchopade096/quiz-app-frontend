function showSection(section) {
    document.getElementById("addSection").style.display = "none";
    document.getElementById("listSection").style.display = "none";
    document.getElementById("resultsSection").style.display = "none";

    if (section === "add") {
        document.getElementById("addSection").style.display = "block";
    } else if (section === "list") {
        document.getElementById("listSection").style.display = "block";
        loadQuestions();
    } else {
        document.getElementById("resultsSection").style.display = "block";
        loadResults();
    }
}

// ADD QUESTION
async function addQuestion() {
    const data = {
        question: document.getElementById("question").value,
        options: [
            document.getElementById("opt1").value,
            document.getElementById("opt2").value,
            document.getElementById("opt3").value,
            document.getElementById("opt4").value
        ],
        correctAnswer: Number(document.getElementById("correct").value),
        language: document.getElementById("language").value
    };

    const res = await apiRequest("/admin/question", "POST", data);
    alert("Question Added");
}

// LOAD QUESTIONS
async function loadQuestions() {
    const data = await apiRequest("/admin/questions");

    let html = "";
    data.forEach(q => {
        html += `
            <div style="border:1px solid #ccc; margin:10px; padding:10px;">
                <p>${q.question}</p>
                <button onclick="deleteQuestion('${q._id}')">Delete</button>
            </div>
        `;
    });

    document.getElementById("questionsList").innerHTML = html;
}

// DELETE
async function deleteQuestion(id) {
    await apiRequest(`/admin/question/${id}`, "DELETE");
    loadQuestions();
}

// LOAD RESULTS
async function loadResults() {
    const data = await apiRequest("/admin/results");

    let html = "";
    data.forEach(r => {
        html += `
            <div>
                ${r.user.name} - Score: ${r.score} - Time: ${r.timeTaken}
            </div>
        `;
    });

    document.getElementById("resultsList").innerHTML = html;
}