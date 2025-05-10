import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	Bars3Icon,
	XMarkIcon,
	ArrowRightOnRectangleIcon,
	UserPlusIcon,
	ArrowLeftOnRectangleIcon,
	PhotoIcon,
	UsersIcon,
	CalendarIcon,
	CloudArrowUpIcon,
	Squares2X2Icon,
} from '@heroicons/react/24/outline';

const Header = () => {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const navItemClass =
		'flex items-center text-gray-700 hover:text-green-700 font-medium transition !no-underline';

	return (
		<header className='sticky top-0 z-50 bg-white shadow-md'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center py-2'>
					{/* Brand */}
					<Link
						to='/'
						className='flex items-center gap-2 !no-underline text-green-700 text-2xl font-bold hover:scale-105 transform transition'
						aria-label='Home'>
						<PhotoIcon className='w-7 h-6' />
						Post Generator
					</Link>

					{/* Mobile Menu Toggle */}
					<button
						className='md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition'
						onClick={() => setMenuOpen(prev => !prev)}
						aria-label='Toggle navigation'>
						{menuOpen ? (
							<XMarkIcon className='w-8 h-8 text-green-700' />
						) : (
							<Bars3Icon className='w-8 h-8 text-green-700' />
						)}
					</button>

					{/* Navigation Items */}
					<div
						className={`${
							menuOpen ? 'block bg-white' : 'hidden'
						} absolute md:relative top-16 md:top-0 mt-2 left-0 w-full md:w-auto md:bg-transparent shadow-md md:shadow-none rounded-b-lg md:rounded-none md:flex md:items-center z-40`}>
						<ul className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-4 md:p-0 w-full md:w-auto'>
							{isAuthenticated && (
								<>
									<li>
										<Link
											to='/dashboard'
											className={navItemClass}>
											<Squares2X2Icon className='w-5 h-5 mr-1' />
											Dashboard
										</Link>
									</li>
									<li>
										<Link
											to='/posterList'
											className={navItemClass}>
											<PhotoIcon className='w-5 h-5 mr-1' />
											Posters
										</Link>
									</li>
									{/* <li>
										<Link
											to='/schedulelist'
											className={navItemClass}>
											<PhotoIcon className='w-5 h-5 mr-1' />
											ScheduList
										</Link>
									</li> */}
									<li>
										<Link
											to='/customersList'
											className={navItemClass}>
											<UsersIcon className='w-5 h-5 mr-1' />
											Customers List
										</Link>
									</li>
									<li>
										<Link
											to='/customers'
											className={navItemClass}>
											<UserPlusIcon className='w-5 h-5 mr-1' />
											Add Customer
										</Link>
									</li>
									<li>
										<Link
											to='/upload'
											className={navItemClass}>
											<CloudArrowUpIcon className='w-5 h-5 mr-1' />
											Upload Poster
										</Link>
									</li>
									<li>
										<Link
											to='/schedule'
											className={navItemClass}>
											<CalendarIcon className='w-5 h-5 mr-1' />
											Schedule
										</Link>
									</li>
								</>
							)}
						</ul>

						{/* Auth Buttons */}
						<div className='flex flex-col md:flex-row gap-2 md:gap-4 p-4 md:p-0 w-full md:w-auto'>
							{!isAuthenticated ? (
								<>
									<Link
										to='/login'
										className='w-full md:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center gap-1'>
										<ArrowRightOnRectangleIcon className='w-5 h-5' />
										Sign In
									</Link>
									<Link
										to='/register'
										className='w-full md:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 border border-green-500 rounded-lg shadow hover:bg-green-200 transition flex items-center justify-center gap-1'>
										<UserPlusIcon className='w-5 h-5' />
										Sign Up
									</Link>
								</>
							) : (
								<button
									onClick={() => {
										setMenuOpen(false);
										handleLogout();
									}}
									className='w-full md:w-auto px-4 py-2 text-sm bg-red-100 text-red-700 border border-red-400 rounded hover:bg-red-200 transition flex items-center justify-center gap-1'>
									<ArrowLeftOnRectangleIcon className='w-5 h-5' />
									Logout
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
