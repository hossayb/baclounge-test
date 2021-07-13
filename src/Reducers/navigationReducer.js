import { SET_CURRENT_ROUTE_NAME } from '../Actions';

const initialState = {
    currentRoute: ''
};

const navigationReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_CURRENT_ROUTE_NAME:
            return {
                ...state,
                routeName: action.routeName
            };
        default:
            return state
    }
};

export default navigationReducer;