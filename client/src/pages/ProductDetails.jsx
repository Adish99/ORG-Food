import "./ProductDetails.css";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import { UseAuth } from "../store/Authentication";
import { Loader } from "../components/UI/Loader";


export const ProductDetail=()=>{

   const {userAuthToken,isLoggedIn}= UseAuth();


const {id}=useParams();


const [product,setProduct]=useState(null);



const getProduct=async()=>{


try{


const res=await fetch(
`http://localhost:8000/api/products/getprod/${id}`,
{
    method:"GET",
    headers:{
        Authorization:userAuthToken
    }
});


const data=await res.json();


console.log(data);


setProduct(data.data);



}catch(error){

console.log(
"Product detail error:",
error
);

}


}



useEffect(()=>{


getProduct();


},[id]);

//Handling addToCart functionality
const handleAddToCart=async()=>{
try{
    const res=await fetch("http://localhost:8000/api/cart/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:userAuthToken
        },
        body:JSON.stringify({
            productId:product._id,
            quantity:1
        })
    });

    const data=await res.json();
    if(res.ok){
        alert(data.message);
    }else{
        alert(data.message);
    }
}catch(error){
    console.log(error);
}
}



if(!product){

return <Loader/>

}



return(

<div className="product-detail-page">


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
      Login to Add Cart
    </button>
  )
}

</div>
</div>


</div>

)

}