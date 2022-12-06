import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './Screens/Main'


const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name='Main' component={Main} options={{ title: "TO DO LIST" }} />
      </Stack.Navigator>
    </NavigationContainer>

  )


}



