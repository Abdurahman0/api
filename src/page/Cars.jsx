/* eslint-disable react-hooks/exhaustive-deps */
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
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = cars.data.filter(cars => cars.id === id)
		setElement(res)
		setModal(!modal)
	}

	console.log(cars)

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
			console.log('Brands: ', brands.data)
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
			console.log('Models: ', models.data)
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
			console.log('Cities: ', cities.data)
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
			console.log('Categories: ', categories.data)
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
			console.log('Locations: ', locations.data)
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

	useEffect(() => {
		getCars()
		getBrands()
		getModels()
		getCities()
		getCategories()
		getLocations()
	}, [])

	return (
		<div className={`w-full h-full bg-red-800 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
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
					<tr className='bg-blue-600 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Title</th>
						<th className='p-2'>Image</th>
						<th className='bg-green-600 p-2'>Change</th>
						<th className='bg-destructive p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{cars?.data?.map((car, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>{id + 1}</td>
							<td className='p-2'>{car.transmission}</td>
							<td className='p-2 flex justify-center items-center'>
								<img
									src={`https://realauto.limsa.uz/api/uploads/images/${car.car_images[0].image.src}`}
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
		</div>
	)
}

export default Cars
