import React, { useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useFocusEffect } from "@react-navigation/native";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [transactions, setTransactions] = React.useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = React.useState<HighlightData>(
        {} as HighlightData
    );

    async function loadTransactions() {
        let entries = 0;
        let expenses = 0;

        const dataKey = "@gofinance:transactions";
        const response = await AsyncStorage.getItem(dataKey);
        const transaction = response ? JSON.parse(response) : [];

        const transactionFormatted: DataListProps[] = transaction.map(
            (item: DataListProps) => {
                if (item.type === "positive") {
                    entries += Number(item.amount);
                } else {
                    expenses += Number(item.amount);
                }
                const amount = Number(item.amount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
                const date = Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                };
            }
        );

        setTransactions(transactionFormatted);
        setHighlightData({
            entries: {
                amount: entries.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
            },
            expenses: {
                amount: expenses.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
            },
            total: {
                amount: (entries - expenses).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
            },
        });
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );

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
                    amount={highlightData?.entries?.amount}
                    lastTransaction=""
                    type="up"
                />
                <HighlightCard
                    title="Saídas"
                    amount={highlightData?.expenses?.amount}
                    lastTransaction="Última saída dia 02 de abril"
                    type="down"
                />
                <HighlightCard
                    title="Total"
                    amount={highlightData?.total?.amount}
                    lastTransaction="01 a 18 de abril"
                    type="total"
                />
            </HighlightCards>
            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={transactions}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                    keyExtractor={(item) => item.id}
                />
            </Transactions>
        </Container>
    );
}
