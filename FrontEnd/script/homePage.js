/*************************************************************************************** 
 *    Creer, affiche et gère les ellements et les evenements de la page d'acueille     *
 ***************************************************************************************
*/

import {buttonStyle} from "./style.js"

const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

/*Affichage de la gallery*/

/**  Modifie le DOM pour y afficher des posts
 * 
 *  @function
 *  @gallery Une div html dans le DOM
 *  @param {object} works recuperer depuis l'api.
 * */
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
 * @param {object} worksList recuperer depuis l'api.
 */
function eventFilter(worksList) {
    const boutonList = document.querySelectorAll(".filter-button");
    boutonList.forEach(button => {
        button.addEventListener("click", (event) =>{
            const buttonTarget = Number(event.target.id);
            if (buttonTarget){
                const filterDisplay = worksList.filter(work => work.categoryId === buttonTarget);
                gallery.replaceChildren();
                displayWorks(filterDisplay);
            } else {
                gallery.replaceChildren();
                displayWorks(worksList);
            };
        });
    });
}

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
        const works =  await reponse.json();
        displayWorks(works);
        eventFilter(works);
        return works;
    } catch (error){
        console.error(`Impossible de récupérer les donnees : ${error.message}`);
    };
};


/*Affichage de la zone de sélection de filtre*/

/** Créer et associe le bon texte est le bon Id a chaque bouton.
 * 
 * @function
 * @param {HTMLElement} filterArea Section htm ou se trouve les bouton
 * @param {string} name Le texte à afficher dans le bouton.
 * @param {number} id L'identifiant unique du bouton
 */
function createButton(name, id, filterArea) {
    const button = document.createElement("button");
    button.innerText = name;
    button.classList.add("filter-button");
    button.id = id;
    buttonStyle(button);
    filterArea.appendChild(button);
};

/**  Récupère la liste des categories depuis la requete API de get works.
 * 
 * @async
 * @function
 * @getWork function requette api
 * @param {HTMLElement} filterArea Section htm ou se trouve les bouton
 */
async function getcategories(filterArea) {
    const works = await getWorks();
    const SetName = new Set;
    const SetId = new Set;

    works.forEach(element => {
        SetId.add(element.category.id);
        SetName.add(element.category.name);
    });

    const id = Array.from(SetId);
    const name = Array.from(SetName);
    console.log(id, name);

    for(let i=0; i<id.length; i++){
        createButton(name[i], id[i], filterArea);
    };
};

/** Ajoute au DOM une liste de bouton.
 * 
 * @function
 * @gallery Une DIV dans le DOM
 * @portfolio Une section dans le DOM
 */
async function displayButton() {
    // creation de la div 
    const filterArea = document.createElement("div");
    filterArea.style.display = "flex";
    filterArea.style.justifyContent = "center";
    filterArea.style.gap = "10px";

    portfolio.appendChild(filterArea);
    portfolio.insertBefore(filterArea, gallery);

    // creer un bouton "Tous"
    createButton("Tous", 0, filterArea);

    // creer un bouton associer au bon texte
    getcategories(filterArea);
};


// Exportation des fonction sur index.js
export function homePage() {
    displayButton()
    getWorks()
}