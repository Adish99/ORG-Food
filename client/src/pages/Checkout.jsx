import "./Checkout.css";
import { UseAuth } from "../store/Authentication";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Checkout=()=>{

    const [cart, setCart] = useState(null);

const [shippingAddress, setShippingAddress] = useState({
  fullName: "",
  phone: "",
  province: "",
  district: "",
  city: "",
  street: ""
});
const [paymentMethod, setPaymentMethod] = useState("COD");
const [placingOrder, setPlacingOrder] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const {userAuthToken}=UseAuth();
const navigate=useNavigate();

const handleChange = (e) => {
  setShippingAddress({
    ...shippingAddress,
    [e.target.name]: e.target.value,
  });
};

const getUserCart = async () => {
  try {
    const res = await fetch(
      "http://localhost:8000/api/cart",
      {
        headers: {
          Authorization: userAuthToken,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setCart(data.cart);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  getUserCart();
}, []);

const totalItems =
  cart?.products.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

const subtotal =
  cart?.products.reduce(
    (total, item) =>
      total +
      item.productId.price * item.quantity,
    0
  ) || 0;

const deliveryCharge =
  subtotal >= 1000 ? 0 : 100;

const grandTotal =
  subtotal + deliveryCharge;

  const placeOrder = async () => {

  if (
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.province ||
    !shippingAddress.district ||
    !shippingAddress.city ||
    !shippingAddress.street
  ) {
    return alert("Please fill all shipping details.");
  }
setIsSubmitting(true);
  try {

    setPlacingOrder(true);

    const res = await fetch(
      "http://localhost:8000/api/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userAuthToken,
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      toast.success(data.message);

      navigate("/orders");

    } else {

      toast.error(data.message);

    }

  } catch (error) {

    console.log("Place Order Error:", error);

  } finally {

    setPlacingOrder(false);
    setIsSubmitting(false);

  }

};

    return(
        
  <div className="checkout-page">

    <h1>Checkout</h1>

    <div className="checkout-container">

      {/* Left Section */}
      <div className="checkout-left">

        <div className="checkout-card">

          <h2>Shipping Address</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={shippingAddress.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={shippingAddress.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="province"
            placeholder="Province"
            value={shippingAddress.province}
            onChange={handleChange}
          />

          <input
            type="text"
            name="district"
            placeholder="District"
            value={shippingAddress.district}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleChange}
          />

          <textarea
            name="street"
            placeholder="Street Address"
            rows="4"
            value={shippingAddress.street}
            onChange={handleChange}
          ></textarea>

        </div>

        <div className="checkout-card">

          <h2>Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          >

            <option value="COD">
              Cash On Delivery
            </option>

            <option value="Esewa">
              eSewa
            </option>

            <option value="Khalti">
              Khalti
            </option>

          </select>

        </div>

      </div>

      {/* Right Section */}

      <div className="checkout-right">

        <div className="summary-card">

  <h2>🛒 Order Summary</h2>

  {cart?.products.map((item) => (

    <div
      key={item.productId._id}
      className="summary-product"
    >

      <div className="summary-product-left">

        <img
          src={item.productId.image}
          alt={item.productId.name}
          className="summary-product-image"
        />

        <div className="summary-product-info">

          <h4>{item.productId.name}</h4>

          <p>{item.productId.weight}</p>

          <span>
            Qty : {item.quantity}
          </span>

        </div>

      </div>

      <div className="summary-product-right">

        <span>
          Rs. {item.productId.price * item.quantity}
        </span>

      </div>

    </div>

  ))}

  <hr />

  <div className="summary-row">

    <span>Total Items</span>

    <span>{totalItems}</span>

  </div>

  <div className="summary-row">

    <span>Subtotal</span>

    <span>Rs. {subtotal}</span>

  </div>

  <div className="summary-row">

    <span>Delivery Charge</span>

    <span>

      {deliveryCharge === 0
        ? "FREE"
        : `Rs. ${deliveryCharge}`}

    </span>

  </div>

  <hr />

  <div className="summary-total">

    <span>Grand Total</span>

    <span>Rs. {grandTotal}</span>

  </div>

 <button
  className="place-order-btn"
  onClick={placeOrder}
  disabled={placingOrder}
>

{
placingOrder
? "Placing Order..."
: "Place Order"
}

</button>

</div>

      </div>

    </div>

  </div>
);
}