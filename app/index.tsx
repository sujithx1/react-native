import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, Stack, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  url: string;
  imageBack: string;
  types: PokemoneTypes[];
}
interface PokemoneTypes {
  type: {
    name: string;
    url: string;
  };
}

const ColorType = {
  grass: "#78c850",
  fire: "#f08030",
  water: "#6890f0",
  bug: "#a8b820",
  normal: "#a8a878",
  poison: "#a040a0",
  electric: "#f8d030",
  ground: "#e0c068",
  fairy: "#ee99ac",
  fighting: "#c03028",
  psychic: "#f85888",
  rock: "#b8a038",
  ghost: "#705898",
  ice: "#98d8d8",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  flying: "#a890f0",
};

const LIMIT = 5;
const pokemon = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const navigate = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) fetchdata(page);
  }, [page]);

  const fetchdata = async (page: number) => {
    try {
      setLoading(true);

      const offset = page * LIMIT;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${LIMIT}&offset=${offset}`,
      );

      const data = await res.json();

      const detailsPokiemon = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const details = await fetch(pokemon.url);
          const detailsData = await details.json();
          return {
            name: detailsData.name,
            url: detailsData.sprites.front_default,
            imageBack: detailsData.sprites.back_default,
            types: detailsData.types,
          };
        }),
      );

      setData((prev) => [...prev, ...detailsPokiemon]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemons = async (name: string) => {
    if (!name) return;
    try {
      setLoading(true);
      const searchquery = name.trim().toLowerCase();
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchquery}`,
      );
      console.log("res", res);
      const data = await res.json();

      console.log("dataa", data);

      const detailsPokiemon = {
        name: data.name,
        url: data.sprites.front_default,
        imageBack: data.sprites.back_default,
        types: data.types,
      };
      setData([detailsPokiemon]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      console.log("query", query);
      searchPokemons(query);
    } else {
      setData([]);
      setPage(0);
      fetchdata(0);
    }
  }, [query]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () =>
            showSearch ? (
              <TextInput
                placeholder="Search Pokémon..."
                value={query}
                onChangeText={(text) => {
                  console.log(text);
                  setQuery(text);
                }}
                autoFocus
                style={{
                  backgroundColor: "#eee",
                  padding: 6,
                  borderRadius: 8,
                  width: 200,
                }}
              />
            ) : (
              <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
                Pokémon
              </Text>
            ),
          headerRight: () => (
            <Pressable onPress={() => {
              setShowSearch(!showSearch)
              setQuery('')
            }}>
              <Ionicons
                name={showSearch ? "close" : "search"}
                size={24}
                color="#fff"
              />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ScrollView
            contentContainerStyle={{
              gap: 16,
              padding: 16,
            }}
          >
            <Pressable
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: { name: item.name },
                })
              }
              style={{
                backgroundColor:
                  ColorType[item.types[0].type.name as keyof typeof ColorType] +
                  "33",
                padding: 20,
                borderRadius: 20,
              }}
            >
              <View>
                {/* <Text style={sytles.indexText}>{index+1}</Text> */}
                <Text style={sytles.name}>{item.name}</Text>
                <Text style={sytles.type}>{item.types[0].type.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: item.url }}
                    style={sytles.imagecontainer}
                  />

                  <Image
                    source={{ uri: item.imageBack }}
                    style={sytles.imagecontainer}
                  />
                </View>
              </View>
            </Pressable>
          </ScrollView>
        )}
        onEndReached={() => {
          if (!query) setPage((p) => p + 1);
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
        }
      />
    </>
  );
};

export default pokemon;

const sytles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 21,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },

  //      container: {

  //         backgroundColor: 'red',

  //   },
  text: {
    color: "#0000",
  },
  indexText: {
    color: "red",
  },
  imagecontainer: {
    width: 100,
    height: 100,
  },
});
