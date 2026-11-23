function fecha(creadoEn) {
  // creadoEn es un Timestamp de Firestore; puede venir vacío un instante después de guardar
  const d = creadoEn?.toDate?.()
  return d ? d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export const EquiposGuardados = ({ equipos, onBorrar }) => {
  if (equipos.length === 0) {
    return (
      <p className="border border-dashed border-linea px-4 py-8 text-center text-gris">
        Todavía no hay equipos guardados. Arma uno y guárdalo.
      </p>
    )
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {equipos.map((eq) => (
        <li key={eq.id} className="border border-linea bg-ficha">
          <header className="flex items-baseline gap-3 border-b border-linea px-3 py-2">
            <h3 className="font-semibold [font-stretch:87%]">{eq.nombre}</h3>
            <span className="font-mono text-xs text-gris">{fecha(eq.creadoEn)}</span>
            <button
              type="button"
              onClick={() => onBorrar(eq.id)}
              className="ml-auto text-sm text-gris underline-offset-2 hover:text-rojo hover:underline"
            >
              Borrar
            </button>
          </header>
          <ul className="grid grid-cols-6 gap-1 p-2">
            {eq.pokemones.map((p) => (
              <li key={p.id} title={p.nombre}>
                <img src={p.img} alt={p.nombre} className="aspect-square w-full object-contain" />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
