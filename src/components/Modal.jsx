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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

const Modal = ({ handleModal, modal, id, brands }) => {
	const token = localStorage.getItem('tokenchik')
	const [loading, setLoading] = useState(false)
	const [currentData, setCurrentData] = useState(null)
	const { pathname } = useLocation()

	// Schema mappings for different routes
	const formSchemas = {
		'/categories': z.object({
			name_en: z.string().min(1, 'Name (EN) is required'),
			name_ru: z.string().min(1, 'Name (RU) is required'),
			image_src: z.instanceof(File).or(z.string()),
		}),
		'/brands': z.object({
			title: z.string().min(1, 'Title is required'),
			image_src: z.instanceof(File).or(z.string()),
		}),
		'/cities': z.object({
			name: z.string().min(3, 'Title is required'),
			text: z.string().min(7, 'Text is required'),
			image_src: z.instanceof(File).or(z.string()),
		}),
		'/locations': z.object({
			name: z.string().min(3, 'Title is required'),
			text: z.string().min(7, 'Text is required'),
			image_src: z.instanceof(File).or(z.string()),
		}),
		'/models': z.object({
			name: z.string().min(3, 'Name is required'),
			brand_id: z.string().min(1, 'Brand is required'),
		}),
	}

	// Default values for each route
	const defaultValuesMap = {
		'/categories': { name_en: '', name_ru: '', image_src: '' },
		'/brands': { title: '', image_src: '' },
		'/cities': { name: '', text: '', image_src: '' },
		'/locations': { name: '', text: '', image_src: '' },
		'/models': { name: '', brand_id: '' },
	}

	// Fields for form rendering
	const fieldsMap = {
		'/categories': [
			{ name: 'name_en', label: 'Name EN' },
			{ name: 'name_ru', label: 'Name RU' },
		],
		'/brands': [{ name: 'title', label: 'Title' }],
		'/cities': [
			{ name: 'name', label: 'Title' },
			{ name: 'text', label: 'Text' },
		],
		'/locations': [
			{ name: 'name', label: 'Title' },
			{ name: 'text', label: 'Text' },
		],
		'/models': [
			{ name: 'name', label: 'Name' },
			{ name: 'brand_id', label: 'Brand' },
		],
	}

	const formSchema = formSchemas[pathname]
	const defaultValues = defaultValuesMap[pathname] || {}
	const fields = fieldsMap[pathname] || []

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	useEffect(() => {
		if (id && currentData !== id) {
			setCurrentData(id)
			form.reset({
				...id[0],
				image_src: id[0]?.image_src
					? `https://realauto.limsa.uz/api/uploads/images/${id[0].image_src}`
					: '',
			})
		}
	}, [id, form, currentData])

	const handleSubmit = async values => {
		setLoading(true)

		try {
			const formData = new FormData()

			// Handle fields dynamically
			Object.entries(values).forEach(([key, value]) => {
				if (key === 'image_src') {
					if (value instanceof File) {
						formData.append('images', value)
					} else if (typeof value === 'string' && value) {
						formData.append('images', value)
					}
				} else {
					formData.append(key, value instanceof File ? value : String(value))
				}
			})

			const urlMap = {
				'/categories': 'categories',
				'/brands': 'brands',
				'/cities': 'cities',
				'/locations': 'locations',
				'/models': 'models',
			}

			const apiPath = urlMap[pathname]
			const requestUrl = `https://realauto.limsa.uz/api/${apiPath}${
				id && id.length > 0 ? `/${id[0].id}` : ''
			}`

			const method = id && id.length > 0 ? 'PUT' : 'POST'

			const res = await fetch(requestUrl, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			})

			const data = await res.json()

			if (res.ok) {
				toast('Action completed successfully!')
				handleModal()
				window.location.reload()
			} else {
				toast(data.message || 'An error occurred.')
			}
		} catch (error) {
			console.error('Error:', error)
			toast('An error occurred. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-full mx-auto'>
			<div className='h-[100vh] flex items-center justify-center'>
				<Form {...form}>
					{modal && (
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className='flex flex-col gap-5 p-10 relative bg-indigo-300 border rounded-xl'
						>
							<Button
								className='absolute top-3 right-3'
								variant='destructive'
								onClick={handleModal}
							>
								Close
							</Button>
							{fields.map(({ name, label }) => (
								<FormField
									key={name}
									name={name}
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{label}</FormLabel>
											<FormControl>
												{name === 'brand_id' ? (
													<Select
														onValueChange={value =>
															form.setValue('brand_id', value)
														}
													>
														<FormLabel>Select Brand</FormLabel>
														<SelectTrigger className='w-full bg-black'>
															<SelectValue placeholder='Choose a Brand' />
														</SelectTrigger>
														<SelectContent>
															{brands.map(brand => (
																<SelectItem
																	key={brand.id}
																	value={String(brand.id)}
																>
																	{brand.title}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<Input
														required
														className='px-4 py-2 bg-white text-black'
														placeholder={label}
														{...field}
													/>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

							{pathname !== '/models' && (
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
							)}

							<Button
								className='px-10 py-4'
								type='submit'
								variant='default'
								disabled={loading}
							>
								{loading ? 'Submitting...' : 'Submit'}
							</Button>
						</form>
					)}
				</Form>
			</div>
		</div>
	)
}

export default Modal
