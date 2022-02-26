import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface Attrs {
    activeOpacity?: number;
}
export const Container = styled(TouchableOpacity).attrs(
    ({ activeOpacity = 0.7 }: Attrs) => activeOpacity
)`
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 5px;
    padding: 18px 16px;
`;
export const Category = styled.Text`
    font-family: ${({ theme }) => theme.font.regular};
    font-size: ${RFValue(14)}px;
`;
export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
`;
