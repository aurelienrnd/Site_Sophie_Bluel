import {modalOn} from "./modal.js"

/** galleryPortfolio
 * displayWork(), eventFilter(), displayButoon()
 * Exportation pour une utilisation dans displayWork()
 */
export const galleryPortfolio = document.getElementById("portfolio-gallery");
/**  works
 * displayWork(), eventFilter(), displayButoon()
 * Exportation pour une utilisation dans modal.js()
 */
export let works // Tableaux contenant les différent travaux obtenue apres requête api avec getWorks()




/**  Récupérer la liste des travaux via une requête API.
 * @async
 * @returns {Promise<Object[]>} Un tableau d'objets représentant les travaux.
 * @throws {Error} Si la requête échoue ou si une erreur HTTP se produit.
 * @works Variable global contenant les différent travaux obtenue apres requête api
 */
export async function getWorks() {
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

/**  Modifier le DOM pour y afficher des posts
 *  @export
 *  @param {object} arrayWork Un tableau contenant les travaux à afficher.
 *  @param {HtmlElement} gallery Une div html ou afficher les travaux
 */
export function displayWorks(arrayWork, gallery) {
    arrayWork.forEach(element => {

        // Creer une balise <figure>
        const figure = document.createElement("figure");
        figure.classList.add("work")
        figure.setAttribute("work-id",`${element.id}`)

        // Implementation de différent éléments
        figure.innerHTML = `
        <img src="${element.imageUrl}" alt="${element.title}">
        <i class="fa-solid fa-trash-can"></i>
        <figcaption>${element.title}</figcaption>`;

        // Affichage dans le DOM
        gallery.appendChild(figure);
    });
};

/** Filtre les travaux a afficher selon le bouton cliquer.
 * @gallery Une div html dans le DOM
 * @param {object} arrayWork Un tableau contenant les travaux à afficher..
 * @param {HtmlElement} gallery Une div html ou afficher les travaux
 * @function displayWorks Modifier le DOM pour y afficher des posts
 */
function eventFilter(arrayWork, gallery) {
    //Pour chaque bouton au click
    const boutonList = document.querySelectorAll(".filter-button");
    boutonList.forEach(button => {
        button.addEventListener("click", (event) =>{
            const buttonTarget = Number(event.target.id);

            if (buttonTarget){ // Ci superieur a 0 le bouton = true
                // Filtre les travaux dont l'id category est le meme que le bouton
                const filterDisplay = arrayWork.filter(work => work.categoryId === buttonTarget);
                gallery.replaceChildren();
                displayWorks(filterDisplay, gallery);

            } else { // Ci egale a 0 le bouton = false on ne filtre pas
                gallery.replaceChildren();
                displayWorks(arrayWork, gallery);
            };
        });
    });
};

/** Créer et associe le bon texte et le bon Id a chaque bouton.
 * @param {HTMLElement} filterArea Section html ou se trouve les boutons
 * @param {string} name Le texte à afficher dans le bouton
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
 * @param {HTMLElement} filterArea Section html ou se trouve les boutons
 * @function createButton Créer et associe le bon texte et le bon Id a chaque bouton.
 * @works Variable global contenant les différent travaux obtenue apres requête api
 */
function getCategories(filterArea) {
    // Creation de deux tableaux regroupant les id et les nom de chaque category
    const SetName = new Set;
    const SetId = new Set;
    works.forEach(element => {
        SetId.add(element.categoryId);
        SetName.add(element.category.name);
    });
    const id = Array.from(SetId);
    const name = Array.from(SetName);

    // Creation de bouton avec le bon nom et id
    for(let i=0; i<id.length; i++){
        createButton(name[i], id[i], filterArea);
    };
};

/** Ajoute au DOM des bouton filter.
 *  @param {HtmlElement} gallery Une div html ou afficher les travaux
 *  @function createButton Créer et associe le bon texte et le bon Id a chaque bouton.
 *  @function getCategories Récupère la liste des categories depuis la requete API de get works.
 */
function displayButton(gallery) {
    // Creation de la div qui accueilleront les bouton
    const filterArea = document.createElement("div");
    filterArea.classList = "filter-area"
    const portfolio = document.getElementById("portfolio");
    portfolio.appendChild(filterArea);
    portfolio.insertBefore(filterArea, gallery);

    // Créer un bouton "Tous"
    createButton("Tous", 0, filterArea);

    // Creer les autres bouton associer au bon texte
    getCategories(filterArea);
};

/** Déconnecter l'utilisateur
 */
function logout() {
    // Masquer le bouton login
    const loginButton = document.getElementById("nav-login")
    loginButton.style.display = "none"

    // Deconnecte au clic sur logout
    const logoutButton = document.getElementById("nav-logout")
    logoutButton.addEventListener("click", () => {
        // Supprimer user du local storage et recharger la page
        localStorage.removeItem("user")
        window.location.reload()
    })
}


/*********************** dispaly Homepage ***********************/

/** Home page edition mode off
 *  Affiche le site pour une personne non connecté
 *  @param {HtmlElement} introduction Balise <section> dans le dom
 *  @param {HtmlElement} body Balise <body> dans le dom
 *  @function getWorks Récupérer la liste des travaux via une requête API.
 *  @function displayButton Ajoute au DOM des bouton filter.
 *  @function displayWorks Modifier le DOM pour y afficher des posts
 *  @function eventFilter Filtre les travaux a afficher selon le bouton cliquer.
 */
async function displayEditionOff(introduction, body) {
    // Masque les elements qui ne doivent pas apparaître en edition off
    const hiddenElement = document.querySelectorAll(".editionElements")
    hiddenElement.forEach(element => {
        element.style.display = "none"
    })

    // Changement de class css en mode éditionOff
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
    console.log(works)

}

/** Home page edition mode on
*  Affiche le site pour une personne connecté
 *  @param {HtmlElement} introduction Balise <section> dans le dom
 *  @param {HtmlElement} body Balise <body> dans le dom
 *  @function getWorks Récupérer la liste des travaux via une requête API..
 *  @function displayWorks Modifier le DOM pour y afficher des posts.
 *  @function logout Déconnecter l'utilisateur.
 *  @function modalOn Fait apparaître une modal pour ajouter ou supprimer des post.
*/
async function displayEditionOn(introduction, body) {
    // Changement de class css en mode éditiOn
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
    console.log(works)
}


/*********************** Execution du script ***********************/

//Vérifier si l'utilisateur est connecté
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





























































