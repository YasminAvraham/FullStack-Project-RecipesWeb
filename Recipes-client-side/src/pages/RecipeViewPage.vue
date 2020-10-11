<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.time }} minutes</div>
              <div><b-icon icon="heart-fill"></b-icon> {{ recipe.likes }} likes</div>
              <div>{{ recipe.meals }} Meals</div>
              <div>Vegetarian :{{ recipe.vegetarian }}</div>
              <div>Vegan:  {{ recipe.vegan }}</div>
              <div>Gluten Free:  {{ recipe.glutenFree }}</div>
            </div>
            <div id="ingredients">
            <p>Ingredients:</p>
            <ul>
              <li
                v-for="(r, index) in recipe.ingredients"
                :key="index"
              >
                {{ r}}
              </li>
            </ul>
            </div>
          </div>
          <div class="wrapped">
            Instructions:
            <ul>
              <li
                      v-for="(r, index) in recipe._instructions"
                      :key="index"
              >
                {{r}}
              </li>
            </ul>
<!--            <ol>-->
<!--              <li v-for="s in recipe.instructions" :key="s.number">-->
<!--                {{ s }}-->
<!--              </li>-->
<!--            </ol>-->
          </div>
        </div>
      </div>
      <!-- <pre>
      {{ $route.params }}
      {{ recipe }}
    </pre
      > -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null
    };
  },
  props:{
    title: {
      type: String,
      required: true
    },
  },

  mounted() {
      this.Spoonacular();
  },
  methods: {
    async updateView(){
      if(this.$route.params.username){
        try{
          const response = await this.axios.post(
                  `http://localhost:3000/users/addView?username=${this.$route.params.username}&recipe_id=${this.$route.params.recipeId}`
          );
        }catch (error) {
          console.log(error);
        }
      }
    },
    async Spoonacular() {
      try {
        let response;
        // response = this.$route.params.response;

        try {
          response = await this.axios.get(
                  `http://localhost:3000/recipe/Information?id=${this.$route.params.recipeId}`,
          );

          // console.log("response.status", response.status);
          if (response.status !== 200) this.$router.replace("/NotFound");
        } catch (error) {
          console.log("error.response.status", error.response.status);
          this.$router.replace("/NotFound");
          return;
        }

        let {
          vegetarian,
          vegan,
          glutenFree,
           meals,
          instructions,
          ingredients,
          likes,
          time,
          image,
          title
        } = response.data;

        // let _instructions = instructions
        //   .map((fstep) => {
        //     fstep.steps[0].step = fstep.name + fstep.steps[0].step;
        //     return fstep.steps;
        //   })
        //   .reduce((a, b) => [...a, ...b], []);
        let _instructions = [];
        instructions.forEach(function (item, index, array) {
          item.step.forEach(function (item2, index2, array2) {
            _instructions.push(item2);
          });
        });

        let _recipe = {
          vegetarian,
          vegan,
          glutenFree,
          _instructions,
           meals,
          ingredients,
          likes,
          time,
          image,
          title
        };

        this.recipe = _recipe;
        this.updateView();
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.container{
  background:rgba(250, 250, 250,0.8);
}
#ingredients ul{
  float:left;
}

/* .recipe-header{

} */
</style>
