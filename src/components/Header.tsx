import React from 'react'
import {
	Nav, NavItem, Button,
	Modal, ModalHeader, ModalBody,
} from 'reactstrap'
import { baseUrl } from './baseUrl'

// @ts-expect-error ts-migrate(7031) FIXME: Binding element 'storeCollector' implicitly has an... Remove this comment to see the full error message
const Header = ({ storeCollector, isLogIn }) => {
	const [username, setUsername] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [response, setResponse] = React.useState('')
	const [tips, setTips] = React.useState('tips')
	const [signUpModal, setSignUpModal] = React.useState(false)
	const [logInModal, setLogInModal] = React.useState(false)

	function toggleSignUp() {
		setSignUpModal(!signUpModal)
	}

	function toggleLogIn() {
		setLogInModal(!logInModal)
	}

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
						if (result.success === true) {
							setResponse(result.status)
							setTips('tips success')
							setTimeout(() => setTips('tips-fade'), 3000)
						} else {
							setResponse(result.err.message)
							setTips('tips error')
							setTimeout(() => setTips('tips-fade'), 3000)
						}
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
						if (result.success === true) {
							setResponse(result.status)
							setTips('tips success')
							setTimeout(() => setTips('tips-fade'), 3000)
							localStorage.setItem('login', JSON.stringify({
								login: true,
								token: result.token,
							}))
							storeCollector()
						} else {
							setResponse(result.err.message)
							setTips('tips error')
							setTimeout(() => setTips('tips-fade'), 3000)
						}
					})
			})
	}

	function logOut() {
		fetch(`${baseUrl}users/logout`, {
			method: 'GET',
		})
			.then(() => {
				localStorage.removeItem('login')
				storeCollector()
				setResponse('Logout Successful!')
				setTips('tips success')
				setTimeout(() => setTips('tips-fade'), 3000)
			})
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
	function handleSignUp(evt) {
		signUp()
		toggleSignUp()
		evt.preventDefault()
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
	function handleLogIn(evt) {
		logIn()
		toggleLogIn()
		evt.preventDefault()
	}

	return (
		<div className="Header">
			<span className={tips}>{response}</span>
			<Nav className="ml-auto" navbar>
				<NavItem>
					{ !isLogIn
						?										(
							<div>
								<Button outline color="secondary" onClick={toggleLogIn}>
									LogIn
								</Button>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<Button outline color="secondary" onClick={toggleSignUp}>
									SignUp
								</Button>
							</div>
						)
						:										(
							<div>
								<div className="navbar-text mr-3">
									{username}
								</div>
								<Button outline color="secondary" onClick={logOut}>
									LogOut
								</Button>
							</div>
						)}
				</NavItem>
			</Nav>
			<Modal isOpen={signUpModal} toggle={toggleSignUp} size="sm">
				<ModalHeader toggle={toggleSignUp}>SignUp</ModalHeader>
				<ModalBody>
					<div>
						username&nbsp;&nbsp;
						<input
							type="text"
							onChange={
								(event) => setUsername(event.target.value)
							}
						/>
						<br />
						<br />
						password&nbsp;&nbsp;
						<input
							type="password"
							onChange={
								(event) => setPassword(event.target.value)
							}
						/>
						<br />
						<br />
						<Button type="submit" value="submit" color="secondary" onClick={handleSignUp}>
							SignUp
						</Button>
					</div>
				</ModalBody>
			</Modal>
			<Modal isOpen={logInModal} toggle={toggleLogIn} size="sm">
				<ModalHeader toggle={toggleLogIn}>LogIn</ModalHeader>
				<ModalBody>
					<div>
						username&nbsp;&nbsp;
						<input type="text" onChange={(event) => setUsername(event.target.value)} />
						<br />
						<br />
						password&nbsp;&nbsp;
						<input type="password" onChange={(event) => setPassword(event.target.value)} />
						<br />
						<br />
						<Button type="submit" value="submit" color="secondary" onClick={handleLogIn}>
							LogIn
						</Button>
					</div>
				</ModalBody>
			</Modal>
		</div>
	)
}

export default Header
