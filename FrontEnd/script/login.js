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

async function connection() {
    try{
        const postId = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(loginId)
        })
        if(!postId.ok){
            throw new Error("Erreur:" + postId.status)
        }
        return await postId.json()
        
    } catch (error){
        console.error("Connection echouer", error.message)
        alert("L'adresse email ou le mots de passe de coresponde pas")
    }
}

export function clickButton(){
    const form = document.getElementById("login-form")
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        coughtId()
        user = connection()
        console.log(user)
    })
}
