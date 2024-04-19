import React, { useState } from 'react';
import {Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import tw from 'twrnc';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';


export const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);



  const togglePasswordVisibility= () => {
    setPasswordVisible(!passwordVisible);
  }

  const handleSignUp = () => {
    if (email === '' || mobileNumber === '' || password === '' || !agreeToTerms) {
      Alert.alert('Error', 'Please fill all the details...');
      return;
    }
  
    console.log('Signed up with:', { email, mobileNumber, password });
  
    setEmail('');
    setMobileNumber('');
    setPassword('');
    setAgreeToTerms(false);
  
    Alert.alert('Success', 'Successfully Signed Up, Proceed to login...', [
      {
        text: "OK",
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={tw`flex-1 justify-center px-8 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center mb-2`}>Create Account</Text>
      <Text style={tw`text-center mb-4`}>Connect with us today!</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Mobile Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        onChangeText={setMobileNumber}
        value={mobileNumber}
        keyboardType="phone-pad"
      />

      {/* Password Input */}
      <View style={tw`w-full mb-3`}>
          <View style={tw`relative border border-gray-300 rounded-lg`}>
            <TextInput
              style={tw`w-full p-3 rounded-lg`}
              placeholder="Enter your password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={tw`absolute inset-y-0 right-3 justify-center`}
              onPress={togglePasswordVisibility}
            >
              <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>

      {/* Terms and Conditions */}
      <View style={tw`flex-row my-4 items-center mb-8`}>
        <Checkbox
          value={agreeToTerms}
          onValueChange={setAgreeToTerms}
          color={agreeToTerms ? '#4630EB' : undefined}
        />
        <Text style={tw`ml-2`}>I agree to the terms and conditions</Text>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={tw`bg-green-500 py-3 rounded-lg`}
        onPress={handleSignUp}
      >
        <Text style={tw`text-lg text-white font-semibold text-center`}>Sign Up</Text>
      </TouchableOpacity>

      {/* Optional: Close Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`absolute top-5 right-5`}>
        <Text style={tw`text-sm text-gray-600`}>Close</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    ...tw`w-full p-3 mb-3 border border-gray-300 rounded-lg `,
  },
});
