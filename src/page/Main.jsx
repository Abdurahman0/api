/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Main() {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	useEffect(() => {
		const token = localStorage.getItem('tokenchik')
		if (!token) {
			navigate('/login')
		} else if (pathname === '/categories') {
			navigate('/categories')
		} else if (pathname === '/brands') {
			navigate('/brands')
		} else if (pathname === '/cities') {
			navigate('/cities')
		}
	}, [])

	const handleLogout = () => {
		localStorage.removeItem('tokenchik')
		navigate('/login')
	}

	return (
		<div>
			<Navbar handleLogout={handleLogout} />
		</div>
	)
}

export default Main
