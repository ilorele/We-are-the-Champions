import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-pro-22175-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const messageInputFieldEl = document.querySelector(".message-input-field");
const publishButtonEl = document.querySelector(".publish-btn");
const endorsementsContainerEl = document.querySelector(".endorsements-container");


onValue(endorsementsInDB, function(snapshot) {
    let endorsementsArray = Object.entries(snapshot.val())

    for(let i = 0; i < endorsementsArray.length; i++) {
        let currentEndorsement = endorsementsArray[i];
        appendEndorsement(currentEndorsement)
    }
})

function clearInputField() {
    messageInputFieldEl.value = "";
}

// function createEndorsementEl(message) {
//     const endorsementEl = document.createElement("div");
//     endorsementEl.classList.add("endorsement");
//     endorsementEl.textContent = message;
//     return endorsementEl;
// }

function appendEndorsement(endorsement) {
    const endorsementID = endorsement[0];
    const endorsementMessage = endorsement[1];

    const endorsementEl = document.createElement("div");
    endorsementEl.classList.add("endorsement");
    endorsementEl.textContent = endorsementMessage;


    endorsementsContainerEl.appendChild(endorsementEl)
}

publishButtonEl.addEventListener("click", function() {
    const messageToBePublished = messageInputFieldEl.value;

    if (messageToBePublished) {
        // const endorsementEl = createEndorsementEl(messageToBePublished);

        push(endorsementsInDB, messageToBePublished);
        clearInputField();
        // appendEndorsement(endorsementEl);
    } else {
        alert("Your message cannot be an empty message!")
    }
    
})