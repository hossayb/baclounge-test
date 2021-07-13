import { SET_CURRENT_ROUTE_NAME } from "./index";

export function setCurrentRouteName(route){
    return {
        type: SET_CURRENT_ROUTE_NAME,
        routeName: route
    }
}