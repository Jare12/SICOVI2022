/** @format */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Viajes from './pages/Viajes';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ViajeDetailsContainer from './pages/ViajeDetailsContainer';
function App() {
	return (
		<Router>
			<Layout>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route
						exact
						path='/viajes/:viajeId'
						component={ViajeDetailsContainer}
					/>
					<Route exact path='/viajes' component={Viajes} />
					<Route component={NotFound} />
				</Switch>
			</Layout>
		</Router>
	);
}

export default App;
