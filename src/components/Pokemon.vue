<template>
  <div :class="['container mx-auto']">
    <h1 class="font-mono text-lg font-bold text-yellow-400">
      Who's That Pokemon?
    </h1>
    <img
      v-bind:src="pokemonImg"
      :class="[
        'normal',
        'container mx-auto',
        { silhouette: silhouetteSelected },
      ]"
    />
    <!-- <img v-bind:src="pokemonImg" :class="['normal', {silhouette: silhouetteSelected}]" > -->
    <!-- Next one is not inline, but using computed properties -->
    <!-- <img v-bind:src="pokemonImg" class="normal" :class="silhouetteActive" > -->
    <div v-if="gameState === 'initial'">
      <button
        class="focus:outline-none text-white text-sm py-2 px-4 m-2 rounded-full bg-yellow-400 gap: 20px hover:bg-yellow-100 hover:shadow-lg hover:text-yellow-600"
        @click="generatePokemon"
      >
        Get Started!
      </button>
    </div>
    <div v-else-if="gameState === 'guess'">
      <input
        type="text"
        v-model="pokemonGuess"
        placeholder="Guess here!"
        v-on:keyup.enter="guess(pokemonGuess)"
        class="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
      />
      <br />
      <p></p>
      <div>
        <button
          class="focus:outline-none text-white text-sm py-2 px-4 m-2 rounded-full bg-blue-600 gap: 20px hover:bg-blue-300 hover:shadow-lg hover:text-black"
          @click="guess(pokemonGuess)"
        >
          Guess
        </button>
        <button
          class="focus:outline-none text-white text-sm py-2 px-4 m-2 rounded-full bg-red-600 gap: 20px hover:bg-red-300 hover:shadow-lg hover:text-black"
          @click="skip()"
        >
          Skip Pokemon
        </button>
      </div>
    </div>
    <div v-else-if="gameState === 'reveal'">
      <button
        class="focus:outline-none text-white text-sm py-2 px-4 m-2 rounded-full bg-blue-400 gap: 20px hover:bg-blue-50 hover:shadow-lg hover:text-blue-900"
        @click="nextfunc()"
      >
        Next
      </button>
    </div>
    <div v-if="id">
      <button
        class="focus:outline-none text-white text-sm py-2 px-4 m-2 rounded-full bg-blue-400 gap: 20px hover:bg-blue-50 hover:shadow-lg hover:text-blue-900"
        @click="restart()"
      >
        Start Over!
      </button>
    </div>
    <p>{{ message }}</p>
    <div>Current Score: {{ currentScore }}</div>
    <div>Total Score: {{ totalScore }}</div>
    <div v-if="highScore">High Score: {{ highScore }}</div>
  </div>
</template>

<script>
import { getPokemon } from "../api/pokemon";
export default {
  name: "Pokemon",
  props: {
    msg: String,
  },
  data() {
    return {
      pokemonGuess: "",
      actualPokemon: "",
      currentScore: 20,
      totalScore: 0,
      pokemonImg: "/images/question.png",
      message: "",
      gen1Pokemon: [],
      gen2Pokemon: [],
      gen3Pokemon: [],
      gen4Pokemon: [],
      gen5Pokemon: [],
      gen6Pokemon: [],
      gen7Pokemon: [],
      gen8Pokemon: [],
      guessedPokemon: [],
      id: null,
      randomPokemon: {},
      silhouetteSelected: false,
      highScore: 0,
      next: false,
      guessbtn: true,
      gameState: "initial",
    };
  },
  watch: {
    //put in a watcher to see if the user's current score hits 0 (if so then give them a message and go to the skip function)
  },
  computed: {
    // silhouetteActive() {
    //   return { silhouette: this.silhouetteSelected };
    // },
  },
  methods: {
    //guess function for seeing if user correctly guessed Pokemon's name.
    async guess(pokemon) {
      if (this.next === true) {
        return;
      }
      if (pokemon.toLowerCase().trim() === this.actualPokemon) {
        this.message = `Correct! This Pokemon is ${this.actualPokemon}! Your Total Score increased by ${this.currentScore}. Click 'Next' to go to the next Pokemon`;
        this.totalScore = this.totalScore + this.currentScore;
        this.silhouetteSelected = false;
        this.next = true;
        this.guessbtn = false;
        this.gameState = "reveal";
        if (this.totalScore > this.highScore) {
          this.highScore = this.totalScore;
        }
      } else {
        this.message = `Guess again! Your Current Score decreased by 1.`;
        this.currentScore--;
      }
    },
    //generating a random number to use as a Pokemon id
    async generatePokemon() {
      this.id = Math.floor(Math.random() * 898) + 1;
      await this.initializePokemonData();
      this.guessedPokemon.push(this.id);
      console.log(this.actualPokemon);
      this.silhouetteSelected = true;
      this.gameState = "guess";
    },
    //generating a new pokemon ID
    async newPokemonGenerated() {
      //checking to see if pokemon has already been guessed or if Id = 899
      while (this.guessedPokemon.includes(this.id) || this.id === 899) {
        //setting a new id to the id field
        this.id = Math.floor(Math.random() * 898) + 1;
        //adding the id that was just generated to the array of guessedPokemon to keep track of what Pokemon have been guessed
        this.guessedPokemon.push(this.id);
        return this.id;
      }
    },
    //getting new API information from pokeapi and setting it's name and img to those variables
    async initializePokemonData() {
      //running get to retrieve data from pokeapi with pokemon's id and setting that object to randomPokemon
      this.randomPokemon = await getPokemon(this.id);
      // setting name from the retrieved data
      this.actualPokemon = this.randomPokemon.species.name;
      //setting the sprite to the pokemonImg
      this.pokemonImg = this.randomPokemon.sprites.front_default;
    },
    restart() {
      this.guessedPokemon = [];
      this.id = null;
      this.randomPokemon = {};
      this.silhouetteSelected = false;
      this.pokemonGuess = "";
      this.actualPokemon = "";
      this.currentScore = 20;
      this.totalScore = 0;
      this.pokemonImg = "/images/question.png";
      this.guessbtn = true;
      this.gameState = "initial";
      this.message = "";
      this.next = false;
    },
    skip() {
      this.message = `Pokemon skipped! That Pokemon was ${this.actualPokemon}! Your Total Score increased by 0. Click 'Next' to generate next Pokemon.`;
      this.currentScore = 20;
      this.next = true;
      this.silhouetteSelected = false;
      this.guessbtn = false;
      this.gameState = "reveal";
    },
    async nextfunc() {
      this.currentScore = 20;
      this.newPokemonGenerated();
      await this.initializePokemonData();
      this.silhouetteSelected = true;
      this.message = "";
      this.next = false;
      this.pokemonGuess = "";
      this.guessbtn = true;
      this.gameState = "guess";
      console.log(this.actualPokemon);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.silhouette {
  filter: contrast(0%) brightness(0%);
}
.normal {
  height: 200px;
  width: 200px;
}
.bg {
  background: red;
}
</style>
