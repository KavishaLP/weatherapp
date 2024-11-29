import { StatusBar } from 'expo-status-bar';  // Provides control over the appearance of the status bar.
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, ImageBackground } from 'react-native';   // Helps define and organize styles for the app.
import { useState } from 'react';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  const [city, setCity] = useState(''); // city: Stores the city name input by the user.
  const [weather, setWeather] = useState(null); // weather: Stores the weather data fetched from the API.
  const [loading, setLoading] = useState(false); // loading: Tracks whether the app is currently fetching data to disable the search button during the process.

  const API_KEY = '77ee352c99a01f8c0749f12f759c1840'; 

  // Weather Search Function
  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setLoading(true);    // Set loading to true to indicate fetching data.
    try {
      console.log('Fetching weather for:', city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      console.log('API Response:', data);

      if (!response.ok) {
        console.log('Response not OK:', response.status);
        throw new Error('City not found');
      }

      setWeather({
        temp: Math.round(data.main.temp),
        conditions: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
      console.log('Weather state set:', weather);
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Error', 'City not found or error fetching weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('./assets/OIP2.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Weather Search</Text>
            <Text style={styles.subtitle}>Check weather anywhere</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder='Enter city name'
              value={city}
              onChangeText={setCity}
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              style={[styles.searchButton, loading && styles.disabledButton]} 
              onPress={searchWeather}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Search'}</Text>
            </TouchableOpacity>
          </View>
          
          {weather && (
            
            <View style={styles.weatherContainer}>
              <View style={styles.tempContainer}>
                <Text style={styles.tempText}>Temperature: {weather.temp}°C</Text>
              </View>
              <Text style={styles.weatherText}>Conditions: {weather.conditions}</Text>
              <Text style={styles.weatherText}>Wind Speed: {weather.windSpeed} m/s</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image scales properly
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
    paddingHorizontal: 15, // Slightly reduced padding for small screens
  },
  titleContainer: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: windowWidth * 0.06,
    marginBottom: 30,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: windowWidth * 0.06, // Dynamic font size based on screen width
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15%',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    maxWidth: windowWidth * 0.7, // Added maxWidth for flexibility
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  weatherContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: windowWidth * 0.02, // Dynamic padding based on screen size
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20, // Added padding to ensure content isn't cut off at the bottom
  },
  tempContainer: {
    backgroundColor: '#007AFF', // Highlighted background color
    padding: 15,               // Add padding for spacing
    borderRadius: 10,          // Rounded corners
    marginBottom: 10,          // Space below the temperature container
    alignItems: 'center',      // Center the text
    shadowColor: '#000',       // Add shadow for a nice effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tempText: {
    fontSize: 25,              // Larger font size for emphasis
    fontWeight: 'bold',        // Bold text for visibility
    color: '#fff',             // Text color for contrast
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Subtle text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
