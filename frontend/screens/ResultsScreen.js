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
            // data : ['Loading', 'data']
            data : [],
            filteredData : [],
            selectedDistricts : [],
        };
        this.getData();
        this.getDistricts();
        setTimeout(() => {
            this.filterData();
        }, 1000);        
    }


    fetchData = async () => {
        console.log("init fetchData");
        let url = "https://power-outage-notifier.herokuapp.com/reports/all";
        let resp = await fetch(url, {
            "method": "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(response => response.data)
            .then(data => this.setState({data: data}))
            .catch(error => console.log(error));
        console.log("end fetchData");
        console.log("this.state.data: ", this.state.data);

        this.saveReport();
    }
    

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('reports');
            if(value !== null) {
                // value previously stored
                this.setState({
                    data : JSON.parse(value),
                });
            }
            else {
                console.log("Not found, creating new array");
                // value not found, set default value
                this.setState({reports : []});
                // store default value in async storage
                await AsyncStorage.setItem('reports', JSON.stringify(this.state.data));
            }
        } catch(e) {
        // error reading value
        }
        console.log("reports got");
    }

 

    saveReport = async () => {
        try {
            // from this.state.data
            await AsyncStorage.setItem('reports', JSON.stringify(this.state.data));
            ToastAndroid.show('Reports saved', ToastAndroid.SHORT);
            console.log("Reports saved");
        } catch (e) {
            console.log("error saving reports: ", e);
        }
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


    
    filterData = () => {
        console.log("init filterData");
        // console.log("Filtering data");
        this.state.selectedDistricts.forEach(dist => {
            console.log("dist: ", dist);
            this.state.data.forEach(report => {
                console.log("report: ", report.id);
                // if district appears in data, add it to state
                if ( report.description.includes(dist) ) {
                    this.setState({
                        filteredData : [...this.state.filteredData, report]
                    });
                    console.log("District found: ", dist);
                }
            });
        });
        console.log("end filterData");
    }
       


    render()
    {
        return(
            <View style={this.styles.container}>

                <Result 
                    data={this.state.filteredData}
                    districts={this.state.selectedDistricts}
                    navigation={this.props.navigation} 
                />
               
                <TouchableOpacity
                    style={this.styles.button}
                    onPress={() => {
                        this.fetchData();
                        console.log("Data fetched");
                    }}
                >
                    <Text>
                        Update Results
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


export default ResultsScreen;