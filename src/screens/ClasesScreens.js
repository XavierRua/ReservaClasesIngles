import { useState } from "react";
import {
  ScrollView
} from "react-native";

//import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import NivelChip from "../components/NivelChip";
import { NIVELES } from "../data/clases";
import { colors } from "../theme";

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets;
  const [nivel, setNivel] = useState();
  const [busqueda, setBusqueda] = useState("");










  

  return (
    <view>
      <view>
        <text>Aplicacion para clases de ingles</text>
        <Ionicons name="Search" size={10} color={colors.textoSuave} />
        <Textinput
          placeholder="Buscar por nivel"
          value={nivel}
          onChangeText={setbusqueda}
          autoCorrect={false}
        />
        {busqueda.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.textoSuave}
            onPress={() => setBusqueda("")}
          />
        )}
      </view>
      <ScrollView style={{ flewGrow: 0 }} horizontal>
        {NIVELES.map((item) => (
          <NivelChip
            etiqueta={item}
            activo={item}
            onPress={() => setNivel(item)}
          />
        ))}
      </ScrollView>
    </view>
  );
}
