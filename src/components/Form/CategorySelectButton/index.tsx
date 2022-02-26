import { TouchableOpacityProps } from "react-native";
import React from "react";
import { Container, Category, Icon } from "./styles";

interface Props extends TouchableOpacityProps {
    title: string;
}

export default function CategorySelectButton({ title, ...rest }: Props) {
    return (
        <Container {...rest}>
            <Category>{title}</Category>
            <Icon name="chevron-down" />
        </Container>
    );
}
