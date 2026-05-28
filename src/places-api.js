export function findPlaces(category, place) {
  return fetch(
    `https://api.overturemapsapi.com/places?country=${place}&categories=${category}`,
    {
      method: 'GET',
      headers: {
        'x-api-key':
          'live_9QVKZDoN0bYVmfxnr8JXWzPkkpPHIBt9iVf0u4p53GwVAvX0lUpnpvk1ZeJqxD8H',
      },
    }
  );
}