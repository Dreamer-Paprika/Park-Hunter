

export function fetchCatBreeds() {
    return fetch("https://api.thecatapi.com/v1/breeds", {
        method: 'GET',
        headers: {
            "x-api-key": "live_gMNx6KTqJpRIJtVlRfgsQZXJLZyn09vythVtFvSy6BFSm8btn7gxWaWQoJHXnFdm"
        }

    })
}
    

export function fetchCatByBreed(id){
    return fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${id}`, {
      method: 'GET',
      headers: {
        'x-api-key':
          'live_gMNx6KTqJpRIJtVlRfgsQZXJLZyn09vythVtFvSy6BFSm8btn7gxWaWQoJHXnFdm',
      },
    });
}
