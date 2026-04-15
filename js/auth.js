async function register() {
    const data = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        prn: document.getElementById("prn").value,
        contact: document.getElementById("contact").value,
        password: document.getElementById("password").value
    };

    const res = await apiRequest("/auth/register", "POST", data);
    alert(res.message);
    window.location.href = "login.html";
}

async function login() {
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res = await apiRequest("/auth/login", "POST", data);

    if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        window.location.href = "dashboard.html";
    } else {
        alert(res.message);
    }
}