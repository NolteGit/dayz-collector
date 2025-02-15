const ammoTypes = ["N/A", ".30-06 (7.62x73)", ".338 Lapua", "20x102mm", "46x30mm", ".408 CheyTac", ".44 Mag", "57x28mm", "6x35mm", "5.56x45mm", ".50 BMG", ".30 Carbine", "7.62x39mm", "7.62x25mm", "7.62x54mm", ".308 Win", ".300 Win Mag", "7.92x57", ".500 S&W", "5.45x39mm", "9x19mm", "12ga", ".45 ACP", ".40 S&W"];
const storageOptions = ["N/A", "Yes", "No"];
const noiseLevels = ["N/A", "1", "2", "3", "4", "5"];
const magazineOptions = ["N/A", "0", "1", "2"];
const weaponTypes = ["N/A", "AR", "Sniper", "Shotgun", "Pistol", "SMG", "Other"];

let weaponsData = [];
let editStates = {};

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

function createDropdown(options, selectedValue, index, field, disabled) {
    let select = `<select class="dropdown ${field}" onchange="markRowAsEdited(${index}, '${field}', this.value)" style="${getDropdownColor(field, selectedValue)}" ${disabled ? 'disabled' : ''}>`;
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

function createNumericInput(value, index, field, disabled) {
    return `<input type="number" min="0" max="999999" value="${value || ''}" onchange="markRowAsEdited(${index}, '${field}', this.value)" ${disabled ? 'disabled' : ''}>`;
}

function displayWeapons(data) {
    const tableBody = document.getElementById("weaponTable");
    tableBody.innerHTML = "";
    data.forEach((weapon, index) => {
        let isEditable = editStates[index] || false;
        let row = `<tr>
            <td class="weapon-column">${weapon.Weapon}</td>
            <td class="small-column">${createDropdown(ammoTypes, weapon.Ammo || 'N/A', index, 'Ammo', !isEditable)}</td>
            <td class="small-column">${createDropdown(noiseLevels, weapon.Noise || 'N/A', index, 'Noise', !isEditable)}</td>
            <td class="small-column">${createDropdown(storageOptions, weapon.Lager || 'N/A', index, 'Lager', !isEditable)}</td>
            <td class="small-column">${createDropdown(magazineOptions, weapon.Mag || 'N/A', index, 'Mag', !isEditable)}</td>
            <td class="small-column">${createNumericInput(weapon.Buy, index, 'Buy', !isEditable)}</td>
            <td class="small-column">${createNumericInput(weapon.Sell, index, 'Sell', !isEditable)}</td>
            <td class="small-column">${createDropdown(weaponTypes, weapon.Type || 'N/A', index, 'Type', !isEditable)}</td>
            <td class="small-column">
                <button class="edit-btn" onclick="toggleEditRow(${index})">${isEditable ? '✔ Save' : '✏ Edit'}</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function markRowAsEdited(index, field, value) {
    weaponsData[index][field] = value;
}

function toggleEditRow(index) {
    if (editStates[index]) {
        localStorage.setItem("weaponsData", JSON.stringify(weaponsData));
    }
    editStates[index] = !editStates[index];
    displayWeapons(weaponsData);
}

function searchWeapons() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let filteredWeapons = weaponsData.filter(weapon =>
        weapon.Weapon.toLowerCase().includes(searchValue)
    );
    displayWeapons(filteredWeapons);
}

window.onload = loadWeapons;
