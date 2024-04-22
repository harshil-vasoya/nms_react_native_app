import { Alert } from 'react-native';
const fetchData = async (endpoint,pickedFileName, file ,setResponse , setImage) => {

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
  const res = await data.json()
  setResponse(res)
  setImage(res.photopath)
    
  };

  export default fetchData;