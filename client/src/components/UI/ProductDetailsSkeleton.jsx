import { Skeleton } from "./Skeleton";
import "./ProductDetailsSkeleton.css";

export const ProductDetailsSkeleton = () => {
    return (
        <div className="product-details-skeleton">

            <div className="product-details-skeleton-image">
                <Skeleton className="details-image" />
            </div>

            <div className="product-details-skeleton-info">

                <Skeleton className="details-title" />

                <Skeleton className="details-category" />

                <Skeleton className="details-description" />
                <Skeleton className="details-description short" />

                <Skeleton className="details-price" />

                <Skeleton className="details-stock" />

                <div className="details-actions">

                    <Skeleton className="details-quantity" />

                    <Skeleton className="details-button" />

                </div>

            </div>

        </div>
    );
};