import ast
import operator
import tkinter as tk
from tkinter import messagebox, ttk


class Calculadora(tk.Tk):
    TEMAS = {
        "Azul": {
            "fondo": "#eaf3ff",
            "panel": "#d5e7ff",
            "boton": "#b9d7ff",
            "accion": "#3578c4",
            "texto_accion": "#ffffff",
            "texto": "#17324d",
        },
        "Verde": {
            "fondo": "#edf8ef",
            "panel": "#d5efd9",
            "boton": "#b9dfbf",
            "accion": "#39844b",
            "texto_accion": "#ffffff",
            "texto": "#193b22",
        },
        "Amarillo": {
            "fondo": "#fff9df",
            "panel": "#f8edb5",
            "boton": "#f5df7c",
            "accion": "#b18400",
            "texto_accion": "#ffffff",
            "texto": "#4d3d00",
        },
    }

    def __init__(self):
        super().__init__()
        self.title("Calculadora")
        self.resizable(False, False)
        self.tema_actual = tk.StringVar(value="Azul")
        self.pantalla = tk.StringVar()
        self._crear_interfaz()
        self._aplicar_tema()

    def _crear_interfaz(self):
        self.contenedor = tk.Frame(self, padx=16, pady=16)
        self.contenedor.grid()

        self.titulo = tk.Label(
            self.contenedor,
            text="Calculadora",
            font=("Segoe UI", 18, "bold"),
        )
        self.titulo.grid(row=0, column=0, columnspan=4, sticky="w", pady=(0, 10))

        self.selector = ttk.Combobox(
            self.contenedor,
            textvariable=self.tema_actual,
            values=list(self.TEMAS),
            state="readonly",
            width=12,
        )
        self.selector.grid(row=0, column=3, sticky="e", pady=(0, 10))
        self.selector.bind("<<ComboboxSelected>>", lambda _: self._aplicar_tema())

        self.entrada = tk.Entry(
            self.contenedor,
            textvariable=self.pantalla,
            justify="right",
            font=("Segoe UI", 22),
            relief="flat",
            width=18,
            state="readonly",
            readonlybackground="white",
        )
        self.entrada.grid(row=1, column=0, columnspan=4, sticky="ew", pady=(0, 12))

        botones = [
            ("C", 2, 0, "accion"),
            ("⌫", 2, 1, "accion"),
            ("÷", 2, 2, "operador"),
            ("×", 2, 3, "operador"),
            ("7", 3, 0, "numero"),
            ("8", 3, 1, "numero"),
            ("9", 3, 2, "numero"),
            ("-", 3, 3, "operador"),
            ("4", 4, 0, "numero"),
            ("5", 4, 1, "numero"),
            ("6", 4, 2, "numero"),
            ("+", 4, 3, "operador"),
            ("1", 5, 0, "numero"),
            ("2", 5, 1, "numero"),
            ("3", 5, 2, "numero"),
            ("=", 5, 3, "igual"),
            ("0", 6, 0, "numero"),
            (".", 6, 1, "numero"),
        ]

        self.botones = []
        for texto, fila, columna, tipo in botones:
            boton = tk.Button(
                self.contenedor,
                text=texto,
                font=("Segoe UI", 14, "bold"),
                width=4,
                height=2,
                relief="flat",
                cursor="hand2",
                command=lambda valor=texto: self._pulsar(valor),
            )
            boton.grid(row=fila, column=columna, padx=3, pady=3, sticky="nsew")
            self.botones.append((boton, tipo))

        self.estado = tk.Label(self.contenedor, text="Tema: Azul", anchor="w")
        self.estado.grid(row=7, column=0, columnspan=4, sticky="ew", pady=(8, 0))

    def _pulsar(self, valor):
        if valor == "C":
            self.pantalla.set("")
        elif valor == "⌫":
            self.pantalla.set(self.pantalla.get()[:-1])
        elif valor == "=":
            self._calcular()
        else:
            simbolo = {"×": "*", "÷": "/"}.get(valor, valor)
            self.pantalla.set(self.pantalla.get() + simbolo)

    def _calcular(self):
        expresion = self.pantalla.get()
        try:
            resultado = self._evaluar(expresion)
        except (SyntaxError, ValueError, ZeroDivisionError):
            self.pantalla.set("")
            messagebox.showerror("Operación no válida", "Introduce una operación aritmética válida.")
            return

        self.pantalla.set(str(int(resultado) if resultado.is_integer() else resultado))

    @staticmethod
    def _evaluar(expresion):
        if not expresion:
            raise ValueError("Expresión vacía")

        arbol = ast.parse(expresion, mode="eval")
        operaciones = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.truediv,
            ast.USub: operator.neg,
            ast.UAdd: operator.pos,
        }

        def resolver(nodo):
            if isinstance(nodo, ast.Expression):
                return resolver(nodo.body)
            if isinstance(nodo, ast.Constant) and isinstance(nodo.value, (int, float)):
                return float(nodo.value)
            if isinstance(nodo, ast.UnaryOp) and type(nodo.op) in operaciones:
                return operaciones[type(nodo.op)](resolver(nodo.operand))
            if isinstance(nodo, ast.BinOp) and type(nodo.op) in operaciones:
                return operaciones[type(nodo.op)](resolver(nodo.left), resolver(nodo.right))
            raise ValueError("Operación no permitida")

        return resolver(arbol)

    def _aplicar_tema(self):
        colores = self.TEMAS[self.tema_actual.get()]
        self.configure(bg=colores["fondo"])
        self.contenedor.configure(bg=colores["fondo"])
        self.titulo.configure(bg=colores["fondo"], fg=colores["texto"])
        self.entrada.configure(
            bg=colores["panel"],
            fg=colores["texto"],
            readonlybackground=colores["panel"],
        )
        self.estado.configure(bg=colores["fondo"], fg=colores["texto"])

        for boton, tipo in self.botones:
            color = colores["accion"] if tipo in ("accion", "igual") else colores["boton"]
            texto = colores["texto_accion"] if tipo in ("accion", "igual") else colores["texto"]
            boton.configure(bg=color, fg=texto, activebackground=colores["accion"])

        self.estado.configure(text=f"Tema: {self.tema_actual.get()}")


if __name__ == "__main__":
    Calculadora().mainloop()
