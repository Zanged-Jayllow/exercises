document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.getElementById("addBtn");
    const clearBtn = document.getElementById("clearBtn");
    const listInput = document.getElementById("listInput");
    const demoList = document.getElementById("demoList");

    addBtn.addEventListener("click", function () {

        // remove leading and trailing empty spaces
        const text = listInput.value.trim();

        // clears input as its no longer needed
        listInput.value = "";

        // prevent empty input from being added
        if (text === ""){
            console.log("List Demo: The Input Cannot Be Empty")
            return;
        }

        // prevent excessively long input from being added
        if (text.length > 30){
            console.log("List Demo: The Input Cannot Be Longer Than 30 letters")
            return;
        }

        // create li and remove button component
        const addedLi = document.createElement("li");
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("addbutton");
        addedLi.textContent = text;
        removeBtn.textContent = "Remove Item";

        // remove respecitve li when remove button is clicked
        // legacy, moved to event delegation
        /* removeBtn.addEventListener("click", function () {
            demoList.removeChild(addedLi);
        }); */

        // append button to li
        addedLi.appendChild(removeBtn);

        // append li to ul
        demoList.appendChild(addedLi);        
    });

    demoList.addEventListener("click", function (event) {
        // technically risky as the remove and add buttons are the same class
        // however safe here as the only buttons inside ul are the remove buttons
        if (event.target.matches(".addbutton")) {
            event.target.parentElement.remove();
        }
    });

    clearBtn.addEventListener("click", function () {
        // clears input
        listInput.value = "";

        // use a loop to remove all childs
        while (demoList.hasChildNodes()) {
            demoList.removeChild(demoList.firstChild);
        }
    });

});
