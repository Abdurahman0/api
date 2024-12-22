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
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = categories.data.filter(category => category.id === id)
		setElement(res)
		setModal(!modal)
	}

	const deleteItems = async id => {
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
				`https://realauto.limsa.uz/api/categories/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			if (response.ok) {
				toast.success('Deleted successfully')
			} else {
				toast.error('Failed to delete item.')
			}
		} catch (error) {
			toast.error('Error in deleting category:', error.message)
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

	// Pagination logic
	const totalPages = Math.ceil((categories?.data?.length || 0) / itemsPerPage)

	// Get categories for the current page
	const paginatedCategories = categories?.data?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	// Change page
	const changePage = newPage => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	// Fetch data when the component mounts
	useEffect(() => {
		getCategories()
	}, [])

	return (
		<div className={`w-full h-full bg-gray-700 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Categories</h1>
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
					<tr className='bg-blue-950 text-white text-center'>
						<th className='p-2'>ID</th>
						<th className='p-2'>Name (EN)</th>
						<th className='p-2'>Name (RU)</th>
						<th className='p-2'>Image</th>
						<th className='bg-green-950 p-2'>Change</th>
						<th className='bg-red-950 p-2'>Warning</th>
					</tr>
				</thead>
				<tbody>
					{paginatedCategories?.map((category, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>
								{(currentPage - 1) * itemsPerPage + id + 1}
							</td>
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

export default Dashboard
