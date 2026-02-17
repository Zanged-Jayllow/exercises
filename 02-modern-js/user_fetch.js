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

function getPosts(userId) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Failed to fetch user posts:", error);
            throw error;
        });
}

// Promise chaining demo in console
console.log("---- Promising chaining demo ----");
getUser(4)
    .then(user => {
        console.log(`User: ${user.name}`);
        return getPosts(user.id);
    })
    .then(posts => {
        posts.forEach(post => {
        console.log(`- ${post.title}`);
        });
    })
    .catch(error => {
        console.error("Something failed:", error);
    });

// Async methods
// is the VS built in preview JS modern enough to use fetch?

// Async Demo
console.log("---- Async demo ----");
async function runFetchDemo() {
    try {
        const user = await getUser(1);
        console.log(`User: ${user.username}`);

        const posts = await getPosts(user.id);
        posts.forEach(post => {
        console.log(`- ${post.title}`);
        });

    } catch (error) {
        console.error("Something failed:", error);
    }
}

runFetchDemo();