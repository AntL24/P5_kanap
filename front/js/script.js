/*on récupère la liste des products*/
fetch("http://localhost:80/api/products")
/*on retourne une url en particulier
(le premier objet [0] de l'array)*/
.then((res) => res.json())
.then((data) => addProduct(data))
    

function addProduct(data){
    const imageUrl = data[0].imageUrl
    const anchor = document.createElement("a")
    anchor.href = imageUrl
    anchor.text = "canapé1"
    /* selectbyid aurait également pu fonctionner pour aller chercher #items.
    queryselector est plus généraliste, il ne fonctionne pas qu'avec les ID. */
    const items = document.querySelector ("#items")
    if (items !=null) {
        items.appendChild(anchor)
    }
}