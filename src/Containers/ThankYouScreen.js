import React from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import RNH1 from '../Components/RN/h1';
import RNText from '../Components/RN/Text';
import { COLOR_LINK } from '../Helpers/common';
import RNButton from '../Components/RN/Button';
import * as userActions from '../Actions/userActions';
import * as loaderActions from '../Actions/loaderActions';
import store from '../store';
import { connect } from 'react-redux';
import { withTranslation as withNamespaces } from 'react-i18next';
import compose from 'compose-function';

let timerInterval;
const time = 10;

class ThankYouScreen extends React.Component {
    state = {
        ticketsLeft: []
    };

    componentDidMount() {
        // this.loadTicketsLeft();
        this.startTime(time);
    }

    loadTicketsLeft() {
        store.dispatch(loaderActions.setLoading(true));

        axios
            .get('codes/' + this.props.user.id)
            .then(response => {
                // console.log(response.data);
                this.setState({ ticketsLeft: response.data });
            })
            .catch(errors => {
                console.log(errors);
            })
            .then(() => {
                store.dispatch(loaderActions.setLoading(false));
            });
    }

    getTicketsLeft() {
        let orderedTickets = [];
        let index = 0;
        let populated = false;

        this.state.ticketsLeft.map(ticket => {
            let ticketDate = new Date(ticket.date_validity.date);

            if (orderedTickets.length) {
                index = 0;
                populated = false;

                orderedTickets.forEach(orderedTicket => {
                    if (
                        ticketDate.getTime() ===
                        orderedTicket.validity.getTime()
                    ) {
                        orderedTickets[index].tickets.push(ticket.id);
                        populated = true;
                    }

                    index++;
                });

                if (!populated) {
                    orderedTickets.push({
                        validity: ticketDate,
                        tickets: [ticket.id]
                    });
                }
            } else {
                orderedTickets.push({
                    validity: ticketDate,
                    tickets: [ticket.id]
                });
            }
        });

        index = 0;
        return orderedTickets.map(ticket => {
            let date = new Date(ticket.validity);
            date =
                (date.getDay() + 1 > 10
                    ? date.getDay() + 1
                    : '0' + (date.getDay() + 1)) +
                '.' +
                (date.getMonth() + 1 > 10
                    ? date.getMonth() + 1
                    : '0' + (date.getMonth() + 1)) +
                '.' +
                date.getFullYear() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds();
            index++;

            return (
                <ImageBackground
                    source={require('../assets/images/ticket/ticket.png')}
                    key={index}
                    style={styles.ticket}
                >
                    <RNText
                        style={{
                            color: COLOR_LINK,
                            fontWeight: 'bold',
                            fontSize: 16
                        }}
                        text={
                            ticket.tickets.length +
                            (ticket.tickets.length > 1 ? ' Passes' : ' Pass')
                        }
                    ></RNText>
                    <RNText
                        style={{ color: 'rgba(79, 85, 89, 0.8)', fontSize: 14 }}
                        text={'Valid until ' + date}
                    ></RNText>
                </ImageBackground>
            );
        });
    }

    startTime(duration) {
        let timer = duration,
            seconds;
        let ctx = this;

        timerInterval = setInterval(function() {
            seconds = timer === 60 ? timer : parseInt(timer % 60, 10);

            if (--timer < 0) {
                clearInterval(timerInterval);
                ctx.props.navigation.navigate('Homepage');
            }
        }, 1000);
    }

    _handleGoHome() {
        clearInterval(timerInterval);
        this.props.navigation.navigate('Homepage');
    }

    componentWillUnmount() {
        store.dispatch(userActions.setUser(null));
        store.dispatch(userActions.setVoucher(null));
    }

    render() {
        const { t } = this.props;

        return (
            <View>
                <RNH1 text={t('thankYouScreen:title')}></RNH1>
                <RNText
                    style={{ fontWeight: 'bold' }}
                    text={t('thankYouScreen:subtitle')}
                ></RNText>
                <RNText text={t('thankYouScreen:description')}></RNText>

                <View style={/*{marginTop: 100}*/ {}}>
                    {/*<RNText style={{color: COLOR_LINK, fontWeight: 'bold', marginBottom: 10}} text="You still have passes for next time"></RNText>

                    <View style={styles.ticketsList}>
                        { this.getTicketsLeft() }
                    </View>*/}

                    <View style={{ marginTop: 30 }}>
                        <RNButton
                            onPress={this._handleGoHome.bind(this)}
                            iconPosition="before"
                            icon="arrowLeft"
                            title={t('thankYouScreen:button')}
                        ></RNButton>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ticket: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        marginLeft: 10,
        marginRight: 10
    },
    ticketsList: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -8,
        marginRight: -8
    }
});

const mapStateToProps = function(store) {
    return {
        user: store.userState.user
    };
};

/*export default connect(
    mapStateToProps
)(ThankYouScreen);*/

export default compose(
    withNamespaces(['ThankYouScreen', 'translation']),
    connect(mapStateToProps)
)(ThankYouScreen);
