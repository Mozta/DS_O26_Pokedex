const boton =
  'grid size-9 place-items-center border border-tinta text-lg transition-colors hover:bg-tinta hover:text-papel disabled:cursor-not-allowed disabled:border-linea disabled:text-linea disabled:hover:bg-transparent'

export const Paginacion = ({ desde, hasta, total, puedeAnterior, puedeSiguiente, onAnterior, onSiguiente }) => (
  <nav aria-label="Páginas" className="flex items-center gap-3">
    <span className="font-mono text-sm tabular-nums text-gris">
      {total > 0 ? `${desde}–${hasta} / ${total}` : '—'}
    </span>
    <div className="flex gap-1">
      <button type="button" className={boton} disabled={!puedeAnterior} onClick={onAnterior} aria-label="Página anterior">
        ←
      </button>
      <button type="button" className={boton} disabled={!puedeSiguiente} onClick={onSiguiente} aria-label="Página siguiente">
        →
      </button>
    </div>
  </nav>
)
