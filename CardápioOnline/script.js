const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const finalizarBtn = document.getElementById("finalizar-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("endereco")
const addressWarn = document.getElementById("endereco-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModel();
    cartModal.style.display = "flex"
})

//fechar modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-card-btn")

    if (parentButton) {
        const nome = parentButton.getAttribute("data-name")
        const preco = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionar no carrinho
        addToCart(nome, preco)

    }

})

//Função para adicionar no carrinho
function addToCart(nome, preco) {
    const itemExistente = cart.find(item => item.nome === nome)

    if (itemExistente) {
        itemExistente.quantidade += 1
    }
    else {
        cart.push({
            nome,
            preco,
            quantidade: 1,
        })
    }

    updateCartModel();

}

//Atualizar o carrinho
function updateCartModel() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
       <div class="flex items-center justify-between" >
        <div>
            <p class="font-medium">${item.nome}</p>
            <p>Quantidade: ${item.quantidade}</p>
            <p class="font-medium mt-2">Preço: ${item.preco.toFixed(2)}</p>
        </div>

            <button>
                Remover
            </button>
            
       </div>
       `

        total += item.preco * item.quantidade;

        cartItemsContainer.appendChild(cartItemsElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

}
