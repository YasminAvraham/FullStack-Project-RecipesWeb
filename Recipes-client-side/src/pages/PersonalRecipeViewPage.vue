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
                        </div>
                        <div id="ingredients">
                            <p>Ingredients:</p>
                            <ul>
                                <li
                                        v-for="(r, index) in recipe.ingredients"
                                        :key="index"
                                >
                                    {{r.amount}} {{r.unit}} {{r.name}}
                                </li>
                            </ul>
                        </div><br><br><br><br><br><br><br><br><br>
                        <div class="wrapped">
                            <p>Instructions:</p>
                            {{recipe.instructions}}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PersonalRecipeViewPage",
        data() {
            return {
                recipe: null
            };
        },

        mounted() {
            this.MyRecipe();
        },
        methods: {
            async MyRecipe() {
                try {
                    let response;
                    try {
                        response = await this.axios.get(
                            `http://localhost:3000/users/MyRecipeInfo?recipeID=${this.$route.params.recipeId}`,
                        );
                        if (response.status !== 200) this.$router.replace("/NotFound");
                    } catch (error) {
                        console.log("error.response.status", error.response.status);
                        this.$router.replace("/NotFound");
                        return;
                    }

                    let {
                        // analyzedInstructions,
                        instructions,
                        ingredients,
                        likes,
                        time,
                        image,
                        title
                    } = JSON.parse(response.data[0].RecipeData);
                    let _recipe = {
                        instructions,
                        // analyzedInstructions,
                        ingredients,
                        likes,
                        time,
                        image,
                        title
                    };

                    this.recipe = _recipe;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        display: flex;
    }
    .wrapped {
        width: 90%;
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
    img{
        height: 200px;
        width: 250px;

    }
</style>