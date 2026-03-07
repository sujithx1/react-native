import { Image } from "expo-image"
import { router, useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

interface Pokemon{
    name:string,
    url:string ,
    imageBack:string,
    types:PokemoneTypes[]
}
interface PokemoneTypes{
    type:{
        name:string,
        url:string
    }
}

const ColorType={
    grass:'#78c850',
    fire:'#f08030',
    water:'#6890f0',
    bug:'#a8b820',
    normal:'#a8a878',
    poison:'#a040a0',
    electric:'#f8d030',
    ground:'#e0c068',
    fairy:'#ee99ac',
    fighting:'#c03028',
    psychic:'#f85888',
    rock:'#b8a038',
    ghost:'#705898',
    ice:'#98d8d8',
    dragon:'#7038f8',
    dark:'#705848',
    steel:'#b8b8d0',
    flying:'#a890f0'
}
const pokemon = () => {
      const [data,setData]=useState<Pokemon[]>([])
      const navigate=useNavigation()

  useEffect(()=>{
    fetchdata()

  }
  ,[])

  const  fetchdata=async()=>{
    const res=await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20')
    const data=await res.json()

    const detailsPokiemon=await Promise.all(

        data.results.map(async(pokemon:{name:string,url:string})=>{
            const details=await fetch(pokemon.url)
            const detailsData=await details.json()
            return{
                name:detailsData.name,
                url:detailsData.sprites.front_default,
                imageBack:detailsData.sprites.back_default,
                types:detailsData.types
            }
           
        }



    )

    )

    setData(detailsPokiemon)
  }
  return (
   <>
   <ScrollView 
contentContainerStyle={{


    gap:16,
    padding:16
}}   
   >

    {
     
      data.map((item,index)=>(
        <Pressable key={item.name} 
  onPress={() => router.push({pathname:'/details',params:{name:item.name}})}
        style={
            {
                backgroundColor:ColorType[item.types[0].type.name as keyof typeof ColorType]+'33',
                padding:20,
                borderRadius:20,
            }
        }
        >

        <View  >
            {/* <Text style={sytles.indexText}>{index+1}</Text> */}
            <Text style={sytles.name}>{item.name}</Text>
            <Text style={sytles.type}>{item.types[0].type.name}</Text>
            <View style={{flexDirection:'row'}}>


            <Image   source={{uri:item.url}} style={sytles.imagecontainer}/>

            <Image   source={{uri:item.imageBack}} style={sytles.imagecontainer}/>

            </View>

        </View>
                </Pressable>
      ))
    
    }


   </ScrollView>
   </>
  )
}

export default pokemon



const sytles=StyleSheet.create({
    name:{
        fontSize:28,
        fontWeight:'bold',
        textAlign:'center'
    },
      type:{
        fontSize:21,
        fontWeight:'bold',
        color:'gray',
        textAlign:'center'

    },

//      container: {
     
//         backgroundColor: 'red',
       
//   },
  text: {
    color: '#0000',
  },
  indexText:{
    
    color:'red'
  },
  imagecontainer:{
    width:100,
    height:100
  }
})