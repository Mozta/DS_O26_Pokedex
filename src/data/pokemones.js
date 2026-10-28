//Todo lo que habla con PokeAPI vive aqui

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

export function normalizar(raw) {
  return {
    id: raw.id,
    nombre: raw.name,
    img: raw.sprites.other['official-artwork'].front_default,
    tipos: raw.types.map(t => t.type.name),
    altura: raw.height / 10, // metros
    peso: raw.weight / 10,   // kg
  }
}
