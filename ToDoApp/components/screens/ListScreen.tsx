import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
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

interface listScreenProps {
    title: string;

}

interface List{
    id: string
    title: string
    tasks: Task[];
}


const ListScreen: React.FC<listScreenProps> = ( {title}: listScreenProps) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [taskIDCounter, setTaskIDCounter] = useState<number>(0)

    const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false)
    const addTask = () => {
        const task = {id: taskIDCounter.toString(), name: '', isEditing: true};
        setTasks(prevState => [...prevState, task]);
        setTaskIDCounter(prevState => prevState + 1);


    }


    const deleteTask = (id: String) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id != id));
    }

    const openAddModal = () => setAddModalVisible(true);
    const closeAddModal = () => setAddModalVisible(false);



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
            <View style={styles.topBar}>
            <Text style={styles.title}>{title}</Text>
            </View>
            {/* AddPopUp */}
            <AddPopUp visible={isAddModalVisible} onClose={closeAddModal}/>
            <View>
                <FlatList data={tasks} keyExtractor={(item) => item.id} renderItem={renderItem}>
                </FlatList>
            </View>
            <View style={styles.bttmBar}>
                <TouchableOpacity
                    onPress={addTask} style={styles.addButton}>
                    <PlusIcon color={"purple"}/>
                </TouchableOpacity>
                <Text style={{marginLeft: 20, fontSize: 15, color: "purple"}}>Add Tasks</Text>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'grey',
        marginLeft: 5,
        marginRight: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        left: 5,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: 'white', // Header background color
        flexDirection: 'row',       // Row layout for title and button
        alignItems: 'center',       // Center items vertically
        paddingHorizontal: 15,
    },

    topBar: {
        height: 60,
        backgroundColor: 'white', // Header background color
        flexDirection: 'row',       // Row layout for title and button
        alignItems: 'center',       // Center items vertically
        paddingHorizontal: 15,
        justifyContent: 'space-between',

        marginLeft: 5,
        marginRight: 5,

    },


});

export default ListScreen;