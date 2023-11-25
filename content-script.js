// const API_URL = "http://localhost:3000/api/assist";
const API_URL = "https://zinq.francoisrob.me/api/assist";

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

  // const removeApiKeyButton = document.createElement("button");
  // removeApiKeyButton.innerHTML = "Remove API Key";
  // removeApiKeyButton.id = "remove-api-key-button";
  // removeApiKeyButton.className = `torn-btn red`;
  // removeApiKeyButton.style.cursor = "pointer";
  // removeApiKeyButton.style.color = "const(--default-red-color)";
  // removeApiKeyButton.style.marginLeft = "10px";

  // removeApiKeyButton.addEventListener("click", async () => {
  //   chrome.storage.sync.remove(["key"], () => {
  //     alert("API Key removed. Please refresh the page.");
  //   });
  // });

  button.addEventListener("click", async () => {
    const url = getUrl();
    const attackerId = url.split("ID=")[1];

    const stats = await getTornStatsData(attackerId);
    if (!stats || stats.status === false) {
      console.log('TornStats not found.');
    }

    const data = getData();
    if (!data) {
      alert("Attack data not found. Please try again.");
      return;
    }
    const json = JSON.parse(data);

    if (json.DB?.error) {
      alert(json.DB.error);
      return;
    }

    if (
      !json.DB?.attackStatus === "process" ||
      json.DB?.attackStatus === "notStarted" ||
      json.DB?.attackStatus === "nonAttack"
    ) {
      alert("You have to start a fight first.");
      return;
    }

    const tornID = json.DB?.attackerUser?.userID || url.split("user2ID=")[1];
    if (!tornID) {
      alert("You have to start a fight first.");
      return;
    }

    const select = document.getElementById("assist-select");
    const assistType = select.value;
    const body = { tornID, url, assistType, json, stats };
    sendPostRequest(API_URL, body);
  });

  section[0].appendChild(button);
  section[0].appendChild(select);
  section[0].appendChild(removeApiKeyButton);
}

function getUrl() {
  return window.location.href;
}

function getData() {
  const assistScriptDataContainer = document.getElementById("attackData");
  return assistScriptDataContainer?.textContent;
}

async function getTornStatsData(tornID) {
  if (!key) {
    console.log("API Key not found.");
    return;
  }
  const response = await fetch(
    `https://www.tornstats.com/api/v2/${key}/spy/user/${tornID}`
  );
  const json = await response.json();
  return json;
}

function sendPostRequest(url, data) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(() => console.log("Sent!"))
    .catch((e) => alert(e));
}

chrome.storage.sync.get(["key"], function (result) {
  key = result.key;
  attachButton();
});
