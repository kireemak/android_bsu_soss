import React from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';

const App = () => <AppNavigator />;

AppRegistry.registerComponent('main', () => App);

export default App;
