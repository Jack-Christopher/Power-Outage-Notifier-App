import React, { Component } from 'react';
import { GetStyles } from '../styles/GetStyles.js';
import { Text, View, ToastAndroid, TouchableOpacity } from 'react-native';

class Result extends Component {

    constructor(props)
    {
        super(props);
        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "item", "list", "input"]);
    }

    render() {
        return(
            <View style={this.styles.container}>
                <Text
                    style={this.styles.item}
                >
                    {this.props.district}, 
                </Text>
            </View>
        )
    }
}

export default Result;