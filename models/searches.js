const fs= require('fs');
const axios = require('axios');
class Searches{
  history=[];
  dbPath='./db/database.json';
  constructor(){
    // todo: read db if exits
    this.readDB();
  }
  get capitalizedHistory(){
    return this.history.map(place=>{
      let words= place.split(' ');
      words = words.map(p=> (p[0].toUpperCase()+p.substring(1)))
      return words.join(' ');
    });
  }
  get paramsMapbox(){
    return{
          'access_token':process.env.MAPBOX_KEY,
          'limit':5,
          'language':'en'
        };
  }
  get paramsWeather(){
    return {
      'appid':process.env.OPENWEATHER_KEY,
      'units':'metric'
    }
  }

  async city(place=''){
    try {
      // Http requets
      const instance = axios.create({
        baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
        params:this.paramsMapbox
      })

       const resp=await instance.get();
       
       //return al places what coinciden 
      return resp.data.features.map(place=>({
        id:place.id,
        name:place.place_name,
        lng:place.center[0],
        lat:place.center[1]
      }));


      
      // console.log('City:'+place)
      
    } catch (error) {
      
      return error;//return error
    }
  }

  async placeWeather(lat,lon){
    try {
      // Axios instace axios.create()
      const instance = axios.create({
        baseURL:`https://api.openweathermap.org/data/2.5/weather?`,
        params:{...this.paramsWeather,lat,lon}
      })
      const resp=await instance.get();
       
      const {weather , main } = resp.data;

      return {
        desc:weather[0].description,
        min:main.temp_min,
        max:main.temp_max,
        temp:main.temp
      }
    } catch (error) {
      throw  error;
    }
  }

  addHistory(place=''){
    if(this.history.includes(place.toLowerCase())){
      return;
    }
    this.history= this.history.splice(0,5);
    // TODO: prevent duplicated
    this.history.unshift(place.toLowerCase());

    // Record on DB
    this.saveDB();
  }
  saveDB(){
    const payload = {
      history:this.history
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(payload))

  }
  readDB(){
    const file = this.dbPath;
    // verify if exits
    if(!(fs.existsSync(file)))return;        

    const info=fs.readFileSync(file,{encoding:'utf-8'});

    const data=JSON.parse(info);
    this.history= data.history;

    return data;
  }
}
module.exports=Searches;