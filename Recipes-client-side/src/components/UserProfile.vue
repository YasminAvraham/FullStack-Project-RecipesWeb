<template>
    <div>
        <img :src=Image>
        <h1><b> {{FirstName}}  {{LastName}}</b></h1>
        <h2><b>Username: </b>{{$root.store.username}}</h2>
        <h2><b>Email: </b>{{Email}}</h2>
        <h2><b>Country: </b>{{Country}}</h2>
    </div>
</template>

<script>
    export default {
        props: {
            FirstName: {
                type: String,
                required: true
            },
            LastName: {
                type: String,
                required: true
            },
            username: {
                type: String,
            },
            Email: {
                type: String,
                required: true
            },
            Country: {
                type: String,
                required: true
            },
            Image: {
                type: String,
                required: true
            },
        },
        mounted() {

            console.log("work");
            this.getUserInfo();

        },
        methods: {
            async getUserInfo() {
                try {
                    const response = await this.axios.get(
                        `http://localhost:3000/auth/userInformation?username=${this.username}`
                    );
                    let userInfo=response.data;
                    this.username=userInfo.username,
                        this.FirstName = userInfo.firstName;
                    this.LastName = userInfo.lastName;
                    this.Email = userInfo.email;
                    this.Country = userInfo.country;
                    this.Image = userInfo.image;

                } catch (error) {
                    console.log(error);
                }
            },
        }
    }
</script>

<style scoped>
    img {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px;
        width: 300px;

    }
</style>