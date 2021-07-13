import { SET_LOADING } from "./index";

export function setLoading(loadingState){
    return {
        type: SET_LOADING,
        loading: loadingState
    }
}