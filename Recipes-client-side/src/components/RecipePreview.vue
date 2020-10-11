<template>
  <div>
  <router-link
    :to="{ name: this.title, params: { recipeId: recipe.id ,username: $root.store.username} }"
    class="recipe-preview"

  >

    <div class="recipe-body">
      <img  :src="recipe.image" class="recipe-image" />
    </div>
    <div class="recipe-footer">
      <div :title="recipe.title" class="recipe-title">
        {{ recipe.title }}
      </div>
      <ul class="recipe-overview">
        <li>{{ recipe.time }} <b-icon icon="clock-fill"></b-icon></li>
        <span v-if="(this.title=='Random Recipes')||(title == 'results') ||(this.title=='Last Viewed Recipes')||(this.title=='Favorite Recipes')">
          <li>{{ recipe.likes }} <b-icon icon="heart-fill" id="like"></b-icon> </li>
      </span>


      </ul><br>
<!--      <ul class="recipe-overview">-->
        <span v-if="recipe.vegetarian">
          <strong class="vegetarian"> Vegetarian </strong>
        </span>
        <span v-else>
          <strong class="no"> Vegetarian </strong>
        </span>
        <br>
        <span v-if="recipe.vegan">
          <strong class="vegan"> Vegan </strong>
        </span>

        <span v-else>
          <strong class="no"> Vegan </strong>
        </span>
        <br>

        <span v-if="recipe.glutenFree">
          <strong class="glutenFree"> Gluten Free </strong>
        </span>
        <span v-else>
          <strong class="no"> Gluten Free </strong>
        </span>



<!--
        <li> Vegetarian {{ recipe.vegetarian }}</li>
-->
<!--        <li> Vegan  {{ recipe.vegan }}</li>-->
<!--      </ul><br>-->
<!--      <ul class="recipe-overview">-->
<!--        <li> Gluten Free  {{ recipe.glutenFree }}</li>-->
<!--      </ul>-->
      <span v-if="($root.store.username)&&((this.title=='Random Recipes') ||(title == 'results') ||(this.title=='Last Viewed Recipes')||(this.title=='Favorite Recipes'))">
        <ul class="recipe-overview">
          <li>Seen Before: {{ recipe.watch }}</li>
        </ul>
      </span>
    </div>
  </router-link>
    <span v-if="($root.store.username)&&((this.title=='Random Recipes') ||(title == 'results')||(this.title=='Last Viewed Recipes')||(this.title=='Favorite Recipes'))">
      <span v-if="recipe.favorite">
        <p>This Recipe is a favorite</p>
      </span>
      <span v-else>
        <button  @click="addToFavorite" class="fButton" >Add to Favorite</button>
      </span>

    </span>
  </div>
</template>

<script>
export default {

  data() {
    return {
      // title: this.title
    };
  },
  props: {
    title: {
      type: String,
      required: true
    },
    username: {
      type: String,
    },
    recipe: {
      type: Object,
      required: true
    }
  },
  methods:{
    async addToFavorite(){
      try{
        const response = await this.axios.post(
                `http://localhost:3000/users/addFavoriteRecipe?username=${this.username}&recipe_id=${this.recipe.id}`,
        );
        if(response.status==201){
          this.recipe.favorite=true;
        }
      }catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.recipe-preview {
  display: inline-block;
  width: 90%;
  height: 100%;
  position: relative;
  margin: 10px 10px;
  background-color: white;
}
.recipe-preview > .recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
}

.recipe-preview .recipe-body .recipe-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 100%;
  height: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}

.recipe-preview .recipe-footer {
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.recipe-preview .recipe-footer .recipe-title {
  padding: 10px 10px;
  width: 100%;
  font-size: 12pt;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.recipe-preview .recipe-footer ul.recipe-overview {
  padding: 5px 10px;
  width: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1 auto;
  -ms-flex: 1 auto;
  flex: 1 auto;
  table-layout: fixed;
  margin-bottom: 0px;
}

.recipe-preview .recipe-footer ul.recipe-overview li {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  -ms-box-flex: 1;
  box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  width: 90px;
  display: table-cell;
  text-align: center;
}
  li{
    font-size: 25px;
  }

  #like{
    color: red;
  }
  .no{
    color: gray ;
  }
  .vegetarian{
    color: hotpink;
  }
  .glutenFree{
    color: lightseagreen;
  }
  .vegan{
    color: lightgreen;
  }

</style>
