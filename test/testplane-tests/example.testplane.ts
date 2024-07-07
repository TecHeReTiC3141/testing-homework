describe("Тестирование статических страниц", () => {
    it("Страница Home", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store");

        const home = await browser.$(".Home");

        await home.waitForDisplayed();

        await home.assertView("home-plain");
    });

    it("Страница Delivery", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/delivery");

        const delivery = await browser.$(".Delivery");

        await delivery.waitForDisplayed();

        await delivery.assertView("delivery-plain");
    });

    it("Страница Contacts", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/contacts");

        const contacts = await browser.$(".Contacts");

        await contacts.waitForDisplayed();

        await contacts.assertView("contacts-plain");
    });
});

describe("Тестирование содержимого и стилей страниц с диначескими содержимым", () => {
    it("Корректный внешний вид страницы Product", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/catalog/0");

        const productSection = await browser.$(".Product");

        await productSection.waitForDisplayed();

        await productSection.assertView("product-plain", {
            ignoreElements: [ ".ProductDetails-Name",
                ".ProductDetails-Description",
                ".ProductDetails-Price",
                ".ProductDetails-Color",
                ".ProductDetails-Material", ]
        });
    });

    it("Корректный внешний вид успешного сообщения на странице Cart после отправки формы checkout", async ({ browser }) => {


        await browser.url("http://localhost:3000/hw/store/cart");

        await browser.execute(() => {
            localStorage.setItem("example-store-cart", JSON.stringify({ 1: { name: "Product 1", count: 1, price: 100 } }));
        });

        await browser.refresh();

        const form = await browser.$(".Form");
        await form.waitForDisplayed();

        const nameField = await form.$(".Form-Field_type_name");
        const phoneField = await form.$(".Form-Field_type_phone");
        const addressField = await form.$(".Form-Field_type_address");
        const submitButton = await form.$(".Form-Submit");

        await nameField.setValue("John Doe");
        await phoneField.setValue("1234567890");
        await addressField.setValue("USA");

        await submitButton.click();

        const successMessage = browser.$(".Cart-SuccessMessage");

        await successMessage.waitForDisplayed();

        await successMessage.assertView("success-message-plain", {ignoreElements: ".Cart-Number"});

        await browser.execute(() => localStorage.clear());
    });
});

describe("Тестирование корректности данных сервера", () => {
    it("На странице Catalog данные о товарах не пустые", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/catalog");

        const catalog = await browser.$(".Catalog");

        await catalog.waitForDisplayed();

        const productNames = await Promise.all(await catalog.$$(".ProductItem-Name").map(name => name.getText()));
        const productPrices = await Promise.all(await catalog.$$(".ProductItem-Price").map(price => price.getText()));

        for (let name of productNames) {
            expect(name).toBeTruthy();
        }

        for (let price of productPrices) {
            expect(price).toBeTruthy();
        }
    });

    it("На странице Catalog При клике на ссылку на Product в карточке продукта должен возвращаться существующий продукт, нет бесконечной загрузки", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/catalog");

        const catalog = await browser.$(".Catalog");

        await catalog.waitForDisplayed();

        const productLinks = (await catalog.$$(".ProductItem-DetailsLink")).slice(0, 8);

        for (let link of productLinks) {
            await link.click();

            const productDetails = await browser.$(".ProductDetails");

            await productDetails.waitForDisplayed();

            await browser.url("http://localhost:3000/hw/store/catalog");
        }
    });

});
