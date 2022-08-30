import React, { Component, useState, useLayoutEffect  } from "react";
import { GetStyles } from '../styles/GetStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, ToastAndroid, TouchableOpacity } from 'react-native';
import Result from '../components/Result.js';

class ResultsScreen extends Component
{
    constructor(props)
    {
        super(props);

        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "item", "list", "input"]);
        this.state = {
            data : ['Loading', 'data']
        };
        this.getData();
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('selectedDistricts');
            if(value !== null) {
                // value previously stored
                this.setState({
                    selectedDistricts : JSON.parse(value),
                });
            }
            else {
                console.log("Not found, creating new array");
                // value not found, set default value
                this.setState({district : ""});
                // store default value in async storage
                await AsyncStorage.setItem('selectedDistricts', JSON.stringify(this.state.selectedDistricts));
            }
        } catch(e) {
        // error reading value
        }

        console.log("this.state.selectedDistricts: ", this.state.selectedDistricts);
    }

    addDistrict = async () => {
        try {
            // if current district is not in district list, add it
            if (this.state.currentDistrict !== "" && !this.state.selectedDistricts.includes(this.state.currentDistrict)) {
                this.state.selectedDistricts.push(this.state.currentDistrict);
                await AsyncStorage.setItem('selectedDistricts', JSON.stringify(this.state.selectedDistricts));
                ToastAndroid.show('District added', ToastAndroid.SHORT); 
                console.log("this.state.selectedDistricts: ", this.state.selectedDistricts);           
            } else {
                ToastAndroid.show('District already added', ToastAndroid.SHORT);
                console.log("District already added");
            }
        } catch (e) {
            console.log("error saving selectedDistricts: ", e);
        }
    }


    render()
    {
        return(
            <View style={this.styles.container}>
                <Text style={this.styles.appTitle}>
                    Results
                </Text>

                <Text style={this.styles.message}>
                    {this.state.data.map((item, index) => {
                        return <Result key={index} district={item} />
                    }
                    )}
                    
                    
                </Text>

               
                <TouchableOpacity
                    style={this.styles.button}
                    onPress={() => {
                        this.addDistrict();
                    }}
                >
                    <Text>
                        Get Results
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


export default ResultsScreen;