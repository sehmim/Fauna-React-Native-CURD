import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import LayoutExample from './Layout';
import { useNavigation } from '@react-navigation/native';
import { FaunaClient } from './fauna';
import { Config } from './dotenv';


const HomeScreen = () => {
    const navigation = useNavigation();
    const [tasks, setTasks] = useState([])

    const useFetchAllTasks = async () => {
        const faunaClient = new FaunaClient(Config.FAUNA_API_KEY);
    
        try {
            const { data: tasks } = await faunaClient.query(`Tasks.all`) 
            setTasks(tasks)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        useFetchAllTasks()
    }, [])

    console.log("tasks --->", tasks);

    return (
        <LayoutExample>
            <View>
                <Text>Your Tasks</Text>
                {
                    tasks?.length > 0 ?
                    <FlatList
                          data={tasks}
                          renderItem={({item}) => <Text> - {item.taskName}</Text>}
                    />
                    : 
                    <Text>Looks like you dont have any task added</Text>
                }
                <Button
                    title="Add Task+"
                    onPress={() => navigation.navigate('AddTask')}
                />
            </View>
        </LayoutExample>
    );
};

export default HomeScreen;
