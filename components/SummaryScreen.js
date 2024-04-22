import React, { useState, useEffect , useRef } from 'react';
import { StatusBar, Modal, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import tw from 'twrnc';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet  } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-root-toast';
import fetchData from '../api/fetchdata';

const { width, height } = Dimensions.get('window');

const SummaryScreen = () => {
  const [pickedFileName, setPickedFileName] = useState(null);
  const [file, setfile] = useState(null); //
  const [response, setResponse] = useState(null);
  const [image, setImage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



  //handeling the scroll
  useEffect(() => {
     handleScroll = (event) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      setIsScrolled(currentOffset > 0);
    };

    return () => {
      setIsScrolled(false);
    };
  }, []);

  // pickcsvfile function

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

  // save to phone function

  const saveToPhone = async () => {
    console.log(image);
    if (!image) return;

    try {
      const { uri } = await FileSystem.downloadAsync(
        image,
        `${FileSystem.documentDirectory}width.jpg`
      );

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Images', asset, false);
        Toast.show('Image saved successfully!', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        console.log('Need Storage permission to save file');
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };


  // canclebutton function

  const handleCancel = () => {
    setResponse(null);
    setPickedFileName(null);
    setImage(null);
    setfile(null);
  };

  // modal visibility function
  const handleModalVisible = (isVisible) => {
    setModalVisible(isVisible);
  };

  return (
    <SafeAreaView style={tw`flex-1 mx-4 mt-8`}>

{/* status bar */}
<StatusBar backgroundColor={isScrolled ? 'black' : 'transparent'} barStyle={isScrolled ? 'light-content' : 'dark-content'} />
        <ScrollView
          onScroll={(event) => setIsScrolled(event.nativeEvent.contentOffset.y > 0)}
          scrollEventThrottle={16}>
    <View style={tw`flex-1 justify-around`}>
      <View>
      <Text style={tw`text-3xl text-center font-bold my-6 text-green-600`}>
  Summary
</Text>
<Text style={tw`text-lg text-center font-semibold text-gray-700 px-4`}>
This is an overall statistics table that shows key stats and their respective values for them.
</Text>
      </View>

      {/* csv option befor the data fetched */}

      {!response ? 
                <TouchableOpacity onPress={pickCsvFile} accessibilityLabel="select-csv-file" style={tw`mt-8 py-2 px-4 self-center bg-blue-500 rounded-full`}>
                  <Text style={tw`text-lg text-white font-bold`}>
                    Select CSV File
                  </Text>
                </TouchableOpacity> : null}
  
              {/* cancel button */}
              {response ?
                <TouchableOpacity onPress={handleCancel} style={tw`py-2 px-2 bg-red-600 rounded-md mx-auto`}>
                  <Text style={tw`text-sm font-bold text-center text-white`}>
                    Cancel 
                  </Text>
                </TouchableOpacity> : null}
  
              <View style={tw`mt-8`}>
                {/* image display and download */}
                {response ?
                  <>
                    <TouchableWithoutFeedback onPress={() => handleModalVisible(true)}>
                      <Image
                        source={{ uri: image }}
                        style={tw`mx-auto w-[100] h-[100] rounded-md`}
                      />

                    </TouchableWithoutFeedback>

                      {/* downalod button for the image */}

                    <TouchableOpacity onPress={saveToPhone} style={tw`py-3 px-4 bg-blue-600 rounded-md mx-auto mb-6`}>
                      <Text style={tw`text-xl font-bold text-center text-white`}>
                        Download
                      </Text>
                    </TouchableOpacity>
                  </>
                  : null}
              </View>

                  {/* fetch data button */}
                  
      <TouchableOpacity onPress={() => {fetchData("infographic",pickedFileName,file, setResponse, setImage)}} style={tw`py-3 bg-green-600 rounded-md mx-4 mb-6`}>
        <Text style={tw`text-xl font-bold text-center text-white`}>
          Submit Data
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>


                  {/* image open in modal */}
                  <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => handleModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => handleModalVisible(false)}>
              <Image
                source={{ uri: image }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </View>
        </Modal>


  </SafeAreaView>
);
};


export default SummaryScreen;
const styles = StyleSheet.create({
    buttonContainer: {
      paddingVertical: 18,
      borderRadius: 50,
      backgroundColor: '#14594a',
    },
    modalImage: {
      width: width,
      height: height,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
  });
  


  
