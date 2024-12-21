const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const nameElement = document.getElementById("pokemon-name");
const idElement = document.getElementById("pokemon-id");
const weightElement = document.getElementById("weight");
const heightElement = document.getElementById("height");
const typesContainer = document.getElementById("types");
const hpElement = document.getElementById("hp");
const attackElement = document.getElementById("attack");
const defenseElement = document.getElementById("defense");
const spAtElement = document.getElementById("special-attack");
const spDefElement = document.getElementById("special-defense");
const speedElement = document.getElementById("speed");
const imgDisplay = document.getElementById("img-display");

// Function for get the pokemons

const getPoke = async () => {
	try {
		const pkmnNameOrId = searchInput.value.toLowerCase();
		const response = await fetch(
			`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pkmnNameOrId}`
		);
		const data = await response.json();

		imgDisplay.innerHTML = `<img id="sprite" src="${data.sprites.front_default}" alt="${data.name} front default sprite">`;

		nameElement.textContent = `${data.name.toUpperCase()}`;
		idElement.textContent = `#${data.id < 100 ? `0${data.id}` : data.id}`;
		typesContainer.innerHTML = data.types
			.map(
				(pkmn) =>
					`<div class="type ${pkmn.type.name}">${pkmn.type.name}</div>`
			)
			.join("");
		weightElement.textContent = `Weight: ${data.weight}g`;
		heightElement.textContent = `Height: ${data.height}cm`;
		hpElement.textContent = `HP: ${data.stats[0].base_stat}`;
		attackElement.textContent = `Attack: ${data.stats[1].base_stat}`;
		defenseElement.textContent = `Defense: ${data.stats[2].base_stat}`;
		spAtElement.textContent = `Special Attack: ${data.stats[3].base_stat}`;
		spDefElement.textContent = `Special Defense: ${data.stats[4].base_stat}`;
		speedElement.textContent = `Speed: ${data.stats[5].base_stat}`;
	} catch (err) {
		cleanAll();
		alert(`Pokemon not found`);
		console.log(err);
		return;
	}
};
const cleanAll = () => {
	imgDisplay.innerHTML = ``;
	nameElement.textContent = ``;
	idElement.textContent = ``;
	typesContainer.innerHTML = ``;
	weightElement.textContent = ``;
	heightElement.textContent = ``;
	hpElement.textContent = ``;
	attackElement.textContent = ``;
	defenseElement.textContent = ``;
	spAtElement.textContent = ``;
	spDefElement.textContent = ``;
	speedElement.textContent = ``;
};
searchBtn.addEventListener("click", () => {
	getPoke();
});
searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		getPoke();
	}
});
