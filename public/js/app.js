let price = 0;
$(document).ready(function() {
    $.get("/api/products", function(data) {
        const products = data;
        for (let i = 0; i < data.length; i++) {
            displayProduct(data[i]);
        }

        $(".product-form").on("submit", function() {
            event.preventDefault();

            const itemQuantity = parseInt($("input[name=quantity]", this).val());
            const currentProduct = data.find(x => x.id === parseInt(this.id));
            if (!itemQuantity) {
                console.log("thats not a number");
            } else if (!checkAvailable(currentProduct, itemQuantity)) {
                console.log("sorry there arent enough of those for you to order");
            } else {
                addToOrder(currentProduct, itemQuantity);
                updateDB(currentProduct, itemQuantity);
            }
        });
    });
});

function updateDB(item, units) {
    console.log(units);
    $.ajax({
        method: "PUT",
        url: `/api/products/${item.id}`,
        data: { units }
    }).then(function(results) {
        console.log(results);
    });
}

//adds items to the order
function addToOrder(item, units) {
    price += item.price * units;
    console.log(price);
}

//function for check availablity
function checkAvailable(item, units) {
    const quantity = item.stock_quantity;

    if (quantity - units >= 0) {
        return true;
    } else {
        return false;
    }
}

// function for displaying data
function displayProduct(data) {
    const product = $("<div>");
    product.html(`<p>
    product: ${data.product_name}
    department: ${data.department_name}
    price: ${data.price}
    quantity: ${data.stock_quantity}
    </p>
    
    <form class="product-form" id=${data.id}>
        <input name="quantity" type="textarea">
        <input type="submit" value="add to cart" class="add">
    </form>`);
    product.addClass("product-holder");

    $(".products").append(product);
}