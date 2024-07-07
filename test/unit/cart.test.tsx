import { describe } from "node:test";
import { MockCartApi, MockExampleApi } from "../mock-api/api";
import { screen, waitFor } from "@testing-library/react";
import { getApplication, getProducts } from "../utils";
import '@testing-library/jest-dom';

beforeAll(() => {
    jest.useFakeTimers();
})

afterAll(() => {
    jest.useRealTimers();
})

describe("Количество товаров в корзине правильно отображается в ссылке на страницу Cart", () => {

    test("Количество уникальных товаров в таблице отображается внутри текста ссылки на страницу Cart", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });
        getApplication({ path: "/hw/store", api, cart });
        const cartNavLink = await screen.findByText("Cart (3)");
        expect(cartNavLink).toBeInTheDocument();
    });

});

describe("Тестирование частей content и actions компонента Cart", () => {

    test("Товары в корзине корректно отображаются на странице", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { getByTestId } = getApplication({ path: "/hw/store/cart", api, cart });

        const product1Row = getByTestId("1");
        expect(product1Row).toBeInTheDocument();
        expect(product1Row.querySelector(".Cart-Name")).toHaveTextContent("Product 1");
        expect(product1Row.querySelector(".Cart-Price")).toHaveTextContent("$100");
        expect(product1Row.querySelector(".Cart-Count")).toHaveTextContent("1");
        expect(product1Row.querySelector(".Cart-Total")).toHaveTextContent("$100");

        const product2Row = getByTestId("3");
        expect(product2Row).toBeInTheDocument();
        expect(product2Row.querySelector(".Cart-Name")).toHaveTextContent("Product 3");
        expect(product2Row.querySelector(".Cart-Price")).toHaveTextContent("$300");
        expect(product2Row.querySelector(".Cart-Count")).toHaveTextContent("3");
        expect(product2Row.querySelector(".Cart-Total")).toHaveTextContent("$900");

        const product3Row = getByTestId("5");
        expect(product3Row).toBeInTheDocument();
        expect(product3Row.querySelector(".Cart-Name")).toHaveTextContent("Product 5");
        expect(product3Row.querySelector(".Cart-Price")).toHaveTextContent("$500");
        expect(product3Row.querySelector(".Cart-Count")).toHaveTextContent("2");
        expect(product3Row.querySelector(".Cart-Total")).toHaveTextContent("$1000");

    });

    test("После нажатия на кнопку \"Clear shopping cart\" происходит очистка таблицы (ничего не отображается в таблице), а cartApi.state - пустой объект", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });

        await waitFor(async () => {
            expect(container.querySelector(".Cart-Table")).toBeInTheDocument();
        });
        const clearButton = screen.getByRole('button', { name: /clear shopping cart/i });
        await user.click(clearButton);
        expect(container.querySelector(".Cart-Table")).not.toBeInTheDocument();
        expect(cart.getState()).toEqual({});
        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
    });
});

