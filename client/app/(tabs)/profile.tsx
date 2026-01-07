import { ScrollView, StyleSheet, View, Image, Pressable } from 'react-native'
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {AppColors } from '@/constants/theme'


const mockRestaurants = [
    {
        restaurant_id: '1',
        name: "In n out",
        cuisine: "Italian",
        location: "LA, CA",
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
    return (
        <ScrollView style = {styles.container}>
            {/* Header & App name */}
            <View style={styles.header}>
                <Pressable style={styles.headerButton}>
                    <IconSymbol name = "gearshape.fill" size={40} color='#000' />
                </Pressable>
                <ThemedText style={styles.appName}>Decidr</ThemedText>
                <Pressable style={styles.headerButton}>
                    <IconSymbol name="house.fill" size={40} color='#000'/>
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
                    <ThemedText style={styles.username}>sandramescad0</ThemedText>
                </View>
            </View>
            {/* Restaurant History Section */}
            <View style={styles.restaurantHeader}>  
                <ThemedText style={styles.restaurantText}>Restaurant History</ThemedText>
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
                                <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
                            </View>
                            <ThemedText style={styles.restaurantDetail}>🍴 {restaurant.cuisine}</ThemedText>
                            <ThemedText style={styles.restaurantDetail}>📍 {restaurant.location}</ThemedText>   
                            <ThemedText style={styles.restaurantDetail}>📅 {new Date(restaurant.dateVisited).toLocaleDateString()}</ThemedText>
                            <ThemedText style={styles.restaurantRating}>👍 {'⭐'.repeat(Math.floor(restaurant.rating))}</ThemedText>
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 0,
        paddingTop:15,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    headerButton: {
        padding: 10,
        marginTop: 15,
        width: 55,
        shadowColor: "#333",
        shadowOffset: {width:2, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
        
    },
    appName: {
        flex:1,
        textAlign: 'center',
        marginTop: 40,
        paddingVertical:20,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.7,
        shadowRadius: 3,
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
        borderRadius: 50
    },
    usernameBorder:{
        borderWidth: 2,
        borderRadius:10,
        width: 200,
        alignItems: 'center',
        paddingHorizontal:12,
        borderColor: AppColors.primaryYellow,
        backgroundColor: AppColors.appBackground,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    username:{
        fontSize: 15,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    restaurantHeader: {
        marginLeft: 25,
        marginTop: 40,
        flexWrap: 'wrap',
    },
    restaurantText: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth:2,
        borderBottomColor: '#000',
        paddingBottom: 2,
        shadowColor: "#333",
        shadowOffset: {width:0, height: 3},
        shadowOpacity: 0.5,
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
        fontSize: 15,
        fontWeight: 'bold',
        borderBottomWidth: 1.5,
        borderBottomColor: '#000',
        marginBottom: 4,
       // paddingBottom:4,
       
    },
    restaurantDetail:{
        fontSize: 12,
        fontWeight: '600',
        marginBottom:2,
    },
    restaurantRating:{
       fontSize:12,
       fontWeight: '600',
    },  
})