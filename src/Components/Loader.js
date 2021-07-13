import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as loaderActions from "../Actions/loaderActions";
import store from '../store';
import Fade from '../Components/Animations/Fade';
import {COLOR_PRIMARY} from "../Helpers/common";

class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        }
    }

    _handleHideLoader(){
        this.setState({visible: false});

        setTimeout(function(){
            store.dispatch(loaderActions.setLoading(false));
        }, 250);
    }

    render() {
        return (
            <Fade visible={this.state.visible} style={styles.loaderContainer}>
                <TouchableOpacity style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={this._handleHideLoader.bind(this)}>
                    <View style={styles.loaderWrapper}>
                        <ActivityIndicator size="large" color={COLOR_PRIMARY}></ActivityIndicator>
                    </View>
                </TouchableOpacity>
            </Fade>
        );
    }
}

const styles = StyleSheet.create({
    loaderContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1000
    },
    loaderWrapper: {
        paddingTop: 60,
        paddingBottom: 60,
        paddingLeft: 60,
        paddingRight: 60,
        borderRadius: 100,
        borderColor: COLOR_PRIMARY,
        borderWidth: 5,
        backgroundColor: 'rgba(255,255,255,.85)'
    },
    loader: {
        color: 'black'
    }
});

const mapStateToProps = function(store){
    return {
        isLoading: store.loaderState.loading
    }
};

export default connect(
    mapStateToProps
)(Loader);