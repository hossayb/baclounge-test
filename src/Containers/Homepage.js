import React from 'react';
import { View } from 'react-native';
import RNText from '../Components/RN/Text';
import RNH1 from '../Components/RN/h1';
import RNButton from '../Components/RN/Button';
import RNLink from '../Components/RN/Link';
import { withTranslation as withNamespaces } from 'react-i18next';

class Homepage extends React.Component {
    _handlePressQRCode() {
        this.props.navigation.navigate('QRCodeScanner');
    }

    _handlePressCode() {
        // store.dispatch(loaderActions.setLoading(true));
        this.props.navigation.navigate('CodeScreen');
    }

    _handlePressNoCode() {
        this.props.navigation.navigate('NoQRCode');
    }

    render() {
        const { t } = this.props;

        return (
            <View>
                <RNH1 text={t('home:title')}></RNH1>

                <RNText text={t('home:intro')}></RNText>

                <View style={{ marginTop: 50 }}>
                    <RNButton
                        icon="arrowRight"
                        onPress={this._handlePressQRCode.bind(this)}
                        title={t('home:btnQRCode')}
                    ></RNButton>
                    <View style={{ marginTop: 10 }}>
                        <RNButton
                            icon="arrowRight"
                            onPress={this._handlePressCode.bind(this)}
                            title={t('home:btnCode')}
                        ></RNButton>
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <RNLink
                        onPress={this._handlePressNoCode.bind(this)}
                        align="center"
                        style={{ fontSize: 21 }}
                        title={t('home:btnNoCode')}
                    ></RNLink>
                </View>
            </View>
        );
    }
}

export default withNamespaces(['Homepage', 'translation'])(Homepage);
