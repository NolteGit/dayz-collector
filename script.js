const ammoTypes = ["N/A", ".30-06 (7.62x73)", ".338 Lapua", "20x102mm", "46x30mm", ".408 CheyTac", ".44 Mag", "57x28mm", "6x35mm", "5.56x45mm", ".50 BMG", ".30 Carbine", "7.62x39mm", "7.62x25mm", "7.62x54mm", ".308 Win", ".300 Win Mag", "7.92x57", ".500 S&W", "5.45x39mm", "9x19mm", "12ga", ".45 ACP", ".40 S&W"];
const storageOptions = ["N/A", "Yes", "No"];
const noiseLevels = ["N/A", "1", "2", "3", "4", "5"];
const magazineOptions = ["N/A", "0", "1", "2"];
const weaponTypes = ["N/A", "AR", "Sniper", "Shotgun", "Pistol", "SMG", "Other"];
const ratingOptions = ["N/A", "1", "2", "3", "4", "5"];


let weaponsData = [];
let editStates = {};

async function loadWeapons() {
    console.time("loadWeapons");
    try {
        const savedData = localStorage.getItem("weaponsData");
        if (savedData) {
            weaponsData = JSON.parse(savedData);
        } else {
            const response = await fetch('dayz_weapons.json');
            if (!response.ok) throw new Error("Failed to load weapons data");
            weaponsData = await response.json();
            localStorage.setItem("weaponsData", JSON.stringify(weaponsData));
        }
        displayWeapons(weaponsData);
    } catch (error) {
        console.error("Error loading weapons:", error);
    }
    console.timeEnd("loadWeapons");
}

function getDropdownColor(field, value) {
    const colors = {
        "1": "background-color: #d4edda;", // Light Green
        "2": "background-color: #a8df8e;", // Medium Green (NEW)
        "3": "background-color: #ffeeba;", // Yellow
        "4": "background-color: #ffcccb;", // Light Red (NEW)
        "5": "background-color: #f8d7da;", // Stronger Red
        "Yes": "background-color: #d4edda;", // Green
        "No": "background-color: #f8d7da;", // Red
        "0": "background-color: #f8d7da;" // Red for zero values
    };

    return colors[value] || "";
}

function createDropdown(options, selectedValue, index, field, disabled) {
    let select = document.createElement("select");
    select.className = `dropdown ${field}`;
    select.onchange = () => markRowAsEdited(index, field, select.value);
    select.disabled = disabled;
    select.style = getDropdownColor(field, selectedValue);
    
    options.forEach(option => {
        let optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === selectedValue) optionElement.selected = true;
        select.appendChild(optionElement);
    });
    let td = document.createElement("td");
    td.appendChild(select);
    return td;
}

function createNumericInput(value, index, field, disabled) {
    let input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "999999";
    input.value = value || "";
    input.disabled = disabled;
    input.onchange = () => markRowAsEdited(index, field, input.value);
    let td = document.createElement("td");
    td.appendChild(input);
    return td;
}

function displayWeapons(data) {
    console.time("displayWeapons");
    const tableBody = document.getElementById("weaponTable");
    tableBody.innerHTML = "";
    data.forEach((weapon, index) => {
        let isEditable = editStates[index] || false;
        let row = document.createElement("tr");
        let weaponCell = document.createElement("td");
        weaponCell.textContent = weapon.Weapon;
        weaponCell.className = "weapon-column";
        row.appendChild(weaponCell);
        row.appendChild(createDropdown(ammoTypes, weapon.Ammo || 'N/A', index, 'Ammo', !isEditable));
        row.appendChild(createDropdown(noiseLevels, weapon.Noise || 'N/A', index, 'Noise', !isEditable));
        row.appendChild(createDropdown(storageOptions, weapon.Lager || 'N/A', index, 'Lager', !isEditable));
        row.appendChild(createDropdown(magazineOptions, weapon.Mag || 'N/A', index, 'Mag', !isEditable));
        row.appendChild(createNumericInput(weapon.Buy, index, 'Buy', !isEditable));
        row.appendChild(createNumericInput(weapon.Sell, index, 'Sell', !isEditable));
        row.appendChild(createDropdown(weaponTypes, weapon.Type || 'N/A', index, 'Type', !isEditable));
        row.appendChild(createDropdown(ratingOptions, weapon.Rating || 'N/A', index, 'Rating', !isEditable));
        
        let editTd = document.createElement("td");
        editTd.style.width = "50px";
        let editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = isEditable ? "✔" : "✏";
        editButton.onclick = () => toggleEditRow(index);
        editTd.appendChild(editButton);
        row.appendChild(editTd);
        
        tableBody.appendChild(row);
    });
    console.timeEnd("displayWeapons");
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
    console.time("searchWeapons");
    let searchValue = document.getElementById("search").value.toLowerCase();
    let filteredWeapons = weaponsData.filter(weapon =>
        weapon.Weapon.toLowerCase().includes(searchValue)
    );
    displayWeapons(filteredWeapons);
    console.timeEnd("searchWeapons");
}

document.getElementById("search").addEventListener("input", () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(searchWeapons, 200);
});

document.addEventListener("DOMContentLoaded", () => {
    loadWeapons();
});
