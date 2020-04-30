function addRow() {
  let name, uri, size, seeders, leechers, options;
  const newCellElements = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms["torrent-form"];
  const newCellValues = [torrentForm["name"].value,
                        torrentForm["uri"].value,
                        torrentForm["size"].value,
                        torrentForm["seeders"].value,
                        torrentForm["leechers"].value,
                        '<button>Edit</button><button>Delete</button>'];

  const newRow = document.createElement("tr");
  for (let i = 0; i < newCellElements.length; i++) {
    newCellElements[i] = document.createElement("td");
    newCellElements[i].innerHTML = newCellValues[i]; 
    newRow.appendChild(newCellElements[i]);
  }
  const inputRow = document.getElementById("input-row");
  inputRow.parentNode.insertBefore(newRow, inputRow);

  // clear input fields each time a new row is added
  // TODO: change invalidation styling
  const inputNames = ["name", "uri", "size", "seeders", "leechers"];
  for (let i = 0; i < inputNames.length; i++) {
    torrentForm[inputNames[i]].value = "";
  }
}

function inputReset() {
  // clear non-empty input fields
  // TODO: change invalidation styling
  const inputNames = ["name", "uri", "size", "seeders", "leechers"];
  torrentForm = document.forms["torrent-form"];
  for (let i = 0; i < inputNames.length; i++) {
    if (torrentForm[inputNames[i]].value != "")
      torrentForm[inputNames[i]].value = "";
  }
}

function toggleTheme() {
  const theme = document.getElementById("btn-theme");
  if (document.body.classList.toggle("dark") === true) {
    theme.innerHTML = "Light Mode";
  }
  else {
    theme.innerHTML = "Dark Mode";
  }
}

// TODO: avoid repitition; combine into a single function
// TODO: add asc/desc sort functionality
function toggleNameSort() {
  const sortButton = document.getElementById("btn-name");
  if (sortButton.innerHTML === "▷") {
    sortButton.innerHTML = "&#9651";
  } else if (sortButton.innerHTML === "△") {
    sortButton.innerHTML = "&#9661";
  } else {
    sortButton.innerHTML = "&#9655";
  }
}
function toggleUriSort() {
  const sortButton = document.getElementById("btn-uri");
  if (sortButton.innerHTML === "▷") {
    sortButton.innerHTML = "&#9651";
  } else if (sortButton.innerHTML === "△") {
    sortButton.innerHTML = "&#9661";
  } else {
    sortButton.innerHTML = "&#9655";
  }
}
function toggleSizeSort() {
  const sortButton = document.getElementById("btn-size");
  if (sortButton.innerHTML === "▷") {
    sortButton.innerHTML = "&#9651";
  } else if (sortButton.innerHTML === "△") {
    sortButton.innerHTML = "&#9661";
  } else {
    sortButton.innerHTML = "&#9655";
  }
}
function toggleSeedersSort() {
  const sortButton = document.getElementById("btn-seeders");
  if (sortButton.innerHTML === "▷") {
    sortButton.innerHTML = "&#9651";
  } else if (sortButton.innerHTML === "△") {
    sortButton.innerHTML = "&#9661";
  } else {
    sortButton.innerHTML = "&#9655";
  }
}
function toggleLeechersSort() {
  const sortButton = document.getElementById("btn-leechers");
  if (sortButton.innerHTML === "▷") {
    sortButton.innerHTML = "&#9651";
  } else if (sortButton.innerHTML === "△") {
    sortButton.innerHTML = "&#9661";
  } else {
    sortButton.innerHTML = "&#9655";
  }
}
