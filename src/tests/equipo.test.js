// tests/equipo.test.js
// Se corre con:  npm test
// No necesita navegador, ni internet, ni Firebase: solo la lógica.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_EQUIPO, crearEquipo, agregarPokemon, quitarPokemon,
  ponerNombre, estaLleno, validarEquipo,
} from '../logic/equipo.js'

const poke = (id) => ({ id, nombre: `poke${id}`, img: `${id}.png`, tipos: ['normal'] })

function equipoCon(n) {
  let e = crearEquipo()
  for (let id = 1; id <= n; id++) e = agregarPokemon(e, poke(id))
  return e
}

test('agrega un Pokémon a un equipo vacío', () => {
  const e = agregarPokemon(crearEquipo(), poke(25))
  assert.equal(e.pokemones.length, 1)
  assert.equal(e.pokemones[0].nombre, 'poke25')
})

test('con 6, el séptimo no entra', () => {
  const seis = equipoCon(MAX_EQUIPO)
  const siete = agregarPokemon(seis, poke(150))
  assert.equal(siete.pokemones.length, MAX_EQUIPO)
  assert.ok(estaLleno(siete))
})

test('no se repite el mismo Pokémon', () => {
  const e = agregarPokemon(agregarPokemon(crearEquipo(), poke(25)), poke(25))
  assert.equal(e.pokemones.length, 1)
})

test('no modifica el equipo que recibe', () => {
  const original = Object.freeze({ nombre: '', pokemones: Object.freeze([]) })
  const nuevo = agregarPokemon(original, poke(1))
  assert.equal(original.pokemones.length, 0)
  assert.notEqual(nuevo, original)
})

test('quitar saca solo ese Pokémon', () => {
  const e = quitarPokemon(equipoCon(3), 2)
  assert.deepEqual(e.pokemones.map((p) => p.id), [1, 3])
})

test('validar: sin nombre y vacío', () => {
  const { valido, errores } = validarEquipo(crearEquipo())
  assert.equal(valido, false)
  assert.deepEqual(errores, ['SIN_NOMBRE', 'VACIO'])
})

test('validar: un equipo con nombre y 6 Pokémon es válido', () => {
  const e = ponerNombre(equipoCon(6), 'Los de Kanto')
  assert.deepEqual(validarEquipo(e), { valido: true, errores: [] })
})

test('validar: si alguien arma 7 por fuera, se detecta', () => {
  const trampa = { nombre: 'trampa', pokemones: [1, 2, 3, 4, 5, 6, 7].map(poke) }
  assert.ok(validarEquipo(trampa).errores.includes('DEMASIADOS'))
})