import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
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

    // Add a new task
    const addTask = () => {
        const newTask = { id: taskIDCounter.toString(), name: `Task ${taskIDCounter}` };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTaskIDCounter((prevID) => prevID + 1);
    };

    // Delete a task
    const deleteTask = (taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    // Render each task
    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <DoneTick color="black" width={20} height={20} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 10, fontSize: 15, color: "black" }}>
                {item.name}
            </Text>
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
