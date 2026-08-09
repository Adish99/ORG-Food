import { Skeleton } from "./Skeleton";
import "./ProductSkeleton.css";

export const ProductSkeleton = () => {

    return (

        <div className="product-skeleton">

            <Skeleton className="product-skeleton-image" />

            <Skeleton className="product-skeleton-title" />

            <Skeleton className="product-skeleton-description" />

            <Skeleton className="product-skeleton-price" />

            <Skeleton className="product-skeleton-button" />

        </div>

    );

};