/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toast'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useLocation } from 'react-router-dom'

function Modal({ handleModal, modal, id }) {
	const token = localStorage.getItem('tokenchik')
	const [loading, setLoading] = useState(false)
	const [currentData, setCurrentData] = useState(null) // Holds current data for the modal
	const { pathname } = useLocation()
	let defaultValues

	const formSchema =
		pathname === '/dashboard'
			? z.object({
					name_en: z.string().min(1, 'Name (EN) is required'),
					name_ru: z.string().min(1, 'Name (RU) is required'),
					image_src: z.instanceof(File).or(z.string()),
			  })
			: z.object({
					title: z.string().min(1, 'Title is required'),
					image_src: z.instanceof(File).or(z.string()),
			  })

	console.log(pathname === '/dashboard')

	if (pathname === '/dashboard') {
		defaultValues = {
			name_en: '',
			name_ru: '',
			image_src: '',
		}
	} else if (pathname === '/brands') {
		defaultValues = {
			title: '',
			image_src: '',
		}
	}

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	// Update form only when `id` changes or initial data is different
	useEffect(() => {
		if (pathname === '/dashboard') {
			if (id && currentData !== id) {
				setCurrentData(id) // Store the current `id` to prevent loops
				form.reset({
					name_en: id[0]?.name_en || '',
					name_ru: id[0]?.name_ru || '',
					image_src: `https://realauto.limsa.uz/api/uploads/images/${id[0]?.image_src}`,
				})
			}
		} else if (pathname === '/brands') {
			if (id && currentData !== id) {
				setCurrentData(id) // Store the current `id` to prevent loops
				form.reset({
					title: id[0]?.title || '',
					image_src: `https://realauto.limsa.uz/api/uploads/images/${id[0]?.image_src}`,
				})
			}
		}
	}, [id, form, currentData, pathname])

	async function handleSubmit(values) {
		setLoading(true)
		try {
			const formData = new FormData()
			formData.append(
				pathname === '/dashboard' ? 'name_en' : 'title',
				pathname === '/dashboard' ? values.name_en : values.title
			)
			pathname === '/dashboard' && formData.append('name_ru', values.name_ru)

			if (values.image_src instanceof File) {
				formData.append('images', values.image_src)
			}

			const response = await fetch(
				pathname === '/dashboard'
					? id.length === 0
						? `https://realauto.limsa.uz/api/categories`
						: `https://realauto.limsa.uz/api/categories/${id[0].id}`
					: id.length === 0
					? `https://realauto.limsa.uz/api/brands`
					: `https://realauto.limsa.uz/api/brands/${id[0].id}`,
				{
					method: id.length === 0 ? 'POST' : 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			)

			const data = await response.json()

			if (response.ok) {
				toast('Category updated successfully!')
				window.location.reload()
			} else {
				toast(data.message || 'Failed to update category.')
			}
		} catch (error) {
			console.error('Error:', error)
			toast('An error occurred. Please try again.')
		} finally {
			setLoading(false)
			form.reset()
		}
	}

	return (
		<div className='w-full mx-auto'>
			<div className='h-[100vh] flex items-center justify-center'>
				<Form {...form}>
					{modal && (
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className='flex relative bg-indigo-300 border rounded-xl p-10 items-center justify-center gap-5 flex-col'
						>
							<Button
								className='absolute top-5 right-5'
								variant='destructive'
								onClick={handleModal}
							>
								Close
							</Button>
							<FormField
								name={pathname === '/dashboard' ? 'name_en' : 'title'}
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name EN</FormLabel>
										<FormControl>
											<Input
												required
												className='px-10 py-5 bg-white text-black'
												type='text'
												placeholder='Name en'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{pathname === '/dashboard' && (
								<FormField
									name='name_ru'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name RU</FormLabel>
											<FormControl>
												<Input
													required
													className='px-10 py-5 bg-white text-black'
													type='text'
													placeholder='Name ru'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<FormField
								name='image_src'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image</FormLabel>
										<FormControl>
											<Input
												required
												className='px-0 py-5 bg-white text-black'
												type='file'
												onChange={e =>
													field.onChange(e.target.files?.[0] || '')
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								className='px-28 py-6'
								type='submit'
								variant='default'
								disabled={loading}
							>
								Submit
							</Button>
						</form>
					)}
				</Form>
			</div>
		</div>
	)
}

export default Modal
