import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native";
import { RectButton } from "react-native-gesture-handler";

interface IconProps {
    type: "up" | "down";
}

interface ContainerProps {
    isActive: boolean;
    type: "up" | "down";
}

export const Container = styled.View<ContainerProps>`
    width: 48%;

    border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.text};
    border-radius: 5px;

    background-color: ${({ type, isActive, theme }) =>
        isActive
            ? type === "up"
                ? theme.colors.success_light
                : theme.colors.attention_light
            : theme.colors.background};
`;
export const Title = styled.Text`
    font-family: ${({ theme }) => theme.font.regular};
    font-size: ${RFValue(14)}px;
`;

export const Button = styled(RectButton)`
    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 16px;
`;

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ theme, type }) =>
        type === "up" ? theme.colors.success : theme.colors.attention};
`;
