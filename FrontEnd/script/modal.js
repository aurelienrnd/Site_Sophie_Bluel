import {displayWorks, works, galleryPortfolio} from "./homePage.js"
const modalOverlay = document.getElementById("modal-overlay")
const modal = document.getElementById("modal")
const navArea = document.getElementById("nav-return")
const title = document.getElementById("title-modal")
const main = document.getElementById("main-modal")
const button = document.getElementById("modal-btn")
let inputTitle
let selectCategory
let galleryModal
let photo



/***** Navigation de la Modal *****/

/** Cree un bouton retour sur la modal
 *  @function
 *  @navArea Une Balise <li> dans le nav de la modal
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
 *  @function
 *  @main une balise <div> de la modal 
 *  @navArea Une Balise <li> dans le nav de la modal
 *  @button une balise <buttun> de la modal
 */
function resetModal() {
    main.innerHTML = ""
    const arrowLeft = document.querySelector(".fa-arrow-left")
    if (arrowLeft){
        navArea.innerHTML = ""
        button.disabled = false 
        button.style.backgroundColor = " #1D6154"
        button.removeAttribute("for")
        button.removeAttribute("type")
        button.removeEventListener("click", objectNewWork)
    }

}

/** Au clique sur un element masque la modal  
 *  @function
 *  @modalOverlay une balise <aside> dans le DOM
 *  @modal Une balise <section> dans le <aside>
 */
function turnOffModal(turnOff) {
    turnOff.addEventListener("click", (event) => {
        resetModal()
        modalOverlay.style.display = "none"
    })
    modal.addEventListener("click", (event) => {
        event.stopPropagation()
    })
}


/***** Ajouter un travail  *****/

function displayNewwork() {
    
    
}

/** Envoie une requette HTTP post pour ajouter un travail.
 *  @function
 *  @param {object} newWork objet a envoyer a l'api 
 *  @param {object} user contien l'id utilisateur et son token
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

/** Active le bouton de la modal quand le formulaire est remplie.
 * 
 *  @function
 *  @param {HTMLElement} inputTitle Balise <input> dans le formulaire 
 *  @param {HTMLElement} selectCategory Balise <select> dans le formulaire
 *  @button balise <button> de la modal.
 */
