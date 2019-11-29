let order = {};
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
            }
        });
    });

    $("#order").on("click", function() {
        console.log(order);
        updateDB(order);
    });
});

function updateDB(order) {
    console.log(order);
    $.ajax({
        method: "PUT",
        url: `/api/products`,
        data: order
    }).then(function(results) {
        console.log(results);
    });
}

//adds items to the order
function addToOrder(item, units) {
    if (!order[item.id]) {
        order[item.id] = 0;
    }
    order[item.id] += item.stock_quantity - units;
}

//function for check availablity
function checkAvailable(item, units) {
    if (!order[item.id]) {
        order[item.id] = 0;
    }

    const quantity = item.stock_quantity - order[item.id];
    console.log(quantity);

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
    </p>`);
    if (data.stock_quantity > 0) {
        product.append(
            `<form class="product-form" id=${data.id}>
        <input name="quantity" type="textarea">
        <input type="submit" value="add to cart" class="add">
    </form>`
        );
    } else {
        product.append(`<p class="out">sorry this product is unavailable</p>`);
    }
    product.addClass("product-holder");

    $(".products").append(product);
}