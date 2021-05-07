<template>
  <div class="hello">
    <h1>Who's That Pokemon?</h1>
    <img v-bind:src="pokemonImg" id="silhouette" />
    <input type="text" v-model="pokemonGuess" />
    <button @click="guess(pokemonGuess)">Guess</button>
    <p>{{ message }}</p>
    <div>Current Score: {{ currentScore }}</div>
    <div>Total Score: {{ totalScore }}</div>
  </div>
</template>

<script>
export default {
  name: "Pokemon",
  props: {
    msg: String,
  },
  data() {
    return {
      pokemonGuess: "",
      actualPokemon: "bulbasaur",
      currentScore: 20,
      totalScore: 0,
      pokemonImg:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      message: "",
      gen1Pokemon: [],
      gen2Pokemon: [],
      gen3Pokemon: [],
      gen4Pokemon: [],
      gen5Pokemon: [],
      gen6Pokemon: [],
      gen7Pokemon: [],
      gen8Pokemon: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    guess(pokemon) {
      if (pokemon.toLowerCase() === this.actualPokemon) {
        this.message = `Correct Answer! Your Total Score increased by ${this.currentScore}`;
        this.totalScore = this.totalScore + this.currentScore;
        this.currentScore = 20;
      } else {
        this.message = `Guess again! Your Current Score decreased by 1`;
        this.currentScore--;
      }
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
#silhouette {
  filter: contrast(0%) brightness(0%);
}
</style>
