const { test, expect } = require("../fixtures");

test.describe("Calculadora - casos negativos y manejo de errores", () => {
  test("división por cero muestra un mensaje de error", async ({ calculatorPage }) => {
    await calculatorPage.type("5÷0");
    await calculatorPage.pressEquals();

    await expect(calculatorPage.errorMessage).toBeVisible();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("expresión incompleta (operador final) muestra error", async ({ calculatorPage }) => {
    await calculatorPage.type("5+");
    await calculatorPage.pressEquals();

    await expect(calculatorPage.errorMessage).toBeVisible();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("pantalla vacía al pulsar = muestra error", async ({ calculatorPage }) => {
    await calculatorPage.pressEquals();

    await expect(calculatorPage.errorMessage).toBeVisible();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("dos operadores seguidos muestran error", async ({ calculatorPage }) => {
    await calculatorPage.type("3+×2");
    await calculatorPage.pressEquals();

    await expect(calculatorPage.errorMessage).toBeVisible();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("número mal formado (dos puntos decimales) muestra error", async ({ calculatorPage }) => {
    await calculatorPage.type("1..5+2");
    await calculatorPage.pressEquals();

    await expect(calculatorPage.errorMessage).toBeVisible();
    await expect(calculatorPage.display).toHaveValue("");
  });

  test("el mensaje de error desaparece al empezar una nueva operación", async ({ calculatorPage }) => {
    await calculatorPage.type("5÷0");
    await calculatorPage.pressEquals();
    await expect(calculatorPage.errorMessage).toBeVisible();

    await calculatorPage.type("2+2");
    await expect(calculatorPage.errorMessage).toBeHidden();
  });

  test("borrar tras un error dejando la pantalla vacía no lanza excepción", async ({ calculatorPage }) => {
    await calculatorPage.type("5÷0");
    await calculatorPage.pressEquals();
    await calculatorPage.clear();

    await expect(calculatorPage.display).toHaveValue("");
    await expect(calculatorPage.errorMessage).toBeHidden();
  });
});
