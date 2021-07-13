import React from 'react';
import Container from './src/Containers';

window.btoa = require('Base64').btoa;
const LANDSCAPE = 'LANDSCAPE';
const PORTRAIT = 'PORTRAIT';

import { Provider } from 'react-redux';
import store from './src/store';
import * as userActions from './src/Actions/userActions';
import axios from "axios/index";
import {AsyncStorage} from "react-native";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            doneFetchingAppData: false,
            endpoint: 'prod'
        };

        this._retrieveEndpoint();
    }

    _retrieveEndpoint = async () => {
        try {
            const value = await AsyncStorage.getItem('endpoint');

            if (value !== null) {
                store.dispatch(userActions.setAppEndpoint(value));
                this.setState({endpoint: value});
            }else{
                store.dispatch(userActions.setAppEndpoint('prod'));
                this.setState({endpoint: 'prod'});
            }
        } catch (error) {
            store.dispatch(userActions.setAppEndpoint('prod'));
            this.setState({endpoint: 'prod'});
        }
    };

    componentDidMount(){
        fetch('https://s3.eu-central-1.amazonaws.com/various-storage/bac_app_config.json', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).then((response) => {
            return response.json();
        }).then(responseJson => {
            const ctx = this;
            store.dispatch(userActions.setAppConfig(responseJson));
            console.log(responseJson['url_'+ctx.state.endpoint]);

            window.axios = axios.create({
                // url_prod, url_dev, url_local
                baseURL: responseJson['url_'+ctx.state.endpoint],
                auth: {
                    username: 'FvrhjZPTzLBhgi4HIQaL',
                    password: 'ErgMvgXx'
                }
            });

            this.setState({doneFetchingAppData: true});
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Container></Container>
            </Provider>
        );
    }
}