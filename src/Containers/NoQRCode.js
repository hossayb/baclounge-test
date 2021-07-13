import React from 'react';
import {
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Alert,
    Keyboard
} from 'react-native';
import RNLink from '../Components/RN/Link';
import RNH1 from '../Components/RN/h1';
import RNText from '../Components/RN/Text';
import RNButton from '../Components/RN/Button';
import { BackBtnStyle } from '../Helpers/GlobalStyles';
import { Input } from 'react-native-elements';
import store from '../store';
import * as loaderActions from '../Actions/loaderActions';
import * as headerActions from '../Actions/headerActions';
import { withTranslation as withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import compose from 'compose-function';

export class NoQRCode extends React.Component {
    state = {
        email: '',
        hasErrors: false
    };

    _handleSubmit() {
        const { t } = this.props;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.setState(
            { hasErrors: !re.test(String(this.state.email).toLowerCase()) },
            () => {
                Keyboard.dismiss();

                if (!this.state.hasErrors) {
                    store.dispatch(loaderActions.setLoading(true));

                    axios
                        .post('forgot-code', {
                            email: this.state.email,
                            lang: this.props.lang
                        })
                        .then(response => {
                            console.log(response.data);
                            let ctx = this;

                            if (response.status === 202) {
                                Alert.alert(
                                    t('NoQRCodeScreen:noTicketsLeft'),
                                    response.data.message,
                                    [
                                        {
                                            text: 'Ok !'
                                        }
                                    ]
                                );
                            } else {
                                Alert.alert(
                                    t('NoQRCodeScreen:emailSent:title'),
                                    t('NoQRCodeScreen:emailSent:description', {
                                        email: ctx.state.email
                                    }),
                                    [
                                        {
                                            text: 'Ok !',
                                            onPress: () => {
                                                ctx.props.navigation.navigate(
                                                    'CodeScreen'
                                                );
                                            }
                                        }
                                    ]
                                );
                            }
                        })
                        .catch(errors => {
                            console.log(errors.data);
                        })
                        .then(() => {
                            store.dispatch(loaderActions.setLoading(false));
                        });
                }
            }
        );
    }

    _handlePressQRCode() {
        this.props.navigation.navigate('QRCodeScanner');
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

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
                    text={t('NoQRCodeScreen:title')}
                ></RNH1>

                <RNText text={t('NoQRCodeScreen:intro')}></RNText>

                <Input
                    labelStyle={styles.container}
                    label={t('NoQRCodeScreen:labelEmail')}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    shake={this.state.hasErrors ? true : false}
                    ref="emailInput"
                    onChangeText={text => this.setState({ email: text })}
                    onSubmitEditing={() => this._handleSubmit()}
                    containerStyle={[
                        styles.container,
                        { marginRight: 50, overflow: 'hidden' }
                    ]}
                    errorMessage={
                        this.state.hasErrors
                            ? t('NoQRCodeScreen:errorEmail')
                            : ''
                    }
                    errorStyle={[styles.container, { paddingTop: 5 }]}
                />

                <View style={{ marginTop: 50 }}>
                    <RNButton
                        icon="arrowRight"
                        onPress={this._handleSubmit.bind(this)}
                        title={t('global:confirmButton')}
                    ></RNButton>
                </View>

                <View style={{ marginTop: 20 }}>
                    <RNLink
                        page="Homepage"
                        onPress={this._handlePressQRCode.bind(this)}
                        align="center"
                        style={{ fontSize: 21 }}
                        title={t('NoQRCodeScreen:labelUseQRCode')}
                    ></RNLink>
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
        lang: store.userState.lang
    };
};

export default compose(
    withNamespaces(['NoQRCode', 'translation']),
    connect(mapStateToProps)
)(NoQRCode);
