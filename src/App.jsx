import { Route, Routes } from 'react-router-dom'
import Main from './page/Main'
import Login from './page/Login'
import Dashboard from './page/Dashboard'
import Categories from './page/Categories'
import { ToastContainer } from 'react-toast'
import Brands from './page/Brands'
import Models from './page/Models'
import Cities from './page/Cities'

function App() {
	return (
		<>
			<ToastContainer />
			<Routes>
				<Route path='/' element={<Main />}>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/categories' element={<Categories />} />
					<Route path='/brands' element={<Brands />} />
					<Route path='/models' element={<Models />} />
					<Route path='/cities' element={<Cities />} />
				</Route>
				<Route path='/login' element={<Login />} />
			</Routes>
		</>
	)
}

export default App
