import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import ListScreen from "@/components/screens/ListScreen"
import ArrowRight from "@/components/buttons/arrowRight";
import ArrowLeft from "@/components/buttons/arrowLeft";
import PlusIcon from "@/components/buttons/plusIcon";
import Sample from "@/components/listIcons/sample";
import {fetchList, fetchTasks} from "@/functions/requests";
import {List, Task} from "@/app/types";





export default function Index() {
    const [isSideBarVisible, setSideBarVisible] = useState<boolean>(false);
    const [listContainer, setListContainer] = useState<List[]>([]);
    const [displayedList, setDisplayedList] = useState<List>({listName: "", listId: 0});
    const [displayTasks, setDisplayTasks] = useState<Task[]>([]);

    // Add a new list to the listContainer and increment the listCounter
    const addList = () => {
        /**const newList: List = {id: listCounter, title: "New List",};
         setListCounter(prevState => prevState + 1);
         setListContainer((prevState) => [...prevState, newList]);
         */
    }


    const renderList = ({item}: { item: List }) => (
        <TouchableOpacity onPress={() => {
            setDisplayedList(item);
        }}>
            {/*Add rendering for icons*/}
            {isSideBarVisible
                ?
                <View style={styles.listItemContainer}>
                    <Sample style={styles.icon}/>
                    <Text style={styles.listItem}>{item.listName}</Text>
                </View>
                :
                <View style={styles.listItemContainer}>
                    <Sample style={styles.icon}/>
                </View>
            }
        </TouchableOpacity>
    )

    const updateTasks = async () => {
        const newTasks = await fetchTasks(displayedList.listId);
        let areEqual = newTasks.length == displayTasks.length &&
            newTasks.every((value) => {
                const existingTask = displayTasks.find(task => task.taskId === value.taskId);
                return existingTask && existingTask.taskBody === value.taskBody;
            });
        if (!areEqual) {
            setDisplayTasks(newTasks);
        }
    }

    const updateList = async () => {
        const newListArray = await fetchList();
        let areEqual = newListArray.length == listContainer.length &&
            newListArray.every((value) => {
                const existingList = listContainer.find(list => list.listId === value.listId);
                return existingList && existingList.listName === value.listName;
            });
        if (!areEqual) {
            setListContainer(newListArray);
        }
    }



    useEffect(() => {
        updateList();
        const initList = listContainer.find(list => list.listId === 0);
        if (initList){
            setDisplayedList(initList);
        }
        updateTasks();
        const listInterval = setInterval(updateList, 5000)
        const taskInterval = setInterval(updateTasks, 5000)
        return () => {
            clearInterval(listInterval);
            clearInterval(taskInterval);
        }
    }, [])


    return (

        <View style={{flex: 1, backgroundColor: "white"}}>
            {/* TopBar*/}
            <View style={styles.topBar}>
            </View>

            {/* Main Content*/}
            <View style={{flexDirection: "row", flex: 1}}>

                {/* SideBar*/}
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
                                <PlusIcon color="grey " height={40} width={40}/>
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
                    {/* ListContainer*/}
                    <View style={{flex: 1}}>
                        <FlatList
                            data={listContainer}
                            keyExtractor={(item) => item.listId.toString()}
                            renderItem={({item}) => (
                                renderList({item})
                            )}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                </View>
                <View style={{flex: 1}}>
                    <ListScreen title={displayedList.listName}/>
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
    listItem: {
        fontSize: 20,
        color: "black", // Add consistent text color
        marginLeft: 10, // Add padding for spacing
    },
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center", // Ensures consistent spacing
        padding: 10, // Add padding for spacing
        // Consistent bottom border
        borderColor: "grey",
    },
    icon: {
        color: 'black',
        width: 30,
        height: 30,
        marginRight: 10, // Space between icon and text
    },
    menuButton: {
        color: 'black',
        width: 50,
        height: 50,
    },
});








