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

    // Render the PayPal button only if there are items in the cart
    if (cart.length > 0) {
        renderPayPalButton(totalCost);
    } else {
        document.getElementById('paypal-button-container').innerHTML = ''; // Clear the PayPal button container
    }
}

function renderPayPalButton(totalCost) {
    // Clear existing PayPal buttons if any
    document.getElementById('paypal-button-container').innerHTML = '';

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalCost.toFixed(2), // Używamy toFixed(2) dla precyzyjnych wartości
                        currency_code: 'PLN'
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
