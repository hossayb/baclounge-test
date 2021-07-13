import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { BackBtnStyle } from '../Helpers/GlobalStyles';
import RNLink from '../Components/RN/Link';
import store from '../store';
import * as userActions from '../Actions/userActions';
import * as loaderActions from '../Actions/loaderActions';
import { connect } from 'react-redux';
import SoundSuccess from '../assets/sounds/success.m4a';
import SoundFailure from '../assets/sounds/failure.m4a';
import { Audio } from 'expo-av';
import { withTranslation as withNamespaces } from 'react-i18next';
import compose from 'compose-function';

const LANDSCAPE = 'LANDSCAPE';
const PORTRAIT = 'PORTRAIT';

class QRCodeScanner extends React.Component {
    state = {
        hasCameraPermission: null,
        readyToScan: true
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

    componentDidMount() {
        this._requestCameraPermission();
    }

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted'
        });
    };

    _handleBarCodeRead = result => {
        const { t } = this.props;

        if (this.state.readyToScan) {
            this.setState({ readyToScan: false });
            store.dispatch(loaderActions.setLoading(true));

            axios
                .get('code/' + result.data + '/' + this.props.pier)
                .then(response => {
                    console.log(response.data);

                    let ctx = this;
                    if (response.status === 204) {
                        // Query success, no result
                        this._playSound('failure');

                        Alert.alert(
                            t('codeErrors:invalid:title'),
                            t('codeErrors:invalid:description'),
                            [
                                {
                                    text: t('codeErrors:invalid:button'),
                                    onPress: () => {
                                        ctx.setState({ readyToScan: true });
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
                                    text: 'OK',
                                    onPress: () => {
                                        ctx.setState({ readyToScan: true });
                                    }
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
    };

    render() {
        const { t } = this.props;

        return (
            <View>
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

                <View style={styles.container}>
                    <Text style={{ marginBottom: 16 }}>
                        {t('qrCodeScreen:description')}
                    </Text>
                    {this.state.hasCameraPermission === null ? (
                        <Text>Requesting for camera permission</Text>
                    ) : this.state.hasCameraPermission === false ? (
                        <Text>
                            Camera permission is not granted. Go in the device's
                            settings to enable the camera on this application.
                        </Text>
                    ) : (
                        <BarCodeScanner
                            torchMode="on"
                            onBarCodeScanned={this._handleBarCodeRead}
                            style={{ height: 500, width: 500 }}
                            type="front"
                        />
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = function(store) {
    return {
        isLoading: store.loaderState.loading,
        pier: store.userState.pier
    };
};

export default compose(
    withNamespaces(['QRCodeScanner', 'translation']),
    connect(mapStateToProps)
)(QRCodeScanner);
