import React from 'react'
import './App.css'
import { isMobile } from 'react-device-detect'
import Main from './components/Main'

/**
 * use arrow functions for functional components and
 * use normal functions for function defining.
 */

const App = () => {
	if (isMobile) {
		return (
			<p>
				Sorry, but
				&nbsp;
				<b>Eorg</b>
				&nbsp;
				haven&#39;t supported to Mobile, please open it on PC.
			</p>
		)
	}

	return (
		<div className="App">
			<Main />
		</div>
	)
}

export default App
