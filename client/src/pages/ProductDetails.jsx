import "./ProductDetails.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { UseAuth } from "../store/Authentication";
import { ProductDetailsSkeleton } from "../components/UI/ProductDetailsSkeleton";

export const ProductDetail = () => {

    const { userAuthToken, isLoggedIn } = UseAuth();

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [submittingReview, setSubmittingReview] = useState(false);
const [isWishlisted, setIsWishlisted] = useState(false);
const [wishlistLoading, setWishlistLoading] = useState(false);


    // ==========================
    // Get Product
    // ==========================

    const getProduct = async () => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products/getprod/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            console.log(data);

            setProduct(data.data);

        } catch (error) {

            console.log(
                "Product detail error:",
                error
            );

        }

    };


    // ==========================
    // Get Reviews
    // ==========================

    const getReviews = async () => {

        try {

            setReviewsLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reviews/product/${id}`
            );

            const data = await res.json();

            console.log("Reviews:", data);

            if (res.ok) {

                setReviews(data.reviews || []);

                setAverageRating(
                    data.averageRating || 0
                );

                setTotalReviews(
                    data.totalReviews || 0
                );

            }

        } catch (error) {

            console.log(
                "Reviews fetch error:",
                error
            );

        } finally {

            setReviewsLoading(false);

        }

    };

    const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
        return toast.error("Please login to write a review.");
    }

    if (rating === 0) {
        return toast.error("Please select a rating.");
    }

    if (!comment.trim()) {
        return toast.error("Please write a comment.");
    }

    try {

        setSubmittingReview(true);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/reviews/add`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: userAuthToken
                },

                body: JSON.stringify({
                    productId: id,
                    rating,
                    comment
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return toast.error(data.message);
        }

        toast.success("Review added successfully! ⭐");

        // Clear form
        setRating(0);
        setComment("");

        // Refresh reviews
        getReviews();

    } catch (error) {

        console.log(
            "Submit review error:",
            error
        );

        toast.error(
            "Unable to submit review."
        );

    } finally {

        setSubmittingReview(false);

    }
};

const checkWishlist = async () => {

    if (!isLoggedIn) {
        setIsWishlisted(false);
        return;
    }

    try {

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/wishlist`,
            {
                method: "GET",
                headers: {
                    Authorization: userAuthToken
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return;
        }

        const exists = data.wishlist?.some(
            (item) =>
                item.productId?._id === id
        );

        setIsWishlisted(exists);

    } catch (error) {

        console.log(
            "Wishlist check error:",
            error
        );

    }

};

const handleWishlist = async () => {

    if (!isLoggedIn) {
        return toast.error(
            "Please login to use wishlist."
        );
    }

    try {

        setWishlistLoading(true);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: userAuthToken
                },

                body: JSON.stringify({
                    productId: id
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return toast.error(
                data.message
            );
        }

        const added =
            data.message.includes("added");

        setIsWishlisted(added);

        toast.success(data.message);

    } catch (error) {

        console.log(
            "Wishlist error:",
            error
        );

        toast.error(
            "Unable to update wishlist."
        );

    } finally {

        setWishlistLoading(false);

    }

};




    // ==========================
    // Load Product + Reviews
    // ==========================

    useEffect(() => {

        getProduct();

        getReviews();
        checkWishlist();

    }, [id,isLoggedIn]);


    // ==========================
    // Add To Cart
    // ==========================

    const handleAddToCart = async () => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/cart/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: userAuthToken
                    },

                    body: JSON.stringify({
                        productId: product._id,
                        quantity: 1
                    })

                }
            );

            const data = await res.json();

            if (res.ok) {

                alert(data.message);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================
    // Loading
    // ==========================

    if (!product) {

        return <ProductDetailsSkeleton />;

    }


    return (

        <div className="product-detail-page">


            {/* ==========================
                PRODUCT DETAILS
            ========================== */}

            <div className="product-detail-card">


                <div className="product-detail-image">

                    <img
                        src={product.image}
                        alt={product.name}
                    />

                </div>


                <div className="product-detail-info">


                    <h1>
                        {product.name}
                    </h1>


                    <p>
                        {product.description}
                    </p>


                    <div className="detail-price">

                        Rs. {product.price}

                    </div>


                    <div className="detail-stock">

                        Stock Available: {product.stock}

                    </div>

             <button
    className={
        isWishlisted
            ? "product-detail-wishlist-btn active"
            : "product-detail-wishlist-btn"
    }
    onClick={handleWishlist}
    disabled={wishlistLoading}
>
    {wishlistLoading
        ? "Saving..."
        : isWishlisted
        ? "❤️ Remove from Wishlist"
        : "♡ Add to Wishlist"}
</button>


                    {
                        isLoggedIn ? (

                            <button
                                className="add-cart-btn"
                                onClick={handleAddToCart}
                            >
                                Add To Cart 🛒
                            </button>

                        ) : (

                            <button
                                className="add-cart-btn"
                                disabled
                            >
                                <NavLink to="/login">
                                 Login to Add Cart
                                </NavLink>
                            </button>

                        )
                    }


                </div>

            </div>

{/* ==========================
    REVIEWS
========================== */}

<div className="reviews-section">

    <div className="reviews-header">

        <h2>
            Customer Reviews
        </h2>

        <div className="rating-summary">

            <span className="average-rating">
                ⭐ {averageRating}
            </span>

            <span>
                {totalReviews}{" "}
                {totalReviews === 1
                    ? "Review"
                    : "Reviews"}
            </span>

        </div>

    </div>


    {/* ==========================
        WRITE A REVIEW
    ========================== */}

    {isLoggedIn && (

        <div className="write-review">

            <h3>
                Write a Review
            </h3>

            <form onSubmit={handleSubmitReview}>

                <div className="star-selector">

                    <span>
                        Your Rating:
                    </span>

                    <div className="select-stars">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <button
                                type="button"
                                key={star}
                                className={
                                    star <= rating
                                        ? "star active"
                                        : "star"
                                }
                                onClick={() =>
                                    setRating(star)
                                }
                            >
                                ★
                            </button>

                        ))}

                    </div>

                </div>


                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                    placeholder="Share your experience with this product..."
                    maxLength={500}
                    rows={5}
                />


                <div className="review-form-footer">

                    <span>
                        {comment.length}/500
                    </span>

                    <button
                        type="submit"
                        disabled={submittingReview}
                    >
                        {submittingReview
                            ? "Submitting..."
                            : "Submit Review ⭐"}
                    </button>

                </div>

            </form>

        </div>

    )}


    {/* ==========================
        REVIEWS LIST
    ========================== */}

    {reviewsLoading ? (

        <p className="reviews-loading">
            Loading reviews...
        </p>

    ) : reviews.length === 0 ? (

        <p className="no-reviews">
            No reviews yet. Be the first
            to review this product!
        </p>

    ) : (

        <div className="reviews-list">

            {reviews.map((review) => (

                <div
                    className="review-card"
                    key={review._id}
                >

                    <div className="review-header">

                        <strong>
                            {review.userId?.username ||
                                "Anonymous"}
                        </strong>

                        <span>
                            {new Date(
                                review.createdAt
                            ).toLocaleDateString()}
                        </span>

                    </div>


                    <div className="review-rating">

                        {"⭐".repeat(review.rating)}

                    </div>


                    <p className="review-comment">

                        {review.comment}

                    </p>

                </div>

            ))}

        </div>

    )}

</div>

        </div>

    );

};