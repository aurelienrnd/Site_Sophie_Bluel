/** Teste le format de l'email avec une regEx.
 * @function
 * @returns {bool} true or false ci l'email passe le test ou pas de la regEx
 * @param {string} email : email de l'utilisateur recupere depuis le formulaire 
 * @emailRegex : Crée une expression régulière qui permet de tester l'email
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

/** Envoie les identifiants de connexion via une requête API et reçoit un id et un token utilisateur.
 * @async
 * @function
 * @returns {Promise<Object<{userId, token}>>} Un id et un token unique.
 * @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 * @param {object} loginId : {email, pasword} de l'utilisateur
 * @user : Reçoit un objet {userId, token}
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
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html"

    } catch (error){
        console.log(error)
        if(error.message === "Erreur:401"){
            alert("L'email ou le mot de passe ne corespondent pas")
        }
        console.error("Connection echouer", error.message)
    }
}

/** Au clic sur le bouton, récupérer l'email et le mots de passe saisie par l'utilisateur
 * @async
 * @function
 */
function eventButton(){
    const form = document.getElementById("login-form")
    form.addEventListener("submit", async(event) => {
        const email = document.getElementById("login-email").value
        const password = document.getElementById("login-password").value
        event.preventDefault()
        if(veryfyEmail(email)){
            await postId({email, password})
        }
    })
}

// execution
eventButton()