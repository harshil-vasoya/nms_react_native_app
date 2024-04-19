const fetchData = async (endpoint, setResponse , setImage) => {
    console.log('Fetching data...');
  const data = await fetch(`http://192.168.1.2:3007/pythonscript/${endpoint}`, {method: 'POST'})
  const res = await data.json()
  setResponse(res)
  setImage(res.photopath)
    console.log(res.photopath)
  console.log('Data fetched')
    
  };

  export default fetchData;