var express = require('express');
var router = express.Router();
var DButils = require('../DB/DButils');
var util = require('util');

const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/recipesInfo", async (req, res, next) => {
  try{
    const favoriteRecipes = await DButils.execQuery(`SELECT RecipeID FROM dbo.UserFavorites WHERE Username = '${req.query.username}'`);
    const viewsRecipes = await DButils.execQuery(`SELECT RecipeID FROM dbo.UserRecipeViews WHERE Username = '${req.query.username}'`);
    let ids=(req.query.recipe_ids).split(',');
    let dic=[];
    let recipeID=0;
    ids.forEach(function (item, index,array) {
      let detail={};
      recipeID=item;
      let watch="watch",favorite="favorite",id="id";
      detail[id]=item;
      detail[watch]=false;
      detail[favorite]=false;
      favoriteRecipes.forEach(function (item, index, array) {
        if(item.RecipeID==recipeID){
          detail[favorite]=true;
        }
      });
      viewsRecipes.forEach(function (item, index, array) {
        if(item.RecipeID==recipeID){
          detail[watch]=true;
        }
      });
      dic.push(detail);
    });


    res.send(dic);
  }catch (e) {
    next(e);
  }
});

router.get("/getRecipeInfo", async (req, res, next) => {
  try{
    const favoriteRecipes = await DButils.execQuery(`SELECT RecipeID FROM dbo.UserFavorites WHERE Username = '${req.query.username}'`);
    const viewsRecipes = await DButils.execQuery(`SELECT RecipeID FROM dbo.UserRecipeViews WHERE Username = '${req.query.username}'`);
    let Rid=Number(req.query.recipe_id);
    let recipe={};
    let id="id",favorite="favorite",watch="watch";
    recipe[id]=Rid;
    recipe[favorite]=false;
    recipe[watch]=false;
    favoriteRecipes.forEach(function (item, index, array) {
      if(item.RecipeID==Rid){
        recipe[favorite]=true;
      }
    });
    viewsRecipes.forEach(function (item, index, array) {
      if(item.RecipeID==Rid){
          recipe[watch]=true;

      }
      });

    res.send(recipe);
  }catch (e) {
    next(e);
  }
});


//3 last views
router.get("/lastViews", async (req, res, next) => {
  try{
    let views = await DButils.execQuery(`SELECT TOP 3* FROM dbo.UserRecipeViews WHERE Username = '${req.query.username}' 
    ORDER BY LastView DESC`);
    if(views.length!=0) {
      res.status(200).send(views);
    }
    else{
      res.status(404).send("Not Found");
    }
  }
  catch (e) {
    next(e);
  }

});

router.post("/addFavoriteRecipe", async (req, res, next) => {
  try{
    var Username = req.query.username;
    var RecipeID = req.query.recipe_id;

    // parameters exists
    if(!(Username && RecipeID )){
      throw { status: 401, message: "Some details are missing" };
    }
    let recipeExist = await checkRecipeExist(req.query.recipe_id);
    if(!recipeExist){
      throw { status: 409, message: "recipe not exist" };
    }

    //add recipe
    await DButils.execQuery(
        `INSERT INTO dbo.UserFavorites (Username, RecipeID) VALUES ('${Username}', '${RecipeID}')`
    );
    res.status(201).send("recipe added to favorites");
  }  catch (e) {
    next(e);
  }

});

//**
// router.delete("/removeFavoriteRecipe", async (req, res, next) => {
//   try{
//     var Username = req.query.username;
//     var RecipeID = req.query.recipe_id;
//
//     // parameters exists
//     if(!(Username && RecipeID )){
//       throw { status: 401, message: "Some details are missing" };
//     }
//     let recipeExist = await checkRecipeExist(req.query.recipe_id);
//     if(!recipeExist){
//       throw { status: 409, message: "recipe not exist" };
//     }
//
//     //add recipe
//     await DButils.execQuery(
//         `DELETE FROM dbo.UserFavorites WHERE Username='${Username}' AND RecipeID='${RecipeID}'`
//     );
//     res.status(201).send("recipe remove to favorites");
//   }  catch (e) {
//     next(e);
//   }
// });

// add recipe to seen
router.post("/addView", async (req, res, next) => {
try{
  var Username = req.query.username;
  var RecipeID = req.query.recipe_id;

  // parameters exists
  if(!(Username && RecipeID )){
    throw { status: 401, message: "Some details are missing" };
  }

  let recipeExist = await checkRecipeExist(req.query.recipe_id);
  if(!recipeExist){
    throw { status: 409, message: "recipe no exist" };
  }


  const seen_recipes = await DButils.execQuery("select * from dbo.UserRecipeViews where Username = '" + Username + "' and RecipeID = '" + RecipeID +"'");

  if(seen_recipes.length == 0){

    await DButils.execQuery("INSERT INTO dbo.UserRecipeViews Values ('" + Username + "','" + RecipeID +"',"+Date.now()+")");
    res.status(201).send("recipe added to user views");
  }
  else{
    await DButils.execQuery("UPDATE dbo.UserRecipeViews SET LastView = "+Date.now()+" WHERE Username like '" + Username + "' and RecipeID like '" + RecipeID +"'");
    res.status(201).send("recipe last date is updated");
  }
}  catch (e) {
  next(e);
}


});

