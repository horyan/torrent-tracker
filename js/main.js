function addRow() {
  let name, uri, size, seeders, leechers, options;
  const form = document.forms["torrent-form"];
  const nameList = [name, uri, size, seeders, leechers, options]; 
  const valueList = [form["name"].value,
                    form["uri"].value,
                    form["size"].value,
                    form["seeders"].value,
                    form["leechers"].value,
                    '<button>Edit</button><button>Delete</button>'];

  const tbody = document.getElementById("torrent-tbody");
  const newRow = document.createElement("tr");

  for (let i = 0; i < nameList.length; i++) {
    nameList[i] = document.createElement("td");
    nameList[i].innerHTML = valueList[i]; 
    newRow.appendChild(nameList[i]);
  }
  tbody.appendChild(newRow);
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
