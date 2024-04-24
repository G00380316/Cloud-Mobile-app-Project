import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Button, View, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import ImgPicker from './ImagePicker';

const SERVER_URL ="https://4e4e-2a01-b340-65-63d-1db1-e8a6-d3d-3c72.ngrok-free.app";
const unsignedUploadPreset = "vb2k8vdb";

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
      color="#1a73e8"
    />

    <Separator />

    <Button
      title="Go to Home Screen"
      onPress={() => navigation.navigate('Home')}
      color="#6a1b9a"
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
          'Authorization': `Bearer ${token}`,
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
    return <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
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
    return <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
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

const CreatePostScreen = ({ navigation, route }) => {
  const [postContent, setPostContent] = useState("");
  const [imageUri, setImageUri] = useState("");
  const authToken = route.params.token;

  const uploadToCloudinary = async () => {

    const formData = new FormData();

    let max = 5000;
    let randomNum = Math.random() * max;
    let fileName = `${randomNum}.jpg`;

    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: fileName,
    });

    formData.append("upload_preset", unsignedUploadPreset);

    try {

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dqt8nrkyh/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

      console.log(response);

      return { response, fileName };

    } catch (error) {

      console.error("Error uploading to Cloudinary:", error);
      throw error;

    }
  };

  const createPost = async (media) => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    const imageUrl = await uploadToCloudinary();

    console.log(imageUrl)

    try {

      const response = await fetch(`${SERVER_URL}/post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ media: `https://res.cloudinary.com/dqt8nrkyh/image/upload/posts/${imageUrl.fileName}`, content: postContent }),
    });

      const responseData = await response.json();

      if (!response.ok) {
        Alert.alert("Error", responseData.message || "Failed to create post");
        return;
      }

      Alert.alert("Success", "Post created successfully!");
      navigation.goBack();
    } catch (error) {

      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post");

    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter a description for your post"
        value={postContent}
        onChangeText={setPostContent}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 1,
        }}
      />
      <ImgPicker onImageTaken={(uri) => setImageUri(uri)} />
      <Button
        title="Submit Post"
        onPress={() => {
          if (postContent.trim() === "") {
            Alert.alert("Error", "Please enter a description.");
          } else {
            createPost();
          }
        }}
      />
    </View>
  );
};

const ViewPosts = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        if (!response.ok) {
          Alert.alert("Error", "Failed to fetch post details");
          navigation.goBack();
        }

        setPosts(responseData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        Alert.alert("Error", "Failed to load post details");
        navigation.goBack();
      }
    };

    fetchPosts();
  }, []);

  if (posts.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      {posts.map((post) => (
        <View key={post._id} style={styles.postContainer}>
          {post.media && (
            <Image
              source={{ uri: post.media }}
              style={styles.postImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.postAuth}>{post.authname}</Text>
          <Text style={styles.postText}>{post.content}</Text>
        </View>
      ))}
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
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 12,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  Button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#1E6738",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  postText: {
    fontSize: 16,
    marginTop: 25,
    marginBottom: 10,
  },
  postAuth: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  postImage: {
    width: 300,
    height: 300,
  },
  description: {
    marginBottom: 20,
  },
});
