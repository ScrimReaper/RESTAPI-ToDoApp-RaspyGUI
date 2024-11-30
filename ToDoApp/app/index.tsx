import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput} from "react-native";
import ListScreen from "@/components/screens/ListScreen";
import {createDrawerNavigator} from '@react-navigation/drawer';
import ArrowRight from "@/components/buttons/arrowRight";
import ArrowLeft from "@/components/buttons/arrowLeft";
import PlusIcon from "@/components/buttons/plusIcon";


export default function Index() {

    const [listContainer, setListContainer] = useState<React.JSX.Element[]>([]);
    const [listCounter, setListCounter] = useState<number>(0);
    const [isSideBarVisible, setSideBarVisible] = useState<boolean>(false);
    const addList = () => {
        const newList: React.JSX.Element = (
            <ListScreen key={listCounter} title={`List ${listCounter + 1}`}/>
        )
        setListCounter(prevState => prevState + 1);
        setListContainer((prevState) => [...prevState, newList]);
    }



    return (

        <View style={{flex: 1, backgroundColor: "white"}}>
            <View style={styles.topBar}>

            </View>
            <View style={{flexDirection: "row", flex: 1}}>
                <View style={{
                    width: isSideBarVisible ? 200 : 60,
                    borderRightWidth: 1,
                    borderColor: "grey",
                    position: "relative"
                }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between", // Space between the PlusIcon (if visible) and Arrow
                            padding: 10,
                        }}
                    >
                        {/* PlusIcon only when the sidebar is visible */}
                        {isSideBarVisible && (
                            <TouchableOpacity onPress={addList}>
                                <PlusIcon color="purple" height={40} width={40}/>
                            </TouchableOpacity>
                        )}

                        {/* ArrowLeft or ArrowRight */}
                        {isSideBarVisible ? (
                            <TouchableOpacity
                                onPress={() => setSideBarVisible(!isSideBarVisible)}
                                style={{
                                    position: "absolute", // Keep absolute positioning for ArrowLeft
                                    right: 10, // Adjust to your needs
                                    top: 10,
                                }}
                            >
                                <ArrowLeft
                                    style={{
                                        color: "black",
                                        width: 40,
                                        height: 40,
                                    }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setSideBarVisible(!isSideBarVisible)}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1, // Keep center alignment for ArrowRight
                                }}
                            >
                                <ArrowRight
                                    style={{
                                        color: "black",
                                        width: 40,
                                        height: 40,
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{flex: 1}}>
                    </View>

                </View>
                <View style={{flex: 1}}>
                    <ListScreen title="TaskDump"/>
                </View>
            </View>
        </View>

    )

}

const styles = StyleSheet.create({
    topBar: {
        height: 60,
        backgroundColor: 'white', // Header background color
        flexDirection: 'row',       // Row layout for title and button
        alignItems: 'center',       // Center items vertically
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'grey',
        marginLeft: 5,
        marginRight: 5,

    },
    menuButton: {
        color: 'black',
        width: 50,
        height: 50,
    }
})







