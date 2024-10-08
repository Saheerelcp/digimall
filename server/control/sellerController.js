// control/sellerController.js

const Seller = require('../model/Seller');

// Function to handle seller sign-up
const signupSeller = (req, res) => {
    const newSeller = new Seller({
        username: req.body.username,
        password: req.body.password,
        shopAddress: req.body.shopAddress
    });

    newSeller.save()
        .then(() => {
            // Redirect to seller login page after successful signup
            res.redirect('/SellerLogin');
        })
        .catch(err => {
            console.error('Error saving seller data:', err);
            if (err.code === 11000) {
                // Redirect back to signup page with an error query parameter
                res.redirect('/SignupSeller?error=username_taken');
            } else {
                // Redirect to signup page in case of other errors
                res.redirect('/SignupSeller');
            }
        });
};


module.exports = {
    signupSeller
};
