//1
/*on récupère la liste des products*/

fetch("http://localhost:80/api/products")
.then((res) => res.json())
.then((data) => {
   return addProduct(data)
})

//2
/******************************************************
on retourne les différentes informations concernant****
l'article par le biais d'une grosse fonction employant*
plusieurs autres fonctions annexes.********************
******************************************************/



/*************************************************************
* Fonction principale utilisant deux fonctions accessoires****
*************************************************************/


function addProduct(data){

    /*const id = data[0]._id
    const imageUrl = data[0].imageUrl
    const altTxt = data[0].altTxt
    const name = data[0].name
    const description = data[0].description*/

    //On résume le tout en une ligne (voir ci-dessus pour le détail)

    //On prend la valeur des clefs de l'objet "data" et les transfère
    //en une seule fois sur nos constantes.
    const { id, imageUrl, altTxt, name, description } = data[0]

    const anchor = createAnchor(id)
    /*Après refactoring, on crée l'article directement
    ici sans passer par une fonction secondaire. */
    
    const article = document.createElement ("article")
    const image = createImage(imageUrl, altTxt)
    const h3 = createH3(name)
    const p = createParagraph(description)

    appendElementsToArticle(article, image, h3, p)
    appendArticleToAnchor(anchor, article)
}

function appendElementsToArticle(article, image, h3, p) {
    /* On utilise append au lieu d'appendChild pour mettre image, h3 et p
    en une seule ligne à l'intérieur d'article. */
    article.append(image, h3, p)
}



/***********************
*FONCTIONS ACCESSOIRES**
***********************/


/******************************************
* fonction pour créer l'anchor selon l'id *
******************************************/
function createAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}

/********************************************************************************
* fonction pour vérifier qu'il existe bien un item, puis pour le lier à l'anchor*
********************************************************************************/

function appendArticleToAnchor(anchor, article){
    const items = document.querySelector ("#items")
    /* selectbyid aurait également pu fonctionner pour aller chercher #items.
    queryselector est plus généraliste, il ne fonctionne pas qu'avec les ID. */
    if (items != null) {
    items.appendChild(anchor)
    anchor.appendChild(article)
    console.log("éléments ajoutés à items", items)
    }
}


/******************************
*fonction pour créer l'image***
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