import React, { useState } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import CategorySelectButton from "../../components/Form/CategorySelectButton/index";
import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Form/InputForm";
import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from "./styles";

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
        .typeError("Informe um valor numérico")
        .positive("Informe um valor positivo")
        .required("Valor é obrigatório"),
});

export function Register() {
    const [transactionType, setTransactionType] = useState("credit");
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: "category",
        name: "Categoria",
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleTransactionTypeSelect = (type: string) => {
        setTransactionType(type);
    };

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }
    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert("Erro", "Selecione um tipo de transação");
        if (category.key === "category")
            return Alert.alert("Erro", "Selecione uma categoria");
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
        };
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            placeholder="Nome"
                            control={control}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            placeholder="Preco"
                            control={control}
                            name="amount"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionTypes>
                            <TransactionTypeButton
                                title={"Income"}
                                type={"up"}
                                onPress={() =>
                                    handleTransactionTypeSelect("up")
                                }
                                isActive={transactionType === "up"}
                            />
                            <TransactionTypeButton
                                title={"Outcome"}
                                type={"down"}
                                onPress={() =>
                                    handleTransactionTypeSelect("down")
                                }
                                isActive={transactionType === "down"}
                            />
                        </TransactionTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>
                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}
