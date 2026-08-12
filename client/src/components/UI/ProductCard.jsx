import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UseAuth } from "../../store/Authentication";
import "./ProductCard.css";



export const ProductCard=({product})=>{
const [isWishlisted, setIsWishlisted] = useState(false);
const [wishlistLoading, setWishlistLoading] = useState(false);

    const { userAuthToken, isLoggedIn } = UseAuth();

    const checkWishlist = async () => {

    if (!isLoggedIn) {
        return;
    }

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

        if (!res.ok) {
            return;
        }

        const exists = data.wishlist?.some(
            (item) =>
                item.productId?._id === product._id
        );

        setIsWishlisted(exists);

    } catch (error) {

        console.log(
            "Wishlist check error:",
            error
        );

    }

};

useEffect(() => {

    checkWishlist();

}, [product._id, isLoggedIn]);


const handleWishlist = async () => {

    if (!isLoggedIn) {

        return toast.error(
            "Please login to use wishlist."
        );

    }

    try {

        setWishlistLoading(true);

        const res = await fetch(
            "http://localhost:8000/api/wishlist/toggle",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: userAuthToken
                },

                body: JSON.stringify({
                    productId: product._id
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


return(

<div className="product-card">
<div className="product-image-container">
<img

src={product.image}

alt={product.name}

/>
<button
    className={
        isWishlisted
            ? "wishlist-btn active"
            : "wishlist-btn"
    }
    onClick={handleWishlist}
    disabled={wishlistLoading}
    title={
        isWishlisted
            ? "Remove from Wishlist"
            : "Add to Wishlist"
    }
>
    {isWishlisted ? "❤️" : "♡"}
</button>
</div>


<div className="product-info">


<h3>
{product.name}
</h3>



<p>
{product.description}
</p>



<div className="product-price">

Rs. {product.price}

</div>



<div className="product-meta">

<span>
Weight: {product.weight}
</span>


<span>
Stock: {product.stock}
</span>


</div>



<NavLink to={`/product/${product._id}`}>

<button>
View Details
</button>

</NavLink>

</div>


</div>

)

}