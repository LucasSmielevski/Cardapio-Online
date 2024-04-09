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
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "O restaurante está fechado",
            duration: 2000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

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

    Toastify({
        text: "Item adicionado com sucesso",
        duration: 800,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            background: "#00cd00", //#16a34a
        },
    }).showToast();

    return;

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

            <button class="remove-from-cart-btn text-red-500" data-name="${item.nome}">
                Remover 
            </button>
            
       </div>
       `

        total += item.preco * item.quantidade;

        cartItemsContainer.appendChild(cartItemsElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const nome = event.target.getAttribute("data-name")

        removeItemCart(nome);
    }
})

function removeItemCart(nome) {
    const index = cart.findIndex(item => item.nome === nome)

    if (index !== -1) {
        const item = cart[index];

        if (item.quantidade > 1) {
            item.quantidade -= 1;
            updateCartModel();
            return;
        }

        cart.splice(index, 1);
        updateCartModel();

    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

finalizarBtn.addEventListener("click", function () {

    if (!isOpen) {
        Toastify({
            text: "O restaurante está fechado",
            duration: 1000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api do WhatsApp
    const cartItems = cart.map((item) => {
        return (
            ` ${item.nome} Quantidade: (${item.quantidade}) Preço: R$${item.preco} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "48991634186"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModel();

})

//Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("data-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}
else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
