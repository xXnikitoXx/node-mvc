login = new Vue({
    el: "#login",
    data() {
        return {
            get user() { return window.user },
            title: "Login",
            usernameLabel: "Username",
            passwordLabel: "Password",
            login: "Login",
            back: "Back",
            homepage: "Home",
            form: {
                rememberMe: false,
                rememberMeText: "Remember Me",
                error: "Invalid credentials!",
            }
        };
    },
});