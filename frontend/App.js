import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Button, View, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
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

const SignUp = ({ navigation, route }) => {

  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [message, setMessage] = useState('');


  const handleRegister = async () => {

    const url = 'http://localhost:4000/auth/register';
    const payload = {
      name,
      email,
      password,
    };

    console.log(payload)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage('User registered successfully');
        console.log(data);
      } else {
        throw new Error(data.error || 'Error registering user');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Failed to register');
    }
  };

  return <View style={styles.container}>
    <Text style={styles.text}>Name:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeName}
      value={name}
      placeholder="Enter your name"
    />

    <View style={styles.separator} />

    <Text style={styles.text}>Email:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
      keyboardType="email-address"
      placeholder="Enter your email"
    />

    <Separator />

    <Text style={styles.text}>Password:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangePassword}
      value={password}
      secureTextEntry
      placeholder="Enter your password"
    />

    <Separator />

    <Button
      title="Sign Up"
      onPress={handleRegister}
      color="#1a73e8" // A blue color for the button
    />

    <Separator />

    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')}
      color="#6a1b9a" // A purple color for this button
    />
  </View>
};

const SignIn = ({ navigation, route }) => {

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      if (response.status === 200) {
        console.log('Login successful', json);
        // Save the token, navigate or perform other actions
      } else {
        Alert.alert("Login Failed", json.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Network Error", "Unable to connect to the server");
    }
  };

  return <View style={styles.container}>

    <Text style={styles.text}>Email:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
      keyboardType="email-address"
      placeholder="Enter your email"
    />

    <Separator />

    <Text style={styles.text}>Password:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangePassword}
      value={password}
      secureTextEntry
      placeholder="Enter your password"
    />

    <Separator />
    <Button
      title="Sign in"
      onPress={() =>
        loginUser(email, password)
      }
      color="#1a73e8" // A blue color for the button
    />
    <Separator />

    <Separator />
    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')} // Navigate to the API Screen
      color="#6a1b9a" // A purple color for this button
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
    marginVertical: 12,
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // Use a light background
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5, // Rounded corners for inputs
  },
  text: {
    fontSize: 16,
    color: '#333', // Darker text for better readability
    marginBottom: 10,
    fontWeight: 'bold', // Make the labels bold
  },
});
