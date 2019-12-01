$(document).ready(function() {
    runManager();
    $("#addbutton").on("click", function() {
        $("#addModal").modal("show");
    });

    $("#addItem").on("click", function() {
        addItemToDB();
        $("#addModal").modal("hide");
        runManager();
    });
});
// runs the main program
function runManager() {
    //gets all entries in db on initial page load
    $.get("/api/products", function(data) {
        $("#tableData").empty();
        for (let i = 0; i < data.length; i++) {
            displayProduct(data[i]);
        }
        addButton(data);
    });
    //get all entries when all tab is clicked
    $("#all").on("click", function() {
        $.get("/api/products", function(data) {
            $("#tableData").empty();
            for (let i = 0; i < data.length; i++) {
                displayProduct(data[i]);
            }
            addButton(data);
        });
    });
    // gets only the low entries (less than 5)
    $("#low").on("click", function() {
        $.get("/api/products/low", function(data) {
            $("#tableData").empty();
            for (let i = 0; i < data.length; i++) {
                displayProduct(data[i]);
            }
            addButton(data);
        });
    });
}
//adds a new item to the db
function addItemToDB() {
    const newItem = {};
    newItem.product_name = $("#product_name")
        .val()
        .trim();
    newItem.department_name = $("#department_name")
        .val()
        .trim();
    newItem.price = $("#price")
        .val()
        .trim();
    newItem.stock_quantity = $("#stock_quantity")
        .val()
        .trim();

    $.ajax({
        method: "POST",
        url: "/api/products",
        data: newItem
    }).then(function(results) {
        console.log(results);
    });

    console.log(newItem);
}
// adds the buttons to each item in the table.
function addButton(data) {
    $(".inventory-form").on("submit", function() {
        event.preventDefault();

        const itemQuantity = parseInt($("input[name=quantity]", this).val());
        const currentProduct = data.find(x => x.id === parseInt(this.id));
        console.log(currentProduct.id);
        addToInventory(itemQuantity, currentProduct.id);
        $("#tableData").empty();
        runManager();
    });
}
//adds a quantity of a product to the DB
function addToInventory(quantity, product) {
    const string = "/api/products/" + product;
    console.log(string);
    $.ajax({
        method: "PUT",
        url: string,
        data: { units: quantity }
    }).then(function(results) {
        console.log(results);
    });
}
// jquery to add table rows to the table
function displayProduct(unit) {
    let row = `<tr>
    <th scope="row">${unit.id}</th>
    <td>${unit.product_name}</td>
    <td>${unit.department_name}</td>
    <td>${unit.price}</td>
    <td>${unit.stock_quantity}</td>
    <td>
                <form class="form-control-sm inventory-form form-group form-inline" id=${unit.id}>
                        <input class="add-item" name="quantity" type="textarea">
                        <input type="submit" value="add" class="btn btn-primary btn-sm">
                </form>
    </td>
    
  </tr>`;

    $("#tableData").append(row);
}