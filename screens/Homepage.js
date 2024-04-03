import React from 'react';
import { connect } from "react-redux";
import { Dimensions } from 'react-native';

import { View, StyleSheet, TextInput, Alert, ImageBackground } from 'react-native';

import Header from '../components/Header';
import ButtonGame from '../components/ButtonGame';
import {
  emailValidator,
  nameValidator,
  firstnameValidator
} from "../core/utils";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      firstname: "",
      email: ""
    }
  }

  alerte() {
    Alert.alert(
      'Erreur',
      'L\'un des champs est invalide',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  createAccount() { //fonction qui permet de créer un compte : entrée en BDD + en reducer
    // console.log("click");

    const nameError = nameValidator(this.state.name);
    const firstnameError = firstnameValidator(this.state.firstname);
    const emailError = emailValidator(this.state.email);
    // console.log(nameError)
    // console.log(firstnameError)
    // console.log(emailError)

    if (nameError || firstnameError || emailError) {
      this.alerte()
      return;
    } else {

      const formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("firstname", this.state.firstname);
      formData.append("email", this.state.email);


      fetch('http://jdevalik.fr/api/drine/insertPlayerBjl.php', {
        method: 'POST',
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }).then((response) => response.json())
        .then((json) => {
          if (json == false) {
            Alert.alert(
              'Erreur',
              'L\'e-mail saisi existe déjà. Veuillez saisir une autre adresse mail ou récupérer votre compte.',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
            );
          } else {
            const action = { type: "ADD_PLAYER", value: { name: this.state.name, firstname: this.state.firstname, email: this.state.email, } }
            this.props.dispatch(action)
            //console.log(this.props)
            Alert.alert(
              'Inscription réussie',
              'Connectez-vous.',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
            );
            // this.props.navigation.navigate('HomePage')
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  onLoginPressed() {
    const nameError = nameValidator(this.state.name);
    const firstnameError = firstnameValidator(this.state.firstname);
    const emailError = emailValidator(this.state.email);
    //console.log(nameError)
    //console.log(firstnameError)
    //console.log(emailError)

    if (nameError || firstnameError || emailError) {
      this.alerte()
      return;

    } else {

      const formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("firstname", this.state.firstname);
      formData.append("email", this.state.email);

      fetch('http://jdevalik.fr/api/drine/getPlayerBjl.php', {
        method: 'POST',
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }).then((responses) => responses.json())
        .then((json) => {
          // console.log(JSON.stringify(json, null, 2));
          if (json != false) {

            const action = { type: "ADD_CURRENT_PLAYER", value: json }
            this.props.dispatch(action)
            // console.log(this.props)
            this.props.navigation.navigate('Game');
          } else {
            Alert.alert(
              'Erreur',
              'Les nom, prénom et email ne correspondent pas',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../images/imgHomePage.jpg')} resizeMode="cover" style={styles.imgBackGr}>
        <Header>Connexion/inscription</Header>
        <TextInput
          label='nom'
          style={styles.input}
          value={this.state.name}
          placeholder={'Nom'}
          onChangeText={champ => this.setState({ name: champ })}
        />
        <TextInput
          label='firstname'
          style={styles.input}
          value={this.state.firstname}
          placeholder={'Prénom'}
          onChangeText={champ => this.setState({ firstname: champ })}
        />

        <TextInput
          label='email'
          style={styles.input}
          value={this.state.email}
          placeholder={'E-mail'}
          onChangeText={champ => this.setState({ email: champ })}
        />
        <ButtonGame green id="Connexion" onPress={() => this.onLoginPressed()} />
        <ButtonGame id="Inscription" onPress={() => this.createAccount()} />
        </ImageBackground>
      </View>
    )
  }
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    width: 200,
    height: 40,
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  imgBackGr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    objectFit: 'cover',
    margin: 0,
    width: screenWidth
},
});

const mapStateToProps = (state) => {
  return { players: state.PlayerReducer.players, currentPlayer: state.PlayerReducer.currentPlayers }
}
export default connect(mapStateToProps)(HomePage)