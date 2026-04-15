function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
    }
}

function checkAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        alert("Admin access only!");
        window.location.href = "dashboard.html";
    }
}