// src/data/equipos.js
// Todo lo que habla con Firestore sobre equipos vive aquí.
// Un documento por equipo, con sus Pokémon adentro (como la orden en la Fonda).
import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { validarEquipo } from '../logic/equipo'

const COLECCION = 'equipos'

export async function guardarEquipo(equipo) {
  // Segunda puerta: aunque la pantalla se equivoque, aquí no pasa un equipo inválido.
  const { valido, errores } = validarEquipo(equipo)
  if (!valido) throw new Error(`Equipo inválido: ${errores.join(', ')}`)

  const documento = {
    nombre: equipo.nombre.trim(),
    pokemones: equipo.pokemones.map(({ id, nombre, img, tipos }) => ({ id, nombre, img, tipos })),
    creadoEn: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, COLECCION), documento)
  return { id: ref.id }
}

export async function cargarEquipos() {
  const snap = await getDocs(query(collection(db, COLECCION), orderBy('creadoEn', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function borrarEquipo(id) {
  await deleteDoc(doc(db, COLECCION, id))
}