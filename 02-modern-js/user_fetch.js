// Promise chaining with then
function getUser(id) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Failed to fetch user:", error);
      throw error;
    });
}

// Async methods
// is the VS built in preview JS modern enough to use fetch?