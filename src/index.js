import Notiflix from 'notiflix';
import { findPlaces, getWeather } from './places-api.js';
import { createApiKey } from './theauthapi.js';
import { getImages } from './images-api.js';
import { findFlag } from './country-flag.js';
import { findInfo } from './country-info.js';
import { fetchCatBreeds } from './cat-api.js';
import { fetchDogBreeds, fetchStats } from './dog-api.js';
import aquiredDogs from './acquiredDogs.json'


import Countries from './countries_sorted_alphabetical.json';


const dogBreedImage = document.querySelector('.dogBreedImage');
dogBreedImage.style.padding = '10px';
const topCountryFlagImageWrapper = document.querySelector('.topCountryFlagWrapper');

const countrySelector = document.querySelector('.country-select');
const breedSelector = document.querySelector('.breed-select');

const altLink = document.querySelector('.place-alt-link');
const detailsArea = document.querySelector('.place-details');
const articlesArea = document.querySelector('.articles-area');

const placeArea = document.createElement('div');
const placeTable = document.createElement('table');
const placeTableHead = document.createElement('thead');
placeTableHead.innerHTML = `<tr>
<th style="color: #1f6b3a; text-align: center; border: 1px solid green; font-weight: 700;"><h3>Place Name</h3></th>
<th style="color: #1f6b3a; text-align: center; border: 1px solid green; font-weight: 700;"><h3>Social Link</h3></th>
</tr>`;
const placeTableBody = document.createElement('tbody');
const placeDetails = document.createElement('div');


placeArea.style.display = 'none';
placeArea.style.width = '100%';
placeArea.style.height = '100%';

placeTable.style.display = 'none';
placeDetails.style.display = 'none';

const placeInnerContr = document.querySelector('.place-table-wrapper');

placeInnerContr.append(placeArea);
placeArea.append(placeTable);
placeTable.append(placeTableHead);
placeTable.append(placeTableBody);
placeArea.append(placeDetails);


const articleOneButton = document.querySelector('.article-one-button');
const articleTwoButton = document.querySelector('.article-two-button');
const articleThreeButton = document.querySelector('.article-three-button');
const articleFourButton = document.querySelector('.article-four-button');
const articleFiveButton = document.querySelector('.article-five-button');
const articleSixButton = document.querySelector('.article-six-button');
const articleSevenButton = document.querySelector('.article-seven-button');
const articleEightButton = document.querySelector('.article-eight-button');
const articleNineButton = document.querySelector('.article-nine-button');
const articleTenButton = document.querySelector('.article-ten-button');
const articleElevenButton = document.querySelector('.article-eleven-button');
const articleTwelveButton = document.querySelector('.article-twelve-button');
const articleThirteenButton = document.querySelector('.article-thirteen-button');
const articleFourteenButton = document.querySelector('.article-fourteen-button');
const articleFifteenButton = document.querySelector('.article-fifteen-button');
const articleSixteenButton = document.querySelector('.article-sixteen-button');
const articleSeventeenButton = document.querySelector('.article-seventeen-button');
const articleEighteenButton = document.querySelector('.article-eighteen-button');

const articlesDisplay = document.querySelector('.articles-display');

const loaderDisplay = document.querySelector('.frame-loader');

articlesDisplay.addEventListener('load', () => {
  loaderDisplay.style.display = 'none';
  //console.log("none")
});


let dogBreeds;
let countryDogBreeds;
let allPetBreeds;
let countryDogBreedsElement;
let selectedCountry = null;
let placeWeather = null;
let selectedPlace;
let selectedBreed;
let selectedCountryName = null;
let placesArray;
let myPlaceObj;
let countryFlag;
let suitabilityScore;
let selectedBreedName;
let articleLink;

function articleSelector(button) {

  
  
  button.addEventListener('click', (event) => {
    loaderDisplay.style.display = 'flex';
    //console.log('flex');
     articlesArea.scrollIntoView({
       behavior: 'smooth',
       block: 'start', // or 'center', 'end', 'nearest'
     });
    articleLink = event.target.name;
    articlesDisplay.setAttribute('src', articleLink);
  })
  
}

