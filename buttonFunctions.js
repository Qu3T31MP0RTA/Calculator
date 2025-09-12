// 1. Funciones matemáticas extendidas

// Funciones trigonométricas inversas y recíprocas
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

// Función logaritmo con base arbitraria
function logxy(x, y) {
    return Math.log(x) / Math.log(y);
}


// 2. Funciones DMS y DEG

// Convierte decimal a grados, minutos y segundos
function DMS(x) {
    const grados = Math.floor(x);
    const minutosDecimal = (x - grados) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = (minutosDecimal - minutos) * 60;
    return `${grados}° ${minutos}' ${segundos.toFixed(2)}"`;
}

// Convierte grados, minutos y segundos a decimal
function DEG(g, m, s) {
    return g + (m / 60) + (s / 3600);
}

// Módulo matemático positivo
function mod(a, b) {
    return ((a % b) + b) % b;
}

// Notación exponencial
function EXPT(a, b) {
    return a * Math.pow(10, b);
}

// Factorial recursivo
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}


// 3. Manejo de modos de ángulo

let estado = 0;

// Botón para cambiar modo GRAD/DEG/RAD
document.getElementById("multiBtn").addEventListener("click", () => {
    const btn = document.getElementById("multiBtn");

    switch (estado) {
        case 0:
            btn.textContent = "GRAD";
            estado = 1;
            break;
        case 1:
            btn.textContent = "DEG";
            estado = 2;
            break;
        case 2:
            btn.textContent = "RAD";
            estado = 0;
            break;
    }
});

// Obtener modo de ángulo actual
function obtenerModoAngulo() {
    return document.getElementById("multiBtn").textContent; // DEVUELVE: DEG, RAD o GRAD
}


// 4. Transformación de argumentos trigonométricos según modo

function transformarArgumentosTrigo(expresion) {
    const modo = obtenerModoAngulo();

    return expresion.replace(/\b(sin|cos|tan|sec|csc|cot|asin|acos|atan|asec|acsc|acot)\s*\(([^)]+)\)/g,
        (match, func, arg) => {
            let nuevoArg = arg;
            let conversionResultado = "";

            // Para funciones trigonométricas normales
            if (!func.startsWith("a")) {
                if (modo === "DEG") nuevoArg = `(${arg})*Math.PI/180`;
                if (modo === "GRAD") nuevoArg = `(${arg})*Math.PI/200`;
            }

            // Para funciones inversas
            if (func.startsWith("a")) {
                if (modo === "DEG") conversionResultado = `*180/Math.PI`;
                if (modo === "GRAD") conversionResultado = `*200/Math.PI`;
            }

            return `${func}(${nuevoArg})${conversionResultado}`;
        });
}


// 5. Botón F-E

const btnFe = document.querySelector("#fBtn");
let active = false;

btnFe.addEventListener("click", () => {
    active = !active;
    console.log("F-E activado:", active);
});
function replaceFunction(expresion) {
    let output = expresion;
    output = output
        .replaceAll("pow(", "Math.pow(")
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

    output = transformarArgumentosTrigo(output);
    return output;
}
// Calcula 1/x validando división por cero
function calcularInverso() {
    if (input.value !== "" && parseFloat(input.value) !== 0) {
        input.value = (1 / parseFloat(input.value)).toString();
        stateObject.expression = input.value;
    } else {
        alert("Error: División entre 0");
    }
}
// Cambia el signo al último número escrito
function invertirUltimoNumero() {
    const expr = input.value;
    const regex = /(-?\d+(\.\d+)?)(?!.*\d)/;
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

        stateObject.expression = input.value;
    }
}
