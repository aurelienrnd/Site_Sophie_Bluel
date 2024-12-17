/************************************************************************ 
 *    Applique un style CSS au different contenue ajoutés dans le DOM    *
 ************************************************************************
 */ 
/**
 * Modifie les propriétés CSS des bouton.
 * 
 * @function
 * @param {HTMLElement} button - L'élément HTML du bouton à styliser.
 */
export function buttonStyle(button) {
    button.style.backgroundColor = "white"
    button.style.border = "solid #1D6154 1px";
    button.style.borderRadius = "60px"
    button.style.height = "37px"
    button.style.minWidth = "100px"
    button.style.fontFamily = "Syne";
    button.style.fontSize = "16px";
    button.style.fontWeight = "700";
    button.style.color = "#1D6154"
    button.style.margin = "50px 0px"

    // Change la couleur au survole de la sourie
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = "#1D6154"
        button.style.color = "white"
    })
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = "white"
        button.style.color = "#1D6154"
    })
}