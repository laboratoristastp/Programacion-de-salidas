// ============================================
// app.js - Lógica de Asignación TP Laboratorios
// Requiere: data.js cargado previamente
// ============================================

// ---------- ESTADO GLOBAL ----------
let proyectos = [];
let contadorProyectoId = 0;
let contadorEnsayoId = 0;
let resultadosAsignacion = [];
let sessionId = null;

let assignedLabsGlobally = new Set();
let assignedVehiclesGlobally = new Set();
let assignedMotoristasGlobally = new Set();

let santaAnaRoundRobinIndex = 0;

const OVERRIDE_GEOGRAFICO = {
  "San Miguel": ["Manolo Portillo"],
  "Santa Ana": ["Melvin Henrríquez", "Nelson Sánchez"],
  "Chalatenango": ["Ángel Pineda"]
};

// ---------- UTILIDADES ----------
function minutosDesdeHora(hora) {
  if (!hora) return 0;
  const partes = hora.split(":");
  return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}

function hasTimeConflict(horaA, horaB, ventanaMin = 120) {
  const a = minutosDesdeHora(horaA);
  const b = minutosDesdeHora(horaB);
  return Math.abs(a - b) < ventanaMin;
}

function generarSessionId() {
  return "SESSION_" + Date.now();
}

// ---------- BUSQUEDA DE LABORATORISTA ----------
function ensayosAutorizadosTodos(persona, ensayosRequeridos) {
  return ensayosRequeridos.every(e => persona.ensayosAutorizados.includes(e.tipo));
}

function ensayosNoAutorizados(persona, ensayosRequeridos) {
  return ensayosRequeridos
    .filter(e => !persona.ensayosAutorizados.includes(e.tipo))
    .map(e => e.tipo);
}

function estaOcupado(persona, proyecto, resultadosPrevios) {
  if (assignedLabsGlobally.has(persona.nombre)) {
    for (const r of resultadosPrevios) {
      if (r.laboratorista === persona.nombre && hasTimeConflict(r.hora, proyecto.hora)) {
        return true;
      }
    }
    return false;
  }
  return false;
}

function findBestLaboratorista(proyecto, ensayosRequeridos, resultadosPrevios) {
  const region = proyecto.region;
  if (region && OVERRIDE_GEOGRAFICO[region]) {
    const candidatos = OVERRIDE_GEOGRAFICO[region];
    let candidatosDisponibles = candidatos.filter(nombre => {
      const persona = PERSONAL_DB.find(p => p.nombre === nombre);
      if (!persona) return false;
      if (estaOcupado(persona, proyecto, resultadosPrevios)) return false;
      return true;
    });

    if (candidatosDisponibles.length > 0) {
      let nombreElegido;
      if (region === "Santa Ana" && candidatosDisponibles.length > 1) {
        nombreElegido = candidatosDisponibles[santaAnaRoundRobinIndex % candidatosDisponibles.length];
        santaAnaRoundRobinIndex++;
      } else {
        nombreElegido = candidatosDisponibles[0];
      }
      const persona = PERSONAL_DB.find(p => p.nombre === nombreElegido);
      const noAutorizados = ensayosNoAutorizados(persona, ensayosRequeridos);
      return { persona, autorizado: noAutorizados.length === 0, noAutorizados, fuenteAsignacion: "OVERRIDE_GEOGRAFICO" };
    }
  }

  const campoTier = proyecto.area === "Zona 1" ? "zona1"
    : proyecto.area === "Zona 2" ? "zona2"
    : "licitacion";

  // ---------- FIX APLICADO ----------
  // Antes: for (let tier = 5; tier >= 1; tier--)  -> INCORRECTO (evaluaba primero baja prioridad)
  // Ahora: for (let tier = 1; tier <= 5; tier++)  -> CORRECTO (1 = más prioritario, se evalúa primero)
  for (let tier = 1; tier <= 5; tier++) {
    const candidatosTier = PERSONAL_DB.filter(p =>
      p.esLaboratorista &&
      p.prioridad[campoTier] === tier &&
      !assignedLabsGlobally.has(p.nombre) &&
      !estaOcupado(p, proyecto, resultadosPrevios)
    );

    const conTodosLosEnsayos = candidatosTier.filter(p => ensayosAutorizadosTodos(p, ensayosRequeridos));
    if (conTodosLosEnsayos.length > 0) {
      return { persona: conTodosLosEnsayos[0], autorizado: true, noAutorizados: [], fuenteAsignacion: "CASCADA_TIER_" + tier };
    }

    if (candidatosTier.length > 0) {
      const persona = candidatosTier[0];
      const noAutorizados = ensayosNoAutorizados(persona, ensayosRequeridos);
      return { persona, autorizado: false, noAutorizados, fuenteAsignacion: "CASCADA_TIER_" + tier + "_SIN_AUTORIZACION_COMPLETA" };
    }
  }

  return { persona: null, autorizado: false, noAutorizados: ensayosRequeridos.map(e => e.tipo), fuenteAsignacion: "SIN_DISPONIBILIDAD" };
}

