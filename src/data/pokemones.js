//Todo lo que habla con PokeAPI vive aqui
import { normalizar } from "../pokemon";

const API = "https://pokeapi.co/api/v2"

export async function buscarPokemon(consulta) {
    const res = await fetch(`${API}/pokemon/${consulta}`)
    if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`)
    return normalizar(await res.json())
    
}

export async function listarPokemones(offset, limite) {
    // 1. La lista de pokemon (nombre o id, url)
    const res = await fetch(`${API}/pokemon?limit=${limite}&offset=${offset}`)
    if (!res.ok) throw new Error(`Error al cargar la lista (${res.status})`)
    const lista = await res.json()
    
    // 2. Pedir detalle de cada pokemon (en paralelo)
    const detalles = await Promise.all(
        lista.results.map(p => fetch(p.url).then(r => r.json()))
    )
    return { total: lista.count, pokemones: detalles.map(normalizar)}
}