import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';

import {db} from './firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, where, query, singleDoc } from "firebase/firestore";

export default function App() {
  const [addName, setAddName] = useState('');
  const [addAge, setAddAge] = useState('');
  const [users, setUsers] = useState();
  const [id, setID] = useState();

  const deletefromDB = async ()=> {
    try {
      const docRef = doc(db,"user",id);
      await deleteDoc(docRef);
      alert("Deleted!!")
      readFromDB()
    }catch(error){
      console.log(error.message)
    }
  }

  const updateDB = async ()=> {
    try {
      const docRef = doc(db, "user", id);
      await updateDoc(docRef, {
        addName: addName,
        addAge: addAge
      });
      alert("updated!!")
      readFromDB()
    }catch(error){
      console.log(error.message)
    }
  }

  
  const readFromDB = async () => {
    try {
      const data = await getDocs(collection(db, "user"))
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id})))
    }catch(error){
      console.log(error.message)
    }
  }

  const addtoDB = async () => {
    try {
      await addDoc(collection(db, "user"),{
        addName : addName,
        addAge : addAge,
        createdAt: new Date(),
      });
      alert("Added")
      setAddName("")
      setAddAge("")
    }catch(error){
      console.log(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder = "name"
        value = {addName}
        onChangeText = {setAddName}
      />
      <TextInput
        placeholder = "age"
        value = {addAge}
        onChangeText = {setAddAge}
      />
      <Button title = "Add Text" onPress={addtoDB} />
      <Button title = "Read Text" onPress={readFromDB} />
      {users?.map((row,idx)=> {
        return (
          <>
            <Text>User - {idx}</Text>
            <Text>{row.id}</Text>
            <Text>{row.addName}</Text>
            <Text>{row.addAge}</Text>
          </>
        );
      })}
      <Button title = "Update Text" onPress={updateDB} />
      <TextInput
        placeholder='Update ID'
        value={id}
        onChangeText={setID}
      />
      <TextInput
        placeholder='name'
        value={addName}
        onChangeText={setAddName}
      />
      <TextInput
        placeholder='age'
        value={addAge}
        onChangeText={setAddAge}
      />
      <Button title = "Delete Text" onPress={deletefromDB} />
      <TextInput
        placeholder='Delete ID'
        value={id}
        onChangeText={setID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  }
});
