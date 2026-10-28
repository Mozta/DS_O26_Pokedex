// Funciones puras: no importan React ni Firebase, y ninguna modifica
// el equipo que recibe; siempre regresan uno nuevo.
// Es el mismo contrato que logic/orden.js en la Fonda.

export const MAX_EQUIPO = 6

export const MENSAJES = {
  SIN_NOMBRE: 'Ponle nombre a tu equipo',
  VACIO: 'Agrega al menos un Pokémon',
  DEMASIADOS: `Un equipo tiene máximo ${MAX_EQUIPO} Pokémon`,
}

export function crearEquipo() {
  return { nombre: '', pokemones: [] }
}

export function estaEnEquipo(equipo, id) {
  return equipo.pokemones.some((p) => p.id === id)
}

export function estaLleno(equipo) {
  return equipo.pokemones.length >= MAX_EQUIPO
}

export function agregarPokemon(equipo, pokemon) {
  if (estaLleno(equipo) || estaEnEquipo(equipo, pokemon.id)) return equipo
  const { id, nombre, img, tipos } = pokemon
  return { ...equipo, pokemones: [...equipo.pokemones, { id, nombre, img, tipos }] }
}

export function quitarPokemon(equipo, id) {
  return { ...equipo, pokemones: equipo.pokemones.filter((p) => p.id !== id) }
}

export function ponerNombre(equipo, nombre) {
  return { ...equipo, nombre }
}

export function validarEquipo(equipo) {
  const errores = []
  if (equipo.nombre.trim() === '') errores.push('SIN_NOMBRE')
  if (equipo.pokemones.length === 0) errores.push('VACIO')
  if (equipo.pokemones.length > MAX_EQUIPO) errores.push('DEMASIADOS')
  return { valido: errores.length === 0, errores }
}