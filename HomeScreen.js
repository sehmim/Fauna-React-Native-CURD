import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native';
import LayoutExample from './Layout';
import { faunaClient } from './faunadbConfig';
import * as FaunaDB from 'faunadb';

const myCollection = FaunaDB.Collection('products');


const useHomeScreenData = () => {
    const [data, setData] = useState(null);

    console.log("data---->", data)

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
        try {
            const response = await faunaClient.query(
                FaunaDB.Map(
                    FaunaDB.Paginate(FaunaDB.Documents(myCollection)),
                  FaunaDB.Lambda((x) => FaunaDB.Get(x))
                )
              )
            
            setData(response.data);
                
            } catch (error) {
                console.log(error)
            }
        };

        return {
            data,
            setData
        }
}

const HomeScreen = ({ navigation }) => {

    const { data } = useHomeScreenData();
    console.log(data);

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
