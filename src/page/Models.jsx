/* eslint-disable react-hooks/exhaustive-deps */
import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

function Models() {
	const [models, setModels] = useState([])
	const [brands, setBrands] = useState([])
	const [modal, setModal] = useState(false)
	const [element, setElement] = useState(null)
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = models.data.filter(models => models.id === id)
		setElement(res)
		setModal(!modal)
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

	const deleteModels = async id => {
		try {
			const response = await fetch(
				`https://realauto.limsa.uz/api/models/${id}`,
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
			getModels()
		}
	}

	useEffect(() => {
		getModels()
		getBrands()
	}, [])

	return (
		<div className={`w-full h-full bg-gray-700 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Models</h1>
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
						modal={modal}
						brands={brands.data}
						handleModal={handleModal}
					/>
				)}
			</div>

			{/* Display fetched data */}
			<table className='w-full text-left bg-white text-black rounded shadow-md'>
				<thead>
					<tr className='bg-blue-950 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Name</th>
						<th className='p-2'>Brand</th>
						<th className='bg-green-950 p-2'>Change</th>
						<th className='bg-red-950 p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{models?.data?.map((city, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>{id + 1}</td>
							<td className='p-2'>{city.name}</td>
							<td className='p-2'>{city.brand_title}</td>
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
									onClick={() => deleteModels(city.id)}
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

export default Models
