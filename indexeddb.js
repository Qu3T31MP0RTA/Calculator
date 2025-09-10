// --- Variables principales ---
let bd;                     // Base de datos
let idEnEdicion = null;     // ID del registro que se está editando
let memoryContainer;        // Contenedor donde se mostrarán los registros
let valorOriginalMemoria = 0;
let idUltimoResultado = null;

// --- Inicializar IndexedDB y eventos al cargar la página ---
function runbd() {
    memoryContainer = document.querySelector("#Memory");
    let btnGuardar = document.querySelector(".btnGuardar");

    btnGuardar.addEventListener("click", almacenarNumero);

    let solicitud = indexedDB.open("Resultado-y-operaciones");
    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", Crearalmacen);
}

// --- Crear almacen de datos si no existe ---
function Crearalmacen(evento) {
    let baseDatos = evento.target.result;
    let almacen = baseDatos.createObjectStore("numero", { keyPath: "id", autoIncrement: true });
    almacen.createIndex("ecuacion", "ecuacion", { unique: false });
    almacen.createIndex("resultado", "resultado", { unique: false });
}

// --- Guardar o actualizar un registro ---
function almacenarNumero() {
    if (!nm || nm.trim() === "") {
        alert("No puedes guardar una ecuación vacía.");
        return;
    }

    let transaction = bd.transaction(["numero"], "readwrite");
    let almacen = transaction.objectStore("numero");

    if (idEnEdicion !== null) {
        almacen.put({ id: idEnEdicion, ecuacion: nm, resultado: res });
        idEnEdicion = null;
    } else {
        almacen.add({ ecuacion: nm, resultado: res });
    }

    transaction.addEventListener("complete", Mostrar);

    document.querySelector("#input").value = "";
    nm = "";
    res = "";
}

// --- Mostrar todos los registros ---
function Mostrar() {
    memoryContainer.innerHTML = "";
    let transaccion = bd.transaction(["numero"]);
    let almacen = transaccion.objectStore("numero");
    let puntero = almacen.openCursor();
    puntero.addEventListener("success", MostrarNumero);
}

// --- Mostrar cada registro individual con botones ---
function MostrarNumero(evento) {
    let puntero = evento.target.result;

    if (puntero) {
        memoryContainer.innerHTML += `
            <div class="contenido" data-id="${puntero.value.id}">
                <div class="Flex-space">
                    <strong>Ecuación:</strong> <div class="ecuacionn">${puntero.value.ecuacion}</div>
                </div>
                <div class="Flex-space">
                    <strong>Resultado:</strong> <div class="resultadoo">${puntero.value.resultado}</div>
                </div>
                <div class="Flex">
                    <button class="borrar" onclick="eliminarNumero(${puntero.value.id})">Borrar</button>
                    <button class="Mmas" onclick="memoriaMas()">M+</button>
                    <button class="Mmenos" onclick="memoriaMenos()">M-</button>
                    <button class="editarr" onclick="editarEcuacion(${puntero.value.id})">Editar</button>
                </div>
            </div>
        `;
        puntero.continue();
    }
}

// --- Cargar registro en el input para editarlo ---
function editarEcuacion(id) {
    let transaccion = bd.transaction(["numero"], "readonly");
    let almacen = transaccion.objectStore("numero");
    let solicitud = almacen.get(id);

    solicitud.addEventListener("success", function () {
        let resultado = solicitud.result;
        if (resultado) {
            idEnEdicion = id;
            document.querySelector("#input").value = resultado.ecuacion;
            nm = resultado.ecuacion;
            res = resultado.resultado;
        }
    });
}

// --- Eliminar un registro ---
function eliminarNumero(key) {
    let transaccion = bd.transaction(["numero"], "readwrite");
    let almacen = transaccion.objectStore("numero");
    almacen.delete(key);
    transaccion.addEventListener("complete", Mostrar);
}

// --- Eliminar todos los registros ---
function eliminarTodo() {
    let transaccion = bd.transaction(["numero"], "readwrite");
    let almacen = transaccion.objectStore("numero");
    almacen.clear();
    transaccion.addEventListener("complete", Mostrar);
}

// --- Manejo de errores ---
function MostrarError(evento) {
    console.error("Error", evento);
}

