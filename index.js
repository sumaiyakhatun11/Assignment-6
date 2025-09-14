

const showLoading = () => {
  document.getElementById("loading").classList.remove("hidden");
};

const hideLoading = () => {
  document.getElementById("loading").classList.add("hidden");
};

const loadAllTrees = () => {
    const url = "https://openapi.programming-hero.com/api/plants";
    showLoading();
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.plants) {
                displayTrees(data.plants);
            } else if (data.data && data.data.plants) {
                displayTrees(data.data.plants);
            }
        })
        .catch((err) => console.error("error fetching all plants ", err))
        .finally(() => hideLoading());
};



const displayTrees = (plants) => {
    const allPlantsContainer = document.getElementById('all-plants-container');
    allPlantsContainer.innerHTML = ""; // clear previous plants

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
            <button class="bg-[#15803D] hover:bg-green-700 text-white p-3 rounded-3xl w-full font-medium transition add-to-cart">
                Add to Cart
            </button>
        `;

        const btn=div.querySelector(".add-to-cart")

        btn.addEventListener("click",()=>{
            addToCart(plant)
        })
        allPlantsContainer.appendChild(div);
    });
};




const loadCategories=()=>{
  const  url2='https://openapi.programming-hero.com/api/categories'

    fetch(url2)
    .then((res)=>res.json())
    .then((data)=>displayCategories(data.categories))

}


const displayCategories=(categories)=>{
   
    const allCategories=document.getElementById('all-categories');
    allCategories.innerHTML='';

    categories.forEach((category)=>{
        const div= document.createElement('div')
        //  `<div class="category-item text-2xl mt-6 text-[#1F2937] hover:bg-green-600 rounded-lg cursor-pointer">${cat.category_name}</div>`;
        div.innerHTML=`<div class=" category-item text-2xl mt-6 text-[#1F2937] hover:bg-green-600 rounded-lg  cursor-pointer"> ${category.category_name}</div>`

        const innerDiv=div.querySelector(".category-item");

        innerDiv.addEventListener('click',()=>{
            const allItems=allCategories.querySelectorAll(".category-item")
            allItems.forEach(item=>{
                item.classList.remove("bg-green-600")
            });
            innerDiv.classList.add("bg-green-600");
            loadByCategories(category.id);


        }
        
        );

        allCategories.appendChild(div)
    });


}

const loadByCategories=(id)=>{
    allTrees.classList.remove("bg-green-600");
  const  url3=`https://openapi.programming-hero.com/api/category/${id}`
    showLoading();
    fetch(url3)
    .then((res)=>res.json())
    .then((json)=>{
        if(json.plants){
            displayTrees(json.plants)
        }
        else if(json.data && json.data.plants){
            displayTrees(json.data.plants)
        }
    })
    .catch((err)=>console.error("error fetching plants ",err )
    )
    .finally(()=>hideLoading());
    

}


const allTrees=document.getElementById('all-trees');
    allTrees.addEventListener("click",()=>{
    const allItems=document.querySelectorAll(".category-item");
    allItems.forEach(item=> item.classList.remove("bg-green-600"))
    allTrees.classList.add('bg-green-600');
    loadAllTrees(); 
})


loadCategories()
loadAllTrees(); 

allTrees.classList.add("bg-green-600");

//=== Cart Setup ===
const cartContainer = document.querySelector(".cart"); 
const totalPriceElement = document.querySelector(".flex.justify-between.m-5 span:last-child"); 
const cart = {}; 


function updateTotal(){
    let total=0;
    for (const key in cart){
        total+=cart[key].price*cart[key].quantity;

    }

    totalPriceElement.innerText=total;



}

// add to cart function
// function addToCart(plant) {
//   if (cart[plant.name]) {
//     // already in cart -> increase quantity
//     cart[plant.name].quantity++;
//     cart[plant.name].element.querySelector(".cart-quantity").innerText =
//       cart[plant.name].quantity;
//   } 

function addToCart(plant){
    if(cart[plant.name]){
        cart[plant.name].quantity+=1;
        cart[plant.name].querySelector(".cart-quantity").innerText=cart[plant.name].quantity;
    }

    else {
    // create new cart item
    const cartItem = document.createElement("div");
    cartItem.className =
      "bg-[#f0fdf4] h-[60px] rounded-xl flex justify-between items-center mt-2 p-2";
    cartItem.innerHTML = `
      <div>
        <h1>${plant.name}</h1>
        <h1 class="mt-2">৳<span class="cart-price">${plant.price}</span> x <span class="cart-quantity">1</span></h1>
      </div>
      <div>
        <button class="m-2 remove-btn text-red-600">✕</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);

    cart[plant.name]={
        quantity:1,
        price:parseFloat(plant.price),
        element: cartItem,

    }


    // remove button
    cartItem.querySelector(".remove-btn").addEventListener("click", () => {
      delete cart[plant.name];
      cartItem.remove();
      updateTotal();
    });
  }

  // update total price
  updateTotal();
}


