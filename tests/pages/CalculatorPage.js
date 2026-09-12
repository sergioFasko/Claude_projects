/**
 * Page Object Model de la calculadora web.
 * Centraliza selectores y acciones para que las specs queden legibles
 * y para que un cambio de UI solo requiera tocar este archivo.
 */
class CalculatorPage {
  constructor(page) {
    this.page = page;
    this.display = page.getByTestId("display");
    this.errorMessage = page.getByTestId("error-message");
    this.status = page.getByTestId("status");
    this.themeSelect = page.getByTestId("theme-select");
  }

  async goto() {
    await this.page.goto("/");
  }

  button(value) {
    const map = {
      "0": "btn-0", "1": "btn-1", "2": "btn-2", "3": "btn-3", "4": "btn-4",
      "5": "btn-5", "6": "btn-6", "7": "btn-7", "8": "btn-8", "9": "btn-9",
      ".": "btn-dot",
      "+": "btn-add",
      "-": "btn-subtract",
      "×": "btn-multiply",
      "÷": "btn-divide",
      "=": "btn-equals",
      "C": "btn-clear",
      "⌫": "btn-backspace",
    };
    const testId = map[value];
    if (!testId) {
      throw new Error(`Botón desconocido: ${value}`);
    }
    return this.page.getByTestId(testId);
  }

  /** Pulsa una secuencia de botones, ej: type("12+3=") */
  async type(sequence) {
    for (const char of sequence) {
      await this.button(char).click();
    }
  }

  async pressEquals() {
    await this.button("=").click();
  }

  async clear() {
    await this.button("C").click();
  }

  async getDisplayValue() {
    return this.display.inputValue();
  }

  async selectTheme(nombre) {
    await this.themeSelect.selectOption(nombre);
  }

  async getStatusText() {
    return this.status.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}

module.exports = { CalculatorPage };