function renderCountryOptions(selector, countries, Instruction) {
   //selector.innerHTML = '';

   const placeholder = document.createElement('option');
   placeholder.setAttribute('disabled', '');
   placeholder.setAttribute('selected', 'selected');
   placeholder.setAttribute('value', '');
   placeholder.textContent = Instruction;
   placeholder.style.fontWeight = 'bold';
   selector.append(placeholder);

   countries.forEach(country => {
     const option = document.createElement('option');
     option.setAttribute('value', country.alpha_2);
     option.textContent = country.name;
     option.style.fontWeight = '700';
     option.style.color = '#1f6b3a';
     selector.append(option);
   });
 }

function renderDogBreeds(selector, breeds) {
  const placeholder = document.createElement('option');
  placeholder.setAttribute('disabled', '');
  placeholder.setAttribute('selected', 'selected');
  placeholder.setAttribute('value', '');
  placeholder.textContent = 'Choose a Dog Breed';
  placeholder.style.fontWeight = 'bold';
  selector.append(placeholder);

  breeds.forEach(breed => {
    
      const dogOption = document.createElement('option');
      dogOption.setAttribute('value', breed.name);
      dogOption.textContent = breed.name;
      dogOption.style.fontWeight = '700';
      dogOption.style.color = '#1f6b3a';
      selector.append(dogOption);
    
  });
}

function breedEventListener(selector) {
  selector.addEventListener('change', event => {
    if (selectedCountry === null) {
      Notiflix.Notify.failure('Choose a country first');
      event.target.value = '';
      return;
    }
    detailsArea.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // or 'center', 'end', 'nearest'
    });
    //console.log('click');
    Notiflix.Loading.hourglass('Loading data, please wait...');
    console.log(event.target.value)
    selectedBreedName = event.target.value;
    aquiredDogs.map((dog) => {
      if (selectedBreedName === dog.name) {
        dogBreedImage.innerHTML = `<img src="${dog.image_link}" alt='Dog Breed' style="height: 200px">`;
      }
    })
    fetchStats(event.target.value)
      .then(facts => {
        if (facts.length === 0) {
          Notiflix.Notify.failure(
            `Data on ${event.target.value} is not available yet.`
          );
          Notiflix.Loading.remove();
        }
        selectedBreed = facts;
        return selectedBreed;
      })
      
      .then(
        (breed) => {
          console.log(breed)
          if (breed.length > 0) {
            findPlaces(selectedCountry)
              .then(res => {
                if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
              })
              .then(res => {
                placesArray = res;
                Notiflix.Loading.remove();
                //console.log(res);
                placeArea.style.display = 'flex';
                altLink.style.display = 'none';
                detailsArea.style.height = 'fit-content';
                placeTable.style.display = 'block';
                placeTable.style.borderCollapse = 'collapse';
                placeTable.style.border = '3px solid #ffff';
                placeTable.style.padding = '10px';
                placeTable.style.borderRadius = '10px';
                placeTable.style.backgroundColor = '#FFD369';
               
                placeArea.style.alignItems = 'start';
                placeArea.style.justifyContent = 'space-between';
                placeTable.style.height = '300px';
                placeTable.style.overflowX = 'auto';
                placeTable.style.overflowY = 'auto';
                placeTable.style.boxShadow =
                  '0 4px 6px -1px #0000004d, 0 2px 4px -1px #0003, 0 10px 12px -6px #0006';
                placeDetails.style.display = 'block';
                placeDetails.style.width = '600px';
                placeDetails.style.height = '300px';
                placeDetails.style.overflowX = 'auto';
                placeDetails.style.overflowY = 'auto';
                placeDetails.style.borderRadius = '10px';
                placeDetails.style.border = '3px solid #ffff';
                placeDetails.style.boxShadow =
                  'rgba(0, 0, 0, 0.3) 0px 4px 6px -1px, rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.4) 0px 10px 12px -6px';
                event.target.value = '';
                placeDetails.innerHTML = `<div style="display: flex; background-color: #ffd369; align-items: center; justify-content: center; width: 100%; height:100%;">
<div style="background-color: #1f6b3a; color: #ffd369; border: 1px solid #ffff; padding: 30px; border-radius: 10px; text-shadow: 3px 3px 20px #721111, 5px 5px 5px #000;">Click on a Place Name</div>
</div>`;

                const foundPlaces = res
                  .map(place => {
                    if (place.properties.socials[0]) {
                      return `
      <tr>
                    <td style="color: #1f6b3a; text-align: left; border: 1px solid green; max-width: 400px; cursor: pointer;" onmouseover="this.style.background='#94c751';"
  onmouseout="this.style.background='#FFD369';" data-id="${place.id}" onclick="selectPlace(event)">${place.properties.names.primary}</td>
  
                    <td style="color: #1f6b3a; text-align: left; border: 1px solid green;"><a href="${place.properties.socials[0]}" target='_blank'>CLICK HERE</a></td>
      </tr>
                  `;
                    }
                  })
                  .join('');
                if (foundPlaces.length !== 0) {
                  placeTableBody.innerHTML = foundPlaces;
                } else {
                  placeTableBody.innerHTML = `<tr>
                                  <td style="color: #1f6b3a; text-align: center; border: 1px solid green;">Null</td>
                                  <td style="color: #1f6b3a; text-align: center; border: 1px solid green;">Null</td>
                                  </tr>
      `;
                }
              })
              .catch(error => {
                //loaderMsg.classList.add('hide');
                //errorMsg.classList.remove('hide');
                Notiflix.Loading.remove();
                Notiflix.Notify.failure(
                  'Oops! Something went wrong! Select Breed again!'
                );
                event.target.value = '';
                console.error(`Error message ${error}`);
              })
          }
          if (breed.length === 0) {
            placeTable.style.display = 'none';
            placeDetails.style.display = 'none';
            altLink.style.display = 'block';
            placeDetails.innerHTML = `<div style="display: flex; background-color: #ffd369; align-items: center; justify-content: center; width: 100%; height:100%;">
<div style="background-color: #1f6b3a; color: #ffd369; border: 1px solid #ffff; padding: 30px; border-radius: 10px; text-shadow: 3px 3px 20px #721111, 5px 5px 5px #000;">Click on a Place Name</div>
</div>`;
            Notiflix.Loading.remove();
            console.log("Fine");
          }
        });
  });
}

