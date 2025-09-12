// calculadora.js
// Variables principales
const buttons = document.querySelectorAll(".button"); // Todos los botones
const input = document.getElementById("input");       // Pantalla principal
const equal = document.getElementById("equal");       // Botón "="
const clear = document.getElementById("clear");       // Botón "AC"
const erase = document.getElementById("erase");       // Botón "DEL"
const historyContent = document.getElementById("historyContent"); // Historial

// Botón de mostrar/ocultar memoria
const bmore = document.querySelector("#clickk");
const mMore = document.querySelector("#presionar");

// Toggle para mostrar/ocultar la memoria
bmore.addEventListener("click", () => {
    mMore.classList.toggle("memoryButton");
});

// Inicialización
window.onload = () => {
    input.value = "";
    stateObject.expression = "";
    stateObject.result = "";
};

// Manejo de botones
buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (stateObject.equalPressed) stateObject.equalPressed = 0;

        const value = event.target.dataset.number;

        switch (value) {
            case "AC": // Limpiar pantalla
                input.value = "";
                stateObject.expression = "";
                break;

            case "DEL": // Borrar último caracter
                input.value = input.value.slice(0, -1);
                stateObject.expression = input.value;
                break;

            case "+/-": // Cambiar signo del último número
                invertirUltimoNumero();
                stateObject.expression = input.value;
                break;

            case "%": // Convertir a porcentaje
                if (input.value !== "") {
                    input.value = (parseFloat(input.value) / 100).toString();
                    stateObject.expression = input.value;
                }
                break;

            case "1/": // Inverso
                calcularInverso();
                stateObject.expression = input.value;
                break;

            default: // Agregar el valor al input
                input.value += value;
                stateObject.expression = input.value;
        }
    });
});

// Funciones auxiliares



// Calcular expresión
function calcularResultado() {
    try {
        stateObject.equalPressed = 1;
        const inputValue = input.value;

        // Guardar en stateObject antes de procesar
        stateObject.expression = inputValue;

        // Validar con parser ANTES de reemplazos
        if (!parsear(inputValue)) return;

        // Reemplazos matemáticos
        let expresion = replaceFunction(inputValue);

        // Evaluar la expresión final 
        const result = evalExpresion(expresion);

        // Guardar resultado en stateObject
        stateObject.result = result;

        // Mostrar resultado en pantalla
        showOnInput(result);

        // Guardar en historial/memoria
        agregarId(stateObject.expression, stateObject.result);

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Evento: calcular al presionar "="
equal.addEventListener("click", calcularResultado);

function showOnInput(result) {
    input.value = (typeof result === "string")
        ? result
        : (Number.isInteger(result) ? result : result.toFixed(2));
}

function evalExpresion(expresion) {
    const result = Function('"use strict"; return(' + expresion + ')')();
    console.log("Expresión evaluada:", expresion);
    return result;
}
