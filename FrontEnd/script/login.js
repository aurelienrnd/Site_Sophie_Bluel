/********************************************************* 
 *    Affiche est gère les évènements de la page login   *
 *********************************************************
 */

 export function loginDisplay() {
    const loginPage = document.getElementById("main-login")
    loginPage.innerHTML = `
    <h2>login</h2>
    <form>
        <label for="email">E-mail</label>
        <input type="email">
        <label for="pasword">Mot de passe</label>
        <input type="texte">
        <button>Se connecter</button>
    <form>
    <a>Mot de passe oublié</a>
    `
 };