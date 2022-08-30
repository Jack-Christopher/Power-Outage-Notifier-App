import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/HomeScreen';
import DistrictSetter from './screens/DistrictSetterScreen';
import Results from './screens/ResultsScreen';

const Stack = createStackNavigator();

function MyStack()
{
    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="DistrictSetter" component={DistrictSetter} />
            <Stack.Screen name="Results" component={Results} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
