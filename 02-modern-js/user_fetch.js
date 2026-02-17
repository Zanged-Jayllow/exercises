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
    // forces the demo to run in order
    .then(() => {
        console.log("---- Async demo ----");
        return runFetchDemo();   // wait for async demo
    })
    .catch(error => {
        console.error("Something failed:", error);
    });

// Async methods
// Async Demo
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

document.addEventListener("DOMContentLoaded", function () {

    const addUserBtn = document.getElementById("addUserBtn");
    const clearUserBtn = document.getElementById("clearUserBtn");
    const userInput = document.getElementById("userIdInput");
    const userList = document.getElementById("userList");

    const addUserPostsBtn = document.getElementById("addUserPostsBtn");
    const clearPostsBtn = document.getElementById("clearPostsBtn");
    const userInput2 = document.getElementById("userIdInput2");
    const userPostList = document.getElementById("userPostList");

    addUserBtn.addEventListener("click", function () {

        // remove leading and trailing empty spaces
        const text = userInput.value.trim();

        // clear input
        userInput.value = "";

        // prevent empty input
        if (text === "") {
            console.log("User Fetch Demo: The Input Cannot Be Empty");
            return;
        }

        // ensure the input is numeric
        const userId = Number(text);

        if (isNaN(userId) || userId <= 0) {
            console.log("User Fetch Demo: Please enter a valid numerical user ID");
            return;
        }

        // fetch user and display name + email
        getUser(userId)
            .then(user => {

                // create li + remove button
                const addedLi = document.createElement("li");
                const removeBtn = document.createElement("button");

                removeBtn.classList.add("addbutton");
                removeBtn.textContent = "Remove Item";

                // display desired fields
                addedLi.textContent = `${user.name} (${user.email}) `;

                // append button to li
                addedLi.appendChild(removeBtn);

                // append li to ul
                userList.appendChild(addedLi);
            })
            .catch(error => {
                console.error("List Demo: Failed to fetch user", error);
            });
    });

    userList.addEventListener("click", function (event) {
        // technically risky as the remove and add buttons are the same class
        // however safe here as the only buttons inside ul are the remove buttons
        if (event.target.matches(".addbutton")) {
            event.target.parentElement.remove();
        }
    });

    clearUserBtn.addEventListener("click", function () {
        // clears input
        userInput.value = "";

        // use a loop to remove all childs
        while (userList.hasChildNodes()) {
            userList.removeChild(userList.firstChild);
        }
    });

    addUserPostsBtn.addEventListener("click", function () {

        // remove leading and trailing empty spaces
        const text = userInput2.value.trim();

        // clear input
        userInput2.value = "";

        // prevent empty input
        if (text === "") {
            console.log("Post Fetch Demo: The Input Cannot Be Empty");
            return;
        }

        // ensure the input is numeric
        const userId = Number(text);

        if (isNaN(userId) || userId <= 0) {
            console.log("Post Fetch Demo: Please enter a valid numerical user ID");
            return;
        }

        // 🔹 clear the post list beforehand
        while (userPostList.hasChildNodes()) {
            userPostList.removeChild(userPostList.firstChild);
        }

        // fetch posts and display them
        getPosts(userId)
            .then(posts => {

                posts.forEach(post => {

                    const li = document.createElement("li");

                    // display post title (modify as needed)
                    li.textContent = post.title;

                    userPostList.appendChild(li);
                });

            })
            .catch(error => {
                console.error("Post List Demo: Failed to fetch posts", error);
            });
    });

    clearPostsBtn.addEventListener("click", function () {

        userInput2.value = "";

        while (userPostList.hasChildNodes()) {
            userPostList.removeChild(userPostList.firstChild);
        }
    });

});