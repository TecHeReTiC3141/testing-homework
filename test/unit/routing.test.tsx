import { getApplication } from "../utils";

it("По адресу /hw/store/catalog должна открываться страница  Catalog", () => {
    const { getByRole } = getApplication({ path: "/hw/store/catalog" });

    const heading = getByRole('heading', {
        name: /catalog/i
    });
    expect(heading.textContent).toBe("Catalog");

});

it("По адресу /hw/store должна открываться страница Home", () => {
    const { getByRole } = getApplication({ path: "/hw/store" });

    const stabilityHeader = getByRole('heading', {
        name: /stability/i,
    });
    expect(stabilityHeader.textContent).toBe("Stability");
});

it("По адресу /hw/store/delivery должна открываться страница Delivery", () => {
    const { getByRole } = getApplication({ path: "/hw/store/delivery" });

    const deliveryHeader = getByRole('heading', {
        name: /delivery/i
    });
    expect(deliveryHeader.textContent).toBe("Delivery");
});

it("По адресу /hw/store/contacts должна открываться страница Contacts", () => {
    const { getByRole } = getApplication({ path: "/hw/store/contacts" });

    const contactsHeader = getByRole('heading', {
        name: /contacts/i
    })
    expect(contactsHeader.textContent).toBe("Contacts");
});

it("По адресу /hw/store/cart должна открываться страница Cart", () => {
    const { getByRole } = getApplication({ path: "/hw/store/cart" });

    const cartHeader = getByRole('heading', {
        name: /cart/i
    })
    expect(cartHeader.textContent).toBe("Shopping cart");
});

it("Ссылки должны вести на соответствующие страницы", async () => {
    const { getByRole } = getApplication({ path: "/hw/store" });

    const catalogLink = getByRole('link', {
        name: /catalog/i
    });
    expect(catalogLink.getAttribute('href')).toBe("/hw/store/catalog");

    const deliveryLink = getByRole('link', {
        name: /delivery/i
    });
    expect(deliveryLink.getAttribute('href')).toBe("/hw/store/delivery");

    const contactsLink = getByRole('link', {
        name: /contacts/i
    });
    expect(contactsLink.getAttribute('href')).toBe("/hw/store/contacts");

    const cartLink = getByRole('link', {
        name: /cart/i
    });
    expect(cartLink.getAttribute('href')).toBe("/hw/store/cart");
});

