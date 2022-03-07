import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import {
    Container,
    Content,
    Header,
    Title,
    LoadContainer,
    ChartContainer,
    MonthSelector,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
} from "./styles";
import { HistoryCard } from "../../components/HistoryCard/index";
import { useEffect } from "react";
import { categories } from "../../utils/categories";
import { ActivityIndicator } from "react-native";

interface TransacrionData {
    if: string;
    type: "positive" | "negative";
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    totalFormatted: string;
    total: number;
    color: string;
    percentage: string;
}

export const Resume = () => {
    const [totalByCategories, setTotalByCategories] =
        useState<CategoryData[]>();

    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    async function loadData() {
        const dataKey = "@gofinance:transactions";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expenses = responseFormatted.filter(
            (expense: TransacrionData) => expense.type === "negative"
        );

        const expensesTotal = expenses.reduce(
            (accumulator: number, expense: TransacrionData) => {
                return accumulator + Number(expense.amount);
            },
            0
        );

        const totalByCategory: CategoryData[] = [];

        categories.forEach((category) => {
            let categorySum = 0;

            expenses.forEach((expense: TransacrionData) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    totalFormatted,
                    total: categorySum,
                    color: category.color,
                    percentage: `${(
                        (categorySum / expensesTotal) *
                        100
                    ).toFixed(0)}%`,
                });
            }
        });
        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>
            ) : (
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight(),
                    }}
                >
                    <MonthSelector>
                        <MonthSelectButton>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                        <Month>Maio</Month>
                        <MonthSelectButton>
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelector>
                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            x="percentage"
                            y="total"
                            labelRadius={50}
                            style={{
                                data: { fill: ({ datum }) => datum.color },
                                labels: {
                                    fontSize: `${RFValue(18)}px`,
                                    fontWeight: "bold",
                                    fill: theme.colors.shape,
                                },
                            }}
                        />
                    </ChartContainer>
                    {totalByCategories.map((category) => (
                        <HistoryCard
                            key={category.key}
                            title={category.name}
                            amount={category.totalFormatted}
                            color={category.color}
                        />
                    ))}
                </Content>
            )}
        </Container>
    );
};
