// --- Añadir un registro al historial ---
function addToHistory(idi, expression, result) {
    let historyItem = document.createElement("div");
    historyItem.className = "history-item";

    // Asegurar consistencia en stateObject
    stateObject.result = `${result}`;
    stateObject.expression = `${expression}`;

    // Crear span con la ecuación y resultado
    let span = document.createElement("span");
    span.textContent = `${expression} = ${result}`;
    span.style.cursor = "pointer";
    span.dataset.userInput = expression;
    span.dataset.userResult = result;
    span.addEventListener("click", () => {
        input.value = span.dataset.userInput;
    });

    historyItem.appendChild(span);

    // Asignar id
    historyItem.dataset.idi = idi;

    // Botón para eliminar del historial
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "delete-history";
    deleteBtn.addEventListener("click", () => {
        removeFromLocalStorage(Number(historyItem.dataset.idi));
        historyItem.remove();
    });

    historyItem.appendChild(deleteBtn);

    // Añadir al contenedor del historial
    document.getElementById("historyContent").appendChild(historyItem);

    // Guardar en localStorage
    saveToLocalStorage(idi, expression, result);
}

// --- Guardar historial en localStorage ---
function saveToLocalStorage(idi, expression, result) {
    let history = JSON.parse(localStorage.getItem("historial")) || [];
    history.push({ idi, expression, result });
    localStorage.setItem("historial", JSON.stringify(history));
}

// --- Cargar historial desde localStorage ---
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("historial")) || [];
    history.forEach(item => {
        addHistoryFromStorage(item.idi, item.expression, item.result);
    });
}

// --- Añadir historial desde localStorage al DOM ---
function addHistoryFromStorage(idi, expression, result) {
    let historyItem = document.createElement("div");
    historyItem.className = "history-item";

    // Actualizar stateObject
    stateObject.result = `${result}`;
    stateObject.expression = `${expression}`;

    // Crear span con la ecuación y resultado
    let span = document.createElement("span");
    span.textContent = `${expression} = ${result}`;
    span.style.cursor = "pointer";
    span.dataset.userInput = expression;
    span.dataset.userResult = result;
    span.addEventListener("click", () => {
        input.value = span.dataset.userInput;
    });

    historyItem.appendChild(span);

    // Botón para eliminar del historial
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "delete-history";
    historyItem.dataset.idi = idi;
    deleteBtn.addEventListener("click", () => {
        removeFromLocalStorage(Number(historyItem.dataset.idi));
        historyItem.remove();
    });

    historyItem.appendChild(deleteBtn);

    // Añadir al contenedor del historial
    document.getElementById("historyContent").appendChild(historyItem);
}

// --- Eliminar un registro de localStorage ---
function removeFromLocalStorage(idi) {
    let history = JSON.parse(localStorage.getItem("historial")) || [];
    history = history.filter(item => item.idi !== idi);
    localStorage.setItem("historial", JSON.stringify(history));
}

// --- Añadir registro con id generado automáticamente ---
function agregarId(expression, result) {
    let idi = Date.now() + Math.random();
    addToHistory(idi, expression, result);
}

// --- Reconstruir historial al cargar la página ---
window.addEventListener("load", () => {
    loadHistory();
});
