# Fauna React-Native CURD

##### Setting Up Basic React Native Project:

1. Install React Navigation and its dependencies:

   ```
   npm install @react-navigation/native @react-navigation/stack
   ```

2. Create a new stack navigator in a separate file, for example `StackNavigator`.js:

   ```
    import React from 'react';
    import { createStackNavigator } from '@react-navigation/stack';
    import HomeScreen from './HomeScreen';
    import DetailsScreen from './DetailsScreen';
    import AddTaskScreen from './AddTaskScreen';

    const Stack = createStackNavigator();

    const StackNavigator = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
        </Stack.Navigator>
      );
    };

    export default StackNavigator;
   ```

3. In your `App.js` file, import the `StackNavigator` and wrap it in a `NavigationContainer`:

   ```
   import React from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import StackNavigator from './StackNavigator';

   export default function App() {
     return (
       <NavigationContainer>
         <StackNavigator />
       </NavigationContainer>
     );
   }
   ```

4. Create your `HomeScreen`, `DetailsScreen`, `AddTaskScreen` components as usual, and use the navigation prop to navigate between screens:

   ```
    import React from 'react';
    import { View, Text, Button } from 'react-native';
    import LayoutExample from './Layout';
    import { useNavigation } from '@react-navigation/native';


    const HomeScreen = () => {
        const navigation = useNavigation();
        return (
            <LayoutExample>
                <View>
                    <Text>Welcome to the Home Screen!</Text>
                    <Button
                        title="Add Task+"
                        onPress={() => navigation.navigate('AddTask')}
                    />
                </View>
            </LayoutExample>
        );
    };

    export default HomeScreen;
   ```

   ```
   import React from 'react';
   import { View, Text } from 'react-native';

   const DetailsScreen = () => {
     return (
       <View>
         <Text>Welcome to the Details Screen!</Text>
       </View>
     );
   };

   export default DetailsScreen;
   ```

   ```
    const AddTaskScreen = () => {
        const { navigate } = useNavigation();
        const [taskName, setTaskName] = useState('');
        const [taskDetails, setTaskDetails] = useState('');

        const handleAddTask = async () => {
            const newTask = { taskName, taskDetails };
            <!--await useCreateTask(newTask)--> // TODO:
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
   ```

   ```
   import React from 'react';
   import { View, Text } from 'react-native';

   const DetailsScreen = () => {
     return (
       <View>
         <Text>Welcome to the Details Screen!</Text>
       </View>
     );
   };

   export default DetailsScreen;
   ```

5. (OPTIONAL) Create a basic layout `Layout.js`. If you dont want to use this, please **disable** `<LayoutExample />` from the screens.

   ```
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center',
     },
     header: {
       flex: 1,
       width: '100%',
       backgroundColor: 'blue',
       alignItems: 'center',
       justifyContent: 'center',
     },
     body: {
       flex: 8,
       width: '100%',
       backgroundColor: 'white',
       alignItems: 'center',
       justifyContent: 'center',
     },
     footer: {
       flex: 1,
       width: '100%',
       backgroundColor: 'green',
       alignItems: 'center',
       justifyContent: 'center',
     },
     text: {
       fontSize: 20,
       color: 'white',
     },
   });

   const LayoutExample = ({ children }) => {
     return (
       <View style={styles.container}>
         <View style={styles.body}>
           <Text style={styles.text}>{children}</Text>
         </View>
       </View>
     );
   };

   export default LayoutExample;
   ```

6. Now start the app. For this demo we will use the web version.

```
  npm run web
```

> P.S: You might need to install `weback`. Please follow the errors in the console if any.

### Fauna Setup

1. Assuming you have registered to faunaDB, go to https://dashboard.fauna.com/ and create a new database.
   ![Create your Database](https://i.imgur.com/IhLpJqO.png)

2. Create your key
   ![Create your Database](https://i.imgur.com/LyW0oQh.png)
   ![Create your Database](https://i.imgur.com/i7xHIPZ.png)

3. Copy the `Key` and save it in a clipboard, we will need this later when making calls to the database.
4. Now lets create a Collection called `Tasks`
   ![Create your Database](https://i.imgur.com/2byVVdG.png)
   ![Create your Database](https://i.imgur.com/haSZGpe.png)

We will add entries to this collection via our app.

### Gettings Fauna Configured

For this demo we will use Faunas FQL service via the endpoint `https://db.fauna.com/query/1`.

1.  Lets make a `FaunaClient` class to do all the heavy lifting for us.

        ```
        export class FaunaClient {
          constructor(key) {
            this.key = key;
            // global server 2: https://db.fauna-dev.com/query/1
            // US-East: https://us-dev.db.faunadb.net/query/1
            this.url = "https://db.fauna.com/query/1";
            // `https://db.fauna-dev.com/query/1`;
          }

          _getKey() {
            return this.key;
          }

          _getUrl() {
            return this.url;
          }

          async query(fql_expression) {
            if (!this.key) {
              return "Please provide a valid key";
            }
            return fetch(this.url, {
              headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${this.key}`,
            "x-format": "simple",
            "x-typecheck": "false"
          },
          body: JSON.stringify({
            query: fql_expression,
            arguments: {}
          }),
          method: "POST",
          mode: "cors",
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data) => {
            return data.data;
          })
          .catch((e) => console.log("ERROR ===>>>", e));
        }
        }
        ```

    > NOTE: This is a basic REST example of how to make a call to the Fauna endpoint. Much like GraphQL this sends a fql_expression as payload to the fauna API which then gets executed based on your fql_expression.

Thats it! Now we can use it in our app.

### Usage in React Native

1. Now that we have a Fauna service class we can use it in our app. Lets make a `React Hook`
   that would create an entry to our database.

   ```
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
   ```

2. Now lets call this hook from our `AddTaskScreen` component.

   ```
   const AddTaskScreen = () => {

   const { navigate } = useNavigation();
   const [taskName, setTaskName] = useState('');
   const [taskDetails, setTaskDetails] = useState('');


   const handleAddTask = async () => {
       const newTask = {
         taskName,
         taskDetails,
       };

       await useCreateTask(newTask) <------ Hook!
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

   ```

3. Now if we add a task via our UI and check the Fauna dashboard we will be able to see the database populate with the entry.

   ![Add Task](https://i.imgur.com/17YwDW2.png)
   ![Add Task](https://i.imgur.com/IZvtXe5.png)

4. Now lets make another hook to read the data from the database:

   ```
   const useFetchAllTasks = async () => {
       const faunaClient = new FaunaClient(Config.FAUNA_API_KEY);

       try {
           const { data: tasks } = await faunaClient.query(`Tasks.all`)
           console.log(tasks)
       } catch (error) {
           console.error(error)
       }
   }
   ```

5. Add it to your HomeScreen component with the project react states. The whole component with the hook should look like this.

   ```
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
                             renderItem={({item}) => <Text>- {item.taskName}</Text>}
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
   ```

6. Now we can see the data being puleld and displayed on our app.
   ![Add Task](https://i.imgur.com/mIRZ3te.png)

### Performing Queries in Fauna

- TODO:

### Use A Fauna Provider

- TODO:

### Clean up

- TODO:
