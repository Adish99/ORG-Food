import "./ProductDetails.css";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import { UseAuth } from "../store/Authentication";


export const ProductDetail=()=>{

   const {userAuthToken}= UseAuth();


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



if(!product){

return <h2>Loading...</h2>

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



<button className="add-cart-btn">

Add To Cart 🛒

</button>

</div>
</div>


</div>

)

}