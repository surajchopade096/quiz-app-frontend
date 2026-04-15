async function loadLeaderboard() {
    const data = await apiRequest("/leaderboard");

    let html = "";
    data.forEach((u, i) => {
        html += `<p>${i + 1}. ${u.user.name} - ${u.score}</p>`;
    });

    document.getElementById("list").innerHTML = html;
}

loadLeaderboard();