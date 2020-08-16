register = new Vue({
    el: "#register",
    data() {
        return {
            get user() { return window.user },
            title: "Register",
            usernameLabel: "Username",
            emailLabel: "Email",
            passwordLabel: "Password",
            confirmPasswordLabel: "Confirm Password",
            firstNameLabel: "First Name",
            lastNameLabel: "Last Name",
            register: "Register",
            back: "Back",
            homepage: "Home",
            form: {
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                agreement: false,
                agreementText: `I agree to the Website <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.`,
                emailing: true,
                emailingText: `I want to receive news and updates via email.`,
                error: {
                    userExists: "This user alredy exists!",
                    emailExists: "This email is already registered!",
                    emailInvalid: "Invalid email!",
                    passwordsMatch: "Passwords does not match!",
                    input: "Invalid input!",
                    unknown: "An error has occurred!",
                },
            }
        };
    },
});

$("input").not("#email,[type=checkbox]").characterCounter();