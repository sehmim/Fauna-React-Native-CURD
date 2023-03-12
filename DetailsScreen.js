import React from 'react';
import { View, Text } from 'react-native';
import LayoutExample from './Layout';
import { useNavigation } from '@react-navigation/native';

const DetailsScreen = ({ route }) => {

  // const { route } = useNavigation();

  // const {item} = route.params;

  console.log(item)
  return (
    <LayoutExample>
        <View>
          <Text>{ item && item.taskName }</Text>
        </View>
    </LayoutExample>
  );
};

export default DetailsScreen;