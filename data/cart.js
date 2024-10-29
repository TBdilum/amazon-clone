import { deliveryOptions } from "./delivery.js";

export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionsId: '1'
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionsId: '2'
    }];
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    const matchingItem = cart.find(cartItem => cartItem.productId === productId);

    if (matchingItem) {
        matchingItem.quantity += 1; // Increment existing item's quantity
    } else {
        cart.push({
            productId: productId,
            quantity: 1, // Add new item with quantity 1
            deliveryOptionsId: '1'
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    cart = cart.filter(cartItem => cartItem.productId !== productId);
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionsId) {
    const matchingItem = cart.find(cartItem => cartItem.productId === productId);

    if (matchingItem) {
        // Check if the provided deliveryOptionsId exists
        const optionExists = deliveryOptions.some(option => option.id === deliveryOptionsId);

        if (optionExists) {
            matchingItem.deliveryOptionsId = deliveryOptionsId;
            saveToStorage();
        } else {
            console.error(`Delivery option ${deliveryOptionsId} does not exist.`);
        }
    } else {
        console.error(`Product ${productId} not found in the cart.`);
    }
};

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener('load', () => {
      console.log(xhr.response)
      fun();
    })
    xhr.open('GET' , 'https://supersimplebackend.dev/cart');
    xhr.send();
  };
