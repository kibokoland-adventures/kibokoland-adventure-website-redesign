"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function navTop() {
  /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
  function navToggle() {
    var x = document.querySelector(".js-topnav-mobile-nav").parentNode; //#myTopnav

    if (x.className === "topnav-mobile-nav") {
      x.className += " responsive";
    } else {
      x.className = "topnav-mobile-nav";
    }
  }

  function navToggleShare() {
    var x = document.querySelector(".js-topnav-mobile-nav-share").parentNode; //myTopnav-share");

    if (x.className === "topnav-mobile-nav-share") {
      x.className += " responsive";
    } else {
      x.className = "topnav-mobile-nav-share";
    }
  }

  document.querySelectorAll(".js-topnav-mobile-nav-mobile-toggle").forEach(function (element) {
    element.addEventListener('click', navToggle);
  });
  document.querySelectorAll(".js-topnav-mobile-nav-mobile-toggle-share").forEach(function (element) {
    element.addEventListener('click', function (e) {
      navToggleShare();
      e.preventDefault();
    }, false);
  });
})(); //CONTENT PANELS 


(function contentPanels() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active-panel");
      /* Toggle between hiding and showing the active panel */

      var panel = this.nextElementSibling;

      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
})(); //Variables


var cartBtn = document.querySelector('.cart-btn');
var closeCartBtn = document.querySelector('.close-cart');
var clearCartBtn = document.querySelector('.clear-cart');
var cartDOM = document.querySelector('.cart');
var cartOverlay = document.querySelector('.cart-overlay');
var cartItems = document.querySelector('.cart-items');
var cartTotal = document.querySelector('.cart-total');
var cartContent = document.querySelector('.cart-content');
var cartImoji = document.querySelector(".cart-imoji"); //main cart : where we will be placing all of our information <= Local Storage etc.

var cart = []; //buttons 

var buttonsDOM = []; //Imoji

var imoji = cartImoji.firstChild; //products 

var Products =
/*#__PURE__*/
function () {
  function Products() {
    _classCallCheck(this, Products);
  }

  _createClass(Products, [{
    key: "getProducts",
    value: function getProducts() {
      var products = _toConsumableArray(document.querySelectorAll('.bag-btn'));

      products = products.map(function (item) {
        var _item$dataset = item.dataset,
            itemId = _item$dataset.itemId,
            itemName = _item$dataset.itemName,
            itemImage = _item$dataset.itemImage,
            itemDescription = _item$dataset.itemDescription,
            itemLocation = _item$dataset.itemLocation,
            itemUrl = _item$dataset.itemUrl;
        return {
          itemId: itemId,
          itemName: itemName,
          itemImage: itemImage,
          itemDescription: itemDescription,
          itemLocation: itemLocation,
          itemUrl: itemUrl
        };
      });
      return products;
    }
  }]);

  return Products;
}(); //Desplay Products: UI


