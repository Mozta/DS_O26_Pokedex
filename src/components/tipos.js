// Cómo se ve cada tipo en pantalla. Es presentación: no es lógica ni datos.
// claro: true cuando el color de fondo necesita texto oscuro para leerse.
const TIPOS = {
  normal:   { nombre: 'Normal',    color: '#a8a77a', claro: true },
  fire:     { nombre: 'Fuego',     color: '#e8762b' },
  water:    { nombre: 'Agua',      color: '#4f7fe0' },
  electric: { nombre: 'Eléctrico', color: '#f2c81f', claro: true },
  grass:    { nombre: 'Planta',    color: '#5fa83a' },
  ice:      { nombre: 'Hielo',     color: '#8fd3cf', claro: true },
  fighting: { nombre: 'Lucha',     color: '#b82d27' },
  poison:   { nombre: 'Veneno',    color: '#94399a' },
  ground:   { nombre: 'Tierra',    color: '#d8b259', claro: true },
  flying:   { nombre: 'Volador',   color: '#8f7ae6' },
  psychic:  { nombre: 'Psíquico',  color: '#ec4f7e' },
  bug:      { nombre: 'Bicho',     color: '#97a61c' },
  rock:     { nombre: 'Roca',      color: '#ad9a3a' },
  ghost:    { nombre: 'Fantasma',  color: '#695288' },
  dragon:   { nombre: 'Dragón',    color: '#6232e0' },
  dark:     { nombre: 'Siniestro', color: '#5f4b3e' },
  steel:    { nombre: 'Acero',     color: '#a9aac2', claro: true },
  fairy:    { nombre: 'Hada',      color: '#d17fa8' },
}

const DESCONOCIDO = { nombre: '¿?', color: '#6e6a60' }

export function infoTipo(tipo) {
  return TIPOS[tipo] ?? { ...DESCONOCIDO, nombre: tipo }
}

// "No. 025": el número con ceros a la izquierda, como en un índice
export function numero(id) {
  return String(id).padStart(3, '0')
}
