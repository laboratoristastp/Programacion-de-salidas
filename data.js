// ============================================
// data.js - Base de Datos TP Laboratorios
// Debe cargarse ANTES de app.js
// ============================================

// ---------- TIPOS DE ENSAYO (11) ----------
const ENSAYOS_TIPOS = [
  "NUCLEO",
  "DENSIDAD_CONO_ARENA",
  "BRIQUETAS",
  "CONTROL_COLADO_CONCRETO",
  "CONTROL_COLADO_LODO",
  "CONTROL_MAC",
  "SPEEDY_TESTER",
  "CUBOS_MORTERO",
  "DENSIMETRO_NUCLEAR",
  "CALCULO_DENSIDAD_CAMPO",
  "RECOLECCION"
];

const ENSAYOS_COMPLETOS = [...ENSAYOS_TIPOS];
const ENSAYOS_RESTRINGIDOS_COLADO = ["CONTROL_COLADO_CONCRETO", "CONTROL_COLADO_LODO"];

// ---------- 14 REGIONES / DEPARTAMENTOS DE EL SALVADOR ----------
const REGIONES_EL_SALVADOR = [
  "Ahuachapán",
  "Santa Ana",
  "Sonsonate",
  "Chalatenango",
  "La Libertad",
  "San Salvador",
  "Cuscatlán",
  "La Paz",
  "Cabañas",
  "San Vicente",
  "Usulután",
  "San Miguel",
  "Morazán",
  "La Unión"
];

// ---------- SEDES FIJAS (reservado para futura integración con Google Maps, NO usado en la lógica actual) ----------
const SEDES_FIJAS = {
  ANTIGUO_CUSCATLAN: { nombre: "Antiguo Cuscatlán", lat: 13.6859, lng: -89.2542 },
  SAN_MIGUEL: { nombre: "San Miguel", lat: 13.4834, lng: -88.1733 },
  SANTA_ANA: { nombre: "Santa Ana", lat: 13.9929, lng: -89.5631 },
  CHALATENANGO: { nombre: "Chalatenango", lat: 14.0333, lng: -89.0667 }
};

// ---------- BASE DE DATOS DE PERSONAL (26) ----------
// esLaboratorista: puede ser asignado como laboratorista principal
// esMotorista: sabe conducir (si false, requiere motorista externo)
// vehiculoPropio: tiene vehículo personal asignado (ver VEHICULOS_DB)
// ubicacionFija: sede de origen obligatoria ("ANTIGUO_CUSCATLAN" es la sede default/central)
// ensayosAutorizados: tipos de ensayo que puede realizar
// prioridad: nivel de prioridad (1-5) por tipo de área

