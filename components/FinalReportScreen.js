import React, { useState } from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View,TouchableOpacity, Dimensions, StyleSheet ,Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import Toast from 'react-native-root-toast';
import { Alert } from 'react-native';



const FinalReportScreen = () => {
  const [pickedFileName, setPickedFileName] = useState(null);
  const [file, setfile] = useState(null); // [1
  const [response, setResponse] = useState(null);
  const [image, setImage] = useState(null);
  
  const pickCsvFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      // console.log('Document Picker Result:', result); // Debugging line

        if (result.type !== 'cancel') {
          const fileNameParts = result.assets[0].uri.split('.')
          const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
          if (fileExtension == 'csv') {
            setPickedFileName(result.assets[0].name);
            setfile(result.assets[0].uri);
            console.log(result.assets[0].name);
          }
          else
          {
            Toast.show('Please select a CSV file', {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          }
          }
          else
          {
            Toast.show('Please select a CSV file', {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          }
      
    
   } catch (error) {
      console.error('Error picking file:', error);
      Toast.show('An error occurred while picking the file.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };
  const saveToPhone = async (url) => {
    console.log(url)
    Toast.show('image download', {
      duration: 1000,
    });
    console.log('image download 2')
    const { uri } = await FileSystem.downloadAsync(
      image,
      `${FileSystem.documentDirectory}finalReportScreen.jpg`
    ).catch((e) =>
      console.log('instagram share failed', JSON.stringify(e), url)
    )

    const permission = await MediaLibrary.requestPermissionsAsync()
    if (permission.granted) {
      try {
        const asset = await MediaLibrary.createAssetAsync(uri)
        MediaLibrary.createAlbumAsync('Images', asset, false)
          .then(() => {
            Toast.show('image save success!!', {
              duration: 1000,
            });
          })
          .catch(() => {
            console.log('Error In Saving File!')
          })
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Need Storage permission to save file')
    }
  }

  const handlecancle = () => {
    setResponse(null)
    setPickedFileName(null)
    setImage(null)
    setfile(null)

  }
  
  const fetchData = async (endpoint) => {
    if(!file || !pickedFileName){
      Alert.alert("Alert", "Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', {
      uri: file,
      name: pickedFileName,
      type: 'text/csv', // Adjust the MIME type according to your file type
    });
  console.log(formData);
const data = await fetch(`http://192.168.1.3:3007/pythonscript/${endpoint}`, {method: 'POST' , body: formData})
console.log("hiit 22")    
const res = await data.json()
setResponse(res)
setImage(res.photopath)

console.log(res)

   
    
  };
  return (
    <SafeAreaView style={tw`flex-1 mx-4`}>
    
    <View style={tw`flex-1 justify-around`}>
      <View>
        <Text style={tw`text-3xl text-center font-bold my-6 text-green-600`}>
          Final Report
        </Text>
        <Text style={tw`text-lg text-center font-semibold text-gray-700 px-4`}>
        </Text>
        

        {/* csv file picker */}
        {!response ? 
        <TouchableOpacity onPress={pickCsvFile} accessibilityLabel="select-csv-file" style={tw`mt-8 py-2 px-4 self-center bg-blue-500 rounded-full`}>
          <Text style={tw`text-lg text-white font-bold`}>
            Select CSV File
          </Text>
        </TouchableOpacity>:null}


          {/* cancel button */}
          {response ?
            <TouchableOpacity onPress={() => {handlecancle()}} style={tw`py-2 px-2 bg-red-600  rounded-md mx-auto`}>
        <Text style={tw`text-sm font-bold text-center text-white`}>
          cancel 
        </Text>
      </TouchableOpacity>:null
          }
          


      </View>
<View style={tw`mt-8`}>

          {/* image display and downalod */}
        {response ?
        <>
      <Image
        source={{ uri: image }}
        style={tw`mx-auto w-[100] h-[100] rounded-md`}
      />
       <TouchableOpacity onPress={() => {saveToPhone(image)}} style={tw`py-3 px-4 bg-blue-600 rounded-md mx-auto mb-6`}>
        <Text style={tw`text-xl font-bold text-center text-white`}>
          Download
        </Text>
      </TouchableOpacity>
      </>
    :null
        }
        </View>


        {/* submit button for the fetch api */}
      <TouchableOpacity onPress={() => {fetchData("merged-script")}} style={tw`py-3 bg-green-600 rounded-md mx-4 mb-6`}>
        <Text style={tw`text-xl font-bold text-center text-white`}>
          Submit Data
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};


export default FinalReportScreen;
const styles = StyleSheet.create({
    buttonContainer: {
      paddingVertical: 18,
      borderRadius: 50,
      backgroundColor: '#14594a',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 300, // Adjust width as needed
      height: 300, // Adjust height as needed
    },
  });
  