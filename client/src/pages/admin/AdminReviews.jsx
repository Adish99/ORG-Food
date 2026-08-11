import "./AdminReviews.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UseAuth } from "../../store/Authentication";
import { Loader } from "../../components/UI/Loader";
import { EmptyState } from "../../components/UI/EmptyState";

export const AdminReviews = () => {

    const { userAuthToken } = UseAuth();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingReview, setDeletingReview] = useState("");


    // ==========================
    // Get All Reviews
    // ==========================

    const getReviews = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                "http://localhost:8000/api/reviews/admin/all",
                {
                    method: "GET",
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return toast.error(data.message);
            }

            setReviews(data.reviews || []);

        } catch (error) {

            console.log(
                "Admin reviews error:",
                error
            );

            toast.error(
                "Unable to fetch reviews."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================
    // Delete Review
    // ==========================

    const handleDeleteReview = async (reviewId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeletingReview(reviewId);

            const res = await fetch(
                `http://localhost:8000/api/reviews/admin/${reviewId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return toast.error(data.message);
            }

            toast.success(
                "Review deleted successfully."
            );

            // Remove deleted review immediately
            setReviews((prevReviews) =>
                prevReviews.filter(
                    (review) =>
                        review._id !== reviewId
                )
            );

        } catch (error) {

            console.log(
                "Delete review error:",
                error
            );

            toast.error(
                "Unable to delete review."
            );

        } finally {

            setDeletingReview("");

        }

    };


    // ==========================
    // Load Reviews
    // ==========================

    useEffect(() => {

        getReviews();

    }, []);


    // ==========================
    // Loading
    // ==========================

    if (loading) {

        return (
            <div className="admin-reviews-page">

                <Loader />

            </div>
        );

    }


    return (

        <div className="admin-reviews-page">


            <div className="admin-reviews-header">

                <div>

                    <h1>
                        ⭐ Reviews
                    </h1>

                    <p>
                        Manage customer product reviews
                    </p>

                </div>


                <div className="review-count">

                    {reviews.length}{" "}
                    {reviews.length === 1
                        ? "Review"
                        : "Reviews"}

                </div>

            </div>


            {reviews.length === 0 ? (

                <EmptyState
                    icon="⭐"
                    title="No reviews yet"
                    message="Customer reviews will appear here once users start reviewing products."
                    buttonText="Refresh"
                    onButtonClick={getReviews}
                />

            ) : (

                <div className="admin-reviews-list">

                    {reviews.map((review) => (

                        <div
                            className="admin-review-card"
                            key={review._id}
                        >


                            {/* Product */}

                            <div className="admin-review-product">

                                <img
                                    src={
                                        review.productId?.image ||
                                        "https://via.placeholder.com/80?text=No+Image"
                                    }
                                    alt={
                                        review.productId?.name ||
                                        "Product"
                                    }
                                />

                                <div>

                                    <h3>
                                        {review.productId?.name ||
                                            "Product Removed"}
                                    </h3>

                                    <span>
                                        Product Review
                                    </span>

                                </div>

                            </div>


                            {/* Review Content */}

                            <div className="admin-review-content">

                                <div className="admin-review-user">

                                    <strong>
                                        {review.userId?.username ||
                                            "Anonymous"}
                                    </strong>

                                    <span>
                                        {review.userId?.email ||
                                            ""}
                                    </span>

                                </div>


                                <div className="admin-review-rating">

                                    {"⭐".repeat(
                                        review.rating
                                    )}

                                    <span>
                                        ({review.rating}/5)
                                    </span>

                                </div>


                                <p>
                                    {review.comment}
                                </p>


                                <small>

                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}

                                </small>

                            </div>


                            {/* Delete */}

                            <div className="admin-review-action">

                                <button
                                    className="admin-review-delete"
                                    disabled={
                                        deletingReview ===
                                        review._id
                                    }
                                    onClick={() =>
                                        handleDeleteReview(
                                            review._id
                                        )
                                    }
                                >

                                    {deletingReview ===
                                    review._id
                                        ? "Deleting..."
                                        : "🗑 Delete"}

                                </button>

                            </div>


                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};