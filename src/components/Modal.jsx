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

const Modal = ({
	handleModal,
	modal,
	id,
	brands,
	models,
	cities,
	categories,
	locations,
}) => {
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
		'/cars': z.object({
			brand_id: z.string().min(1, 'Brand is required'),
			model_id: z.string().min(3, 'Model is required'),
			city_id: z.string().min(3, 'City is required'),
			color: z.string().min(3, 'Color is required'),
			images: z.instanceof(File).or(z.string()).optional(),
			year: z.coerce.number().min(3, 'Year is required'),
			seconds: z.coerce.number().min(1, 'Seconds is required'),
			category_id: z.string().min(3, 'Category is required'),
			max_speed: z.coerce.number().min(1, 'Max speed is required'),
			max_people: z.coerce.number().min(1, 'Max people is required'),
			transmission: z.string().min(3, 'Transmission is required'),
			motor: z.string().min(3, 'Motor is required'),
			drive_side: z.string().min(3, 'Drive side is required'),
			petrol: z.string().min(3, 'Petrol is required'),
			limitperday: z.coerce.number().min(1, 'Limit per day is required'),
			deposit: z.coerce.number().min(1, 'Deposit is required'),
			premium_protection: z.coerce
				.number()
				.min(1, 'Premium protection is required'),
			price_in_aed: z.coerce.number().min(1, 'Price in AED is required'),
			price_in_usd: z.coerce.number().min(1, 'Price in USD is required'),
			price_in_aed_sale: z.coerce
				.number()
				.min(1, 'Price in AED sale is required'),
			price_in_usd_sale: z.coerce
				.number()
				.min(1, 'Price in USD sale is required'),
			location_id: z.string().min(3, 'Location is required'),
			inclusive: z.string().optional(),
			cover: z.instanceof(File).or(z.string()).optional(),
		}),
	}

	// Default values for each route
	const defaultValuesMap = {
		'/categories': { name_en: '', name_ru: '', image_src: '' },
		'/brands': { title: '', image_src: '' },
		'/cities': { name: '', text: '', image_src: '' },
		'/locations': { name: '', text: '', image_src: '' },
		'/models': { name: '', brand_id: '' },
		'/cars': {
			brand_id: '',
			model_id: '',
			city_id: '',
			color: '',
			year: '',
			seconds: '',
			category_id: '',
			images: '',
			images2: '',
			max_speed: '',
			max_people: '',
			transmission: '',
			motor: '',
			drive_side: '',
			petrol: '',
			limitperday: '',
			deposit: '',
			premium_protection: '',
			price_in_aed: '',
			price_in_usd: '',
			price_in_aed_sale: '',
			price_in_usd_sale: '',
			location_id: '',
			inclusive: '',
			cover: '',
		},
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
		'/cars': [
			{ name: 'brand_id', label: 'Brand', type: 'string' },
			{ name: 'model_id', label: 'Model', type: 'string' },
			{ name: 'city_id', label: 'City', type: 'string' },
			{ name: 'color', label: 'Color', type: 'string' },
			{ name: 'year', label: 'Year', type: 'number' },
			{ name: 'seconds', label: 'Seconds', type: 'number' },
			{ name: 'category_id', label: 'Category', type: 'string' },
			{ name: 'max_speed', label: 'Max speed', type: 'number' },
			{ name: 'max_people', label: 'Max people', type: 'number' },
			{ name: 'transmission', label: 'Transmission', type: 'string' },
			{ name: 'motor', label: 'Motor', type: 'string' },
			{ name: 'drive_side', label: 'Drive side', type: 'string' },
			{ name: 'petrol', label: 'Petrol', type: 'string' },
			{ name: 'limitperday', label: 'Limit per day', type: 'number' },
			{ name: 'deposit', label: 'Deposit', type: 'number' },
			{
				name: 'premium_protection',
				label: 'Premium protection',
				type: 'number',
			},
			{ name: 'price_in_aed', label: 'Price in AED', type: 'number' },
			{ name: 'price_in_usd', label: 'Price in USD', type: 'number' },
			{ name: 'price_in_aed_sale', label: 'Price in AED sale', type: 'number' },
			{ name: 'price_in_usd_sale', label: 'Price in USD sale', type: 'number' },
			{ name: 'location_id', label: 'Location', type: 'string' },
			{ name: 'inclusive', label: 'Inclusive', type: 'string' },
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

	const submit = values => {
		console.log('Submit called with values:', values)
		handleSubmit(values)
	}

	const handleSubmit = async values => {
		console.log('Submitting values:', values)
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
				'/cars': 'cars',
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
							onSubmit={form.handleSubmit(submit)}
							className={`flex gap-5 p-10 relative bg-indigo-300 border rounded-xl ${
								pathname === '/cars' ? `grid grid-cols-5` : 'flex-col'
							}`}
						>
							<Button
								className='absolute top-3 right-3'
								variant='destructive'
								onClick={handleModal}
							>
								Close
							</Button>
							{fields.map(({ name, label, type }) => (
								<FormField
									key={name}
									name={name}
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{label}</FormLabel>
											<FormControl>
												{name === 'inclusive' ? (
													// Special case: render the 'incursive' field as a Select
													<Select
														onValueChange={value => form.setValue(name, value)} // Set the value for 'incursive'
													>
														<SelectTrigger className='w-full bg-white text-black'>
															<SelectValue placeholder='Select Inclusive' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='true'>True</SelectItem>
															<SelectItem value='false'>False</SelectItem>
														</SelectContent>
													</Select>
												) : [
														'brand_id',
														'model_id',
														'city_id',
														'category_id',
														'location_id',
												  ].includes(name) ? (
													<Select
														onValueChange={value => form.setValue(name, value)} // Dynamically set the value for 'brand_id', 'model_id', or 'city_id'
													>
														<SelectTrigger className='w-full bg-white text-black'>
															<SelectValue
																placeholder={
																	name === 'brand_id'
																		? 'Choose a Brand'
																		: name === 'model_id'
																		? 'Choose a Model'
																		: name === 'category_id'
																		? 'Select Category'
																		: name === 'location_id'
																		? 'Select Location'
																		: 'Choose a City'
																}
															/>
														</SelectTrigger>
														<SelectContent>
															{(name === 'brand_id'
																? brands
																: name === 'model_id'
																? models
																: name === 'category_id'
																? categories
																: name === 'location_id'
																? locations
																: cities
															)?.map(item => (
																<SelectItem
																	key={item.id}
																	value={String(item.id)}
																>
																	{name === 'brand_id'
																		? item.title
																		: name === 'model_id'
																		? item.name
																		: name === 'category_id'
																		? item.name_en
																		: item.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<Input
														type={type}
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

							{pathname !== '/models' && pathname !== '/cars' && (
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

							{pathname === '/cars' && (
								<>
									<FormField
										name='images'
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
									<FormField
										name='images'
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
									<FormField
										name='cover'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Cover Image</FormLabel>
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
								</>
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
