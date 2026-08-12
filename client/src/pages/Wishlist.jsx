import "./Wishlist.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../store/Authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../components/UI/Loader";
import { EmptyState } from "../components/UI/EmptyState";

export const Wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const {
        userAuthToken,
        isLoggedIn
    } = UseAuth();


    // ==========================
    // Get Wishlist
    // ==========================

    const getWishlist = async () => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/wishlist",
                {
                    method: "GET",

                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            console.log(
                "Wishlist:",
                data
            );

            if (res.ok) {

                setWishlist(
                    data.wishlist || []
                );

            } else {

                toast.error(
                    data.message
                );

            }

        } catch (error) {

            console.log(
                "Fetch wishlist error:",
                error
            );

            toast.error(
                "Unable to fetch wishlist."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================
    // Remove From Wishlist
    // ==========================

    const removeFromWishlist = async (
        productId
    ) => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/wishlist/toggle",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: userAuthToken
                    },

                    body: JSON.stringify({
                        productId
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                return toast.error(
                    data.message
                );

            }

            toast.success(
                "Product removed from wishlist."
            );

            // Refresh wishlist
            getWishlist();

        } catch (error) {

            console.log(
                "Remove wishlist error:",
                error
            );

            toast.error(
                "Unable to remove product."
            );

        }

    };


    // ==========================
    // Add To Cart
    // ==========================

    const addToCart = async (
        productId
    ) => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/cart/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: userAuthToken
                    },

                    body: JSON.stringify({
                        productId,
                        quantity: 1
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                return toast.error(
                    data.message
                );

            }

            toast.success(
                data.message ||
                "Product added to cart."
            );

        } catch (error) {

            console.log(
                "Add to cart error:",
                error
            );

            toast.error(
                "Unable to add product to cart."
            );

        }

    };


    // ==========================
    // Load Wishlist
    // ==========================

    useEffect(() => {

        if (isLoggedIn) {

            getWishlist();

        } else {

            setLoading(false);

        }

    }, [isLoggedIn]);


    // ==========================
    // Loading
    // ==========================

    if (loading) {

        return <Loader />;

    }


    // ==========================
    // Login Check
    // ==========================

    if (!isLoggedIn) {

        return (

            <EmptyState
                icon="🔐"
                title="Please login"
                message="You need to login to view your wishlist."
                buttonText="Login"
                onButtonClick={() =>
                    navigate("/login")
                }
            />

        );

    }


    // ==========================
    // Empty Wishlist
    // ==========================

    if (wishlist.length === 0) {

        return (

            <EmptyState
                icon="❤️"
                title="Your wishlist is empty"
                message="Save products you love and come back to them later."
                buttonText="Browse Products"
                onButtonClick={() =>
                    navigate("/products")
                }
            />

        );

    }
    const availableProducts = wishlist.filter(
    (item) => item.productId
);

if (availableProducts.length === 0) {
    return (
        <EmptyState
            icon="📦"
            title="Products unavailable"
            message="The products saved in your wishlist are no longer available."
            buttonText="Browse Products"
            onButtonClick={() => navigate("/products")}
        />
    );
}


    return (

        <div className="wishlist-page">

            <h1>
                ❤️ My Wishlist
            </h1>


            <div className="wishlist-container">

                {availableProducts.map((item) => {

                    const product = item.productId;

    if (!product) {
        return (
            <EmptyState
                key={item._id}
                icon="📦"
                title="Product unavailable"
                message="This product is no longer available."
                buttonText="Browse Products"
                onButtonClick={() => navigate("/products")}
            />
        );
    }

                    return (

                        <div
                            className="wishlist-card"
                            key={product._id}
                        >


                            {/* Product Image */}

                            <div className="wishlist-image">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                />

                            </div>


                            {/* Product Information */}

                            <div className="wishlist-info">

                                <h2>
                                    {product.name}
                                </h2>

                                <p>
                                    {product.description}
                                </p>

                                <strong>
                                    Rs. {product.price}
                                </strong>

                                <span>
                                    Weight: {product.weight}
                                </span>

                                <span>
                                    Stock: {product.stock}
                                </span>

                            </div>


                            {/* Actions */}

                            <div className="wishlist-actions">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/product/${product._id}`
                                        )
                                    }
                                >
                                    View Details
                                </button>


                                <button
                                    onClick={() =>
                                        addToCart(
                                            product._id
                                        )
                                    }
                                    disabled={
                                        product.stock === 0
                                    }
                                >
                                    🛒 Add To Cart
                                </button>


                                <button
                                    className="remove-wishlist-btn"
                                    onClick={() =>
                                        removeFromWishlist(
                                            product._id
                                        )
                                    }
                                >
                                    🗑 Remove
                                </button>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};