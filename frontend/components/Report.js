import React, { Component } from 'react';
import { GetStyles } from '../styles/GetStyles.js';
import { Text, View, SafeAreaView } from 'react-native';

class Report extends Component {

    constructor(props)
    {
        super(props);
        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "report", "list", "input"]);
    }

    render() {
        // console.log("Report size: ", this.props.rep.data.length);
        return (
            <SafeAreaView style={this.styles.container}>
                <Text style={this.styles.report} onTextLayout={this.onTextLayout}>
                    {this.props.rep.data}
                </Text>

            </SafeAreaView>
        );
    }
}

export default Report;