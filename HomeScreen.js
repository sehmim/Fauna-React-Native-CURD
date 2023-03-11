import React from 'react';
import { View, Text, Button } from 'react-native';
import LayoutExample from './Layout';

const HomeScreen = ({ navigation }) => {
  return (
    <LayoutExample>
        <View>
            <Text>Welcome to the Home Screen!</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    </LayoutExample>
  );
};

export default HomeScreen;
