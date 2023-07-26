const API_URL = 'https://map.francoisrob.me/api/assist';

/**
 * This function will attach a button to the Torn page.
 */
function attachButton() {
  // Get the section where we want to add the button.
  var section = document.getElementsByClassName("linksContainer___LiOTN");

  // Create the button.
  var button = document.createElement("button");
  button.innerHTML = "ASSIST";
  button.id = "assist-button";
  button.className = `torn-btn red`;
  button.style.cursor = "pointer";
  button.style.color = "var(--default-red-color)";

  // Add the button's functionality.
  button.addEventListener("click", () => {
    clickButton();
  });

  // Add the button to the page.
  section[0].insertBefore(button, section[0].childNodes[0]);
}

function clickButton() {
  var tornID = getTornID();
  var url = getUrl();
  var data = {
    tornID: tornID,
    url: url,
  };
  sendPostRequest(`${API_URL}`, data);
  // console.log(tornID, url);
}

function getTornID() {
  var headerData = sessionStorage.getItem("headerData");
  var tornID = JSON.parse(headerData).user.data.userID;
  // console.log(tornID);
  return tornID;
}

function getUrl() {
  var url = window.location.href;
  return url;
}

function sendPostRequest(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  console.log(JSON.stringify(data));
  try {
    xhr.send(JSON.stringify(data));
    console.log("Sent!");
  } catch (e) {
    alert(e);
  }
}

// Attach the button to the page.
attachButton();
