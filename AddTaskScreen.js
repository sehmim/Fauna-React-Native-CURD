import React, { useState } from 'react';
import { View, TextInput, Button, Text} from 'react-native';
import LayoutExample from './Layout';
import { useNavigation } from '@react-navigation/native';

import { FaunaClient } from "./fauna";
import { Config } from './dotenv';


const useCreateTask = async (newTask) => {
    const faunaClient = new FaunaClient(Config.FAUNA_API_KEY);

    try {
        const resposne = await faunaClient.query(
        `
        Tasks.create({
                taskName: "${newTask.taskName}",
                taskDetails: "${newTask.taskDetails}",
            })
        `)   

        console.log(resposne)
    } catch (error) {
        console.error(error)
    }
}


const AddTaskScreen = () => {

    const { navigate } = useNavigation();
    const [taskName, setTaskName] = useState('');
    const [taskDetails, setTaskDetails] = useState('');


    const handleAddTask = async () => {
        const newTask = {
          taskName,
          taskDetails,
        };
        
        await useCreateTask(newTask)
        navigate("Home")
    };

    return (
        <LayoutExample>
            <View>
            <TextInput
                value={taskName}
                onChangeText={setTaskName}
                placeholder="Enter task name"
            />
            <TextInput
                value={taskDetails}
                onChangeText={setTaskDetails}
                placeholder="Enter task details"
            />
            <Button title="Add Task" onPress={handleAddTask} />
            </View>
        </LayoutExample>
    );
};

export default AddTaskScreen;