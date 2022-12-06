import { StyleSheet, Pressable, TouchableOpacity, Text, StatusBar, FlatList, View, TextInput, Switch, ActivityIndicator, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font'
import { useIsFocused } from '@react-navigation/native';

import { db } from '../firebaseConfig'
import { addDoc, getDocs, collection, deleteDoc, query, where } from 'firebase/firestore';

import ShowItems from '../Components/ShowItems';

const Main = (props) => {

    const [fontsLoaded] = useFonts({
        'Nerko': require('../assets/fonts/NerkoOne-Regular.ttf')
    });

    const [defaultStyle, setDefaultStyle] = useState(true)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => (
        setIsEnabled(previousState => !previousState),
        setDefaultStyle(!defaultStyle)
    )

    const [newTodos, setNewTodos] = useState()
    const [isDone, setIsDone] = useState(false)

    const [doTodos, setDoTodos] = useState([])
    const [doneTodos, setDoneTodos] = useState([])

    const getTodos = async () => {

        const q = query(collection(db, "todos"), where("isDone", "==", false));

        const querySnapshot = await getDocs(q);

        setDoTodos(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )

        const q_ = query(collection(db, "todos"), where("isDone", "==", true));

        const qu_ = await getDocs(q_);

        setDoneTodos(
            qu_.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )

    }

    const deleteTodos = async () => {
        const querySnapshot = await getDocs(collection(db, 'todos'))

        querySnapshot.docs.map((doc) => deleteDoc(doc(db, "todos", props.id)))
        getTodos()
    }

    const addTodos = async () => {
        if (newTodos == "") {
            alert("Fill in the blank")
            return
        }

        try {
            await addDoc(collection(db, 'todos'), {
                todos: newTodos,
                isDone: isDone
            })
            setNewTodos("")
        } catch (error) {
            console.log(error.message)
        }
        getTodos()
    }

    useEffect(() => {
        getTodos()
    }, [])

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={defaultStyle ? styles.view : dark.view} >
                <StatusBar
                    animated={true}
                    backgroundColor="#61dafb"
                    barStyle='dark-content'
                    hidden='false'
                />
                <View style={defaultStyle ? styles.header : dark.header}>
                    <TextInput
                        placeholder='Add New To-do'
                        placeholderTextColor='grey'
                        style={defaultStyle ? styles.input : dark.input}
                        value={newTodos}
                        onChangeText={setNewTodos}
                        multiline={true}
                        editable={true}
                    />
                    <TouchableOpacity onPress={() => { addTodos(), Keyboard.dismiss() }} style={defaultStyle ? styles.btn : dark.btn}>
                        <Text style={{fontFamily:'Nerko', fontSize:20}}>ADD</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={defaultStyle ? styles.todoCon : dark.todoCon}>
                        <View style={styles.infoCon}>
                            <View style={defaultStyle ? styles.titleCon : dark.titleCon}>
                                <Text style={defaultStyle ? styles.title : dark.title}>To-Do</Text>
                            </View>
                            <View style={styles.countCon}>
                                <Text style={styles.count}>{Object.keys(doTodos).length}</Text>
                            </View>
                        </View>
                        <View style={styles.listCon}>
                            {doTodos.length > 0 ? (
                                <FlatList
                                    data={doTodos}
                                    renderItem={({ item }) => <ShowItems
                                        Todos={item.todos}
                                        isDone={item.isDone}
                                        id={item.id}
                                        deleteTodos={deleteTodos}
                                        getTodos={getTodos} />}
                                    keyExtractor={item => item.id}
                                />
                            ) : (
                                <ActivityIndicator />
                            )}
                        </View>
                    </View>
                    <View style={defaultStyle ? styles.doneCon : dark.doneCon}>
                        <View style={styles.infoCon}>
                            <View style={defaultStyle ? styles.titleCon : dark.titleCon}>
                                <Text style={defaultStyle ? styles.title : dark.title}>Done</Text>
                            </View>
                            <View style={styles.countCon}>
                                <Text style={styles.count}>{Object.keys(doneTodos).length}</Text>
                            </View>
                        </View>
                        <View style={styles.listCon}>
                            {doneTodos.length > 0 ? (
                                <FlatList
                                    data={doneTodos}
                                    renderItem={({ item }) => <ShowItems
                                        Todos={item.todos}
                                        isDone={item.isDone}
                                        id={item.id}
                                        deleteTodos={deleteTodos}
                                        getTodos={getTodos} />}
                                    keyExtractor={item => item.id}
                                />
                            ) : (
                                <ActivityIndicator />
                            )}
                        </View>
                    </View>
                </View>
                <View style={defaultStyle ? styles.footer : dark.footer}>
                    <View>
                        <Text style={defaultStyle ? styles.mode : dark.mode}>{defaultStyle ? "Dark Mode" : 'Light Mode'}</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#81b0ff", true: "#0f0b59" }}
                        thumbColor={isEnabled ? "#f4f3f4" : "#f5dd4b"}
                        ios_backgroundColor="#81b0ff"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View >

        )
    }
}


