const btnScrollTo = document.querySelector(".btn--scroll-to");
const shop = document.querySelector("#shop");
const navList = document.querySelector(".nav-list");
const listProductHTML = document.querySelector(".listProduct");
const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".mini-cart span");
let cart = [];
let products = [];

const addDataToHTML = () => {
  if (products.length > 0) {
    // if has data
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `
            <div class="item-img">
              <img src="${product.image}" alt="">
            </div>
            <h4>${product.name}</h4>
            <p class="price">$${product.price}</p>
            <button class="addCart">Add To Cart</button>
              `;
      listProductHTML.appendChild(newProduct);
    });
  }
};
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;

    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let ProductInCart = cart.findIndex((value) => value.product_id == product_id);
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (ProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[ProductInCart].quantity = cart[ProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length > 0) {
    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;

      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cartItem.product_id;

      let positionProduct = products.findIndex(
        (product) => String(product.id) === String(cartItem.product_id)
      );

      // Ensure the product exists in the products list
      if (positionProduct !== -1) {
        let info = products[positionProduct];

        let itemTotalPrice = info.price * cartItem.quantity;
        totalPrice += itemTotalPrice;

        newCart.innerHTML = `
          <div>
            <img src="${info.image}" alt="${info.name}">
          </div>
          <div>
            <h4 class="product-name">${info.name}</h4>
          </div>
          <div>
            <p class="price">$${itemTotalPrice}</p>
          </div>
          <div class="quantity">
            <span class="minus">-</span>
            <p>${cartItem.quantity}</p>
            <span class="plus">+</span>
          </div>
        `;
        listCartHTML.appendChild(newCart);
      } else {
        console.error(`Product with ID ${cartItem.product_id} not found.`);
      }
    });

    // Add the total price to the HTML
    let totalPriceElement = document.createElement("div");
    totalPriceElement.classList.add("total-price-box");
    totalPriceElement.innerHTML = `
      <p>Total Price: </p>
      <p class="total-price">$${totalPrice}</p>
    `;
    listCartHTML.appendChild(totalPriceElement);
  } else {
    // if cart is empty
    listCartHTML.innerHTML = `<h5>Your cart is empty. Try to buy something ;)</h5>`;
  }

  // Update the total quantity in the cart icon
  iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;

  event.preventDefault();

  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});

const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity =
          cart[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const initApp = () => {
  // get data from JSON
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      addDataToHTML();

      // get cart from localStorage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = shop.getBoundingClientRect();

  // Smooth scrolling
  shop.scrollIntoView({ behavior: "smooth" });
});
// Page navigation
document.querySelector(".menu-list").addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

const header = document.querySelector(".header");
const navHeight = navList.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navList.classList.add("sticky");
  else navList.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Mobile navigation(menu open and close)
const btnNavEl = document.querySelector(".btn-mobile-nav");
btnNavEl.addEventListener("click", function () {
  header.classList.toggle("nav-open");
});
