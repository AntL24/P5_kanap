const queryString = window.location.search;
/*1) window représente une fenêtre contenant le dom (lequel est une représentation schématique de la page web ; ou arbre de dom).*/
/*2).href aurait donné toute l'url. search donne la query string, qui est la partie de l'url après "?", dont le rôle est d'assinnier certaines valeurs
aux paramètres spécifiés.*/
/*3) On obtient la query string grâce à window.location.search, puis on extrait les paramètres grâce à new URLSearchparams */
const urlParams = new URLSearchParams(queryString);
/*4)On cherche en particulier, dans urlParams, l'id, et on l'assigne à la variable du même nom : id.*/
const selectedKanap_id = urlParams.get("id");
/* On va chercher les données correspondant à l'idée de la page produit qui s'affichage,
puis on lance la fonction  product_page_data sur les données au format json pour les afficher sur la page */
fetch(`http://localhost:3000/api/products/${selectedKanap_id}`) /*"${xxx}" est une string interpolation*/
    .then ((response) => response.json())
    .then ((res) => product_page_data(res));

/**********************************************************
*1ère Fonction principale, pour remplir la page du produit*
**********************************************************/
function product_page_data(selected_kanap){
    /* Comme dans script.js, on prend les différentes valeurs des objets de selected_kanap,
    puis on les passe dans les fonctions correspondantes. */
    const {
        colors: selectedKanap_colors,
        price: selectedKanap_price, 
        imageUrl: selectedKanap_imageUrl,
        altTxt: selectedKanap_altTxt, 
        name: selectedKanap_name, 
        description: selectedKanap_description,
    } = selected_kanap;
    
    giveImage(selectedKanap_imageUrl, selectedKanap_altTxt);
    giveTitle(selectedKanap_name);
    givePrice(selectedKanap_price);
    giveDescription(selectedKanap_description);
    giveColors(selectedKanap_colors);
}
/*****************************************************************************************
**1ères Fonctions secondaires qui récupèrent les éléments associés à la page produit******
où l'on se trouve*************************************************************************
*****************************************************************************************/
function giveImage(imageUrl, altTxt){
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = altTxt;
    const parent = document.querySelector(".item__img");
    parent.appendChild(image);
}
function giveTitle(name){
    const h1 = document.querySelector('#title');
    h1.textContent = name;
}
function givePrice(price){
    const span = document.querySelector('#price');
    span.textContent = price;
}
function giveDescription(description){
    const p = document.querySelector('#description');
    p.textContent = description;
}
function giveColors(colors){
const select = document.querySelector('#colors');
//Boucle forEach pour créer une option et l'appender à l'élément
//select pour chaque color de colors.
    colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        select.appendChild(option);
    })
}

