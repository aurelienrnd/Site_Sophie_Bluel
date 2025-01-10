import {modalOn} from "./modal.js"
export const galleryPortfolio = document.getElementById("portfolio-gallery");
export let works // tableaux contenat les différent traveaux obtenue apres requette api

/**  Récupère la liste des travaux via une requête API.
 * @async
 * @function
 * @returns {Promise<Object[]>} Un tableau d'objets représentant les travaux.
 * @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 */
async function getWorks() {
    try{
        const reponse = await fetch("http://localhost:5678/api/works");
        if (!reponse.ok){
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        };
        works =  await reponse.json();
    } catch (error){
        console.error(`Impossible de récupérer les donnees : ${error.message}`);
    };
};

/**  Modifie le DOM pour y afficher des posts
 * 
 *  @function
 *  @gallery Une div html dans le DOM
 *  @param {object} works recuperé depuis l'api.
 */
export function displayWorks(arrayWork, gallery) {
    arrayWork.forEach(element => {

        // creer une balise <figure>
        const figure = document.createElement("figure");
        figure.classList.add("work")
        figure.setAttribute("work-id",`${element.id}`)

        // l'implemente de différent ellements
        figure.innerHTML = `
        <img src="${element.imageUrl}" alt="${element.title}">
        <i class="fa-solid fa-trash-can"></i>
        <figcaption>${element.title}</figcaption>`;

        //l'affiche dans le DOM
        gallery.appendChild(figure);
    });
};

/** Filtre les travaux a afficher selon le bouton cliquer.
 * 
 * @function
 * @gallery Une div html dans le DOM
 * @param {object} worksList recuperé depuis l'api.
 */
function eventFilter(arrayWork, gallery) {
    //Pour chaque bouton au click
    const boutonList = document.querySelectorAll(".filter-button");
    boutonList.forEach(button => {
        button.addEventListener("click", (event) =>{
            const buttonTarget = Number(event.target.id);

            if (buttonTarget){ //ci superieur a 0 le bouton = true
                // filtre des traveaux don l'id category est le meme que le bouton
                const filterDisplay = arrayWork.filter(work => work.categoryId === buttonTarget);
                gallery.replaceChildren();
                displayWorks(filterDisplay, gallery);

            } else { //ci egale a 0 le bouton = false on ne filtre pas
                gallery.replaceChildren();
                displayWorks(arrayWork, gallery);
            };
        });
    });
};

/** Créer et associe le bon texte et le bon Id a chaque bouton.
 * 
 * @function
 * @param {HTMLElement} filterArea Section htm ou se trouve les boutons
 * @param {string} name Le texte à afficher dans le bouton.
 * @param {number} id L'identifiant unique du bouton
 */
function createButton(name, id, filterArea) {
    const button = document.createElement("button");
    button.innerText = name;
    button.classList.add("filter-button");
    button.id = id;
    filterArea.appendChild(button);
};

/**  Récupère la liste des categories depuis la requete API de get works.
 * 
 * @async
 * @function
 * @getWork function requette api
 * @param {HTMLElement} filterArea Section htm ou se trouvent les boutons
 */
function getCategories(filterArea) {
    // creation de tableaux regroupent les id category et les nom de category
    const SetName = new Set;
    const SetId = new Set;
    works.forEach(element => {
        SetId.add(element.categoryId);
        SetName.add(element.category.name);
    });
    const id = Array.from(SetId);
    const name = Array.from(SetName);

    // creation de bouton avecle bon nom et id
    for(let i=0; i<id.length; i++){
        createButton(name[i], id[i], filterArea);
    };
};

/** Ajoute au DOM une liste de boutons.
 * 
 * @function
 * @gallery Une DIV dans le DOM
 * @portfolio Une section dans le DOM
 */
function displayButton(gallery) {
    // creation de la div 
    const filterArea = document.createElement("div");
    filterArea.classList = "filter-area"
    const portfolio = document.getElementById("portfolio");
    portfolio.appendChild(filterArea);
    portfolio.insertBefore(filterArea, gallery);

    // cree un bouton "Tous"
    createButton("Tous", 0, filterArea);

    // creer un bouton associer au bon texte
    getCategories(filterArea);
};

/** Masque et ajuste le margin de certain element en mode offEdition
 * 
 * @function
 */
function hiddenEditionElement() {

    // Ajoute une class au body pour sorganiser avec les nouveaux ellements
    const body = document.querySelector("body")
    body.classList.remove("editionActive")
}

/** Au click, suprime la donnée user du local storage 
 * 
 * @function
 * @param {HTMLElement} bouton balise li pour ce déconnecté
 */
function logout() {
    // masque le nouton login
    const loginButton = document.getElementById("nav-login")
    loginButton.style.display = "none"

    // deconnect au click sur logout
    const logoutButton = document.getElementById("nav-logout")
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user")
        window.location.reload()
    })
}


/*********************** dispaly Homepage ***********************/

/* Home page edition mode off
 *  Affiche le site pour une personne non connecté */
async function displayEditionOff(introduction, body) {
    // Masque les elements qui ne doivent pas aparaitre en offEdition
    const hiddenElement = document.querySelectorAll(".editionElements")
    hiddenElement.forEach(element => {
        element.style.display = "none"
    })

    // Changement de class css en mode editionOff
    body.classList.remove("editionActive")
    introduction.classList.remove("editionActive")
    galleryPortfolio.classList.remove("editionActive")

    body.classList.add("editionOff")
    introduction.classList.add("editionOff")
    galleryPortfolio.classList.add("editionOff")
    
    

    await getWorks() // return works
    displayButton(galleryPortfolio)
    displayWorks(works, galleryPortfolio)
    eventFilter(works, galleryPortfolio)

}

/* Home page edition mode on
*  Affiche le site pour une personne connecté */
async function displayEditionOn(introduction, body) {
    // Changement de class css en mode editionOn
    body.classList.remove("editionOff")
    introduction.classList.remove("editionOff")
    galleryPortfolio.classList.remove("editionOff")

    body.classList.add("editionActive")
    introduction.classList.add("editionActive")
    galleryPortfolio.classList.add("editionActive")
    
    await getWorks()
    displayWorks(works, galleryPortfolio)
    logout()
    modalOn()

    
}


/*********************** Execution du script ***********************/

/*Verifie si l'utilisateur est connecté*/
const introduction = document.getElementById("introduction")
const body = document.querySelector("body")
const reponse = localStorage.getItem("user")
const user = JSON.parse(reponse)
console.log(user)
if (!reponse){
    displayEditionOff(introduction, body)
} else{
    displayEditionOn(introduction, body)
}





























































