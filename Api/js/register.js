const API_REGISTER = "http://localhost:8080/auth/register";

document.getElementById("registerForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(API_REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error al registrar");
            return;
        }

        alert("Usuario creado correctamente");

        window.location.href = "/login";

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});