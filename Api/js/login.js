if (localStorage.getItem("token")) {
    window.location.href = "/";
}
const API_URL = "http://localhost:8080/auth/login";
const API_ME_URL = "http://localhost:8080/auth/me";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error al iniciar sesión");
            return;
        }

       
        localStorage.setItem("token", data.token);

       
        const resUser = await fetch(API_ME_URL, {
            headers: {
                "Authorization": "Bearer " + data.token
            }
        });

        const userData = await resUser.json();

        localStorage.setItem("usuario", JSON.stringify(userData));
        console.log("Usuario almacenado:", userData);

        window.location.href = "/";

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});