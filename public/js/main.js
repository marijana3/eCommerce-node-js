//GLOBAL
var products = [];
var cartItems = [];
var cart_n = document.getElementById('cart_n');

//DIVS
var bookDIV = document.getElementById('bookDIV');
var mugDIV = document.getElementById('mugDIV');
var notebookDIV = document.getElementById('notebookDIV');


//ANIMATION
function animation() {
    const toast=swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000
    });
    toast({
        type: 'succes',
        title: 'Added to shopping cart'
    });
}

//CART FUNCTIONS
function cart(name, price, url){
    console.log('Before calling cart2');
    let qty = document.getElementById("qty" + name).value; 
    let totalPrice = qty*price;
    cart2(name, totalPrice, url, qty);
    animation();
}
function cart2(name, price, url, qty){
    console.log('Adding to cart');
    var item = {
        name: name,
        price: price,
        url: url,
        qty: qty
    }
    cartItems.push(item);
    let storage = JSON.parse(localStorage.getItem("cart"));
    if (storage == null) {
        products.push(item);
        localStorage.setItem("cart", JSON.stringify(products));
    } else {
        products = JSON.parse(localStorage.getItem("cart"));
        products.push(item);
        localStorage.setItem("cart", JSON.stringify(products));
    }
    products = JSON.parse(localStorage.getItem("cart"));
    cart_n.innerHTML = `[${products.length}]`;
}


(()=>{
    
    if (localStorage.getItem("cart") == null) {

    } else {
        products = JSON.parse(localStorage.getItem("cart"));
        cart_n.innerHTML = `${products.length}`;
    }
})();
