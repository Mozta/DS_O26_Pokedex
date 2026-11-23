import { useState, useEffect } from "react";
import { registrar, iniciarSesion, escucharSesion, cerrarSesion } from "./data/auth";
import { cargarNotas, guardarNota } from "./data/notas";

function LoginDemo(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [usuario, setUsuario] = useState(null)
    const [revisando, setRevisando] = useState(true)

    const [texto, setTexto] = useState('')
    const [notas, setNotas] = useState([])

    useEffect(() => {
        if (!usuario) return
        cargarNotas(usuario.uid)
            .then(setNotas)
            .catch((err) => setError(err.message))
    }, [usuario])

    useEffect(() => {
        const dejarDeEscuchar = escucharSesion((user) => {
            setUsuario(user)
            setRevisando(false)
        })
        return dejarDeEscuchar
    }, [])

    async function guardar(e) {
        e.preventDefault()
        setError('')
        try {
            await guardarNota(usuario.uid, texto)
            setTexto('')
            setNotas(await cargarNotas(usuario.uid))
        } catch (err) {
            setError(err.message)
        }
    }

    async function salir() {
        await cerrarSesion()
        setNotas([])
    }

    async function entrar(e) {
        e.preventDefault()
        setError('')
        try{
            await iniciarSesion(email, password)
        } catch (err){
            setError(err.code)
        }
    }

    async function crearCuenta() {
        setError('')
        try{
            await registrar(email, password)
        } catch (err){
            setError(err.code)
        }
    }

    if (revisando) return <p>Cargando...</p>

    if (!usuario) {
        return (
            <main>
                <h1>Login</h1>
                <form onSubmit={entrar}>
                    <input type="email" name="email" id="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)} placeholder="Correo"/>
                    <input type="password" name="password" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña"/>

                    <button type="submit">Entrar</button>
                    <button type="button" onClick={crearCuenta}>Crear cuenta</button>
                </form>
                {error && <p className="error">{error}</p>}
            </main>
        )   
    }

    return(
        <main>
            <h1>Hola, {usuario.email}</h1>
            <p>Tu uid: {usuario.uid}</p>
            <button onClick={salir}>Cerrar sesión</button>

            <form onSubmit={guardar}>
                <input type="text" value={texto} 
                onChange={(e) => setTexto(e.target.value)} placeholder="Escribe una nota..."/>
                <button type="submit" disabled={texto.trim() === ''}>Guardar</button>
            </form>
            {error && <p className="error">{error}</p>}

            <ul>
                {notas.map((nota) => <li key={nota.id}>{nota.texto}</li>)}
            </ul>
        </main>
    )
    
}

export default LoginDemo