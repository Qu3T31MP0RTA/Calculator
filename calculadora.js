// =========================
// Variables principales
// =========================
var bd;               // Base de datos
var nm;               // Valor actual del input (ecuación)
var res;              // Resultado calculado de la ecuación
var memoryContainer;  // Contenedor donde se mostrarán los registros
var idEnEdicion = null; // Guarda el id del registro que se está editando

// =========================
// Inicialización al cargar la página
// =========================
function runbd() {
    memoryContainer = document.querySelector("#Memory");
    var btnGuardar = document.querySelector(".btnGuardar");

    // Asociar evento click al botón Guardar
    btnGuardar.addEventListener("click", almacenarNumero);

    // Abrir base de datos IndexedDB
    var solicitud = indexedDB.open("Resultado-y-operaciones");
    solicitud.addEventListener("error", MostrarError);       // Manejo de errores
    solicitud.addEventListener("success", Comenzar);         // Conexión exitosa
    solicitud.addEventListener("upgradeneeded", Crearalmacen); // Crear almacen si no existe
}

// =========================
// Crear almacen de datos
// =========================
function Crearalmacen(evento) {
    var baseDatos = evento.target.result;

    // Creamos un objectStore llamado "numero" con clave primaria autoincremental
    var almacen = baseDatos.createObjectStore("numero", { keyPath: "id", autoIncrement: true });

    // Creamos índices para poder buscar por ecuación o resultado si se desea
    almacen.createIndex("ecuacion", "ecuacion", { unique: false });
    almacen.createIndex("resultado", "resultado", { unique: false });
}

// =========================
// Guardar o actualizar un registro
// =========================
function almacenarNumero() {
    // Validación: no guardar ecuación vacía
    if (!nm || nm.trim() === "") {
        alert("No puedes guardar una ecuación vacía.");
        return;
    }

    // Iniciamos transacción en modo lectura/escritura
    var transaction = bd.transaction(["numero"], "readwrite");
    var almacen = transaction.objectStore("numero");

    if (idEnEdicion !== null) {
        // Si estamos editando, actualizamos el registro existente
        almacen.put({ id: idEnEdicion, ecuacion: nm, resultado: res });
        idEnEdicion = null; // Reseteamos la edición
    } else {
        // Si no, agregamos un nuevo registro
        almacen.add({ ecuacion: nm, resultado: res });
    }

    // Cuando la transacción se completa, mostramos los registros actualizados
    transaction.addEventListener("complete", Mostrar);

    // Limpiamos input y variables
    document.querySelector("#input").value = "";
    nm = "";
    res = "";
}

// =========================
// Mostrar todos los registros
// =========================
function Mostrar() {
    memoryContainer.innerHTML = "";

    var transaccion = bd.transaction(["numero"]);
    var almacen = transaccion.objectStore("numero");
    var puntero = almacen.openCursor();

    puntero.addEventListener("success", MostrarNumero);
}

// =========================
// Mostrar cada registro individual con botón para editar
// =========================
function MostrarNumero(evento) {
    var puntero = evento.target.result;

    if (puntero) {
        memoryContainer.innerHTML += `
            <div class="contenido">
                <strong>Ecuación:</strong> ${puntero.value.ecuacion} <br>
                <strong>Resultado:</strong> ${puntero.value.resultado} <br>
                <div class = "Flex">
                <button class="borrar" value="Borrar" onclick="eliminarNumero(${puntero.value.id})">Borrar</button>
                <button class="Mmas">M+</button>
                <button class="Mmenos">M-</button>
                <button class="editarr"  onclick="editarEcuacion(${puntero.value.id})">Editar</button>
                </div>

            </div>
        `;
        puntero.continue(); // Pasar al siguiente registro
    }
}

// =========================
// Cargar registro en el input para editarlo
// =========================
function editarEcuacion(id) {
    var transaccion = bd.transaction(["numero"], "readonly");
    var almacen = transaccion.objectStore("numero");
    var solicitud = almacen.get(id);

    solicitud.addEventListener("success", function () {
        let resultado = solicitud.result;

        if (resultado) {
            idEnEdicion = id; // Guardamos el id del registro en edición
            document.querySelector("#input").value = resultado.ecuacion; // Mostramos ecuación
            nm = resultado.ecuacion; // Actualizamos variable nm
            res = resultado.resultado; // Actualizamos variable res
        }
    });
}

// =========================
// botone de eliminar
// =========================
function eliminarNumero(key) {
    var transaccion = bd.transaction(["numero"], "readwrite");
    var almacen = transaccion.objectStore("numero");
    var solicitud = almacen.delete(key);
    transaccion.addEventListener("complete", Mostrar);
}
function eliminarTodo() {
    var transaccion = bd.transaction(["numero"], "readwrite");
    var almacen = transaccion.objectStore("numero");
    var solicitud = almacen.clear();
    transaccion.addEventListener("complete", Mostrar);
}
// =========================
// Manejo de errores
// =========================
function MostrarError(evento) {
    console.error("Error", evento);
}
// =========================
// Conexión exitosa a la base de datos
// =========================
function Comenzar(evento) {
    bd = evento.target.result;
    Mostrar(); // Mostrar registros al iniciar
}

