import React, { Component } from 'react';
import { GetStyles } from '../styles/GetStyles.js';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';

class Result extends Component {

    constructor(props)
    {
        super(props);
        this.styles = GetStyles(["container", "appTitle", "button", "icon", "message", "result", "list", "input"]);
    }

    render() {
        if (this.props.data.length > 0) {
            return (
                <View style={this.styles.list}>
                    <FlatList
                        // style={this.styles.list}
                        data={this.props.data}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Details', {descr: item.description})}
                            >
                                <Text style={this.styles.result}>
                                    {item.description}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>
            );
        }
        else{
            return (
                <Text style = {this.styles.message} >
                    No data yet.              
                </Text>
            )
        }
    }
}

export default Result;