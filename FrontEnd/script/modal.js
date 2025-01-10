import {displayWorks, works, galleryPortfolio} from "./homePage.js"

// Balise HTML presente dans la modal
const navArea = document.getElementById("nav-return") //returnBtn() resetModal
const title = document.getElementById("title-modal")// displayFormulaire
const main = document.getElementById("main-modal") //resetModal() displayFormulaire
const button = document.getElementById("modal-btn") // resetModal() activeButton() addNewWork() displayFormulaire
// Balise du formulaire de la modal
let inputTitle // addNewWork() objectNewWork()
let selectCategory //addNewWork() objectNewWork()
let galleryModal
let photo //addNewWork() urlPhoto()
let workTitle // objectNewWork() displayNewWork()
let workCategory // objectNewWork() displayNewWork()



/***** Navigation de la modal *****/

/** Créer un bouton retour sur la modal
 *  @navArea Une Balise <li> dans le nav de la modal
 *  @function resetModal Efface le contenue de la modal
 *  @function displayModal Affiche la la page gallery de la modal
 */
function returnBtn (){
    const arrowLeft = document.createElement("i")
    arrowLeft.classList.add("fa-solid", "fa-arrow-left")
    
    navArea.appendChild(arrowLeft)
    arrowLeft.addEventListener("click", () => {
        resetModal()
        displayModal()
    })
}

/** Efface le contenue de la modal
 *  @function objectNewWork Créer un objet contenant les données du formulaire
 *  @main Une balise <div> de la modal 
 *  @navArea Une Balise <li> dans le nav de la modal
 *  @button Une balise <button> de la modal
 */
function resetModal() {
    // Supprime le contenus principal de la modal
    main.innerHTML = ""

    // Ci le bouton retour existe
    const arrowLeft = document.querySelector(".fa-arrow-left")
    if (arrowLeft){
        // Supprimer le bouton de nav retour et réinitialiser le bouton submit
        navArea.innerHTML = ""
        button.disabled = false 
        button.style.backgroundColor = " #1D6154"
        button.removeAttribute("for")
        button.removeAttribute("type")
        button.removeEventListener("click", objectNewWork)
    }

}

/** Au clique sur un element masque la modal
 *  @param {elementHtml} turnOff Une balise htm contenue dans la modal 
 *  @param {elementHtml} modalOverlay Une balise <aside> dans le DOM
 *  @function resetModal Efface le contenue de la modal
 */
function turnOffModal(turnOff, modalOverlay) {
    turnOff.addEventListener("click", (event) => {
        resetModal()
        modalOverlay.style.display = "none"
    })
    const modal = document.getElementById("modal")
    modal.addEventListener("click", (event) => {
        event.stopPropagation()
    })
}



/***** Ajouter un travail  *****/

/** Envoie une requête HTTP post pour ajouter un travail.
 *  @param {string} url Url de la photo choisie dans le formulaire 
 *  @function resetModal() Efface le contenue de la modal
 *  @function displayModal() Affiche la la page gallery de la modal
 *  @function displayWorks() Modifier le DOM pour y afficher des posts
 *  @works Tableaux contenant les différent travaux obtenue apres requête api avec getWorks()
 *  @worTitle Le titre du nouveau travail a ajouter 
 *  @categoryId La catégory du nouveaux travail a ajouter 
 */
function displayNewWork(url) {
    // Récupérer l'id du dernier objet posé dans le tableaux pui creer un nouvelle objet
    let lastWorkId 
    if(works.length === 0){
        lastWorkId = 0
    } else {
        lastWorkId = works[works.length-1].id
    }
    const newWorkId = lastWorkId + 1
    const newWork = {id: newWorkId, title: workTitle, categoryId: Number(workCategory), imageUrl: url}

    // Ajout le nouveau objet au tableau works
    works.push(newWork)

    // Actualisation de la modal
    resetModal()
    displayModal()

    // Affiche le nouveau travail dans le portfolio
    displayWorks([newWork], galleryPortfolio)
}

