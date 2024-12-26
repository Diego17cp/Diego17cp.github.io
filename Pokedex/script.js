// Obtain the elements from the HTML
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
const form = document.getElementById("form");
const lights = document.querySelectorAll(".light");
const shinyBtn = document.getElementById("shiny-btn");

// array to collect all the pokemons
let allPokemons = [];

// Function to animate the lights
const animateLights = () => {
	lights.forEach((light) => {
		light.classList.add("animated");
	});
};
// Function to clean the pokedex
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
	searchInput.value = ``;
	lights.forEach((light) => {
		light.classList.remove("animated");
	});
};
// Function to fetch all the pokemons from the API
const fetchAllPokemons = async () => {
	try {
		const response = await fetch(
			"https://pokeapi-proxy.freecodecamp.rocks/api/pokemon"
		);
		const data = await response.json();
		allPokemons = data.results.map((pkmn) => {
			// Extract ID from URL or use default method
			const urlParts = pkmn.url.split("/");
			const id = urlParts[urlParts.length - 2];
			return {
				name: pkmn.name,
				id: parseInt(id),
				sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
			};
		});
	} catch (err) {
		console.log(err);
	}
};
// Function to filter the pokemons by the search input
const filterPokemons = (search) => {
	return allPokemons
		.filter(
			(pkmn) =>
				pkmn.name.includes(search.toLowerCase()) ||
				pkmn.id.toString().includes(search)
		)
		.slice(0, 10);
};
// Function to create the div element for the suggestions
const createSelect = () => {
	const existing = document.getElementById("pkmn-suggestions");
	if (existing) existing.remove();

	const selectContainer = document.createElement("div");
	selectContainer.id = "pkmn-suggestions";
	form.appendChild(selectContainer);

	return selectContainer;
};
searchInput.addEventListener("input", (e) => {
	// Obtain the value of the input
	const search = e.target.value.trim();
	// Create the div element for the suggestions
	const selectContainer = createSelect();

	// Filter the pokemons by the search input
	if (search.length > 0) {
		const matches = filterPokemons(search);
		// Create the suggestions
		selectContainer.innerHTML = matches
			.map(
				(pkmn) =>
					`<div class="suggestion" data-name="${pkmn.name}" data-id="${pkmn.id}">${pkmn.name} (#${pkmn.id}) <img class="mini-sprite" src="${pkmn.sprite}" alt="${pkmn.name} mini sprite"></div>`
			)
			.join("");
		// Add event listener to the suggestions
		selectContainer
			.querySelectorAll(".suggestion")
			.forEach((suggestion) => {
				suggestion.addEventListener("click", () => {
					searchInput.value = suggestion.dataset.name;
					selectContainer.remove();
					getPoke(suggestion.dataset.name);
					animateLights();
				});
			});
	} else {
		selectContainer.remove();
	}
});
// Function to search the pokemon
const search = async () => {
	const search = searchInput.value.toLowerCase().trim();
	if (search) {
		await getPoke(search);
		searchInput.value = "";
	}
};
// Function to format the pokemons with 2 megas for its cries
const formatMega= (name) => {
	return name.replace("-mega-", "-mega")
	// it's a special case for charizard and mewtwo
}
// Function for get the pokemon selected
const getPoke = async (pkmnNameOrId) => {
	try {
		const response = await fetch(
			`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pkmnNameOrId}`
		);
		const data = await response.json();
		// Obtain the sprites from the API
		const frontSprite = data.sprites.front_default;
		const backSprite = data.sprites.back_default;
		const frontShinySprite= data.sprites.front_shiny;
		const backShinySprite= data.sprites.back_shiny;
		const cryName=formatMega(data.name);
		const pokemonCry=new Audio()
		pokemonCry.src= `https://play.pokemonshowdown.com/audio/cries/${cryName}.mp3`;
		// Display the sprites
		imgDisplay.innerHTML = `<img id="sprite" src="${frontSprite}" alt="${data.name} front default sprite">`;
		// Obtain the new sprite element
		const sprite = document.getElementById("sprite");
		pokemonCry.play();
		// Set the sprite to change every 3 seconds
		let isFront = true;
		let spriteInterval
		spriteInterval=setInterval(() => {
			if (isFront) {
				sprite.src = backSprite;
				sprite.alt = `${data.name} back default sprite`;
			} else {
				sprite.src = frontSprite;
				sprite.alt = `${data.name} front default sprite`;
			}
			isFront = !isFront;
		}, 3000);
		shinyBtn.addEventListener("click", () => {
			clearInterval(spriteInterval);
			sprite.classList.toggle("shiny");
			if(sprite.classList.contains("shiny")){
				spriteInterval=setInterval(() => {
					if (isFront) {
						sprite.src = backShinySprite;
						sprite.alt = `${data.name} back shiny sprite`;
					} else {
						sprite.src = frontShinySprite;
						sprite.alt = `${data.name} front shiny sprite`;
					}
					isFront = !isFront;
				}, 3000);
			}
			else{
				spriteInterval=setInterval(() => {
					if (isFront) {
						sprite.src = backSprite;
						sprite.alt = `${data.name} back default sprite`;
					} else {
						sprite.src = frontSprite;
						sprite.alt = `${data.name} front default sprite`;
					}
					isFront = !isFront;
				}, 3000);
			}
		})
		
		// Display the data of the pokemon on the little pokedex
		nameElement.textContent = `${data.name.toUpperCase()}`;
		idElement.textContent = `#${data.id < 100 ? `0${data.id}` : data.id}`;
		typesContainer.innerHTML = data.types
			.map(
				(pkmn) =>
					`<div class="type ${pkmn.type.name}">${pkmn.type.name}</div>`
			)
			.join("");
		const weightInKg = data.weight / 10;
		const heightInM = data.height / 10;
		weightElement.textContent = `Weight: ${weightInKg}kg`;
		heightElement.textContent = `Height: ${heightInM}m`;
		hpElement.innerHTML = `Hp: ${data.stats[0].base_stat} <progress value="${data.stats[0].base_stat}" max="255" class="progress-bar" id="hp-bar"></progress>`;
		attackElement.innerHTML = `Attack: ${data.stats[1].base_stat} <progress value="${data.stats[1].base_stat}" max="255" class="progress-bar" id="atk-bar"></progress>`;
		defenseElement.innerHTML = `Defense: ${data.stats[2].base_stat} <progress value="${data.stats[2].base_stat}" max="255" class="progress-bar" id="def-bar"></progress>`;
		spAtElement.innerHTML = `Special Attack: ${data.stats[3].base_stat} <progress value="${data.stats[3].base_stat}" max="255" class="progress-bar" id="atkesp-bar"></progress>`;
		spDefElement.innerHTML = `Special Defense: ${data.stats[4].base_stat} <progress value="${data.stats[4].base_stat}" max="255" class="progress-bar" id="defesp-bar"></progress>`;
		speedElement.innerHTML = `Speed: ${data.stats[5].base_stat} <progress value="${data.stats[5].base_stat}" max="255" class="progress-bar" id="spd-bar"></progress>`;
	} catch (err) {
		// If the pokemon is not found, clean the pokedex and show an alert
		cleanAll();
		imgDisplay.innerHTML = `<img src="./imgs/error.gif" alt="Pokemon not found" id="error-img">
				<p id="error-msg">Pokemon not found</p>`;
		console.log(err);
		return;
	}
};
// Event listeners
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const suggestions = document.getElementById("pkmn-suggestions");
	if (suggestions) suggestions.remove();
	await search();
	animateLights();
});
searchBtn.addEventListener("click", async () => {
	const suggestions = document.getElementById("pkmn-suggestions");
	if (suggestions) suggestions.remove();
	await search();
	animateLights();
});
// Fetch all the pokemons
fetchAllPokemons();
