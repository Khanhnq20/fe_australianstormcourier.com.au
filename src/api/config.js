const config = {
    APIHost: process.env.REACT_APP_API_HOST,
    StripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    AuthenticationSchema: "Bearer",
    AccountConfirmationURL: process.env.REACT_APP_ACCOUNT_CONFIRM_RETURN_URL || "/confirm"
}; 

export default config;