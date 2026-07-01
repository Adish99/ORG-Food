import { NavLink } from "react-router-dom";
import "./ProductCard.css";


export const ProductCard=({product})=>{


return(

<div className="product-card">


<img

src={product.image}

alt={product.name}

/>



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