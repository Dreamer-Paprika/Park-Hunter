import Notiflix from 'notiflix';
import { fetchCatBreeds } from './cat-api.js';
import { fetchDogBreeds } from './dog-api.js';
import { fetchCatByBreed } from './cat-api.js';
import { fetchDogByBreed } from './dog-api.js';
import { findPlaces } from './places-api.js';
import { createApiKey } from './theauthapi.js';
import { getImages } from './images-api.js';

import Countries from './countries_sorted_alphabetical.json';
import dogPlaceCategories from './dogPlaceCategories.json';
import catPlaceCategories from './catPlaceCategories.json';

const catSelector = document.querySelector('.cat-breed-select');
const dogSelector = document.querySelector('.dog-breed-select');
const altLink = document.querySelector('.place-alt-link');
const detailsArea = document.querySelector('.place-details');
const placeSelector = document.createElement('select');
placeSelector.style.display = 'none';

const placeTable = document.createElement('table');
const placeTableHead = document.createElement('thead');
placeTableHead.innerHTML = `<tr>
<th style="color: #8B0000; text-align: center; border: 1px solid #8B0000; font-weight: 700;"><h3>Place Name</h3></th>
<th style="color: #8B0000; text-align: center; border: 1px solid #8B0000; font-weight: 700;"><h3>Social Link</h3></th>
</tr>`;
const placeTableBody = document.createElement('tbody');

placeTable.style.display = 'none';


const innerContr = document.querySelector('.pet-bio');

const placeInnerContr = document.querySelector('.place-table-wrapper');

placeInnerContr.append(placeSelector);
placeInnerContr.append(placeTable);
placeTable.append(placeTableHead);
placeTable.append(placeTableBody);

let dogBreeds;
let selectedPlace;

const apiGenTable = document.querySelector('.api-gen-table-wrapper');

const apiViewTable = document.querySelector('.api-view-table-wrapper');

const apiUseTable = document.querySelector('.api-use-table-wrapper');

apiUseTable.style.display = "none";


const keySideEffects = () => {
  if (JSON.parse(localStorage.getItem('myApiKey'))) {
    const keyDetails = JSON.parse(localStorage.getItem('myApiKey'));
    apiGenTable.style.display = 'none';

    const userLocale = navigator.language; // e.g., "en-US" or "fr-FR"
    const myDate = new Date(keyDetails.createdAt);

    const formatter = new Intl.DateTimeFormat(userLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // Optional: include seconds
      hour12: true, // Optional: use 12-hour clock (set to false for 24-hour clock)
    });
    const createdDate = formatter.format(myDate);

    apiViewTable.innerHTML = `
     <table class="api-view-table" style="border-collapse: collapse;">
              <caption style="color: #8B0000; border: 1px solid #8B0000; font-weight: 700; font-size: 20px;">View your API Details</caption>
              <tr>
                <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;">API KEY NAME:</th>
                <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${keyDetails.name}</td>
              </tr>
              <tr>
                <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;">API KEY:</th>
                <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${keyDetails.key}</td>
              </tr>
              <tr>
                <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;">CUSTOM ACCOUNT ID:</th>
                <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${keyDetails.customAccountId}</td>
              </tr>

              <tr>
                <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;">CUSTOM METADATA:</th>
                <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${keyDetails.customMetaData.metadata_val}</td>
              </tr>

              <tr>
                <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;">CREATED AT:</th>
                <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${createdDate}</td>
              </tr>
            </table>
  `;
    
apiUseTable.style.display = 'flex';
  }
}

keySideEffects();

/*if (localStorage.getItem('hasKey') === null) {
  apiViewTable.style.display = 'none';
}*/

const keyName = document.querySelector('.keyName');
const keyId = document.querySelector('.keyId');
const keyMetaData = document.querySelector('.keyMetaData');

const apiGenTableButton = document.querySelector('.api-gen-table-wrapper-button');

const apiUseTableButton = document.querySelector(".api-use-table-wrapper-button");

const keyValue = document.querySelector('.keyValue');

const imageGallery = document.querySelector('.image-gallery');

const apiDetailsArea = document.querySelector('.api-details');

