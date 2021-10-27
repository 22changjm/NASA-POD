console.log("script connected.")

function updatePhoto() {
    fetch("http://localhost:8080/api/pod/image").then(response => response.text()).then(text => document.getElementById("apod-image").src = text).then(()=> updatePOD());
}
function fill() {
    console.log(document.getElementById("heart-button").src);
    heart_status = 1;
    document.getElementById("heart-button").src = "static/heart-filled.png";
    console.log(heart_status);
}
function unfill() {
    heart_status = 0;
    document.getElementById("heart-button").src = "static/heart.png";
}
function updateDate() {
    fetch("http://localhost:8080/api/pod/date").then(response => response.text()).then(text => {
        document.getElementById("apod-date").innerText = text
        existsInFavorites(text).then(fill(), unfill());
    });
}
function updateDescription() {
    fetch("http://localhost:8080/api/pod/description").then(response => response.text()).then(text => document.getElementById("apod-p").innerText = text);
}
function updateTitle() {
    fetch("http://localhost:8080/api/pod/title").then(response => response.text()).then(text => document.getElementById("apod-title").innerText = text);
}

var heart_status = 0 // 0 is empty and 1 is filled.

async function updatePOD() {
    updateTitle();
    updateDate();
    updateDescription();
}

function existsInFavorites(date) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:8080/api/pod/favorites").then(response => response.json()).then(data => {
        for (let pod of data.pods) {
            if (pod.date === date) {
                resolve()
            }
        }
        return reject();
    });
})
}

updatePhoto();



document.getElementById("heart-button").addEventListener("click", () => {
    let heart = document.getElementById("heart-button");
    if (heart_status == 0) {
        heart.src = "static/heart-filled.png"
        heart_status = 1
        // TODO: update the database and mark this image as a favorite image.
    } else {
        heart_status = 0
        heart.src = "static/heart.png"
        // TODO: update the database and un-mark this image as a favorite image.
    }
    let favurl = document.getElementById("apod-image").src;
    let favdate = document.getElementById("apod-date").innerText;
    let doc = {
        url: favurl,
        date: favdate
    };

    fetch("http://localhost:8080/api/pod/updatefavorite", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(doc)
    });
})

document.getElementById("next-button").addEventListener("click", () => {
    updatePhoto();
    // TODO: Get the image url, title, description, and date from the database using Fetch.
    // you can use let date = document.getElementById("apod-date"); to change the date.
})

