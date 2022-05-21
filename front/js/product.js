const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")

fetch(`http://localhost:80/api/products/${id}`)
    .then ((response) => response.json())
    .then ((res) => handleData(res))

function handleData(selected_kanap){
    const { imageUrl, colors, price, altTxt, name, description} = selected_kanap
    makeImage(imageUrl, altTxt)
    giveTitle(name)
    givePrice(price)
    giveDescription(description)
    giveColors(colors)
}

function makeImage(imageUrl, altTxt){
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
    if (select != null)

    colors.forEach((color) => {
        const option = document.createElement("option")
        option.value = color
        option.textContent = color
        select.appendChild (option)
    })
}