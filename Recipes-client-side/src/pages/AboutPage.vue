<template>
    <div class="container">
        <h1 id="title">About Us</h1> <br>
        <p id="text">
            We are software and information systems engineering students at Ben Gurion University. <br>
            This website is the final project in web development course. <br>
            We used spoonacular API for searching recipes and get random recipes.<br>
            Here are the 3 part of the project: <br>
            <br>
            <a href="https://app.swaggerhub.com/apis-docs/Yasmin_Avraham/MeytalYasminAPI/1.0.1"> Api in YMAL using the swaggerhub site</a> <br>
            <a href="https://github.com/SISE-Web-Development-Environments/assignment-3-2-yasmin_meytal_ass3">server side</a>  <br>
            <a href="https://github.com/SISE-Web-Development-Environments/assignment-3-3-yasmin_meytal_ass3">client side</a> <br>
            <br>
            We hope you enjoy using our website and our presentation.

            <br> <br>
            Yamin Avraham
            <br>
            Meytal Yaniv
        </p>
    </div>
</template>
<script>
    export default {
        name: "AboutPage"
    }
</script>

<style scoped>
    #title{
        text-align: center;
        font-weight: bolder;
        font-size: 45px;

    }

    #text{
        text-align :center;
        font-size: 23px;
    }
    .container{
         background:rgba(250, 250, 250,0.8);
     }


</style>