// The document.ready call is used to display the elements that should
// be visible as soon as the page loads.
$(document).ready(function () {
    // This method is called to display all the items in the database.
    loadItems();
    // Their should be zero cash in the vending machine when the page is rendered.
    $("#money-amount-field").val('0.00');
});

// Method for the "Add Dollar" button to insert $1.00
// into the vending machine.
$("#addDollar").on("click", function () {
   // Retrieve the current amount of money.
    var currentVal = $("#money-amount-field").val();
    // Increment the amount of money based on the amount being inserted.
    var newVal = Number(currentVal) + 1.00;
    // Round up the value to the nearest hundred place.
    $("#money-amount-field").val(newVal.toFixed(2));
})

// Method for the "Add Quarter" button to insert $0.25
// into the vending machine.
$("#addQuarter").on("click", function () {
    // Retrieve the current amount of money.
    var currentVal = $("#money-amount-field").val();
    // Increment the amount of money based on the amount being inserted.
    var newVal = Number(currentVal) + 0.25;
    // Round up the value to the nearest hundred place.
    $("#money-amount-field").val(newVal.toFixed(2));
})

// Method for the "Add Dime" button to insert $0.10
// into the vending machine.
$("#addDime").on("click", function () {
    // Retrieve the current amount of money.
    var currentVal = $("#money-amount-field").val();
    // Increment the amount of money based on the amount being inserted.
    var newVal = Number(currentVal) + 0.10;
    // Round up the value to the nearest hundred place.
    $("#money-amount-field").val(newVal.toFixed(2));
})

// Method for the "Add Nickel" button to insert $0.05
// into the vending machine.
$("#addNickel").on("click", function () {
    // Retrieve the current amount of money.
    var currentVal = $("#money-amount-field").val();
    // Increment the amount of money based on the amount being inserted.
    var newVal = Number(currentVal) + 0.05;
    // Round up the value to the nearest hundred place.
    $("#money-amount-field").val(newVal.toFixed(2));
})

// Method for giving change back when the "Change Return" button is clicked.
$("#giveChange").on("click", function () {
    // Call to method to give change back.
    changeReturn();
    // Empty the fields for displaying messages and items.
    $("#messages-field").val('');
    $("#item-field").val('');
    // Reset the amount of money currently in the vending machine.
    $("#money-amount-field").val('0.00');
})

// Method for purchasing items when the "Make Purchase" button is clicked.
$("#makePurchase").on("click", function () {
  // Create two variables: one set to the amount of money in the vending machine
  // and the other to the id of the item.
  var amount = $("#money-amount-field").val();
  var id = $("#ItemIDS").val();

  // Make an AJAX call to the database to retrieve the necessary components needed for everything to display.
  $.ajax({
    // The type of API method call will be of "POST" as data is being sent to the server.
     type: 'POST',
     // Use the provided url in the instructions and use the variables created at the top, for the {amount, id} pieces.
     url: 'http://tsg-vending.herokuapp.com/money/' + amount + '/item/' + id,
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
     },
     // The data being sent in will be of type JSON.
     'dataType': 'json',
     // Should no errors being encountered create a block of code
     // that will be executed upon success.
     'success': function(change) {
       // Retrieve the amount of quarters, dimes, nickels, and pennies
       // from the database server.
       var quarters = change.quarters;
       var dimes = change.dimes;
       var nickels = change.nickels;
       var pennies = change.pennies;
       // Call the method used for displaying the exact amount of change
       // that is calcuated when purchasing an item using more money than needed.
       purchaseChange(quarters, dimes, nickels, pennies);
       // Set the message input field to say "Thank You!!!"
       var message = $("#messages-field").val("Thank You!!!");
       // Refresh the items, so that the quantity left is updated.
       loadItems();
       // Reset the cash in the machine.
       $("#money-amount-field").val('0.00');
     },
     // If an error is encountered, retrieve the error message that is stored
     // in the server, and have the associated error message be displayed in the
     // messages field.
     error: function(xhr, status, error) {
				var errorMessage = jQuery.parseJSON(xhr.responseText);
           		$('#messages-field').val(errorMessage.message);
              // Refresh the item list.
           		loadItems();

        // Have an error be displayed in the event that their is a problem
        // connecting to the web service.
				$('#errorMessages')
					.append($('<li>')
					.attr({class: 'list-group-item list-group-item-danger'})
					.text('Error calling web service. Please try again later.'));
			}

});
});

// Function used to load the items stored in the database into
// the webpage.
function loadItems() {
    // Empty the items table when the page renders, so that it is not displaying duplicate entries.
    $('.item').empty();
    // Create a variable to store all the components in each table column.
    var itemList = $('.item');

    // Make an AJAX call to the database to retrieve the necessary components needed for everything to display.
    $.ajax({
       // Since data is being retrieved, the API method type will be of "GET".
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        // Should everything function properly, loop through the data server
        // and store the JSON component fields into the apporiate fields.
        success: function(itemArray) {
            $.each(itemArray, function(index, item){
                //retrieve and store the values
                var itemID = item.id;
                var name = item.name;
                var price = item.price.toFixed(2);
                var quantity = item.quantity;

                // Use a combination of HTML and JavaScript commands to layout and display all the item information.
                var items = '<div class="items col-md-3" id="item' + itemID + '" onclick="displayID('+itemID + ')"><p>';
                items += itemID;
                items += '<br>';
                items += '<div style = "text-align:center">' + name;
                items += '<br>';
                items += '<div style = "margin-top:10px">';
                items += "$" + price;
                items += '<br><br>';
                items += "Quantity Left: " + quantity;
                items += '</div></p></div>';
                itemList.append(items);
            })
        },
        // Have an error be displayed in the event that their is a problem
        // connecting to the web service.
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    });


}


