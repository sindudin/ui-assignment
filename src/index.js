import './styles/main.scss';

import { Items } from "./script/data";

import { Products } from "./script/cart";

window.addEventListener('load', function () {
    const productEle = document.getElementById('jsProduct');
    const cartEle = document.getElementById('jsProductCart');
    const product = new Products(Items, productEle, cartEle);
    product.init();
});