import React, {useRef, useState} from "react";
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

interface Task {
    id: string;
    name: string;
}

interface ListScreenProps {
    title: string;
}

const ListScreen: React.FC<ListScreenProps> = ({ title }: ListScreenProps) => {
    const [tasks, setTasks] = useState<Task[]>([]); // Local state for tasks
    const [taskIDCounter, setTaskIDCounter] = useState<number>(0);
    const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);
    const inputRef = useRef<TextInput|null>(null);

    // Add a new task
    const addTask = () => {
        const newTask = { id: taskIDCounter.toString(), name: "" };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTaskIDCounter((prevID) => prevID + 1);

        setTimeout(() => inputRef.current?.focus(), 100);
    };

    //update task name
    const updateTask = (taskId: string, taskName: string) => {
        setTasks((prevstate) =>
            prevstate.map((task) =>
                task.id === taskId ? { ...task, name: taskName } : task)
        );
    };

    // Delete a task
    const deleteTask = (taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };
    const handleEndEditing = (taskId: string, taskName: string) => {
        if (taskName === "") {
            deleteTask(taskId);
        }
    }

    // Render each task
    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <DoneTick color="black" width={20} height={20} />
            </TouchableOpacity>

            <TextInput
                ref={inputRef}
                style={styles.taskInput}
                value={item.name}
                onChangeText={(text) => updateTask(item.id, text)}
                onEndEditing={() => handleEndEditing(item.id, item.name)}
                onSubmitEditing={()=> handleEndEditing(item.id, item.name)}
                multiline={false}
                returnKeyType="done"
                />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* AddPopUp */}
            <AddPopUp visible={isAddModalVisible} onClose={() => setAddModalVisible(false)} />

            {/* Task List */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />

            {/* Bottom Bar */}
            <View style={styles.bttmBar}>
                <TouchableOpacity onPress={addTask} style={styles.addButton}>
                    <PlusIcon color="purple" />
                </TouchableOpacity>
                <Text style={{ marginLeft: 20, fontSize: 15, color: "purple" }}>
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
