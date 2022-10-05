import React from 'react'
import NavBar from '../componentes/ui/NavBar'
import { Routes, Route } from 'react-router-dom'
import TipoEquipos from '../componentes/tiposequipos/TipoEquipos'
import Estados from '../componentes/estados/Estados'
import Marcas from '../componentes/marcas/Marcas'
import Usuarios from '../componentes/usuarios/Usuarios'
import Inventarios from '../componentes/inventarios/Inventarios'
import NotFound from '../componentes/ui/NotFound'

export default function AppRouter() {
  return (
    <div>
        <NavBar title={'IUD'}/>
        <main className='container'>
            <Routes >
                <Route path='/' element={<TipoEquipos />} />
                <Route path='/estados' element={<Estados />} />
                <Route path='/marcas' element={<Marcas />} />
                <Route path='/usuarios' element={<Usuarios />} />
                <Route path='/inventarios' element={<Inventarios />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </main>
    </div>
  )
}