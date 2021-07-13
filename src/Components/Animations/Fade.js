import React from 'react';
import {Animated, TouchableOpacity, TextStyle, ViewStyle} from 'react-native';

export default class Fade extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        fadeTime: this.props.time?this.props.time:250
    };

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: this.state.fadeTime              // Make it take a while
            }
        ).start();                        // Starts the animation
    }

    componentWillUpdate(nextProps){
        if(!nextProps.visible){
            this._handleFadeOut();
        }
    }

    _handleFadeOut(){
        console.log('handle fade out');
        this.state.fadeAnim.setValue(1);

        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 0,
                duration: this.state.fadeTime
            }
        ).start();
    }

    getStyles(){
        let { fadeAnim } = this.state;
        let calculatedStyles = [];

        if(this.props.style) calculatedStyles.push(this.props.style);

        calculatedStyles.push({opacity: fadeAnim});

        return calculatedStyles;
    }

    render() {
        return (
            <Animated.View style={this.getStyles()}>
                <TouchableOpacity>
                    { this.props.children }
                </TouchableOpacity>
            </Animated.View>
        );
    }
}