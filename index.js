
const cartContainer = document.querySelector(".cart");
const totalPriceElement = document.querySelector(".flex.justify-between.m-5 span");

// global cart object
const cart = {};

// === Spinner Functions ===
const loading = document.getElementById("loading");
function showLoading() {
  loading.classList.remove("hidden");
}
function hideLoading() {
  loading.classList.add("hidden");
}


function updateTotal() {
    let total = 0;
    for (const key in cart) {
        const item = cart[key];
        total += item.price * item.quantity; 
    }
    totalPriceElement.innerText = total;
}

const loadAllCategories = () => {
    showLoading(); // 🔥 spinner show
    fetch("https://openapi.programming-hero.com/api/plants")
        .then((res) => res.json())
        .then((json) => {
            if (json.plants) {
                displayPlants(json.plants);
            } else if (json.data && json.data.plants) {
                displayPlants(json.data.plants);
            }
        })
        .catch((err) => console.error("Error fetching plants:", err))
        .finally(() => hideLoading()); // 🔥 spinner hide
};

const loadTressByCategories = (id) => {
    showLoading(); // 🔥 spinner show
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then((res) => res.json())
        .then((json) => {
            if (json.plants) {
                displayPlants(json.plants);
            } else if (json.data && json.data.plants) {
                displayPlants(json.data.plants);
            }
        })
        .catch((err) => console.error("Error fetching plants:", err))
        .finally(() => hideLoading()); // 🔥 spinner hide
};
const displayPlants = (plants) => {
    const allPlantsContainer = document.getElementById('all-plants-container');
    allPlantsContainer.innerHTML = "";

    plants.forEach((plant) => {
        const div = document.createElement("div");
        div.className = "bg-white rounded-2xl shadow-md p-4 mb-6";

        div.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover rounded-xl mb-4">
            <p class="plant-name font-bold text-xl cursor-pointer">${plant.name}</p>
            <p class="text-gray-600 text-sm mb-3">${plant.description}</p>
            <div class="flex justify-between items-center mb-3">
                <div class="type bg-[#DCFCE7] text-[#15803D] p-2 rounded-2xl text-sm font-medium">
                  ${plant.category}
                </div>
                <div class="font-bold text-lg price">
                  <span><i class="fa-solid fa-bangladeshi-taka-sign"></i></span>${plant.price}
                </div>
            </div>
            <button class="bg-[#15803D] hover:bg-green-700 text-white p-3 rounded-3xl w-full font-medium transition">
                Add to Cart
            </button>
        `;
        allPlantsContainer.appendChild(div);

        const addToCartBtn = div.querySelector("button");
        addToCartBtn.addEventListener("click", () => {
            if (cart[plant.name]) {
                
                cart[plant.name].quantity += 1;
                cart[plant.name].element.querySelector(".cart-quantity").innerText = cart[plant.name].quantity;
            } else {
                
                const cartItem = document.createElement("div");
                cartItem.className = "bg-[#f0fdf4ff] h-[60px] rounded-xl flex justify-between items-center mt-2";
                cartItem.innerHTML = `
            <div>
                <h1>${plant.name}</h1>
                <h1 class="mt-2">৳<span class="cart-price">${plant.price}</span> x <span class="cart-quantity">1</span></h1>
            </div>
            <div>
                <button class="m-5 remove-btn">✕</button>
            </div>
        `;
                cartContainer.appendChild(cartItem);

                cart[plant.name] = {
                    quantity: 1,
                    price: parseFloat(plant.price), 
                    element: cartItem
                };

                // remove button
                const removeBtn = cartItem.querySelector(".remove-btn");
                removeBtn.addEventListener("click", () => {
                    delete cart[plant.name];
                    cartItem.remove();
                    updateTotal();
                });
            }

            // total update
            updateTotal();
        });


        // modal click
        const plantNameP = div.querySelector(".plant-name");
        plantNameP.addEventListener("click", () => {
            const modal = document.getElementById("my_modal_2");
            document.getElementById("modal-title").innerText = plant.name;
            document.getElementById("modal-image").src = plant.image;
            document.getElementById("modal-description").innerText = plant.description;
            document.getElementById("modal-category").innerText = plant.category;
            document.getElementById("modal-price").innerText = plant.price;
            modal.showModal();
        });
    });
};

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((json) => displayCategories(json.categories));
};

const allTrees = document.getElementById('all-trees');


allTrees.classList.add("bg-green-600");
allTrees.addEventListener("click", () => {
    const allItems = document.querySelectorAll(".category-item");
    allItems.forEach(item => item.classList.remove("bg-green-600"));
    allTrees.classList.add("bg-green-600");
    loadAllCategories();
});

const displayCategories = (categories) => {
    const allCategories = document.getElementById("all-categories");
    allCategories.innerHTML = "";

    categories.forEach((cat, index) => {

        const div = document.createElement("div");
        div.innerHTML = `
      <div class="category-item text-2xl mt-6 text-[#1F2937] hover:bg-green-600 rounded-lg cursor-pointer p-2">
        ${cat.category_name}
      </div>
    `;

        const innerDiv = div.querySelector(".category-item");

        // click listener
        innerDiv.addEventListener("click", () => {
            // remove green from all
            const allItems = allCategories.querySelectorAll(".category-item");
            allItems.forEach(item => item.classList.remove("bg-green-600"));
            allTrees.classList.remove("bg-green-600");

            // add green to clicked
            innerDiv.classList.add("bg-green-600");

            // fetch plants for this category
            loadTressByCategories(cat.id); // <-- corrected key
        });


        allCategories.append(div);
    });
};


loadCategories();


loadAllCategories();
