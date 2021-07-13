import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    Dimensions,
    AsyncStorage,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';

import Homepage from '../Containers/Homepage';
import NoQRCode from '../Containers/NoQRCode';
import QRCodeScanner from '../Containers/QRCodeScanner';
import QuantityScreen from '../Containers/QuantityScreen';
import ThankYouScreen from '../Containers/ThankYouScreen';
import CodeScreen from '../Containers/CodeScreen';
import LanguagePicker from '../Components/LanguagePicker';
import PierPicker from '../Components/PierPicker';
import RNText from '../Components/RN/Text';

import { GutterStyle, GridStyle } from '../Helpers/GlobalStyles';
import Loader from '../Components/Loader';
import { connect } from 'react-redux';
import store from '../store';
import * as navigationActions from '../Actions/navigationActions';

import { createStackNavigator } from 'react-navigation-stack';

import { withTranslation as translate } from 'react-i18next';
import * as userActions from '../Actions/userActions';
import { createAppContainer } from 'react-navigation';

const LANDSCAPE = 'LANDSCAPE';
const PORTRAIT = 'PORTRAIT';

const routes = createStackNavigator(
    {
        Homepage,
        NoQRCode,
        QRCodeScanner,
        QuantityScreen,
        ThankYouScreen,
        CodeScreen
    },
    {
        initialRouteName: 'Homepage',
        headerMode: 'none',
        cardStyle: {
            shadowOpacity: 0,
            backgroundColor: 'transparent'
        },
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent'
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
                const width = layout.initWidth;

                return {
                    opacity: position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0, 1, 0]
                    }),
                    transform: [
                        {
                            translateX: position.interpolate({
                                inputRange: [index - 1, index, index + 1],
                                outputRange: [width, 0, -width]
                            })
                        }
                    ]
                };
            }
        })
    }
);

const RootStack = createAppContainer(routes);

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

const WrappedStack = ({ t }) => {
    return (
        <RootStack
            screenProps={{ t }}
            onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getCurrentRouteName(currentState);

                store.dispatch(
                    navigationActions.setCurrentRouteName(currentScreen)
                );
            }}
        />
    );
};

const ReloadAppOnLanguageChange = translate('translation', {
    bindI18n: 'languageChanged',
    bindStore: false
})(WrappedStack);

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            screen: Dimensions.get('window')
        };
        this._retrievePier();
    }

    _retrievePier = async () => {
        try {
            const value = await AsyncStorage.getItem('pier');

            if (value !== null) {
                store.dispatch(userActions.setPier(value));
            } else {
                store.dispatch(userActions.setPier('A'));
            }
        } catch (error) {
            store.dispatch(userActions.setPier('A'));
        }
    };

    getOrientation() {
        if (this.state.screen.width > this.state.screen.height) {
            return LANDSCAPE;
        } else {
            return PORTRAIT;
        }
    }

    getStyles() {
        if (this.props.currentRoute === 'QRCodeScanner') {
            return landscapeStyles;
        }
        if (this.getOrientation() === LANDSCAPE) {
            return landscapeStyles;
        } else {
            return portraitStyles;
        }
    }

    onLayout() {
        this.setState({ screen: Dimensions.get('window') });
    }

    getMainContainerSize() {
        if (
            this.getOrientation() == LANDSCAPE &&
            this.props.currentRoute === 'QRCodeScanner'
        ) {
            // Any page but QR code scanner
            return 80;
        } else if (
            this.getOrientation() == LANDSCAPE &&
            this.props.currentRoute !== 'QRCodeScanner'
        ) {
            // QR code scanner in landscape
            return 60;
        } else {
            // Default size for any other scenario in landscape/portrait
            return 80;
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <View
                    style={this.getStyles().flex}
                    onLayout={this.onLayout.bind(this)}
                >
                    {this.props.isLoading && <Loader></Loader>}
                    <Image
                        style={this.getStyles().image2}
                        source={require('../assets/images/background/background3.png')}
                    ></Image>
                    <Grid style={[this.getStyles().container]}>
                        {this.getOrientation() == LANDSCAPE && (
                            <Col
                                style={[
                                    GridStyle.css,
                                    GutterStyle.size,
                                    GutterStyle.noSpaceLeft
                                ]}
                                size={10}
                            ></Col>
                        )}
                        <Col
                            style={[GridStyle.css, GutterStyle.size]}
                            size={this.getMainContainerSize()}
                        >
                            {this.props.isHeaderVisible && (
                                <View style={styles.header}>
                                    <Image
                                        style={{ width: 150 }}
                                        source={require('../assets/images/logo/brussels-airport-logo.png')}
                                    ></Image>
                                    <LanguagePicker></LanguagePicker>
                                </View>
                            )}
                            <ReloadAppOnLanguageChange />
                        </Col>
                        {this.getOrientation() == LANDSCAPE && (
                            <Col
                                style={[
                                    GridStyle.css,
                                    GutterStyle.size,
                                    GutterStyle.noSpaceRight
                                ]}
                                size={
                                    this.props.currentRoute === 'QRCodeScanner'
                                        ? 10
                                        : 30
                                }
                            ></Col>
                        )}
                    </Grid>

                    <RNText
                        onPress={() => {
                            store.dispatch(
                                userActions.setPierModalVisibility(true)
                            );
                        }}
                        text={
                            'Pier: ' +
                            this.props.pier +
                            (this.props.appEndpoint === 'dev'
                                ? ' - development mode'
                                : '')
                        }
                        style={styles.pierSelectorBtn}
                    ></RNText>
                    <PierPicker></PierPicker>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const landscapeStyles = StyleSheet.create({
    flex: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        paddingTop: 50,
        paddingBottom: 50,
        marginLeft: 60,
        marginRight: 60
    },
    image: {
        position: 'absolute',
        width: '80%',
        height: '100%',
        right: 0,
        top: -20,
        backgroundColor: 'white'
    },
    image2: {
        position: 'absolute',
        width: '85%',
        height: '100%',
        right: 0,
        top: -20,
        backgroundColor: 'white'
    }
});

const portraitStyles = StyleSheet.create({
    flex: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        paddingTop: 50,
        paddingBottom: 50,
        marginLeft: 60,
        marginRight: 60
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        right: 0,
        top: 0
    }
});

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 60,
        justifyContent: 'space-between'
    },
    pierSelectorBtn: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 10,
        bottom: 10,
        fontSize: 14,
        fontStyle: 'italic'
    }
});

const mapStateToProps = function(store) {
    return {
        isLoading: store.loaderState.loading,
        currentRoute: store.navigationState.routeName,
        user: store.userState.user,
        vouchers: store.userState.vouchers,
        isHeaderVisible: store.headerState.visible,
        pier: store.userState.pier,
        appConfig: store.userState.app_config,
        appEndpoint: store.userState.app_endpoint
    };
};

export default connect(mapStateToProps)(Container);
