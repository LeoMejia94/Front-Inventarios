import React from 'react'
import notfound from './NotFound.webp'

export default function NotFound() {
  return (
    <div>
        <h2>Pagina no encontrada</h2>
        <img
        className="figure img img-fluid d-block"
        alt=""
        src={notfound}
    />
    </div>
  )
}
