<template>
    <div class="container">
        <br>
        <UserProfile
                :class="{
        UserProfile: true,
        blur: !$root.store.username,
        center: true
      }"
                :username= $root.store.username></UserProfile>
        <b-button  :to="{name: 'favoriteRecipes', params:{username: $root.store.username}}" ><b><b-icon icon="star"></b-icon> Favorites</b></b-button>
        <b-button  :to="{name: 'personalRecipes', params:{username: $root.store.username}}" ><b><b-icon icon="person-lines-fill"></b-icon>Personal</b></b-button>
        <b-button  :to="{name: 'familyRecipes', params:{username: $root.store.username}}" ><b><b-icon icon="people"></b-icon>La Familia</b></b-button>

        <br><br><br><br><br><br><br><br>

    </div>
</template>

<script>
    import UserProfile from "../components/UserProfile";
    export default {
        name: "ProfilePage",
        data() {
            return {};
        },
        components: {
            UserProfile
        }

    }

</script>

<style scoped>
    .container{
        background:rgba(250, 250, 250,0.75);
    }

    b-button{
        background-color: #009999;
        color: whitesmoke;

    }
</style>