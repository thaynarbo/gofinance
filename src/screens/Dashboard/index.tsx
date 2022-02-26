import React from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import HighlightCard from "../../components/HighlightCard/index";
import {
    TransactionCard,
    TransactionCardProps,
} from "../../components/TransactionCard";

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
    HighlightCards,
    Transactions,
    TransactionList,
    Title,
    LogoutButton,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: "1",
            type: "positive",
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: { name: "Vendas", icon: "dollar-sign" },
            date: "13/04/2020",
        },
        {
            id: "2",
            type: "negative",
            title: "Hamburgueria Pizzy",
            amount: "R$ 59,00",
            category: { name: "Alimentação", icon: "coffee" },
            date: "10/04/2020",
        },
        {
            id: "3",
            type: "negative",
            title: "Aluguel do apartamento",
            amount: "R$ 1.200,00",
            category: { name: "Casa", icon: "home" },
            date: "10/04/2020",
        },
    ];
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
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>
            <HighlightCards>
                <HighlightCard
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril"
                    type="up"
                />
                <HighlightCard
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Última saída dia 02 de abril"
                    type="down"
                />
                <HighlightCard
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="01 a 18 de abril"
                    type="total"
                />
            </HighlightCards>
            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={data}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                    keyExtractor={(item) => item.id}
                />
            </Transactions>
        </Container>
    );
}