//get all user recipes
router.get("/MyRecipes", async (req, res, next) =>{
  try{
    const myRecipe = await DButils.execQuery(`SELECT * FROM dbo.UserRecipes WHERE Username = '${req.query.username}'`);
    let id="id", data="data";
    let allRecipe=[];
    myRecipe.forEach(function (item, index, array) {
      let recp={};
      recp[id]=item.Recipe_id;
      recp[data]=item.RecipeData;
      allRecipe[index]=recp;
    });


    // let recipes = await Promise.all(
    //     favoriteRecipes.map((recipe_raw) =>
    //         recipe_raw.RecipeData
    //     )
    // );
    res.status(200).send(allRecipe);
  }
  catch (e) {
    next(e);
  }
});

router.get("/MyRecipeInfo", async (req, res, next) =>{
  try {
    const myRecipe = await DButils.execQuery(`SELECT * FROM dbo.UserRecipes WHERE Recipe_id ='${req.query.recipeID}'`);
    res.status(200).send(myRecipe);
  }catch (e) {
    next(e);
  }
});

//get all user family recipes
router.get("/MyFamilyRecipes", async (req, res, next) =>{
  try{
    const myRecipe = await DButils.execQuery(`SELECT * FROM dbo.UserFamilyRecipes WHERE Username = '${req.query.username}'`);
    let id="id", data="data";
    let allRecipe=[];
    myRecipe.forEach(function (item, index, array) {
      let recp={};
      recp[id]=item.Recipe_id;
      recp[data]=item.RecipeData;
      allRecipe[index]=recp;
    });


    // let recipes = await Promise.all(
    //     favoriteRecipes.map((recipe_raw) =>
    //         recipe_raw.RecipeData
    //     )
    // );
    res.status(200).send(allRecipe);
  }
  catch (e) {
    next(e);
  }
});
router.get("/MyFamilyRecipeInfo", async (req, res, next) =>{
  try {
    const myRecipe = await DButils.execQuery(`SELECT * FROM dbo.UserFamilyRecipes WHERE Recipe_id ='${req.query.recipeID}'`);
    res.status(200).send(myRecipe);
  }catch (e) {
    next(e);
  }
});


async function checkRecipeExist(id) {
  let recipe= await axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  })
      .then((recipe) =>{
        return true;
      })
      .catch(function (error){
        return false;
      });
  return recipe;
}

//User recipe..

// router.post("/addUserRecipe", async (req, res, next) => {
//   try{
//     let username=req.body.username;
//     let Recipe={};
//     let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients";
//     const arr=[];
//     Recipe[title]= "Pancakes";
//     Recipe[time]= 15;
//     Recipe [likes]= 0;
//     Recipe[vegetarian]= false;
//     Recipe[vegan]= false;
//     Recipe[glutenFree]= false;
//     Recipe[image]= "https://images-gmi-pmc.edge-generalmills.com/df109202-f5dd-45a1-99b4-f10939afd509.jpg";
//     let name="name",amount="amount",unit="unit";
//
//     let ing1={};
//     ing1[name]="sugar";
//     ing1[amount]=1;
//     ing1[unit]="teaspoon";
//     arr.push(ing1);
//
//     let ing2={};
//     ing1[name]="flour";
//     ing1[amount]=1;
//     ing1[unit]="cups";
//     arr.push(ing2);
//
//     let ing3={};
//     ing3[name]="milk";
//     ing3[amount]=1;
//     ing3[unit]="cups";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="baking powder";
//     ing4[amount]=3;
//     ing4[unit]="teaspoons";
//     arr.push(ing4);
//
//     let ing5={};
//     ing5[name]="butter";
//     ing5[amount]=3;
//     ing5[unit]="teaspoon";
//     arr.push(ing5);
//
//     let ing6={};
//     ing6[name]="salt";
//     ing6[amount]=1;
//     ing6[unit]="teaspoon";
//     arr.push(ing6);
//
//     let ing7={};
//     ing7[name]="egg";
//     ing7[amount]=1;
//     ing7[unit]="";
//     arr.push(ing7);
//
//     Recipe[ingredients]=arr
//     Recipe[instructions]=
//         "In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.\n" +
//         "Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Pancakes', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });



