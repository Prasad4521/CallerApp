import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import BackgroundService from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      //you can call api here
      await BackgroundService.updateNotification({
        taskDesc: 'My counter is running' + i,
      });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 2000,
  },
};

const startBackgroundService = async () => {
  console.log('entered start');
  await BackgroundService.start(veryIntensiveTask, options);
  await BackgroundService.updateNotification({
    taskDesc: 'My counter is running',
  });
};
const stopBackgroundService = async () => {
  console.log('entered stop');
  await BackgroundService.stop();
};
const BackgroundFile = () => {
  return (
    <View style={styles.Container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          startBackgroundService();
        }}>
        <Text style={{color: '#ffffff'}}>Start Background service</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          stopBackgroundService();
        }}>
        <Text style={{color: '#ffffff'}}>Stop Background service</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackgroundFile;

const styles = StyleSheet.create({
  Container: {
    margin: 'auto',
  },
  btn: {
    width: 200,
    height: 50,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
