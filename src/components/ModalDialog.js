/** @format */

import React from 'react';
import ReactDOM from 'react-dom';

import './styles/Modal.css';

const ModalDialog = (props) => {
	return (
		<React.Fragment>
			{props.isOpen &&
				ReactDOM.createPortal(
					<div className='Modal'>
						<div className='Modal__container'>
							<button onClick={props.onClose} className='Modal__close-button'>
								X
							</button>
							{props.children}
						</div>
					</div>,
					document.getElementById('modal-dialog')
				)}
		</React.Fragment>
	);
};

export default ModalDialog;
