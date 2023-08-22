const API_URL = "http://localhost:3000/api/assist";
// const API_URL = "https://zinq.francoisrob.me/api/assist";
let key;

chrome.storage.sync.get(["key"], function (result) {
  key = result.key;
});

function attachButton() {
  const section = document.getElementsByClassName("appHeaderWrapper___uyPti");

  const button = document.createElement("button");
  button.innerHTML = "ASSIST";
  button.id = "assist-button";
  button.className = `torn-btn red`;
  button.style.cursor = "pointer";
  button.style.color = "const(--default-red-color)";

  const select = document.createElement("select");
  select.id = "assist-select";
  select.style.marginLeft = "10px";

  const defaultOption = document.createElement("option");
  defaultOption.text = "Assist";
  defaultOption.value = "assist";
  defaultOption.selected = true;
  select.add(defaultOption);

  const smokeOption = document.createElement("option");
  smokeOption.text = "Smoke";
  smokeOption.value = "smoke";
  select.add(smokeOption);

  const tearOption = document.createElement("option");
  tearOption.text = "Tear";
  tearOption.value = "tear";
  select.add(tearOption);

  button.addEventListener("click", () => {
    if (!key) {
      const newKey = prompt("Please enter your TornStats API key");
      if (newKey) {
        chrome.storage.sync.set({ key: newKey }, function () {
          console.log("Key saved");
        });
        key = newKey;
      }
    }
    clickButton();
  });

  section[0].appendChild(button);
  section[0].appendChild(select);
}

async function clickButton() {
  const url = getUrl();
  const attackerId = url.split("ID=")[1];
  const data = getData();
  const stats = await getTornStatsData(attackerId);
  if (!data) {
    alert("Attack data not found. Please try again.");
    return;
  }
  const json = JSON.parse(data);

  if (stats.status) {
    alert(stats.message);
    return;
  }

  if (json.DB?.error) {
    alert(json.DB.error);
    return;
  }

  if (!json.DB?.attackStatus === 'process' || json.DB?.attackStatus === 'notStarted' || json.DB?.attackStatus === 'nonAttack') {
    alert("You have to start a fight first.");
    return;
  }
  const tornID = json.DB?.attackerUser?.userID || url.split("user2ID=")[1];
  if (!tornID) {
    alert("You have to start a fight first.");
    return;
  }

  const select = document.getElementById("assist-select");
  const assistType = select.options[select.selectedIndex].value;
  const body = {
    tornID: tornID,
    url: url,
    assistType: assistType,
    json: json,
    stats: stats
  };
  sendPostRequest(API_URL, body);
}

function getTornID() {
  const headerData = sessionStorage.getItem("headerData");
  const tornID = JSON.parse(headerData).user.data.userID;
  return tornID;
}

function getUrl() {
  const url = window.location.href;
  return url;
}

function sendPostRequest(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  try {
    xhr.send(JSON.stringify(data));
    console.log("Sent!");
  } catch (e) {
    alert(e);
  }
}

function getData() {
  const assistScriptDataContainer = document.querySelector('#assist-script-data-container');
  return assistScriptDataContainer?.textContent
}

async function getTornStatsData(tornID) {
  const url = `https://www.tornstats.com/api/v2/${key}/spy/user/${tornID}`
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

attachButton();

