import { SET_HEADER_VISIBILITY } from "./index";

export function setHeaderVisibility(status){
    return {
        type: SET_HEADER_VISIBILITY,
        visible: status
    }
}