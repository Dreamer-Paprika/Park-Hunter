export async function createApiKey(myKeyName, myKeyId, myKeyMetaData) {
  const url = 'https://api.theauthapi.com/api-keys/';
  const options = {
    method: 'POST',
    headers: {
      'x-api-key':
        'live_access_ddlWGZVUeXPHk5C0NxistaXfC9wvmAvwELpXUaoJqySgLBlF9OCNLmPGPMtCSyRB',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: myKeyName,
      projectId: '25760bfa-0e2c-4979-9d40-1b31953b964e',
      customMetaData: { metadata_val: myKeyMetaData },
      customAccountId: myKeyId,
    }),
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


