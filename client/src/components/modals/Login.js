import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } 		from "react-router-dom";


import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	let history = useHistory();
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			toggleLoading(false)
			props.setShowLogin(false)
			history.push("/map");
			history.go(0);
		};
	};


	return (
		<WModal className="login-modal" cover="true" visible={props.setShowLogin}>
			<WMHeader  style={{color: "white"}} className="modal-header" onClose={() => props.setShowLogin(false)}>
				Login
			</WMHeader >

			{
				loading ? <div />
					: <WMMain className="main-login-modal">

						<WInput style={{color: "white"}} className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
						<div className="modal-spacer">&nbsp;</div>
						<WInput style={{color: "white"}} className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</WMMain >
			}
			<WMFooter>
				<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Login
				</WButton>
				<WButton className="modal-button" onClick={() => props.setShowLogin(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
		</WModal >
	);
}

export default Login;