export function findInfo(country) {
  return fetch(`https://api.api-ninjas.com/v1/country?name=${country}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': 'gdvQqEx3KBpR51ZfOeJgIA==10aHi9pat7JXS0OQ',
    },
  });
}
