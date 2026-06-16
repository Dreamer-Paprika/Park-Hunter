export async function getImages(apiKey) {
  const url =
    'https://overture-travel-manager-backend-vmhx.onrender.com/api/images/getImages';
  const options = {
    method: 'GET',
    headers: {
      'x-api-key': apiKey
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
