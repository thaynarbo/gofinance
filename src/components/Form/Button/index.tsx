import React from "react";
import { Container, Title } from "./styles";
import {
    GestureHandlerRootView,
    RectButtonProps,
} from "react-native-gesture-handler";

interface Props extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export function Button({ title, onPress, ...rest }: Props) {
    return (
        <GestureHandlerRootView>
            <Container {...rest} onPress={onPress}>
                <Title>{title}</Title>
            </Container>
        </GestureHandlerRootView>
    );
}
