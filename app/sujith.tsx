import { StyleSheet, Text, View } from "react-native";









export default function SujithSection(){
    return (
        <View style={
            styels.container
        }>

        <Text style={styels.text} >
            Sujith is good Guy

        </Text>
        </View>
    )
}


const styels=StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
})