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
const form=document.getElementById("form");
const lights=document.querySelectorAll(".light");

// Function for get the pokemons

const getPoke = async () => {
	try {
		const pkmnNameOrId = searchInput.value.toLowerCase();
		const response = await fetch(
			`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pkmnNameOrId}`
		);
		const data = await response.json();
        // Obtain the sprites from the API
        const frontSprite=data.sprites.front_default;
        const backSprite=data.sprites.back_default;
        // Display the sprites
		imgDisplay.innerHTML = `<img id="sprite" src="${frontSprite}" alt="${data.name} front default sprite">`;
        // Obtain the new sprite element
        const sprite=document.getElementById("sprite");
        // Set the sprite to change every 3 seconds
        let isFront=true;
        setInterval(
            ()=>{
                if(isFront){
                    sprite.src=backSprite;
                    sprite.alt=`${data.name} back default sprite`;
                } else{
                    sprite.src=frontSprite;
                    sprite.alt=`${data.name} front default sprite`;
                }
                isFront=!isFront;
            },3000
        )
        // Display the data of the pokemon on the little pokedex
		nameElement.textContent = `${data.name.toUpperCase()}`;
		idElement.textContent = `#${data.id < 100 ? `0${data.id}` : data.id}`;
		typesContainer.innerHTML = data.types
			.map(
				(pkmn) =>
					`<div class="type ${pkmn.type.name}">${pkmn.type.name}</div>`
			)
			.join("");
        const weightInKg = data.weight / 10
        const heightInM = data.height / 10
		weightElement.textContent = `Weight: ${weightInKg}kg`;
		heightElement.textContent = `Height: ${heightInM}m`;
		hpElement.textContent = `HP: ${data.stats[0].base_stat}`;
		attackElement.textContent = `Attack: ${data.stats[1].base_stat}`;
		defenseElement.textContent = `Defense: ${data.stats[2].base_stat}`;
		spAtElement.textContent = `Special Attack: ${data.stats[3].base_stat}`;
		spDefElement.textContent = `Special Defense: ${data.stats[4].base_stat}`;
		speedElement.textContent = `Speed: ${data.stats[5].base_stat}`;
	} catch (err) {
        // If the pokemon is not found, clean the pokedex and show an alert
		cleanAll();
		alert(`Pokemon not found`);
		console.log(err);
		return;
	}
};
// Function for clean the pokedex
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
    lights.forEach(light=>{
        light.classList.remove("animated");
    });
};
// Function for animate the lights
const animateLights=()=>{
    lights.forEach(light=>{
        light.classList.add("animated");
    });
}
// Event listeners
searchBtn.addEventListener("click", () => {
	getPoke();
    animateLights();
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    getPoke();
    animateLights();
});
