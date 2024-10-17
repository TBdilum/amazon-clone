import { cart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./Utils/money.js";
import { removeFromCart } from "../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "../data/delivery.js";

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = products.find(product => product.id === productId);
    const deliveryOptionId = cartItem.deliveryOptionsId; // Make sure this is correct
    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId); // Use find for clarity

    let dateString = 'Unavailable'; // Default in case deliveryOption is not found
    if (deliveryOption) {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        dateString = deliveryDate.format('dddd, MMMM D');
    }

    if (matchingProduct) {
        cartSummaryHTML += `
         <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image" src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>
              ${deliveryOptionsHTML(cartItem)}
            </div>
          </div>
        `;
    }
});

function deliveryOptionsHTML(cartItem) {
    let html = `
        <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
    `;

    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        const priceString = deliveryOption.priceCents === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)}`;

        // Ensure the deliveryOptionsId is correctly referenced
        const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

        html += `
            <div class="delivery-option">
                <input 
                    ${isChecked ? 'checked' : ''}
                    type="radio" 
                    class="delivery-option-input" 
                    name="delivery-option-${cartItem.productId}" 
                    value="${deliveryOption.priceCents}">
                <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                </div>
            </div>
        `;
    });

    html += `</div>`; // Close the delivery-options div
    return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
    });
});
