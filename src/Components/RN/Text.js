import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import { COLOR_TEXT, FONT_NORMAL, FONT_SIZE } from '../../Helpers/common';

export default class RNText extends React.Component {
    getStyles(){
        let calculatedStyles = [styles.text];

        if(this.props.style) calculatedStyles.push(this.props.style);

        return calculatedStyles;
    }

    render() {
        return (
            <Text onPress={ this.props.onPress } style={this.getStyles()}>{this.props.text}</Text>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: FONT_SIZE,
        lineHeight: 24,
        color: COLOR_TEXT,
        fontFamily: FONT_NORMAL
    }
});