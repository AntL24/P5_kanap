const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")

/*Les variables productPrice, imgUrl et altText seront utilisées plus bas dans la fonction secondaire "saveCart". */
let productPrice
let imgUrl, altText


/* On va chercher les données correspondant à l'idée de la page produit qui s'affichage,
puis on lance la fonction  product_page_data sur les données au format json pour les afficher sur la page */
fetch(`http://localhost:80/api/products/${id}`)
    .then ((response) => response.json())
    .then ((res) => product_page_data(res))



    
/*1 


Fonction principale pour remplir la page du produit*/

function product_page_data(selected_kanap){
    /* Comme dans script.js, on prend les différentes valeurs des objets de selectet_kanap,
    puis on les passe dans les fonctions correspondantes. */
    const { imageUrl, colors, price, altTxt, name, description } = selected_kanap
    
    productPrice = price
    imgUrl = imageUrl
    altText = altTxt
    
    giveImage(imageUrl, altTxt)
    giveTitle(name)
    givePrice(price)
    giveDescription(description)
    giveColors(colors)
   

}

/* Fonctions secondaires qui récupèrent les éléments associés à la page produit où l'on se trouve*/

function giveImage(imageUrl, altTxt){
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent!=null) parent.appendChild(image)
}

function giveTitle(name){
    const h1 = document.querySelector('#title')
    if (h1 != null) h1.textContent = name
}

function givePrice(price){
    const span = document.querySelector('#price')
    if (span != null) span.textContent = price
}

function giveDescription(description){
    const p = document.querySelector('#description')
    if (p != null) p.textContent = description
}

function giveColors(colors){
    const select = document.querySelector('#colors')
    if (select != null) {
        //Boucle forEach pour créer une option et l'appender à l'élément select pour chaque color de colors.
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild (option)
        })
    }
}


/*2 

Fonction principale event listener, qui emploie actionOnClick quand on clique sur ajouter au panier*/

const button = document.querySelector("#addToCart")
if (button != null) {
    button.addEventListener("click", actionOnClick)
    }

function actionOnClick () {
    const colors = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
    /* On appelle successivement les trois sous-fonctions suivantes pour vérifier la valeur de la commande,
    enregistrer la commande, puis rediriger l'internaute vers son panier. */
    if (isCartValueInvalid(colors, quantity)) return /*Grace au return, si la commande est invalide, il n'y a
    pas de redirection vers le panier : la fonction addEvenListener s'arrête là. */
    saveCart(colors, quantity)
    cartRedirection()
}
        
/*Fonctions secondaires pour ajouter au panier*/ 

/*enregistrer prix / qté / couleur etc dans le localstorage*/

function saveCart(colors, quantity) {
    const data = {
        id: id,
        colors: colors,
        /*Dans le local storage, on récupère un nombre au lieu
        d'une string grâce à l'enveloppe objet (wrapper) "number"*/
        quantity: Number(quantity),
        price: productPrice,
        imageUrl : imgUrl,
        altTxt : altText
    }
    /* stringifier data est nécessaire pour pouvoir 
    afficher nos données dans le local storage (on
    obtient ainsi une liste de clefs associées à des
    valeurs).*/
    localStorage.setItem(id, JSON.stringify(data))
}

/*message d'alerte au cas où aucune valeur n'est saisie avant d'ajouter au panier */
function isCartValueInvalid(colors, quantity){
    if (colors == null || colors === "" || quantity == null || quantity == 0) {
        alert ("Veuillez choisir une couleur et un nombre d'articles")
        /*"return true" nécessaire pour que la vérification du "if" ci-dessus puisse se faire lors de l'appel de la fonction. */
        return true
    }
}
/*redirection au panier */
function cartRedirection(){
    window.location.href = "cart.html"
}
