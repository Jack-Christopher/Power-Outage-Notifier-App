import React, { Component, useState, useLayoutEffect  } from "react";
import { GetStyles } from '../styles/GetStyles.js';
import { Text, View, ToastAndroid, TouchableOpacity } from 'react-native';
import Report from '../components/Report.js';

class DetailsScreen extends Component
{
    constructor(props)
    {
        super(props);

        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "item", "list", "input"]);
        this.state = {
            report : this.props.route.params.descr,
        };
        // console.log("Report: ", this.state.report, "size: ", this.state.report.length);
        console.log("Report selected");
    }
    


    render()
    {
        return(
            <View style={this.styles.container}>
                {/* <Text style={this.styles.appTitle}>
                    Details
                </Text> */}

                <Report rep={{data: this.state.report}} />
               
            </View>
        );
    }
}


export default DetailsScreen;