function generateParkSuitabilityScore(weather, dogBreed) {
  // Start from a neutral score.
  // This prevents almost every dog/weather combo from reaching 100 too easily.
  let baseScore = 50;

  const breakdown = {
    weatherIcon: 0,
    temperature: 0,
    precipitation: 0,
    dayTime: 0,
    dogTemperament: 0,
    maintenance: 0,
    behaviorPenalty: 0,
  };

  // AccuWeather WeatherIcon scoring.
  // Positive values mean good park weather.
  // Negative values mean poor or risky park weather.
  const weatherIconScores = {
    1: 10, // Sunny
    2: 9, // Mostly Sunny
    3: 8, // Partly Sunny
    4: 7, // Intermittent Clouds
    5: 5, // Hazy Sunshine
    6: 4, // Mostly Cloudy
    7: 2, // Cloudy
    8: 0, // Dreary / Overcast
    11: -15, // Fog
    12: -15, // Showers
    13: -18, // Mostly Cloudy w/ Showers
    14: -15, // Partly Sunny w/ Showers
    15: -40, // T-Storms
    16: -45, // Mostly Cloudy w/ T-Storms
    17: -40, // Partly Sunny w/ T-Storms
    18: -20, // Rain
    19: -15, // Flurries
    20: -20, // Mostly Cloudy w/ Flurries
    21: -15, // Partly Sunny w/ Flurries
    22: -30, // Snow
    23: -35, // Mostly Cloudy w/ Snow
    24: -40, // Ice
    25: -30, // Sleet
    26: -40, // Freezing Rain
    29: -35, // Rain and Snow
    30: -15, // Hot
    31: -15, // Cold
    32: -10, // Windy

    // Night icons
    33: 8, // Clear
    34: 7, // Mostly Clear
    35: 5, // Partly Cloudy
    36: 4, // Intermittent Clouds
    37: 2, // Hazy Moonlight
    38: 0, // Mostly Cloudy
    39: -15, // Partly Cloudy w/ Showers
    40: -18, // Mostly Cloudy w/ Showers
    41: -40, // Partly Cloudy w/ T-Storms
    42: -45, // Mostly Cloudy w/ T-Storms
    43: -30, // Mostly Cloudy w/ Flurries
    44: -35, // Mostly Cloudy w/ Snow
  };

  const weatherIcon = weather[0]?.WeatherIcon;
  const temp = weather[0]?.Temperature?.Metric?.Value;
  const hasPrecipitation = weather[0]?.HasPrecipitation;
  const isDayTime = weather[0]?.IsDayTime;
  const coatLength = dogBreed?.coat_length ?? 3;

  // -------------------------------
  // 1. Weather icon score
  // -------------------------------
  // This is the main weather condition score.
  // It handles sunny, cloudy, rain, snow, storm, fog, windy, etc.
  breakdown.weatherIcon = weatherIconScores[weatherIcon] ?? 0;

  // -------------------------------
  // 2. Temperature score
  // -------------------------------
  // Dogs usually do best in mild temperatures.
  if (typeof temp === 'number') {
    if (temp >= 16 && temp <= 24) {
      breakdown.temperature += 20; // Ideal temperature
    } else if (temp >= 12 && temp < 16) {
      breakdown.temperature += 12; // Cool but okay
    } else if (temp > 24 && temp <= 28) {
      breakdown.temperature += 8; // Warm but manageable
    } else if (temp >= 8 && temp < 12) {
      breakdown.temperature += 3; // Quite cool
    } else if (temp > 28 && temp <= 32) {
      breakdown.temperature -= 10; // Too hot for many dogs
    } else {
      breakdown.temperature -= 20; // Extreme temperature
    }
  }

  // -------------------------------
  // 3. Coat length weather adjustment
  // -------------------------------
  // coat_length usually ranges from:
  // 1 = very short coat
  // 2 = short coat
  // 3 = medium coat
  // 4 = long coat
  // 5 = very long coat
  //
  // Long coats help in cold weather.
  // Short coats help in hot weather.
  // In mild weather, coat length has little effect.
  if (typeof temp === 'number') {
    if (temp < 12) {
      if (coatLength === 1) breakdown.coatLength -= 6;
      else if (coatLength === 2) breakdown.coatLength -= 3;
      else if (coatLength === 4) breakdown.coatLength += 3;
      else if (coatLength === 5) breakdown.coatLength += 6;
    }

    if (temp > 28) {
      if (coatLength === 1) breakdown.coatLength += 6;
      else if (coatLength === 2) breakdown.coatLength += 3;
      else if (coatLength === 4) breakdown.coatLength -= 3;
      else if (coatLength === 5) breakdown.coatLength -= 6;
    }
  }

  // -------------------------------
  // 4. Precipitation penalty
  // -------------------------------
  // Rain, snow, or other precipitation can make parks muddy,
  // slippery, uncomfortable, or unsafe.
  if (hasPrecipitation) {
    breakdown.precipitation -= 20;
  }

  // -------------------------------
  // 5. Daytime score
  // -------------------------------
  // Daytime is generally better for visibility and safety.
  if (isDayTime) {
    breakdown.dayTime += 5;
  } else {
    breakdown.dayTime -= 12;
  }

  // -------------------------------
  // 6. Dog temperament score
  // -------------------------------
  // These traits increase park suitability.
  // A dog that is playful, social, trainable, and good with others
  // is usually better suited for a public park.
  breakdown.dogTemperament += dogBreed[0].energy * 3;
  breakdown.dogTemperament += dogBreed[0].playfulness * 3;
  breakdown.dogTemperament += dogBreed[0].good_with_other_dogs * 4;
  breakdown.dogTemperament += dogBreed[0].good_with_strangers * 3;
  breakdown.dogTemperament += dogBreed[0].trainability * 2;

  // -------------------------------
  // 7. Maintenance penalty
  // -------------------------------
  // These do not make the dog "bad" for parks,
  // but they can make the park visit less convenient.
  breakdown.maintenance -= dogBreed[0].shedding * 1.5;
  breakdown.maintenance -= dogBreed[0].grooming * 1.2;
  breakdown.maintenance -= dogBreed[0].drooling * 1.5;

  // -------------------------------
  // 8. Behavior penalty
  // -------------------------------
  // High barking and protectiveness can make public park visits harder,
  // especially around strangers, children, and other dogs.
  breakdown.behaviorPenalty -= dogBreed[0].barking * 2;
  breakdown.behaviorPenalty -= dogBreed[0].protectiveness * 1.5;

  // Extra penalty if the dog is not very dog-friendly.
  if (dogBreed[0].good_with_other_dogs <= 2) {
    breakdown.behaviorPenalty -= 15;
  }

  // Extra penalty if the dog is not very stranger-friendly.
  if (dogBreed[0].good_with_strangers <= 2) {
    breakdown.behaviorPenalty -= 10;
  }

  // Very high-energy dogs may need large parks,
  // not just any ordinary park.
  if (dogBreed[0].energy >= 5) {
    breakdown.behaviorPenalty -= 5;
  }

  // -------------------------------
  // 9. Final score calculation
  // -------------------------------
  const rawScore =
    baseScore +
    breakdown.weatherIcon +
    breakdown.temperature +
    breakdown.precipitation +
    breakdown.dayTime +
    breakdown.dogTemperament +
    breakdown.maintenance +
    breakdown.behaviorPenalty;

  // Keep score between 0 and 100.
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // -------------------------------
  // 10. Rating label
  // -------------------------------
  let rating;

  if (score >= 85) {
    rating = 'Excellent';
  } else if (score >= 70) {
    rating = 'Very Good';
  } else if (score >= 55) {
    rating = 'Good';
  } else if (score >= 40) {
    rating = 'Fair';
  } else {
    rating = 'Poor';
  }

  return {
    score,
    rating,
    breakdown,
    summary: `${dogBreed[0].name} has a ${rating.toLowerCase()} park suitability score of ${score}/100 for ${myPlaceObj?.properties?.names?.primary} under the current weather conditions.`,
  };
}


