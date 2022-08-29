import React, { Component, useState, useLayoutEffect  } from "react";
import { GetStyles } from '../styles/GetStyles.js';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown'
import { districtList } from '../data/districts.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, ToastAndroid, TouchableOpacity } from 'react-native';
// import storage from "../data/storage.js";

class DistrictSetterScreen extends Component
{
    constructor(props)
    {
        super(props);

        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "item", "list", "input"]);
        this.state = {
            currentDistrict: "",
            districtList : districtList,
            selectedDistricts : [],
        };
        this.getDistricts();

        // sort the district list alphabetically
        this.state.districtList.sort();
    }

    getDistricts = async () => {
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
                    Add District
                </Text>
                
                
                <View style={this.styles.icon}>
                    <Icon
                        reverse
                        size={30}
                        name='add-alert'
                        type='material-icons'
                        color='#1DB954'
                    />
                </View>

                <Text style={this.styles.message}>
                    Enter the name of the district you want to receive notifications for.
                </Text>

                <SelectDropdown
                    data={this.state.districtList}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        this.setState({currentDistrict : selectedItem})
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                />
                        
                <TouchableOpacity
                    style={this.styles.button}
                    onPress={() => {
                        this.addDistrict();
                    }}
                >
                    <Text>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


export default DistrictSetterScreen;