import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Linking,
} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import BackgroundFile from './BackgroundFile';

const App = () => {
  const [featureOn, setFeatureOn] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [number, setNumber] = useState(null);
  useEffect(() => {
    askPermission();
  }, []);

  const askPermission = async () => {
    try {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);
      console.log('Permissions are:', permissions);
    } catch (err) {
      console.warn(err);
    }
  };

  const initiateWhatsApp = (msg, number) => {
    const formatNum = number.toString().replace(/\D/g, '');
    let url = 'whatsapp://send?text=' + msg + '&phone=' + formatNum;
    Linking.openURL(url)
      .then(data => {
        console.log(url);
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };

  const startListenerTapped = () => {
    setFeatureOn(true);
    callDetector = new CallDetectorManager(
      (event, number) => {
        console.log(event, number);
        if (event === 'Disconnected') {
          // Do something call got disconnected
          setIncoming(false);
          setNumber(number);
          initiateWhatsApp('Attended', number);
        } else if (event === 'Incoming') {
          // Do something call got incoming
          setIncoming(true);
          setNumber(number);
        } else if (event === 'Offhook') {
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          setIncoming(true);
          setNumber(number);
        } else if (event === 'Missed') {
          // Do something call got missed
          // setState({incoming: false, number: null});
          setIncoming(false);
          setNumber(number);
          initiateWhatsApp('missed of rejected', number);
        }
      },
      true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  };
  const stopListenerTapped = () => {
    callDetector && callDetector.dispose();
    setFeatureOn(false);
    setIncoming(false);
  };

  return (
    <View style={styles.body}>
      <Text style={{color: 'black', fontSize: 26, fontWeight: '700'}}>
        Call Detection
      </Text>
      <Text style={[styles.text, {color: 'black'}]}>Blue is On Red is Off</Text>
      <TouchableHighlight
        style={{borderRadius: 50}}
        onPress={featureOn ? stopListenerTapped : startListenerTapped}>
        <View
          style={{
            width: 200,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: featureOn ? 'blue' : '#eb4034',
            borderRadius: 50,
          }}>
          <Text style={styles.text}>{featureOn ? `ON` : `OFF`} </Text>
        </View>
      </TouchableHighlight>
      {incoming && (
        <Text style={{fontSize: 50, color: 'red'}}>Incoming call {number}</Text>
      )}
      <BackgroundFile />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    padding: 20,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  button: {},
});