articleSelector(articleOneButton);

articleSelector(articleTwoButton);

articleSelector(articleThreeButton);

articleSelector(articleFourButton);

articleSelector(articleFiveButton);

articleSelector(articleSixButton);

articleSelector(articleSevenButton);

articleSelector(articleEightButton);

articleSelector(articleNineButton);

articleSelector(articleTenButton);

articleSelector(articleElevenButton);

articleSelector(articleTwelveButton);

articleSelector(articleThirteenButton);

articleSelector(articleFourteenButton);

articleSelector(articleFifteenButton);

articleSelector(articleSixteenButton);

articleSelector(articleSeventeenButton);

articleSelector(articleEighteenButton);



renderCountryOptions(countrySelector, Countries, 'Choose a country');


     dogBreeds = aquiredDogs;
     //console.log(dogBreeds);
     renderDogBreeds(breedSelector, dogBreeds);

     
   

breedEventListener(breedSelector);










window.selectPlace = (event) => {
  
  const id = event.currentTarget.getAttribute('data-id');
  myPlaceObj = placesArray.find(place => place.id === id);
  Notiflix.Loading.hourglass('Getting weather details');
  getWeather(
    myPlaceObj.geometry.coordinates[1],
    myPlaceObj.geometry.coordinates[0]
  )
    .then(response => {
      Notiflix.Loading.remove();
      return response.json();
    })
    .then(weatherDetails => {
      const suitabilityDetails = generateParkSuitabilityScore(
        weatherDetails,
        selectedBreed
      );
      const mySelectedCountry = Countries.find(
        country => country.alpha_2 === selectedCountry
      );
      placeDetails.innerHTML = `<div style="display: flex; flex-direction: column; background-color: #FFD369; align-items: center; justify-content: center; gap: 20px; border-radius: 30px; border: 1px solid green; padding: 20px; ">
                         
                         <div style="display: flex; flex-direction: column; gap:15px; align-items: center; ">
                         
                         <table style="border-collapse: collapse; width: 500px;">

                         <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Place Name:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">  ${
                          myPlaceObj?.properties?.names?.primary ?? 'Unknown'
                        }</td>
                        </tr>

                        <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Breed Name:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">  ${
                          selectedBreedName
                        }</td>
                        </tr>

                           <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Weather Condition:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          weatherDetails
                            ? weatherDetails[0].WeatherText
                            : 'Null'
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Park Suitability Score:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          weatherDetails ? suitabilityDetails.score : 'Null'
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Rating:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          weatherDetails ? suitabilityDetails.rating : 'Null'
                        }</td>
                        </tr>

                         <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Summary:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          weatherDetails ? suitabilityDetails.summary : 'Null'
                        }</td>
                        </tr>

                        <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Freeform:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          myPlaceObj.properties.addresses[0].freeform
                            ? myPlaceObj.properties.addresses[0].freeform
                            : 'Null'
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Locality:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          myPlaceObj.properties.addresses[0].locality
                            ? myPlaceObj.properties.addresses[0].locality
                            : 'Null'
                        }</td>
                        </tr>

                         <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Postal Code:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          myPlaceObj.properties.addresses[0].postcode
                            ? myPlaceObj.properties.addresses[0].postcode
                            : 'Null'
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Reigon:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          myPlaceObj.properties.addresses[0].region
                            ? myPlaceObj.properties.addresses[0].region
                            : 'Null'
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Country:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          mySelectedCountry.name
                        }</td>
                        </tr>

                           <tr>
                        <th style="color: #1f6b3a; text-align: left; border: 1px solid green; font-weight: 700; width:120px;"><h3>Breeds:</h3></th>
                        <td style="color: #1f6b3a; text-align: left; border: 1px solid green;">${
                          allPetBreeds != 0 ? allPetBreeds.join(', ') : 'Null'
                        }</td>
                        </tr>

            

                         </table>
                         
                         
                         </div>

                      
                         </div>
                         </div>
                         </div>`;
    })
    .catch(error => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure('Error, select place again!');
      console.error(`Error message ${error}`);
    });
}

