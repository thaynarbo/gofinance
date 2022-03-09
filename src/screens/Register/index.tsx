import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton/index";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import {
  Container,
  Fields,
  Form,
  Header,
  Title,
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

  const dataKey = "@gofinance:transactions";

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert("Erro", "Selecione um tipo de transação");
    if (category.key === "category")
      return Alert.alert("Erro", "Selecione uma categoria");
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const oldData = data ? JSON.parse(data) : [];

      reset();
      await AsyncStorage.setItem(
        dataKey,
        JSON.stringify([newTransaction, ...oldData])
      );
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possivel salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                  onPress={() => handleTransactionTypeSelect("positive")}
                  isActive={transactionType === "positive"}
                />
                <TransactionTypeButton
                  title={"Outcome"}
                  type={"down"}
                  onPress={() => handleTransactionTypeSelect("negative")}
                  isActive={transactionType === "negative"}
                />
              </TransactionTypes>
              <CategorySelectButton
                title={category.name}
                onPress={handleOpenSelectCategoryModal}
              />
            </Fields>

            <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
          </Form>
          <Modal visible={categoryModalOpen}>
            <CategorySelect
              category={category}
              setCategory={setCategory}
              closeSelectCategory={handleCloseSelectCategoryModal}
            />
          </Modal>
        </GestureHandlerRootView>
      </Container>
    </TouchableWithoutFeedback>
  );
}
