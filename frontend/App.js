import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Button, View, StyleSheet, SafeAreaView, TextInput } from 'react-native';
const Stack = createNativeStackNavigator();
const Separator = () => <View style={styles.separator} />;

const HomeScreen = ({ navigation, route }) => {
  const quote = route.params;
  return (
    <SafeAreaView>
      <View>
        <Button
          title="Sign Up"
          onPress={() =>
            navigation.navigate('SignUp') // Navigate to sign up
          }
        />
        <Separator />

        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')} // Navigate to sign in
        />
        <Separator />
        <Button
          title="Go to API Screen 2"
          onPress={() => navigation.navigate('API2')} // Navigate to the API Screen
        />
      </View>
      {/* {quote && (
        <>
          <Separator />
          <View style={styles.container}>

            <Text style={styles.text}>{JSON.stringify(quote.quote.text, null, 2)}</Text>
            <Text style={[styles.text, styles.author]}>- {JSON.stringify(quote.quote.author, null, 2)}</Text>
          </View>
        </>
      )} */}
    </SafeAreaView>

  );
};

const SignUp = ({ route }) => {

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  return <View>

    <Separator />

    <Text style={styles.text}>email</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
    />

    <Separator />

    <Text style={styles.text}>password</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangePassword}
      value={password}
    />

    <Separator />

    <Button
      title="Sign Up"
    // onPress={() =>
    // //sign up
    // }
    />


    <Separator />
    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')} // Navigate to the API Screen
    />
  </View>;
};

const SignIn = ({ route }) => {

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  return <View>

    <Separator />

    <Text style={styles.text}>email</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
    />

    <Separator />

    <Text style={styles.text}>password</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangePassword}
      value={password}
    />

    <Separator />

    <Button
      title="Sign in"
    // onPress={() =>
    // //sign in
    // }
    />
    <Separator />

    <Separator />
    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')} // Navigate to the API Screen
    />
  </View>;
};

const APIScreen = ({ navigation }) => {
  const [apiData, setApiData] = useState(null);

  const callAPI = async () => {
    try {
      const res = await fetch(
        `https://famous-quotes4.p.rapidapi.com/random?category=all&count=2`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '74cfa29e12msh3bbdf76c356126dp151912jsn1a548502b34c',
            'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
          },
        }
      );
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <View >
        <Separator />

        <Button title="Make API call" onPress={callAPI} color="#f194ff" />
        <Separator />
        {apiData && (
          <View style={styles.container}>
            <Text style={styles.text}>{JSON.stringify(apiData[0].text, null, 2)}</Text>
            <Text style={[styles.text, styles.author]}>- {JSON.stringify(apiData[0].author, null, 2)}</Text>
          </View>
        )}
        <Button
          title="Send text to home page"
          onPress={() => navigation.navigate('Home', { quote: apiData[0] })}
        />


      </View>
    </SafeAreaView>

  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="API2" component={APIScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const APIScreen2 = () => {
  const [apiData2, setApiData2] = useState(null);

  const callAPI2 = async () => {
    try {
      const res = await fetch(
        `https://082d-193-1-57-1.ngrok-free.app/getAllProducts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
        }
      );
      const data2 = await res.text();
      setApiData2(JSON.stringify(data2));
      console.log(apiData2);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <View >
        <Separator />

        <Button title="Make API call" onPress={callAPI2} color="#f194ff" />

        <Text style={styles.text}>- {apiData2}</Text>

      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  Button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'lightgray',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
