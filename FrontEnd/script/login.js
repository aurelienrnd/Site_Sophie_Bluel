import {navigation} from "./index.js"

let user = 0 // user a une valeur de zero (fals) quand personne n'est connecter
let loginId


/** Récupère les valeurs email et password du formulaire et teste le format de l'email avec une regex.
 * @function
 * @emailRegex : Crée une expression régulière qui permet de tester l'email
 * @loginId : Reçoit un objet {email, password}
 */
function caughtId(){
    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    const emailRegx = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z]+\.[a-zA-Z]+$/)
    if(!emailRegx.test(email)){
        alert("email non valide")
    } else {
        loginId = {email, password}
    }
}

/** Envoie les identifiants de connexion via une requête API et reçoit un id et un token utilisateur.
 * @async
 * @function
 * @returns {Promise<Object<{userId, token}>>} Un id et un token unique.
 * @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 * @loginId : Un objet {email, password}
 * @user : Reçoit un objet {userId, token}
 */
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
        window.location.href = "index.html"
        
    } catch (error){
        if(error.message === "Erreur:401"){
            alert("L'email et le mot de passe ne corespondent pas")
        }
        console.error("Connection echouer", error.message)
    }
}

/** Exécute un ensemble de fonctions au clic sur le bouton submit.
 * @async
 * @function
 */
function eventButton(){
    const form = document.getElementById("login-form")
    form.addEventListener("submit", async(event) => {
        event.preventDefault()
        caughtId()
        await postId()
        console.log(user)
    })
}

// execution
navigation()
eventButton()