// Evaluador aritmético seguro (sin eval/Function), equivalente al parser
// basado en ast del proyecto original en Python (calculadora.py).
//
// Gramática soportada:
//   expr   := term (("+" | "-") term)*
//   term   := factor (("*" | "/") factor)*
//   factor := ("+" | "-") factor | number
function tokenizar(expresion) {
  const tokens = [];
  let i = 0;
  while (i < expresion.length) {
    const c = expresion[i];
    if (c === " ") {
      i++;
      continue;
    }
    if ("+-*/".includes(c)) {
      tokens.push({ tipo: c, valor: c });
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let numero = "";
      while (i < expresion.length && /[0-9.]/.test(expresion[i])) {
        numero += expresion[i];
        i++;
      }
      if ((numero.match(/\./g) || []).length > 1) {
        throw new SyntaxError("Número mal formado");
      }
      tokens.push({ tipo: "numero", valor: parseFloat(numero) });
      continue;
    }
    throw new SyntaxError(`Carácter no permitido: ${c}`);
  }
  return tokens;
}

function crearParser(tokens) {
  let pos = 0;

  function pico() {
    return tokens[pos];
  }

  function avanzar() {
    return tokens[pos++];
  }

  function factor() {
    const token = pico();
    if (!token) {
      throw new SyntaxError("Expresión incompleta");
    }
    if (token.tipo === "+" || token.tipo === "-") {
      avanzar();
      const valor = factor();
      return token.tipo === "-" ? -valor : valor;
    }
    if (token.tipo === "numero") {
      avanzar();
      return token.valor;
    }
    throw new SyntaxError("Se esperaba un número");
  }

  function term() {
    let valor = factor();
    while (pico() && (pico().tipo === "*" || pico().tipo === "/")) {
      const operador = avanzar().tipo;
      const derecho = factor();
      if (operador === "/") {
        if (derecho === 0) {
          throw new RangeError("División por cero");
        }
        valor = valor / derecho;
      } else {
        valor = valor * derecho;
      }
    }
    return valor;
  }

  function expr() {
    let valor = term();
    while (pico() && (pico().tipo === "+" || pico().tipo === "-")) {
      const operador = avanzar().tipo;
      const derecho = term();
      valor = operador === "+" ? valor + derecho : valor - derecho;
    }
    if (pico()) {
      throw new SyntaxError("Token inesperado");
    }
    return valor;
  }

  return { expr };
}

function evaluarExpresion(expresion) {
  if (!expresion) {
    throw new ValueError("Expresión vacía");
  }
  const tokens = tokenizar(expresion);
  return crearParser(tokens).expr();
}

class ValueError extends Error {}

const TEMAS = ["Azul", "Verde", "Amarillo"];

function formatearResultado(resultado) {
  if (Number.isInteger(resultado)) {
    return String(resultado);
  }
  return String(resultado);
}

function initCalculadora(doc = document) {
  const pantalla = doc.getElementById("pantalla");
  const errorMensaje = doc.getElementById("error-mensaje");
  const selectorTema = doc.getElementById("selector-tema");
  const estado = doc.getElementById("estado");
  const botones = doc.querySelectorAll(".btn");

  function ocultarError() {
    errorMensaje.hidden = true;
  }

  function mostrarError() {
    pantalla.value = "";
    errorMensaje.hidden = false;
  }

  function pulsar(valor) {
    ocultarError();
    if (valor === "C") {
      pantalla.value = "";
      return;
    }
    if (valor === "⌫") {
      pantalla.value = pantalla.value.slice(0, -1);
      return;
    }
    if (valor === "=") {
      calcular();
      return;
    }
    const simbolo = { "×": "*", "÷": "/" }[valor] ?? valor;
    pantalla.value += simbolo;
  }

  function calcular() {
    const expresion = pantalla.value;
    try {
      const resultado = evaluarExpresion(expresion);
      pantalla.value = formatearResultado(resultado);
    } catch (err) {
      mostrarError();
    }
  }

  function aplicarTema(tema) {
    doc.body.setAttribute("data-theme", tema);
    estado.textContent = `Tema: ${tema}`;
  }

  botones.forEach((boton) => {
    boton.addEventListener("click", () => pulsar(boton.dataset.value));
  });

  selectorTema.addEventListener("change", (event) => {
    aplicarTema(event.target.value);
  });

  aplicarTema(selectorTema.value);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => initCalculadora());
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { evaluarExpresion, tokenizar, TEMAS };
}
