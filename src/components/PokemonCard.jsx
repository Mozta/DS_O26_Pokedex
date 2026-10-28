// Recibe un pokemon normalizado (ver src/data/pokemones.js), venga de PokéAPI o de Firestore
export const PokemonCard = ({ pokemon, onAgregar, onQuitar }) => {
  return (
    <article className='tarjeta'>
        <img src={pokemon.img} alt={pokemon.nombre} width="200" />
        <h2>#{pokemon.id} {pokemon.nombre}</h2>
        <ul className='tipos'>
            {pokemon.tipos.map(t => (
                <li key={t}>{t}</li>
            ))}
        </ul>
        {pokemon.altura != null && <p>Altura: {pokemon.altura}m - Peso: {pokemon.peso}kg</p>}
        {onAgregar && <button onClick={() => onAgregar(pokemon)}>Agregar</button>}
        {onQuitar && <button onClick={() => onQuitar(pokemon.id)}>Quitar</button>}
    </article>
  )
}