var UI =
/*#__PURE__*/
function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, [{
    key: "getButtons",
    value: function getButtons() {
      var _this = this;

      var buttons = _toConsumableArray(document.querySelectorAll('.bag-btn'));

      buttonsDOM = buttons;
      buttons.forEach(function (button) {
        var id = button.dataset.itemId;
        var inCart = cart.find(function (item) {
          return item.itemId === id;
        });

        if (inCart) {
          button.innerText = "👍 IN BUCKET!";
          button.disabled = true;
        }

        button.addEventListener("click", function (event) {
          event.target.innerText = "👍 IN BUCKET!";
          event.target.disabled = true; //get product from storage

          var cartItem = _objectSpread({}, Storage.getProduct(id), {
            amount: 1
          }); //console.log(cartItem)
          //add product to a cart


          cart = [].concat(_toConsumableArray(cart), [cartItem]); //save cart in local storage

          Storage.saveCart(cart); //set cart values

          _this.setCartValues(cart); //display cart item


          _this.addCartItem(cartItem); //show the cart


          imoji.textContent = "👍";

          _this.showCart();
        });
      });
    }
  }, {
    key: "setCartValues",
    value: function setCartValues(cart) {
      //let tempTotal = 0;
      var itemsTotal = 0;
      cart.map(function (item) {
        //tempTotal += item.itemPrice * item.amount;
        itemsTotal += item.amount;
      });
      cartItems.innerText = itemsTotal;
      cartTotal.innerText = itemsTotal;
    }
  }, {
    key: "addCartItem",
    value: function addCartItem(item) {
      var div = document.createElement("fieldset");
      div.classList.add("cart-item");
      div.innerHTML = "\n\n\t\t\t\t<legend>\n\t\t\t\t\t<h3 class=\"article-title flex\"> <small class=\"best-price\"> \uD83C\uDFF7\uFE0F<mark>$".concat(item.itemPrice, "</mark></small> ").concat(item.itemName, "  <span class=\"lc-adress\"><b><small>\uD83D\uDCE2 place </small> <span class=\"place tilt-lft\"><a class=\"place-link\" href=\"#\"> <mark> ").concat(item.itemLocation, " \uFE0F</mark></a> </b> </span> </span> </h3>\n\t\t\t\t</legend>\n\n\t\t\t\t<div class=\"flex flex-btn modal-form-label form-col-2\">\n\t\t\t\t\t<label for=\"duration\"> Duration\n\t\t\t\t\t\t<span><br> <input type=\"text\"  name=\"important_note\" placeholder=\"2-nights / daytrip\" required> </span>\n\t\t\t\t\t</label>\n\t\t\t\t\n\t\t\t\t\t<label for=\"accomodation-options\"> Accomodation Options\n\t\t\t\t\t<span>  <br> <input type=\"checkbox\"  name=\"accomodation-options\"> &amp;beyond </input> <br> <input type=\"checkbox\"  name=\"accomodation-options\" > best mid-luxury lodging </input> <br> <input type=\"checkbox\"  name=\"accomodation-options\" > I will Camp \u26FA  </input> </span>\n\t\t\t\t\t</label>\n\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<span class=\"remove-item\" data-id=").concat(item.itemId, "> remove </span>\n\t\t\t\t\t\n\t\t\t");
      cartContent.prepend(div);
    }
  }, {
    key: "showCart",
    value: function showCart() {
      cartOverlay.classList.add("transparentBcg");
      cartDOM.classList.add("showCart");
    }
  }, {
    key: "setupApp",
    value: function setupApp() {
      cart = Storage.getCart();
      this.setCartValues(cart);
      this.populateCart(cart);
      cartBtn.addEventListener("click", this.showCart);
      closeCartBtn.addEventListener("click", this.hideCart);
    }
  }, {
    key: "populateCart",
    value: function populateCart(cart) {
      var _this2 = this;

      cart.forEach(function (item) {
        return _this2.addCartItem(item);
      });
    }
  }, {
    key: "hideCart",
    value: function hideCart() {
      cartOverlay.classList.remove("transparentBcg");
      cartDOM.classList.remove("showCart");
    }
  }, {
    key: "cartLogic",
    value: function cartLogic() {
      var _this3 = this;

      //Cart Functionality
      cartContent.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item")) {
          var removeItem = event.target;
          var id = removeItem.dataset.id;
          cartContent.removeChild(removeItem.parentNode);

          _this3.removeItem(id);
        }
      }); //clearCart Button

      clearCartBtn.addEventListener("click", function () {
        _this3.clearCart();
      });
    }
  }, {
    key: "clearCart",
    value: function clearCart() {
      var _this4 = this;

      var cartItems = cart.map(function (item) {
        return item.itemId;
      });
      imoji.textContent = "👎";
      cartItems.forEach(function (id) {
        _this4.removeItem(id);

        while (cartContent.children.length > 0) {
          cartContent.removeChild(cartContent.children[0]);
        }
      });
      this.hideCart();
    }
  }, {
    key: "removeItem",
    value: function removeItem(id) {
      cart = cart.filter(function (item) {
        return item.itemId !== id;
      });
      this.setCartValues(cart);
      Storage.saveCart(cart); //window['location'].replace(location); //Hack Close Cart dont work

      var button = this.getSingleButton(id);
      button.disabled = false;
      button.innerText = "ADD TO BUCKET";
    }
  }, {
    key: "getSingleButton",
    value: function getSingleButton(id) {
      return buttonsDOM.find(function (button) {
        return button.dataset.itemId === id;
      });
    }
  }]);

  return UI;
}(); //Local Storage 


