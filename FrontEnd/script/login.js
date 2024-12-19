let loginId
let user
function coughtId(){
    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    const emailRegx = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z]+\.[a-zA-Z]+$/)
    if(!emailRegx.test(email)){
        alert("email non valide")
    } else {
        loginId = {email, password}
    }
}

async function postId() {
    try{
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(loginId)
        })
        if(!reponse.ok){
            throw new Error("Erreur:" + reponse.status)
        }
        user = await reponse.json()
        
    } catch (error){
        if(error.message === "Erreur:401"){
            alert("L'email et le mot de passe ne corespondent pas")
        }
        console.error("Connection echouer", error.message)
    }
}

export function clickButton(){
    const form = document.getElementById("login-form")
    form.addEventListener("submit", async(event) => {
        event.preventDefault()
        coughtId()
        await postId()
        console.log(user)
    })
}
