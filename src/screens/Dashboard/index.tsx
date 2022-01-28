import React from "react";
import { Feather } from "@expo/vector-icons";

import {
    Container,
    Header,
    UserInfo,
    Photo,
    UserGreeting,
    UserName,
    User,
    UserWrapper,
    Icon,
} from "./styles";

export default function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{
                                uri: "https://avatars.githubusercontent.com/u/59737482?v=4",
                            }}
                        />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Thaynar</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>
        </Container>
    );
}
