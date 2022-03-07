import React, { useCallback, useEffect, useState } from "react";
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
    LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

import { LastTransaction } from "../../components/HighlightCard/styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>(
        {} as HighlightData
    );

    const theme = useTheme();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: "positive" | "negative"
    ) {
        const lastTransaction = new Date(
            Math.max.apply(
                Math,
                collection
                    .filter((item) => item.type === type)
                    .map((transaction) => new Date(transaction.date).getTime())
            )
        );
        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
            "pt-BR",
            { month: "long" }
        )} `;
    }

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
        const lastTransactionIncome = getLastTransactionDate(
            transaction,
            "positive"
        );
        const lastTransactionOutcome = getLastTransactionDate(
            transaction,
            "negative"
        );
        const totalInterval = `01 a ${lastTransactionOutcome}`;
        setHighlightData({
            entries: {
                amount: entries.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction: `Última entrada dia ${lastTransactionIncome}`,
            },
            expenses: {
                amount: expenses.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction: `Última saída dia ${lastTransactionOutcome}`,
            },
            total: {
                amount: (entries - expenses).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction: totalInterval,
            },
        });
        setIsLoading(false);
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
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>
            ) : (
                <>
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
                            amount={highlightData.entries.amount}
                            lastTransaction={
                                highlightData.entries.lastTransaction
                            }
                            type="up"
                        />
                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expenses.amount}
                            lastTransaction={
                                highlightData.expenses.lastTransaction
                            }
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={
                                highlightData.total.lastTransaction
                            }
                            type="total"
                        />
                    </HighlightCards>
                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList
                            data={transactions}
                            renderItem={({ item }) => (
                                <TransactionCard data={item} />
                            )}
                            keyExtractor={(item) => item.id}
                        />
                    </Transactions>
                </>
            )}
        </Container>
    );
}
