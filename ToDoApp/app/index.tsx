import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import ListScreen from "@/components/screens/ListScreen"
import {deleteList, fetchList, postList, putList} from "@/functions/requests";
import {List} from "@/app/types";
import {Text} from "@/components/ui/text"
import {Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerHeader} from "@/components/ui/drawer";
import {Heading} from "@/components/ui/heading";
import {EditIcon, Icon, MenuIcon, StarIcon, ThreeDotsIcon, TrashIcon} from "@/components/ui/icon";
import {Box} from "@/components/ui/box";
import {HStack} from "@/components/ui/hstack";
import {Menu, MenuItem, MenuItemLabel} from "@/components/ui/menu";
import {Button, ButtonIcon} from "@/components/ui/button";
import {Input, InputField} from "@/components/ui/input";
import PlusIcon from "@/components/buttons/plusIcon";


export default function Index() {
    const [isSideBarVisible, setSideBarVisible] = useState<boolean>(true);
    const [listContainer, setListContainer] = useState<List[]>([]);
    const [displayedList, setDisplayedList] = useState<List>({listName: "TaskDump", listId: 0});
    const [reRender, setReRender] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [inputVal, setInputVal] = useState<string>("");


    const renderLists = ({item}: { item: List }) => {
        const handleCancelEdit = () => {
            setEditingId(undefined);
        }
        const handleEndEditing = async () => {
            setEditingId(undefined); // Exit editing mode
            if (inputVal.trim() !== item.listName) {
                // Only update if the name has changed
                const wasSuccessful = await putList(item.listId, inputVal);
                if (wasSuccessful) {
                    setReRender(!reRender); // Re-render the list
                }
            }
        };

        const rmList = async () => {
            const wasSuccesful = await deleteList(item.listId);
            if (wasSuccesful) {
                setReRender(!reRender);
            }
        }
        return (
            <HStack style={{justifyContent: "space-between", alignItems: "center", flex: 1, paddingHorizontal: 10}}>
                <TouchableOpacity onPress={() => {
                    setDisplayedList(item);
                }}>
                    <HStack style={{alignItems: "center"}} space="sm">
                        <Icon as={StarIcon}/>
                        {editingId == item.listId ?


                            <Input size="sm" style={{width: "60%"}} variant={"underlined"}>
                                <InputField placeholder={item.listName} onChangeText={setInputVal}
                                            onSubmitEditing={handleEndEditing} onBlur={handleCancelEdit}/>

                            </Input>
                            :
                            <Text size={"md"}>{item.listName}</Text>
                        }
                    </HStack>
                </TouchableOpacity>
                <Menu placement="bottom right"
                      trigger={({...triggerProps}) => {
                          return (
                              <Button {...triggerProps} size="sm" variant="link"
                                      style={{transform: [{rotate: '90deg'}]}}>
                                  <ButtonIcon as={ThreeDotsIcon}/>
                              </Button>
                          )
                      }}
                      style={styles.menuItemMenu}
                >
                    <MenuItem closeOnSelect={true} onPress={rmList} style={styles.menuItem}>
                        <Icon as={TrashIcon}/>
                        <MenuItemLabel size={"sm"} style={styles.menuItemLabel}>
                            Delete
                        </MenuItemLabel>
                    </MenuItem>
                    <MenuItem closeOnSelect={true} style={styles.menuItem} onPress={() => {
                        setEditingId(item.listId);
                    }}>
                        <Icon as={EditIcon}/>
                        <MenuItemLabel size={"sm"} style={styles.menuItemLabel}>
                            Rename
                        </MenuItemLabel>
                    </MenuItem>


                </Menu>
            </HStack>

        )
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

    const addList = async () => {
        const response = await postList("New List");
        if (response != null) {
            setReRender(!reRender);
            setEditingId(response);
        }
    };

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
    }, [reRender])


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
                            onClose={() => {
                                setSideBarVisible(false);
                                setEditingId(undefined);
                            }}
                            size="sm"
                            anchor="left">
                        <DrawerBackdrop/>
                        <DrawerContent>
                            <DrawerHeader>
                                <Heading size="lg">
                                    Lists
                                </Heading>
                                <Button size={"xs"} variant="link" style={{width: "10%"}} onPress={addList}>
                                    <ButtonIcon as={PlusIcon}/>
                                </Button>
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
    menuItemLabel: {
        flex: 1,
        textAlign: 'left',
        marginLeft: 10
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',           // Centers the items vertically
        paddingVertical: 8,             // Adds spacing above and below
        paddingHorizontal: 16,          // Adds spacing on the sides
        borderRadius: 8,
    },
    topBar: {
        width: "5%",
        height: 60,
        backgroundColor:
            'white', // Header background color
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemMenu: {
        right: 10,
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