// ---------- BUSQUEDA DE MOTORISTA ----------
function findMotoristaAvailable(proyecto, resultadosPrevios) {
  const motoristasPuros = PERSONAL_DB.filter(p => !p.esLaboratorista && p.esMotorista);
  for (const motorista of motoristasPuros) {
    if (assignedMotoristasGlobally.has(motorista.nombre)) continue;
    return motorista;
  }
  return null;
}

// ---------- BUSQUEDA DE VEHICULO ----------
function findVehicle(persona, proyecto, resultadosPrevios) {
  if (persona.vehiculoPropio) {
    const vehiculoPersonal = VEHICULOS_DB.find(v => v.tipo === "PERSONAL" && v.asignadoA === persona.nombre);
    if (vehiculoPersonal) {
      return vehiculoPersonal;
    }
  }

  const vehiculosCompartidos = VEHICULOS_DB.filter(v => v.tipo === "COMPARTIDO");
  for (const vehiculo of vehiculosCompartidos) {
    if (assignedVehiclesGlobally.has(vehiculo.id)) continue;
    return vehiculo;
  }
  return null;
}

// ---------- SEDE DE ORIGEN ----------
function determinarSedeOrigen(persona) {
  if (!persona) return "ANTIGUO_CUSCATLAN";
  if (persona.ubicacionFija && persona.ubicacionFija !== "FLEXIBLE") {
    return persona.ubicacionFija;
  }
  return "ANTIGUO_CUSCATLAN";
}

// ---------- PROCESAMIENTO PRINCIPAL ----------
function procesarTodos() {
  assignedLabsGlobally.clear();
  assignedVehiclesGlobally.clear();
  assignedMotoristasGlobally.clear();
  santaAnaRoundRobinIndex = 0;

  resultadosAsignacion = [];
  sessionId = generarSessionId();

  for (const proyecto of proyectos) {
    const ensayosRequeridos = proyecto.ensayos;

    const { persona, autorizado, noAutorizados, fuenteAsignacion } = findBestLaboratorista(proyecto, ensayosRequeridos, resultadosAsignacion);

    let motorista = null;
    let vehiculo = null;
    let advertencias = [];

    if (!autorizado && noAutorizados.length > 0) {
      advertencias.push("NO AUTORIZADO PARA: " + noAutorizados.join(", "));
    }

    if (!persona) {
      advertencias.push("SIN LABORATORISTA DISPONIBLE");
    } else {
      assignedLabsGlobally.add(persona.nombre);

      vehiculo = findVehicle(persona, proyecto, resultadosAsignacion);
      if (vehiculo) {
        if (vehiculo.tipo === "COMPARTIDO") {
          assignedVehiclesGlobally.add(vehiculo.id);
        }
      } else {
        advertencias.push("SIN VEHÍCULO DISPONIBLE");
      }

      if (!persona.esMotorista) {
        motorista = findMotoristaAvailable(proyecto, resultadosAsignacion);
        if (motorista) {
          assignedMotoristasGlobally.add(motorista.nombre);
        } else {
          advertencias.push("SIN MOTORISTA DISPONIBLE");
        }
      }
    }

    const sedeOrigen = determinarSedeOrigen(persona);

    resultadosAsignacion.push({
      proyectoId: proyecto.id,
      nombreProyecto: proyecto.nombre,
      area: proyecto.area,
      region: proyecto.region,
      hora: proyecto.hora,
      laboratorista: persona ? persona.nombre : null,
      motorista: motorista ? motorista.nombre : null,
      vehiculo: vehiculo ? vehiculo.id : null,
      sedeOrigen: sedeOrigen,
      ubicacionDestino: proyecto.ubicacionDestino,
      ensayos: ensayosRequeridos,
      advertencias: advertencias,
      fuenteAsignacion: fuenteAsignacion
    });
  }

  renderPreviewTable();
  document.getElementById("previewSection").style.display = "block";
}

