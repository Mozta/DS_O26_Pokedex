//Todo lo que habla con PokeAPI vive aqui
import { normalizar } from "../pokemon";

const API = "https://pokeapi.co/api/v2"

export async function buscarPokemon(consulta) {
    const res = await fetch(`${API}/pokemon/${consulta}`)
    if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`)
    return normalizar(await res.json())
    
}