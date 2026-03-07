import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet
} from "react-native";

export type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
};

const Details = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    setDetails(data);
  };

  if (!details) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  const image =
    details.sprites.other?.["official-artwork"]?.front_default ||
    details.sprites.front_default;

  return (
    <>
      <Stack.Screen options={{ title: details.name }} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* Name */}
        <Text style={styles.name}>
          {details.name.toUpperCase()} #{details.id}
        </Text>

        {/* Types */}
        <View style={styles.typeContainer}>
          {details.types.map((t) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>{details.height}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>{details.weight}</Text>
        </View>

        {/* Abilities */}
        <Text style={styles.sectionTitle}>Abilities</Text>
        {details.abilities.map((a) => (
          <Text key={a.ability.name} style={styles.listItem}>
            • {a.ability.name}
          </Text>
        ))}

        {/* Stats */}
        <Text style={styles.sectionTitle}>Stats</Text>
        {details.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center"
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 10
  },

  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  typeContainer: {
    flexDirection: "row",
    marginBottom: 20
  },

  typeBadge: {
    backgroundColor: "#ef5350",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginHorizontal: 4
  },

  typeText: {
    color: "white",
    fontWeight: "600"
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 4
  },

  label: {
    fontWeight: "600"
  },

  value: {
    color: "#444"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "flex-start"
  },

  listItem: {
    alignSelf: "flex-start",
    marginVertical: 2
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },

  statName: {
    textTransform: "capitalize"
  },

  statValue: {
    fontWeight: "bold"
  }
});