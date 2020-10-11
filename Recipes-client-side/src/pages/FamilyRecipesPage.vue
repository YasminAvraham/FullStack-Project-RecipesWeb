<template>
    <div class="container">
        <RecipePreviewList title="Family Recipes" recipes: this.recipes :username= $root.store.username>  </RecipePreviewList>
        <br><br><br><br><br><br>
    </div>
</template>

<script>
    import RecipePreviewList from '../components/RecipePreviewList.vue';

    export default {

        data(){
            return{
                recipes: null
            }

        },
        components:{
            RecipePreviewList
        }
    }
</script>

<style scoped>
    .container{
        background:rgba(250, 250, 250,0.5);
    }
</style>