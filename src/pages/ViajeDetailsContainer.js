/** @format */

import React, { useState, useEffect, useCallback } from 'react';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import './styles/BadgeDetails.css';
import Modal from '../components/Modal';

import cartoontruckImage from '../images/cartoon-truck.svg';
import dateFormat from 'dateformat';
import { useDropzone } from 'react-dropzone';
import api from '../apiViajes';

const ViajeDetailsContainer = (props) => {
	const [state, setState] = useState({
		loading: true,
		error: null,
		data: undefined,
	});

	const fetchData = async () => {
		setState({ ...state, loading: true, error: null });

		try {
			const storage = localStorage.getItem('lsViajes');
			const data = JSON.parse(storage);

			const result = data.find(
				({ FolioGEPP }) => FolioGEPP === props.match.params.viajeId
			);

			setState({ ...state, loading: false, data: result });
		} catch (error) {
			setState({ ...state, loading: false, error: error });
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			{state.loading && <PageLoading />}
			{state.error && <PageError />}
			{!state.loading && !state.error && <BadgeDetails state={state} />}
		</div>
	);
};

export default ViajeDetailsContainer;

const BadgeDetails = ({ state }) => {
	const [openModal, setOpenModal] = useState(false);
	const [openDialogModal, setOpenDialogModal] = useState(false);
	const [url, setUrl] = useState('');
	const [result, setResult] = useState('');
	const [files, setfiles] = useState([]);
	const handleChange = (e) => {
		setUrl(e.target.value);
	};

	const handleClick = (e) => {
		setOpenModal(true);

		if (files.length > 0) {
			setResult('Los archivos seleccionados serán enviados');
		} else {
			setResult('No se seleccionaron archivos para enviar');
		}
	};

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		setfiles(acceptedFiles);
		//send alert for each file rejected
		fileRejections.forEach((rejection) => {
			alert(
				'Archivo:' +
					rejection.file.name +
					' rechazado por exceder máximo de archivos permitidos.'
			);
		});
	}, []);

	const { getInputProps, getRootProps } = useDropzone({
		onDrop,
		accept: '.xml,.pdf,.json',
		maxFiles: 2,
	});

	return (
		<React.Fragment>
			<div className='BadgeDetails__hero'>
				<div className='container'>
					<div className='row'>
						<div className='col-3'>
							<img src={cartoontruckImage} alt='Logo del transporte' />
						</div>
						<div className='col-8 BadgeDetails__hero-attendant-name'>
							<h1>FolioGEPP: {state.data.FolioGEPP}</h1>
							<h1>
								Fecha:{' '}
								{dateFormat(state.data.FechaGeneracion, 'yyyy/mm/dd HH:MM:ss')}
							</h1>
						</div>
					</div>
					<div id='uri-row' className='row'>
						<div className='col-6'></div>
						<div className='col-1'></div>
						<div className='col-5'>
							<input
								id='uri-input'
								className='form-control'
								placeholder='URL: https://www.example.com'
								type='text'
								onChange={handleChange}
								value={url}></input>
						</div>
						<br></br>
					</div>

					<div className='row'>
						<div className='col-md-7'></div>
						<div className='col-md-5'>
							<div>
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<p>
										Arrastra y suelta tus archivos o haz click aquí para
										seleccionarlos.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-md-7'></div>
						<div className='col-md-5'>
							<ul className='lista-derecha'>
								{files.map((file) => (
									<li key={file.path}>{file.path}</li>
								))}
							</ul>
						</div>
					</div>
					<div className='row'>
						<div className='col-md-7'></div>
						<div className='col-md-5'>
							{(files.length > 0 || url.length > 0) && (
								<button
									id='btn-guardar'
									type='submit'
									className='btn btn-success'
									onClick={handleClick}>
									Guardar{' '}
								</button>
							)}
							<ConfirmModal
								openModal={openModal}
								setOpenModal={setOpenModal}
								files={files}
								url={url}
								folio={state.data.FolioGEPP}
								openDialogModal={openDialogModal}
								setOpenDialogModal={setOpenDialogModal}
								result={result}
								setResult={setResult}
							/>
							<DialogModal
								openDialogModal={openDialogModal}
								setOpenDialogModal={setOpenDialogModal}
								result={result}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='container'>
				<div className='row'>
					<div className='col-md-4'>
						<form id='containerJson' className='BadgesListItem'>
							<br></br>
							<pre>{JSON.stringify(state.data, null, 2)}</pre>
						</form>
					</div>

					<div className='col-md-8'>
						<h1>╔ Detalles del viaje ╗</h1>
						<form className='BadgesListItem'>
							<div className='form-group col-md-3'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Folio</label>
										<label className='small-text'>(FolioGepp)</label>
									</div>
									<div className='col-md-5'>
										<input
											value={state.data.FolioGEPP}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
									<div className='col-md-1'></div>
								</div>
							</div>

							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-4 colpadLef'>
										<label>Fecha</label>
										<label className='small-text'>(FechaGeneracion)</label>
									</div>
									<div className='col-md-7'>
										<input
											value={dateFormat(
												state.data.FechaGeneracion,
												'yyyy/mm/dd HH:MM:ss'
											)}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
									<div className='col-md-1'></div>
								</div>
							</div>

							<div className='form-group col-md-4'>
								<div className='row'>
									<div className='col-md-4 colpadLef'>
										<label>CFDI</label>
										<label className='small-text'>(Uso CFDI)</label>
									</div>
									<div className='col-md-7'>
										<input
											value={state.data.UsoCFDI}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
									<div className='col-md-1'></div>
								</div>
							</div>
						</form>
						<br />
						<h1>╔ Carta Porte ╗</h1>
						<form className='BadgesListItem'>
							<div className='form-group col-md-3'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Versión</label>
										<label className='small-text'>(version)</label>
									</div>
									<div className='col-md-5'>
										<input
											value={state.data.CartaPorte.Version}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
									<div className='col-md-1'></div>
								</div>
							</div>

							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Transporte internacional </label>
										<label className='small-text'>(TranspInternac)</label>
									</div>

									<div className='col-md-7'>
										<input
											value={state.data.CartaPorte.TranspInternac}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
									<div className='col-md-1'></div>
								</div>
							</div>

							<div className='form-group col-md-4'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Distancia recorrida:</label>
										<label className='small-text'>(TotalDistRec)</label>
									</div>
									<div className='col-md-8'>
										<input
											value={state.data.CartaPorte.TotalDistRec}
											readOnly
											className='form-control'
											type='text'></input>
									</div>
								</div>
							</div>
						</form>

						<form className='BadgesListItem'>
							<div className='form-group'>
								<div className='row'>
									<div className='col-md-6'>
										<h5>═Ubicación Origen═</h5>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Tipo ubicación &nbsp;</label>
													<label className='small-text'>(TipoUbicacion)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen
																.TipoUbicacion
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Id ubicación &nbsp;</label>
													<label className='small-text'>(IDUbicacion)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen
																.IDUbicacion
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>RFC remitente &nbsp;</label>
													<label className='small-text'>
														(RFCRemitenteDestinatario)
													</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen
																.RFCRemitenteDestinatario
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Fecha/Hora salida &nbsp;</label>
													<label className='small-text'>
														(FechaHoraSalidaLlegada)
													</label>
												</div>
												<div className='col-md-6'>
													<input
														value={dateFormat(
															state.data.CartaPorte.Ubicaciones.Origen
																.FechaHoraSalidaLlegada,
															'yyyy/mm/dd HH:MM:ss'
														)}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código Estado &nbsp;</label>
													<label className='small-text'>(Estado)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen.Domicilio
																.Estado
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código País &nbsp;</label>
													<label className='small-text'>(Pais)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen.Domicilio
																.Pais
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código Postal &nbsp;</label>
													<label className='small-text'>(CodigoPostal)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Origen.Domicilio
																.CodigoPostal
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
									</div>

									<div className='col-md-6'>
										<h5>═Ubicación Destino═</h5>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Tipo ubicación &nbsp;</label>
													<label className='small-text'>(TipoUbicacion)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.TipoUbicacion
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Id ubicación &nbsp;</label>
													<label className='small-text'>(IDUbicacion)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.IDUbicacion
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>RFC destinatario &nbsp;</label>
													<label className='small-text'>
														(RFCRemitenteDestinatario)
													</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.RFCRemitenteDestinatario
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Fecha/Hora llegada</label>
													<label className='small-text'>
														(FechaHoraSalidaLlegada)
													</label>
												</div>
												<div className='col-md-6'>
													<input
														value={dateFormat(
															state.data.CartaPorte.Ubicaciones.Destino
																.FechaHoraSalidaLlegada,
															'yyyy/mm/dd HH:MM:ss'
														)}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código Estado &nbsp;</label>
													<label className='small-text'>(Estado)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.Domicilio.Estado
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>

										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código País &nbsp;</label>
													<label className='small-text'>(Pais)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.Domicilio.Pais
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
										<div className='form-group'>
											<div className='row'>
												<div className='col-md-6'>
													<label>Código Postal &nbsp;</label>
													<label className='small-text'>(CodigoPostal)</label>
												</div>
												<div className='col-md-6'>
													<input
														value={
															state.data.CartaPorte.Ubicaciones.Destino
																.Domicilio.CodigoPostal
														}
														className='form-control'
														readOnly
														type='text'></input>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
						<br />
						<h1>╔ Mercancías ╗</h1>
						<form className='BadgesListItem'>
							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Peso bruto</label>
										<label className='small-text'>(PesoBrutoTotal)</label>
									</div>
									<div className='col-md-8'>
										<input
											value={state.data.CartaPorte.Mercancias.PesoBrutoTotal}
											className='form-control'
											readOnly
											type='text'></input>
									</div>
								</div>
							</div>

							<div className='form-group col-md-2'></div>

							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Unidad</label>
										<label className='small-text'>(UnidadPeso)</label>
									</div>
									<div className='col-md-8'>
										<input
											value={state.data.CartaPorte.Mercancias.UnidadPeso}
											className='form-control'
											readOnly
											type='text'></input>
									</div>
								</div>
							</div>
						</form>
						<form className='BadgesListItem'>
							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-4'>
										<label>Peso neto</label>
										<label className='small-text'>(PesoNetoTotal)</label>
									</div>
									<div className='col-md-8'>
										<input
											value={state.data.CartaPorte.Mercancias.PesoNetoTotal}
											className='form-control'
											readOnly
											type='text'></input>
									</div>
								</div>
							</div>

							<div className='form-group col-md-2'></div>

							<div className='form-group col-md-5'>
								<div className='row'>
									<div className='col-md-6'>
										<label>No. de mercancías</label>
										<label className='small-text'>(NumTotalMercancias)</label>
									</div>
									<div className='col-md-6'>
										<input
											value={
												state.data.CartaPorte.Mercancias.NumTotalMercancias
											}
											className='form-control'
											readOnly
											type='text'></input>
									</div>
								</div>
							</div>
						</form>
						<form className='BadgesListItem'>
							<div className='form-group col-md-12'>
								<table id='tabla-mercancias' className='table table-bordered'>
									<thead className='thead-dark'>
										<tr>
											<th scope='col'>
												<label>Bienes transporte &nbsp;</label>
												<label className='small-text'>(BienesTransp)</label>
											</th>
											<th scope='col'>
												<label>Descripción &nbsp;</label>
												<label className='small-text'>(Descripcion)</label>
											</th>
											<th scope='col'>
												<label>Cantidad &nbsp;</label>
												<label className='small-text'>(Cantidad)</label>
											</th>
											<th scope='col'>
												<label>Clave unidad &nbsp;</label>
												<label className='small-text'>(ClaveUnidad)</label>
											</th>
											<th scope='col'>
												<label>Unidad &nbsp;</label>
												<label className='small-text'>(Unidad)</label>
											</th>
											<th scope='col'>
												<label>Peso Kg &nbsp;</label>
												<label className='small-text'>(PesoEnKg)</label>
											</th>
										</tr>
									</thead>

									<tbody>
										{state.data.CartaPorte.Mercancias.Lista.map((mercancia) => {
											return (
												<tr id={mercancia.ClaveUnidad}>
													<th scope='row'>{mercancia.BienesTransp}</th>
													<td>{mercancia.Descripcion}</td>
													<td>{mercancia.Cantidad}</td>
													<td>{mercancia.ClaveUnidad}</td>
													<td>{mercancia.Unidad}</td>
													<td>{mercancia.PesoEnKg}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</form>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const ConfirmModal = ({
	openModal,
	setOpenModal,
	files,
	url,
	folio,
	openDialogModal,
	setOpenDialogModal,
	result,
	setResult,
}) => {
	const handleClick = async (e) => {
		try {
			let listFiles = [];
			for (let i = 0; i < files.length; i++) {
				listFiles.push({
					name: files[i].name,
					array: await readFileAsync(files[i]),
				});
			}

			const data = await api.viajes.encripcion(listFiles, url);
			const response = await api.viajes.confirmar(data, folio);

			setOpenModal(false);

			let resultDialog = '';
			if (response.codigoError === '00') {
				resultDialog = 'La operación fue realizada con éxito';
			} else {
				resultDialog =
					'La operación obtuvo la siguiente respuesta: ' +
					response.mensajeError;
			}

			setResult(resultDialog);
			setOpenDialogModal(true);
		} catch (error) {
			setOpenModal(false);
		}
	};

	function readFileAsync(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = function (event) {
				var arrayBuffer = event.target.result;
				var bytes = new Uint8Array(arrayBuffer);
				resolve(bytes);
			};
			reader.onerror = (error) => reject(error);

			reader.readAsArrayBuffer(file);
		});
	}

	return (
		<Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
			<div className='DeleteBadgeModal'>
				<h1>¿Estas seguro de guardar el viaje?</h1>
				<p>{result}</p>
				<div>
					<button onClick={handleClick} className='btn btn-primary mr-4'>
						Confirmar
					</button>
					<button
						onClick={() => setOpenModal(false)}
						className='btn btn-danger button-margin'>
						Cancelar
					</button>
				</div>
			</div>
		</Modal>
	);
};

const DialogModal = ({ openDialogModal, setOpenDialogModal, result }) => {
	const handleClick = async (e) => {
		setOpenDialogModal(false);

		window.location.href = '/viajes';
	};

	return (
		<Modal isOpen={openDialogModal} onClose={handleClick}>
			<div className='DeleteBadgeModal'>
				<h1>Guardar Viaje</h1>
				<p>{result}</p>
			</div>
		</Modal>
	);
};
