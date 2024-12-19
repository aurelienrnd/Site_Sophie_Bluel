export function navigation(){
    const projets = document.getElementById("nav-projets")
    projets.addEventListener("click", () => {
        window.location.href = "index.html"
    })

    const login = document.getElementById("nav-login")
    login.addEventListener("click", () => {
        window.location.href = "login.html"
    })
}
