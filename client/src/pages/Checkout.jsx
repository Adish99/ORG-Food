import "./Checkout.css";
import { UseAuth } from "../store/Authentication";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


//Checkout component
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
const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [discountAmount, setDiscountAmount] = useState(0);
const [couponLoading, setCouponLoading] = useState(false);

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
      `${import.meta.env.VITE_API_URL}/api/cart`,
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

const finalTotal =
  grandTotal - discountAmount;

  const applyCoupon = async () => {

  if (!couponCode.trim()) {
    return toast.error("Please enter a coupon code.");
  }

  try {

    setCouponLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/coupon/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userAuthToken
        },
        body: JSON.stringify({
          code: couponCode,
          totalAmount: grandTotal
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return toast.error(data.message);
    }

    setAppliedCoupon(data.coupon);
    setDiscountAmount(data.discountAmount);

    toast.success(data.message);

  } catch (error) {

    console.log("Apply Coupon Error:", error);

    toast.error("Unable to apply coupon.");

  } finally {

    setCouponLoading(false);

  }

};

const removeCoupon = () => {

  setAppliedCoupon(null);
  setDiscountAmount(0);
  setCouponCode("");

  toast.info("Coupon removed.");

};

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
      `${import.meta.env.VITE_API_URL}/api/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userAuthToken,
        },
        body: JSON.stringify({
         shippingAddress,
  paymentMethod,
  couponCode: appliedCoupon?.code || null
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

     toast.success(data.message);

if (paymentMethod === "COD") {

    navigate("/orders");

}
else if (paymentMethod === "Esewa") {

    initiateEsewaPayment(

        data.order

    );

}

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
const initiateEsewaPayment = async (order) => {

    try {

        const res = await fetch(

            `${import.meta.env.VITE_API_URL}/api/payment/esewa`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: userAuthToken

                },

                body: JSON.stringify({

                    orderId: order._id

                })

            }

        );

        const data = await res.json();

        if (res.ok) {

           const payment = data.paymentData;

const form = document.createElement("form");

form.method = "POST";

form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

Object.entries(payment).forEach(([key, value]) => {

    const input = document.createElement("input");

    input.type = "hidden";

    input.name = key;

    input.value = value;

    form.appendChild(input);

});

document.body.appendChild(form);

form.submit();

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

   return (
  <div className="checkout-page">

    <h1>Checkout</h1>

    <div className="checkout-container">

      {/* =========================
          LEFT SECTION
      ========================== */}
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
          />

        </div>

        {/* Payment Method */}

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


      {/* =========================
          RIGHT SECTION
      ========================== */}

      <div className="checkout-right">

        <div className="summary-card">

          <h2>🛒 Order Summary</h2>


          {/* =========================
              PRODUCTS
          ========================== */}

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

                  <h4>
                    {item.productId.name}
                  </h4>

                  <p>
                    {item.productId.weight}
                  </p>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>

              </div>


              <div className="summary-product-right">

                <span>
                  Rs.{" "}
                  {item.productId.price *
                    item.quantity}
                </span>

              </div>

            </div>

          ))}


          {/* =========================
              COUPON
          ========================== */}

          <div className="coupon-section">

            <h3>🎟️ Apply Coupon</h3>

            {!appliedCoupon ? (

              <div className="coupon-input-group">

                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(
                      e.target.value.toUpperCase()
                    )
                  }
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading
                    ? "Applying..."
                    : "Apply"}
                </button>

              </div>

            ) : (

              <div className="applied-coupon">

                <div>

                  <strong>
                    🎉 {appliedCoupon.code}
                  </strong>

                  <p>

                    {appliedCoupon.discountValue}

                    {appliedCoupon.discountType ===
                    "percentage"
                      ? "%"
                      : " Rs."}

                    {" "}discount

                  </p>

                </div>


                <button
                  type="button"
                  onClick={removeCoupon}
                >
                  Remove
                </button>

              </div>

            )}

          </div>


          <hr />


          {/* =========================
              SUMMARY
          ========================== */}

          <div className="summary-row">

            <span>Total Items</span>

            <span>{totalItems}</span>

          </div>


          <div className="summary-row">

            <span>Subtotal</span>

            <span>
              Rs. {subtotal}
            </span>

          </div>


          <div className="summary-row">

            <span>Delivery Charge</span>

            <span>

              {deliveryCharge === 0
                ? "FREE"
                : `Rs. ${deliveryCharge}`}

            </span>

          </div>


          {/* Coupon Discount */}

          {discountAmount > 0 && (

            <div className="summary-row discount-row">

              <span>
                Coupon Discount
              </span>

              <span>
                - Rs. {discountAmount}
              </span>

            </div>

          )}


          <hr />


          {/* Final Total */}

          <div className="summary-total">

            <span>
              Final Total
            </span>

            <span>
              Rs. {finalTotal}
            </span>

          </div>


          {/* Place Order */}

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={placingOrder}
          >

            {placingOrder
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </div>

      </div>

    </div>

  </div>
);
}