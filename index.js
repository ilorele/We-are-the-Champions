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
const fromInputFieldEl = document.querySelector(".from-input-field");
const toInputFieldEl = document.querySelector(".to-input-field");


onValue(endorsementsInDB, function(snapshot) {

    if(snapshot.exists()) {

        clearEndorsementsContainerEl()

        let endorsementsArray = Object.entries(snapshot.val())

        for(let i = 0; i < endorsementsArray.length; i++) {
            let currentEndorsement = endorsementsArray[i];
            appendEndorsement(currentEndorsement)
        }
    } else {
        clearEndorsementsContainerEl()
    }
})

function clearEndorsementsContainerEl() {
    endorsementsContainerEl.innerHTML = ''
}

function clearInputFields() {
    messageInputFieldEl.value = "";
    fromInputFieldEl.value = "";
    toInputFieldEl.value = ""
}

function appendEndorsement(endorsement) {
    const endorsementID = endorsement[0];
    const endorsementInput = endorsement[1];

    const endorsementEl = createEndorsementEl(endorsementInput);

    endorsementsContainerEl.appendChild(endorsementEl)

    endorsementEl.addEventListener("dblclick", function() {
        let exactLocationOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`);
        remove(exactLocationOfEndorsementInDB)
    })
}

function createEndorsementEl(endorsementInput) {
    const toSection = createEndorsementSectionEl("To ", endorsementInput.to, "endorsement-to-section");
    const messageSection = createEndorsementSectionEl("", endorsementInput.message, "endorsement-message-section");
    const fromSection = createEndorsementSectionEl("From ", endorsementInput.from);
    const heartCounterSection = createEndorsementSectionEl("❤️ ", endorsementInput.hearts);

    const footerSection = createfooterSection();
    footerSection.appendChild(fromSection);
    footerSection.appendChild(heartCounterSection);
    
    const endorsementEl = document.createElement("div");
    endorsementEl.classList.add("endorsement");

    endorsementEl.appendChild(toSection);
    endorsementEl.appendChild(messageSection);
    endorsementEl.appendChild(footerSection);

    return endorsementEl

}

function createEndorsementSectionEl(sectionInitialValue, sectionInput, cssClass) {
    const sectionEl = document.createElement("div");

    if (cssClass !== undefined) {
        sectionEl.classList.add(cssClass);
    }

    sectionEl.textContent = sectionInitialValue + sectionInput;

    return sectionEl
}

function createfooterSection() {
    const footerSection = document.createElement("div");
    footerSection.classList.add("endorsement-footer-section");

    return footerSection
}

publishButtonEl.addEventListener("click", function() {

    const endorsementMessage = messageInputFieldEl.value;
    const messageTo = toInputFieldEl.value;
    const messageFrom = fromInputFieldEl.value;

    const messageObject = {
        to: messageTo,
        message: endorsementMessage,
        from: messageFrom,
        hearts: 0
    }

    if (endorsementMessage && messageTo && messageFrom) {

        push(endorsementsInDB, messageObject);
        clearInputFields();
    } else {
        alert("Your message cannot be an empty message!")
    }   
})