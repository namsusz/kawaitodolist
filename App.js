import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import ToDo from "./ToDo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";

const { width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "", //새로운 할 일
    loadedToDos: false
  };
  componentDidMount() {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>🙋🏻‍♀️할 일 리스트🙋🏻‍♂️</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"새로운 할 일을 추가하세요!"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            onSubmitEditing={this._addToDo}
          ></TextInput>
          <ScrollView contentContainerStyle={styles.todos}>
            <ToDo text={"안뇽 🖐🏻"} />
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _loadToDos = () => {
    this.setState({ loadedToDos: true });
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          ToDos: {
            ...prevState.ToDos,
            ...newToDoObject
          }
        };
        return { ...newState };
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9575CD",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "300",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#D1C4E9",
    borderBottomWidth: 1,
    fontSize: 20
  },
  todos: {
    alignItems: "center"
  }
});
