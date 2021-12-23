/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './styles/Home.css';
import transporteLogoImage from '../images/transporte-logo.svg';
import cartoontruckImage from '../images/cartoon-truck.svg';

export default class Home extends Component {
	render() {
		return (
			<div className='Home'>
				<div className='container'>
					<div className='row'>
						<div className='Home__col col-12 col-md-4'>
							<img
								src={transporteLogoImage}
								alt='Transporte Logo'
								className='img-fluid mb-2'
							/>

							<h1>
								Sistema de Control <br /> de Viajes{' '}
							</h1>
							<Link className='btn btn-primary' to='/viajes'>
								Comenzar
							</Link>
						</div>

						<div className='Home__col d-none d-md-block col-md-8'>
							<img
								src={cartoontruckImage}
								alt='truck'
								className='img-fluid p-4'
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
