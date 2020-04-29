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
  const inputNames = ["name", "uri", "size", "seeders", "leechers"];
  for (let i = 0; i < inputNames.length; i++) {
    torrentForm[inputNames[i]].value = "";
  }
}

function toggleTheme() {
  const theme = document.getElementById("btn-switch");
  if (document.body.classList.toggle("dark") === true) {
    theme.innerHTML = "Light Mode";
  }
  else {
    theme.innerHTML = "Dark Mode";
  }
}
