let order = {};
let total = 0;
$(document).ready(function() {
    runStore();
});

function runStore() {
    order = {};
    total = 0;
    $(".products").empty();
    $(".total").text("00.00");
    $.get("/api/products", function(data) {
        const products = data;
        for (let i = 0; i < data.length; i++) {
            displayProduct(data[i]);
        }

        $(".product-form").on("submit", function() {
            event.preventDefault();

            const itemQuantity = parseInt($("input[name=quantity]", this).val());
            const currentProduct = products.find(x => x.id === parseInt(this.id));
            $(`#help-${currentProduct.id}`).empty();
            if (!itemQuantity) {
                $(`#help-${currentProduct.id}`).text("please input a valid number");
            } else if (!checkAvailable(currentProduct, itemQuantity)) {
                $(`#help-${currentProduct.id}`).text(
                    "sorry there arent enough of those for you to order"
                );
            } else {
                addToTotal(currentProduct, itemQuantity);
                addToOrder(currentProduct, itemQuantity);
            }
        });

        $("#cartbutton").on("click", function() {
            $("#cart-list").empty();
            for (let key in order) {
                const currentProduct = products.find(x => x.id === parseInt(key));
                const listItem = $("<li>");
                const addedPrice = order[key] * currentProduct.price;
                listItem.html(`<b>${currentProduct.product_name}</>: ${addedPrice}`);
                $("#cart-list").append(listItem);
            }
            $("#cartModal").modal("show");
        });
        $("#checkout").on("click", function() {
            $("#cartModal").modal("hide");
            updateDB(order);

            $("#checkedOutModal").modal("show");
        });
    });
}

function updateDB(order) {
    $.ajax({
        method: "PUT",
        url: `/api/products`,
        data: order
    }).then(function(results) {
        runStore();
    });
}

//gets the total price for an order
function addToTotal(item, units) {
    total += Number((item.price * units).toFixed(2));

    $(".total").text(total);
}
//adds items to the order
function addToOrder(item, units) {
    if (!order[item.id]) {
        order[item.id] = 0;
    }
    order[item.id] += units;
}

//function for check availablity
function checkAvailable(item, units) {
    if (!order[item.id]) {
        order[item.id] = 0;
    }

    const quantity = item.stock_quantity - order[item.id];

    if (quantity - units >= 0) {
        return true;
    } else {
        return false;
    }
}

// function for displaying data
function displayProduct(data) {
    const product = $("<div>");

    let body = `
    
    <div class="card w-95">
        <div class="card-header">
            <div class="row">
                <div class="col-9">
                    <h2>${data.product_name}</h2>
                 </div>
                <div class="col-3">
                    <h2 style="text-align:right" >$ ${data.price} </h2>
                 </div>
            </div>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-9">
                    <h5 class="card-title">QTY: ${data.stock_quantity}</h5>
                    <p class="card-text">Department: ${data.department_name}</p>
                </div>`;

    if (data.stock_quantity > 0) {
        body += `<div class="col-3">
                    <form class="product-form form-group" id=${data.id}>
                        <input class="form-control" name="quantity" type="textarea">
                        <input type="submit" value="add to cart" class="btn btn-primary btn-block">
                        <p id="help-${data.id}" class="form-text text-muted">
</p>
                    </form>
                   
                </div>
              
                
            </div>
       
        </div>
    </div>`;
    } else {
        body += `<div class="col-2">
            product is currently unavailable
         </div>
        </div>
</div>

</div>
`;
    }
    product.append(body);
    product.addClass("product-holder");

    $(".products").append(product);
}