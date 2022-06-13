//////////////////////
//Appels de fonction//
//////////////////////

const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

/////////////////////////////////
//Liste des fonctions appelées///
/////////////////////////////////

//On récupère l'id de la commande dans l'url
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}
//On affiche l'id de la commande dans le texte de la page
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}
//On supprime tous les éléments du localStorage
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}