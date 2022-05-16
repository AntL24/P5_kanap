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
    const id = data[0]._id
    const imageUrl = data[0].imageUrl
    const altTxt = data[0].altTxt
    const name = data[0].name

    const image = createImage(imageUrl, altTxt)
    const anchor = createAnchor(id)
    const article = createArticle()
    const h3 = createH3(name)

    article.appendChild(image)
    article.appendChild(h3)

    appendChildren(anchor, article)
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

function appendChildren(anchor, article){
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
*fonction pour créer article***
******************************/

function createArticle() {
    const article = document.createElement ("article")
    const H3 = createH3()
    const p = createParagraph()

    //article.appendChild(image)
    //article.appendChild(H3)
    //article.appendChild(p)
    console.log(article)

    return article


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
    H3.classList.add("productname")
    return H3

}

function createParagraph() {
}