const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5'
    },
    statusBar: {
        backgroundColor: 'transparent',
        barStyle: 'dark-content'
    },
    header: {
        backgroundColor: '#fcfccc',
        alignItems: 'center',
        flex: 0.4,
        width: '90%',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        margin: 15,
        flexDirection: 'row',
        borderRadius: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        width: '75%',
        height: '60%',
        backgroundColor: '#ffffff',
        borderRadius: 40,
        borderWidth: 1,
        padding: 10,
        fontFamily:'Nerko',
        fontSize:25
    },
    btn: {
        width: '15%',
        height: '60%',
        borderRadius: 40,
        backgroundColor: '#e7fce3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flex: 4,
        width: '90%',
        justifyContent: 'space-around',
    },
    todoCon: {
        flex: 1,
        margin: 5,
        marginBottom: 10,
        backgroundColor: '#e3fcfc',
        borderRadius: 20,
        padding: 15,
        justifyContent: 'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoCon: {
        flex: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleCon: {
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: 20,
        width: '40%',
        borderWidth: 1
    },
    title: {
        fontSize: 30,
        fontFamily: 'Nerko'
    },
    countCon: {
        width: "15%",
        justifyContent: 'center',
        alignContent: 'center'
    },
    count: {
        fontSize: 40,
        fontFamily: 'Nerko'
    },
    listCon: {
        flex: 4,
        marginTop: 10
    },
    doneCon: {
        flex: 1,
        margin: 5,
        backgroundColor: '#e3fcfc',
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    footer: {
        backgroundColor: '#ffffff',
        flex: 0.2,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
        margin: 10,
        padding: 10,
        borderRadius: 40,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mode: {
        fontSize: 25,
        color: 'black',
        fontFamily: 'Nerko'
    }
})

const dark = StyleSheet.create({
    view: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#232324'
    },
    header: {
        backgroundColor: '#dbdbaf',
        alignItems: 'center',
        flex: 0.4,
        width: '90%',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        margin: 15,
        flexDirection: 'row',
        borderRadius: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        width: '75%',
        height: '60%',
        backgroundColor: '#232324',
        borderRadius: 40,
        borderWidth: 1,
        padding: 10,
        fontFamily:'Nerko',
        fontSize:25
    },
    btn: {
        width: '15%',
        height: '60%',
        borderRadius: 40,
        backgroundColor: '#c9dbc5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    todoCon: {
        flex: 1,
        margin: 5,
        marginBottom: 10,
        backgroundColor: '#c5dbdb',
        borderRadius: 20,
        padding: 15,
        justifyContent: 'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleCon: {
        backgroundColor: '#232324',
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: 20,
        width: '40%',
        borderWidth: 1,
        fontFamily: 'Nerko'
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'Nerko'
    },
    doneCon: {
        flex: 1,
        margin: 5,
        backgroundColor: '#c5dbdb',
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    footer: {
        backgroundColor: '#7a7979',
        flex: 0.2,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
        margin: 10,
        padding: 10,
        borderRadius: 40,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mode: {
        fontSize: 25,
        color: 'white',
        fontFamily: 'Nerko'
    }
})

export default Main