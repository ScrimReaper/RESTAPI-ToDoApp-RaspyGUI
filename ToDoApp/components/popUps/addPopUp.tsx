import React from 'react'
import {Modal, View, StyleSheet, Text} from "react-native";


interface addModalProps{
    visible:boolean;
    onClose: ()=>void;
}





const addModal: React.FC<addModalProps> = ({visible, onClose})=>{
    return(
        <Modal transparent={true} visible={visible} animationType={"slide"} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <Text>
                    This is a PopUp!
                </Text>
            </View>
        </Modal>
    )

}


const styles = StyleSheet.create({
    modalContainer: {
        width: '80%',   // 80% of the screen width
        height: '50%',  // 50% of the screen height
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    }
})

export default addModal;