apiGenTableButton.addEventListener("click", async () => {
  if ((keyName.value.trim() === "" || keyId.value.trim() === "" || keyMetaData.value.trim() === "")) {
    Notiflix.Notify.warning('All feilds are required!');
    return
  }
  Notiflix.Loading.hourglass('Creating Api Key, please wait...');
  try {
    const key = await createApiKey(
      keyName.value.trim(),
      keyId.value.trim(),
      keyMetaData.value.trim()
    );
    localStorage.setItem('myApiKey', JSON.stringify(key));
    Notiflix.Loading.remove();
    Notiflix.Notify.success('API Key created and stored successfully!');
    keySideEffects();
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Failed to create API Key');
    console.error('Error creating API key:', error);
  }
});


apiUseTableButton.addEventListener("click", async() => { 
  if (keyValue.value.trim() === "") {
   Notiflix.Notify.warning('Enter Api Key!');
   return;
  }
  Notiflix.Loading.hourglass('Getting Images, please wait...');
  
 try {
    const Images = await getImages(keyValue.value.trim());
    console.log('Images aquired:', Images);
   apiDetailsArea.style.height = "fit-content";
    const myImages = Images
      .map(Image => {
        return `
        <li><img src=${Image.link} style="width: 200px; height: 200px; border: 1px solid #721111;"/></li>
        `;
      })
     .join('');
   
   imageGallery.style.border = '1px solid #721111';
   imageGallery.style.padding = '20px';
   imageGallery.style.borderRadius = '20px';
   imageGallery.innerHTML = myImages;

    Notiflix.Loading.remove();
    Notiflix.Notify.success('View response in your browser console!');
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Failed to get Images');
    console.error('Error getting Images:', error);
  }

});



Notiflix.Loading.hourglass('Fetching breeds, please wait...');