var Storage =
/*#__PURE__*/
function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, null, [{
    key: "saveProducts",
    value: function saveProducts(products) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, {
    key: "getProduct",
    value: function getProduct(id) {
      var products = JSON.parse(localStorage.getItem("products"));
      return products.find(function (product) {
        return product.itemId === id;
      });
    }
  }, {
    key: "saveCart",
    value: function saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, {
    key: "getCart",
    value: function getCart() {
      return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
  }]);

  return Storage;
}();

document.addEventListener("DOMContentLoaded", function () {
  var ui = new UI();
  var products = new Products(); //setup application

  ui.setupApp();
  ui.getButtons(); //gets all products

  products.getProducts();
  Storage.saveProducts(products.getProducts());
  ui.cartLogic();
});

(function imageCorousel() {
  var images = [],
      arrows = [];
  var prevImg = {
    val: ""
  },
      nextImg = {
    val: ""
  },
      currentImg;
  window.addEventListener('load', function () {
    var promise = new Promise(function (resolve) {
      images = document.querySelectorAll(".slide");
      updImgClasses(images[0]);
      resolve();
    });
    promise.then(function () {
      arrows = [{
        element: document.querySelector(".arrow.arrow_prev"),
        curImgTempClassname: "slide_prev-left",
        newImgTempClassname: "slide_current-right",
        newImg: nextImg,
        unusedImg: prevImg
      }, {
        element: document.querySelector(".arrow.arrow_next"),
        curImgTempClassname: "slide_prev-right",
        newImgTempClassname: "slide_current-left",
        newImg: prevImg,
        unusedImg: nextImg
      }];
      arrows.forEach(function (item) {
        item.element.addEventListener('click', function () {
          arrowClickHandler(item);
        });
      });
    });
  });

  function updImgClasses(curImg) {
    currentImg = curImg;
    currentImg.setAttribute("class", "slide slide_current");

    switch (curImg) {
      case images[0]:
        prevImg.val = images[images.length - 1];
        nextImg.val = curImg.nextElementSibling;
        break;

      case images[images.length - 1]:
        prevImg.val = curImg.previousElementSibling;
        nextImg.val = images[0];
        break;

      default:
        prevImg.val = curImg.previousElementSibling;
        nextImg.val = curImg.nextElementSibling;
    }

    prevImg.val.setAttribute("class", "slide slide_next-left");
    nextImg.val.setAttribute("class", "slide slide_next-right");
  }

  ;

  function arrowClickHandler(thisArrow) {
    document.querySelectorAll(".arrow").forEach(function (item) {
      item.classList.add("arrow_disabled");
    });
    currentImg.classList.add(thisArrow.curImgTempClassname);
    thisArrow.newImg.val.classList.add(thisArrow.newImgTempClassname);
    setTimeout(function () {
      currentImg.classList = "";
      thisArrow.unusedImg.val.setAttribute("class", 'slide');
      updImgClasses(thisArrow.newImg.val);
      document.querySelectorAll(".arrow").forEach(function (item) {
        item.classList.remove("arrow_disabled");
      });
    }, 500);
  }

  ;
})();
//# sourceMappingURL=all.js.map
