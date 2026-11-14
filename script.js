const cartStorageKey = "natanShieldCart";
const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
});

function readCart() {
    try {
        const savedCart = localStorage.getItem(cartStorageKey);
        const cart = savedCart ? JSON.parse(savedCart) : [];

        if (!Array.isArray(cart)) {
            throw new Error("Saved cart data is not a list.");
        }

        return cart.filter(function (item) {
            return item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(item.price) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0;
        });
    } catch (error) {
        console.error("Could not read the saved cart.", error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Could not save the cart.", error);
        alert("Your cart could not be saved in this browser. Please check your browser storage settings.");
        return false;
    }
}

function getCartItemCount(cart) {
    return cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);
}

function updateCartCounts(cart) {
    document.querySelectorAll(".cart-count").forEach(function (count) {
        count.textContent = getCartItemCount(cart);
    });
}

function renderCartPage(cart) {
    const itemsList = document.querySelector(".cart-items-list");

    if (!itemsList) {
        return;
    }

    const itemCount = getCartItemCount(cart);
    const subtotal = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);
    const itemCountLabel = itemCount + (itemCount === 1 ? " item" : " items");

    document.querySelector(".cart-item-count").textContent = itemCountLabel;
    document.querySelector(".cart-summary-row span").textContent = "Subtotal (" + itemCountLabel + ")";
    document.querySelector(".cart-subtotal").textContent = currencyFormatter.format(subtotal);
    document.querySelector(".cart-total").textContent = currencyFormatter.format(subtotal);
    itemsList.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Your cart is empty. Add an item to get started.";
        itemsList.appendChild(emptyMessage);
        return;
    }

    cart.forEach(function (item) {
        const article = document.createElement("article");
        article.className = "cart-item";

        const imageContainer = document.createElement("div");
        imageContainer.className = "cart-product-image";

        if (item.image) {
            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            imageContainer.appendChild(image);
        }

        const details = document.createElement("div");
        details.className = "cart-product-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const stock = document.createElement("p");
        stock.className = "cart-stock";
        stock.textContent = "In stock";

        const quantity = document.createElement("p");
        quantity.className = "cart-quantity";
        quantity.textContent = "Quantity: " + item.quantity;

        const removeButton = document.createElement("button");
        removeButton.className = "cart-remove";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            const updatedCart = readCart().filter(function (cartItem) {
                return cartItem.id !== item.id;
            });

            if (saveCart(updatedCart)) {
                updateCartCounts(updatedCart);
                renderCartPage(updatedCart);
            }
        });

        details.append(name, stock, quantity, removeButton);

        const price = document.createElement("p");
        price.className = "cart-product-price";
        price.textContent = currencyFormatter.format(item.price * item.quantity);

        article.append(imageContainer, details, price);
        itemsList.appendChild(article);
    });
}

let cart = readCart();
updateCartCounts(cart);
renderCartPage(cart);

document.querySelectorAll(".product-card").forEach(function (product, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "ADD TO CART";
    button.classList.add("add-cart-btn");
    product.appendChild(button);

    function addProductToCart() {
        const name = product.querySelector("h3").textContent.trim();
        const priceText = product.querySelector(".price").textContent;
        const price = Number(priceText.replace(/[^\d]/g, ""));
        const image = product.querySelector(".product-image img");
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + index;
        const existingItem = cart.find(function (item) {
            return item.id === id;
        });
        const updatedCart = existingItem
            ? cart.map(function (item) {
                return item.id === id
                    ? Object.assign({}, item, { quantity: item.quantity + 1 })
                    : item;
            })
            : cart.concat({
                id: id,
                name: name,
                price: price,
                image: image ? image.src : "",
                quantity: 1
            });

        if (saveCart(updatedCart)) {
            cart = updatedCart;
            updateCartCounts(cart);
            button.textContent = "ADDED ✓";
            setTimeout(function () {
                button.textContent = "ADD TO CART";
            }, 1000);
        }
    }

    button.addEventListener("click", addProductToCart);
    product.addEventListener("click", function (event) {
        if (event.target !== button && !button.contains(event.target)) {
            addProductToCart();
        }
    });
});

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

function searchProducts() {
    const searchValue = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach(function (product) {
        const productName = product.querySelector("h3").textContent.toLowerCase();
        product.style.display = productName.includes(searchValue) ? "block" : "none";
    });
}

if (searchInput && searchButton) {
    searchButton.addEventListener("click", searchProducts);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });
    searchInput.addEventListener("input", function () {
        if (searchInput.value.trim() === "") {
            document.querySelectorAll(".product-card").forEach(function (product) {
                product.style.display = "block";
            });
        }
    });
}

let hours = 10;
let minutes = 24;
let seconds = 18;
const timer = document.querySelector(".section-header strong");

if (timer) {
    const countdown = setInterval(function () {
        seconds--;

        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }

        if (minutes < 0) {
            minutes = 59;
            hours--;
        }

        if (hours < 0) {
            hours = 0;
            minutes = 0;
            seconds = 0;
            clearInterval(countdown);
        }

        const displayHours = hours < 10 ? "0" + hours : hours;
        const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
        timer.textContent = displayHours + "h : " + displayMinutes + "m : " + displaySeconds + "s";
    }, 1000);
}

const shopButton = document.querySelector(".shop-button");

if (shopButton) {
    shopButton.addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelector(".product-section").scrollIntoView({ behavior: "smooth" });
    });
}

document.querySelectorAll(".quick-card").forEach(function (card) {
    card.addEventListener("click", function () {
        alert("You selected: " + card.querySelector("p").textContent);
    });
});

const emailInput = document.querySelector(".newsletter-form input");
const subscribeButton = document.querySelector(".newsletter-form button");

if (emailInput && subscribeButton) {
    subscribeButton.addEventListener("click", function () {
        const email = emailInput.value.trim();

        if (email === "") {
            alert("Please enter your email address.");
        } else if (!email.includes("@")) {
            alert("Please enter a valid email address.");
        } else {
            alert("Thank you! " + email + " has been subscribed.");
            emailInput.value = "";
        }
    });
}
