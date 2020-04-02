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
  Alert,
  AsyncStorage
} from "react-native";
import ToDo from "./ToDo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";

const { width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "", //새로운 할 일
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount() {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>🙋🏻‍♀️ To Do List 🙋🏻‍♂️</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"새로운 할 일을 추가하세요! ٩( ᐛ )و"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={"transparent"}
          ></TextInput>
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(toDos).map(toDo => (
              <ToDo
                key={toDo.id}
                {...toDo}
                deleteToDo={this._deleteToDo}
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
              />
            ))}
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
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({ loadedToDos: true, toDos: parsedToDos || {} });
    } catch (error) {
      console.log(error);
    }
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState({ newToDo: "" });
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
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const temp = prevState;
      temp.toDos[id].isCompleted = false;

      this._saveToDos(temp.toDos);
      return { temp };
    });

    // this.setState(prevState => {
    //   const newState = {
    //     ...prevState,
    //     toDos: {
    //       ...prevState.toDos,
    //       [id]: {
    //         ...prevState.toDos[id],
    //         isCompleted: false
    //       }
    //     }
    //   };
    //   this._saveToDos(newState.toDos);
    //   return { ...newState };
    // });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const temp = prevState;
      temp.toDos[id].isCompleted = true;

      this._saveToDos(temp.toDos);
      return { temp };
    });

    // this.setState(prevState => {
    //   const newState = {
    //     ...prevState,
    //     toDos: {
    //       ...prevState.toDos,
    //       [id]: {
    //         ...prevState.toDos[id],
    //         isCompleted: true
    //       }
    //     }
    //   };
    //   this._saveToDos(newState.toDos);
    //   return { ...newState };
    // });
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const temp = prevState;
      temp.toDos[id].text = text;

      this._saveToDos(temp.toDos);
      return { temp };
    });

    // this.setState(prevState => {
    //   const newState = {
    //     ...prevState,
    //     toDos: {
    //       ...prevState.toDos,
    //       [id]: {
    //         ...prevState.toDos[id],
    //         text: text
    //       }
    //     }
    //   };
    //   this._saveToDos(newState.toDos);
    //   return { ...newState };
    // });
  };
  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
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
    fontSize: 35,
    marginTop: 50,
    fontWeight: "400",
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
