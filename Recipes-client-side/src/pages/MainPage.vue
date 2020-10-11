<template>
  <div class="container">
    <h1 class="title">Main Page</h1>
    <b-row>

    <b-col>
    <RecipePreviewList title="Random Recipes" class="RandomRecipes center" :username="$root.store.username" :key="componentKey" />
    <button @click="forceRerender" >More Recipes</button>
      </b-col>

    <b-col v-if="!$root.store.username" >
      <login></login>
    </b-col>
    <b-col v-else>
          <RecipePreviewList title="Last Viewed Recipes" :class="{
        RandomRecipes: true,
        blur: !$root.store.username,
        center: true}" :username="$root.store.username" disabled></RecipePreviewList><br><br><br>
    </b-col>
<!--    <router-link v-if="!$root.store.username" to="/login" tag="button">You need to Login to vue this</router-link>-->
<!--    {{ !$root.store.username }}-->
<!--    <RecipePreviewList-->
<!--      title="Last Viewed Recipes"-->
<!--      :class="{-->
<!--        RandomRecipes: true,-->
<!--        blur: !$root.store.username,-->
<!--        center: true-->
<!--      }"-->
<!--      :username="$root.store.username"-->
<!--      disabled-->
<!--    ></RecipePreviewList><br><br><br>-->
    <!-- <div
      style="position: absolute;top: 70%;left: 50%;transform: translate(-50%, -50%);"
    >
      Centeredasdasdad
    </div>-->
    </b-row>
  </div>
</template>

<script>

import RecipePreviewList from "../components/RecipePreviewList";
import login from "./LoginPage";
import Login from "./LoginPage";
export default {
  components: {
    Login,
    RecipePreviewList
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  }
};
</script>


<style lang="scss" scoped>

.RandomRecipes {
  margin: 10px 0 10px;
}

.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}

::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: pointer;
  text-decoration: none;
}

.container{
  background:rgba(250, 250, 250,0.5);
}

</style>