// Function for displaying an items' ID.
function displayID(itemID) {
  // When an item is clicked on have its ID be displayed in the items field.
   $("#item-field").val(itemID);
   // Add the item ID to the item IdHolderDiv.
   $('#ItemIDS').val(itemID);
   // Reset the change, if any change is being returned.
   $("#change-field").val('');
}

// Function used to handle formatting and returning change after
// making a purchase.
function purchaseChange(quarters, dimes, nickels, pennies) {
   // Create an empty string variable, that will later be used
   // to store the amount of change given back.
   var change = "";
   // Add together the total amount of coins from the parameters.
   var totalCount = quarters + dimes + nickels + pennies;

   // Subtract the amount of quarters from the total amount.
   totalCount -= quarters;
   // Create a branch of if and else-if statements to
   // handle multiple conditions, such as if only one quarter is given back
   // in change, or if any more coins are given back.
   if(quarters == 1 && totalCount == 0) {
     change += quarters + ' Quarter ';
   } else if (quarters == 1 && totalCount > 0) {
     change += quarters + ' Quarter, ';
   } else if (quarters > 1 && totalCount == 0) {
     change += quarters + ' Quarters ';
   } else if (quarters > 1 && totalCount > 0) {
     change += quarters + ' Quarters, ';
   }

   // Subtract the amount of dimes from the total amount.
   totalCount -= dimes;
   // Create a branch of if and else-if statements to
   // handle multiple conditions, such as if only one dime is given back
   // in change, or if any more coins are given back.
   if(dimes == 1 && totalCount == 0) {
     change += dimes + ' Dime ';
   } else if (dimes == 1 && totalCount > 0) {
     change += dimes + ' Dime, ';
   } else if (dimes > 1 && totalCount == 0) {
     change += dimes + ' Dimes ';
   } else if (dimes > 1 && totalCount > 0) {
     change += dimes + ' Dimes, ';
   }
   // Subtract the amount of nickels from the total amount.
   totalCount -= nickels;
   // Create a branch of if and else-if statements to
   // handle multiple conditions, such as if only one nickel is given back
   // in change, or if any more coins are given back.
   if(nickels == 1 && totalCount == 0) {
     change += nickels + ' Nickel ';
   } else if (nickels == 1 && totalCount > 0) {
     change += nickels + ' Nickel, ';
   } else if (nickels > 1 && totalCount == 0) {
     change += nickels + ' Nickels ';
   } else if (nickels > 1 && totalCount > 0) {
     change += nickels + ' Nickels, ';
   }

   // See if only penny or multiple pennies are being returned.
   if(pennies == 1) {
     change += pennies + ' Penny ';
   } else if (pennies >= 2) {
     change += pennies + ' Pennies ';
   }

   // Display the amount of change the user is given back.
   $("#change-field").val(change);

}


// This function will handle returning change, only when the "Change Return" button
// is pressed and not for handling change returned from purchases.
function changeReturn() {
  // Get the amount of money and cast it to a number.
   var total = $("#money-amount-field").val();
   var totalMoney = Number(total);
   // Round up the total money value to the nearest hundreth.
   totalMoney = totalMoney.toFixed(2);
   // Create variables for counting the amount of coins that will be returned
   // of a specific type.
   var quarterCount = 0;
   var dimeCount = 0;
   var nickelCount = 0;
   var pennyCount = 0;

   // Perform a while-loop to see how many quarters are returned.
   while (totalMoney - 0.25 >= 0) {
     quarterCount += 1;
     totalMoney = totalMoney - 0.25;
     totalMoney = totalMoney.toFixed(2);
   }
   // Perform a while-loop to see how many dimes are returned.
   while (totalMoney - 0.10 >= 0) {
     dimeCount += 1;
     totalMoney = totalMoney - 0.10;
     totalMoney = totalMoney.toFixed(2);
   }
   // Perform a while-loop to see how many nickels are returned.
   while (totalMoney - 0.05 >= 0) {
     nickelCount += 1;
     totalMoney = totalMoney - 0.05;
     totalMoney = totalMoney.toFixed(2);
   }
    // Perform a while-loop to see how many pennies are returned.
   while (totalMoney - 0.01 >= 0) {
     pennyCount += 1;
     totalMoney = totalMoney - 0.01;
     totalMoney = totalMoney.toFixed(2);
   }
  // Call the purchaseChange function to handle the rest of this code's functionality.
  purchaseChange(quarterCount, dimeCount, nickelCount, pennyCount);

}
