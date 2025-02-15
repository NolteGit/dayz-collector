const ammoTypes = ["N/A", ".30-06 (7.62x73)", ".338 Lapua", "20x102mm", "46x30mm", ".408 CheyTac", ".44 Mag", "57x28mm", "6x35mm", "5.56x45mm", ".50 BMG", ".30 Carbine", "7.62x39mm", "7.62x25mm", "7.62x54mm", ".308 Win", ".300 Win Mag", "7.92x57", ".500 S&W", "5.45x39mm", "9x19mm", "12ga", ".45 ACP", ".40 S&W"];
const storageOptions = ["N/A", "Yes", "No"];
const noiseLevels = ["N/A", "1", "2", "3", "4", "5"];
const magazineOptions = ["N/A", "0", "1", "2"];
const weaponTypes = ["N/A", "AR", "Sniper", "Shotgun", "Pistol", "SMG", "Other"];

let weaponsData = [];
let editedRows = new Set();
let editMode = false;

async function loadWeapons() {
    const savedData = localStorage.getItem("weaponsData");
    if (savedData) {
        weaponsData = JSON.parse(savedData);
    } else {
        const response = await fetch('dayz_weapons.json');
        weaponsData = await response.json();
        localStorage.setItem("weaponsData", JSON.stringify(weaponsData));
    }
    displayWeapons(weaponsData);
}

function createDropdown(options, selectedValue, index, field) {
    let disabled = editMode ? "" : "disabled";
    let select = `<select class="dropdown ${field}" onchange="markRowAsEdited(${index})" style="${getDropdownColor(field, selectedValue)}" ${disabled}>`;
    options.forEach(option => {
        select += `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`;
    });
    select += `</select>`;
    return select;
}

function getDropdownColor(field, value) {
    if (field === "Noise") {
        return value === "1" ? "background-color: #d4edda;" :
               value === "2" ? "background-color: #c3e6cb;" :
               value === "3" ? "background-color: #ffeeba;" :
               value === "4" ? "background-color: #f5c6cb;" :
               value === "5" ? "background-color: #f8d7da;" : "";
    }
    if (field === "Lager") {
        return value === "Yes" ? "background-color: #d4edda;" :
               value === "No" ? "background-color: #f8d7da;" : "";
    }
    if (field === "Mag") {
        return value === "2" ? "background-color: #d4edda;" :
               value === "1" ? "background-color: #ffeeba;" :
               value === "0" ? "background-color: #f8d7da;" : "";
    }
    return "";
}

function createNumericInput(value, index, field) {
    let disabled = editMode ? "" : "disabled";
    return `<input type="number" min="0" max="999999" value="${value || ''}" onchange="markRowAsEdited(${index})" ${disabled}>`;
}

function displayWeapons(data) {
    const tableBody = document.getElementById("weaponTable");
    tableBody.innerHTML = "";
    data.forEach((weapon, index) => {
        let row = `<tr>
            <td class="weapon-column">${weapon.Weapon}</td>
            <td class="small-column">${createDropdown(ammoTypes, weapon.Ammo || 'N/A', index, 'Ammo')}</td>
            <td class="small-column">${createDropdown(noiseLevels, weapon.Noise || 'N/A', index, 'Noise')}</td>
            <td class="small-column">${createDropdown(storageOptions, weapon.Lager || 'N/A', index, 'Lager')}</td>
            <td class="small-column">${createDropdown(magazineOptions, weapon.Mag || 'N/A', index, 'Mag')}</td>
            <td class="small-column">${createNumericInput(weapon.Buy, index, 'Buy')}</td>
            <td class="small-column">${createNumericInput(weapon.Sell, index, 'Sell')}</td>
            <td class="small-column">${createDropdown(weaponTypes, weapon.Type || 'N/A', index, 'Type')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    updateEditButton();
}

function markRowAsEdited(index) {
    editedRows.add(index);
}

function toggleEditMode() {
    editMode = !editMode;
    displayWeapons(weaponsData);
}

function saveChanges() {
    editedRows.forEach(index => {
        let row = document.querySelectorAll("#weaponTable tr")[index];
        weaponsData[index] = {
            Weapon: row.cells[0].innerText,
            Ammo: row.cells[1].querySelector("select").value,
            Noise: row.cells[2].querySelector("select").value,
            Lager: row.cells[3].querySelector("select").value,
            Mag: row.cells[4].querySelector("select").value,
            Buy: row.cells[5].querySelector("input").value,
            Sell: row.cells[6].querySelector("input").value,
            Type: row.cells[7].querySelector("select").value
        };
    });
    localStorage.setItem("weaponsData", JSON.stringify(weaponsData));
    editedRows.clear();
    toggleEditMode();
}

function updateEditButton() {
    let buttonContainer = document.getElementById("edit-buttons");
    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.id = "edit-buttons";
        document.body.appendChild(buttonContainer);
    }
    buttonContainer.innerHTML = `<button onclick="toggleEditMode()">${editMode ? "Cancel" : "Edit"}</button> ` +
                                (editMode ? `<button onclick="saveChanges()">Save</button>` : "");
}

window.onload = loadWeapons;
