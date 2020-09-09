import React from 'react'
import Auth from './Auth'
import RichTextEditor from './RichTextEditor'
import Header from './Header'
import baseUrl from './baseUrl/baseUrl'

const Main = () => {
	const [login, setLogin] = React.useState(false)
	const [store, setStore] = React.useState(null)

	React.useEffect(() => {
		storeCollector()
		console.log('login', login)
	}, [login])

	function storeCollector() {
		const localStore = JSON.parse(localStorage.getItem('login'))

		if (localStore && localStore.login) {
			setLogin(true)
			setStore(localStore)
		} else {
			setLogin(false)
			setStore(null)
		}
	}

	function logOut() {
		fetch(`${baseUrl}users/logout`, {
			method: 'GET',
		})
			.then(() => {
				localStorage.removeItem('login')
				storeCollector()
			})
	}

	const Editor = () => (
		<div>
			<Header logOut={logOut} />
			<RichTextEditor store={store} />
		</div>
	)

	return (
		<div>
			{
				!login ? <Auth props={storeCollector} /> : <Editor />
			}
		</div>
	)
}

export default Main
