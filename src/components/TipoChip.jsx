import { infoTipo } from './tipos'

export const TipoChip = ({ tipo }) => {
  const { nombre, color, claro } = infoTipo(tipo)
  return (
    <li
      className={`rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ${claro ? 'text-tinta' : 'text-white'}`}
      style={{ backgroundColor: color }}
    >
      {nombre}
    </li>
  )
}
