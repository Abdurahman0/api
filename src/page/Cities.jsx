import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

function Cities() {
	const [cities, setCities] = useState([])
	const [modal, setModal] = useState(false)
	const [element, setElement] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5 // Set the number of cities to display per page
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = cities.data.filter(city => city.id === id)
		setElement(res)
		setModal(!modal)
	}

	const getCities = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/cities', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setCities(data)
		} catch (err) {
			console.error(err)
		}
	}

	const deleteCities = async id => {
		const confirmDelete = await new Promise(resolve => {
			toast(
				<div>
					<p>Are you sure you want to delete this item?</p>
					<div style={{ display: 'flex', gap: '10px' }}>
						<button onClick={() => resolve(true)}>Yes</button>
						<button onClick={() => resolve(false)}>No</button>
					</div>
				</div>,
				{
					duration: 5000,
				}
			)
		})

		if (!confirmDelete) {
			toast('Deletion canceled.')
			return
		}

		try {
			const response = await fetch(
				`https://realauto.limsa.uz/api/cities/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			toast(response.status === 200 && 'Deleted successfully')
		} catch (err) {
			console.error(err)
		} finally {
			getCities()
		}
	}

	// Pagination logic
	const totalPages = Math.ceil((cities?.data?.length || 0) / itemsPerPage)

	// Get cities for the current page
	const paginatedCities = cities?.data?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	// Change page
	const changePage = newPage => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	useEffect(() => {
		getCities()
	}, [])

	return (
		<div className={`w-full h-full bg-gray-700 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Cities</h1>
				<Button onClick={() => handleModal()}>OPEN</Button>
			</div>

			<div
				className={`fixed inset-0 ${
					modal ? 'flex' : 'hidden'
				} justify-center items-center bg-black bg-opacity-50`}
			>
				{modal && (
					<Modal id={element} modal={modal} handleModal={handleModal} />
				)}
			</div>

			{/* Display fetched data */}
			<table className='w-full text-left bg-white text-black rounded shadow-md'>
				<thead>
					<tr className='bg-blue-950 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Name</th>
						<th className='p-2'>Text</th>
						<th className='p-2'>Image</th>
						<th className='bg-green-950 p-2'>Change</th>
						<th className='bg-red-950 p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{paginatedCities?.map((city, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>
								{(currentPage - 1) * itemsPerPage + id + 1}
							</td>
							<td className='p-2'>{city.name}</td>
							<td className='p-2'>{city.text}</td>
							<td className='p-2 flex justify-center items-center'>
								<img
									src={`https://realauto.limsa.uz/api/uploads/images/${city.image_src}`}
									alt={city.name_en}
									className='w-16 h-16 object-cover rounded'
								/>
							</td>
							<td className='p-2'>
								<Button
									variant='change'
									className='cursor-pointer'
									onClick={() => handleModal(city.id)}
								>
									Change
								</Button>
							</td>
							<td className='p-2'>
								<Button
									variant='destructive'
									className='cursor-pointer'
									onClick={() => deleteCities(city.id)}
								>
									Delete
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination Controls */}
			<div className='flex justify-center items-center gap-2 mt-4'>
				<button
					className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
					disabled={currentPage === 1}
					onClick={() => changePage(currentPage - 1)}
				>
					Previous
				</button>
				<span className='px-4 py-2'>
					Page {currentPage} of {totalPages}
				</span>
				<button
					className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
					disabled={currentPage === totalPages}
					onClick={() => changePage(currentPage + 1)}
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default Cities
