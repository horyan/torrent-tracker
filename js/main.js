// form submission
document.getElementById("torrent-form").onsubmit = function() {addRow(); return false;};
function addRow() {
  let name, uri, size, seeders, leechers, options;
  const tdElements = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms["torrent-form"];
  const tdElementContents = [torrentForm["name"].value,
                        torrentForm["uri"].value,
                        torrentForm["size"].value,
                        torrentForm["seeders"].value,
                        torrentForm["leechers"].value,
                        '<button id="btn-edit" type="button">Edit</button><button type="button">Delete</button>'];

  const trElement = document.createElement("tr");
  for (let i = 0; i < tdElements.length; i++) {
    tdElements[i] = document.createElement("td");
    tdElements[i].innerHTML = tdElementContents[i]; 
    trElement.appendChild(tdElements[i]);
  }
  const torrentRow = document.getElementById("torrent-row");
  torrentRow.parentNode.insertBefore(trElement, torrentRow); // add new row before input row

  // clear input fields each time a new row is added
  // TODO: only invalidate user input/submission error
  const torrentNames = ["name", "uri", "size", "seeders", "leechers"];
  for (let i = 0; i < torrentNames.length; i++) {
    torrentForm[torrentNames[i]].value = "";
  }
}

// clear non-empty input fields
// TODO: only invalidate user input/submission error
document.getElementById("btn-cancel").onclick = function() {
  const torrentNames = ["name", "uri", "size", "seeders", "leechers"];
  const torrentForm = document.forms["torrent-form"];
  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value != "")
      torrentForm[torrentNames[i]].value = "";
  }
};

// toggle dark/light theme
document.getElementById("btn-theme").onclick = function() {
  document.body.classList.toggle("dark") === true ? this.innerHTML = "Light Mode" : this.innerHTML = "Dark Mode";
}

// caret cycle and sorting
// TODO: add asc/desc sort functionality
document.getElementById("btn-name").onclick = function() {toggleSort(this)};
document.getElementById("btn-uri").onclick = function() {toggleSort(this)};
document.getElementById("btn-size").onclick = function() {toggleSort(this)};
document.getElementById("btn-seeders").onclick = function() {toggleSort(this)};
document.getElementById("btn-leechers").onclick = function() {toggleSort(this)};

function toggleSort(e) {
  if (e.innerHTML === "▷") {
    e.innerHTML = "&#9651";
  } else if (e.innerHTML === "△") {
    e.innerHTML = "&#9661";
  } else {
    e.innerHTML = "&#9655";
  }
}

// testing hover function before applying to an addRow() element
document.getElementById("btn-cancel").onmouseover = function() {
  this.innerHTML = "CLEAR";
};
document.getElementById("btn-cancel").onmouseout = function() {
  this.innerHTML = "Clear";
};