fetchCatBreeds()
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const str = response.json()
    //console.log(str);
    return str;
  })

  .catch(error => {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );

    console.error(`Error message ${error}`);
  })

  .then(users => {
    renderCatBreeds(catSelector, users);

    catSelector.addEventListener('change', event => {
      innerContr.innerHTML = '';
      placeTable.style.display = 'none';
      detailsArea.style.height = '500px';
      //console.log('Selected value:', event.target.value);
      const selected = event.target.value;

      Notiflix.Loading.hourglass('Loading data, please wait...');
      fetchCatByBreed(selected)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return response.json();
        })

        .then(ans => {
          const data = ans
            .map(cat => {
              const myCatPlace = Countries.find(country => country.alpha_2 === cat.breeds[0].country_code);
              selectedPlace = myCatPlace;
              return `
              <div style="display: flex; align-items: center; justify-content: center; gap: 20px; border-radius: 30px; border: 1px solid rgb(114, 17, 17); padding: 20px; ">
                         <div style="border: 1px solid #8B0000;"><img src="${
                           cat.url
                         }" alt="Picture of Cat" style="width: 200px; height: 200px"></div>
                         <div style="display: flex; flex-direction: column; gap:15px; align-items: center; ">
                         
                         <table style="border-collapse: collapse;">

                         <tr>
                        <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Name:</h3></th>
                        <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                          cat.breeds[0].name
                        }</td>
                        </tr>

                        <tr>
                        <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Description:</h3></th>
                        <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                          cat.breeds[0].description
                        }</td>
                        </tr>

                          <tr>
                        <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Temperament:</h3></th>
                        <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                          cat.breeds[0].temperament
                        }</td>
                        </tr>

                         <tr>
                        <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Country of Origin:</h3></th>
                        <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${myCatPlace.name}</td>
                        </tr>

                         </table>


                         <button style="padding: 10px 5px; background-color: rgb(240, 164, 65); border-radius: 20px; font-family: Comic Sans MS; font-weight: 700; border: 1px solid #8B0000; color: #8B0000;"><a href="#placeInfo">Find Places in ${myCatPlace.name}</a></button>
                         
                         
                         </div>
                         </div>
                         </div>
                         </div>
                                   `;
            })
            .join('');
          innerContr.insertAdjacentHTML('beforeend', data);
          altLink.style.display = 'none';
          placeSelector.style.display = 'block';
          placeSelector.style.width = '260px';
          placeSelector.style.color = '#721111';
          placeSelector.style.border = '1px solid #721111';
          placeSelector.style.borderRadius = '5px';
          placeSelector.style.padding = '5px';
          placeSelector.style.fontFamily = 'Comic Sans MS';
          placeSelector.style.fontWeight = '700';
          renderCatPlaces(placeSelector, catPlaceCategories);
          event.target.value = '';
          Notiflix.Loading.remove();
          
        })

        .catch(error => {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure(
            'Oops! Something went wrong! Try reloading the page!'
          );

          console.error(`Error message ${error}`);
        });
    });
  });

  fetchDogBreeds()
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.json();
    })

    .catch(error => {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );

      console.error(`Error message ${error}`);
    })

    .then(users => {
      dogBreeds = users
      renderDogBreeds(dogSelector, users);
      //loaderMsg.classList.add('hide');
      Notiflix.Loading.remove();
      

      dogSelector.addEventListener('change', event => {
        innerContr.innerHTML = '';
        placeTable.style.display = 'none';
        detailsArea.style.height = '500px';
        //console.log('Selected value:', event.target.value);
        //console.log('Selected id:', this);
        const selected = event.target.value;
        const theObj = dogBreeds.find(item => item.name === selected);
        const breedId = theObj.id

        Notiflix.Loading.hourglass('Loading data, please wait...');
        fetchDogByBreed(breedId)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const tace = response.json();
            //console.log(tace);
            return tace;
          })

          .then(ans => {
            console.log(ans);
            const myObj = dogBreeds.find(item => item.name === selected);
            console.log(myObj);
            const myPlace = Countries.find(country => country.alpha_2 === myObj.country_code);
            if (myObj.country_code === "AG") {
              selectedPlace = {
                name: 'Afghanistan',
                alpha_2: 'AF',
                alpha_3: 'AFG',
                numeric: '004',
              };
            }
            else {
              selectedPlace = myPlace;
            }
             //console.log(myObj);
            //console.log(myPlace);
            const data = ans
              .map(dog => {
                return `
                         <div style="display: flex; align-items: center; justify-content: center; gap: 20px; border-radius: 30px; border: 1px solid rgb(114, 17, 17); padding: 20px; ">
                         <div style="border: 1px solid #8B0000;"><img src="${
                           dog.url
                         }" alt="Picture of Dog" style="width: 200px; height: 200px"/></div>
                         
                         <div style="display: flex; flex-direction: column; gap:15px; align-items: center; ">

                          <table style="border-collapse: collapse;">
                
                  <tr>
                    <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Name:</h3></th>
                    <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                      myObj.name
                    }</td>
                  </tr>
                  <tr>
                    <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Bread For:</h3></th>
                    <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                      myObj.bred_for
                    }</td>
                  </tr>
                  <tr>
                    <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Temperament:</h3></th>
                    <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${
                      myObj.temperament
                    }</td>
                  </tr>
                  <tr>
                    <th style="color: #8B0000; text-align: left; border: 1px solid #8B0000; font-weight: 700;"><h3>Country of Origin:</h3></th>
                    ${
                      myObj.country_code === 'AG'
                        ? ` <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">Afghanistan</td>`
                        : ` <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${myPlace.name}</td>`
                    }
                  </tr>
              </table>


                         ${
                           myObj.country_code === 'AG'
                             ? `<button style="padding: 10px 5px; background-color: rgb(240, 164, 65); border-radius: 20px; font-family: Comic Sans MS; font-weight: 700; border: 1px solid #8B0000; color: #8B0000;"><a href="#placeInfo">Find Places in Afghanistan</a></button>`
                             : `<button style="padding: 10px 5px; background-color: rgb(240, 164, 65); border-radius: 20px; font-family: Comic Sans MS; font-weight: 700; border: 1px solid #8B0000; color: #8B0000;"><a href="#placeInfo">Find Places in ${myPlace.name}</a></button>`
                         }
                         </div>
                         </div>

                                   `;
              })
              .join('');
            innerContr.insertAdjacentHTML('beforeend', data);
            altLink.style.display = 'none';
            placeSelector.style.display = 'block';
            placeSelector.style.width = '260px';
            placeSelector.style.color = '#721111';
            placeSelector.style.border = '1px solid #721111';
            placeSelector.style.borderRadius = '5px'
            placeSelector.style.padding = '5px'
            placeSelector.style.fontFamily = "Comic Sans MS";
            placeSelector.style.fontWeight = "700";
            renderDogPlaces(placeSelector, dogPlaceCategories);
            event.target.value = "";
            Notiflix.Loading.remove();
            
          })

          .catch(error => {
            //loaderMsg.classList.add('hide');
            //errorMsg.classList.remove('hide');
            Notiflix.Loading.remove();
            Notiflix.Notify.failure(
              'Oops! Something went wrong! Try reloading the page!'
            );

            console.error(`Error message ${error}`);
          });
      });
    });

placeSelector.addEventListener('change', (event) => {
  
  Notiflix.Loading.hourglass('Loading data, please wait a bit...');
  findPlaces(event.target.value, selectedPlace.alpha_2).then((res) => { return res.json() }).then((res) => {
    Notiflix.Loading.remove();
    //console.log(res);
    detailsArea.style.height = "fit-content";
    placeTable.style.display = 'block';
    placeTable.style.borderCollapse = 'collapse';
    const foundPlaces = res.map((place) => {
      if (place.properties.socials[0]) {
        return `
      <tr>
                    <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;">${place.properties.names.primary}</td>
                    <td style="color: #8B0000; text-align: left; border: 1px solid #8B0000;"><a href=${place.properties.socials[0]} target='_'>CLICK HERE</a></td>
      </tr>
                  `;};
    }).join('');
    if (foundPlaces.length !== 0) {
      placeTableBody.innerHTML = foundPlaces;
    }
    else {
      placeTableBody.innerHTML = `<tr>
                                  <td style="color: #8B0000; text-align: center; border: 1px solid #8B0000;">Null</td>
                                  <td style="color: #8B0000; text-align: center; border: 1px solid #8B0000;">Null</td>
                                  </tr>
      `;
    }
  });
  
});    


function renderCatBreeds(selector,users) {
  const placeholder = document.createElement('option');
  placeholder.setAttribute('disabled', '');
  placeholder.setAttribute('selected', 'selected');
  placeholder.setAttribute('value', '');
  placeholder.textContent = 'Choose a Cat Breed';
  placeholder.style.fontWeight = 'bold';
  selector.append(placeholder);

  users.forEach(user => {
    if (user.country_code) {
      const catOption = document.createElement('option');
      catOption.setAttribute('value', user.id);
      catOption.textContent = user.name;
      catOption.style.backgroundColor = '#333333';
      catOption.style.color = 'white';
      //option.style.borderRadius = "5px";
      selector.append(catOption);
    }
  });
}

function renderDogBreeds(selector, users) {
  const placeholder = document.createElement('option');
  placeholder.setAttribute('disabled', '');
  placeholder.setAttribute('selected', 'selected');
  placeholder.setAttribute('value', '');
  placeholder.textContent = 'Choose a Dog Breed';
  placeholder.style.fontWeight = 'bold';
  selector.append(placeholder);

  users.forEach(user => {
    if (user.country_code) {
      const option = document.createElement('option');
      option.setAttribute('value', user.name);
      option.setAttribute('data-id1', user.id);
      option.textContent = user.name;
      option.style.backgroundColor = '#333333';
      option.style.color = 'white';
      //option.style.borderRadius = "5px";
      selector.append(option);
    }
  });
}

function renderDogPlaces(selector, categories) {

   selector.innerHTML = '';
 
    const placeholder = document.createElement('option');
    placeholder.setAttribute('disabled', '');
    placeholder.setAttribute('selected', 'selected');
    placeholder.setAttribute('value', '');
    placeholder.textContent = 'Choose a Place Category';
    placeholder.style.fontWeight = 'bold';
    selector.append(placeholder);

    categories.forEach(category => {
    
      const option = document.createElement('option');
      option.setAttribute('value', category.value);
      option.textContent = category.label;
      option.style.backgroundColor = '#333333';
      option.style.color = 'white';
      //option.style.borderRadius = "5px";
      selector.append(option);
    
    })
  };



function renderCatPlaces(selector, categories) {

   selector.innerHTML = '';
 
    const placeholder = document.createElement('option');
    placeholder.setAttribute('disabled', '');
    placeholder.setAttribute('selected', 'selected');
    placeholder.setAttribute('value', '');
    placeholder.textContent = 'Choose a Place Category';
    placeholder.style.fontWeight = 'bold';
    selector.append(placeholder);

    categories.forEach(category => {
      const option = document.createElement('option');
      option.setAttribute('value', category.value);
      option.textContent = category.label;
      option.style.backgroundColor = '#333333';
      option.style.color = 'white';
      //option.style.borderRadius = "5px";
      selector.append(option);
    });
  }


