import React from 'react';
import {View, StyleSheet, Modal, TextInput, Dimensions, AsyncStorage} from 'react-native';
import store from "../store";
import * as userActions from "../Actions/userActions";

import RNH1 from '../Components/RN/h1';
import RNButton from '../Components/RN/Button';
import RNText from '../Components/RN/Text';

import { connect } from "react-redux";
import {COLOR_PRIMARY} from "../Helpers/common";

const PIN_CODE = '2270';
// axios.defaults.baseURL

class PierPicker extends React.Component {
    state = {
        pin_code_1: '',
        pin_code_2: '',
        pin_code_3: '',
        pin_code_4: ''
    };

    _handleSubmitPier(){
        store.dispatch(userActions.setPierModalVisibility(false));
    }

    async _handleSwitchDevMode(value){
        store.dispatch(userActions.setAppEndpoint(value));
        console.log(this.props.appConfig['url_'+value]);
        axios.defaults.baseURL = this.props.appConfig['url_'+value];
        await AsyncStorage.setItem('endpoint', value);
    }

    async _handleSetPier(text){
        try{
            await AsyncStorage.setItem('pier', text);
            store.dispatch(userActions.setPier(text));
        }catch(e){
            // Error saving pier
        }
    };

    setModalVisible(visible) {
        store.dispatch(userActions.setPierModalVisibility(visible));
        this.resetPinCode();
    }

    resetPinCode(){
        this.setState({
            pin_code_1: '',
            pin_code_2: '',
            pin_code_3: '',
            pin_code_4: ''
        });
    }

    isPinCodeCorrect(){
        return this.state.pin_code_1.toString()+this.state.pin_code_2.toString()+this.state.pin_code_3.toString()+this.state.pin_code_4.toString() === PIN_CODE;
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}
                    onShow={() => { this.refs['pinCode1Input'].focus(); }}
                    onDismiss={() => this.resetPinCode()}
                    supportedOrientations={['landscape']}
                    presentationStyle={'formSheet'}>
                    <View style={styles.pierSelectorModal}>
                        <RNText onPress={() => { this.setModalVisible(false) }} text={'X'} style={{position:'absolute', top: 10, right: 10}}></RNText>
                        { !this.isPinCodeCorrect() &&
                        <View>
                            <RNH1 style={{textAlign: 'center'}} text={'Enter your code :'}></RNH1>

                            <View style={[styles.pierSelectorInputContainer, { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}>
                                <TextInput
                                    autoCorrect={false}
                                    ref="pinCode1Input"
                                    style={styles.pinCode}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                            this.setState({pin_code_1: text});
                                            this.refs['pinCode2Input'].focus();
                                        }
                                    }
                                    maxLength={1}
                                    selectTextOnFocus={true} />

                                <TextInput
                                    autoCorrect={false}
                                    ref="pinCode2Input"
                                    style={[styles.pinCode, {marginLeft: 10}]}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                            this.setState({pin_code_2: text});
                                            this.refs['pinCode3Input'].focus();
                                        }
                                    }
                                    maxLength={1}
                                    selectTextOnFocus={true} />

                                <TextInput
                                    autoCorrect={false}
                                    ref="pinCode3Input"
                                    style={[styles.pinCode, {marginLeft: 10}]}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                        this.setState({pin_code_3: text});
                                        this.refs['pinCode4Input'].focus();
                                    }
                                    }
                                    maxLength={1}
                                    selectTextOnFocus={true} />

                                <TextInput
                                    autoCorrect={false}
                                    ref="pinCode4Input"
                                    style={[styles.pinCode, {marginLeft: 10}]}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                            this.setState({pin_code_4: text});
                                        }
                                    }
                                    maxLength={1}
                                    selectTextOnFocus={true} />
                            </View>
                        </View>
                        }
                        { this.isPinCodeCorrect() &&
                            <View>
                                <RNH1 style={{textAlign: 'center'}} text={'Select a pier :'}></RNH1>

                                <View style={styles.pierSelectorInputContainer}>
                                    <TextInput
                                        autoCorrect={false}
                                        ref="pierInput"
                                        style={[styles.pinCode, {fontSize: 50}]}
                                        // onSubmitEditing={() => this._handleSubmitPier()}
                                        autoCapitalize="characters"
                                        onChangeText={(text) => this._handleSetPier(text)}
                                        value={this.props.pier}
                                        maxLength={1}
                                        selectTextOnFocus={true} />
                                </View>

                                <View style={styles.devModeContainer}>
                                    <RNText style={{textAlign: 'center', fontSize: 20}} text={'Select your development mode :'}></RNText>

                                    <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <RNText onPress={() => this._handleSwitchDevMode('dev')} style={[styles.mode, this.props.apiEndpoint === 'dev' && styles.currentMode]} text={'DEV'}></RNText>
                                        <RNText onPress={() => this._handleSwitchDevMode('prod')} style={[styles.mode, {marginLeft: 16}, this.props.apiEndpoint === 'prod' && styles.currentMode]} text={'PROD'}></RNText>
                                    </View>
                                </View>

                                <View style={{ marginTop: 50 }}>
                                    <RNButton onPress={() => { this._handleSubmitPier() }} title={'Ok'}></RNButton>
                                </View>
                            </View>
                        }
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pierSelectorModal: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        position: 'relative'
    },
    pierSelectorInputContainer: {
        marginTop: 100,
        alignItems: 'center'
    },
    pinCode: {
        fontSize: 60, width: 50, borderBottomWidth: 1, borderBottomColor: 'gray', textAlign: 'center'
    },
    devModeContainer: {
        marginTop: 50
    },
    mode: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        borderWidth: 1,
        borderColor: COLOR_PRIMARY,
        borderRadius: 4,
        color: COLOR_PRIMARY,
        letterSpacing: 2,
        overflow: 'hidden'
    },
    currentMode: {
        backgroundColor: COLOR_PRIMARY,
        color: 'white'
    }
});

const mapStateToProps = function(store){
    return {
        modalVisible: store.userState.pier_modal_visibility,
        pier: store.userState.pier,
        apiEndpoint: store.userState.app_endpoint,
        appConfig: store.userState.app_config
    }
};

export default connect(
    mapStateToProps
)(PierPicker);