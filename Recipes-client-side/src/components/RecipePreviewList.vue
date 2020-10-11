<template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>

    <b-row v-if="title != 'results'">
      <v-row v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" :title=title :username=username />
      </v-row>
    </b-row>

    <b-row v-else-if="title == 'results'">
      <v-col v-for="r in recipesToPresent" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" :title=title />
      </v-col>
    </b-row>



  </b-container>
</template>

<script>
  import RecipePreview from "./RecipePreview.vue";
  export default {
    name: "RecipePreviewList",
    components: {
      RecipePreview
    },
    props: {
      title: {
        type: String,
        required: true
      },
      username: {
        type: String,
      },
      recipesToPresent: {
        type: Array,
      },
    },
    data() {
      return {
        recipes: [],
      };
    },
    mounted() {
      if (this.title == "Random Recipes") {
        this.updateRecipes();

      }
      else if (this.title == "Last Viewed Recipes") {
        // this.updateRecipes();
         this.LastViewedRecipes();
      }
      else if (this.title == "Personal Recipes") {
        this.getPersonalRecipes();
      }
      else if (this.title == "Family Recipes") {
        this.getFamilyRecipes();
      }
      else if (this.title == "Favorite Recipes") {
        this.getFavoriteRecipes();
      }
    },
    methods: {
      async updateRecipes() {
        try {
          const response = await this.axios.get(
                  "http://localhost:3000/recipe/random"
          );
          // console.log(response);
          const recipes = response.data.recipes;
          recipes.forEach(function (item, index, array){
            let favorite="favorite",watch="watch";
            item[favorite]=false;
            item[watch]=false;
          });
          this.recipes = [];
          this.recipes.push(...recipes);
          if(this.username!=null) {
            await this.checkUserActivity();
          }
          // console.log(this.recipes);
        } catch (error) {
          console.log(error);
        }
      },
      async LastViewedRecipes() {
        let response;
        this.recipes=[];
        try{
          response = await this.axios.get(
                    `http://localhost:3000/users/lastViews?username=${this.username}`
          );
          let ids=[];
          let reci=[];
          response.data.forEach(function (item,index) {
            ids[index]=item.RecipeID
          })
          let rec={};
          for (const item1 of ids) {
            let index1 = ids.indexOf(item1);
            let x=await this.getInformation(item1);
            let favorite="favorite",watch="watch";
            x[favorite]=false;
            x[watch]=false;
            reci[index1]=x;

          }
          this.recipes.push(...reci);
          if(this.username!=null) {
            await this.checkUserActivity();
          }
        }catch (error) {
           console.log(error);
         }

      },
      async getPersonalRecipes() {
        try {
          const response = await this.axios.get(
                  `http://localhost:3000/users/MyRecipes?username=${this.username}`,
          );
          const recipeList = response.data;
          this.recipes = [];
          let arr = await Promise.all(
                  recipeList.map((recipe_raw) =>
                          JSON.parse(recipe_raw.data)
                  )
          );
          let result=[],id="id";
          arr.forEach(function (item, index, array) {
            item[id]=recipeList[index].id;
            result[index]=item;
          });

          this.recipes.push(...arr);
        } catch (error) {
          console.log(error);
        }
      },
      async getFavoriteRecipes() {
        try {
          const response = await this.axios.get(
                  `http://localhost:3000/recipe/getUserFavoriteRecipes?username=${this.username}`
          );
          // console.log(response);
          const recipes = response.data;
          this.recipes = [];
          recipes.forEach(function (item, index, array){
            let favorite="favorite",watch="watch";
            item[favorite]=false;
            item[watch]=false;
          });
          this.recipes.push(...recipes);
          this.checkUserActivity();
          // console.log(this.recipes);
        } catch (error) {
          console.log(error);
        }
      },
      async getFamilyRecipes() {
        try {
          const response = await this.axios.get(
                  `http://localhost:3000/users/MyFamilyRecipes?username=${this.username}`,
          );
          const recipeList = response.data;
          this.recipes = [];
          let arr = await Promise.all(
                  recipeList.map((recipe_raw) =>
                          JSON.parse(recipe_raw.data)
                  )
          );
          let result=[],id="id";
          arr.forEach(function (item, index, array) {
            item[id]=recipeList[index].id;
            result[index]=item;
          });

          this.recipes.push(...arr);
        } catch (error) {
          console.log(error);
        }
      },
      async checkUserActivity(){
        try{
          let ids=[];
          this.recipes.forEach(function (item, index, array) {
            ids[index]=item.id;
          });
          const response1 = await this.axios.get(
                  `http://localhost:3000/users/recipesInfo?username=${this.username}&recipe_ids=${ids}`,
          );
          console.log(response1);
          let favorite="favorite",watch="watch";
          this.recipes.forEach(function (item1, index2, array){
              response1.data.forEach(function (item2, index2, array){
                if(item1.id==item2.id){
                  item1[favorite]=item2.favorite;
                  item1[watch]=item2.watch;
                }
              });
          })
        }catch (error) {
          console.log(error);
        }
      },
      async getInformation(id){
        try {
          let response1 = await this.axios.get(
                  `http://localhost:3000/recipe/Information?id=${id}`,
          );
          return  response1.data;
        }catch (error) {
          console.log(error);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    min-height: 400px;
  }
</style>