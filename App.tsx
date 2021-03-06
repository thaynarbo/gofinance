import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import { ThemeProvider } from "styled-components";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import AppLoading from "expo-app-loading";

import theme from "./src/global/styles/theme";

import { NavigationContainer } from "@react-navigation/native";

import { AppRoutes } from "./src/routes/app.routes";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style={"light"} />
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}
