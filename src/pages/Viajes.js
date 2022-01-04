/** @format */

import React, { useState, useEffect } from 'react';
import BadgesList from '../components/ViajesList';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import MiniLoader from '../components/MiniLoader';
import api from '../apiViajes';
import './styles/Badges.css';
import TruckLogo from '../images/cartoon-truck-header.svg';
import { VjeModel } from '../model/VjeModel';
import { MciaModel } from '../model/MciaModel';
import { useLocalStorage } from '../useLocalStorage';

const Viajes = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	//const [intervalId, setIntervalID] = useState();
	const [storage, setStorage] = useLocalStorage('lsViajes', '');

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const datos = await api.viajes.list();

			let listVijajes = [];

			datos.forEach((element) => {
				const vje = new VjeModel();
				if (element[0].OC !== undefined) {
					vje.OC = element[0].OC;
				}
				vje.FolioGEPP = element[0].FolioGEPP;
				vje.FechaGeneracion = element[0].FechaGeneracion;
				vje.UsoCFDI = element[0].UsoCFDI;
				vje.CartaPorte.Version = element[1].CartaPorte.Version;
				vje.CartaPorte.TranspInternac = element[1].CartaPorte.TranspInternac;
				vje.CartaPorte.TotalDistRec = element[1].CartaPorte.TotalDistRec;
				vje.CartaPorte.Ubicaciones.Origen.TipoUbicacion =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].TipoUbicacion;
				vje.CartaPorte.Ubicaciones.Origen.IDUbicacion =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].IDUbicacion;
				vje.CartaPorte.Ubicaciones.Origen.RFCRemitenteDestinatario =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].RFCRemitenteDestinatario;
				vje.CartaPorte.Ubicaciones.Origen.FechaHoraSalidaLlegada =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].FechaHoraSalidaLlegada;
				vje.CartaPorte.Ubicaciones.Origen.Domicilio.Estado =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].Domicilio.Estado;
				vje.CartaPorte.Ubicaciones.Origen.Domicilio.Pais =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].Domicilio.Pais;
				vje.CartaPorte.Ubicaciones.Origen.Domicilio.CodigoPostal =
					element[1].CartaPorte.Ubicaciones.Ubicacion[0].Domicilio.CodigoPostal;

				vje.CartaPorte.Ubicaciones.Destino.TipoUbicacion =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].TipoUbicacion;
				vje.CartaPorte.Ubicaciones.Destino.IDUbicacion =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].IDUbicacion;
				vje.CartaPorte.Ubicaciones.Destino.RFCRemitenteDestinatario =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].RFCRemitenteDestinatario;
				vje.CartaPorte.Ubicaciones.Destino.FechaHoraSalidaLlegada =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].FechaHoraSalidaLlegada;
				vje.CartaPorte.Ubicaciones.Destino.Domicilio.Estado =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].Domicilio.Estado;
				vje.CartaPorte.Ubicaciones.Destino.Domicilio.Pais =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].Domicilio.Pais;
				vje.CartaPorte.Ubicaciones.Destino.Domicilio.CodigoPostal =
					element[1].CartaPorte.Ubicaciones.Ubicacion[1].Domicilio.CodigoPostal;

				vje.CartaPorte.Mercancias.PesoBrutoTotal =
					element[1].CartaPorte.Mercancias.PesoBrutoTotal;
				vje.CartaPorte.Mercancias.UnidadPeso =
					element[1].CartaPorte.Mercancias.UnidadPeso;
				vje.CartaPorte.Mercancias.PesoNetoTotal =
					element[1].CartaPorte.Mercancias.PesoNetoTotal;
				vje.CartaPorte.Mercancias.NumTotalMercancias =
					element[1].CartaPorte.Mercancias.NumTotalMercancias;

				let mercancias = [];
				element[1].CartaPorte.Mercancias.Mercancia.forEach((merc) => {
					let merca = new MciaModel();
					merca.BienesTransp = merc.BienesTransp;
					merca.Descripcion = merc.Descripcion;
					merca.Cantidad = merc.Cantidad;
					merca.ClaveUnidad = merc.ClaveUnidad;
					merca.Unidad = merc.Unidad;
					merca.PesoEnKg = merc.PesoEnKg;
					mercancias.push(merca);
				});

				vje.CartaPorte.Mercancias.Lista = mercancias;

				listVijajes.push(vje);
			});

			setStorage(listVijajes);
			setData(listVijajes);

			setLoading(false);
			setError(null);
		} catch (error) {
			setLoading(false);
			setError(error);
		}
	};

	useEffect(() => {
		fetchData();
		//const interv = setInterval(fetchData, 50000);
		//setIntervalID(interv);
		//return function cleanup() {
		//	clearInterval(intervalId);
		//};
	}, []);

	return (
		<React.Fragment>
			{loading && !data ? (
				<PageLoading />
			) : (
				<>
					{error ? (
						<PageError error={error} />
					) : (
						<>
							<div className='Badges'>
								<div className='Badges__hero'>
									<div className='Badges__container'>
										<img
											className='Badges__conf-logo'
											src={TruckLogo}
											alt='Truck Logo'
										/>
									</div>
								</div>
							</div>
							<div className='Badge__container'>
								<div className='Badges__list'>
									<div className='Badges__container'>
										<BadgesList badges={data} />
										{loading && <MiniLoader />}
									</div>
								</div>
							</div>
						</>
					)}
				</>
			)}
		</React.Fragment>
	);
};

export default Viajes;
