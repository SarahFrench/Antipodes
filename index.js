const request = require('request');
const readline = require('readline-sync');
const formatcoords = require('formatcoords');
const opn = require('opn');

const POSTCODE_API = 'https://api.postcodes.io/postcodes/'
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/'

const mapBoxPublicToken = 'pk.eyJ1Ijoic2FyYWhmcmVuY2g5MiIsImEiOiJjam80bnl6eDcwMjdiM3BudzI3anl2eDQwIn0.pwbmAXblpySo7OPtIcv8Lg'
//TODO - get static image of other side of the world using Map Box


function findAntipodes(postcodeLatLong){
    /*
    From the coordinates on a sphere, take the opposite value of the latitude
    (which is to put or remove a minus sign -), and remove or add 180 to the
    longitude (to keep it in the interval [-180; +180]).

    Example: (−12.345,67.890) coordinates have for antipode 12.345,−112.11

    (https://www.dcode.fr/antipodal-coordinates)
    */
    let latitude = postcodeLatLong[0];
    latitude = -latitude;

    let longitude = postcodeLatLong[1];

    if (longitude <= 0) {
      longitude = longitude + 180;
    } else if (longitude > 0){
      longitude = longitude - 180;
    } else {
      console.log("Problem finding Antipodes' coordinates");
    }


    let postcodeLatLongDMS = [latitude,longitude];
    return postcodeLatLongDMS;

}

function convertCoordinatesToDMS(postcodeLatLong){
  let dmsCoordinates = formatcoords(postcodeLatLong[0],postcodeLatLong[1]).format();
  return dmsCoordinates;
}


function findLatLong(postcode){
  let postcodeLatLong = []; //Longitude as first element, latitude as second element
  request(`${POSTCODE_API}${postcode}`, (error, response, body) => { //lambda function

    let postcodeInfo = JSON.parse(body);

    postcodeLatLong[0] = postcodeInfo.result.latitude;
    postcodeLatLong[1] = postcodeInfo.result.longitude;

    let antipodes = findAntipodes(postcodeLatLong);
    let antipodesDMS = convertCoordinatesToDMS(antipodes);
    antipodesDMS = antipodesDMS.replace(/\s/g, "");


    console.log(`You are in ${postcode}, (${postcodeLatLong[0]},${postcodeLatLong[1]}), ${antipodesDMS}`);
    console.log('Your browser is going to open and show you the exact opposite side of the world');
    setTimeout(function(){opn(`${GOOGLE_MAPS_URL}${antipodesDMS}`)}, 5000);

    setTimeout(function(){console.log("Did you go and look? I can't figure out how to make the script stop, so press ^C to exit");}, 5500);


  })
}


console.log("Enter a postcode:");
let postcode = readline.prompt();

// let postcode = "NW1 8QA";
// let postcodeLatLong = [ 51.544011, -0.143889 ];
//dms 51° 32′ 38.43960″ N 0° 8′ 38.00040″ W

findLatLong(postcode)
