import { menuArray } from './data.js'

const menuEl = document.getElementById('main__menu')
const orderEl = document.getElementById('order')
const totalPriceEl = document.getElementById('total__price')
const completeOrderEl = document.getElementById('complete__order')
const totalOrder = document.getElementById('total__order')
const modal = document.getElementById('modal')
const successMsg = document.getElementById('success__sms')
const errorMsg = document.getElementById('error__sms')

let orderArray = []
let totalPrice = 0

document.addEventListener('click', (e) => {
    if(e.target.dataset.id){
        handleAddClick(e.target.dataset.id)//*itemId
    } else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.id === 'btn__order'){
        completeOrder()
    } else if (e.target.id === 'modal__close__btn'){
        closeModal()
    } else if (e.target.id === 'submit-btn'){
        e.preventDefault()
        makePayment()
    }
})

function closeModal(){
    modal.style.display = 'none'
}

function handleAddClick(itemId){//*e.target.dataset.id

    let targetObject = menuArray.find((item) => item.id == itemId)//*e.target.dataset.id

    //gestione quantità articoli nel carrello
    if(!orderArray.includes(targetObject)){
        orderArray.push(targetObject)
        targetObject.quantity = 1
    } else {
        targetObject.quantity++
    }

    //gestione prezzo totale ordine
    totalPrice += targetObject.price
    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`

    //render tutti i div necessari
    if(orderArray.length > 0) {
        orderEl.classList.remove('hidden')
        totalOrder.classList.remove('hidden')
        totalPriceEl.classList.remove('hidden')
        completeOrderEl.classList.remove('hidden')
    }
    // console.log(orderArray)
    render()
}

function handleRemoveClick(itemId) {

    let targetObject = menuArray.find((item) => item.id == itemId)

    if(targetObject.quantity > 1){
        targetObject.quantity--
    } else {
        orderArray = orderArray.filter(item => item.id != itemId)
        //funzione restituisce un array con solo gli item.id diversi da itemId
    }

    totalPrice -= targetObject.price
    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`

    if(orderArray.length < 1) {
        orderEl.classList.add('hidden')
        totalOrder.classList.add('hidden')
        totalPriceEl.classList.add('hidden')
        completeOrderEl.classList.add('hidden')
    }
    // console.log(orderArray)
    render()
}

function showItemCard(){
    let orderHtml = `<p class="order__heading">Your order</p>`

    orderArray.forEach( item => {
        orderHtml+= `
            <p class="order__paragraph">
                ${item.name}
                <span class="order-emoji">${item.emoji}</span>
                <span>X</span>
                <span>${item.quantity}</span>
                <button class="remove" data-remove="${item.id}">remove</button>
                <span>$${(item.quantity * item.price).toFixed(2)}</span>
            </p>
        `
    })

    return orderHtml
}

function completeOrder(){
    modal.style.display = 'block'
}

function makePayment(){
    if(cardName.value && cardNumber.value && cardCvv.value){
        modal.style.display = "none"
        orderEl.classList.add('hidden')
        totalOrder.classList.add('hidden')
        successMsg.style.display = "block"
        successMsg.innerHTML = `<p>Thanks, ${cardName.value}! Your order is on its way!</p>`
        orderEl.innerHTML = ""
        disappear()
    } else {
        errorMsg.textContent = 'Error! Please complete the form!'
    }
}

function disappear(){
    setTimeout (function(){
        successMsg.style.display = 'none'
    },3000)
}

const menu = menuArray.map( item => {
    return `
        <section class="component">
            <p class="product__emoji">${item.emoji}</p>
            <div class="product__main">
                <p class="product__title">${item.name}</p>
                <p class="product__ingredients">${item.ingredients.join(', ')}</p>
                <p class="product__price">$${item.price.toFixed(2)}</p>
            </div>
            <button class="product__btn" id="btn__product" data-id="${item.id}">+</button>
        </section>
    `
}).join('')

function render(){
    menuEl.innerHTML = menu
    orderEl.innerHTML = showItemCard()
}

render()