
<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }" class="rightNAV"><b-icon icon="house"></b-icon> Home</router-link>
      <router-link :to="{ name: 'search', params:{username: $root.store.username} }" class="rightNAV"><b-icon icon="search"></b-icon> Search</router-link>
        <router-link :to="{ name: 'About' }" class="rightNAV"><b-icon icon="info-circle"></b-icon> About</router-link>
<!--      {{ !$root.store.username }}-->
      <span v-if="!$root.store.username">

        <router-link  class="leftNAV" :to="{ name: 'register' }"><b-icon icon="person-plus"></b-icon>  Register</router-link>
        <router-link   class="leftNAV" :to="{ name: 'login' }"><b-icon icon="box-arrow-in-down"></b-icon> Login</router-link>
          <p  class="leftNAV">Guest</p>


      </span>
      <span v-else>
          <b-dropdown  text="My Profile" variant="outline-danger" class="leftNAV">
              <b-dropdown-item :to="{name: 'ProfilePage', params:{username: $root.store.username}}" ><b-icon icon="person"></b-icon>User' Profile</b-dropdown-item>
            <b-dropdown-item  :to="{name: 'favoriteRecipes', params:{username: $root.store.username}}"><b-icon icon="star"></b-icon> Favorites</b-dropdown-item>
            <b-dropdown-item  :to="{name: 'personalRecipes', params:{username: $root.store.username}}" ><b-icon icon="person-lines-fill"></b-icon>Personal</b-dropdown-item>
            <b-dropdown-item  :to="{name: 'familyRecipes', params:{username: $root.store.username}}" ><b-icon icon="people"></b-icon>La Familia</b-dropdown-item>
             <b-dropdown-item @click="Logout"   ><b-icon icon="door-closed"></b-icon> Logout</b-dropdown-item>
            <!-- <b-dropdown-item :to="{name: 'New Recipe', params:{username: $root.store.username}}" >Add Recipe</b-dropdown-item> -->
          </b-dropdown>
<!--          <button  @click="Logout" class="leftNAV" ><b-icon icon="door-closed"></b-icon> Logout</button>-->
          <p class="leftNAV">{{ $root.store.username }}</p>
      </span>
    </div>
      <div class="page">
          <router-view />
      </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    Logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");

      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    }
  }
};
</script>


<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  min-height: 100vh;
    text-align: center;
    font-family: "Calibri";
    font-weight: bold;
    font-size: larger;
}

.page{
    background-image: url("./assets/backgruond.jpg");
    //background-repeat: inherit;
    background-color: #cccccc; /*if the image is unavailable */
    background-size: cover;
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    height: 100%;

}

#nav {
    padding: 40px;
    text-align: left;
    background-color: #339966;

}

#nav a {
  font-weight: bold;
  color: black;
}
#nav :hover{
    /*color:white;*/
    /*text-decoration: none;*/
}
#btn btn-success{
 background-color: #339966;
    color: white;
}
    #nav .rightNAV{
        float:left;
        margin-left:15px;
    }
#nav .leftNAV{
        float:right;
        margin-left:15px;
    }
</style>