/** Envoie une requête HTTP post pour ajouter un travail.
 *  @param {object} newWork Objet a envoyer a l'api
 *  @param {object} user Objet contenant les info de l'utilisateur
 *  @returns {Promise} La requête a échoué ou non.
 *  @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 */
async function postNewWork(newWork, user) {
    try{
        const reponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${JSON.parse(user).token}`
            },
            body: newWork
        })
        if(!reponse.ok){
            throw new Error("Erreur:" + reponse.status)
        }
        return await reponse.json();

    } catch (error){
        console.log(error)
        if(error.message === "Erreur:401"){
            alert("Non autorisé")
        }
        console.error("Echec de l'envoie", error.message)
    }
}

/** Active le bouton submit de la modal si le formulaire est remplie.
 *  @param {HTMLElement} inputTitle Balise <input> dans le formulaire 
 *  @param {HTMLElement} selectCategory Balise <select> dans le formulaire
 *  @button balise <button type submit> de la modal.
 */
function activeButton(inputTitle, selectCategory) {
    if (inputTitle.value && selectCategory.value) {
        // Si le formulaire est remplie, le bouton se reactive
        button.disabled = false
        button.style.backgroundColor = " #1D6154"

    } else {
        // Autrement je reactive le bouton que quand tout les element du formulaire sont remplie
        const form = [inputTitle, selectCategory]
        form.forEach ((element) => {
            element.addEventListener("change", () => {
                inputTitle.value && selectCategory.value ? 
                (button.disabled = false, button.style.backgroundColor = " #1D6154" ) : 
                (button.disabled = true, button.style.backgroundColor = " #A7A7A7")       
            })           
        })
    }
}

/** Récupérer l'url de la photo choisie dans le formulaire.
 *  @param {function} callback prend l'url en paramaitre
 *  @photo Fichier choisie dans le formulaire
 */
function urlPhoto(callback){
    const reader = new FileReader() // Creer un objet capable de lire le fichier
    reader.readAsDataURL(photo) // Demande a reader de lire le fichier photo comme une url
    reader.addEventListener("load", () => { // Au chargement d'un fichier dans reader
        const url = reader.result // Le resulta de reader egalera l'url de la photo
        callback(url)
    })
}

/** Affiche une preview de la photo dans le formulaire
 * @param {string} url Url de la photo choisie dans le formulaire.
 */
function previewPhoto(url) {
    // Créer une balise <img>
    const previewPhoto = document.createElement("img")
    previewPhoto.alt = "photo a ajouter"
    previewPhoto.classList.add("preview-photo")
    previewPhoto.src = url

    // Affichage de la balise dans le DOM
    const containerPhoto = document.querySelector(".image-fieldset-modal")
    containerPhoto.innerHTML = ""
    containerPhoto.appendChild(previewPhoto)
}

/** Ajoute un travaille au site
 *  @function urlPhoto Récupérer l'url de la photo choisie dans le formulaire et affiche sa preview via previewPhoto.
 *  @function activeButton Active le bouton submit de la modal si le formulaire est remplie.
 *  @function objectNewWork Créer un objet contenant les données du nouveaux travail
 *  @button balise <button> de la modal
 *  @inputTitle Balise <input> dans le DOM
 *  @selectCategory Balise <select> dans le DOM
 *  @photo Fichier choisie dans le formulaire
 */
function addNewWork() {
    const photoInput = document.getElementById("photoInput")
    inputTitle = document.getElementById("titleInput")
    selectCategory = document.getElementById("categorySelect")

    // Récupérer le fichier photo lorsqu'il est chargé dans le formulaire et affiche sa preview. 
    photoInput.addEventListener("change", () => {
        photo = photoInput.files[0] //input.file revoie un tableau de un ellement car un seul fichier est sectioner, [0] pour ne recuperer que l'element seul
        
        urlPhoto(previewPhoto)
        // Active le bouton du formulaire
        activeButton(inputTitle, selectCategory)

        // Créer un objet contenant les données du nouveaux travail
        button.addEventListener("click", objectNewWork)
    })
}

/** Créer un objet contenant les données du nouveaux travail
 *  @async
 *  @inputTitle Balise <input> dans le formulaire de la modal.
 *  @selectCategory Balise <select> dans le formulaire de la modal
 *  @function postNewWork Envoie une requête HTTP post pour ajouter un travail.
 *  @function urlPhoto Récupérer l'url de la photo choisie dans le formulaire et envoie une requête HTTP post via displayNewWork
 *  @workTitle Le titre du nouveau travail a ajouter 
 *  @workCategory La catégory du nouveaux travail a ajouter
 */
async function objectNewWork() {
    // Récupère les autre données du formulaire
    workTitle = inputTitle.value
    workCategory = selectCategory.value
    // Cree un objet avec les données du formulaire
    const newWork = new FormData()
    newWork.append("title", workTitle)
    newWork.append("category", workCategory)
    newWork.append("image", photo)
    
    // Envoie les données via une requette post
    const user = localStorage.getItem("user")
    if(await postNewWork(newWork, user)){
        urlPhoto(displayNewWork)
    }
}

/** Retourner un formulaire pour déposer une nouvelle photo
 *  @returns {HTMLElement} Un formulaire pour deposer une photo avec son titre et sa catégorie.
 */
function creatFormulaire() {
    // Cree la balise <form>
    const form = document.createElement("form") //dois je luis donner des atribut action et methode?
    form.id = "new-post"
    form.enctype = "multipart/form-data"
    
    // Implémenter le contenue de la la balise <form>
    form.innerHTML = `
        <div class="image-fieldset-modal">
            <i class="fa-regular fa-image"></i>
            <input type="file" id="photoInput" name="photo" accept="image/jpeg, image/png" required hidden/>
            <label for="photoInput" id="upload-button">+ Ajouter photo</label>
            <p>jpg, png : 4mo max</p>
        </div>

        <fieldset class="text-fieldset-modal">
            <div>
                <label for="titleInput" class="modal-label">Titre</label>
                <input type="text" id="titleInput" name="title" required/>
            </div>
                
            <div>
                <label for="categorySelect" class="modal-label">Catégorie</label>
                <select id="categorySelect" name="category" required/>
                    <option value="" disabled selected>
                    <option value="1">Objets</option>
                    <option value="2">Appartements</option>
                    <option value="3">Hotels & restaurants</option>
                </select>
            </div>
        </fieldset>` //utilisation de data list au lieux de select?
    return form
}

/** Affiche le formulaire "Ajout photo"
 *  @function displayFormulaire Affiche le formulaire "Ajout photo"
 *  @function creatFormulaire Retourner un formulaire pour déposer une nouvelle photo
 *  @function returnBtn Créer un bouton retour sur la modal
 *  @function addNewWork Ajoute un travaille au site
 *  @button une balise <button> de la modal
 *  @title Une balise <h3> presente dans une div child de la modal.
 *  @main Une balise <div> de la modal 
 */
function displayFormulaire() {
    // Supprime le precedent ecouteur d'evenement sur le bouton
    button.removeEventListener("click", displayFormulaire)

    // Renomme le titre de la modale
    title.innerText = "Ajout photo"

    // Ajoute le formulaire dans <main> de la modale.
    const form = creatFormulaire()
    main.replaceChild(form, galleryModal)

    // Gestion du bouton
    button.innerText = "Valider"
    button.setAttribute("type", "submit")
    button.setAttribute("for", "new-post")
    button.style.backgroundColor = " #A7A7A7"
    button.disabled = true

    // Créer un bouton retour sur la modal
    returnBtn()

    // Ajoute un travaille au site
    addNewWork()
}



/***** Supprimer un travail *****/

/** Supprime un travail des galeries et du tableaux works.
 *  @param {number} id Identifiant unique du travail a supprimer
 *  @param {HTMLElement} Modalpost Balise <figure> contenant un travail dans la modal
 *  @galleryPortfolio balise <div> ou sont contenue les travaux dans la section portfolio
 *  @works Tableaux contenant les différent travaux obtenue apres requête api avec getWorks()
 */
function remouveDispalyWork(id, modalPost) {    
    // Retire un travail dans la galerie de la modal
    galleryModal.removeChild(modalPost)

    // Retire un travail dans la galerie du le portfolio
    const portfolioPosts = Array.from(galleryPortfolio.children)
    portfolioPosts.forEach(element => {
        const elementId = element.getAttribute("work-id")
        if (elementId === id) {
            galleryPortfolio.removeChild(element)
        }
    })

    // Retirer un travail de tableaux works
    works.forEach(element => {
        if (element.id == Number(id)) {
            works.splice(element, 1)
        }
    })

    console.log(works)
}

/** Envoie une requête HTTP DELETE pour supprimer un travail.
 *  @async
 *  @param {number} id Identifiant unique du travail a supprimer
 *  @param {object} user Objet contenant les info de l'utilisateur
 *  @param {HTMLElement} post Balise <figure> contenant un travail dans la modal
 *  @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 */
async function delateWorks(id, user, post) {
    try{
        const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${JSON.parse(user).token}`
            }
        })

        if (!reponse.ok){
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        } else {
            remouveDispalyWork(id, post)
        }
    }catch (error){
        console.error(`Impossible de supprimer les donnees : ${error.message}`);
    };
};

