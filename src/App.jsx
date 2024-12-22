import { Route, Routes } from 'react-router-dom'
import Main from './page/Main'
import Login from './page/Login'
import Dashboard from './page/Dashboard'
import Brands from './page/Brands'
import Cities from './page/Cities'
import Locations from './page/Locations'
import Models from './page/Models'
import Cars from './page/Cars'
import { ToastContainer } from 'react-toast'

function App() {
	return (
		<>
			<ToastContainer
				delay={2000}
				position='top-center' // Adjusts all toasts to appear in the center
			/>
			<Routes>
				<Route path='/' element={<Main />}>
					<Route path='/categories' element={<Dashboard />} />
					<Route path='/brands' element={<Brands />} />
					<Route path='/cities' element={<Cities />} />
					<Route path='/locations' element={<Locations />} />
					<Route path='/models' element={<Models />} />
					<Route path='/cars' element={<Cars />} />
				</Route>
				<Route path='/login' element={<Login />} />
			</Routes>
		</>
	)
}

export default App
