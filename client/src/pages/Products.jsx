import "./Products.css";
import {useEffect,useState} from "react";
import { ProductCard } from "../components/UI/ProductCard";
import { UseAuth } from "../store/Authentication";


export const Products=()=>{


const [products,setProducts]=useState([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");
const [page,setPage]=useState(1);
const [totalPages,setTotalPages]=useState(1);
const [sort,setSort]=useState("");

const {userAuthToken}=UseAuth();



const getProducts=async()=>{


try{


const res=await fetch(
`http://localhost:8000/api/products/getallprod?search=${search}&page=${page}&limit=5&sort=${sort}`
,{
    method:"GET",
    headers:{
        Authorization:userAuthToken
    }
});


const data=await res.json();


console.log(data);


setProducts(data.products);

setTotalPages(data.totalPages);


setLoading(false);



}catch(error){


console.log(
"Fetch products error:",
error
);


}


}


useEffect(()=>{
getProducts();
},[search,page,sort]);

if(loading){

return <h2>Loading products...</h2>

}



return(
    <>
    <div className="product-controls">


<input

type="text"

placeholder="Search products..."

value={search}

onChange={(e)=>{

setSearch(e.target.value);

setPage(1);

}}

/>


<select

value={sort}

onChange={(e)=>setSort(e.target.value)}

>


<option value="">
Sort By
</option>


<option value="price">
Price Low to High
</option>


<option value="-price">
Price High to Low
</option>


</select>


</div>

<div className="products-page">


<h1>
All Products
</h1>



<div className="products-container">


{

products?.map((product)=>(


<ProductCard

key={product._id}

product={product}

/>


))

}



</div>


</div>

<div className="pagination">


<button

disabled={page===1}

onClick={()=>setPage(page-1)}

>

Previous

</button>



<span>

Page {page} of {totalPages}

</span>



<button

disabled={page===totalPages}

onClick={()=>setPage(page+1)}

>

Next

</button>


</div>

</>
)

}