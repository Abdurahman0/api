/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom'

function Navbar({ handleLogout }) {
	return (
		<div className='w-full mx-auto h-full'>
			<div className='h-28 bg-blue-800'>
				<div className='flex ml-14 h-full items-center justify-between px-5'>
					<div className='bg-white border rounded-full size-16' />
					<span
						onClick={handleLogout} // Call handleLogout on click
						className='bg-destructive border-none rounded-xl p-3 cursor-pointer hover:scale-105 hover:font-bold duration-300 transition transform'
					>
						Logout
					</span>
				</div>
			</div>
			<div className='-mt-28 h-screen flex w-44 bg-blue-800'>
				<div className='flex flex-col ml-6 pt-36 gap-y-4'>
					<NavLink
						to='/dashboard'
						className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2'
					>
						<span className='text-white text-xl'>Dashboard</span>
					</NavLink>
					<NavLink
						to='/categories'
						className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2'
					>
						<span className='text-white text-xl'>Categories</span>
					</NavLink>
					<NavLink className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2'>
						<span className='text-white text-xl'>Brands</span>
					</NavLink>
					<NavLink className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2'>
						<span className='text-white text-xl'>Models</span>
					</NavLink>
					<NavLink className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2'>
						<span className='text-white text-xl'>Places</span>
					</NavLink>
				</div>
			</div>
		</div>
	)
}

export default Navbar
