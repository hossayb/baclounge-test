import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import { COLOR_PRIMARY, FONT_NORMAL, H1_FONT_SIZE } from '../../Helpers/common';

export default class RNH1 extends React.Component {
    getStyles(){
        let calculatedStyles = [styles.text];

        if(this.props.style) calculatedStyles.push(this.props.style);

        return calculatedStyles;
    }

    render() {
        return (
            <Text style={this.getStyles()}>{this.props.text}</Text>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: H1_FONT_SIZE,
        color: COLOR_PRIMARY,
        fontFamily: FONT_NORMAL,
        fontWeight: 'bold',
        marginBottom: 15
    }
});