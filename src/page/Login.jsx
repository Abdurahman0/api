/* eslint-disable no-unused-vars */
import * as z from 'zod'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form.jsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'

const formSchema = z.object({
	number: z.string().min(5),
	password: z.string().min(5),
})

function Login() {
	const token = localStorage.getItem('tokenchik')

	useEffect(() => {
		if (token) {
			navigate('/categories')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [loading, setloading] = useState(false)
	const navigate = useNavigate()
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			number: '',
			password: '',
		},
	})

	async function handleSubmit(values) {
		setloading(true) // Start loading
		try {
			const response = await fetch(
				'https://realauto.limsa.uz/api/auth/signin',
				{
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
					},
					body: JSON.stringify({
						phone_number: values.number,
						password: values.password,
					}),
				}
			)

			const data = await response.json()

			if (data?.data?.tokens?.accessToken?.token) {
				localStorage.setItem('tokenchik', data.data.tokens.accessToken.token)

				// Navigate to the main page after successfully saving the token
				navigate('/categories')
			} else {
				toast('Login failed. Please check your credentials.')
			}
		} catch (error) {
			toast('An error occurred. Please try again later.')
		} finally {
			setloading(false) // Stop loading
		}
	}

	return (
		<div className='w-full mx-auto'>
			<div className='h-[100vh] flex items-center justify-center'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='flex bg-indigo-300 border rounded-xl p-10 items-center justify-center gap-5 flex-col'
					>
						<FormField
							name='number'
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Number</FormLabel>
										<FormControl>
											<Input
												required
												className='px-10 py-5 bg-white'
												type='text'
												placeholder='Number'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)
							}}
							control={form.control}
						/>
						<FormField
							name='password'
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												required
												className='px-10 py-5 bg-white'
												type='text'
												placeholder='Password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)
							}}
							control={form.control}
						/>

						<Button
							className='px-28 py-6'
							type='submit'
							variant={'default'}
							disabled={loading}
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default Login
