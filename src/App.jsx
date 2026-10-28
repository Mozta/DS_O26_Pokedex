import { useState, useEffect } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { PokemonCard } from './components/PokemonCard'
import { normalizar } from './pokemon'
import { MAX_EQUIPO, crearEquipo, agregarPokemon } from './logic/equipo'
import './App.css'

const API = "https://pokeapi.co/api/v2"
const LIMITE = 25 // pokemones por página

function App() {
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [equipo, setEquipo] = useState(crearEquipo())
  const [errorEquipo, setErrorEquipo] = useState(null)
  
  const [offset, setOffset] = useState(0)   // desde qué pokemon empieza la página
  const [total, setTotal] = useState(0)     // cuántos pokemones hay en la API

  const [texto, setTexto] = useState('')        // lo que se escribe
  const [consulta, setConsulta] = useState('')  // lo que se busca ('' = ver la lista)

  async function agregar(p){
    // Las reglas (máximo 6, sin repetidos) ya no viven aquí: las decide logic/equipo.js
    const nuevo = agregarPokemon(equipo, p)
    if (nuevo === equipo) return // no entró: no hay nada que guardar
    try {
      setErrorEquipo(null)
      await setDoc(doc(db, 'equipo', String(p.id)), p)
      setEquipo(nuevo)
    } catch (err) {
      setErrorEquipo(`No se pudo guardar en el equipo: ${err.message}`)
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
          const res = await fetch(`${API}/pokemon/${consulta}`)
          if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`)
          const data = await res.json()
          if (!cancelado) setPokemones([normalizar(data)])
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
    getDocs(collection(db, "equipo"))
    .then((snap) => 
      setEquipo({
        ...crearEquipo(),
        pokemones: snap.docs.map((d) => ({tipos: [], ...d.data(), id: Number(d.id)})),
      })
    )
    .catch((e) => setErrorEquipo(`No se pudo cargar el equipo: ${e.message}`))
  }, [])

  const desde = offset + 1
  const hasta = Math.min(offset + LIMITE, total)

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
      {errorEquipo && <p className='error'>{errorEquipo}</p>}
      <section className='equipo'>
        {equipo.pokemones.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
      </section>


      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {!cargando && !error && (
        <section className="grid">
          {pokemones.map(p => <PokemonCard key={p.id} pokemon={p} onAgregar={agregar} />)}
        </section>
      )}
    </main>
  )
}

export default App