countrySelector.addEventListener('change', event => {
  
  selectedCountry = event.target.value;
  dogBreedImage.style.display = 'block';
  topCountryFlagImageWrapper.style.display = 'block';
  placeTable.style.display = 'none';
  placeDetails.style.display = 'none';
  placeArea.style.display = 'none';
  altLink.style.display = 'block';
  detailsArea.style.height = '500px';
  placeInnerContr.style.alignItems = "center";
  placeInnerContr.style.justifyContent = 'center';
  placeDetails.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height:100%;">
<div style="background-color: #49e2e6; color: #ffff; border: 1px solid #ffff; padding: 30px; border-radius: 10px; text-shadow: 3px 3px 20px #721111, 5px 5px 5px #000;">Click on a Place Name</div>
</div>`;
  Notiflix.Loading.hourglass('Fetching country Information...');
  findFlag(selectedCountry)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(res => {
      Notiflix.Loading.remove();
      //console.log(res);
      countryFlag = res;
      topCountryFlagImageWrapper.innerHTML = `<img src="${countryFlag.rectangle_image_url}" alt='Country flag' style="height: 200px">`;
      Notiflix.Notify.success('Country Information retreived');
      countryDogBreeds = dogBreeds.filter(
        breed => breed.country_code === selectedCountry
      );

      countryDogBreedsElement = countryDogBreeds.map(breed => {
        return `<span>${breed.name}</span>`;
      });

      allPetBreeds = [...countryDogBreedsElement];
    })
    .catch(error => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        'Cannot find info on Country'
      );
      event.target.value="";
      console.error(`Error message ${error}`);
    });

  
  
       
     })





  


