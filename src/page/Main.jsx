/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Main() {
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('tokenchik')
		if (!token) {
			navigate('/login')
		} else {
			navigate('/dashboard')
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