//
// router.post("/addUserRecipe", async (req, res, next) => {
//   try{
//     let username=req.body.username;
//     let Recipe={};
//     let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients";
//     const arr=[];
//     Recipe[title]= 'Salad';
//     Recipe[time]= 20;
//     Recipe [likes]= 0;
//     Recipe[vegetarian]= true;
//     Recipe[vegan]= true;
//     Recipe[glutenFree]= true;
//     Recipe[image]= "data:image/jpeg;base64,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";
//     let name="name",amount="amount",unit="unit";
//
//     let ing1={};
//     ing1[name]="tomatoes";
//     ing1[amount]=1;
//     ing1[unit]="cups";
//     arr.push(ing1);
//
//     let ing2={};
//     ing2[name]="red bell pepperr";
//     ing2[amount]=1;
//     ing2[unit]="cups";
//     arr.push(ing2);
//
//     let ing3={};
//     ing3[name]="Cucumbers";
//     ing3[amount]=1;
//     ing3[unit]="cups";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="lettuce";
//     ing4[amount]=2;
//     ing4[unit]="cups";
//     arr.push(ing4);
//
//     let ing5={};
//     ing5[name]="dressing";
//     ing5[amount]=5;
//     ing5[unit]="teaspoon";
//     arr.push(ing5);
//
//
//     Recipe[ingredients]=arr
//     Recipe[instructions]=
//         "Whisk together the salad spice mix and dressing.\n" +
//         "In a salad bowl, combine the vegtebles and Pour dressing over salad; toss and refrigerate overnight.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Salad', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });


//User family recipe..


// router.post("/addUserRecipe", async (req, res, next) => {
//
//   try{
//     let username=req.body.username;
//
//     let Recipe={};
//
//     let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients",metaData="metaData";
//     const arr=[];
//     Recipe[title]= 'Scrambled Eggs';
//     Recipe[time]= 10;
//     Recipe [likes]= 0;
//     Recipe[vegetarian]= true;
//     Recipe[vegan]= false;
//     Recipe[glutenFree]= true;
//     Recipe[image]= "https://www.recipetineats.com/wp-content/uploads/2020/07/Scrambled-Eggs_5.jpg";
//     Recipe[metaData]= "The recipe belongs to my uncle and he prepares it at every visit";
//     let name="name",amount="amount",unit="unit";
//
//     let ing1={};
//     ing1[name]="butter";
//     ing1[amount]=2;
//     ing1[unit]="teaspoons";
//     arr.push(ing1);
//
//     let ing2={};
//     ing2[name]="aggs";
//     ing2[amount]=3;
//     ing2[unit]="aggs";
//     arr.push(ing2);
//
//     let ing3={};
//     ing3[name]="salt";
//     ing3[amount]=1;
//     ing3[unit]="teaspoons";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="milk";
//     ing4[amount]=2;
//     ing4[unit]="cups";
//     arr.push(ing4);
//
//
//     Recipe[ingredients]=arr
//     Recipe[instructions]=
//         "Pour melted butter into a glass 9x13 inch baking dish. In a large bowl, whisk together eggs and salt until well blended. Gradually whisk in milk. Pour egg mixture into the baking dish.\n" +
//         "Bake uncovered for 10 minutes, then stir, and bake an additional 10 to 15 minutes, or until eggs are set. Serve immediately.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserFamilyRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Scrambled Eggs', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });


// router.post("/addUserRecipe", async (req, res, next) => {
//
//   try{
//     let username=req.body.username;
//
//     let Recipe={};
//
//     let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients",metaData="metaData";
//     const arr=[];
//     Recipe[title]= 'Corn';
//     Recipe[time]= 10;
//     Recipe [likes]= 0;
//     Recipe[vegetarian]= true;
//     Recipe[vegan]= false;
//     Recipe[glutenFree]= true;
//     Recipe[image]= "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQApG_0EOtga2GVgeksg0Zi9KYlsUX6YWwQAA&usqp=CAU";
//     Recipe[metaData]= "The recipe belongs to my mom and he prepares it at every Saturday";
//     let name="name",amount="amount",unit="unit";
//
//     let ing1={};
//     ing1[name]="sugar";
//     ing1[amount]=2;
//     ing1[unit]="teaspoons";
//     arr.push(ing1);
//
//     let ing2={};
//     ing2[name]="lemon";
//     ing2[amount]=1;
//     ing2[unit]="teaspoons";
//     arr.push(ing2);
//
//     let ing3={};
//     ing3[name]="corn";
//     ing3[amount]=6;
//     ing3[unit]="corn";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="butter";
//     ing4[amount]=1;
//     ing4[unit]="cups";
//     arr.push(ing4);
//
//
//     Recipe[ingredients]=arr
//     Recipe[instructions]=
//         "Fill a large pot about 3/4 full of water and bring to a boil.\n" +
//         "Stir in sugar and lemon juice, dissolving the sugar. Gently place ears of corn into boiling water, cover the pot, turn off the heat, and let the corn cook in the hot water until tender, about 10 minutes.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserFamilyRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Corn', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });


