import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import ListScreen from "@/components/screens/ListScreen"
import ArrowRight from "@/components/buttons/arrowRight";
import ArrowLeft from "@/components/buttons/arrowLeft";
import PlusIcon from "@/components/buttons/plusIcon";
import Sample from "@/components/listIcons/sample";
import {fetchList, fetchTasks} from "@/functions/requests";
import {List, Task} from "@/app/types";
import {Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerHeader} from "@/components/ui/drawer";
import {Heading} from "@/components/ui/heading";
import {Icon, MenuIcon} from "@/components/ui/icon";
import {Box} from "@/components/ui/box";
import {HStack} from "@/components/ui/hstack";


export default function Index() {
    const [isSideBarVisible, setSideBarVisible] = useState<boolean>(true);
    const [listContainer, setListContainer] = useState<List[]>([]);
    const [displayedList, setDisplayedList] = useState<List>({listName: "TaskDump", listId: 0});


    // Add a new list to the listContainer and increment the listCounter
    const addList = () => {
        /**const newList: List = {id: listCounter, title: "New List",};
         setListCounter(prevState => prevState + 1);
         setListContainer((prevState) => [...prevState, newList]);
         */
    }


    const renderLists = ({item}: { item: List }) => (
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
        if (initList) {
            setDisplayedList(initList);
        }
        const listInterval = setInterval(updateList, 5000)
        return () => {
            clearInterval(listInterval)
        }
    }, [])


    return (
        <View style={{flex: 1, backgroundColor: "white"}}>


            <HStack style={{flex: 1}}>
                <Box style={styles.topBar}>
                    <TouchableOpacity onPress={() => {
                        setSideBarVisible(true)
                    }}>
                        <Icon as={MenuIcon} size="xl"/>
                    </TouchableOpacity>

                </Box>


                {/* SideBar*/}
                <Box>
                    <Drawer isOpen={isSideBarVisible}
                            onClose={() => setSideBarVisible(false)}
                            size="md"
                            anchor="left">
                        <DrawerBackdrop/>
                        <DrawerContent>
                            <DrawerHeader>
                                <Heading size="lg">
                                    Lists
                                </Heading>
                            </DrawerHeader>
                            <DrawerBody>

                                <FlatList
                                    data={listContainer}
                                    keyExtractor={item => item.listId.toString()}
                                    renderItem={({item}) => (
                                        renderLists({item})
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>


                    {/* ListContainer*/}


                </Box>
                <Box style={{flex: 1}}>
                    <ListScreen list={displayedList}/>
                </Box>
            </HStack>
        </View>

    )

}

const styles = StyleSheet.create({
    topBar: {
        width: "5%",
        height: 60,
        backgroundColor:
            'white', // Header background color
        justifyContent: 'center',
        alignItems: 'center',
    }
    ,
    listItem: {
        fontSize: 20,
        color:
            "black", // Add consistent text color
        marginLeft:
            10, // Add padding for spacing
    }
    ,
    listItemContainer: {
        flexDirection: "row",
        alignItems:
            "center", // Ensures consistent spacing
        padding:
            10, // Add padding for spacing
                // Consistent bottom border
        borderColor:
            "grey",
    }
    ,
    icon: {
        color: 'black',
        width:
            30,
        height:
            30,
        marginRight:
            10, // Space between icon and text
    }
    ,
    menuButton: {
        color: 'black',
        width:
            50,
        height:
            50,
    }
    ,
});








