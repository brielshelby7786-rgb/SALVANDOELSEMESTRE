// ==========================================
// 1. CREACIÓN DE LA TABLA (Alineada en el layout flex .wrapper)
// ==========================================
const tableContainer = document.createElement("div");
tableContainer.className = "table-container";
tableContainer.style.width = "500px"; // Ancho fijo para equilibrar la tabla al lado del formulario

tableContainer.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>Gestión</th>
                <th>Cód. Entidad</th>
                <th>Sigla</th>
                <th>Institución / Descripción</th>
            </tr>
        </thead>
        <tbody id="tabla-registros-body">
            <tr id="fila-vacia">
                <td colspan="4" style="text-align: center; color: #808080; font-style: italic; background-color: #fff; padding: 15px;">
                    Ninguna entidad agregada aún.
                </td>
            </tr>
        </tbody>
    </table>
`;

// Inyectamos la tabla en el wrapper principal al lado del formulario .container
const wrapper = document.querySelector(".wrapper");
if (wrapper) {
    wrapper.appendChild(tableContainer);
}

// Función interna para añadir filas dinámicamente con estilos nativos de tu CSS
function agregarFilaATabla(gestion, entidad, sigla, descripcion) {
    const tbody = document.getElementById("tabla-registros-body");
    const filaVacia = document.getElementById("fila-vacia");
    if (filaVacia) filaVacia.remove();

    const nuevaFila = document.createElement("tr");
    
    // Mantenemos tu lógica original para seleccionar filas al hacerles clic
    nuevaFila.addEventListener("click", () => {
        const filas = tbody.querySelectorAll("tr");
        filas.forEach(r => r.classList.remove("selected"));
        nuevaFila.classList.add("selected");
    });

    nuevaFila.innerHTML = `
        <td>${gestion}</td>
        <td>${String(entidad).padStart(4, '0')}</td>
        <td style="font-weight: bold;">${sigla}</td>
        <td>${descripcion}</td>
    `;
    
    // Inserta los nuevos registros en la parte superior de la tabla
    tbody.insertBefore(nuevaFila, tbody.firstChild);
}

// ==========================================
// 2. ANIMACIÓN ORIGINAL DE TU CUSTOM SELECT
// ==========================================
const select = document.querySelector(".custom-select");
const selected = document.querySelector(".selected-text");
const options = document.querySelectorAll(".option");

document.querySelector(".selected-select").addEventListener("click", () => {
    select.classList.toggle("open");
});

options.forEach(option => {
    option.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("selected"));
        option.classList.add("selected");
        selected.textContent = option.textContent;
        select.classList.remove("open");
    });
});

document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
        select.classList.remove("open");
    }
});

// Helper para extraer los números al inicio del texto seleccionado (ej: "0006 Vicepresidencia..." -> 6)
function obtenerCodigoEntidad() {
    const textoSeleccionado = selected.textContent.trim();
    const matches = textoSeleccionado.match(/^\d+/);
    return matches ? parseInt(matches[0], 10) : 0;
}

// ==========================================
// 3. CAPTURA DE DATOS Y PETICIÓN POST A RENDER
// ==========================================
// Capturamos los campos estrictamente por su orden de aparición en tu HTML original
const inputsDeTexto = document.querySelectorAll(".form-box input[type='text']");
const inputSigla = inputsDeTexto[0];       
const inputDescripcion = inputsDeTexto[1]; 

const botonesFormulario = document.querySelectorAll(".buttons .btn");
const btnOK = botonesFormulario[0];        

if (btnOK) {
    btnOK.addEventListener("click", async (e) => {
        e.preventDefault(); // Previene comportamientos extraños o recargas del botón

        const API_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com/api/entidad";
        const codigoEntidad = obtenerCodigoEntidad();
        const valorSigla = inputSigla ? inputSigla.value.trim() : "";
        const valorDescripcion = inputDescripcion ? inputDescripcion.value.trim() : "";
        const gestionActual = new Date().getFullYear(); // Captura el año actual dinámicamente

        // Validación veloz en el lado del cliente
        if (!valorSigla || !valorDescripcion) {
            alert("Por favor, rellene los campos de 'Sigla' e 'Institución'.");
            return;
        }

        // Estructura idéntica al esquema JSON de tu Swagger POST /api/entidad
        const payload = {
            gestion: gestionActual,
            entidad: codigoEntidad,
            descripcion: valorDescripcion,
            sigla: valorSigla
        };

        try {
            // Deshabilitamos el botón temporalmente para evitar múltiples clics
            btnOK.disabled = true;
            btnOK.textContent = "...";

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("¡Entidad registrada con éxito!");
                
                // Pintamos la nueva fila directamente en la tabla dinámica al lado
                agregarFilaATabla(gestionActual, codigoEntidad, valorSigla, valorDescripcion);

                // Limpiamos los inputs del formulario
                if (inputSigla) inputSigla.value = "";
                if (inputDescripcion) inputDescripcion.value = "";
            } else {
                const mensajeError = await response.text();
                alert(`Error en el servidor (${response.status}): ${mensajeError}`);
            }

        } catch (error) {
            console.error("Error capturado en la petición:", error);
            alert("Error de red. No se pudo establecer comunicación con el servidor de Swagger.");
        } finally {
            // Devolvemos el botón a su estado normal
            btnOK.disabled = false;
            btnOK.textContent = "OK";
        }
    });
}