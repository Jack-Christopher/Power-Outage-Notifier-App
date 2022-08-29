import React from "react";
import { StatusBar } from 'expo-status-bar';
import { Icon } from 'react-native-elements';
import { GetStyles } from '../styles/GetStyles.js';
import { Text, View, Linking, Platform, TouchableOpacity } from 'react-native';

const HomeScreen = ({navigation }) => {

    const styles = GetStyles(["container", "appTitle", "button", "icon", "message", "link"]);

    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>
                Power Outage Notifier
            </Text>
            
            
            <View style={styles.icon}>
                <Icon
                    reverse
                    size={40}
                    name='power'
                    type='material-community'
                    color='#1DB954'
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // console.log("Start button pressed");
                    navigation.navigate('DistrictSetter');
                }}
            >
            <Text>
                Add district to watchlist
            </Text>
            </TouchableOpacity>

            <Text style={styles.message}>
                Version {Platform.OS === 'web' ? "web" : "mobile"}
            </Text>

            <StatusBar style="auto" />
        </View>
    );
}


export default HomeScreen;