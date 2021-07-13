import {
    SET_VOUCHER,
    SET_USER,
    SET_PIER,
    SET_PIER_MODAL_VISIBILITY,
    SET_APP_CONFIG,
    SET_APP_ENDPOINT,
    SET_LANG
} from "./index";

export function setUser(user){
    return {
        type: SET_USER,
        user
    }
}

export function setVoucher(voucher){
    return {
        type: SET_VOUCHER,
        voucher
    }
}

export function setPier(pier){
    return {
        type: SET_PIER,
        pier
    }
}

export function setPierModalVisibility(pier_modal_visibility){
    return {
        type: SET_PIER_MODAL_VISIBILITY,
        pier_modal_visibility
    }
}

export function setAppConfig(app_config){
    return {
        type: SET_APP_CONFIG,
        app_config
    }
}

export function setAppEndpoint(app_endpoint){
    return {
        type: SET_APP_ENDPOINT,
        app_endpoint
    }
}

export function setLang(lang){
    return {
        type: SET_LANG,
        lang
    }
}