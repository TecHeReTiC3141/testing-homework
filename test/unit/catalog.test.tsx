import { describe } from "node:test";
import { screen, waitFor } from "@testing-library/react";
import { MockCartApi, MockExampleApi } from "../mock-api/api";
import { CartApi } from "../../src/client/api";
import { getApplication, getProducts } from "../utils";
import '@testing-library/jest-dom';


describe("Тестирование страницы Catalog", () => {

    beforeAll(() => {
        jest.useFakeTimers();
    })

    afterAll(() => {
        jest.useRealTimers();
    })

    test("При загрузке страницы продукты с сервера должны быть отрендерены на странице", async () => {
        const api = new MockExampleApi(getProducts(3));
        const cart = new CartApi();
        const { container } = getApplication({ path: "/hw/store/catalog", api, cart });
        await waitFor(() => {
            const productTexts = [ ...container.querySelectorAll('.ProductItem-Name') ].map(node => node.textContent);

            expect(productTexts).toContain('Product 1');
            expect(productTexts).toContain('Product 2');
            expect(productTexts).toContain('Product 3');
        });
    });

    test("Если продукт находится в корзине, то в карточке этого продукта должна быть метка \"Item in cart\", у остальных ее не должно быть", async () => {
        const api = new MockExampleApi(getProducts(4));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 2", count: 3, price: 100 },
        });

        const { container } = getApplication({ path: "/hw/store/catalog", api, cart });
        await waitFor(() => {
            const productCards = [ ...container.querySelectorAll('.ProductItem') ];
            const productLabels = productCards.map(card => card.querySelector(".CartBadge")?.innerHTML);

            expect(productLabels).toEqual([ "Item in cart", undefined, "Item in cart", undefined ]);
        });

    });
});

describe("Тестирование страницы Product", () => {

    beforeAll(() => {
        jest.useFakeTimers();
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    test("При загрузке страницы продукта карточка с соответствующим товаром должна быть отрендерена на странице", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi();
        const { container } = getApplication({ path: "/hw/store/catalog/2", api, cart });
        await waitFor(() => {
            const productName = container.querySelector('.ProductDetails-Name')?.textContent;
            const productDescription = container.querySelector('.ProductDetails-Description')?.textContent;
            const productPrice = container.querySelector('.ProductDetails-Price')?.textContent;
            expect(productName).toEqual("Product 2");
            expect(productDescription).toEqual("Description 2");
            expect(productPrice).toEqual("$200");
        });

    });

    test("Когда кнопка \"Добавить в корзину\" нажата, но товара до этого не было в корзине, то он добавляется в корзину с count = 1, иначе его количество в корзине увеличивается", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
        });
        const { user } = getApplication({ path: "/hw/store/catalog/5", api, cart });
        const addToCartButton = await screen.findByText("Add to Cart");
        await user.click(addToCartButton);
        expect(Object.keys(cart.getState())).toContain("5");
        expect(cart.getState()[ 5 ].count).toEqual(1);
        await user.click(addToCartButton);
        expect(cart.getState()[ 5 ].count).toEqual(2);
        await user.click(addToCartButton);
        expect(cart.getState()[ 5 ].count).toEqual(3);
    });

    test("Если объект в корзине, то должна отображаться метка \"Item in cart\"", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
        });

        const { user, container } = getApplication({ path: "/hw/store/catalog/5", api, cart });
        const addToCartButton = await screen.findByText("Add to Cart");
        expect(container.querySelector(".CartBadge")).toEqual(null);
        await user.click(addToCartButton);
        const itemInCart = await screen.findByText("Item in cart");
        expect(itemInCart).toBeInTheDocument();
    });

});