import React, {useEffect, useState} from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import DoneTick from "@/components/buttons/doneTick";
import PlusIcon from "@/components/buttons/plusIcon";
import {fetchTasks, deleteTask, postTask, putTask} from "@/functions/requests";
import {List, Task} from "@/app/types";
import {HStack} from "@/components/ui/hstack";
import {Input, InputField} from "@/components/ui/input";
import {Text} from "@/components/ui/text";


interface ListScreenProps {
    list: List;
}

const ListScreen: React.FC<ListScreenProps> = ({list}: ListScreenProps) => {
    const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
    const [reRender, setReRender] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [inputVal, setInputVal] = useState("");

    // Add a new task
    const addTask = async () => {
        const response = await postTask(list.listId, "New Task");
        if (response != null) {
            setReRender(!reRender);
            setEditingId(response);
        }
    };


    const updateTasks = async () => {
        const newTasks = await fetchTasks(list.listId);
        let areEqual = newTasks.length == displayTasks.length &&
            newTasks.every((value) => {
                const existingTask = displayTasks.find(task => task.taskId === value.taskId);
                return existingTask && existingTask.taskBody === value.taskBody;
            });
        if (!areEqual) {
            setDisplayTasks(newTasks);
        }
    }


    // Render each task
    const renderItem = ({item}: { item: Task }) => {
        const handleCancelEditing = () => {
            setEditingId(undefined);
        }
        const rmTask = async () => {
            const wasSuccesful = await deleteTask(list.listId, item.taskId);
            if (wasSuccesful) {

                setReRender(!reRender);
            }
        }
        const handleEndEditing = async () => {
            setEditingId(undefined);
            if (inputVal.trim() !== item.taskBody) {
                const wasSuccesful = await putTask(list.listId, item.taskId, inputVal);
                if (wasSuccesful) {
                    setReRender(!reRender);
                }
            }
        }
        const startEditing = () => {
            setEditingId(item.taskId);
        }
        return (
            <View style={{marginBottom:20, height: 40}}>
            <HStack style={{alignItems: "center", flex: 1, paddingHorizontal: 10}}>
                <TouchableOpacity onPress={rmTask}>

                    <DoneTick width={20} height={20}/>

                </TouchableOpacity>
                <View style={{marginLeft: 10, flex:1, marginRight:"3%"}}>
                    {editingId == item.taskId ?
                        <Input size="sm" style={{flex:1}} variant={"underlined"}>
                            <InputField placeholder={item.taskBody} onChangeText={setInputVal}
                                        onSubmitEditing={handleEndEditing} onBlur={handleCancelEditing}/>
                        </Input>
                        :
                        <TouchableOpacity onPress={startEditing}>
                            <Text size={"md"}>
                                {item.taskBody}
                            </Text>
                        </TouchableOpacity>
                    }

                </View>

            </HStack>
            </View>
        )
    }


    useEffect(() => {
        updateTasks();
        const updateInterval = setInterval(updateTasks, 5000);
        return () => {
            clearInterval(updateInterval);
        };
    }, [list, reRender]);


    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>{list.listName}</Text>
            </View>


            {/* Task List */}
            <FlatList
                data={displayTasks}
                keyExtractor={(item) => item.taskId.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />

            {/* Bottom Bar */}
            <View style={styles.bttmBar}>
                <TouchableOpacity onPress={addTask} style={styles.addButton}>
                    <PlusIcon color="purple"/>
                </TouchableOpacity>
                <Text style={{marginLeft: 20, fontSize: 15, color: "purple"}}>
                    Add Tasks
                </Text>
            </View>
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskItem: {
        padding: 10,
        fontSize: 15,
        borderBottomWidth: 1,
        borderColor: "grey",
        marginLeft: 5,
        marginRight: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
        left: 5,
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        height: 30,
        width: 30,
        left: 10,
    },
    taskInput: {
        marginLeft: 10,
        fontSize: 15,
        color: "black",
        flex: 1,
        padding: 5,
    },

    bttmBar: {
        position: "absolute",
        height: 60,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    topBar: {
        height: 60,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 5,
    },
});

export default ListScreen;
