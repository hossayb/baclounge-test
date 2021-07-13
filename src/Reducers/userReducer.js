import {SET_VOUCHER, SET_USER, SET_PIER, SET_PIER_MODAL_VISIBILITY, SET_APP_CONFIG, SET_APP_ENDPOINT, SET_LANG} from '../Actions';

const initialState = {
    user: null,
    voucher: null,
    pier: 'A',
    pier_modal_visibility: false,
    app_config: {},
    app_endpoint: 'prod',
    lang: 'en'
};

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_VOUCHER:
            return {
                ...state,
                voucher: action.voucher
            };
        case SET_USER:
            return {
                ...state,
                user: action.user
            };
        case SET_PIER_MODAL_VISIBILITY:
            return {
                ...state,
                pier_modal_visibility: action.pier_modal_visibility
            };
        case SET_PIER:
            return {
                ...state,
                pier: action.pier
            };
        case SET_APP_CONFIG:
            return {
                ... state,
                app_config: action.app_config
            };
        case SET_APP_ENDPOINT:
            return {
                ... state,
                app_endpoint: action.app_endpoint
            };
        case SET_LANG:
            return {
                ... state,
                lang: action.lang
            };
        default:
            return state
    }
};

export default userReducer;