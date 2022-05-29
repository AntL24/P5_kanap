const cart = [];

getItemsFromLocalStorageToCart(); /*Fonction pour prendre les items dans le local storage, en faire des objets, puis les enregistrer dans l'array cart */
cart.forEach((item) => displayItem(item)); /*Créer l'affichage des différents items en appelant pour chaque item (forEach) la fonction composite displayItem */

/*On transfère les items dans le cart*/
function getItemsFromLocalStorageToCart () {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i));
        const itemObject = JSON.parse(item); /* "parse" fait le contraire de "stringify" : il prend une string JSON et rend un objet */
        cart.push(itemObject); /* on ajoute à l'array vide "cart" ci-dessus les différents objets que la "for" loop nous récupère */
    }
}


/* */
function displayItem(item) {
    const article = giveArticle(item);
    const divAndImage = giveDivAndImage(item);
    article.appendChild(divAndImage);

    const cartItemContent = giveCartItemContent(item);
    article.appendChild(cartItemContent);

    displayArticle(article);
    displayTotalPrice(item);

}

function displayTotalPrice(item){
    /*let total = 0;*/
    const totalPrice = document.querySelector("#totalPrice")
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0) /* Reduce permet de réduire la taille du code.
    On lui donne total et item en paramètres, total valant 0, et on lui demande de traverser l'array cart en ajoutant à chaque item rencontré
    le price multiplié par la quantity de l'item au total = 0 de départ  */

   /* cart.forEach(item => {
       const totalItemPrice = item.price * item.quantity
       total += totalItemPrice*/
       totalPrice.textContent = total;
    /*})*/


    /*
    const itemOne = cart[0]
    const itemOneTotalQuantity = itemOne.quantity * itemOne.price;
    console.log(itemOneTotalQuantity)*/
}

function giveCartItemContentDiv(){
    const div = document.createElement("div");
    div.classList.add("cart__item__content");
}

function giveCartItemContent(item){
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = giveDescription(item)
    const settings =  giveSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent

}

function  giveDescription(item){
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name
    const p = document.createElement("p")
    p.textContent = item.colors;
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.append(h2, p, p2)
    return description
    /*
    div.appendChild(description)
    return div*/
}

function giveSettings(item){
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")
    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings)
    return settings 
}

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

    quantity.appendChild(input)
    settings.appendChild(quantity)
}

function addDeleteToSettings(settings){
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}


function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article);
}

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






