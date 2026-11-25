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

const assetProducts = [
    ["Laptop Computer", "Assets/images (1).jpeg", "₦450,000"],
    ["Gaming Laptop", "Assets/images (2).jpeg", "₦680,000"],
    ["Desktop Laptop", "Assets/images (3).jpeg", "₦520,000"],
    ["Red Sports Car", "Assets/images (29).jpeg", "₦18,500,000"],
    ["Modern Sedan", "Assets/images (38).jpeg", "₦12,800,000"],
    ["Luxury Sports Car", "Assets/images (39).jpeg", "₦24,000,000"],
    ["Sport Utility Vehicle", "Assets/images (40).jpeg", "₦14,900,000"],
    ["Smartphone", "Assets/images (5).jpeg", "₦310,000"],
    ["Premium Smartphone", "Assets/images (6).jpeg", "₦390,000"],
    ["Flagship Smartphone", "Assets/images (7).jpeg", "₦480,000"],
    ["Burgundy Cotton T-Shirt", "Assets/images (8).jpeg", "₦12,500"],
    ["Green Casual T-Shirt", "Assets/images (9).jpeg", "₦11,500"],
    ["Graphic T-Shirt", "Assets/images (10).jpeg", "₦14,000"],
    ["Classic T-Shirt Set", "Assets/images (11).jpeg", "₦18,500"],
    ["Red Shorts", "Assets/images (15).jpeg", "₦9,500"],
    ["Grey Casual Shorts", "Assets/images (12).jpeg", "₦10,500"],
    ["Green Casual Shorts", "Assets/images (13).jpeg", "₦10,500"],
    ["Camouflage Shorts", "Assets/images (14).jpeg", "₦13,500"],
    ["Gaming Controller", "Assets/images (16).jpeg", "₦19,500"],
    ["Wireless Game Controller", "Assets/images (17).jpeg", "₦27,500"],
    ["Premium Game Controller", "Assets/images (18).jpeg", "₦32,000"],
    ["PlayStation Controller", "Assets/images (19).jpeg", "₦24,000"],
    ["RGB Gaming Controller", "Assets/images (4).jpeg", "₦35,000"],
    ["Mechanical Gaming Keyboard", "Assets/images (21).jpeg", "₦28,500"],
    ["RGB Gaming Keyboard", "Assets/images (22).jpeg", "₦31,500"],
    ["LED Gaming Keyboard", "Assets/images (20).jpeg", "₦26,000"],
    ["Gaming Mouse", "Assets/images (23).jpeg", "₦18,500"],
    ["RGB Gaming Mouse", "Assets/images (24).jpeg", "₦22,500"],
    ["Professional Gaming Mouse", "Assets/images (25).jpeg", "₦29,000"],
    ["Orange Wireless Mouse", "Assets/images (26).jpeg", "₦16,500"],
    ["Basketball", "Assets/images (28).jpeg", "₦14,500"],
    ["Basketball", "Assets/images (28).jpeg", "₦11,500"],
    ["Football", "Assets/images (27).jpeg", "₦13,500"],
    ["Volleyball", "Assets/images (30).jpeg", "₦12,500"],
    ["Football Goal Set", "Assets/images (31).jpeg", "₦85,000"],
    ["Portable Football Goal", "Assets/images (32).jpeg", "₦72,000"],
    ["Makeup Brush Set", "Assets/images (33).jpeg", "₦8,500"],
    ["Cosmetics Gift Set", "Assets/images (34).jpeg", "₦21,500"],
    ["Body Care Gift Set", "Assets/images (35).jpeg", "₦24,500"],
    ["Fashion Sneakers", "Assets/images (36).jpeg", "₦30,000"],
    ["Leather Hiking Boots", "Assets/images (37).jpeg", "₦42,500"],
    ["Fashion Clothing Collection", "Assets/images (41).jpeg", "₦55,000"],
    ["Beauty Products Collection", "Assets/images (42).jpeg", "₦18,000"],
    ["Ladies Fashion Outfit", "Assets/images (43).jpeg", "₦35,500"],
];

const assetProductsContainer = document.getElementById("asset-products");
if (assetProductsContainer) {
    assetProducts.forEach(function (product) {
        const card = document.createElement("div");
        card.className = "product-card";

        const imageContainer = document.createElement("div");
        imageContainer.className = "product-image";

        const image = document.createElement("img");
        image.src = product[1];
        image.alt = product[0];
        imageContainer.appendChild(image);

        const name = document.createElement("h3");
        name.textContent = product[0];

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = product[2];

        card.append(imageContainer, name, price);
        assetProductsContainer.appendChild(card);
    });
}

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
