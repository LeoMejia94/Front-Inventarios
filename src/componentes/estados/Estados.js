import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { crearEstado, obtenerEstados } from '../../services/EstadoService'
import HeaderTable from '../ui/HeaderTable'
import Modal from '../ui/Modal'

export default function Estados() {

  const [Estados, setEstados] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(true)
  const [error, setError] = useState(false)
  const [Estado, setEstado] = useState({
    nombre: ''
  })
  const [errorSend, setErrorSend] = useState({
    status: false,
    msg: ''
  })

  const listEstados = async () => {
    setLoading(true)
    try{
      setError(false)
      const { data } = await obtenerEstados(query)
      setEstados(data)
      setLoading(false)
    }catch(e){
      console.log(e)
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    listEstados();
  }, [query])

  const cambiarSwitche = () => {
    setQuery(!query)
  }

  const guardarEstado = async () => {
    setErrorSend({status: false, msg: ''})
    setLoading(true)
    try{
      const res = await crearEstado(Estado)
      console.log(res)
      setLoading(true)
      setEstado({nombre: ''})
      listEstados()
    }catch(e){
      const {status, data} = e.response;
      /*if(status == 400){
        console.log(data.msg)
        
      }*/
      setErrorSend({status: true, msg: data.msg})
      console.log(e)
      setLoading(false)
    }
    
  }

  const handleChange = e => {
    setEstado({
      ...Estado, 
      [e.target.name]: e.target.value
    })
  }

  return (
      <div>
        <Modal 
          titulo={'Tipo de Equipo'}
          guardar={guardarEstado}
          element={Estado}
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
            Estados.map((Estado,index) => {
              return (
                <tr>
                <th scope="row">{index + 1}</th>
                <td>{Estado.nombre}</td>
                <td>{Estado.estado ? 'Activo': 'Inactivo'}</td>
                <td>{dayjs(Estado.fechaCreacion).format('YYYY-MM-DD')}</td>
                <td>{dayjs(Estado.fechaActualizacion).format('YYYY-MM-DD')}</td>
                <td>
                  <button type="button" className="btn btn-success">Editar</button>
                  <button type="button" className="btn btn-danger">Borrar</button>
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
