/* adding a function to the string object to capitalize first letter */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

/* adding a function to the string object to make string plural */
String.prototype.pluralize = function() {
  if (this.charAt(this.length - 1) != 's') {
    return this + 's';
  }
  return this;
}

/* object to keep track of what item is currently selected */
var selected = {
  name: "",
  price: 0,
  domSelected: null,
  prevSelected: []
};

/* object to keep track of totals */
var totals = {
  taxRate: 0.083,
  taxes: 0,
  subtotal: 0,
  grandTotal: 0
};

/* run this code when document is done loading */
$(document).ready(function() {
  /* make API call to retrieve menu when document is ready */
  $.get("https://galvanize-eats-api.herokuapp.com/menu" , function(data) {
    /* load menu dom elements to page */
    var myMenu = {};
    var $menuDom = $('.menu');
    for (var i = 0; i < data.menu.length; i++) {
      myMenu[data.menu[i].type] = [];
    }
    for (var i = 0; i < data.menu.length; i++) {
      myMenu[data.menu[i].type].push(data.menu[i]);
    }

    /* for each type of food on menu, create a list of items */
    for (var key in myMenu) {
      var html = "";
      var title = key.capitalize().pluralize();
      html += '<h4>' + title +'</h4>';
      /* for each type of item append list to DOM */
      for (var i = 0; i < myMenu[key].length; i++) {
        html += '<div class="menuItem">';
        html += '<p class="itemName">' + myMenu[key][i].name + '</p>';
        html += '<p class="itemPrice">' + myMenu[key][i].price + '</p>';
        html += '</div>';
      }
      $menuDom.append(html);
    }

    /* highlight first menu item */
    var $firstDiv = $('.menu > div:first-of-type');
    $firstDiv.css('background-color', 'rgb(175,186,213)');
    selected.domSelected = $firstDiv;
    selected.name = $firstDiv[0].children[0].innerText;
    selected.price = $firstDiv[0].children[1].innerText;

    /* click handler for all menu items*/
    $('.menuItem').click(highlightSelected);
  });

  /* click handler for add item button */
  $('.addButton').click(addItem);

  /* click handler for deliver button */
  $('.deliverButton').click(sendDelivery);

  /* end document ready */
});

/* function to handle the selection of menu items */
function highlightSelected() {
  /* unhighlight current selected */
  selected.domSelected.css('background-color', 'white');

  /* change selected */
  if(event.target.className === 'itemName' ||
        event.target.className === 'itemPrice') {
    selected.domSelected = $(event.target.parentElement);
    selected.name = event.target.parentElement.children[0].innerText;
    selected.price = event.target.parentElement.children[1].innerText;
  }
  else {
    selected.domSelected = $(event.target);
    selected.name = event.target.children[0].innerText;
    selected.price = event.target.children[1].innerText;
  }

  /* highlight item to select */
  selected.domSelected.css('background-color', 'rgb(175,186,213)');
}

/* function to add item to list */
function addItem() {
  if (!$('.addItemForm')[0].checkValidity()) {
    alert("The quantity must be between 1 and 99");
  }
  event.preventDefault();
  var quantity = $('#quantity').val();
  var html = "";

  for (var i = 0; i < quantity; i++) {
    html += '<div class="addedItem">';
    html += '<div class="addedName">' + selected.name + '</div>';
    html += '<div class="addedPrice">' + selected.price + '</div>';
    html += '</div>';
    selected.prevSelected.push({name: selected.name, price: selected.price});
  }

  $('.selectedItems').append(html);
  $('#quantity').val(1);

  /* now update totals to reflect this */
  updateTotals(quantity);
}

/* function to update the totals area at bottom of list */
function updateTotals(num) {
  totals.subtotal += selected.price * num;
  totals.subtotal = Number(totals.subtotal.toFixed(2));
  totals.taxes = (totals.subtotal * totals.taxRate).toFixed(2);
  totals.grandTotal = (totals.subtotal * (1 + totals.taxRate)).toFixed(2);
  $('.subtotal p:nth-of-type(2)').text('$' + totals.subtotal);
  $('.tax p:nth-of-type(2)').text('$' + totals.taxes);
  $('.grandTotal p:nth-of-type(2)').text('$' + totals.grandTotal);
}


/* function to send a POST request with form data and selected data */
function sendDelivery() {
  var name = $('#name').val();
  var phone =$('#phone').val();
  var address = $('#address').val();

  if (name === "" || phone === "" || address === "") {
    alert("You cannot leave a field blank");
    return false;
  }

  var data = {
    name: name,
    phoneNumber: phone,
    address: address,
    orderedItems: selected.prevSelected
  };

  $.post("https://galvanize-eats-api.herokuapp.com/orders",
              JSON.stringify(data), function(result) {
    alert(result + '\nYour order has been placed.');
    window.location.href = '../index.html';
  });
  return true;
}