/***************************************************************************************
*2ème Fonction principale, un event listener qui emploie actionOnClick quand on clique**
*sur ajouter au panier******************************************************************
***************************************************************************************/
const button = document.querySelector("#addToCart");
button.addEventListener("click", actionOnClick);
/*La fonction actionOnClick crée les constantes nécesssaires que l'on affectera ensuite
au sein de data, puis dans le local storage via localStorage.setItem en stringifiant les
données. */
function actionOnClick () {
    /* On sélectionne la div contenant l'image, pour ensuite aller chercher la src et l'alt
    de l'img grâce à firstElementChild. */
    const imgContainerDiv = document.getElementsByClassName('item__img');
    const selectedKanap_imageUrl = imgContainerDiv[0].firstElementChild.src;
    const selectedKanap_altTxt = imgContainerDiv[0].firstElementChild.alt;
    //On va chercher le nom et les couleurs sur le document.
    const selectedKanap_name = document.querySelector('#title').textContent;
    const selectedKanap_colors = document.querySelector('#colors').value;
    /*Grâce au string interpolation, on enregistrera le kanap avec un clef différente en
    fonction de la couleur*/
    const selectedKanap_idColor_key = `${selectedKanap_id}_${selectedKanap_colors}`;
    /*On s'assure que le selectedKanap n'existe pas déjà dans cette couleur, auquel cas on
    additionne les deux quantités pour prendre en compte la nouvelle commande sans écraser
    l'ancienne. */
    const selectedKanap_totalQuantity= update_selectedKanap_quantity_ifAlreadyExist(selectedKanap_idColor_key);


    //On ajoute le tout à la constante selectedKanap_data.
    const selectedKanap_data = {
        id: selectedKanap_id,
        colors: selectedKanap_colors,
        /*Dans le local storage, on récupère un nombre au lieu d'une string grâce à
        l'enveloppe objet (ou wrapper) "number"*/
        quantity: Number(selectedKanap_totalQuantity),
        imageUrl : selectedKanap_imageUrl,
        altTxt : selectedKanap_altTxt,
        name : selectedKanap_name,
        };


    /* On appelle successivement les trois sous-fonctions suivantes pour vérifier la valeur
    de la commande, enregistrer la commande, puis rediriger l'internaute vers son panier. */
    if (isCartValueInvalid(selectedKanap_colors, selectedKanap_totalQuantity)) return;
    /*Grace au return, si la commande est invalide, il n'y a pas de redirection vers le
    panier : la fonction addEvenListener s'arrête là. */
    saveCart(selectedKanap_idColor_key, selectedKanap_data);
    cartRedirection();
} 

/******************************************************************************************
**2èmes Fonctions secondaires, pour ajouter proprement notre produit et ses paramètres au**
**localstorage*****************************************************************************
******************************************************************************************/
//Vérifions s'il existe déjà un kanap avec la même couleur dans le panier, afin de
//mettre à jour la quantité de selecKanap_quantity sans l'écraser.
function update_selectedKanap_quantity_ifAlreadyExist(idColor_key){
    const selectedKanap_quantity = document.querySelector('#quantity').value;
    const sameKanapInLocalStrg = JSON.parse(localStorage.getItem(idColor_key));
    /* "parse" fait le contraire de "stringify" : il prend une string JSON et rend un objet */
    if (sameKanapInLocalStrg != null) {
        //on s'assure que la qty dans le local storage n'excède jamais 100 pour l'item choisi.
        //si l'internaute essaie de choisir plus de 100, on lui donne la valeur max.
        if (Number(sameKanapInLocalStrg.quantity) + Number(selectedKanap_quantity) > 100) {
            alert ("Maximum d'exemplaires atteint pour ce produit");
            sameKanapInLocalStrg.quantity = 0;
            return 100;
        }
        const quantity = sameKanapInLocalStrg.quantity;
        const newQuantity = Number(quantity) + Number(selectedKanap_quantity);
        selectedKanap_updatedQuantity = newQuantity;
        return selectedKanap_updatedQuantity;
    }
    else{
        return selectedKanap_quantity;
    }
}
/*message d'alerte au cas où aucune valeur n'est saisie avant d'ajouter au panier (pas plus
*de 100 unitées aussi) */
function isCartValueInvalid(colors, quantity){
    if (colors == null || colors === "" || quantity == null || quantity == 0){
        alert ("Veuillez choisir une couleur et un nombre d'articles valides");
        /*"return true" nécessaire pour que la vérification du "if" ci-dessus puisse se faire
        lors de l'appel de la fonction. */
        return true;
    }
    if (quantity > 100){
        alert ("100 exemplaires maximum par produit");
        return true;
   }
}
/*enregistrer prix / qté / couleur etc (contenus dans la constante data) au sein du localstorage*/
function saveCart(idColor_key, data) {
    /* stringifier data est nécessaire pour pouvoir 
    afficher nos données dans le local storage (on
    obtient ainsi une liste de clefs associées à des
    valeurs).*/ 
    localStorage.setItem(idColor_key, JSON.stringify(data));
}
//redirection sur la page panier 
function cartRedirection(){
    window.location.href = "cart.html";
}