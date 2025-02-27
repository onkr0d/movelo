import { Link } from "expo-router";
import { View, Text, Button, TextInput } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}

export default function Login() {
  const { user, setUser } = useAuth();

  const login = () => {
    setUser({
      name: "John Doe",
    });
    console.log(user)
  }

  const [mneumonic, setMneumonic] = useState<string[][]>([["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]);
  const [key, onChangeKey] = useState('Your key here');
  const [value, onChangeValue] = useState('Your value here');

  async function handleMneumonic() {
    console.log(mneumonic)

    //check if there is an empty string in the mneumonic, if so return
    /* for (let i = 0; i < mneumonic.length; i++) {
      for (let j = 0; j < mneumonic[i].length; j++) {
        if (mneumonic[i][j] === "") return;
      }
    } */

    //convert the mneumonic to a singlle string with spaces. The current mneumonic is an nested array of strings
    let mneumonicString = mneumonic.map((item) => {
      return item.join(" ");
    }).join(" ");
    console.log("MN", mneumonicString)

    let reso =  await fetch(`https://getaddress-ai54nl56hq-uc.a.run.app?mnemonic=${mneumonicString}`)
    let address = await reso.json();
    let addressString = address;
    console.log("address", addressString)
    //check if the mneumonic is valid
/*     if (ethers.Wallet.fromPhrase("misery fringe write comfort hair hedgehog smart ahead shell water chief ozone")) {
      console.log("valid mneumonic")
    } else {
      console.log("invalid mneumonic")
    } */
  }

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: '#365838', flexDirection: 'column', width: '100%', paddingTop: 100, }}>
        <TouchableOpacity onPress={login}>
          <Text>bypass</Text>
        </TouchableOpacity>

        <Text style={{
          color: 'white',
          fontSize: 26,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: 20,
          paddingBottom: 0,
        }}>Enter your mneumonic</Text>
        
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            padding: 20,
            paddingTop: 0,
          }}
        >{`(It is encrypted and stored locally)`}</Text>
        
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          {
            mneumonic.map(
              (item, index) => {
                return (
                  <View style={
                    {
                      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'center',
                      gap: 12,
                      marginBottom: 12,
                    }
                  }>
                    {
                      item.map(
                        (item, level) => {
                          return (
                            <TextInput
                              key={level}
                              style={
                                {
                                  height: 40, borderColor: 'gray', borderWidth: 1, width: '40%',
                                  borderRadius: 8, backgroundColor: 'white'
                                }
                              }
                              onChangeText={text => {
                                let newMneumonic = [...mneumonic];
                                newMneumonic[index][level] = text.trim();
                                setMneumonic(newMneumonic);
                                }
                              }
                            />
                          )
                        }
                      )
                    }
                  </View>
                )
              }
            )
          }
        </View>

        {/* <View style={{ width: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}> */}
          <TouchableOpacity onPress={() => {
            handleMneumonic();
          }}
            style={{
              backgroundColor: '#adb09d',
              borderRadius: 8,
              minWidth: '82%',
              padding: 12,
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >continue</Text>
          </TouchableOpacity>
        {/* </View> */}
    </View>
  );
}