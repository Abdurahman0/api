import { Route, Routes } from 'react-router-dom'
import Main from './page/Main'
import Login from './page/Login'
import Dashboard from './page/Dashboard'
import { ToastContainer } from 'react-toast'
import Brands from './page/Brands'
import Cities from './page/Cities'
import Locations from './page/Locations'
import Models from './page/Models'

function App() {
	return (
		<>
			<ToastContainer />
			<Routes>
				<Route path='/' element={<Main />}>
					<Route path='/categories' element={<Dashboard />} />
					<Route path='/brands' element={<Brands />} />
					<Route path='/cities' element={<Cities />} />
					<Route path='/locations' element={<Locations />} />
					<Route path='/models' element={<Models />} />
				</Route>
				<Route path='/login' element={<Login />} />
			</Routes>
		</>
	)
}

export default App
