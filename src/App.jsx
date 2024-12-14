import { Route, Routes } from 'react-router-dom'
import Main from './page/Main'
import Login from './page/Login'
import Dashboard from './page/Dashboard'
import Categories from './page/Categories'

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Main />}>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/categories' element={<Categories />} />
				</Route>
				<Route path='/login' element={<Login />} />
			</Routes>
		</>
	)
}

export default App
