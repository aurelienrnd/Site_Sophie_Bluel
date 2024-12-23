import {navigation} from "./index.js"

const portfolio = document.getElementById("portfolio");
const gallery = document.querySelector(".gallery");
let works // Contenue de ma requete api

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


/*Affichage de la gallery*/

/**  Modifie le DOM pour y afficher des posts
 * 
 *  @function
 *  @gallery Une div html dans le DOM
 *  @param {object} works recuperé depuis l'api.
 */
function displayWorks(works) {
    works.forEach(element => {
        const post = document.createElement("figure");
        post.innerHTML = 
        `<img src="${element.imageUrl}" alt="${element.title}">
        <figcaption>${element.title}</figcaption>`;
        gallery.appendChild(post);
    });
};

/** Filtre les travaux a afficher selon le bouton cliquer.
 * 
 * @function
 * @gallery Une div html dans le DOM
 * @param {object} worksList recuperé depuis l'api.
 */
function eventFilter(worksList) {
    const boutonList = document.querySelectorAll(".filter-button");
    boutonList.forEach(button => {
        button.addEventListener("click", (event) =>{
            const buttonTarget = Number(event.target.id);
            if (buttonTarget){ //ci egale plus que 0 filtrer 
                const filterDisplay = worksList.filter(work => work.categoryId === buttonTarget);
                gallery.replaceChildren();
                displayWorks(filterDisplay);
            } else { //ci egale a 0 pas filtrer
                gallery.replaceChildren();
                displayWorks(worksList);
            };
        });
    });
};


/* Affichage et gestion des evenements pour un visiteur non connecté */

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
function getcategories(filterArea) {
    const SetName = new Set;
    const SetId = new Set;
    works.forEach(element => {
        SetId.add(element.category.id);
        SetName.add(element.category.name);
    });

    const id = Array.from(SetId);
    const name = Array.from(SetName);

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
function displayButton() {
    // creation de la div 
    const filterArea = document.createElement("div");
    filterArea.classList = "filter-area"

    portfolio.appendChild(filterArea);
    portfolio.insertBefore(filterArea, gallery);

    // creer un bouton "Tous"
    createButton("Tous", 0, filterArea);

    // creer un bouton associer au bon texte
    getcategories(filterArea);
};

/** Change le style des elements d'edition pour les masquer dans le DOM
 * 
 * @function
 */
function hiddenEditionElement() {
    const hiddenElement = document.querySelectorAll(".hidden-element")
    hiddenElement.forEach(element => {
        element.style.display = "none"
    })
}


/*Affichage et gestion des evenements pour un utilisateur conneté*/

/** Au click, suprime la donnée user du local storage 
 * 
 * @function
 * @param {HTMLElement} bouton balise li pour ce déconnecté
 */
function logout() {
    const loginButton = document.getElementById("nav-login")
    loginButton.style.display = "none"

    const logoutButton = document.getElementById("nav-logout")
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user")
        window.location.reload()
    })
}

function margin(){
    const header = document.querySelector("header")
    header.style.marginTop = "97px"
}


/*********************** Fonction Visiteur ou Utilisateur ***********************/

/* Visiteur
 *  Affiche le site pour une personne non connecté */
async function homePageVisiteur() {
    await getWorks()
    displayButton()
    displayWorks(works)
    eventFilter(works)
    hiddenEditionElement()
}

/* Utilisateur  
*  Affiche le site pour une personne connecté */
async function homePageUtilisateur () {
    await getWorks()
    displayWorks(works)
    logout()
    margin()
    
}


/*********************** Execution du script ***********************/

navigation()
/*Verifie si l'utilisateur est connecté*/
const reponse = localStorage.getItem("user")
const user = JSON.parse(reponse)
console.log(user)
if (!reponse){
    homePageVisiteur()
} else{
    homePageUtilisateur()
}





























































