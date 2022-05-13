/*on récupère la liste des products*/
fetch("http://localhost:80/api/products")
.then((res) => res.json())
.then((data) => {
   return addProduct(data)
})
    

/*on retourne l'url associée à une id en particulier
(le premier objet [0] de l'array)*/
/*************************************************************
* Fonction principale utilisant deux fonctions accessoires****
*************************************************************/
function addProduct(data){
    const id = data[0]._id
    /* selectbyid aurait également pu fonctionner pour aller chercher #items.
    queryselector est plus généraliste, il ne fonctionne pas qu'avec les ID. */
    const anchor = createAnchor(id)
    appendchildren(anchor)
}

/************************
*Fonctions accessoires**
***********************/
/* Création de l'anchor en fonction de l'id */
function createAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}
/* On vérifie qu'il existe bien un item, puis on le lie à l'anchor */
function appendchildren(anchor){
    const items = document.querySelector ("#items")
    if (items != null) {
    items.appendChild(anchor)
    }
}