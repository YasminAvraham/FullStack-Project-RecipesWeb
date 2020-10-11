import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "Random Recipes",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/recipe/:username/:recipeId",
    name: "Last Viewed Recipes",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "results",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/recipe/:username/:recipeId",
    name: "Favorite Recipes",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/PersonalRecipe/:username/:recipeId",
    name: "Personal Recipes",
    component: () => import("./pages/PersonalRecipeViewPage"),
  },
  {
    path: "/FamilyRecipe/:username/:recipeId",
    name: "Family Recipes",
    component: () => import("./pages/FamilyRecipeViewPage"),
  },
  {
    path: "/about",
    name: "About",
    component: ()=> import("./pages/AboutPage")
  },
  {
    path: "/familyRecipes/:username",
    name: "familyRecipes",
    component: ()=> import("./pages/FamilyRecipesPage")
  },
  {
    path: "/favoriteRecipes/:username",
    name: "favoriteRecipes",
    component: ()=> import("./pages/FavoriteRecipesPage")
  },
  {
    path: "/profile/:username",
    name: "ProfilePage",
    component: ()=> import("./pages/ProfilePage")
  },
  {
    path: "/personalRecipes/:username",
    name: "personalRecipes",
    component: ()=> import("./pages/PersonalRecipes")
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },




];

export default routes;
