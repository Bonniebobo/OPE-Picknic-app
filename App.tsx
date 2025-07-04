import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppFlowV3 from './src/screens/AppFlow';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppFlowV3 />
    </>
  );
}
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
