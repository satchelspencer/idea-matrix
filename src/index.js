import 'react-hot-loader/patch'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './redux/store';

function render() {
	const App = require('./app').default;
	ReactDOM.render(
		<Provider store={store}>
			<App/>
		</Provider>,
		document.getElementById('root')
	);
}
render();

if(module.hot) module.hot.accept('./app', () => {
	setTimeout(() => {
		ReactDOM.unmountComponentAtNode(document.getElementById('root'));
		render();
	});
});