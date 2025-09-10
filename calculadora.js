// Variables principales
let equalPressed = 0; // Bandera: indica si se presionó "="

const buttons = document.querySelectorAll(".button"); // Todos los botones
const input = document.getElementById("input");       // Pantalla principal
const equal = document.getElementById("equal");       // Botón "="
const clear = document.getElementById("clear");       // Botón "AC"
const erase = document.getElementById("erase");       // Botón "DEL"
const historyContent = document.getElementById("historyContent"); // Historial

// Botón de mostrar/ocultar memoria
const bmore = document.querySelector("#clickk");
const mMore = document.querySelector("#precionar");

// Toggle para mostrar/ocultar la memoria
bmore.addEventListener("click", () => {
    mMore.classList.toggle("memoryButton");
});

// Inicialización
window.onload = () => {
    input.value = ""; // Limpiar pantalla al inicio
};

// Manejo de botones
buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (equalPressed) equalPressed = 0;

        const value = event.target.dataset.number;

        switch (value) {
            case "AC": // Limpiar pantalla
                input.value = "";
                break;

            case "DEL": // Borrar último caracter
                input.value = input.value.slice(0, -1);
                break;

            case "+/-": // Cambiar signo del último número
                invertirUltimoNumero();
                break;

            case "%": // Convertir a porcentaje
                if (input.value !== "") {
                    input.value = (parseFloat(input.value) / 100).toString();
                }
                break;

            case "1/": // Inverso
                calcularInverso();
                break;

            default: // Agregar el valor al input
                input.value += value;
        }
    });
});

// Funciones auxiliares

// Cambia el signo al último número escrito
function invertirUltimoNumero() {
    const expr = input.value;
    const regex = /(-?\d+(\.\d+)?)(?!.*\d)/; // último número
    const match = expr.match(regex);

    if (match) {
        const numero = match[0];
        const numeroInvertido = numero.startsWith("-")
            ? numero.slice(1)
            : "-" + numero;

        input.value =
            expr.slice(0, match.index) +
            numeroInvertido +
            expr.slice(match.index + numero.length);
    }
}

// Calcula 1/x validando división por cero
function calcularInverso() {
    if (input.value !== "" && parseFloat(input.value) !== 0) {
        input.value = (1 / parseFloat(input.value)).toString();
    } else {
        alert("Error: División entre 0");
    }
}

// Calcular expresión
function calcularResultado() {
    equalPressed = 1;
    const inputValue = input.value;

    try {
        let expresion = inputValue;

        // Validar con parser ANTES de reemplazos
        if (!parsear(inputValue)) return;

        // Reemplazos matemáticos
        expresion = expresion.replaceAll("pow(", "Math.pow(")
            .replaceAll("xylog(", "logxy(")
            .replace(/(\d+\.?\d*)→dms/g, "DMS($1)")
            .replace(/(\d+),(\d+),(\d+)→deg/g, "DEG($1,$2,$3)")
            .replace(/∛(\d+(\.\d+)?|\([^()]+\))/g, "Math.cbrt($1)")
            .replace(/²√(\d+(\.\d+)?|\([^()]+\))/g, "Math.sqrt($1)")
            .replace(/yroot(\d+(\.\d+)?|\([^()]+\))/g, "Math.pow($1)")
            .replaceAll("MOD(", "mod(")
            // Trigonometría y logaritmos
            .replaceAll(/\bacoth\b/g, "Math.acoth")
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
            // Potencias y raíces
            .replaceAll("²", "**2")
            .replaceAll("³", "**3")
            // Logs y exponenciales
            .replaceAll("exp(", "EXPT(")
            .replaceAll("ln(", "Math.log(")
            .replaceAll("log(", "Math.log10(")
            .replaceAll("e^(", "Math.exp(")
            .replaceAll("10^", "10**")
            // Otros
            .replaceAll("|x|(", "Math.abs(")
            .replaceAll("⌊x⌋(", "Math.floor(")
            .replaceAll("⌈x⌉(", "Math.ceil(")
            .replaceAll(/(\d+)!/g, (_, num) => factorial(Number(num)));

        // Ajustar argumentos trigonométricos
        expresion = transformarArgumentosTrigo(expresion);

        // Evaluar la expresión final
        const result = eval(expresion);
        console.log("Expresión evaluada:", expresion);

        // Mostrar resultado
        input.value = (typeof result === "string")
            ? result
            : (Number.isInteger(result) ? result : result.toFixed(2));

        // Guardar en historial/memoria
        agregarId(inputValue, input.value);

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Evento: calcular al presionar "="
equal.addEventListener("click", calcularResultado);
