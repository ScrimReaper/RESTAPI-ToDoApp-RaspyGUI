import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet, TextInput,
} from "react-native";
import AddPopUp from "@/components/popUps/addPopUp";
import DoneTick from "@/components/buttons/doneTick";
import PlusIcon from "@/components/buttons/plusIcon";
import {fetchTasks, deleteTask} from "@/functions/requests";
import {List, Task} from "@/app/types";


interface ListScreenProps {
    list: List;
}

const ListScreen: React.FC<ListScreenProps> = ({list}: ListScreenProps) => {
    const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);
    const inputRef = useRef<TextInput | null>(null);
    const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
    const [reRender, setReRender] = useState<boolean>(false);

    // Add a new task
    const addTask = () => {
        /*const newTask = {id: taskIDCounter.toString(), name: ""};
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTaskIDCounter((prevID) => prevID + 1);

        setTimeout(() => inputRef.current?.focus(), 100);

         */
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
    const renderItem = ({item}: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={async () => {
                const wasSuccesful = await deleteTask(list.listId, item.taskId);
                if (wasSuccesful) {

                    setReRender(!reRender);
                }
            }}>
                <DoneTick color="black" width={20} height={20}/>
            </TouchableOpacity>

            <TextInput
                ref={inputRef}
                style={styles.taskInput}
                value={item.taskBody}
                multiline={false}
                returnKeyType="done"
            />
        </View>
    );

    useEffect(() => {
        updateTasks();
        const updateInterval = setInterval(updateTasks, 5000);
        return () => {
            clearInterval(updateInterval);
        };
    }, [list,reRender]);


    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>{list.listName}</Text>
            </View>

            {/* AddPopUp */}
            <AddPopUp visible={isAddModalVisible} onClose={() => setAddModalVisible(false)}/>

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
