// ==========================================
// 1. CONFIGURACIÓN DE LA API Y SELECTORES
// ==========================================
const API_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com/unidadadmin";

const tbody = document.querySelector("tbody");
const botones = document.querySelectorAll(".btn");

const btnNuevo       = botones[0]; 
const btnEditar      = botones[1];
const btnEliminar    = botones[2];
const btnSeleccionar = botones[3]; 
const btnSalir       = botones[4];

let modoModal = "NUEVO"; 
let filaSeleccionadaParaEditar = null;

// Manejo de la selección azul de las filas de la tabla
const inicializarEventosFilas = () => {
    const filas = tbody.querySelectorAll("tr");
    filas.forEach(row => {
        if (row.cells[0] && row.cells[0].innerHTML !== "&nbsp;" && row.cells[0].innerText.trim() !== "") {
            row.style.cursor = "pointer";
            row.onclick = () => {
                filas.forEach(r => r.classList.remove("selected"));
                row.classList.add("selected");
            };
        }
    });
};
inicializarEventosFilas();

// ==========================================
// 2. CREACIÓN DEL FORMULARIO EMERGENTE (MODAL)
// ==========================================
const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100vw";
modal.style.height = "100vh";
modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "10000";

modal.innerHTML = `
    <div class="container" style="width: 450px; box-shadow: 4px 4px 15px rgba(0,0,0,0.5);">
        <div class="header-top" id="modal-titulo-top">Nuevo Registro</div>
        <div class="header-main" id="modal-titulo-main">AGREGAR UNIDAD ADMINISTRATIVA</div>
        
        <div class="form-box" style="margin: 15px; padding: 12px;">
            <div class="form-row">
                <label>Entidad:</label>
                <input type="number" id="mod-entidad" value="6" placeholder="Ej: 6">
            </div>
            <div class="form-row">
                <label>Unidad:</label>
                <input type="number" id="mod-unidad" placeholder="Ej: 25">
            </div>
            <div class="form-row">
                <label>Descripción:</label>
                <input type="text" id="mod-descrip" placeholder="Ej: GACETA OFICIAL DE BOLIVIA">
            </div>
            <div class="form-row">
                <label>Ciudad:</label>
                <input type="text" id="mod-ciudad" placeholder="Ej: LA PAZ">
            </div>
        </div>

        <div class="buttons" style="padding-bottom: 15px;">
            <button class="btn" id="btn-modal-ok">OK</button>
            <button class="btn" id="btn-modal-cancelar">Cancelar</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

const btnModalOk = document.getElementById("btn-modal-ok");
const btnModalCancelar = document.getElementById("btn-modal-cancelar");

// Botón Nuevo
btnNuevo.addEventListener("click", () => {
    modoModal = "NUEVO";
    document.getElementById("modal-titulo-top").textContent = "Nuevo Registro";
    document.getElementById("modal-titulo-main").textContent = "AGREGAR UNIDAD ADMINISTRATIVA";
    document.getElementById("mod-unidad").disabled = false;
    
    document.getElementById("mod-unidad").value = "";
    document.getElementById("mod-descrip").value = "";
    document.getElementById("mod-ciudad").value = "";
    
    modal.style.display = "flex";
});

// Botón Editar
btnEditar.addEventListener("click", () => {
    const fila = tbody.querySelector(".selected");
    if (!fila || fila.cells[0].innerHTML === "&nbsp;") {
        alert("Por favor, seleccione una fila válida de la tabla para editar.");
        return;
    }
    
    modoModal = "EDITAR";
    filaSeleccionadaParaEditar = fila;
    
    document.getElementById("modal-titulo-top").textContent = "Modificar Registro";
    document.getElementById("modal-titulo-main").textContent = "EDITAR UNIDAD ADMINISTRATIVA";
    
    document.getElementById("mod-entidad").value = 6; 
    document.getElementById("mod-unidad").value = parseInt(fila.cells[0].innerText, 10);
    document.getElementById("mod-unidad").disabled = true; 
    document.getElementById("mod-descrip").value = fila.cells[1].innerText;
    document.getElementById("mod-ciudad").value = fila.cells[2].innerText;
    
    modal.style.display = "flex";
});

// Botón Eliminar (Con diagnóstico para Error 500)
btnEliminar.addEventListener("click", async () => {
    const fila = tbody.querySelector(".selected");
    if (!fila || fila.cells[0].innerHTML === "&nbsp;") {
        alert("Por favor, seleccione una fila válida de la tabla para eliminar.");
        return;
    }

    const idUnidad = parseInt(fila.cells[0].innerText, 10);
    const nombreUnidad = fila.cells[1].innerText;

    if (!confirm(`¿Está seguro de que desea eliminar la unidad "${nombreUnidad}"?`)) {
        return;
    }

    try {
        btnEliminar.disabled = true;
        btnEliminar.textContent = "...";

        // Petición DELETE enviando el ID de la unidad seleccionada
        const response = await fetch(`${API_URL}/${idUnidad}`, {
            method: "DELETE",
            headers: { "Accept": "*/*" }
        });

        if (response.ok) {
            alert("Registro eliminado exitosamente.");
            fila.remove(); 

            // Reponer la fila de relleno visual en la tabla
            const nuevaFilaVacia = document.createElement("tr");
            nuevaFilaVacia.innerHTML = "<td>&nbsp;</td><td></td><td></td>";
            tbody.appendChild(nuevaFilaVacia);

            inicializarEventosFilas();
        } else {
            // Capturamos el detalle exacto enviado por tu backend en el error 500
            const errorDetalle = await response.text();
            alert(`Error del Servidor (${response.status}):\n${errorDetalle || "No se especificó la causa (Posible restricción de clave foránea porque la unidad contiene activos fijos asignados)."}`);
        }
    } catch (error) {
        console.error("Error en la petición DELETE:", error);
        alert("Error de red al intentar conectar con el servidor para borrar el registro.");
    } finally {
        btnEliminar.disabled = false;
        btnEliminar.textContent = "Eliminar";
    }
});

// Botón Seleccionar
btnSeleccionar.addEventListener("click", () => {
    const fila = tbody.querySelector(".selected");
    if (!fila || fila.cells[0].innerHTML === "&nbsp;") {
        alert("Ninguna fila válida está seleccionada actualmente.");
    } else {
        alert(`Fila Seleccionada:\nCódigo: ${fila.cells[0].innerText}\nDescripción: ${fila.cells[1].innerText}\nCiudad: ${fila.cells[2].innerText}`);
    }
});

// Botón Salir
btnSalir.addEventListener("click", () => {
    if (confirm("¿Desea cerrar la aplicación?")) {
        window.close();
    }
});

// Cancelar Modal
btnModalCancelar.addEventListener("click", () => {
    modal.style.display = "none";
});

// ==========================================
// 3. ACCIÓN DEL BOTÓN OK (ENVIAR DATOS)
// ==========================================
btnModalOk.addEventListener("click", async () => {
    const entidad = parseInt(document.getElementById("mod-entidad").value, 10);
    const unidad = parseInt(document.getElementById("mod-unidad").value, 10);
    const descrip = document.getElementById("mod-descrip").value.trim();
    const ciudad = document.getElementById("mod-ciudad").value.trim().toUpperCase();

    if (isNaN(entidad) || isNaN(unidad) || !descrip || !ciudad) {
        alert("Por favor, rellene todos los campos correctamente.");
        return;
    }

    const payload = {
        entidad: entidad,
        unidad: unidad,
        descrip: descrip,
        ciudad: ciudad
    };

    try {
        btnModalOk.disabled = true;
        btnModalOk.textContent = "...";

        const response = await fetch(API_URL, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const unidadFormateada = String(unidad).padStart(3, '0');

            if (modoModal === "NUEVO") {
                alert("¡Unidad Administrativa registrada!");

                const nuevaFila = document.createElement("tr");
                nuevaFila.innerHTML = `
                    <td>${unidadFormateada}</td>
                    <td>${descrip.toUpperCase()}</td>
                    <td>${ciudad}</td>
                `;

                const filasDeRelleno = Array.from(tbody.querySelectorAll("tr")).filter(tr => {
                    return tr.cells[0] && (tr.cells[0].innerHTML === "&nbsp;" || tr.cells[0].innerText.trim() === "");
                });
                if (filasDeRelleno.length > 0) {
                    filasDeRelleno[0].remove();
                }

                tbody.insertBefore(nuevaFila, tbody.firstChild);
            } else if (modoModal === "EDITAR" && filaSeleccionadaParaEditar) {
                alert("¡Registro actualizado exitosamente!");
                
                filaSeleccionadaParaEditar.cells[0].innerText = unidadFormateada;
                filaSeleccionadaParaEditar.cells[1].innerText = descrip.toUpperCase();
                filaSeleccionadaParaEditar.cells[2].innerText = ciudad;
            }

            inicializarEventosFilas();
            modal.style.display = "none";
            
        } else {
            const errorTxt = await response.text();
            alert(`Error del servidor (${response.status}): ${errorTxt}`);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el backend.");
    } finally {
        btnModalOk.disabled = false;
        btnModalOk.textContent = "OK";
    }
});