// router.post("/addUserRecipe", async (req, res, next) => {
//
//   try{
//     let username=req.body.username;
//
//     let Recipe={};
//
//     let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients",metaData="metaData";
//     const arr=[];
//     Recipe[title]= 'Milk Shake';
//     Recipe[time]= 10;
//     Recipe [likes]= 0;
//     Recipe[vegetarian]= true;
//     Recipe[vegan]= false;
//     Recipe[glutenFree]= true;
//     Recipe[image]= "data:image/jpeg;base64,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";
//     Recipe[metaData]= "The recipe belongs to my brother and he prepares it at every Summer";
//     let name="name",amount="amount",unit="unit";
//
//     let ing1={};
//     ing1[name]="ice cream";
//     ing1[amount]=2;
//     ing1[unit]="cups";
//     arr.push(ing1);
//
//     let ing2={};
//     ing2[name]="milk";
//     ing2[amount]=1;
//     ing2[unit]="cup";
//     arr.push(ing2);
//
//     let ing3={};
//     ing3[name]="honey";
//     ing3[amount]=1;
//     ing3[unit]="teaspoon";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="strawberries";
//     ing4[amount]=1;
//     ing4[unit]="cup";
//     arr.push(ing4);
//
//
//     Recipe[ingredients]=arr
//     Recipe[instructions]=
//         "In a blender, combine milk, honey, vanilla and frozen strawberries.\n" +
//         "Blend until smooth. Pour into glasses and serve.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserFamilyRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Milk Shake', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });





// router.post("/addUserRecipe", async (req, res, next) => {
//   try{
//       let username=req.body.username;
//       let Recipe={};
//       let title="title",time="time",likes="likes",vegetarian="vegetarian",vegan="vegan",glutenFree="glutenFree",image="image",instructions="instructions",ingredients="ingredients";
//       const arr=[];
//       Recipe[title]= "Chocolate Cake";
//       Recipe[time]= 60;
//       Recipe [likes]= 0;
//       Recipe[vegetarian]= false;
//       Recipe[vegan]= false;
//       Recipe[glutenFree]= false;
//       Recipe[image]= "https://food-images.files.bbci.co.uk/food/recipes/easy_chocolate_cake_31070_16x9.jpg";
//       let name="name",amount="amount",unit="unit";
//
//       let ing1={};
//       ing1[name]="sugar";
//       ing1[amount]=2;
//       ing1[unit]="cups";
//       arr.push(ing1);
//
//     let ing2={};
//     ing2[name]="flour";
//     ing2[amount]=2;
//     ing2[unit]="cups";
//     arr.push(ing2);
//     let ing3={};
//     ing3[name]="coca powder";
//     ing3[amount]=1;
//     ing3[unit]="cups";
//     arr.push(ing3);
//
//     let ing4={};
//     ing4[name]="baking powder";
//     ing4[amount]=1.5;
//     ing4[unit]="teaspoons";
//     arr.push(ing4);
//
//     let ing5={};
//     ing5[name]="baking soda";
//     ing5[amount]=1.5;
//     ing5[unit]="teaspoons";
//     arr.push(ing5);
//
//     let ing6={};
//     ing6[name]="salt";
//     ing6[amount]=1;
//     ing6[unit]="teaspoon";
//     arr.push(ing6);
//
//     let ing7={};
//     ing7[name]="egg";
//     ing7[amount]=2;
//     ing7[unit]="";
//     arr.push(ing7);
//
//
//       Recipe[ingredients]=arr
//       Recipe[instructions]= "Preheat oven to 350 degrees F (175 degrees C). Grease and flour two nine inch round pans.\nIn a large bowl, stir together the sugar, flour, cocoa, baking powder, baking soda and salt. Add the eggs, milk, oil and vanilla, mix for 2 minutes on medium speed of mixer. Stir in the boiling water last. Batter will be thin. Pour evenly into the prepared pans.\n" +
//           "Bake 30 to 35 minutes in the preheated oven, until the cake tests done with a toothpick. Cool in the pans for 10 minutes, then remove to a wire rack to cool completely.";
//     // let str=Object.entries(Recipe).map(([key, value]) => ({key,value}));
//     let json=JSON.stringify(Recipe);
//     // console.log(json);
//     await DButils.execQuery(
//         `INSERT INTO dbo.UserRecipes (Username, RecipeTitle,RecipeData) VALUES ('${username}', 'Chocolate Cake', '${json}')`
//     );
//
//     res.status(201).send({data: Recipe});
//   }  catch (e) {
//     next(e);
//   }
//
// });
module.exports = router;
