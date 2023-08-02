const API_URL = "https://zinq.francoisrob.me/api/assist";
// const API_URL = "http://localhost:3000/api/assist";

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
    clickButton();
  });

  // section[0].insertBefore(button, section[0].childNodes[0]);
  // section[0].insertBefore(select, section[0].childNodes[1]);
  // append after all the children
  section[0].appendChild(button);
  section[0].appendChild(select);
}

async function clickButton() {
  // works
  // const labelsContainer = document.getElementsByClassName(
  //   "labelsContainer___Oz6Su"
  // );
  // if (labelsContainer[0].childElementCount === 0) {
  //   alert("You have to start a fight first.");
  //   return;
  // }
  const url = getUrl();
  const attackerId = url.split("ID=")[1];
  const json = await getData(attackerId);
  console.log(json);

  if (!json) {
    alert("Oops, something went wrong. Please try again.");
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

  const tornID = json.DB?.attackerUser?.userID;
  if (!tornID) {
    alert("You have to start a fight first.");
    return;
  }

  const select = document.getElementById("assist-select");
  const assistType = select.options[select.selectedIndex].value;
  const data = {
    tornID: tornID,
    url: url,
    assistType: assistType,
    json: json,
  };
  sendPostRequest(API_URL, data);
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

async function getData(tornID) {
  const url = `https://www.torn.com/loader.php?sid=attackData&mode=json&step=poll&user2ID=${tornID}`;
  const response = await fetch(url);
  const string = await response.text();
  const json = JSON.parse(
    string.substring(string.indexOf("{"), string.lastIndexOf("}") + 1)
  );
  return json;
}

// Attach the button to the page.
attachButton();
