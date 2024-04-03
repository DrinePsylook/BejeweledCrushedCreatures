import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import Store from './store/configStore';

import HomePage from './screens/Homepage';
import Game from './screens/Game';
import HighScorePage from './screens/HighScorePage';

const Stack = createNativeStackNavigator();

const App =() => {
  return(
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen 
            name='HomePage' 
            component={HomePage} 
          />
          <Stack.Screen name='Game' component={Game}/>
          <Stack.Screen name='HighScorePage' component={HighScorePage}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;