// =========================
// Inicializar todo al cargar la página
// =========================
window.addEventListener("load", runbd);





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
const mMore = document.querySelector("#precionar");

bmore.addEventListener("click", (e) => {
    mMore.classList.toggle('memoryButton');
});

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
        if (value === "+/-") {
            let expr = input.value;
            let regex = /(-?\d+(\.\d+)?)(?!.*\d)/;
            let match = expr.match(regex);
            if (match) {
                let numero = match[0];
                let numeroInvertido = numero.startsWith("-") ? numero.slice(1) : "-" + numero;
                input.value = expr.slice(0, match.index) + numeroInvertido + expr.slice(match.index + numero.length);
            }

            return;
        }


        if (value === "%") {
            if (input.value !== "") {
                input.value = (parseFloat(input.value) / 100).toString();
                return;
            }
        }
        if (value === "1/") {
            if (input.value !== "" && parseFloat(input.value) !== 0) {
                input.value = (1 / parseFloat(input.value)).toString();
            }
            else {
                alert("Error: División entre 0");
            }
            return;
        }

        else { input.value += value; }
    });
});
function parseEcuacion(input) {
    //  Lista de caracteres permitidos
    const permitidos = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=^() ";

    //  Verificar que cada carácter sea válido
    for (let i = 0; i < input.length; i++) {
        if (!permitidos.includes(input[i])) {
            return { valido: false, error: `Carácter inválido: "${input[i]}"` };
        }
    }

    //  Tokenización: separar números, letras y operadores
    const regex = /[a-zA-Z]+|\d+(\.\d+)?|[+\-*/^=()]/g;
    const tokens = input.match(regex);

    //  Revisar que haya tokens válidos
    if (!tokens || tokens.length === 0) {
        return { valido: false, error: "Ecuación vacía o inválida" };
    }

    // Todo válido
    return { valido: true, tokens: tokens };
}

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
// Funciones DMS y DEG
// =========================
function DMS(x) {
    let grados = Math.floor(x);
    let minutosDecimal = (x - grados) * 60;
    let minutos = Math.floor(minutosDecimal);
    let segundos = (minutosDecimal - minutos) * 60;
    return `${grados}° ${minutos}' ${segundos.toFixed(2)}"`;
}
function DEG(g, m, s) {
    return g + (m / 60) + (s / 3600);
}
function mod(a, b) {
    return ((a % b) + b) % b;
}

// =========================
// 4. Calcular expresión
// =========================
function calcularResultado() {
    equalPressed = 1;
    let inputValue = input.value;
    try {
        let expresion = inputValue;

        // Validar con parser ANTES de reemplazos
        const parsed = parseEcuacion(inputValue);
        if (!parsed.valido) {
            alert("Error: " + parsed.error);
            return;
        }
        // Reemplazos matemáticos
        expresion = expresion.replaceAll("pow(", "Math.pow(");
        expresion = expresion.replaceAll("xylog(", "logxy(");
        expresion = expresion.replace(/(\d+\.?\d*)→dms/g, 'DMS($1)');
        expresion = expresion.replace(/(\d+),(\d+),(\d+)→deg/g, 'DEG($1,$2,$3)');

        expresion = expresion
            .replaceAll("MOD(", "mod(")
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
            .replaceAll("²", "**2")
            .replaceAll("³", "**3")
            .replaceAll("²√x", "Math.sqrt")
            .replaceAll("∛x", "Math.cbrt")
            .replaceAll("yroot(", "Math.pow(")
            .replaceAll("exp(", "Math.exp(")
            .replaceAll("ln(", "Math.log(")
            .replaceAll("log(", "Math.log10(")
            .replaceAll("e^", "Math.exp(")
            .replaceAll("10^", "10**")
            .replaceAll("|x|(", "Math.abs(")
            .replaceAll("⌊x⌋(", "Math.floor(")
            .replaceAll("⌈x⌉(", "Math.ceil(")
            .replaceAll(/(\d+)!/g, (_, num) => factorial(Number(num)));

        let result = eval(expresion);
        console.log(expresion)
        // Mostrar correctamente si es string (DMS) o número
        input.value = typeof result === "string" ? result : (Number.isInteger(result) ? result : result.toFixed(2));

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
    span.className = "guardarsiosi";
    nm = span.textContent = `${expresion}`;
    res = span.textContent = `${result}`;


    // Estilos contenedor historial
    divItem.className = "historyItem";
    divItem.style.display = "flex";
    divItem.style.justifyContent = "center";

    // Texto del historial
    span.dataset.userInput = expresion;
    span.style.cursor = "pointer";
    span.style.color = "white";
    span.textContent = `${expresion} = ${result}`;
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
