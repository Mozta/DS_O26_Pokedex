import {
    addDoc, collection, getDocs, orderBy, query, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

function coleccionDe(uid){
    return collection(db, 'usuarios', uid, 'notas')
}

export async function guardarNota(uid, texto) {
    await addDoc(coleccionDe(uid), {
        texto: texto.trim(), 
        creadaEn: serverTimestamp()
    })
}

export async function cargarNotas(uid) {
    const snap = await getDocs(query(coleccionDe(uid), orderBy('creadaEn', 'desc')))
    return snap.docs.map((d) => ({id: d.id, ...d.data()}))
}