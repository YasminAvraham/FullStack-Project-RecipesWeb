<template>
  <div class="container">
    <h1 class="title">Search Page</h1>

    <b-form @submit.prevent="onSearch" @reset.prevent="onReset">
      <b-row>
        <div>
          <div class="mt-2">Enter query: {{ query }}</div>
          <b-col>   <b-form-input v-model="query" placeholder="Enter query"></b-form-input></b-col>
        </div> <br>
        <div>
          <div class="mt-2"># Results:</div>
          <b-col> <b-form-select v-model="num" :options="optionsNum"></b-form-select> </b-col>
        </div><br>
        <div>
          <div class="mt-2">Select diet: {{ diet }}</div>
          <b-col>   <b-form-select v-model="diet" :options="optionsDiet"></b-form-select></b-col>
        </div><br>
        <div>
          <div class="mt-2">Select cuisine: {{ cuisine }}</div>
          <b-col>    <b-form-select v-model="cuisine" :options="cuisinesOptions" ></b-form-select></b-col>
        </div><br>
        <div>
          <div class="mt-2">Intolereance: {{ intolerances }}</div>
          <b-col> <b-form-select v-model="intolerances" :options="intolereanceOptions" ></b-form-select></b-col>
        </div><br>
        <div>
          <div class="mt-2">Sort By:</div>
          <b-col> <b-form-select v-model="sortBy" :options="sortOptions" ></b-form-select></b-col>
        </div>
      </b-row>
      <br>
      <b-button type="reset" variant="danger">Reset</b-button> &nbsp;
      <b-button type="submit" variant="primary" style="width:300px;" >Search</b-button>  &nbsp;
      <b-button @click="lastSearch" variant="warning">Last Search</b-button>
    </b-form>
    <br>
    <RecipePreviewList class="searchList" :title=this.title :recipesToPresent= this.recipes ></RecipePreviewList>

  </div>


</template>


<script>
  import RecipePreviewList from '../components/RecipePreviewList.vue'
  import intolereanceOptions from '../assets/intolereance.js'
  import optionsDiet from '../assets/diets.js'
  import cuisinesOptions from '../assets/cuisines.js'


  const axios = require("axios");
  export default {
    data() {
      return {

        query: '', // for search field
        num: '5',  //how many results
        diet: null,  //search by diet
        cuisine: null,  //search by cuisine
        intolerances: null ,//search from intolereance
        recipes: null,
        sortBy:null,

        optionsNum: [
          { value: '5', text: '5' },
          { value: '10', text: '10'},
          {value: '15', text: '15'}
        ],

        sortOptions:[
          { value: null, text: '' },
          { value: 'Preparetion Time', text: 'Preparetion Time'},
          {value: 'Popolarity', text: 'Popolarity'}
        ],


        optionsDiet:optionsDiet,
        intolereanceOptions:intolereanceOptions,
        cuisinesOptions:cuisinesOptions,

      }
    },
    props:{
      title:{
        type: String,
      },
    },
    methods: {
      onReset() {
        this.query= "", // for search field
                this.num= 5,  //how many results
                this.diet= null,  //search by diet
                this.cuisine= null,  //search by cuisine
                this.intolereance= null ,//search from intolereance
                this.sortBy=null;
        this.$nextTick(() => {
          this.$v.$reset();
        });
      },

      sortByPopolarity(){
        this.recipes.sort(function(a, b) {
          var keyA = a.likes, keyB = b.likes;
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      },

      sortByPreparetionTime(){
        this.recipes.sort(function(a, b) {
          var keyA = a.time, keyB = b.time;
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      },

      lastSearch(){
        if(this.$root.store.username){
          this.query= window.query;
          this.num= window.numResults;
          this.diet= window.diet;
          this.cuisine= window.cuisine;
          this.intolereance= window.intolereance;
          this.sortBy=window.sortBy;

          //search last result
          this.onSearch();
        }


        else{
          this.$root.toast("Message", "You are not in the system", "warning");
        }

      },


      async onSearch(){
        let response;
        this.title="results";
        this.recipes=[];
        if(!this.query)
          this.$root.toast("Error", "Please fill the query.", "warning");

        else if (this.query){
          try{
            response= await axios.get(`http://localhost:3000/recipe/search`, {
                      params: {
                        query:this.query,
                        number:this.num,
                        diet: this.diet,
                        cuisine: this.cuisine,
                        intolerances: this.intolerances
                      }
                    });
            this.recipes=response.data;

            switch(this.sortBy){
              case("Popolarity"):
                this.sortByPopolarity();
                break;
              case("Preparetion Time"):
                this.sortByPreparetionTime();
                break;
              default:
                break;
            }

          }
          catch(err){
            this.$root.toast("Error", err, "warning");
          }
          finally{

            //save last search
            if(this.$root.store.username){
              window.query=this.query;
              window.numResults = this.num;
              window.diet=window.diet;
              window.cuisine=this.cuisine;
              window.intolereance=this.intolereance;
              window.sortBy=this.sortBy;
            }
          }

        }

        if (this.query && this.recipes==null){
          this.$root.toast("Sorry", "No results found.", "primary");
        }
      }

    },

    components:{
      RecipePreviewList
    }
  }
</script>

<style>
  .container{
    text-align :center;
  }
  .container{
    background:rgba(250, 250, 250,0.5);
  }

  .searchList{
    margin-right: 120px;
    margin-left: 120px;
  }
</style>