/** Retirer un travaille posté sur le site
 *  @function delateWorks Envoie une requête HTTP DELETE pour supprimer un travail.
 */
function removeWork() {
    // Créer une liste de tout les logos trash-can
    const trashCan = document.querySelectorAll(".fa-trash-can")
    
    // Recuperation de l'id du travail a supprimer
    trashCan.forEach(element => {
        element.addEventListener("click", (event) => {
            const post = event.target.parentElement
            const id = post.getAttribute("work-id")

            // Envoie d'une requête http delete pour supprimer un travail.
            const user = localStorage.getItem("user")
            delateWorks(id, user, post)
        })
    })
}

/** Affiche la page "Galerie photo"
 *  @function displayWorks Modifier le DOM pour y afficher des posts
 *  @function displayFormulaire Affiche le formulaire "Ajout photo"
 *  @function removeWork Retirer un travaille posté sur le site
 *  @title Une balise <h3> presente dans une div child de la modal.
 *  @works Tableaux contenant les différent travaux obtenue apres requête api avec getWorks()
 *  @main Une balise <div> de la modal 
 *  @button Une balise <button> de la modal
 */
function displayModal() {
    // Renomme le titre de la modale
    title.innerText = "Galerie photo"

    // Implémenter la galerie dans <main> de la modale.
    galleryModal = document.createElement("div")
    galleryModal.id = "modal-gallery"
    displayWorks(works, galleryModal)
    main.appendChild(galleryModal)

    // Gestion du bouton
    button.innerText = "Ajouter une photo"
    button.addEventListener("click", displayFormulaire)

    // Retirer un travaille posté sur le site
    removeWork()
}



/***** Apparision de la modal *****/

/** Fait apparaître la modal au clic sur le bouton "modifier"
 *  @function displayModal Affiche la page "Galerie photo"
 *  @function turnOffModal Au clique sur un element masque la modal
 */
export function modalOn(){
    const openModal = document.getElementById("modalButton")
    const modalOverlay = document.getElementById("modal-overlay")
    const xmark = document.querySelector(".fa-xmark")

    //Affiche la page "Galerie photo"
    openModal.addEventListener("click", () => {
        modalOverlay.style.display = "flex"
        displayModal()

        //Au clique sur un element masque la modal
        turnOffModal(xmark, modalOverlay)
        turnOffModal(modalOverlay, modalOverlay)
    })
}