//1
/*on récupère la liste des products grâce à fetch, on attend
la response grace à .then, puis on y applique la fonction 
json pour la rendre utilisable, puis on attend encore d'obtenir
la réponse data, avant d'appeler la fonction addProduct crée
plus bas, avec la liste des products en paramètre. */

fetch("http://localhost:80/api/products")
.then((res) => res.json())
.then((data) => addProduct(data));

//2
/******************************************************
on retourne les différentes informations concernant****
l'article par le biais d'une grosse fonction employant*
plusieurs autres fonctions annexes.********************
******************************************************/



/******************************************************************
* Fonction principale utilisant plusieurs fonctions accessoires****
******************************************************************/

function addProduct(data){

    /* Boucle forEach pour appliquer la fonction à tous les objets de data.
    Plus lisible, et appropriée dans le contexte, car on ne cherche pas à appliquer
    la boucle dans des conditions particulières. Il faut simplement traverser tout l'array data.
    selectedKanap représente chaque item que la boucle va rencontrer dans data.*/
    data.forEach((selectedKanap) => {


    //On crée toutes les constantes nécessaires à l'exécution des fonctions ci-dessous,
    //en une ligne grâce au destructuring, en les renommant de manière plus spécifique grâce
    //à const {variable: nouveaunomvariable, etc} = selectedArray

    const { _id: selectedKanap__id, imageUrl: selectedKanap_imageUrl, altTxt: selectedKanap_altTxt, name: selectedKanap_name, description: selectedKanap_description  } = selectedKanap;

    //Ainsi, on a pris la valeur de chaque element dans l'array data et
    //on les a transférées en une seule fois sur nos constantes _id, imageUrl etc.
    //Les noms de nos constantes et des objets datakanap sont identiques, mais il
    // ne faut pas pour autant les confondre. On aurait pu leur donner un autre nom
    //moins générique que celui déjà présent dans data.

    const selectedKanap_anchor = createAnchor(selectedKanap__id)
    /*Refactoring : on crée l'article directement
    ici sans passer par une fonction secondaire, ce 
    qui prenait plusieurs lignes pour pas grand-chose. */
    const selectedKanap_article = document.createElement ("article");

    const selectedKanap_image = createImage( selectedKanap_imageUrl, selectedKanap_altTxt);
    const selectedKanap_h3 = createH3(selectedKanap_name);
    const selectedKanap_p = createParagraph(selectedKanap_description);

    appendElementsToArticle(selectedKanap_article, selectedKanap_image, selectedKanap_h3, selectedKanap_p);
    appendArticleToAnchor(selectedKanap_anchor, selectedKanap_article);

    } )
}


/**********************************************************************************
*FONCTIONS ACCESSOIRES (pourquoi plusieurs petites fonctions ? Parce que cela nous*
*permet, ensuite, de corriger, de modifier, et même de comprendre plus facilement *
*l'ensemble du code.)**************************************************************
**********************************************************************************/

/******************************************
* fonction pour créer l'anchor selon l'id *
******************************************/

function createAnchor(_id) {
    const anchor = document.createElement("a");
    anchor.href = "./product.html?id=" + _id;
    return anchor;
}

/********************************************************************************
* fonction pour vérifier qu'il existe bien un item, puis pour le lier à l'anchor*
********************************************************************************/
/* J'ai lu sur internet que vérifier si une variable n'était pas nulle avant d'appliquer
des méthodes dessus est une bonne pratique. Utile ou pas ? */

function appendArticleToAnchor(anchor, article){
    const items = document.querySelector ("#items");
    /* selectbyid aurait également pu fonctionner pour aller chercher #items.
    queryselector est plus généraliste, il ne fonctionne pas qu'avec les ID. */
    if (items != null) {
    items.appendChild(anchor);
    anchor.appendChild(article);
    }
}


/********************************************************************************
* fonction pour appender les éléments à l'intérieur de l'article ******************
********************************************************************************/
function appendElementsToArticle(article, image, h3, p) {
    /* On utilise append au lieu d'appendChild pour mettre image, h3 et p
    en une seule ligne à l'intérieur d'article. */
    article.append(image, h3, p);
}


/*****************************************************************************
*fonction pour créer l'image de chaque kanap en lui associant un texte alt.***
*****************************************************************************/

function createImage(imageUrl, altTxt){
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    return image;
}

/*************************************************
*fonction pour créer H3 et lui donner une class***
*************************************************/

function createH3(name) {
    const h3 = document.createElement("h3");
    h3.textContent = name;
    h3.classList.add("productName");
    return h3;
}

/*************************************************
*fonction pour créer un paragraphe et lui donner**
*une classe***************************************
*************************************************/

function createParagraph(description) {
    const p = document.createElement("p");
    p.textContent = description;
    p.classList.add("productDescription");
    return p;
}