/** @format */
export class VjeModel {
	constructor() {
		this.FolioGEPP = '';
		this.FechaGeneracion = '';
		this.UsoCFDI = '';
		this.OC = '';
		this.CartaPorte = {
			Version: '',
			TranspInternac: '',
			TotalDistRec: '',
			Ubicaciones: {
				Origen: {
					TipoUbicacion: '',
					IDUbicacion: '',
					RFCRemitenteDestinatario: '',
					FechaHoraSalidaLlegada: '',
					Domicilio: {
						Estado: '',
						Pais: '',
						CodigoPostal: '',
					},
				},
				Destino: {
					TipoUbicacion: '',
					IDUbicacion: '',
					RFCRemitenteDestinatario: '',
					FechaHoraSalidaLlegada: '',
					Domicilio: {
						Estado: '',
						Pais: '',
						CodigoPostal: '',
					},
				},
			},
			Mercancias: {
				PesoBrutoTotal: '',
				UnidadPeso: '',
				PesoNetoTotal: '',
				NumTotalMercancias: '',
				Lista: [],
			},
		};
	}
}
