import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback, Image, TextStyle} from 'react-native';
import { COLOR_LINK } from '../../Helpers/common';
import Icons from "../../Helpers/Icons";

export default class RNLink extends React.Component {
    getStyles(){
        let calculatedStyles = [styles.link];

        if(this.props.style){
            calculatedStyles.push(this.props.style);
        }

        if(!this.props.noBorder){
            calculatedStyles.push({
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: COLOR_LINK
            });
        }

        return calculatedStyles;
    }

    getBorderStyles(){
        if(!this.props.noBorder){
            return {
                borderColor: COLOR_LINK,
                borderWidth: 1
            };
        }

        return {};
    }

    getContainerStyles(){
        let calculatedStyles = [styles.container];

        if(this.props.align) calculatedStyles.push({justifyContent: this.props.align});

        return calculatedStyles;
    }

    getLinklabel(){
        return this.props.uppercase?this.props.title.toUpperCase():this.props.title;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={ this.props.onPress }>
                <View style={this.getContainerStyles()}>
                    { this.props.icon && this.props.iconPosition == 'before' &&
                        <Image style={styles.iconBefore} source={Icons[this.props.icon]}></Image>
                    }

                    <Text style={this.getStyles()}>{this.getLinklabel()}</Text>

                    { this.props.icon && this.props.iconPosition != 'before' &&
                        <Image style={styles.iconAfter} source={Icons[this.props.icon]}></Image>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    link: {
        color: COLOR_LINK,
        fontWeight: 'bold'
    },
    iconBefore: {
        marginRight: 10
    },
    iconAfter: {
        marginLeft: 10
    }
});