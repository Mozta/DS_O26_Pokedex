import { MAX_EQUIPO, MENSAJES } from '../logic/equipo'
import { numero } from './tipos'

// Solo muestra el equipo; quien decide qué se puede hacer es logic/equipo.js (vía App)
export const PanelEquipo = ({
  equipo, valido, errores, guardando, error, onQuitar, onNombre, onGuardar,
}) => {
  const lugares = Array.from({ length: MAX_EQUIPO }, (_, i) => equipo.pokemones[i])

  return (
    <section className="bg-tinta p-4 text-papel sm:p-5">
      <header className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold uppercase [font-stretch:75%] tracking-wide">Mi equipo</h2>
        <span className="font-mono text-sm text-papel/60">
          {equipo.pokemones.length}/{MAX_EQUIPO}
        </span>
      </header>

      <ol className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-3">
        {lugares.map((p, i) =>
          p ? (
            <li key={p.id} className="relative aspect-square bg-papel/10">
              <img src={p.img} alt={p.nombre} className="h-full w-full object-contain p-1.5" />
              <span className="absolute bottom-1 left-1.5 font-mono text-[10px] text-papel/60">
                {numero(p.id)}
              </span>
              <button
                type="button"
                onClick={() => onQuitar(p.id)}
                aria-label={`Quitar a ${p.nombre}`}
                className="absolute top-0 right-0 grid size-6 place-items-center text-papel/60 transition-colors hover:bg-rojo hover:text-white"
              >
                ×
              </button>
            </li>
          ) : (
            <li
              key={`vacio-${i}`}
              className="grid aspect-square place-items-center border border-dashed border-papel/25 font-mono text-xs text-papel/35"
            >
              {String(i + 1).padStart(2, '0')}
            </li>
          ),
        )}
      </ol>

      <form onSubmit={onGuardar} className="mt-4 flex flex-col gap-2">
        <label htmlFor="nombre-equipo" className="font-mono text-[11px] uppercase tracking-wider text-papel/60">
          Nombre del equipo
        </label>
        <input
          id="nombre-equipo"
          value={equipo.nombre}
          onChange={(e) => onNombre(e.target.value)}
          placeholder="Ej. Ruta 1"
          className="border border-papel/25 bg-transparent px-3 py-2 text-papel placeholder:text-papel/35 focus:border-papel focus:outline-none"
        />

        {!valido && (
          <ul className="flex flex-col gap-0.5 text-sm text-papel/70">
            {errores.map((codigo) => (
              <li key={codigo} className="before:mr-1.5 before:text-rojo before:content-['■']">
                {MENSAJES[codigo]}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={!valido || guardando}
          className="mt-1 bg-rojo px-3 py-2.5 font-semibold uppercase tracking-wide [font-stretch:87%] text-white transition-colors hover:bg-rojo-oscuro disabled:cursor-not-allowed disabled:bg-papel/10 disabled:text-papel/40"
        >
          {guardando ? 'Guardando…' : 'Guardar equipo'}
        </button>

        {error && <p role="alert" className="border-l-2 border-rojo pl-2 text-sm text-papel">{error}</p>}
      </form>
    </section>
  )
}
