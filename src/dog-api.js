export function fetchDogBreeds() {
  return fetch('https://api.thedogapi.com/v1/breeds', {
    method: 'GET',
    headers: {
      'x-api-key':
        'live_YPUX8zjp5eOCtJwA4QM4is9BG9JoRdsyINDCRBWHxLApRHncCDAuXysWXapbcVe2',
    },
  });
}

export function fetchDogByBreed(id) {
  return fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key':
        'live_YPUX8zjp5eOCtJwA4QM4is9BG9JoRdsyINDCRBWHxLApRHncCDAuXysWXapbcVe2',
    },
  });
}
