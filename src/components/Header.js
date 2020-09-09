import React from 'react'

const Header = ({ logOut }) => {
	return (
		<button type="submit" onClick={logOut}>Logout</button>
	)
}

export default Header
