import React from 'react'
import baseUrl from './baseUrl/baseUrl'

const Auth = ({ props }) => {
	const [username, setUsername] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [response, setResponse] = React.useState(false)

	function signUp() {
		const state = {
			username, password,
		}
		fetch(`${baseUrl}users/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(state),
		})
			.then((res) => {
				res.json()
					.then((result) => {
						console.log('result', result)
						setResponse(result.status)
						console.log('state.response: ', response)
					})
			})
	}

	function logIn() {
		const state = {
			username, password,
		}
		fetch(`${baseUrl}users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(state),
		})
			.then((res) => {
				res.json()
					.then((result) => {
						console.log('result', result)
						if (result.success === true) {
							setResponse(result.status)
							console.log('state.response: ', response)
							localStorage.setItem('login', JSON.stringify({
								login: true,
								token: result.token,
							}))
							props()
						} else {
							alert(result.err.message)
						}
					})
			})
	}

	return (
		<div>
			<div>
				<input
					type="text"
					onChange={
						(event) => setUsername(event.target.value)
					}
				/>
				<br />
				<br />
				<input
					type="password"
					onChange={
						(event) => setPassword(event.target.value)
					}
				/>
				<br />
				<br />
				<button type="submit" onClick={signUp}>Signup</button>
			</div>
			<br />
			<br />
			<div>
				<input type="text" onChange={(event) => setUsername(event.target.value)} />
				<br />
				<br />
				<input type="password" onChange={(event) => setPassword(event.target.value)} />
				<br />
				<br />
				<button type="submit" onClick={logIn}>Login</button>
			</div>
		</div>
	)
}

export default Auth
