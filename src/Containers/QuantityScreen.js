import React  from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {BackBtnStyle} from "../Helpers/GlobalStyles";
import RNLink from "../Components/RN/Link";
import RNH1 from "../Components/RN/h1";
import RNText from "../Components/RN/Text";
import {COLOR_LINK, COLOR_PRIMARY} from '../Helpers/common';
import { Icon } from 'react-native-elements';
import RNButton from "../Components/RN/Button";
import ThankYouScreen from "./ThankYouScreen";
import * as userActions from "../Actions/userActions";
import store from "../store";
import * as loaderActions from '../Actions/loaderActions';
import {connect} from "react-redux";

let timerInterval;
const sessionTime = 60;

class QuantityScreen extends React.Component {
    state = {
        quantitySelected: 1,
        maxQuantity: 1,
        sessionTimeLeft: sessionTime,
        selectedVouchers: [],
        code: this.props.code
    };

    getNumberTicketsLeft(){
        return this.state.maxQuantity+" tickets available";
    }

    getIconMinusStyles(){
        let calculatedStyles = [styles.quantityButton];

        if(this.state.quantitySelected === 1) calculatedStyles.push({opacity: 0.5});

        return calculatedStyles
    }

    getIconPlusStyles(){
        let calculatedStyles = [styles.quantityButton];

        if(this.state.quantitySelected === this.state.maxQuantity) calculatedStyles.push({opacity: 0.5});

        return calculatedStyles
    }

    _handleMinus(){
        const quantity = this.state.quantitySelected;

        if(this.state.quantitySelected > 1){
            this.setState({ quantitySelected: quantity - 1 });
        }
    }

    _handlePlus(){
        const quantity = this.state.quantitySelected;

        if(this.state.quantitySelected < this.state.maxQuantity){
            this.setState({ quantitySelected: quantity + 1 });
        }
    }

    startTime(duration){
        let timer = duration, seconds;
        let ctx = this;

        timerInterval = setInterval(function () {
            seconds = timer === 60?timer:parseInt(timer % 60, 10);

            ctx.setState({sessionTimeLeft: seconds < 10 ? "0" + seconds : seconds});

            if (--timer < 0) {
                clearInterval(timerInterval);

                store.dispatch(userActions.setUser(null));
                store.dispatch(userActions.setVoucher(null));

                Alert.alert(
                    'Session expired',
                    'For security reasons, you will be redirected to the home page and your data will be forgotten',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                ctx.props.navigation.navigate('Homepage');
                            }
                        }
                    ]
                );
            }
        }, 1000);
    }

    getTimeLeftBarSize(){
        let width = parseFloat(this.state.sessionTimeLeft)/sessionTime*100;

        return { width: width+'%' };
    }

    componentDidMount(){
        const { navigation } = this.props;
        this.setState({code: navigation.getParam('code')});

        this.startTime(this.state.sessionTimeLeft);

        let ctx = this;
        setTimeout(function(){
            let vouchers = ctx.props.vouchers;
            let quantity = 0;

            vouchers.forEach((voucher) => {
                quantity += voucher.quantity;
            });

            ctx.setState({maxQuantity: quantity});
            ctx.setState({selectedVouchers: [vouchers[0].id]});
        })

    }

    componentWillUnmount(){
        clearInterval(timerInterval);

        store.dispatch(userActions.setUser(null));
        store.dispatch(userActions.setVoucher(null));
    }

    _handleConfirm(){
        let data = {
            quantity: this.state.quantitySelected,
            user_id: this.props.user.id,
            code: this.state.code
        };

        store.dispatch(loaderActions.setLoading(true));
        this.props.navigation.navigate('ThankYouScreen');

        axios.post('use-codes', data).then((response) => {
            console.log(response.data);
            clearInterval(timerInterval);
        }).catch((errors) => {
            console.log(errors.data);
        }).then(() => {
            store.dispatch(loaderActions.setLoading(false));
        });
    }

    _handleGoBack(){
        clearInterval(timerInterval);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View>
                <RNLink onPress={ this._handleGoBack.bind(this) } icon="arrowLeftBlue" iconPosition="before" style={BackBtnStyle.style} uppercase={1} noBorder={1} title="Back"></RNLink>

                { this.props.user && this.props.user.firstname &&
                    <RNH1 style={{marginTop: 15, marginBottom: 0}} text={"Hello ,"}></RNH1>
                }
                <RNH1 text="Redeem your lounge access"></RNH1>

                <RNText text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor orci sed tempor venenatis. Nullam a aliquam mauris. Vivamus id nunc enim. Etiam tempor, nulla ac efficitur rhoncus, enim enim maximus mi, sit amet porta nulla lorem et risus."></RNText>

                <View style={styles.quantityContainer}>
                    <View style={{marginTop: 25}}>
                        <RNText text="Quantity" style={styles.quantityLabel}></RNText>
                        <RNText text={this.getNumberTicketsLeft()} style={styles.numberTickets}></RNText>
                    </View>
                    <View>
                        <View style={styles.quantitySelector}>
                            <View style={{borderRightWidth: 1, borderRightColor: '#D9D9D9'}}>
                                <Icon onPress={this._handleMinus.bind(this)} size={35} iconStyle={this.getIconMinusStyles()} color={COLOR_LINK} type="font-awesome" name="minus"></Icon>
                            </View>
                            <RNText style={styles.quantitySelected} text={this.state.quantitySelected}></RNText>
                            <View style={{borderLeftWidth: 1, borderLeftColor: '#D9D9D9'}}>
                                <Icon onPress={this._handlePlus.bind(this)} size={35} iconStyle={this.getIconPlusStyles()} color={COLOR_LINK} type="font-awesome" name="plus"></Icon>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 30 }}>
                    <RNButton icon="arrowRight" onPress={this._handleConfirm.bind(this)} title="Confirm"></RNButton>
                </View>
                <View style={styles.sessionTimeLeftContainer}>
                    <RNText text={"The session will reset in ".toUpperCase()} style={styles.sessionTimeLeft}></RNText>
                    <RNText text={(this.state.sessionTimeLeft+" seconds").toUpperCase()} style={[styles.sessionTimeLeft, {color: COLOR_PRIMARY}]}></RNText>
                </View>
                <View style={styles.sessionTimeLeftBar}>
                    <View style={[styles.sessionTimeLeftProgress, this.getTimeLeftBarSize()]}></View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    quantityContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 20,
        flexDirection: 'row'
    },
    quantityColumn: {
        width: '50%',
        flex: 1
    },
    quantityLabel: {
        color: COLOR_LINK,
        fontSize: 21,
        fontWeight: 'bold'
    },
    numberTickets: {
        fontSize: 16,
        color: '#4F5559'
    },
    quantitySelector: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginLeft: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 50,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    quantityButton: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40
    },
    quantitySelected: {
        fontSize: 28,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 5,
        paddingBottom: 5,
        color: COLOR_LINK,
        fontWeight: 'bold'
    },
    sessionTimeLeft: {
        opacity: 0.8,
        fontSize: 12
    },
    sessionTimeLeftContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 100
    },
    sessionTimeLeftProgress: {
        height: 1,
        backgroundColor: COLOR_PRIMARY,
        position: 'absolute',
        left: 0,
        top: 0
    },
    sessionTimeLeftBar: {
        width: 288,
        height: 1,
        backgroundColor: '#c7c7c7'
    }
});

const mapStateToProps = function(store){
    return {
        isLoading: store.loaderState.loading,
        vouchers: store.userState.vouchers,
        user: store.userState.user
    }
};

export default connect(
    mapStateToProps
)(QuantityScreen);
