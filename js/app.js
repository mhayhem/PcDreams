const itemCards = document.getElementsByClassName('itemCard');
const dropZone = document.getElementById('dropZone');
const totalElement = document.getElementById('sum');
const showProductList = document.getElementById('productList') ;
const clearButton = document.getElementById('empty');
let totalPrice = 0;
let productList = [];



// function to save the shopping cart in localstorage
function saveCartInLocalstorage() {
    console.log(`${totalPrice}, ${productList} saved`);
    localStorage.setItem('totalprice', totalPrice);
    localStorage.setItem('productlist', JSON.stringify(productList));
}
// function to load before Cart from localstorage
function loadCartFromLocalstorage() {
    const storedTotalPrice = localStorage.getItem('totalprice');
    const storedProductList = localStorage.getItem('productlist');

    if (storedProductList) {
        totalPrice = parseFloat(storedTotalPrice);
        totalElement.textContent = `${totalPrice.toFixed(2)} €`;
    }

    if (storedProductList) {
        productList = JSON.parse(storedProductList);
        showProductList.textContent = `${productList.map(item => item.name).join(', ')}`;
        const imgElement = dropZone.querySelector('img');
        imgElement.src = productList[productList.length - 1].src;
        
    }

}
// function to confirm load before cart or dont load
function recoverCart() {
    const beforeOrder = localStorage.getItem('totalprice');
    if (beforeOrder) {
        const recoverOrder = confirm('¿Desea recuperar el pedido anterior?')
        if (recoverOrder) {
            loadCartFromLocalstorage();
        }
        else {
            localStorage.removeItem('totalprice');
            localStorage.removeItem('productlist');
        }
    }
    
}
// Function to check incompatibilities
function compatibity(newItem) {
    console.log('productos en el carrito:', productList);
    if (productList.length !== 0) {
        for (const item of productList) {
            console.log('Checking compatibility between:', item, newItem);
            if ((item.type === 'cpu' || item.type === 'motherboard') && 
            (newItem.type === 'cpu' || newItem.type === 'motherboard')) {
                if (newItem.cpu !== item.cpu) {
                    return false; // are incompatible
                }
            }
            return true; // are compatible
            }
        }
        return true;
}
// load DOM
document.addEventListener('DOMContentLoaded', (e) => {
    recoverCart();
    // drag actions
    Array.from(itemCards).forEach(item => {
        item.setAttribute('draggable', true);

        // check target element is the correct container
        const img = item.querySelector('img');
        let itemSrc;
        if (img) {
            itemSrc = img.src;
        }
        else {
            console.log('don´t found img');
        }
        
        item.addEventListener('dragstart', (e) => {
            console.log('drag works');
        
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);
        const itemType = item.dataset.type || '';
        const itemCpu = item.dataset.cpu || '';
        
        
        
        e.dataTransfer.setData('name', name)
        e.dataTransfer.setData('price', price);
        e.dataTransfer.setData('type', itemType);
        e.dataTransfer.setData('cpu', itemCpu);
        e.dataTransfer.setData('src', itemSrc);
        
        console.log(`dragging: price=${price}, img=${itemSrc} type=${itemType}, cpu=${itemCpu}`);
        });
    });
    

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        console.log('entry on drop zone');
    });
    // drop actions
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const name = e.dataTransfer.getData('name');
        const price = parseFloat(e.dataTransfer.getData('price'));
        const itemType = e.dataTransfer.getData('type');
        const itemCpu = e.dataTransfer.getData('cpu');
        const itemSrc = e.dataTransfer.getData('src');


        const newItem = {
            name: name,
            price: price,
            type: itemType,
            cpu: itemCpu,
            src: itemSrc
        };

        

        console.log('newItem:', newItem);

        if (!compatibity(newItem)) {
            alert('Productos incompatibles');
            return;
        }
    

        // add product price on total price
        totalPrice += price;
        totalElement.textContent = `${totalPrice.toFixed(2)} €`;

        // change img in drop zone
        const imgElement = dropZone.querySelector('img');
        if (imgElement) {
            imgElement.src = itemSrc;
        }
        
        // created array with products dropped and display the array
        productList.push(newItem);
        console.log('carro', productList['name']);
        showProductList.textContent = productList.map(item => item.name).join(', ');
        
        saveCartInLocalstorage();
    });
    
    dropZone.addEventListener('dragstart', (e) => {
        e.preventDefault();
        // verify array isn´t zero
        if (productList.length > 0) {
            // delete the last object on productList
            const lastProduct = productList.pop();

            //find the element name in Itemcards 
            const itemElement = Array.from(itemCards).find(item => item.dataset.name === lastProduct.name);

            //get price the lastProduct
            const price = parseFloat(itemElement.dataset.price);

            //price after subtracting the price of the lastProduct
            totalPrice -= price;
            // show de updated toatlPrice
            totalElement.textContent = `${totalPrice.toFixed(2)} €`;

            // remove the name of lastProduct
            showProductList.textContent = productList.map(item => item.name).join(', ');

            // update the img from dropZone
            if (productList.length > 0) {
                const lastItem = productList[productList.length - 1];
                const lastItemElement = Array.from(itemCards).find(item => item.dataset.name === lastItem.name);

                const imgElement = dropZone.querySelector('img');
                imgElement.src = lastItemElement.querySelector('img').src;
            }
            else {
                //if productList are empty, delete the dropZone img
                const imgElement = dropZone.querySelector('img');
                imgElement.src = '';
                console.log('No products to remove');
            }

        }
    
    });
    // empty cart 
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            e.preventDefault();
            totalPrice = 0;
            productList = [];
            totalElement.textContent = '0,00 €';
            showProductList.textContent = '';
            
             // Clear the image in drop zone
            const imgElement = dropZone.querySelector('img');
            if (imgElement) {
                imgElement.src = '';
            }
            // clear localstorage
            localStorage.removeItem('totalprice');
            localStorage.removeItem('produclist');
        })
    }
});