// ---------- RENDER FORMULARIO DE PROYECTOS ----------
function renderProyectosForm() {
  const container = document.getElementById("proyectosFormContainer");
  container.innerHTML = "";

  proyectos.forEach((proyecto, index) => {
    const div = document.createElement("div");
    div.className = "proyecto-card";
    div.innerHTML = `
      <div class="proyecto-header">
        <h3>Proyecto ${index + 1}</h3>
        <button type="button" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
      </div>
      <label>Nombre del Proyecto</label>
      <input type="text" value="${proyecto.nombre}" onchange="actualizarCampoProyecto(${proyecto.id}, 'nombre', this.value)">

      <label>Área</label>
      <select onchange="actualizarCampoProyecto(${proyecto.id}, 'area', this.value)">
        <option value="Zona 1" ${proyecto.area === "Zona 1" ? "selected" : ""}>Zona 1</option>
        <option value="Zona 2" ${proyecto.area === "Zona 2" ? "selected" : ""}>Zona 2</option>
        <option value="Licitación" ${proyecto.area === "Licitación" ? "selected" : ""}>Licitación</option>
      </select>

      <label>Región</label>
      <select onchange="actualizarCampoProyecto(${proyecto.id}, 'region', this.value)">
        <option value="">-- Seleccione --</option>
        ${REGIONES_EL_SALVADOR.map(r => `<option value="${r}" ${proyecto.region === r ? "selected" : ""}>${r}</option>`).join("")}
      </select>

      <label>Ubicación Destino</label>
      <input type="text" value="${proyecto.ubicacionDestino}" onchange="actualizarCampoProyecto(${proyecto.id}, 'ubicacionDestino', this.value)">

      <label>Hora</label>
      <input type="time" value="${proyecto.hora}" onchange="actualizarCampoProyecto(${proyecto.id}, 'hora', this.value)">

      <div class="ensayos-container">
        <h4>Ensayos</h4>
        ${proyecto.ensayos.map(ensayo => `
          <div class="ensayo-row">
            <select onchange="actualizarCampoEnsayo(${proyecto.id}, ${ensayo.id}, 'tipo', this.value)">
              ${ENSAYOS_TIPOS.map(t => `<option value="${t}" ${ensayo.tipo === t ? "selected" : ""}>${t}</option>`).join("")}
            </select>
            <input type="number" min="1" value="${ensayo.cantidad}" onchange="actualizarCampoEnsayo(${proyecto.id}, ${ensayo.id}, 'cantidad', this.value)">
            <button type="button" onclick="eliminarEnsayo(${proyecto.id}, ${ensayo.id})">X</button>
          </div>
        `).join("")}
        <button type="button" onclick="agregarEnsayo(${proyecto.id})">+ Agregar Ensayo</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// ---------- CRUD PROYECTOS Y ENSAYOS ----------
function agregarProyecto() {
  contadorProyectoId++;
  proyectos.push({
    id: contadorProyectoId,
    nombre: "",
    area: "Zona 1",
    region: "",
    ubicacionDestino: "",
    hora: "08:00",
    ensayos: []
  });
  renderProyectosForm();
}

function eliminarProyecto(id) {
  proyectos = proyectos.filter(p => p.id !== id);
  renderProyectosForm();
}

function agregarEnsayo(proyectoId) {
  const proyecto = proyectos.find(p => p.id === proyectoId);
  contadorEnsayoId++;
  proyecto.ensayos.push({ id: contadorEnsayoId, tipo: ENSAYOS_TIPOS[0], cantidad: 1 });
  renderProyectosForm();
}

function eliminarEnsayo(proyectoId, ensayoId) {
  const proyecto = proyectos.find(p => p.id === proyectoId);
  proyecto.ensayos = proyecto.ensayos.filter(e => e.id !== ensayoId);
  renderProyectosForm();
}

function actualizarCampoProyecto(proyectoId, campo, valor) {
  const proyecto = proyectos.find(p => p.id === proyectoId);
  proyecto[campo] = valor;
}

function actualizarCampoEnsayo(proyectoId, ensayoId, campo, valor) {
  const proyecto = proyectos.find(p => p.id === proyectoId);
  const ensayo = proyecto.ensayos.find(e => e.id === ensayoId);
  ensayo[campo] = campo === "cantidad" ? parseInt(valor, 10) : valor;
}

// ---------- RENDER TABLA DE PREVIEW ----------
function renderPreviewTable() {
  const container = document.getElementById("previewTableContainer");
  let html = `
    <table class="preview-table">
      <thead>
        <tr>
          <th>Proyecto</th>
          <th>Área</th>
          <th>Región</th>
          <th>Laboratorista</th>
          <th>Motorista</th>
          <th>Vehículo</th>
          <th>Sede Origen</th>
          <th>Destino</th>
          <th>Ensayos</th>
          <th>ADVERTENCIA</th>
        </tr>
      </thead>
      <tbody>
  `;

  resultadosAsignacion.forEach(r => {
    html += `
      <tr>
        <td>${r.nombreProyecto}</td>
        <td>${r.area}</td>
        <td>${r.region || "-"}</td>
        <td>${r.laboratorista || "SIN ASIGNAR"}</td>
        <td>${r.motorista || "-"}</td>
        <td>${r.vehiculo || "-"}</td>
        <td>${r.sedeOrigen}</td>
        <td>${r.ubicacionDestino}</td>
        <td>${r.ensayos.map(e => e.tipo + " (" + e.cantidad + ")").join(", ")}</td>
        <td class="${r.advertencias.length > 0 ? 'advertencia' : ''}">${r.advertencias.join(" | ") || "OK"}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// ---------- LOG: GUARDAR / CARGAR / LIMPIAR ----------
function downloadLog() {
  const log = {
    sessionId: sessionId,
    timestamp: new Date().toISOString(),
    proyectos: proyectos,
    resultadosAsignacion: resultadosAsignacion,
    assignedLabsGlobally: Array.from(assignedLabsGlobally),
    assignedVehiclesGlobally: Array.from(assignedVehiclesGlobally),
    assignedMotoristasGlobally: Array.from(assignedMotoristasGlobally),
    santaAnaRoundRobinIndex: santaAnaRoundRobinIndex,
    contadorProyectoId: contadorProyectoId,
    contadorEnsayoId: contadorEnsayoId
  };

  const blob = new Blob([JSON.stringify(log, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "log_" + (sessionId || generarSessionId()) + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function handleLogFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const log = JSON.parse(e.target.result);
      sessionId = log.sessionId;
      proyectos = log.proyectos || [];
      resultadosAsignacion = log.resultadosAsignacion || [];
      assignedLabsGlobally = new Set(log.assignedLabsGlobally || []);
      assignedVehiclesGlobally = new Set(log.assignedVehiclesGlobally || []);
      assignedMotoristasGlobally = new Set(log.assignedMotoristasGlobally || []);
      santaAnaRoundRobinIndex = log.santaAnaRoundRobinIndex || 0;
      contadorProyectoId = log.contadorProyectoId || 0;
      contadorEnsayoId = log.contadorEnsayoId || 0;

      renderProyectosForm();
      if (resultadosAsignacion.length > 0) {
        renderPreviewTable();
        document.getElementById("previewSection").style.display = "block";
      }
      alert("Log cargado correctamente.");
    } catch (err) {
      alert("Error al cargar el log: " + err.message);
    }
  };
  reader.readAsText(file);
}

function limpiarLog() {
  proyectos = [];
  resultadosAsignacion = [];
  assignedLabsGlobally.clear();
  assignedVehiclesGlobally.clear();
  assignedMotoristasGlobally.clear();
  santaAnaRoundRobinIndex = 0;
  contadorProyectoId = 0;
  contadorEnsayoId = 0;
  sessionId = null;

  renderProyectosForm();
  document.getElementById("previewSection").style.display = "none";
}

// ---------- EXPORTAR A EXCEL ----------
function exportarExcel() {
  const resumenData = resultadosAsignacion.map(r => ({
    "Proyecto": r.nombreProyecto,
    "Área": r.area,
    "Región": r.region || "-",
    "Laboratorista": r.laboratorista || "SIN ASIGNAR",
    "Motorista": r.motorista || "-",
    "Vehículo": r.vehiculo || "-",
    "Origen": r.sedeOrigen,
    "Destino": r.ubicacionDestino,
    "ADVERTENCIA": r.advertencias.join(" | ") || "OK"
  }));

  const detalleData = [];
  resultadosAsignacion.forEach(r => {
    r.ensayos.forEach(e => {
      detalleData.push({
        "Proyecto": r.nombreProyecto,
        "Tipo Ensayo": e.tipo,
        "Cantidad": e.cantidad
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const wsResumen = XLSX.utils.json_to_sheet(resumenData);
  const wsDetalle = XLSX.utils.json_to_sheet(detalleData);

  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen Asignación");
  XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle Ensayos");

  XLSX.writeFile(wb, "Asignacion_TP_Laboratorios_" + Date.now() + ".xlsx");
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener("DOMContentLoaded", function () {
  renderProyectosForm();
});