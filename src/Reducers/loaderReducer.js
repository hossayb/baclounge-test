import { SET_LOADING } from '../Actions';

const initialState = {
    loading: false
};

const loaderReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        default:
            return state
    }
};

export default loaderReducer;