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

   const Stack = createStackNavigator();

   const StackNavigator = () => {
     return (
       <Stack.Navigator>
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Details" component={DetailsScreen} />
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

4. Create your `HomeScreen` and `DetailsScreen` components as usual, and use the navigation prop to navigate between screens:

   ```
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

5. (OPTIONAL) Create a basic layout `Layout.js`

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

### Gettings Fauna Configured

1.  Create a new FaunaDB database and obtain your secret key from the FaunaDB dashboard. // TODO:

2.  Install the FaunaDB driver in your React Native app using NPM:

    ```
    npm install faunadb
    ```

3.  Create a new file to hold your FaunaDB client configuration, for example faunadbConfig.js. In this file, import the Client class from the FaunaDB driver and initialize a new client instance with your secret key:

    ```
    import { Client } from 'faunadb';

    export const faunaClient = new Client({
        secret: 'your-secret-key-here',
    });
    ```

4.  (OPTIONAL) Make a `dotenv.js` and add `./dotenv.js` to your `.gitignore` file. Make one if it doesnt exist.

    ```
    export const Config  = {
        FAUNA_API_KEY: "YOUR_API_KEY"
    }
    ```

### Usage

1. Create a custom `Hook` for fetching logic

   ```
   const useHomeScreenData = () => {
       const myCollection = FaunaDB.Collection('products');
       const [data, setData] = useState(null);

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
   }
   ```

2. Use Hook in the component component
   ```
       const { data } = useHomeScreenData();
       console.log(data);
   ```
