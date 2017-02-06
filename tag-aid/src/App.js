import React from 'react';
import { Provider } from 'react-redux';
import persistState from 'redux-localstorage'
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './saga';
import Layout from './components/Layout';
import Home from './containers/Home';
import About from './components/About';
import Help from './components/Help';
import Text from './containers/Text';

// stylesheets
// import bootstrapStyle from './styles/bootstrap.css';
import './styles/hi-style.css';
import './styles/hi-interface.css';
import './styles/hi-tag-aid.css';


// import TagAid from './components/TagAid';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, undefined, compose(
  applyMiddleware(routerMiddleware(browserHistory), sagaMiddleware),
  persistState(undefined, {
    slicer : paths => {
      return (state) => {
        let subset = { selectedText : { filters : { sliders : state.selectedText.filters.sliders}}}
        return subset
      }
    }
  }),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

sagaMiddleware.run(rootSaga);

const history = syncHistoryWithStore(browserHistory, store);
const App = () => (
  <div>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={Layout}>
          <IndexRoute component={Home} />
          <Route path={'/text/:textId'} component={Text} />
          <Route path={'/help'} component={Help} />
          <Route path={'/about'} component={About} />
        </Route>
      </Router>
    </Provider>
  </div>
);

export default App;
