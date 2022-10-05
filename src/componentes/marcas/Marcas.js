import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { crearMarca, obtenerMarcas } from '../../services/MarcaService'
import HeaderTable from '../ui/HeaderTable'
import Modal from '../ui/Modal'

export default function Marcas() {

  const [Marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(true)
  const [error, setError] = useState(false)
  const [Marca, setMarca] = useState({
    nombre: ''
  })
  const [errorSend, setErrorSend] = useState({
    status: false,
    msg: ''
  })

  const listMarcas = async () => {
    setLoading(true)
    try{
      setError(false)
      const { data } = await obtenerMarcas(query)
      setMarcas(data)
      setLoading(false)
    }catch(e){
      console.log(e)
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    listMarcas();
  }, [query])

  const cambiarSwitche = () => {
    setQuery(!query)
  }

  const guardarMarca = async () => {
    setErrorSend({status: false, msg: ''})
    setLoading(true)
    try{
      const res = await crearMarca(Marca)
      console.log(res)
      setLoading(true)
      setMarca({nombre: ''})
      listMarcas()
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
    setMarca({
      ...Marca, 
      [e.target.name]: e.target.value
    })
  }

  return (
      <div>
        <Modal 
          titulo={'Marca'}
          guardar={guardarMarca}
          element={Marca}
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
            Marcas.map((Marca,index) => {
              return (
                <tr>
                <th scope="row">{index + 1}</th>
                <td>{Marca.nombre}</td>
                <td>{Marca.estado ? 'Activo': 'Inactivo'}</td>
                <td>{dayjs(Marca.fechaCreacion).format('YYYY-MM-DD')}</td>
                <td>{dayjs(Marca.fechaActualizacion).format('YYYY-MM-DD')}</td>
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