describe("Тестирование формы Checkout", () => {

    test("Если корзина пуста, то формы нет на странице", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi();

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });
        await waitFor(async () => expect(container.querySelector(".Form")).not.toBeInTheDocument());

    });

    test("Валидация поля Name", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });

        const nameInput = container.querySelector(".Form-Field_type_name") as HTMLInputElement;
        const submitButton = container.querySelector(".Form-Submit");
        await user.click(submitButton);
        expect(nameInput).toHaveClass("is-invalid");
        await user.type(nameInput, "John Doe");
        expect(nameInput).not.toHaveClass("is-invalid");

    });

    test("Валидация поля Phone", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });

        const phoneInput = container.querySelector(".Form-Field_type_phone") as HTMLInputElement;
        const submitButton = container.querySelector(".Form-Submit");
        await user.clear(phoneInput);
        await user.click(submitButton); // empty phone
        expect(phoneInput).toHaveClass("is-invalid");
        await user.type(phoneInput, "123456789"); // invalid phone
        expect(phoneInput).toHaveClass("is-invalid");

        await user.type(phoneInput, "1234567890"); // valid phone
        expect(phoneInput).not.toHaveClass("is-invalid");

        await user.clear(phoneInput);
        await user.type(phoneInput, "123-456-7890"); // valid phone
        expect(phoneInput).not.toHaveClass("is-invalid");

        await user.clear(phoneInput);
        await user.type(phoneInput, "123 456 7890"); // valid phone
        expect(phoneInput).not.toHaveClass("is-invalid");

        await user.clear(phoneInput);
        await user.type(phoneInput, "123.456.7890"); // valid phone
        expect(phoneInput).not.toHaveClass("is-invalid");

        await user.clear(phoneInput);
        await user.type(phoneInput, "123-456.7890"); // invalid phone
        expect(phoneInput).toHaveClass("is-invalid");

    });

    test("Валидация поля Address", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });
        const addressInput = container.querySelector(".Form-Field_type_address") as HTMLInputElement;
        const submitButton = container.querySelector(".Form-Submit");
        await user.click(submitButton);

        expect(addressInput).toHaveClass("is-invalid");
        await user.type(addressInput, "123 Main St. Apt. 1");
        expect(addressInput).not.toHaveClass("is-invalid");
    });

    test("Если кнопка \"Checkout\" нажата и все поля валидны, то форма исчезает со страницы", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });

        const submitButton = container.querySelector(".Form-Submit");
        const nameInput = container.querySelector(".Form-Field_type_name") as HTMLInputElement;
        const phoneInput = container.querySelector(".Form-Field_type_phone") as HTMLInputElement;
        const addressInput = container.querySelector(".Form-Field_type_address") as HTMLInputElement;
        const form = container.querySelector(".Form");

        await user.type(nameInput, "John Doe");
        await user.type(phoneInput, "1234567890");
        await user.type(addressInput, "123 Main St. Apt. 1");
        expect(nameInput).not.toHaveClass("is-invalid");
        expect(phoneInput).not.toHaveClass("is-invalid");
        expect(addressInput).not.toHaveClass("is-invalid");

        await user.click(submitButton);
        await waitFor(() => expect(form).not.toBeInTheDocument());
    });

    test("Если кнопка \"Checkout\" нажата и какие-то поля невалидны, то форма не исчезает со страницы", async () => {
        const api = new MockExampleApi(getProducts(6));
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });
        const form = container.querySelector(".Form");
        const submitButton = container.querySelector(".Form-Submit");
        const nameInput = container.querySelector(".Form-Field_type_name") as HTMLInputElement;
        const phoneInput = container.querySelector(".Form-Field_type_phone") as HTMLInputElement;
        const addressInput = container.querySelector(".Form-Field_type_address") as HTMLInputElement;

        await user.type(nameInput, "John Doe");
        await user.type(phoneInput, "123-456.7890"); // invalid phone
        await user.type(addressInput, "123 Main St. Apt. 1");
        await user.click(submitButton);

        expect(form).toBeInTheDocument();
        // empty name
        await user.clear(nameInput);
        await user.clear(phoneInput);
        await user.clear(addressInput);
        await user.type(phoneInput, "123-456-7890");
        await user.type(addressInput, "123 Main St. Apt. 1");
        await user.click(submitButton);
        expect(form).toBeInTheDocument();

        // empty address
        await user.clear(nameInput);
        await user.clear(phoneInput);
        await user.clear(addressInput);
        await user.type(nameInput, "John Doe");
        await user.type(phoneInput, "123-456-7890");
        await user.click(submitButton);
        expect(form).toBeInTheDocument();
    });

    test(`Если кнопка \"Checkout\" нажата и все поля валидны, то корзина (cart.state) опустошается, 
        а на странице появляется orderInfo с правильным lastOrderId`, async () => {
        const api = new MockExampleApi(getProducts(6), [ { id: 1 }, { id: 2 }, { id: 3 } ]);
        const cart = new MockCartApi({
            1: { name: "Product 1", count: 1, price: 100 },
            3: { name: "Product 3", count: 3, price: 300 },
            5: { name: "Product 5", count: 2, price: 500 },
        });

        const { user, container } = getApplication({ path: "/hw/store/cart", api, cart });
        const submitButton = container.querySelector(".Form-Submit");
        const nameInput = container.querySelector(".Form-Field_type_name") as HTMLInputElement;
        const phoneInput = container.querySelector(".Form-Field_type_phone") as HTMLInputElement;
        const addressInput = container.querySelector(".Form-Field_type_address") as HTMLInputElement;

        await user.type(nameInput, "John Doe");
        await user.type(phoneInput, "1234567890");
        await user.type(addressInput, "123 Main St. Apt. 1");
        await user.click(submitButton);

        await waitFor(() => {
            expect(cart.getState()).toEqual({});
            expect(api.getOrders().length).toEqual(4);
            expect(api.getOrders().at(-1)).toEqual({ id: 4 });
        });
        const orderText = await screen.findByText(/order # has been successfully completed\./i);
        const orderNumber = orderText.querySelector(".Cart-Number");
        expect(orderNumber.textContent).toEqual("4");

    });

});
