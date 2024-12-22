import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

function Cars() {
	const [cars, setCars] = useState([])
	const [modal, setModal] = useState(false)
	const [brands, setBrands] = useState([])
	const [models, setModels] = useState([])
	const [cities, setCities] = useState([])
	const [locations, setLocations] = useState([])
	const [categories, setCategories] = useState([])
	const [element, setElement] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = cars.data.filter(cars => cars.id === id)
		setElement(res)
		setModal(!modal)
	}

	const getBrands = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/brands', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setBrands(data)
		} catch (err) {
			console.error(err)
		}
	}

	const getModels = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/models', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setModels(data)
		} catch (err) {
			console.error(err)
		}
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

	const getCategories = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/categories', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setCategories(data)
		} catch (err) {
			console.error(err)
		}
	}

	const getLocations = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/locations', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setLocations(data)
		} catch (err) {
			console.error(err)
		}
	}

	const getCars = async () => {
		try {
			const response = await fetch('https://realauto.limsa.uz/api/cars', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.message}`)
			}

			const data = await response.json()
			setCars(data)
		} catch (err) {
			console.error(err)
		}
	}

	const deleteCars = async id => {
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
			const response = await fetch(`https://realauto.limsa.uz/api/cars/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			toast(response.status === 200 && 'Deleted successfully')
		} catch (err) {
			console.error(err)
		} finally {
			getCars()
		}
	}

	// Pagination logic
	const totalPages = Math.ceil((cars?.data?.length || 0) / itemsPerPage)

	// Get cars for the current page
	const paginatedCars = cars?.data?.slice(
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
		getCars()
		getBrands()
		getModels()
		getCities()
		getCategories()
		getLocations()
	}, [])

	return (
		<div className={`w-full h-full bg-gray-700 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Cars</h1>
				<Button onClick={() => handleModal()}>OPEN</Button>
			</div>

			{/* Show error if any */}
			{/* {error && <p className='text-red-400'>Error: {error}</p>} */}

			<div
				className={`fixed inset-0 ${
					modal ? 'flex' : 'hidden'
				} justify-center items-center bg-black bg-opacity-50`}
			>
				{modal && (
					<Modal
						id={element}
						brands={brands.data}
						models={models.data}
						cities={cities.data}
						categories={categories.data}
						locations={locations.data}
						modal={modal}
						handleModal={handleModal}
					/>
				)}
			</div>

			{/* Display fetched data */}
			<table className='w-full text-left bg-white text-black rounded shadow-md'>
				<thead>
					<tr className='bg-blue-950 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Title</th>
						<th className='p-2'>Image</th>
						<th className='bg-green-950 p-2'>Change</th>
						<th className='bg-red-950 p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{paginatedCars?.map((car, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>
								{(currentPage - 1) * itemsPerPage + id + 1}
							</td>
							<td className='p-2'>{car.transmission}</td>
							<td className='p-2 flex justify-center items-center'>
								<img
									src={`https://realauto.limsa.uz/api/uploads/images/${car.car_images[1].image.src}`}
									alt={car.title}
									className='w-16 h-16 object-cover rounded'
								/>
							</td>
							<td className='p-2'>
								<Button
									variant='change'
									className='cursor-pointer'
									onClick={() => handleModal(car.id)}
								>
									Change
								</Button>
							</td>
							<td className='p-2'>
								<Button
									variant='destructive'
									className='cursor-pointer'
									onClick={() => deleteCars(car.id)}
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

export default Cars
