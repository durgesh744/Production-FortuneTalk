import appReducer from '../reducer/root';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga/rootSaga';
import { configureStore } from '@reduxjs/toolkit';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: appReducer,
  middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(rootSaga)

export default store;



