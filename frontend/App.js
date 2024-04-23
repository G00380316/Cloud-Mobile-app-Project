import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Button, View, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import ImgPicker from './ImagePicker';

const SERVER_URL = "https://42a8-193-1-57-1.ngrok-free.app"

const Stack = createNativeStackNavigator();

const Separator = () => <View style={styles.separator} />;

const HomeScreen = ({ navigation, route }) => {
  const token = route?.params.token;
  return (
    <SafeAreaView>
      <View>
        {!token ? (
          <>
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('SignUp')}
            />
            <Separator />
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
            />
            <Separator />
          </>
        ) : (
          <>
            <Button
              title="Go and talk to our AI"
              onPress={() => navigation.navigate('AskAI', { token })}
            />
            <Separator />
            <Button
              title="Have a Look at some Top Destinations"
              onPress={() => navigation.navigate('TopDestinations', { token })}
            />
            <Separator />
            <Button
              title="ViewPosts"
              onPress={() => navigation.navigate('ViewPosts', { token })}
            />
            <Separator />
            <Button
              title="CreatePost"
              onPress={() => navigation.navigate('CreatePost', { token })}
            />
            <Separator />
            <Button
              title="Log Out"
              onPress={() => navigation.navigate('LogOut', { token })}
            />
            <Separator />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const SignUp = ({ navigation, route }) => {

  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [message, setMessage] = useState('');


  const handleRegister = async () => {

    const url = `${process.env.SERVER_URL}/auth/register`;

    // console.log(payload)

    payload = {
      name,
      email,
      password
    }

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

        //add notification for sucessful signup
        navigation.navigate('Home');
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
      const response = await fetch(`${SERVER_URL}/auth/login`, {
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
        console.log(json)
        navigation.navigate('Home', { token: json.token });
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

    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')} // Navigate to the API Screen
      color="#6a1b9a" // A purple color for this button
    />
  </View>;
};

const LogOut = ({ navigation, route }) => {
  const token = route.params.token;

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const logoutUser = async (token) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (response.status === 200) {
        Alert.alert("Logout Successful", json.message);
        // Handle additional cleanup if necessary, e.g., navigating to login screen or clearing local state/storage
      } else {
        throw new Error(json.error || 'Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert("Logout Failed", error.message || "Internal Server Error");
    }
  };


  return <View style={styles.container}>
    <Button
      title="Log Out"
      onPress={() => {
        logoutUser(token)
        navigation.navigate('Home', { token: null })
      }
      }
      color="#1a73e8"
    />
    <Separator />

    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')}
      color="#6a1b9a"
    />
  </View>;
};


const AskAI = ({ navigation, route }) => {
  const token = route.params.token;
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!prompt.trim()) {
      Alert.alert("Input Required", "Please enter a prompt to continue.");
      return;
    }
    try {
      const response = await fetch(`${SERVER_URL}/ai/create/protected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  //  authentication token here
        },
        body: JSON.stringify({ question: prompt }),
      });

      const jsonResponse = await response.json();
      if (response.status === 201) {
        setResponse(jsonResponse.response.message.content);
        setLoading(false);
      } else {
        throw new Error(jsonResponse.error || 'Failed to fetch response');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", error.message);
    }
  };

  const askAgain = async () => {
    setResponse("");
    setPrompt("");

  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {!response && <><TextInput
        style={styles.input}
        placeholder="Enter your prompt"
        value={prompt}
        onChangeText={setPrompt}
        multiline />
        <Button
          title="Submit Prompt"
          onPress={handleSubmit}
          color="#1a73e8" /></>}
      {response && (
        <><Text style={styles.response}>
          {response}
        </Text><Button
            title="Ask again?"
            onPress={askAgain}
            color="#1a73e8" /></>
      )}
    </ScrollView>
  );
};

const TopDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/top/topdes`);
      const data = await response.json();
      if (response.ok) {
        setDestinations(data);
      } else {
        throw new Error('Failed to fetch destinations');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <View style={styles.container}><Text>Error: {error}</Text></View>;
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {destinations.map((destination, index) => (
        <View key={index} style={styles.destination}>
          <Image src={destination.image} style={styles.image} />
          <Text style={styles.title}>{destination.title}</Text>
          <Text style={styles.description}>{destination.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const CreatePostScreen = ({navigation, route}) => {
  const authToken = route.params.token;

  const createPost = async (media) => {
    const url =   `${SERVER_URL}/post/create`;
    const formData = new FormData();
    formData.append('media', { uri: media, type: 'image/jpeg', name: 'upload.jpg' });
    formData.append('content', 'New Post with Image'); // Adjust as per your data requirements

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`, // Ensure your server expects a Bearer token
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        Alert.alert('Error', responseData.message || 'Failed to create post');
        return;
      }

      Alert.alert('Success', 'Post created successfully!');
      navigation.goBack(); // Go back to the previous screen or to the home screen as needed
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  return (
    <View>
      <ImgPicker onImageTaken={createPost} />
    </View>
  );
};

const ViewPosts = ({navigation, route }) => {

  const authToken = route.params.token;
  const [post, setPost] = useState(null);
  const { postId } = route.params;  // Get the postId passed via navigation

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/post/byId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Replace with your method of retrieving the auth token
          },
          body: JSON.stringify({ postId })
        });
        const responseData = await response.json();
        if (!response.ok) {
          Alert.alert('Error', 'Failed to fetch post details');
          return;
        }
        setPost(responseData);
      } catch (error) {
        console.error('Error fetching post:', error);
        Alert.alert('Error', 'Failed to load post details');
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return (
      <View style={styles.centered}>
       <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>  // Assuming your post object has a title
      <Image source={{ uri: post.imageUrl }} style={styles.image} />  // Assuming your post has an imageUrl
      <Text style={styles.content}>{post.content}</Text>  // Assuming your post has content
    </ScrollView>
  );
};




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} initialParams={{ token: null }} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="LogOut" component={LogOut} />
        <Stack.Screen name="TopDestinations" component={TopDestinations} />
        <Stack.Screen name="AskAI" component={AskAI} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="ViewPosts" component={ViewPosts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  }

});
