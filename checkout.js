
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");


function updateCart() {
    cartList.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.quantity} ks - ${item.price * item.quantity} Kč`;
        cartList.appendChild(listItem);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.innerText = totalPrice;
}


document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const payment = document.getElementById("payment").value;

    // Simulate order processing
    alert(`Děkujeme, ${name}! Vaše objednávka byla odeslána.`);
    
    
    localStorage.removeItem("cart");
    cart = [];
    updateCart();

    
    window.location.href = "index.html";
});


updateCart();
