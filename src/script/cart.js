export class Products {
    constructor(data, productEle, cartEle) {
        this.data = data;
        this.productEle = productEle;
        this.cartEle = cartEle;
        this.cartItem = [];
    }

    init() {
        this.renderProduct();
        this.renderEmptyCart();
    }

    renderProduct() {
        const data = this.data;
        if (!data) return;
        data.forEach(data => {
            this.productEle.append(this.makeProductItem(data));
        });
    }

    makeProductItem(el) {
        let productItem = document.createElement('div');
        productItem.classList.add('product__item');

        productItem.innerHTML = `<span class="product__offer">${el.discount}% Off</span>
                    <div class="product__image">
                        <img src='${el.image}'>
                    </div>
                    <div class="product__bottom">
                        <div class="cart">
                            <div class="cart__name">
                                ${el.name}
                            </div>
                            <div class="cart__price">
                                <span class="original-price">${el.price.display}</span>
                                <span class="deal-price">${el.price.actual}</span>
                            </div>
                        </div>
                        <div class="cart__button">
                            <button class="cart-btn">Add to cart</button>
                        </div>
                    </div>`;
        productItem.querySelector('.cart-btn').addEventListener('click', () => { this.addToCartList(el) });
        return productItem;
    }

    addToCartList(data) {
        const temp = {
            count: 1,
            total: data.price.display,
            id: `cart-item-${new Date().getTime()}`
        }
        const tempData = { ...data, ...temp }
        this.cartItem.push(tempData);
        if (this.cartItem.length === 1) {
            this.cartEle.innerHTML = '';
            this.renderCart();
            this.cartEle.append(this.renderCart(tempData))
        }
        const dd = document.getElementById('jsCartWrap').lastElementChild;
        dd.append(this.makeCartList(tempData));
        this.totalCal();
    }

    renderCart() {
        let table = document.createElement('table');
        table.classList.add('cart__wrap');
        table.id = "jsCartWrap";
        table.innerHTML = `<thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `
        return table;
    }

    renderEmptyCart() {
        if (this.cartItem.length === 0) {
            this.cartEle.append(this.makeEmptyCart());
        }
    }

    makeCartList(el) {
        let tr = document.createElement('tr');
        tr.classList.add('empty__item');
        tr.innerHTML = `
                <td>
                    ${el.name}
                    <button class="delete-cart float-right">X</button>
                </td>
                <td class="align-center">
                    <button class="dec">-</button>
                    <input type="number" class="small-input" min="1" value=${el.count} id=${el.id}>
                    <button class="inc">+</button>
                </td>
                <td class="align-right">
                    ${el.total}
                </td>`;
        tr.querySelector('.inc').addEventListener('click', () => { this.onInc(el.id) });
        tr.querySelector('.dec').addEventListener('click', () => { this.onDec(el.id) });
        tr.querySelector('.delete-cart').addEventListener('click', () => { this.removeCart(el.id) });
        return tr;
    }

    makeEmptyCart() {
        let emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty__items');
        emptyDiv.innerHTML = `<h2>Your Cart is Empty</h2>`;
        return emptyDiv;
    }

    onInc(id) {
        const el = document.getElementById(id);
        el.stepUp();
        this.cartItem.forEach((data) =>{
            if(data.id === id){
                data.count += 1;
                data.total = data.price.display * data.count;                
            }
        });
        const dd = document.getElementById('jsCartWrap').lastElementChild;
        dd.innerHTML = '';
        this.cartItem.forEach((data) =>{
            dd.append(this.makeCartList(data));
        });
        this.totalCal();
    }

    onDec(id) {
        const el = document.getElementById(id);
        if(el.value === '1'){
            return;
        }
        el.stepDown();
        
        this.cartItem.forEach((data) =>{
            if(data.id === id){
                data.count -= 1;
                data.total = data.price.display * data.count;                
            }
        });
        const dd = document.getElementById('jsCartWrap').lastElementChild;
        dd.innerHTML = '';
        this.cartItem.forEach((data) =>{
            dd.append(this.makeCartList(data));
        });
        this.totalCal();
    }

    removeCart(id){
       
        this.cartItem.forEach((el,index) =>{
            if(el.id === id){
                this.cartItem.splice(index, 1);
            }
        });
        if(this.cartItem.length === 0){
            this.cartEle.innerHTML ='';
            this.renderEmptyCart();
            return;
        }    
        const dd = document.getElementById('jsCartWrap').lastElementChild;
        dd.innerHTML = '';
        
        this.cartItem.forEach((el) =>{
            dd.append(this.makeCartList(el));
        }); 
        this.totalCal()       
    }

    totalCal(){
        const tempObj = {
            itemCount: this.cartItem.length,
            totalDiscount: 0,
            subTotal: 0
        };
        let totalDiscount = 0;
        let subTotal = 0;
        this.cartItem.forEach((el) =>{
            totalDiscount += el.price.display * el.count;
            subTotal += (el.price.display - el.price.actual) * el.count;
        });
        tempObj.subTotal = subTotal;
        tempObj.totalDiscount = totalDiscount;
        this.makeTotalCart(tempObj);
    }

    makeTotalCart(data){
        const el = document.getElementById('jsCartWrap');
        const totalCart = document.getElementById('jsTotalCart');
        if(totalCart !== null){
            totalCart.remove();
        }
        const tempEl = `<div class="total-cart" id="jsTotalCart">
        <h2>Total</h2>
        <ul>
            <li>
                <span>Items(${data.itemCount})</span>
                <span class="align-center">:</span>
                <span class="align-right">${data.totalDiscount}</span>
            </li>
            <li>
                <span>Discount</span>
                <span class="align-center">:</span>
                <span class="align-right">${data.subTotal}</span>
            </li>
            <li>
                <span>Type Discount</span>
                <span class="align-center">:</span>
                <span class="align-right">-0</span>
            </li>
            <li>
                <span>Order Total</span>
                <span class="align-center">:</span>
                <span class="align-right">${data.totalDiscount - data.subTotal}</span>
            </li>
            </ul>
            <div>
        `
        el.insertAdjacentHTML("afterend", tempEl);
    }

}
