const Wishlist=require("../models/Wishlist");
const Product=require("../models/Product");


// ==========================
// Add / Remove Wishlist
// ==========================

const toggleWishlistController = async (req, res) => {

    try {

        const userId = req.user._id;

        const { productId } = req.body;


        // Check productId
        if (!productId) {

            return res.status(400).json({
                message: "Product ID is required."
            });

        }


        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }


        // Find user's wishlist
        let wishlist = await Wishlist.findOne({
            userId
        });


        // Create wishlist if user doesn't have one
        if (!wishlist) {

            wishlist = await Wishlist.create({

                userId,

                products: [
                    {
                        productId
                    }
                ]

            });


            return res.status(201).json({

                message: "Product added to wishlist.",

                wishlist

            });

        }


        // Check whether product already exists
        const productIndex = wishlist.products.findIndex(
            (item) =>
                item.productId.toString() === productId
        );


        // ==========================
        // Remove Product
        // ==========================

        if (productIndex !== -1) {

            wishlist.products.splice(
                productIndex,
                1
            );

            await wishlist.save();


            return res.status(200).json({

                message: "Product removed from wishlist.",

                wishlist

            });

        }


        // ==========================
        // Add Product
        // ==========================

        wishlist.products.push({
            productId
        });

        await wishlist.save();


        return res.status(200).json({

            message: "Product added to wishlist.",

            wishlist

        });


    } catch (error) {

        console.error(
            "Toggle Wishlist Error:",
            error
        );

        return res.status(500).json({

            message: "Unable to update wishlist."

        });

    }

};

// ==========================
// Get User Wishlist
// ==========================

const getWishlistController = async (req, res) => {

    try {

        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({
            userId
        }).populate(
            "products.productId"
        );


        // User has no wishlist yet
        if (!wishlist) {

            return res.status(200).json({

                message: "Wishlist is empty.",

                wishlist: []

            });

        }


        return res.status(200).json({

            message: "Wishlist fetched successfully.",

            wishlist: wishlist.products

        });


    } catch (error) {

        console.error(
            "Get Wishlist Error:",
            error
        );

        return res.status(500).json({

            message: "Unable to fetch wishlist."

        });

    }

};

module.exports = {
    toggleWishlistController,
    getWishlistController
};