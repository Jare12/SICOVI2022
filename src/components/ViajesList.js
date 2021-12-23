/** @format */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Gravatar from './Gravatar';
import './styles/BadgesList.css';
import dateFormat from 'dateformat';

function useSearchBadges(badges) {
	const [query, setQuery] = useState('');
	const [filteredBadges, setFilteredBadges] = useState(badges);

	useMemo(() => {
		const result = badges.filter((badge) => {
			return JSON.stringify(badge).toLowerCase().includes(query.toLowerCase());
		});
		setFilteredBadges(result);
	}, [badges, query]);

	return { query, setQuery, filteredBadges };
}

const ViajesList = (props) => {
	const { query, setQuery, filteredBadges } = useSearchBadges(props.badges);

	return (
		<React.Fragment>
			<div className='form-group'>
				<label htmlFor=''>Filtrar Viajes</label>
				<input
					type='text'
					className='form-control'
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
			</div>
			{filteredBadges.length === 0 ? (
				<div>
					<h3>Ningún viaje encontrado</h3>
				</div>
			) : (
				<div className='BadgesList'>
					<ul className='list-unstyled'>
						{filteredBadges.map((badge) => {
							return (
								<li key={badge.FolioGEPP}>
									<Link
										className='text-reset text-decoration-none'
										to={`/viajes/${badge.FolioGEPP}`}>
										<ViajesListItem badge={badge} />
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</React.Fragment>
	);
};

export default ViajesList;

const ViajesListItem = (props) => {
	return (
		<div className='BadgesListItem'>
			<Gravatar
				className='BadgesListItem__avatar'
				email={props.badge.FolioGEPP}
			/>

			<div>
				<strong>FolioGEPP: {props.badge.FolioGEPP}</strong>
				<br />
				FechaGeneracion:{' '}
				{dateFormat(props.badge.FechaGeneracion, 'yyyy/mm/dd HH:MM:ss')}
				<br />
				Origen: {props.badge.CartaPorte.Ubicaciones.Origen.Domicilio.Estado}
				<br />
				Destino: {props.badge.CartaPorte.Ubicaciones.Destino.Domicilio.Estado}
			</div>
		</div>
	);
};
