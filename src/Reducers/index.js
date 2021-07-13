import { combineReducers } from 'redux';

// Reducers
import loaderReducer from './loaderReducer';
import navigationReducer from './navigationReducer';
import userReducer from './userReducer';
import headerReducer from './headerReducer';

let reducers = combineReducers({
    loaderState: loaderReducer,
    navigationState: navigationReducer,
    userState: userReducer,
    headerState: headerReducer
});

export default reducers;