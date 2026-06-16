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

export const fetchStats = async name => {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/dogs?name=${name}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': 'gdvQqEx3KBpR51ZfOeJgIA==10aHi9pat7JXS0OQ',
        },
      }
    );
    const facts = await response.json();
    console.log(facts);
    return facts;
  } catch (error) {
    console.error(error);
  }
};

/*export const fetchStats = async name => {
  try {
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/dogs?name=${name}`,
      {
        headers: {
          'x-api-key': 'gdvQqEx3KBpR51ZfOeJgIA==10aHi9pat7JXS0OQ',
        },
      }
    );
    const facts = await response.data;
    return facts;
  } catch (error) {
    console.error(error);
  }
};*/
