require('dotenv').config()

const {readInput,pause,inquirerMenu, listPlaces} = require('./helpers/inquirer');

const Searches = require('./models/searches');

console.clear();

const main= async()=>{
  const searches = new Searches();
  let opt;


  do {

    opt = await inquirerMenu('Select an option please: ')
    // console.log({opt});
    
    switch (opt) {
      case 1:
      //Show Message
      const term = await readInput('City: ');
      //Find Place
      const places = await searches.city(term);
      //Select place
      const id= await listPlaces(places);
      if(id===0) continue;
      
      // Place selected
      const placeSel = places.find(l=> l.id === id)
      // Save on DB
      searches.addHistory(placeSel.name);
      // Obtain Wheater
      const weather=await searches.placeWeather(placeSel.lat,placeSel.lng)
      console.clear();
      //Weather data & show results
      console.log('\nCity Information\n'.blue);
      console.log('City: ',placeSel.name.cyan);
      console.log('Latitude: ', placeSel.lat);
      console.log('Longitude: ',placeSel.lng);
      console.log('How is: ',weather.desc.cyan);
      console.log('Temp: ',weather.temp);
      console.log('Minima: ',weather.min);
      console.log('Maxima: ',weather.max);
      break;
      case 2:
        searches.capitalizedHistory.forEach((place,i)=>{
          const idx=`${i+1}.`.cyan
          console.log(`${idx} ${place}`);
        })
      break;
    }

    
    if(opt !==0)await pause();
  } while (opt!==0);

}

main();