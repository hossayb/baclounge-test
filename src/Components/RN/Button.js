import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { COLOR_PRIMARY, COLOR_DISABLED, FONT_SIZE_BTN, COLOR_BTN } from '../../Helpers/common';
import Icons from '../../Helpers/Icons';

export default class RNButton extends React.Component {
    getStyles(){
        return this.props.disabled?[styles.button, styles.disabled]:styles.button;
    }

    render() {
        return (
            <TouchableHighlight underlayColor="transparent" onPress={ this.props.onPress }>
                <View style={ this.getStyles() }>
                    { this.props.icon && this.props.iconPosition == 'before' &&
                        <Image style={styles.iconBefore} source={Icons[this.props.icon]}></Image>
                    }

                    <Text style={ styles.buttonText }>{ this.props.title.toUpperCase() }</Text>

                    { this.props.icon && this.props.iconPosition != 'before' &&
                        <Image style={styles.iconAfter} source={Icons[this.props.icon]}></Image>
                    }
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: COLOR_PRIMARY
    },
    disabled: {
        backgroundColor: COLOR_DISABLED
    },
    buttonText: {
        color: COLOR_BTN,
        fontWeight: 'bold',
        fontSize: FONT_SIZE_BTN,
        textAlign: 'center'
    },
    iconBefore: {
        position: 'absolute',
        top: 25,
        left: 30
    },
    iconAfter: {
        position: 'absolute',
        top: 25,
        right: 30
    }
});