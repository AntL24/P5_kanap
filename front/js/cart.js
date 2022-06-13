//Unique constante globale : le panier, "cart"
const cart = [];
//////////////////////
//Appels de fonction//
//////////////////////

updateCartWithData();//Cette fonction ajoute toutes les informations nécessaires dans le cart.
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));//On ajoute l'event listener pour appeler la fonction submitForm quand on clique sur le bouton "commander"

/////////////////////////////////
//Liste des fonctions appelées///
/////////////////////////////////

/*1ère fonction principale : on transfère les items dans l'array cart*/
function updateCartWithData() {
getItemsFromLocalStorageToCart();
const numberOfProducts = cart.length;
    for (let i = 0; i < numberOfProducts; i++) {
            let numberedProductPrice = 0;
            //on récupère l'id de chaque produit dans le cart 
            const productId = cart[i].id;
            fetch(`http://localhost:3000/api/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
            numberedProductPrice += data.price;
            for (const element of cart) {
                if (element.id === productId) {
                    const price= numberedProductPrice;
                    element.price = price.toString();
                }
            }
        })
        //On appelle ensuite displayItem pour afficher le prix du produit
        .then(() => displayItem(cart[i]));
    }
}
//Fonction pour passer les informations contenus dans le localstorage dans l'array cart
function getItemsFromLocalStorageToCart () {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i));
        const itemObject = JSON.parse(item); /* "parse" fait le contraire de "stringify" : il prend une string JSON et rend un objet */
        cart.push(itemObject); /* on ajoute à l'array vide "cart" ci-dessus les différents objets que la "for" loop nous récupère */
    }
}
/*2ème fonction principale : création d'article, avec à l'intérieur une div avec une child image, */
function displayItem(item) {
    const article = giveArticle(item);
    const divAndImage = giveDivAndImage(item);
    article.appendChild(divAndImage);

    const cartItemContent = giveCartItemContent(item);
    article.appendChild(cartItemContent);

    displayArticle(article);
    calculateTotalQuantity(item);
    calculateTotalPrice(item);
}


//Fonctions secondaires pour les différents éléments de chaque article
function giveArticle(item) {
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = item.id;
    article.dataset.color = item.colors;
    return article;
}
function giveDivAndImage(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item__img")
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.altTxt;
    div.appendChild(image);
    return div;
}
function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article);
}

/*Fonctions Affichage du contenu pour chaque article (la description, et les 
settings qui permettent d'ajuster la qté)*/

function giveCartItemContent(item){
    const cartItemContent = document.createElement("div");
    cartItemContent.classList.add("cart__item__content");

    const description = giveDescription(item);
    const settings =  giveSettings(item);

    cartItemContent.appendChild(description);
    cartItemContent.appendChild(settings);
    return cartItemContent;
}
/*Affichage description : lorem, titre et prix. */
function giveDescription(item){
    const description = document.createElement("div");
    description.classList.add("cart__item__content__description");

    const h2 = document.createElement("h2");
    h2.textContent = item.name;
    const p = document.createElement("p");
    p.textContent = item.colors;
    const p2 = document.createElement("p");
    p2.textContent = item.price + " €";

    description.append(h2, p, p2);
    return description;
}
/*Settings div qui accueille les fonctions pour ajuster la quantité*/
function giveSettings(item){
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings 
}
/*Ajuster la qté dans la fonction giveSettings*/
function addQuantityToSettings(settings, item){
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté: "
    quantity.appendChild(p)

    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.maxLength = "100"

    input.addEventListener('input', () => updateQtyAndPrice(item.id, input.value, item));

    //On s'assure que la qté ne dépasse pas 100 quelque soit la méthode employée par l'internaute
    input.addEventListener('change', validateMax);
    input.addEventListener('input', validateMax);
    input.addEventListener('keyup', validateMax);
    input.addEventListener('paste', validateMax);
    
    quantity.appendChild(input)
    settings.appendChild(quantity)
}

/*Supprimer qté dans la fonction giveSettings*/
function addDeleteToSettings(settings, item){
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener('click', function () {deleteItem(item)})

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}
//Fonctions pour calculer la quantité totale et le prix total
function calculateTotalQuantity(){
    //On sélectionne la span avec l'id totaQuantity
    const totalQuantity = document.querySelector("#totalQuantity");
    //On calcule la quantité totale avec la fonction reduce.
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    //On affiche la quantité totale.
    totalQuantity.textContent = total;
}
function calculateTotalPrice(){
    const totalPrice = document.querySelector("#totalPrice")
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    /* la fonction reduce permet de réduire la taille du code.
    On lui donne total et item en paramètres, une valeur initiale de 0, et on lui
    demande de traverser l'array cart en ajoutant à chaque item rencontré
    le price multiplié par la quantity de l'item au total qui vaut 0 au départ de la fonction.*/
    totalPrice.textContent = total;
}

/////////////////////////////////////////////////////////////////////////////////////
//Fonctions qui permetent de mettre à jour la quantité et le prix d'un item//////////
//après avoir été appelée par l'event listener que l'on a placé sur l'input de qty///
/////////////////////////////////////////////////////////////////////////////////////
function updateQtyAndPrice(id, newQtyInput, item){
    //On récupère l'item et tous ses autres attributs dans le tableau cart
    const itemToBeUpdated = cart.find(item => item.id === id);
    //supérieur ou égal à 100
    if (Number(newQtyInput) <= 100) {
    //On modifie la quantité de l'item avec la value de l'input qui se trouve en param de la fonction
    itemToBeUpdated.quantity = Number(newQtyInput);
    //On transfère l'attribut quantity de la variable itemToBeUpdated vers l'item
    item.quantity = itemToBeUpdated.quantity;
    //On met à jour le total price et le total quantity
    calculateTotalPrice();
    calculateTotalQuantity();
    //On met à jour le localStorage en lui passant l'item dont la quantity vaut désormais
    //le nombre tapé dans l'input.
    changeDataInLocalStorage(item);
    }
    else{
        //On prévient l'internaute qu'il doit entrer une valeur inférieure ou égale à 100
        AlertmessageIfQtyTooMuch(newQtyInput);
        //On change la valeur de l'input pour lui donner le max (100)
        newQtyInput = Number(100);
        item.quantity = newQtyInput;
        calculateTotalPrice();
        calculateTotalQuantity();
        changeDataInLocalStorage(item);
    }  
}
//Fonction qui permet de stringifier la nouvelle qté de l'item puis d'ajouter cette qté dans le localStorage
function changeDataInLocalStorage(item){
    //on recrée la constante color idColor_key qui contient l'id de l'item et la couleur de l'item
    const colorIdKey = `${item.id}_${item.colors}`;
    //if(item.quantity <= 100){
    const newData = JSON.stringify(item);
        localStorage.setItem(colorIdKey, newData);
    //}
}
//Console log d'alerte pour chaque item si l'on rentre une item.quantity supérieure à 100
//Pourquoi ne s'affiche que pour le premier item ?
function AlertmessageIfQtyTooMuch(itemQuantity){
    if(itemQuantity > 100){
        alert("Vous ne pouvez pas acheter plus de 100 exemplaires d'un article.");
    }
}
//On passe la qté à 100 si l'input rentré est une qté supérieure à la valeur max (100)
function validateMax() {
    //if (this.max) this.value = Number(kanapQuantity);*/
    if (this.max) this.value = Math.min(parseInt(this.max), parseInt(this.value) || 0);
}
//Fonctions deleteItem et deleteDataInLocalStorage() permettant de supprimer un item du panier
//avec l'event listener
function deleteDataInLocalStorage(item){
    const colorIdKey = `${item.id}_${item.colors}`;
    localStorage.removeItem(colorIdKey);
}
function deleteItem(item){
    const itemToBeDeleted = cart.findIndex (
    product => product.id === item.id && product.colors === item.colors
    );
    cart.splice(itemToBeDeleted, 1);
    calculateTotalPrice();
    calculateTotalQuantity();
    deleteArticleFromPage(item);
    deleteDataInLocalStorage(item);
}
function deleteArticleFromPage(item){
    const articleToBeDeleted = document.querySelector(
    `[data-id="${item.id}"][data-color="${item.colors}"]`);
    articleToBeDeleted.remove();
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//Fonctions rendre le formulaire opérationnel avec la requête POST, et un système de fonctions///
//permettant de vérifier que les informations saisies sont toutes au bon format./////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
      alert("Veuillez ajouter au moins un article au panier.")
      return;
    }
    //On vérifie que les champs obligatoires sont remplis et que l'email
    //est sous une forme correcte
    if (isFirstNameInputInvalid()) return;
    if (isLastNameInputInvalid()) return;
    if (isStreetAddressInvalid ()) return;
    if (isCityAndPostalCodeInvalid ()) return;
    if (isEmailInvalid()) return;
    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
    //On utilise la méthode POST pour envoyer les données
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    //On récupère le résultat de la requête
      .then((res) => res.json())
      .then((data) => {
        const orderId = data.orderId;
        window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId;
        return console.log(data);
    })
      //Afficher l'erreur dans la console s'il y en a une
      .catch((err) => console.error(err));
}

////////////////////////////////////////////////////////////////////////////////////////////
//Fonctions pour tester le formulaire avec regex sur les input d'adresses mail et postale///
////////////////////////////////////////////////////////////////////////////////////////////

//On vérifie la présence d'informations correctes dans les champs nom et prénom.
function isFirstNameInputInvalid() {
    const firstnaminput = document.querySelector("#firstName");
    const regex = /^[a-zA-Z\-]+$/;
    if (regex.test(firstnaminput.value) === false) {
        alert("Format prénom incorrect");
        return true;
    }
    return false;
}
function isLastNameInputInvalid() {
    const nameInput = document.querySelector("#lastName");
    const regex = /^[a-zA-Z\-]+$/;
    if (regex.test(nameInput.value) === false) {
        alert("Format nom incorrect");
        return true;
    }
    return false;
}
//On vérifie la présence d'un numéro et d'un nom de rue.
function isStreetAddressInvalid() {
    const streetAdressInput = document.querySelector("#address");
    //Regex pour un numéro de rue entre 0 et 9999, avec un espace, puis un nom de rue.
    //On permet à l'internaute de ne rentrer qu'un nom de rue (il existe des rues sans numéro, en France).
    const regex = /([0-9]{0,}) ?([A-zÀ-ú,' -\. ]{1,})/;
    if (regex.test(streetAdressInput.value) === false) {
        alert("Veuillez saisir un numéro et/ou un nom de rue. Ex : 10 QUAI DE LA CHARENTE ou QUAI DE LA CHARENTE");
        return true;
    }
    return false;
}
//On vérifie la présence d'un code postal et d'un nom de ville.
function isCityAndPostalCodeInvalid() {
    const city = document.querySelector("#city").value;
    //Regex pour le code postal et le nom de la ville
    const regex = /([0-9]{5,}) ?([A-zÀ-ú,' -\. ]{1,})([0-9]{0,})/;
    if (regex.test(city) === false) {
      alert("Veuillez entrer un code postal puis un nom de ville valides. Exemple : 60700 Pont-Sainte-Maxence, ou 75019 PARIS 19");
      return true;
    }
    return false;
}
//On vérifie le format de l'email.
function isEmailInvalid() {
    const email = document.querySelector("#email").value;
    //RegEx (commence par ^ et finit par $)
    //pour vérifier la forme de l'email (un @, un . etc)
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (regex.test(email) === false) {
      alert("Veuillez entrer une adresse email valide");
      return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////////////////////
//Fonctions pour créer le corps de la requête POST avec les données du panier//
///////////////////////////////////////////////////////////////////////////////
  function makeRequestBody() {
    const form = document.querySelector(".cart__order__form");
    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const address = form.elements.address.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;
    const body = {
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
      },
      products: getIdsFromCache()
    }
    return body;
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  //Fonction pour récupérer les IDs des produits dans le localStorage puis les insérer/////
  //Dans un array "ids" ; cette fonction est employée dans makeRequestBody() pour//////////
  //afficher la liste des ids des produits commandés par l'internaute. ////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function getIdsFromCache() {
    const numberOfProducts = localStorage.length;
    const ids = [];
    for (let i = 0; i < numberOfProducts; i++) {
      const key = localStorage.key(i);
      const id = key.split("_")[0];
      ids.push(id);
    }
    return ids;
  }