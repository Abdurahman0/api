/* eslint-disable react/prop-types */
import { NavLink, Outlet } from 'react-router-dom'

function Navbar({ handleLogout }) {
	return (
		<div className='w-full h-screen flex'>
			{/* Sidebar */}
			<div className='w-44 bg-blue-800 flex flex-col pt-36 gap-y-4'>
				<NavLink
					to='/categories'
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Categories</span>
				</NavLink>
				<NavLink
					to={'/brands'}
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Brands</span>
				</NavLink>
				<NavLink
					to={'/cities'}
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Cities</span>
				</NavLink>
				<NavLink
					to={'/locations'}
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Locations</span>
				</NavLink>
				<NavLink
					to={'/models'}
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Models</span>
				</NavLink>
				<NavLink
					to={'/cars'}
					className='flex items-center hover:scale-110 duration-300 transition transform border rounded-xl p-2 mx-2'
				>
					<span className='text-white text-xl'>Cars</span>
				</NavLink>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex flex-col'>
				{/* Header */}
				<div className='h-28 bg-blue-800 flex items-center justify-between px-5'>
					<div className='bg-white border rounded-full size-16' />
					<span
						onClick={handleLogout}
						className='bg-destructive border-none rounded-xl p-3 cursor-pointer hover:scale-110 duration-300 transition transform'
					>
						Logout
					</span>
				</div>

				{/* Content Area */}
				<div className='flex-1 overflow-y-auto p-1'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Navbar
