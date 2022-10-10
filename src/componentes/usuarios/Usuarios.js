import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { borrarUsuarioPorID, crearUsuario, editarUsuarioPorID, obtenerUsuarios } from '../../services/UsuariosService'
import HeaderTable from '../ui/HeaderTable'
import Modal from '../ui/Modal'

export default function Usuarios() {
  const [Usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(true)
  const [error, setError] = useState(false)
  const [Usuario, setUsuario] = useState({
    nombre: '',
    Usuario: true
  })
  const [errorSend, setErrorSend] = useState({
    status: false,
    msg: ''
  })
  //const [tipoId, setTipoId] = useState('')

  const listUsuarios= async () => {
    setLoading(true)
    try{
      setError(false)
      const { data } = await obtenerUsuarios(query)
      setUsuarios(data)
      setLoading(false)
    }catch(e){
      console.log(e)
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    listUsuarios();
  }, [query])

  const cambiarSwitche = () => {
    setQuery(!query)
  }

  const guardarUsuario = async () => {
    setErrorSend({status: false, msg: ''})
    setLoading(true)
    try{
      const res = await crearUsuario(Usuario)
      console.log(res)
      setLoading(true)
      setUsuario({nombre: ''})
      listUsuarios()
    }catch(e){
      const {status, data} = e.response;
      setErrorSend({status: true, msg: data.msg})
      console.log(e)
      setLoading(false)
    }
    
  }

  const handleChange = e => {
    setUsuario({
      ...Usuario, 
      [e.target.name]: e.target.value
    })
  }

  const borrarUsuario = async (e) => {
    setLoading(true)
    try{
      setError(false)
      const id = e.target.id
      console.log(id)
      const res = await borrarUsuarioPorID(id)
      console.log(res)
      listUsuarios();
      setLoading(false)
    }catch(e){
      console.log(e)
      setError(true)
      setLoading(false)
    }
  }

  const editarUsuario = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      setError(false)
      const resp = await editarUsuarioPorID(Usuario._id, Usuario);
      console.log(resp)
      resetUsuario()
      listUsuarios()
    }catch(e){
      setLoading(false)
      console.log(e)
      setError(true)
    }

  }

  const setUsuarioPorId = (e) => {
    console.log(e.target.id)
    const UsuariosFilter = Usuarios.filter(t => t._id == e.target.id);
    const est = UsuariosFilter[0];
    console.log(est)
    setUsuario(est)
  }

  const resetUsuario =() => {
    setUsuario({
      nombre: '',
      Usuario: true
    })
  }

  return (
      <div>
        <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModal2Label" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModal2Label">Editar Usuario</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  data-bs-dismiss="modal" 
                  aria-label="Close"
                  onClick={resetUsuario}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editarUsuario}>
                  <div className="mb-3">
                    <label for="recipient-name" className="col-form-label">Nombre:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="recipient-name"
                      onChange={handleChange}
                      value={Usuario.nombre}
                      name="nombre"
                    />
                    <select 
                      class="form-select" 
                      aria-label="Default select example"
                      name="Usuario"
                      value={Usuario.Usuario}
                      onChange={handleChange}
                    >
                      <option value={false}>Inactivo</option>
                      <option value={true}>Activo</option>
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    onClick={resetUsuario}
                  >
                    Cerrar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={Usuario.nombre.length <= 0}
                    data-bs-dismiss="modal"
                  >
                    Enviar
                  </button>
                </form>
              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>
        <Modal 
          titulo={'Usuario'}
          guardar={guardarUsuario}
          element={Usuario}
          change={handleChange}
        />
        <button 
          type="button" 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal" 
        >
          Nuevo
        </button>
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            role="switch" 
            id="flexSwitchCheckChecked" 
            checked={query}
            onChange={cambiarSwitche}
          />
          <label className="form-check-label" hmtlFor="flexSwitchCheckChecked">( Inactivo / Activo )</label>
        </div>
        {
          loading && 
          (<div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          </div>)
        }
        {errorSend.status && (
        <div className="alert alert-danger" role="alert">
          {errorSend.msg}
          </div>)
        }
        {
        error && (
        <div className="alert alert-danger" role="alert">
          Error al cargar datos
          </div>)
        }
        <table className="table">
        <HeaderTable />
        <tbody>
          {
            Usuarios.map((Usuario,index) => {
              return (
              <tr key={Usuario._id}>
                <th scope="row">{index + 1}</th>
                <td>{Usuario.nombre}</td>
                <td>{Usuario.Usuario ? 'Activo': 'Inactivo'}</td>
                <td>{dayjs(Usuario.fechaCreacion).format('YYYY-MM-DD')}</td>
                <td>{dayjs(Usuario.fechaActualizacion).format('YYYY-MM-DD')}</td>
                <td>
                  <button 
                    id={Usuario._id}
                    type="button" 
                    className="btn btn-success"
                    data-bs-toggle="modal" 
                    data-bs-target="#exampleModal2"
                    onClick={setUsuarioPorId}
                  >
                    Editar
                  </button>
                  <button 
                    id={Usuario._id}
                    type="button" 
                    className="btn btn-danger"
                    onClick={borrarUsuario}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
              )
            })
          }
        </tbody>
        </table>
      </div>
  )
}