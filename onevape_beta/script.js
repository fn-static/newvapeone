let cart = [];
const products = [
    { name: "Jednorazówka XYZ", price: 10 },
    { name: "Jednorazówka ABC", price: 15 }
];

function addToCart(productIndex) {
    cart.push(products[productIndex]);
    updateCart();
}

function removeFromCart(productIndex) {
    cart.splice(productIndex, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalCostElement = document.getElementById('total-cost');
    cartItems.innerHTML = '';

    let totalCost = 0;

    cart.forEach((product, index) => {
        totalCost += product.price;
        const productElement = document.createElement('div');
        productElement.innerHTML = `${product.name} - ${product.price} PLN <button onclick="removeFromCart(${index})">Usuń</button>`;
        cartItems.appendChild(productElement);
    });

    totalCostElement.innerText = totalCost;

    if (cart.length > 0) {
        renderPayPalButton(totalCost);
    } else {
        document.getElementById('paypal-button-container').innerHTML = '';
    }
}

function renderPayPalButton(totalCost) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalCost.toString()
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transakcja zakończona: ' + details.payer.name.given_name);
                clearCart();
            });
        }
    }).render('#paypal-button-container');
}
