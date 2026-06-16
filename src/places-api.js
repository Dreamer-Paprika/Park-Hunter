export function findPlaces(country) {
  return fetch(
    `https://api.overturemapsapi.com/places?country=${country}&categories=dog_park`,
    {
      method: 'GET',
      headers: {
        'x-api-key':
          'live_9QVKZDoN0bYVmfxnr8JXWzPkkpPHIBt9iVf0u4p53GwVAvX0lUpnpvk1ZeJqxD8H',
      },
    }
  );
}


export function getWeather(lat, long) {
  return fetch(
    `https://pawpoint-backend.onrender.com/api/places/getNewWeatherApi?lat=${lat}&long=${long}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key':
          'live_9unjaE5woU56e6rHAl8t23IgaXCN58bmCGt1csE1ozFTwv2MKbOsWEm3gknrFaS0'
      },
    }
  )
}
