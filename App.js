import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ThemeProvider, Button} from 'react-native-ios-kit';
import {
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';

const App = () => {
  const [text, setText] = useState('');
  const [story, setStory] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setStory(data.result);
      setText('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <LinearGradient colors={['#aaffa9', '#11ffbd']} style={{flex: 1}}>
        <ActivityIndicator size="large" color="#000" />
      </LinearGradient>
    );
  }

  const splitStory = story?.text
    .split(/\r?\n/)
    .filter(item => item !== ', ' && Boolean(item));
  console.log({splitStory, isLoading});

  return (
    <LinearGradient colors={['#aaffa9', '#11ffbd']} style={{flex: 1}}>
      {!story && (
        <SafeAreaView style={styles.safeArea}>
          <TextInput
            style={styles.input}
            placeholder="Enter story plot"
            onChangeText={text => setText(text)}
            value={text}
            numberOfLines={4}
            multiline={true}
          />
          <Button inverted rounded onPress={onSubmit}>
            Create story
          </Button>
        </SafeAreaView>
      )}

      <ScrollView style={styles.sectionContainer}>
        {splitStory?.map((item, index) => {
          return (
            <View style={{flex: 1}}>
              <Text style={styles.text}>{item}</Text>

              {story?.images.length > index && (
                <View style={styles.imageWrapper}>
                  <Image
                    key={index}
                    style={styles.image}
                    source={{
                      uri: story?.images[index],
                    }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginVertical: 32,
    padding: 24,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  text: {
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: 'gray',
    width: '80%',
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 24,
  },
});

export default App;
