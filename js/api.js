const BASE_URL = "https://quiz-app-backend-tzoh.onrender.com";

// Helper function
async function apiRequest(url, method = "GET", body = null) {
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL + url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: "Bearer " + token })
        },
        body: body ? JSON.stringify(body) : null
    });

    return res.json();
}