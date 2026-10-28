import { useState, useEffect } from 'react'
import { PokemonCard } from './components/PokemonCard'
import { normalizar } from './pokemon'
import {
  MAX_EQUIPO, MENSAJES, crearEquipo, agregarPokemon, quitarPokemon, ponerNombre, validarEquipo,
} from './logic/equipo'
import { guardarEquipo, cargarEquipos, borrarEquipo } from './data/equipos'
import { buscarPokemon } from './data/pokemones'
import './App.css'

const API = "https://pokeapi.co/api/v2"
const LIMITE = 25 // pokemones por página

function App() {
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [equipo, setEquipo] = useState(crearEquipo())  // el equipo que estás armando
  const [guardados, setGuardados] = useState([])        // los equipos que ya están en Firestore
  const [guardando, setGuardando] = useState(false)
  const [errorEquipo, setErrorEquipo] = useState(null)
  
  const [offset, setOffset] = useState(0)   // desde qué pokemon empieza la página
  const [total, setTotal] = useState(0)     // cuántos pokemones hay en la API

  const [texto, setTexto] = useState('')        // lo que se escribe
  const [consulta, setConsulta] = useState('')  // lo que se busca ('' = ver la lista)

  // Las reglas (máximo 6, sin repetidos) las decide logic/equipo.js
  function agregar(p) {
    setEquipo(agregarPokemon(equipo, p))
  }

  function quitar(id) {
    setEquipo(quitarPokemon(equipo, id))
  }

  // Hablar con Firestore le toca a data/equipos.js
  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorEquipo(null)
    try {
      await guardarEquipo(equipo)
      setEquipo(crearEquipo())
      setGuardados(await cargarEquipos())
    } catch (err) {
      setErrorEquipo(`No se pudo guardar el equipo: ${err.message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(id) {
    setErrorEquipo(null)
    try {
      await borrarEquipo(id)
      setGuardados(guardados.filter((g) => g.id !== id))
    } catch (err) {
      setErrorEquipo(`No se pudo borrar el equipo: ${err.message}`)
    }
  }

  function buscar(e) {
    e.preventDefault()
    setConsulta(texto.trim().toLowerCase())
  }

  function verTodos() {
    setTexto('')
    setConsulta('')
  }

  useEffect(() => {
    let cancelado = false // evita mostrar una respuesta vieja si cambias de página rápido

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        if (consulta) {
          const pokemon = await buscarPokemon(consulta)
          if (!consulta) setPokemones([pokemon])
        } else {
          // 1. La lista solo trae { name, url } de cada pokemon
          const res = await fetch(`${API}/pokemon?limit=${LIMITE}&offset=${offset}`)
          if (!res.ok) throw new Error(`Error al cargar la lista (${res.status})`)
          const lista = await res.json()

          // 2. Pedimos el detalle de los 25 en paralelo
          const detalles = await Promise.all(
            lista.results.map(p => fetch(p.url).then(r => r.json()))
          )
          if (!cancelado) {
            setTotal(lista.count)
            setPokemones(detalles.map(normalizar))
          }
        }
      } catch (err) {
        if (!cancelado) setError(err.message)
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()

    return () => { cancelado = true }
  }, [offset, consulta])

  useEffect(() => {
    cargarEquipos()
      .then(setGuardados)
      .catch((e) => setErrorEquipo(`No se pudieron cargar los equipos: ${e.message}`))
  }, [])

  const desde = offset + 1
  const hasta = Math.min(offset + LIMITE, total)

  // Primera puerta: la pantalla no deja guardar un equipo inválido (la segunda está en data/)
  const { valido, errores } = validarEquipo(equipo)

  return (
    <main>
      <h1>Pokédex</h1>
      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Nombre o número"
        />
        <button type="submit">Buscar</button>
        {consulta && <button type="button" onClick={verTodos}>Ver todos</button>}
      </form>

      {!consulta && (
        <div className="navegacion">
          <button
            disabled={cargando || offset === 0}
            onClick={() => setOffset(offset - LIMITE)}
          >
            Anterior
          </button>
          <span>{total > 0 && `${desde}–${hasta} de ${total}`}</span>
          <button
            disabled={cargando || offset + LIMITE >= total}
            onClick={() => setOffset(offset + LIMITE)}
          >
            Siguiente
          </button>
        </div>
      )}

      <h2>Mi equipo ({equipo.pokemones.length} / {MAX_EQUIPO})</h2>
      <form onSubmit={guardar}>
        <input
          value={equipo.nombre}
          onChange={e => setEquipo(ponerNombre(equipo, e.target.value))}
          placeholder="Nombre del equipo"
        />
        <button type="submit" disabled={!valido || guardando}>
          {guardando ? 'Guardando...' : 'Guardar equipo'}
        </button>
      </form>
      {!valido && <p>{errores.map((codigo) => MENSAJES[codigo]).join(' · ')}</p>}
      {errorEquipo && <p className='error'>{errorEquipo}</p>}
      <section className='equipo'>
        {equipo.pokemones.map((p) => <PokemonCard key={p.id} pokemon={p} onQuitar={quitar} />)}
      </section>


      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {!cargando && !error && (
        <section className="grid">
          {pokemones.map(p => <PokemonCard key={p.id} pokemon={p} onAgregar={agregar} />)}
        </section>
      )}

      <h2>Equipos guardados</h2>
      {guardados.length === 0 && <p>Todavía no hay equipos guardados</p>}
      {guardados.map((g) => (
        <article key={g.id}>
          <h3>{g.nombre} <button onClick={() => borrar(g.id)}>Borrar</button></h3>
          <section className='equipo'>
            {g.pokemones.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
          </section>
        </article>
      ))}
    </main>
  )
}

export default App
