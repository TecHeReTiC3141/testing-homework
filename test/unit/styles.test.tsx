import { getApplication, getProducts, resizeWindow } from "../utils";
import { screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MockCartApi, MockExampleApi } from "../mock-api/api";


describe("Тестирование navbar при маленьком (< 576px) экране", () => {

    beforeAll(() => jest.useFakeTimers());

    afterAll(() => jest.useRealTimers());

    it("Когда гамбургер нажат, то navbar сворачивается, если открыт, и разворачивается, если закрыт", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });
        const { user, container } = getApplication({ path: "/hw/store", api, cart });
        resizeWindow(500, 800);

        const hamburger = await screen.findByRole('button', {
            name: /toggle navigation/i
        });
        await waitFor(() => {
            const menu = container.querySelector(".Application-Menu");
            expect(menu).toHaveClass("collapse");
        });

        await user.click(hamburger);
        await waitFor(() => {
            const menu = container.querySelector(".Application-Menu");
            expect(menu).not.toHaveClass("collapse");
        });

        await user.click(hamburger);
        await waitFor(() => {
            const menu = container.querySelector(".Application-Menu");
            expect(menu).toHaveClass("collapse");
        });

    });

    it("Когда ссылка в navbar нажата, то он сворачивается", async () => {
        const api = new MockExampleApi();
        const cart = new MockCartApi();
        const { user, container } = getApplication({ path: "/hw/store", api, cart });
        resizeWindow(500, 800);

        const hamburger = await screen.findByRole('button', {
            name: /toggle navigation/i
        });
        const catalogLink = await screen.findByRole('link', {
            name: /catalog/i
        });
        await user.click(catalogLink);
        await waitFor(() => {
            const menu = container.querySelector(".Application-Menu");
            expect(menu).toHaveClass("collapse");
        });

        await user.click(hamburger);

        const deliveryLink = await screen.findByRole('link', {
            name: /delivery/i
        });
        await user.click(deliveryLink);
        await waitFor(() => {
            const menu = container.querySelector(".Application-Menu");
            expect(menu).toHaveClass("collapse");
        });

    });
})
