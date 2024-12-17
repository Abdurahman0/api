import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

function Dashboard() {
	// State to store fetched data
	const [categories, setCategories] = useState([])
	const [error, setError] = useState(null)
	const [modal, setModal] = useState(false)
	const [element, setElement] = useState(null)
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = categories.data.filter(category => category.id === id)
		setElement(res)
		setModal(!modal)
	}

	const deleteItems = async id => {
		try {
			const response = await fetch(
				`https://realauto.limsa.uz/api/categories/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			toast(response.status === 200 && 'Deleted successfully')
		} catch (error) {
			toast.error('Error in deleting category:', error)
		} finally {
			getCategories()
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
			setError(err)
		}
	}

	console.log(categories)

	// Fetch data when the component mounts
	useEffect(() => {
		getCategories()
	}, [])

	console.log(categories?.data)

	return (
		<div className={`w-full h-full bg-red-800 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<Button className='' onClick={handleModal}>
					OPEN
				</Button>
			</div>

			{/* Show error if any */}
			{error && <p className='text-red-400'>Error: {error}</p>}

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
					<tr className='bg-blue-600 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Name (EN)</th>
						<th className='p-2'>Name (RU)</th>
						<th className='p-2'>Image</th>
						<th className='bg-green-600 p-2'>Change</th>
						<th className='bg-destructive p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{categories?.data?.map((category, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>{id + 1}</td>
							<td className='p-2'>{category.name_en}</td>
							<td className='p-2'>{category.name_ru}</td>
							<td className='p-2 flex justify-center items-center'>
								<img
									src={`https://realauto.limsa.uz/api/uploads/images/${category.image_src}`}
									alt={category.name_en}
									className='w-16 h-16 object-cover rounded'
								/>
							</td>
							<td className='p-2'>
								<Button
									variant='change'
									className='cursor-pointer'
									onClick={() => handleModal(category.id)}
								>
									Change
								</Button>
							</td>
							<td className='p-2'>
								<Button
									variant='destructive'
									className='cursor-pointer'
									onClick={() => deleteItems(category.id)}
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

export default Dashboard
