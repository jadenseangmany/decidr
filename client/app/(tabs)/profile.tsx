import { ScrollView, StyleSheet, View, Image, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme'
import { useRouter } from 'expo-router';


const mockRestaurants = [
    {
        restaurant_id: '1',
        name: "In n out",
        cuisine: "Italian",
        location: "La J, CA",
        dateVisited: '2026-01-05',
        rating: 4,
        image: require('@/assets/images/in-n-out.jpg')
    },
    {
        restaurant_id: '2',
        name: "CFA",
        cuisine: "American",
        location: "SD, CA",
        dateVisited: '2026-01-06',
        rating: 5,
        image: require('@/assets/images/cfa.webp')
    },
    
    {
        restaurant_id: '3',
        name: "Chipotle",
        cuisine: "Mexican",
        location: "Sacramento, CA",
        dateVisited: '2026-01-05',
        rating: 2,
        image:require('@/assets/images/chipotle.jpeg')
    }
]



export default function ProfileScreen() {
    const router = useRouter();
    
    return (
        <ScrollView style = {styles.container}>
            {/* Header & App name */}
            <View style={styles.header}>
                <Pressable style={({ pressed }) => [styles.headerButton, pressed && {transform:[{ scale: 0.8 }] }]} 
                    onPress={() => console.log('Settings pressed')}>
                    <Ionicons name="settings" size={40} color='#000' />
                </Pressable>
                
                <Pressable style={({ pressed }) => [pressed && {transform:[{scale:0.95 }] }]}
                    onPress={() => console.log('Decidr pressed')}>
                    <Text style={styles.appName}>Decidr</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.headerButton,pressed && { transform:[{ scale: 0.9 }]} ]} 
                    onPress={() => console.log('Home pressed')}>
                    <Ionicons name="home" size={40} color='#000'/>
                </Pressable>
            </View>
            {/* Profile Section */}
            <View style ={styles.profile}>
                <Pressable style={styles.profilePictureBorder}>
                    <Image
                        source={require('@/assets/images/profile-pic-icon.png')}
                        style={styles.profileImage}
                    />
                </Pressable>
                <View style={styles.usernameBorder} >
                    <Text style={styles.username}>sandramescad0</Text>
                </View>
            </View>
            {/* Restaurant History Section */}
            <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantText}>Restaurant History</Text>
            </View>
            <View style={styles.restaurantContainer}>
                {mockRestaurants.map((restaurant) => (
                    <View key={restaurant.restaurant_id} style={styles.restaurantCard}>
                        {/* Restaurant Image */}
                        <Image 
                            source={restaurant.image || require('@/assets/images/placeholder-restaurant.jpeg')}  
                            style={styles.restaurantImage}
                        />
                        
                        {/* Restaurant Info */}
                        <View style={styles.restaurantInfo}>
                            <View style={styles.restaurantNameContainer}>
                                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                            </View>
                            <Text style={styles.restaurantDetail}>🍴 {restaurant.cuisine}</Text>
                            <Text style={styles.restaurantDetail}>📍 {restaurant.location}</Text>
                            <Text style={styles.restaurantDetail}>📅 {new Date(restaurant.dateVisited).toLocaleDateString()}</Text>
                            <Text style={styles.restaurantRating}>👍 {'⭐'.repeat(Math.floor(restaurant.rating))}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#FFFDF9",
    },
    header:{
        backgroundColor: AppColors.primaryGreen,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
        paddingTop: 10,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    headerButton: {
        padding: 10,
       // marginTop: 2,
        width: 55,
        shadowColor: "#333",
        shadowOffset: {width:2, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
        marginHorizontal: 20,
    },
    appName: {
        flex:1,
        textAlign: 'center',
        marginTop: 0,
        paddingVertical:20,
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        shadowColor: "#333",
        shadowOffset: {width:0, height: 4},
        shadowOpacity: 0.7,
        shadowRadius: 3,
        fontFamily: 'KetchupManis'
    },

    profile: {
        alignItems: 'center',
    },
    profilePictureBorder: {
        width:102,
        height:102,
        borderRadius:51,
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
        borderWidth:4,
        borderColor: AppColors.primaryYellow,
        marginBottom: 20,
        overflow:"hidden",
       
        
    },
    profileImage:{
        width: 110,
        height: 115,
        borderRadius: 50,
        overflow:"hidden",
    },
    usernameBorder:{
        borderWidth: 2,
        borderRadius:10,
        width: 200,
        alignItems: 'center',
        paddingHorizontal:12,
        paddingVertical:4,
        borderColor: AppColors.primaryYellow,
        backgroundColor: AppColors.appBackground,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    username:{
        fontSize: 15,
        //fontWeight: 'bold',
        alignItems: 'center',
        fontFamily: 'Quicksand',
        fontWeight: '600' 
    },
    restaurantHeader: {
        marginLeft: 25,
        marginTop: 50,
        flexWrap: 'wrap',
    },
    restaurantText: {
        fontSize: 24,
        fontFamily: 'KetchupManis',
        fontWeight: 'bold',
        borderBottomWidth:2,
        borderBottomColor: '#000',
        paddingBottom: 2,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    restaurantContainer:{
        backgroundColor: AppColors.appBackground,
        borderRadius:15,
        marginHorizontal: 20,
        marginVertical:15,
        borderWidth: 2,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderColor: AppColors.primaryYellow,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        
    },
    //
    restaurantCard:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        marginHorizontal: 15,
        width: '90%',
        alignSelf: 'center',
        borderWidth:1.5,
        borderColor: AppColors.primaryYellow,
        backgroundColor: '#FFFDF9',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3
    },
    restaurantImage:{
      width: 120,
      height: 100,
      borderRadius: 8,
      borderWidth:1,
      borderColor:AppColors.primaryYellow,
      marginLeft:10,
      marginRight: 20
    },
    restaurantInfo:{
       flex: 1,
       justifyContent: 'center'
    },
    restaurantNameContainer:{
        alignSelf: 'flex-start',      
    },
    restaurantName:{
        fontSize: 17,
        fontFamily:'KetchupManis',
        color:"#1F1F1F",
        borderBottomWidth: 1.5,
        borderBottomColor: '#1F1F1F',
        marginBottom: 6,
       // paddingBottom:4,
       
    },
    restaurantDetail:{
        fontSize: 14,
        fontFamily:'QuickSand',
        fontWeight: '600',
        marginBottom:6,
    },
    restaurantRating:{
       fontSize:14,
       fontWeight: '600',
    },  
})