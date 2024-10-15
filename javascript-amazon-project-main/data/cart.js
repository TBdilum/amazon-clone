export const cart = []; 

export function addToCart(productId) {
    let matchingItem;

        cart.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += 1; // Increment existing item's quantity
        } else {
            cart.push({
                productId: productId,
                quantity: 1 // Add new item with quantity 1
            });
        }
};