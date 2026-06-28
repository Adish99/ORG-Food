import {useEffect,useState} from "react";
import "./Home.css";


export const Home=()=>{


const slides=[

{
title:"Fresh Organic Vegetables",
image:"/images/veg.png"
},

{
title:"Pure Organic Dairy Products",
image:"/images/dp.png"
},

{
title:"Premium Organic Dry Fruits",
image:"/images/df.png"
},

{
title:"Fresh Organic Fruits",
image:"/images/fruits.png"
}

]


const [current,setCurrent]=useState(0);



useEffect(()=>{

const slider=setInterval(()=>{

setCurrent((prev)=>
(prev+1)%slides.length
)


},3000)


return ()=>clearInterval(slider);


},[])



return(

<div className="home">


<section className="hero">


<div className="hero-content">


<h1>
Fresh Organic Food
<br/>
From Natural Farms 🌱
</h1>


<p>
Healthy vegetables, fruits,
dairy products and dry fruits
delivered to your doorstep.
</p>


<button>
Shop Now
</button>


</div>




<div className="slider">


<img
src={slides[current].image}
alt={slides[current].title}
/>


<h2>
{slides[current].title}
</h2>


<div className="dots">


{
slides.map((_,index)=>(

<span
key={index}

className={
current===index 
? 
"active-dot"
:
""
}

></span>

))
}


</div>


</div>


</section>


</div>

)

}