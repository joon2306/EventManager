import React from 'react';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Add from './screens/Add';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer initialRouteName="Home">
      <Stack.Navigator>
        <Stack.Screen name="Events" component={Home} />
        <Stack.Screen name="Add Event" component={Add} />
      </Stack.Navigator>

    </NavigationContainer>
  )
};

export default App;
