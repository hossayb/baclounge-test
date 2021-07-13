import { SET_HEADER_VISIBILITY } from '../Actions';

const initialState = {
    visible: true
};

const headerReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_HEADER_VISIBILITY:
            return {
                ...state,
                visible: action.visible
            };
        default:
            return state
    }
};

export default headerReducer;