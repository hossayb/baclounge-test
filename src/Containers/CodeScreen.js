import React from 'react';
import { Input } from 'react-native-elements';
import {
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Alert,
    Keyboard
} from 'react-native';
import { BackBtnStyle } from '../Helpers/GlobalStyles';
import RNLink from '../Components/RN/Link';
import RNH1 from '../Components/RN/h1';
import RNText from '../Components/RN/Text';
import RNButton from '../Components/RN/Button';
import store from '../store';
import * as loaderActions from '../Actions/loaderActions';
import * as userActions from '../Actions/userActions';
import * as headerActions from '../Actions/headerActions';
import { connect } from 'react-redux';
import SoundSuccess from '../assets/sounds/success.m4a';
import SoundFailure from '../assets/sounds/failure.m4a';
import { Audio } from 'expo-av';
import compose from 'compose-function';
import { withTranslation as withNamespaces } from 'react-i18next';

class CodeScreen extends React.Component {
    state = {
        code: '',
        hasErrors: false
    };

    async _playSound(soundName) {
        try {
            const {
                sound: soundObject,
                status
            } = await Audio.Sound.createAsync(
                soundName === 'success' ? SoundSuccess : SoundFailure,
                { shouldPlay: true }
            );
        } catch (error) {
            // An error occurred!
        }
    }

    _handleSubmit() {
        const { t } = this.props;

        if (this.state.code && !this.props.isLoading) {
            Keyboard.dismiss();
            store.dispatch(loaderActions.setLoading(true));

            axios
                .get('code/' + this.state.code + '/' + this.props.pier)
                .then(response => {
                    // console.log(response.data);

                    if (response.status === 204) {
                        // Query success, no result
                        this._playSound('failure');
                        let ctx = this;

                        Alert.alert(
                            t('codeErrors:invalid:title'),
                            t('codeErrors:invalid:description'),
                            [
                                {
                                    text: t('codeErrors:invalid:button'),
                                    onPress: () => {
                                        ctx.refs['codeInput'].focus();
                                    }
                                }
                            ]
                        );
                    } else if (response.status === 202) {
                        // Query success but not sure of the result
                        this._playSound('failure');

                        Alert.alert(
                            t('codeErrors:noMatching:title'),
                            t(
                                'codeErrors:noMatching:' +
                                    response.data.error_code
                            ),
                            [
                                {
                                    text: 'OK'
                                }
                            ]
                        );
                    } else {
                        this._playSound('success');
                        store.dispatch(userActions.setUser(response.data.user));

                        const voucher = response.data;
                        delete voucher.user;
                        store.dispatch(userActions.setVoucher(voucher));

                        this.props.navigation.navigate('ThankYouScreen');
                    }
                })
                .catch(errors => {
                    console.log(errors);
                })
                .then(() => {
                    store.dispatch(loaderActions.setLoading(false));
                });
        }
    }

    componentWillUnmount() {
        store.dispatch(userActions.setUser(null));
        store.dispatch(userActions.setVoucher(null));

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        store.dispatch(headerActions.setHeaderVisibility(false));
    }

    _keyboardDidHide() {
        store.dispatch(headerActions.setHeaderVisibility(true));
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this._keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this._keyboardDidHide
        );
    }

    render() {
        const { t } = this.props;

        return (
            <KeyboardAvoidingView behavior="position">
                <RNLink
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                    icon="arrowLeftBlue"
                    iconPosition="before"
                    style={BackBtnStyle.style}
                    uppercase={1}
                    noBorder={1}
                    title={t('global:backButton')}
                ></RNLink>

                <RNH1
                    style={{ marginTop: 15 }}
                    text={t('codeScreen:title')}
                ></RNH1>

                <RNText text={t('codeScreen:description')}></RNText>

                <Input
                    autoCorrect={false}
                    shake={this.state.hasErrors ? true : false}
                    ref="codeInput"
                    onChangeText={text => this.setState({ code: text })}
                    inputStyle={{ fontSize: 50 }}
                    containerStyle={[
                        styles.container,
                        { marginRight: 50, overflow: 'hidden' }
                    ]}
                    onSubmitEditing={() => this._handleSubmit()}
                    autoCapitalize="characters"
                    labelStyle={[styles.container, { marginTop: 80 }]}
                    label={t('codeScreen:labelCode')}
                />

                <View style={{ marginTop: 50 }}>
                    <RNButton
                        disabled={!this.state.code || this.props.isLoading}
                        icon="arrowRight"
                        onPress={this._handleSubmit.bind(this)}
                        title={t('global:confirmButton')}
                    ></RNButton>
                </View>
                <View style={{ height: 60 }} />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    inputIcon: {
        position: 'absolute',
        top: -30,
        right: 20
    },
    container: {
        marginLeft: 0
    }
});

const mapStateToProps = function(store) {
    return {
        isLoading: store.loaderState.loading,
        pier: store.userState.pier
    };
};

export default compose(
    withNamespaces(['CodeScreen', 'translation']),
    connect(mapStateToProps)
)(CodeScreen);
