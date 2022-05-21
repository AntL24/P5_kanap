//1
/*on récupère la liste des products grâce à fetch,
on y applique la fonction json pour la rendre utilisable,
puis on appelle la fonction addProduct crée plus bas, avec
la liste des products en paramètre. */

fetch("http://localhost:80/api/products")
.then((res) => res.json())
.then((data) => addProduct(data))

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
    la boucle dans des conditions particulières. Il faut simplement traverser tout l'array data*/
    data.forEach((datakanap) => {

    /*const _id = data[0]._id
    const imageUrl = data[0].imageUrl
    const altTxt = data[0].altTxt
    const name = data[0].name
    const description = data[0].description*/

    //On résume le tout ci-dessous en une ligne 
    const { _id, imageUrl, altTxt, name, description } = datakanap
    //Ainsi, on a pris la valeur de chaque objet dataCanapé dans l'array data et
    //on les a transférées en une seule fois sur nos constantes.

    const anchor = createAnchor(_id)
    /*Refactoring : on crée l'article directement
    ici sans passer par une fonction secondaire, ce 
    qui prenait plusieurs lignes pour pas grand-chose. */
    const article = document.createElement ("article")

    const image = createImage(imageUrl, altTxt)
    const h3 = createH3(name)
    const p = createParagraph(description)

    appendElementsToArticle(article, image, h3, p)
    appendArticleToAnchor(anchor, article)
    })
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
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + _id
    return anchor
}

/********************************************************************************
* fonction pour vérifier qu'il existe bien un item, puis pour le lier à l'anchor*
********************************************************************************/

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
* fonction pour append les éléments à l'intérieur de l'article ******************
********************************************************************************/
function appendElementsToArticle(article, image, h3, p) {
    /* On utilise append au lieu d'appendChild pour mettre image, h3 et p
    en une seule ligne à l'intérieur d'article. */
    article.append(image, h3, p)
}


/******************************
*fonction pour créer l'image (préciser pour ne pas passer pour un con)***
******************************/

function createImage(imageUrl, altTxt){
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

/*************************************************
*fonction pour créer H3 et lui donner une class***
*************************************************/

function createH3(name) {
    const H3 = document.createElement("H3")
    H3.textContent = name
    H3.classList.add("productName")
    return H3
}

/*************************************************
*fonction pour créer un paragraphe et lui donner**
*une classe***************************************
*************************************************/

function createParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}