import React from 'react';
import {View, StyleSheet} from 'react-native';
import RNText from "../Components/RN/Text";
import i18n from '../Helpers/i18n';
import {COLOR_PRIMARY} from "../Helpers/common";
import store from "../store";
import * as userActions from "../Actions/userActions";

const locales = ['en','fr','nl'];

export default class LanguagePicker extends React.Component {
    state = {
        currentLanguage: ''
    };

    componentDidMount(){
        let ctx = this;
        setTimeout(function(){
            let lang = i18n.language?i18n.language.split('-')[0]:'en';
            ctx.setState({currentLanguage: lang});
        });
    }

    _handleChangeLocale(locale){
        i18n.changeLanguage(locales.includes(locale)?locale:'en').then((response) => {
            this.setState({currentLanguage: locale});
            store.dispatch(userActions.setLang(locale));
        });
    }

    getLanguage(){
        return this.state.currentLanguage;
    }

    render() {
        return (
            <View style={styles.languagePicker}>
                { locales.map((locale, index) => {
                    let calculatedStyle = [styles.languageText];
                    if(locale === this.getLanguage()) calculatedStyle.push(styles.currentLanguage);

                    return <View key={index} style={styles.language}>
                        <RNText style={calculatedStyle} onPress={() => this._handleChangeLocale(locale)} text={locale.toUpperCase()}></RNText>
                    </View>
                }) }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    languagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    language: {
        marginRight: 10,
        borderBottomColor: COLOR_PRIMARY,
        borderBottomWidth: 1
    },
    languageText: {
        color: COLOR_PRIMARY,
        fontSize: 15
    },
    currentLanguage: {
        fontWeight: 'bold'
    }
});