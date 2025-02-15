const ammoTypes = [".30-06 (7.62x73)", ".338 Lapua", "20x102mm", "46x30mm", ".408 CheyTac", ".44 Mag", "57x28mm", "6x35mm", "5.56x45mm", ".50 BMG", ".30 Carbine", "7.62x39mm", "7.62x25mm", "7.62x54mm", ".308 Win", ".300 Win Mag", "7.92x57", ".500 S&W", "5.45x39mm", "9x19mm", "12ga", ".45 ACP", ".40 S&W"];
const storageOptions = ["Yes", "No"];
const noiseLevels = ["1", "2", "3", "4", "5"];
const magazineOptions = ["0", "1", "2"];
const weaponTypes = ["AR", "Sniper", "Shotgun", "Pistol", "SMG", "Other"];

let weaponsData = [];

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
    let select = `<select onchange="updateWeapon(${index}, '${field}', this.value)">`;
    options.forEach(option => {
        select += `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`;
    });
    select += `</select>`;
    return select;
}

function createNumericInput(value, index, field) {
    return `<input type="number" min="0" max="999999" value="${value || ''}" onchange="updateWeapon(${index}, '${field}', this.value)">`;
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
            <td class="small-column">${createDropdown(weaponTypes, weapon.Type || 'Other', index, 'Type')}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function searchWeapons() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let filteredWeapons = weaponsData.filter(weapon =>
        weapon.Weapon.toLowerCase().includes(searchValue)
    );
    displayWeapons(filteredWeapons);
}

function updateWeapon(index, field, value) {
    weaponsData[index][field] = value;
    localStorage.setItem("weaponsData", JSON.stringify(weaponsData));
}

window.onload = loadWeapons;
