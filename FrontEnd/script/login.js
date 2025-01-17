/** Teste le format de l'email avec une regEx.
 * @returns {bool} true or false si l'email passe le test ou pas de la regEx
 * @param {string} email : mail de l'utilisateur recupere depuis le formulaire
 */
function verifyEmail(email){
    const emailRegx = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z]+\.[a-zA-Z]+$/)
    if(emailRegx.test(email)){
        return true
    } else {
        alert("email non valide")
        return false
    }
}

/** Envoyer les identifiants de connexion via une requête API et reçoit un id et un token utilisateur.
 * @async
 * @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 * @param {Objet} loginId {email, pasword} de l'utilisateur
 */
async function postId(loginId) {
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
        const user = await reponse.json()

        // Enregistrement de la réponse api dans le localstorage
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html"

    } catch (error){
        console.log(error)
        switch(error.message){

            case "Erreur:401":
            alert("Not Authorized")
            break

            case "Erreur:404":
            alert("User not found")
            break

            default :
            alert("Connection échoué")
        }

        console.error("Connection echouer", error.message)
    }
}


/*********************** Execution du script ***********************/

// Recuperation des identifiant de connection dans le formulaire
const form = document.getElementById("login-form")
form.addEventListener("submit", async(event) => {
    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    event.preventDefault()

    // si le mail est valide
    if(verifyEmail(email)){
        await postId({email, password})
    }
})

