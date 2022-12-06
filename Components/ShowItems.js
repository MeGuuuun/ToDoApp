import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useEffect, useState } from 'react'

import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font'

import { db } from '../firebaseConfig';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const ShowItems = (props) => {
    const [fontsLoaded] = useFonts({
        'Nerko': require('../assets/fonts/NerkoOne-Regular.ttf')
    });

    const [isDone, setIsDone] = useState(props.isDone)

    const updateIsDone = async () => {
        const ref = doc(db, "todos", props.id)

        await updateDoc(ref, {
            isDone: isDone,
        })
    }

    useEffect(() => {
        updateIsDone();
        props.getTodos()
    }, [isDone])

    const deleteTodos = async () => {
        await deleteDoc(doc(db, "todos", props.id))
        props.getTodos()
    }

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <Pressable onPress={() => setIsDone(!isDone)}>
                    {isDone ? (
                        <AntDesign name="checkcircle" size={24} color='black'></AntDesign>
                    ) : (
                        <AntDesign name="checkcircleo" size={24} color='black'></AntDesign>
                    )}
                </Pressable>
                <Text style={props.isDone ? styles.grey : styles.black}>{props.Todos}</Text>
                <Pressable onPress={deleteTodos}>
                    <MaterialIcons name="delete" size={24} color='black'></MaterialIcons>
                </Pressable>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10,
        alignItem: 'center',
        width: "100%",
        alignSelf: 'center',
        borderRadius: 20,
    },
    black: {
        fontFamily: 'Nerko',
        flex: 1,
        fontSize: 20,
        marginLeft: 10,
        color: 'black',
    },
    grey: {
        flex: 1,
        fontSize: 20,
        marginLeft: 10,
        fontFamily: 'Nerko',
        color: 'grey',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    }
})

export default ShowItems