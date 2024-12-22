/* eslint-disable no-unused-vars */
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
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const token = localStorage.getItem('tokenchik')

	const handleModal = id => {
		const res = models.data.filter(model => model.id === id)
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
		const confirmDelete = new Promise((resolve, reject) => {
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

		const isConfirmed = await confirmDelete
		if (!isConfirmed) {
			toast('Deletion canceled.')
			return
		}

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
			toast(
				response.status === 200 ? 'Deleted successfully' : 'Failed to delete'
			)
		} catch (err) {
			console.error(err)
			toast('An error occurred while deleting the item')
		} finally {
			getModels()
		}
	}

	// Pagination logic
	const totalPages = Math.ceil((models?.data?.length || 0) / itemsPerPage)

	// Get models for the current page
	const paginatedModels = models?.data?.slice(
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
						paginatedModels={paginatedModels}
						currentPage={currentPage}
						totalPages={totalPages}
						changePage={changePage}
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
					{paginatedModels?.map((model, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>{id + 1}</td>
							<td className='p-2'>{model.name}</td>
							<td className='p-2'>{model.brand_title}</td>
							<td className='p-2'>
								<Button
									variant='change'
									className='cursor-pointer'
									onClick={() => handleModal(model.id)}
								>
									Change
								</Button>
							</td>
							<td className='p-2'>
								<Button
									variant='destructive'
									className='cursor-pointer'
									onClick={() => deleteModels(model.id)}
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

export default Models