function activeButton(inputTitle, selectCategory) {
    if (inputTitle.value && selectCategory.value) {
        // Si le formulaire est remplie, le bouton se reactive
        button.disabled = false
        button.style.backgroundColor = " #1D6154"

    } else {
        // Autrement je reactive le bouton quand tout les element du formulaire sont remplie
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

function urlPhoto(callback){
    const reader = new FileReader() // creer un objet capable de lire le fichier
    reader.readAsDataURL(photo) // je demande a reader de lire le fichier photo comme une url
    reader.addEventListener("load", () => { //au chargement d'un fichier dans reader
        const url = reader.result // le resulta de reader egalera src de ma balise img
        callback(url)
    })
}




/** Affiche une preview de la photo dans le formulaire
 * @function
 * @param {File} photo Fichier de la photo à prévisualiser.
 */
function previewPhoto(url) {
    // Crée une balise <img>
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
 * 
 *  @function
 *  @button balise <button> de la modal.
 */
function addNewWork() {
    const photoInput = document.getElementById("photoInput")
    inputTitle = document.getElementById("titleInput")
    selectCategory = document.getElementById("categorySelect")

    // Récupère le fichier photo lorsqu'il est chargé dans le formulaire et affiche sa preview. 
    photoInput.addEventListener("change", () => {
        photo = photoInput.files[0] //input.file revoie un tableau de un ellement car un seul fichier est sectioner, [0] pour ne recuperer que l'element seul
        urlPhoto(previewPhoto)


        // Active le bouton du formulaire
        activeButton(inputTitle, selectCategory)

        button.addEventListener("click", objectNewWork)
    })
}

/** Ajoute un travaille au site
 * 
 *  @function
 *  @inputTitle balise <input> dans le formulaire de la modal.
 *  @selectCategory balise <select> dans le formulaire de la modal
 */
async function objectNewWork() {
    // Récupère les autre données du formulaire
    const title = inputTitle.value
    const category = selectCategory.value
    // Cree un objet avec les données du formulaire
    const newWork = new FormData()
    newWork.append("title", title)
    newWork.append("category", category)
    newWork.append("image", photo)
    
    // Envoie les données via une requette post
    const user = localStorage.getItem("user")
    if(await postNewWork(newWork, user)){
        displayNewwork()
    }
}

/** Retourne un formulaire pour deposser une nouvelle photo
 * 
 *  @function
 *  @returns {HTMLElement} Un formulaire pour deposer une photo avec son titre et sa catégorie.
 */
function creatFormulaire() {
    // Cree la balise <form>
    const form = document.createElement("form") //dois je luis donner des atribut action et methode?
    form.id = "new-post"
    form.enctype = "multipart/form-data"
    
    // Implémente le contenue de la la balise <form>
    form.innerHTML = `
        <fieldset class="image-fieldset-modal">
            <i class="fa-regular fa-image"></i>
            <input type="file" id="photoInput" name="photo" accept="image/jpeg, image/png" required hidden/>
            <label for="photoInput" id="upload-button">+ Ajouter photo</label>
            <p>jpg, png : 4mo max</p>
        </fieldset>

        <label for="titleInput" class="modal-label">Titre</label>
        <input type="text" id="titleInput" name="title" required/>
                
        <label for="categorySelect" class="modal-label">Catégorie</label>
        <select id="categorySelect" name="category" required/>
            <option value="" disabled selected>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
        </select>` //utilisation de data list au lieux de select?

    return form
}

/** Affiche le formulaire "Ajout photo"
 * 
 *  @function
 *  @param {HTMLElement} galleryModal une <div> child de main, contenant plusieur photos.
 *  @param {HTMLElement} addPhotoBtn un <button> child de footer.
 *  @button balise <button> de la modal
 *  @main une <div> child de modal
 */
function displayFormulaire() {
    // Supprime le precedent ecouteur d'evenement sur le bouton
    button.removeEventListener("click", displayFormulaire)

    // Renomme le titre de la modale
    title.innerText = "Ajout photo"

    //Implémente le formulaire dans <main> de la modale.
    const form = creatFormulaire()
    main.replaceChild(form, galleryModal)

    // Gestion du bouton
    button.innerText = "Valider"
    button.setAttribute("type", "submit")
    button.setAttribute("for", "new-post")
    button.style.backgroundColor = " #A7A7A7"
    button.disabled = true

    // Affiche le bouton precedent
    returnBtn()

    // Supprime un travail
    addNewWork()

    console.log(works)
}



/***** Supprimer un travail *****/

/** Supprime la le travail des galleries.
 * 
 *  @function
 *  @param {number} id identifiant unique du travail a supprimer 
 *  @param {HTMLElement} Modalpost Balise <figure> contenant un travail dans la modal
 *  @galleryPortfolio balise <div> ou sont contenue les traveaux dans la section portfolio
 */
function remouveDispalyWork(id, modalPost) {    
    // Retire un travail dans la gallerie de la modal 
    galleryModal.removeChild(modalPost)

    // Retire un travail dans la gallerie du le portfolio
    const portfolioPosts = Array.from(galleryPortfolio.children)
    portfolioPosts.forEach(element => {
        const elementId = element.getAttribute("work-id")
        if (elementId === id) {
            galleryPortfolio.removeChild(element)
        }
    })

    // Retire un travail du tableaux works
    works.forEach(element => {
        if (element.id == Number(id)) {
            works.splice(element, 1)
        }
    })

    console.log(works)
}

/** Envoie une requette HTTP DELATE pour suprimer un travail.
 * 
 *  @function
 *  @param {number} id identifiant unique du travail a supprimer 
 *  @param {object} user contien l'id utilisateur et son token
 *  @param {HTMLElement} post Balise <figure> contenant le travail a supprimer
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

/** Retire un travaille posté sur le site au click sur l'icone
 * 
 *  @function
 */
function removeWork() {
    // Cree une liste de tout les logos trashCan
    const trashCan = document.querySelectorAll(".fa-trash-can")
    
    // Recuperation de l'id du travail a supprimer 
    trashCan.forEach(element => {
        element.addEventListener("click", (event) => {
            const post = event.target.parentElement
            const id = post.getAttribute("work-id")

            // Envoie d'une requette http delate
            const user = localStorage.getItem("user")
            delateWorks(id, user, post)
        })
    })
}

/** Affiche la page "Galerie photo"
 * 
 *  @function
 *  @title une balise <h3> presente dans une div child de main.
 *  @works contenus de ma resquette api.
 *  @main une <div> child de modal.
 *  @button balise <button> de la modal
 */
function displayModal() {
    // Renomme le titre de la modale
    title.innerText = "Galerie photo"

    // Implémente la galerie dans <main> de la modale. 
    galleryModal = document.createElement("div")
    galleryModal.id = "modal-gallery"
    displayWorks(works, galleryModal)
    main.appendChild(galleryModal)

    // Gestion du bouton
    button.innerText = "Ajouter une photo"
    button.addEventListener("click", displayFormulaire)

    // Supprime un travail
    removeWork()
    console.log(works)
}



/***** Apparision de la modal *****/

/** Fait apparètre la modal au click sur le bouton "modifier"
 * 
 *  @function
 *  @modalOverlay Une Balise <aside>
 */
export function modalOn(){
    const openModal = document.getElementById("modalButton")
    openModal.addEventListener("click", () => {
        modalOverlay.style.display = "flex"
        displayModal()
        const xmark = document.querySelector(".fa-xmark")
        turnOffModal(xmark)
        turnOffModal(modalOverlay)
    })
}