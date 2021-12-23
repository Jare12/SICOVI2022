/** @format */

import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
import logoTruck from '../images/mini-transporte-logo.svg';

const Navbar = () => {
	return (
		<div className='Navbar'>
			<div className='container-fluid'>
				<Link className='Navbar__brand' to='/'>
					<img className='Navbar__brand-logo' src={logoTruck} alt='logo'></img>
					<span className='font-weight-light'>SICOVI</span>
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
