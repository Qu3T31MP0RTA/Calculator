// =========================
// 1. Variables principales
// =========================
let equalPressed = 0;
let buttons = document.querySelectorAll(".button");
let input = document.getElementById("input");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let erase = document.getElementById("erase");
let historyContent = document.getElementById("historyContent");

// =========================
// 2. Inicialización
// =========================
window.onload = () => {
    input.value = "";
};

// =========================
// 3. Manejo de botones
// =========================
buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (equalPressed === 1) {
            equalPressed = 0;
        }

        let value = event.target.dataset.number;

        if (value === "AC") {
            input.value = "";
            return;
        }

        if (value === "DEL") {
            input.value = input.value.slice(0, -1);
            return;
        }

        input.value += value;
    });
});

// =========================
// 4. Calcular expresión
// =========================
equal.addEventListener("click", () => {
    equalPressed = 1;
    let inputValue = input.value;

    try {
        let expresion = inputValue
            .replaceAll("sin", "Math.sin")
            .replaceAll("cos", "Math.cos")
            .replaceAll("tan", "Math.tan")
            .replaceAll("^2", "**2")
            .replaceAll("^3", "**3")
            .replaceAll("√", "Math.sqrt")
            .replaceAll("∛", "Math.cbrt")
            .replaceAll(/(\d+)!/g, (_, num) => factorial(Number(num)));

        let result = eval(expresion);

        if (Number.isNaN(result) || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        input.value = Number.isInteger(result) ? result : result.toFixed(2);
        addToHistory(inputValue, input.value);

    } catch (error) {
        alert("Error: " + error.message);
    }
});

// =========================
// 5. Funciones auxiliares
// =========================
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function addToHistory(expresion, result) {
    let divItem = document.createElement("div");
    let span = document.createElement("span");
    let button = document.createElement("button");

    // Estilos contenedor historial
    divItem.className = "historyItem";
    divItem.style.display = "flex";
    divItem.style.justifyContent = "space-between";

    // Texto del historial
    span.textContent = `${expresion} = ${result}`;
    span.dataset.userInput = expresion;
    span.style.cursor = "pointer";
    span.style.color = "white";

    // Botón eliminar historial
    button.textContent = "Delete";
    button.className = "btn-sm";
    button.style.color = "white";
    button.style.background = "red";

    // Eventos
    button.addEventListener("click", () => divItem.remove());
    span.addEventListener("click", () => {
        input.value = span.dataset.userInput;
    });

    // Agregar al historial
    divItem.appendChild(span);
    divItem.appendChild(button);
    historyContent.appendChild(divItem);
}
