(function navTop() {
  /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
  function navToggle() {
    var x = document.querySelector(".js-topnav-mobile-nav").parentNode;//#myTopnav
    if (x.className === "topnav-mobile-nav" ) {
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

  document.querySelectorAll(".js-topnav-mobile-nav-mobile-toggle").forEach(element => {
    element.addEventListener('click', navToggle);
  });
  document.querySelectorAll(".js-topnav-mobile-nav-mobile-toggle-share").forEach(element => {
    element.addEventListener('click', (e) => {
			navToggleShare();
			e.preventDefault()
		},false );
	});

		


})();




  //Variables

  const cartBtn = document.querySelector('.cart-btn');
  const closeCartBtn = document.querySelector('.close-cart');
  const clearCartBtn = document.querySelector('.clear-cart');
  const cartDOM = document.querySelector('.cart');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartItems = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');
  const itineraryDOM = document.getElementById("bucket-list");
	const cartContent = document.querySelector('.cart-content');
	const cartImoji = document.querySelector(".cart-imoji")


  //main cart : where we will be placing all of our information <= Local Storage etc.
  let cart = [];

	//buttons 
	let buttonsDOM = [];
	//Imoji
	let imoji = cartImoji.firstChild;
	
	//products 
  class Products {
		getProducts(){

			let products = [...document.querySelectorAll('.bag-btn')]
			products = products.map(item => {

				const {itemId,itemPrice,itemFiveStarPrice,itemThreeStarPrice,itemCampBasic,itemName,itemImage,itemDescription, itemLocation,itemUrl} = item.dataset;
				return {itemId,itemPrice,itemFiveStarPrice,itemThreeStarPrice,itemCampBasic, itemName, itemImage,itemDescription,itemLocation, itemUrl};
			} );	
			return products;
			
		}
		
		
	}
  //Desplay Products: UI
  class UI {

		getButtons(){		
			const buttons = [...document.querySelectorAll('.bag-btn')];
			buttonsDOM = buttons;

			buttons.forEach(button => {
				let id = button.dataset.itemId;
				let inCart = cart.find(item => item.itemId === id)
				if(inCart){
					button.innerText= "👍 IN BUCKET!"
					button.disabled = true;

				}		
			button.addEventListener("click", (event) => {
				event.target.innerText = "👍 IN BUCKET!";
				event.target.disabled = true;

				//get product from storage
				let cartItem = {...Storage.getProduct(id), amount: 1};
				//console.log(cartItem)
				
				//add product to a cart
				cart = [...cart, cartItem];
				
				//save cart in local storage
				Storage.saveCart(cart)
				//set cart values
				this.setCartValues(cart)
				//display cart item
				this.addCartItem(cartItem)
				//show the cart
				
				this.showCart()
			})
				
			})
		}

		setCartValues(cart){
			//let tempTotal = 0;
			let itemsTotal= 0;
			cart.map(item => {
				//tempTotal += item.itemPrice * item.amount;
				itemsTotal += item.amount;
			})
			cartItems.innerText = itemsTotal;
			cartTotal.innerText = itemsTotal;
			if(itemsTotal == 0){
				imoji.textContent = "👎";
			}else {
				imoji.textContent = "👍";
			}
		}

		addCartItem(item){
			const div = document.createElement("fieldset");
			const itineraryDestination = item.itemName+ "  \t📢 "+ item.itemLocation
			let list = "";


			
			list = "✅ "+ itineraryDestination + "\n"

			itineraryDOM.value += list;

			div.classList.add("cart-item");
			
			

			//cartContent.prepend(packageNode);
			
			div.innerHTML = `

				<label for="package" >
					<h3 class="article-title flex"> <small class="best-price"> 🏷️<mark>$${item.itemPrice}</mark></small> ${item.itemName}  <span class="lc-adress"> <b> <small>📢 place </small> <span class="place tilt-lft"><a class="place-link" href="#"> <mark> ${item.itemLocation} ️</mark></a> </b> </span> </span> </h3>
				</label>

				<div class="flex flex-btn modal-form-label form-col-2">
					<label for="duration"> Duration
						<span><br> <input form="form1" type="text"  name="important_note" placeholder="2-nights / daytrip" required> </span>
					</label>
				
					<label for="accomodation-options"> Accomodation Options
					<span>  <br> <input form="form1" type="checkbox"  name="accomodation-options">Five Star 🌟 ( ${item.itemFiveStarPrice}) </input> <br> <input type="checkbox"  name="accomodation-options" > 3-4 Star ⭐ ( ${item.itemThreeStarPrice} )</input> <br> <input type="checkbox"  name="accomodation-options" > I will Camp ⛺ ( ${item.itemCampBasic})  </input>  </span>
					</label>
				
				</div>
				<span class="remove-item" data-id=${item.itemId}> remove </span>
					
			`;


			

		}

		showCart(){
			cartOverlay.classList.add("transparentBcg")
			cartDOM.classList.add("showCart")
		}

		setupApp(){
			cart = Storage.getCart();
			this.setCartValues(cart);
			this.populateCart(cart);
			cartBtn.addEventListener("click",this.showCart)
			closeCartBtn.addEventListener("click", this.hideCart)

		}

		populateCart(cart){
			cart.forEach(item => this.addCartItem(item));
		}
		hideCart(){
			cartOverlay.classList.remove("transparentBcg")
			cartDOM.classList.remove("showCart")

		}

		cartLogic(){
			
			//clearCart Button
			clearCartBtn.addEventListener("click", () =>{
				this.clearCart(); 		})
				
			//Cart Functionality
			cartContent.addEventListener("click", event => {
				
				if(event.target.classList.contains("remove-item")){
					let removeItem = event.target;
					let id = removeItem.dataset.id;
					cartContent.removeChild(removeItem.parentNode);
					this.removeItem(id)
				}
			})
		}
		clearCart(){

			let cartItems = cart.map(item => item.itemId);
	
			
			itineraryDOM.value = "";
			cartItems.forEach(id => {
				this.removeItem(id); 
				while(cartContent.children.length > 0){
					cartContent.removeChild(cartContent.children[0])



				}
			})
			this.hideCart();
		}

		removeItem(id){
			cart = cart.filter(item => item.itemId !== id)
			this.setCartValues(cart);
			Storage.saveCart(cart);
			//window['location'].replace(location); //Hack Close Cart dont work
			let button = this.getSingleButton(id);
			button.disabled = false;
			button.innerText = "ADD TO BUCKET";
			

		}
		getSingleButton(id){
			return buttonsDOM.find(button => button.dataset.itemId === id)

		}
	}
	
  //Local Storage 
  class Storage {
		static saveProducts(products){
			localStorage.setItem("products", JSON.stringify(products));
		}

		static getProduct(id){
			let products = JSON.parse(localStorage.getItem("products"))
			return products.find(product => product.itemId === id);
		}

		static saveCart(cart){
			localStorage.setItem("cart", JSON.stringify(cart))
		}

		static getCart(){
			return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
		}

	}
	

  document.addEventListener("DOMContentLoaded", () => {

    const ui = new UI();
		const products = new Products();
		
		//setup application
		
		ui.setupApp();
		ui.getButtons();
		//gets all products
		products.getProducts();
		Storage.saveProducts(products.getProducts());
		ui.cartLogic();
		
		

  });


(function imageCorousel(){
	let images = [], arrows = [];
	let prevImg = {val: ""}, nextImg = {val: ""}, currentImg;
	
	window.addEventListener('load', function() {
	
		let promise = new Promise((resolve) => {
	
			images = document.querySelectorAll(".slide");
			updImgClasses(images[0]);
			resolve();
		});
	
		promise.then(() => {
	
			arrows = [
				{
					element: document.querySelector(".arrow.arrow_prev"),
					curImgTempClassname: "slide_prev-left",
					newImgTempClassname: "slide_current-right",
					newImg: nextImg,
					unusedImg: prevImg
				},
				{
					element: document.querySelector(".arrow.arrow_next"),
					curImgTempClassname: "slide_prev-right",
					newImgTempClassname: "slide_current-left",
					newImg: prevImg,
					unusedImg: nextImg
				}
			];
	
			arrows.forEach((item) => {
				item.element.addEventListener('click', () => {
					arrowClickHandler(item);
				});
			});
		});
	});
	
	function updImgClasses(curImg){
	
		currentImg = curImg;
		currentImg.setAttribute("class", "slide slide_current");
		
		switch(curImg){
	
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
	};
	
	function arrowClickHandler(thisArrow){
	
		document.querySelectorAll(".arrow").forEach((item) => {
			item.classList.add("arrow_disabled");
		});
	
		currentImg.classList.add(thisArrow.curImgTempClassname);
		thisArrow.newImg.val.classList.add(thisArrow.newImgTempClassname);
	
		setTimeout(() => {
			currentImg.classList = "";
			thisArrow.unusedImg.val.setAttribute("class", 'slide');
			updImgClasses(thisArrow.newImg.val);
	
			document.querySelectorAll(".arrow").forEach((item) => {
				item.classList.remove("arrow_disabled");
			});
	
		}, 500);
	};
	
	
})();


//CONTENT PANELS 


(function contentPanels() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i+1].addEventListener("click", function () {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active-panel");
      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      }
      else {
        panel.style.display = "block";
      }
    });
  }
})();