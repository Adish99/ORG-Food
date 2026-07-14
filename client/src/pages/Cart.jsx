import "./Cart.css";
import { useState } from "react";
import { UseAuth } from "../store/Authentication";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export const Cart=()=>{

    const [cart, setCart] = useState(null);
const [loading, setLoading] = useState(true);

const {userAuthToken}=UseAuth();

const getUserCart = async () => {
  try {
    const res = await fetch(
      "http://localhost:8000/api/cart",
      {
        method: "GET",
        headers: {
          Authorization: userAuthToken,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      setCart(data.cart);
    }

  } catch (error) {
    console.log("Fetch cart error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getUserCart();
}, []);

//Update the quantity functionality

const updateQuantity = async (productId, quantity) => {
  try {
    const res = await fetch(
      "http://localhost:8000/api/cart/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: userAuthToken,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      // Refresh cart after updating quantity
      getUserCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Update quantity error:", error);
  }
};

//Delete or Remove addToCart
const removeProduct = async (productId) => {
     const confirmDelete = window.confirm(
    "Are you sure you want to remove this product from your cart?"
  );

  if (!confirmDelete) return;
  try {
    const res = await fetch(
      "http://localhost:8000/api/cart/remove",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: userAuthToken,
        },
        body: JSON.stringify({
          productId,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert(data.message);

      // Refresh cart
      getUserCart();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Remove product error:", error);
  }
};


if (loading) {
  return <h2>Loading Cart...</h2>;
}

if (!cart || cart.products.length === 0) {
  return <h2>Your cart is empty 🛒</h2>;
}

const totalPrice = cart.products.reduce((total, item) => {
  return total + item.productId.price * item.quantity;
}, 0);

const totalItems = cart.products.reduce((total, item) => {
  return total + item.quantity;
}, 0);

    return(
        <>
 <div className="cart-page">

<h1>🛒 My Shopping Cart</h1>

<div className="cart-container">

{
cart.products.map((item)=>(

<div
className="cart-card"
key={item.productId._id}
>

<img
src={item.productId.image}
alt={item.productId.name}
/>

<div className="cart-info">

<h2>{item.productId.name}</h2>

<p className="cart-subtotal">
  Subtotal: Rs. {item.productId.price * item.quantity}
</p>

<div className="quantity-control">

 <button
  disabled={item.quantity === 1}
  onClick={() =>
    updateQuantity(
      item.productId._id,
      item.quantity - 1
    )
  }
>
  -
</button>

  <span>
    {item.quantity}
  </span>

  <button
    onClick={() =>
      updateQuantity(
        item.productId._id,
        item.quantity + 1
      )
    }
  >
    +
  </button>

</div>

</div>

<button
  className="remove-btn"
  onClick={() => removeProduct(item.productId._id)}
>
  🗑 Remove
</button>

</div>

))
}

</div>

<div className="cart-summary">
<p>Total Items: {totalItems}</p>
<h2>Total :{totalPrice}</h2>

<NavLink to="/checkout">
  <button className="checkout-btn">
        Proceed to Checkout
</button>
  </NavLink>

</div>

</div>
        </>
    )
}