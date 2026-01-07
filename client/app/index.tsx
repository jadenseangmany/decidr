import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();
    
      return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the App!</Text>
      
      <TouchableOpacity 
        onPress={() => router.push('/RecommenderScreen')}
        style={{ 
          marginTop: 20, 
          padding: 15, 
          backgroundColor: '#41634A', 
          borderRadius: 10 
        }}
      >
        <Text style={{ color: 'white' }}>Open Recommender</Text>
      </TouchableOpacity>
    </View>
  );

}