/** @format */

async function callApiViajes(endpoint, options = {}) {
	options.headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};

	const response = await fetch(
		//'/DEV-WSCartaPorte/rest/service/verViajes?wsUser=GEPP_CP&numProveedor=30-03-1161',
		'/WSCartaPorte/rest/service/verViajes?wsUser=GEPP_CP&numProveedor=30-03-1161',
		options
	);
	const data = await response.json();

	// Require the core node modules.
	const crypto = require('crypto');

	// Generated using java utility.
	const encryptkeyB64 = 'I1jCNMZouQav5x7b8RrurQ==';

	//get the b64 value from the Json response
	let encryptValB64 = data.zipBase64;

	// Takes the values as a binary / buffer values
	let binaryEncryptKeyB64 = Buffer.from(encryptkeyB64, 'base64');
	let binaryEncryptVal = Buffer.from(encryptValB64, 'base64');

	// When creating the cipher in Node, we have to make sure we use the exact same
	// algorithm. In this case, we're using the "AES"
	// (Advanced Encryption Standard) with an "ECB" (Electronic codebook).The message is divided into blocks, and each block is encrypted separately.
	// and 128-bit key.
	let decipherAES128 = crypto.createDecipheriv(
		'AES-128-ECB',
		binaryEncryptKeyB64,
		''
	);

	// When decrypting we're converting the base64 input to UTF-8 output.
	let decryptValB64 = decipherAES128.update(binaryEncryptVal, 'base64', 'utf8');
	decryptValB64 += decipherAES128.final('utf8');

	//buffer from base64
	let bufferFileZip = Buffer.from(decryptValB64, 'base64');

	let AdmZip = require('adm-zip');

	//create zip
	let zipFile = new AdmZip(bufferFileZip);

	//get zip entries
	let zipFileEntries = zipFile.getEntries();

	let listVijajes = [];

	zipFileEntries.forEach((entry) => {
		listVijajes.push(JSON.parse(zipFile.readAsText(entry)));
	});

	// Output the all the values, including an input / output
	// Node.js to see if the encrypted values match.
	console.log('zipBase64: ', data.zipBase64);
	console.log('decryptValB64: ', decryptValB64);
	console.log('entriesFileZip:' + zipFileEntries.length);

	return listVijajes;
}

async function encripcion(listFiles, files, url) {
	//extract B64 from dataurl

	let bufferData = null;
	if (listFiles.length > 0) {
		let base64Data = listFiles[0].toString().split(',')[1];
		bufferData = Buffer.from(base64Data, 'base64');
	}

	const crypto = require('crypto');
	const encryptkeyB64 = 'I1jCNMZouQav5x7b8RrurQ==';
	// Takes the values as a binary / buffer values
	let binaryEncryptKeyB64 = Buffer.from(encryptkeyB64, 'base64');
	// When creating the cipher in Node, we have to make sure we use the exact same
	// algorithm and inputs that we used in ColdFusion. In this case, we're using the "AES"
	// (Advanced Encryption Standard) with an "CBC" (Cipher Block Chaining) feedback mode
	// and 128-bit key.
	let cipher = crypto.createCipheriv('AES-128-ECB', binaryEncryptKeyB64, '');

	// When encrypting, we're converting the UTF-8 input to base64 output.
	let encryptedUrl = '';
	if (url.length > 0) {
		encryptedUrl =
			cipher.update(url, 'utf8', 'base64') + cipher.final('base64');
	}

	//convert bufferadata to binary data
	//let binaryData = Buffer.from(listFiles[0]);

	let encoded64 = '';
	if (bufferData != null && bufferData.length > 0) {
		let encryptedZip = cipher.update(bufferData, 'binary');
		encryptedZip += cipher.final('base64');
		encoded64 = Buffer.from(encryptedZip, 'binary').toString('base64');
	}

	let encriptData = {
		encryptedZip: encoded64,
		encryptedUrl: encryptedUrl,
	};

	console.log('encriptData: ', encriptData);

	return encriptData;
}

async function confirmar(encriptData, folio, options = {}) {
	options.method = 'POST';
	options.headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};
	options.body = JSON.stringify({
		usuarioGEPP: 'GEPP_CP',
		numProveedor: '30-03-1161',
		OC: folio,
		numViaje: folio,
		codigoError: '00',
		mensajeError: 'SIN ERROR',
		urlDocumentos: encriptData.encryptedUrl,
		zipBase64: encriptData.encryptedZip,
	});

	const response = await fetch(
		'/WSCartaPorte/rest/service/recepcionCartaPorte',
		options
	);
	const data = await response.json();
	console.log('data: ', data);

	return data;
}

const api = {
	viajes: {
		list() {
			return callApiViajes('/viajes');
		},
		encripcion(listFiles, files, url) {
			return encripcion(listFiles, files, url);
		},
		confirmar(encriptData, folio) {
			return confirmar(encriptData, folio);
		},
	},
};

export default api;