const PERSONAL_DB = [
  {
    id: "ZACARIAS_GUZMAN",
    nombre: "Zacarías Guzmán",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 5, zona2: 4, licitacion: 3 }
  },
  {
    id: "KEVIN_PORTILLO",
    nombre: "Kevin Portillo",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 1 }
  },
  {
    id: "GERSON_GUZMAN",
    nombre: "Gerson Guzmán",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 2 }
  },
  {
    id: "JONATHAN_MENJIVAR",
    nombre: "Jonathan Menjívar",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 1 }
  },
  {
    id: "ARMANDO_VASQUEZ",
    nombre: "Armando Vásquez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "WILLIAM_GAMERO",
    nombre: "William Gamero",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 1 }
  },
  {
    id: "ERICK_RAMIREZ",
    nombre: "Erick Ramírez",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "ENOC_MONTES",
    nombre: "Enoc Montes",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 1 }
  },
  {
    id: "ESTIVEN_DUBON",
    nombre: "Estiven Dubón",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "ALEJANDRO_PEREZ",
    nombre: "Alejandro Pérez",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "FREDY_BENITEZ",
    nombre: "Fredy Benítez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_RESTRINGIDOS_COLADO],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "RICARDO_RODRIGUEZ",
    nombre: "Ricardo Rodríguez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "CARLOS_GUZMAN",
    nombre: "Carlos Guzmán",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "ARTURO_MARTINEZ",
    nombre: "Arturo Martínez",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "FRANCISCO_MEJIA",
    nombre: "Francisco Mejía",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 4, zona2: 3, licitacion: 1 }
  },
  {
    id: "JONATHAN_GARCIA",
    nombre: "Jonathan García",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_RESTRINGIDOS_COLADO],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "JONATHAN_VASQUEZ",
    nombre: "Jonathan Vásquez",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_RESTRINGIDOS_COLADO],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "STEVEN_BAUTISTA",
    nombre: "Steven Bautista",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_RESTRINGIDOS_COLADO],
    prioridad: { zona1: 3, zona2: 4, licitacion: 5 }
  },
  {
    id: "MANOLO_PORTILLO",
    nombre: "Manolo Portillo",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: true,
    ubicacionFija: "SAN_MIGUEL",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 3, zona2: 2, licitacion: 1 }
  },
  {
    id: "MELVIN_HENRRIQUEZ",
    nombre: "Melvin Henrríquez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: true,
    ubicacionFija: "SANTA_ANA",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 3, licitacion: 2 }
  },
  {
    id: "NELSON_SANCHEZ",
    nombre: "Nelson Sánchez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: true,
    ubicacionFija: "SANTA_ANA",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 1, zona2: 2, licitacion: 3 }
  },
  {
    id: "LUIS_CORTEZ",
    nombre: "Luis Cortez",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: true,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 2, zona2: 1, licitacion: 3 }
  },
  {
    id: "ANGEL_PINEDA",
    nombre: "Ángel Pineda",
    esLaboratorista: true,
    esMotorista: true,
    vehiculoPropio: true,
    ubicacionFija: "CHALATENANGO",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 2, zona2: 1, licitacion: 3 }
  },
  {
    id: "NELSON_MENA",
    nombre: "Nelson Mena",
    esLaboratorista: false,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [],
    prioridad: { zona1: 3, zona2: 2, licitacion: 1 }
  },
  {
    id: "GERARDO_MARTINEZ",
    nombre: "Gerardo Martínez",
    esLaboratorista: false,
    esMotorista: true,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [],
    prioridad: { zona1: 3, zona2: 2, licitacion: 3 }
  },
  {
    id: "STEVEN_VIDES",
    nombre: "Steven Vides",
    esLaboratorista: true,
    esMotorista: false,
    vehiculoPropio: false,
    ubicacionFija: "ANTIGUO_CUSCATLAN",
    ensayosAutorizados: [...ENSAYOS_COMPLETOS],
    prioridad: { zona1: 3, zona2: 2, licitacion: 1 }
  }
];

// ---------- BASE DE DATOS DE VEHÍCULOS ----------
// tipo "PERSONAL": vehículo propio de una sola persona, no bloquea a otras
// tipo "COMPARTIDO": vehículo de flota, sujeto a disponibilidad global
// restringidoA (solo en algunos COMPARTIDO): array de nombres autorizados a usar ese vehículo específico

const VEHICULOS_DB = [
  { id: "VEHICULO_ANGEL_PINEDA", tipo: "PERSONAL", asignadoA: "Ángel Pineda" },
  { id: "VEHICULO_MANOLO_PORTILLO", tipo: "PERSONAL", asignadoA: "Manolo Portillo" },
  { id: "VEHICULO_LUIS_CORTEZ", tipo: "PERSONAL", asignadoA: "Luis Cortez" },
  { id: "VEHICULO_MELVIN_HENRRIQUEZ", tipo: "PERSONAL", asignadoA: "Melvin Henrríquez" },
  { id: "VEHICULO_NELSON_SANCHEZ", tipo: "PERSONAL", asignadoA: "Nelson Sánchez" },
  { id: "TOYOTA_1", tipo: "COMPARTIDO" },
  { id: "TOYOTA_2", tipo: "COMPARTIDO" },
  { id: "TOYOTA_3", tipo: "COMPARTIDO" },
  { id: "TOYOTA_4", tipo: "COMPARTIDO" },
  { id: "JMC_1", tipo: "COMPARTIDO" },
  { id: "JMC_2", tipo: "COMPARTIDO" },
  { id: "MITSUBISHI_L200", tipo: "COMPARTIDO", restringidoA: ["Kevin Portillo", "Carlos Guzmán", "Gerson Guzmán", "Ricardo Rodríguez"] },
  { id: "HYUNDAI_1", tipo: "COMPARTIDO", restringidoA: ["Nelson Mena"] }
];