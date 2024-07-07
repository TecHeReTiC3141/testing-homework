import { MemoryRouter } from "react-router-dom";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { Product } from "../../src/common/types";
import { userEvent } from "@testing-library/user-event";

interface ApplicationParams {
    path: string,
    api?: ExampleApi,
    cart?: CartApi,
}

export function getApplication({
                                   path = "/hw/store",
                                   api = new ExampleApi('/hw/store'),
                                   cart = new CartApi()
                               }: ApplicationParams) {
    const basename = "/hw/store";
    const store = initStore(api, cart);
    const application = (
        <MemoryRouter basename={basename} initialEntries={[ path ]} initialIndex={0}>
            <Provider store={store}>
                <Application/>
            </Provider>
        </MemoryRouter>
    );
    return setupRender(application);
}

export function getProducts(n: number): Product[] {
    return Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: (i + 1) * 100,
        color: `Color ${i + 1}`,
        description: `Description ${i + 1}`,
        material: `Material ${i + 1}`
    }));
}

export function setupRender(component: ReactNode) {
    return {
        user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
        ...render(component),
    };
}

export function resizeWindow(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
    });
    window.dispatchEvent(new Event('resize'));
}


