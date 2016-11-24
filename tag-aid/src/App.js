import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './saga';
import MainNav from './components/MainNav';
import Home from './containers/Home';
import About from './components/About';
import Help from './components/Help';
import Text from './containers/Text';
import reactBootstrap from 'react-bootstrap';


// stylesheets
// import bootstrapStyle from './styles/bootstrap.css';
import hiStyle  from './styles/hi-style.css';
import hiInterfaceStyle  from './styles/hi-interface.css';
import hiTagaidStyle from './styles/hi-tag-aid.css';

// import TagAid from './components/TagAid';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, undefined, compose(
  applyMiddleware(routerMiddleware(browserHistory), sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

sagaMiddleware.run(rootSaga);

const history = syncHistoryWithStore(browserHistory, store);
const App = () => (
  <div>
    <MainNav />
    <Provider store={store}>
      <Router history={history}>
        <Route path={'/'} component={Home} />
        <Route path={'/text'} component={Text} />
        <Route path={'/help'} component={Help} />
        <Route path={'/about'} component={About} />
      </Router>
    </Provider>
  </div>
);

export default App;
