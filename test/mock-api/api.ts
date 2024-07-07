import { AxiosResponse } from "axios";
import {
    CartItem,
    CartState,
    CheckoutFormData,
    CheckoutResponse,
    Product,
    ProductShortInfo
} from "../../src/common/types";
import { CartApi, ExampleApi } from "../../src/client/api";

const BASE_PATH = "/hw/store";

export class MockExampleApi extends ExampleApi {
    private products: Product[];
    private orders: CheckoutResponse[];

    constructor(initialProducts: Product[] = [], initialOrders: CheckoutResponse[] = []) {
        super(BASE_PATH);
        this.products = initialProducts;
        this.orders = initialOrders;
    }

    async getProducts() {
        return Promise.resolve({
            data: this.products.map(({ id, name, price }) => ({
                id, name, price
            }))
        } as AxiosResponse<ProductShortInfo[]>);
    }

    async getProductById(id: number) {
        return Promise.resolve({ data: this.products.find(p => p.id === id) } as AxiosResponse<Product>);
    }

    async checkout(form: CheckoutFormData, cart: CartState) {
        const newId = this.orders.length + 1;
        this.orders.push({ id: newId });
        return Promise.resolve({ data: { id: newId } } as AxiosResponse<CheckoutResponse>);
    }

    getOrders() {
        return this.orders;
    }
}

export class MockCartApi extends CartApi {

    private cart: Record<number, CartItem> = {};

    constructor(initialCarts: Record<number, CartItem> = {}) {
        super();
        this.cart = initialCarts;
    }

    getState(): CartState {
        return this.cart || {};
    }

    setState(cart: CartState) {
        this.cart = cart;
    }

    addItem(id: number, item: CartItem) {
        this.cart[ id ] = item;
    }
}