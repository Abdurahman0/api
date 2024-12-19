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
	const [currentData, setCurrentData] = useState(null)
	const { pathname } = useLocation()

	const formSchemas = {
		'/dashboard': z.object({
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
	}

	const defaultValuesMap = {
		'/dashboard': {
			name_en: '',
			name_ru: '',
			image_src: '',
		},
		'/brands': {
			title: '',
			image_src: '',
		},
		'/cities': {
			name: '',
			text: '',
			image_src: '',
		},
		'/locations': {
			name: '',
			text: '',
			image_src: '',
		},
	}

	const fieldsMap = {
		'/dashboard': [
			{ name: 'name_en', label: 'Name EN' },
			{ name: 'name_ru', label: 'Name RU' },
		],
		'/brands': [{ name: 'title', label: 'Title' }],
		'/cities': [
			{ name: 'name', label: 'Title' },
			{ name: 'text', label: 'Text' },
		],
		'/locations': [
			{ name: 'name', name2: 'Title' },
			{ name: 'text', name2: 'Text' },
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

	async function handleSubmit(values) {
		const Data = fields.reduce((acc, field) => {
			acc[field.name] = values[field.name]
			return acc
		}, {})

		setLoading(true)
		try {
			const formData = new FormData()
			Object.entries(Data).forEach(([key, value]) => {
				formData.append(key, value)
			})
			if (values.image_src instanceof File) {
				formData.append('images', values.image_src)
			}

			const urlMap = {
				'/dashboard': 'categories',
				'/brands': 'brans',
				'/cities': 'cities',
				'/locations': 'locations',
			}

			const apiPath = urlMap[pathname]
			const res = await fetch(
				`https://realauto.limsa.uz/api/${apiPath}${
					id.length > 0 ? `/${id[0].id}` : ''
				}`,
				{
					method: id.length === 0 ? 'POST' : 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			)

			const data = await res.json()

			if (res.ok) {
				toast('Action completed successfully!')
				window.location.reload()
			} else {
				toast(data.message || 'An error occurred.')
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
								className='absolute top-1 right-3'
								variant='destructive'
								onClick={handleModal}
							>
								Close
							</Button>

							{fields.map((item, index) => {
								console.log()
								return (
									<FormField
										key={index}
										name={item.name}
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>{item.name2}</FormLabel>
												<FormControl>
													<Input
														required
														className='px-10 py-5 bg-white text-black'
														type='text'
														placeholder={item.name2}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)
							})}

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
