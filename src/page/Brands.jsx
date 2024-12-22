import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

function Brands() {
	const [brands, setBrands] = useState([])
	const [modal, setModal] = useState(false)
	const [element, setElement] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const token = localStorage.getItem('tokenchik')

	// Handle modal
	const handleModal = id => {
		const res = brands.data.filter(brand => brand.id === id)
		setElement(res)
		setModal(!modal)
	}

	// Fetch brands
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

	// Delete a brand
	const deleteBrands = async id => {
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
				`https://realauto.limsa.uz/api/brands/${id}`,
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
			getBrands()
		}
	}

	// Calculate total pages and slice the data for pagination
	const totalPages = Math.ceil((brands?.data?.length || 0) / itemsPerPage)

	// Get brands for the current page
	const paginatedBrands = brands?.data?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	// Change page
	const changePage = newPage => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	// Fetch brands on component mount
	useEffect(() => {
		getBrands()
	}, [])

	return (
		<div className={`w-full h-full bg-gray-700 text-white p-4`}>
			<div className='flex justify-between items-center py-3'>
				<h1 className='text-3xl font-bold'>Brands</h1>
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
					<Modal id={element} modal={modal} handleModal={handleModal} />
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
					{paginatedBrands?.map((brand, id) => (
						<tr key={id} className='border-b text-center'>
							<td className='p-2'>
								{(currentPage - 1) * itemsPerPage + id + 1}
							</td>
							<td className='p-2'>{brand.title}</td>
							<td className='p-2 flex justify-center items-center'>
								<img
									src={`https://realauto.limsa.uz/api/uploads/images/${brand.image_src}`}
									alt={brand.title}
									className='w-16 h-16 object-cover rounded'
								/>
							</td>
							<td className='p-2'>
								<Button
									variant='change'
									className='cursor-pointer'
									onClick={() => handleModal(brand.id)}
								>
									Change
								</Button>
							</td>
							<td className='p-2'>
								<Button
									variant='destructive'
									className='cursor-pointer'
									onClick={() => deleteBrands(brand.id)}
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

export default Brands
