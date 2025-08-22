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
const bmore = document.querySelector('#clickk');
const mMore = document.querySelector("#precionar")

bmore.addEventListener("click", (e) => {
    mMore.classList.toggle('memoryButton');
})

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
// 3.5 funciones matematicas
// =========================

Math.sec = function (x) { return 1 / Math.cos(x); };
Math.cot = function (x) { return 1 / Math.tan(x); };
Math.csc = function (x) { return 1 / Math.sin(x); };

Math.asec = function (x) { return Math.acos(1 / x); };
Math.acot = function (x) { return Math.atan(1 / x); };
Math.acsc = function (x) { return Math.asin(1 / x); };

Math.sech = function (x) { return 1 / Math.cosh(x); };
Math.coth = function (x) { return 1 / Math.tanh(x); };
Math.csch = function (x) { return 1 / Math.sinh(x); };

Math.acoth = function (x) { return 0.5 * Math.log((x + 1) / (x - 1)); };
Math.asech = function (x) { return Math.log((1 + Math.sqrt(1 - x * x)) / x); };
Math.acsch = function (x) { return Math.log((1 / x) + Math.sqrt(1 + 1 / (x * x))); };
function logxy(x, y) { return Math.log(x) / Math.log(y); };

// =========================
// 4. Calcular expresión
// =========================
function calcularResultado() {
    equalPressed = 1;
    let inputValue = input.value;

    try {
        let expresion = inputValue;
        expresion = expresion.replaceAll("xylog(", "logxy(");
        expresion = expresion
            .replaceAll(/\bacoth\b/g, "Math.acosh")
            .replaceAll(/\bacsch\b/g, "Math.acsch")
            .replaceAll(/\basech\b/g, "Math.asech")
            .replaceAll(/\basin\b/g, "Math.asin")
            .replaceAll(/\bacos\b/g, "Math.acos")
            .replaceAll(/\batan\b/g, "Math.atan")
            .replaceAll(/\basec\b/g, "Math.asec")
            .replaceAll(/\bacsc\b/g, "Math.acsc")
            .replaceAll(/\bacot\b/g, "Math.acot")
            .replaceAll(/\basinh\b/g, "Math.asinh")
            .replaceAll(/\bacosh\b/g, "Math.acosh")
            .replaceAll(/\batanh\b/g, "Math.atanh")
            .replaceAll(/\bsinh\b/g, "Math.sinh")
            .replaceAll(/\bcosh\b/g, "Math.cosh")
            .replaceAll(/\btanh\b/g, "Math.tanh")
            .replaceAll(/\bcoth\b/g, "Math.coth")
            .replaceAll(/\bcsch\b/g, "Math.csch")
            .replaceAll(/\bsech\b/g, "Math.sech")
            .replaceAll(/\bsin\b/g, "Math.sin")
            .replaceAll(/\bcos\b/g, "Math.cos")
            .replaceAll(/\btan\b/g, "Math.tan")
            .replaceAll(/\bsec\b/g, "Math.sec")
            .replaceAll(/\bcot\b/g, "Math.cot")
            .replaceAll(/\bcsc\b/g, "Math.csc")
            .replaceAll("x^2", "**2")
            .replaceAll("x^3", "**3")
            .replaceAll("²√x", "Math.sqrt")
            .replaceAll("∛x", "Math.cbrt")
            .replaceAll("yroot(", "Math.pow(")
            .replaceAll("ln(", "Math.log(")
            .replaceAll("log(", "Math.log10(")
            .replaceAll("e^", "Math.exp(")
            .replaceAll("10^", "10**")
            .replaceAll("x^y", "**")
            .replaceAll("|x|", "Math.abs(")
            .replaceAll("⌊x⌋", "Math.floor(")
            .replaceAll("⌈x⌉", "Math.ceil(")
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
}

equal.addEventListener("click", calcularResultado);


// =========================
// 5. Funciones auxiliares
// =========================
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function addToHistory(expresion, result) {
    let divItem = document.createElement("div");
    let span = document.createElement("span");
    let button = document.createElement("button");

    // Estilos contenedor historial
    divItem.className = "historyItem";
    divItem.style.display = "flex";
    divItem.style.justifyContent = "center";

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