// --- Conexión exitosa a la base de datos ---
function Comenzar(evento) {
    bd = evento.target.result;
    Mostrar();
    actualizarValorOriginal();

    // --- Función interna para actualizar la memoria individual ---
    function actualizarMemoria(id, operacion) {
        if (!bd) return;
        const transaction = bd.transaction(["numero"], "readwrite");
        const almacen = transaction.objectStore("numero");
        const solicitud = almacen.get(id);

        solicitud.onsuccess = (event) => {
            const registro = event.target.result;
            if (!registro) return;

            if (registro.resultadoOriginal === undefined) {
                registro.resultadoOriginal = Math.abs(Number(registro.resultado));
            }

            let valorActual = Number(registro.resultado);

            if (operacion === "sumar") {
                valorActual += Number(document.querySelector("input").value);
            } else if (operacion === "restar") {
                valorActual -= Number(document.querySelector("input").value);
            }

            registro.resultado = valorActual;

            const requestUpdate = almacen.put(registro);
            requestUpdate.onsuccess = () => {
                const divContenedor = memoryContainer.querySelector(`.contenido[data-id='${id}'] .resultadoo`);
                if (divContenedor) divContenedor.textContent = registro.resultado;
            };
        };
    }

    // --- Escucha de botones M+ y M- individuales ---
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("Mmas")) {
            const id = Number(e.target.closest(".contenido").dataset.id);
            actualizarMemoria(id, "sumar");
        }
        if (e.target.classList.contains("Mmenos")) {
            const id = Number(e.target.closest(".contenido").dataset.id);
            actualizarMemoria(id, "restar");
        }
    });
}

// --- Guardar el valor original de la memoria ---
function actualizarValorOriginal() {
    let transaccion = bd.transaction(["numero"], "readonly");
    let store = transaccion.objectStore("numero");
    let request = store.openCursor(null, 'prev');

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            valorOriginalMemoria = parseFloat(cursor.value.resultado);
            idUltimoResultado = cursor.value.id;
        } else {
            valorOriginalMemoria = 0;
            idUltimoResultado = null;
        }
    };

    request.onerror = function (event) {
        console.error("Error al obtener el último resultado", event);
        valorOriginalMemoria = 0;
        idUltimoResultado = null;
    };
}

// --- Funciones de memoria global ---
function memoriaMasGlobal() {
    if (idUltimoResultado === null) return;
    let transaction = bd.transaction(["numero"], "readwrite");
    let store = transaction.objectStore("numero");

    let getRequest = store.get(idUltimoResultado);
    getRequest.onsuccess = function () {
        let registro = getRequest.result;
        let nuevoValor = parseFloat(registro.resultado) + Number(document.querySelector("input").value);
        store.put({ id: idUltimoResultado, ecuacion: registro.ecuacion, resultado: nuevoValor });
        transaction.oncomplete = () => Mostrar();
    };
}

function memoriaMenosGlobal() {
    if (idUltimoResultado === null) return;
    let transaction = bd.transaction(["numero"], "readwrite");
    let store = transaction.objectStore("numero");

    let getRequest = store.get(idUltimoResultado);
    getRequest.onsuccess = function () {
        let registro = getRequest.result;
        let nuevoValor = parseFloat(registro.resultado) - Number(document.querySelector("input").value);
        store.put({ id: idUltimoResultado, ecuacion: registro.ecuacion, resultado: nuevoValor });
        transaction.oncomplete = () => Mostrar();
    };
}

// --- Escucha de botones globales M+ y M- ---
document.querySelector("#globalMPlus").addEventListener("click", memoriaMasGlobal);
document.querySelector("#globalMMinus").addEventListener("click", memoriaMenosGlobal);

// --- Botón para recuperar memoria ---
document.querySelector("#btnRecuperarMemoria").addEventListener("click", restoreMemory);

// --- Recuperar memoria ---
function restoreMemory() {
    let transaccion = bd.transaction(["numero"]);
    let almacen = transaccion.objectStore("numero");
    let request = almacen.openCursor(null, "prev");

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let ultima = cursor.value;
            document.querySelector("input").value = ultima.resultado;
            console.log("Memoria recuperada:", ultima.resultado, "de ecuación:", ultima.ecuacion);
        } else {
            console.log("No hay memoria en IndexedDB");
        }
    };

    request.onerror = function (event) {
        console.error("Error al recuperar memoria:", event);
    };
}

// --- Inicializar todo al cargar la página ---
window.addEventListener("load", actualizarValorOriginal);
window.addEventListener("load", runbd);
