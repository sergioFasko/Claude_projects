const { test, expect } = require("../fixtures");

test.describe("Calculadora - operaciones válidas", () => {
  test("suma dos números enteros", async ({ calculatorPage }) => {
    await calculatorPage.type("12+8");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("20");
  });

  test("resta con resultado negativo", async ({ calculatorPage }) => {
    await calculatorPage.type("5-9");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("-4");
  });

  test("multiplicación", async ({ calculatorPage }) => {
    await calculatorPage.type("6×7");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("42");
  });

  test("división exacta", async ({ calculatorPage }) => {
    await calculatorPage.type("9÷3");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("3");
  });

  test("división con resultado decimal", async ({ calculatorPage }) => {
    await calculatorPage.type("7÷2");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("3.5");
  });

  test("respeta la precedencia de operadores", async ({ calculatorPage }) => {
    await calculatorPage.type("2+3×4");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("14");
  });

  test("número negativo al inicio de la expresión", async ({ calculatorPage }) => {
    await calculatorPage.type("-5+10");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("5");
  });

  test("números decimales", async ({ calculatorPage }) => {
    await calculatorPage.type("1.5+2.25");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("3.75");
  });

  test("botón C borra la pantalla por completo", async ({ calculatorPage }) => {
    await calculatorPage.type("123");
    await calculatorPage.clear();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("botón ⌫ borra el último carácter", async ({ calculatorPage }) => {
    await calculatorPage.type("123");
    await calculatorPage.button("⌫").click();
    await expect(calculatorPage.display).toHaveValue("12");
  });

  test("permite encadenar una nueva operación tras un resultado", async ({ calculatorPage }) => {
    await calculatorPage.type("2+2");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("4");

    await calculatorPage.type("+6");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.display).toHaveValue("10");
  });

  test("cambiar de tema actualiza el texto de estado y el atributo del tema", async ({ calculatorPage, page }) => {
    await calculatorPage.selectTheme("Verde");
    await expect(calculatorPage.status).toHaveText("Tema: Verde");
    await expect(page.locator("body")).toHaveAttribute("data-theme", "Verde");

    await calculatorPage.selectTheme("Amarillo");
    await expect(calculatorPage.status).toHaveText("Tema: Amarillo");
    await expect(page.locator("body")).toHaveAttribute("data-theme", "Amarillo");
  });
});
