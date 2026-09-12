const base = require("@playwright/test");
const { CalculatorPage } = require("../pages/CalculatorPage");

/**
 * Fixture que inyecta una CalculatorPage ya navegada a "/" en cada test,
 * evitando repetir el boilerplate de goto() en cada spec.
 */
const test = base.test.extend({
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();
    await use(calculatorPage);
  },
});

const expect = base.expect;

module.exports = { test, expect };
