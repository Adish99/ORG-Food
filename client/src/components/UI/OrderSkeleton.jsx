import { Skeleton } from "./Skeleton";
import "./OrderSkeleton.css";

export const OrderSkeleton = () => {
    return (
        <div className="order-skeleton">

            {/* Header */}
            <div className="order-skeleton-header">

                <div>
                    <Skeleton className="order-skeleton-title" />
                    <Skeleton className="order-skeleton-date" />
                </div>

                <Skeleton className="order-skeleton-status" />

            </div>

            {/* Products */}
            <div className="order-skeleton-products">

                <div className="order-skeleton-product">

                    <Skeleton className="order-skeleton-image" />

                    <div className="order-skeleton-info">
                        <Skeleton className="order-skeleton-product-name" />
                        <Skeleton className="order-skeleton-weight" />
                    </div>

                    <div className="order-skeleton-price">
                        <Skeleton className="order-skeleton-qty" />
                        <Skeleton className="order-skeleton-total" />
                    </div>

                </div>

                <div className="order-skeleton-product">

                    <Skeleton className="order-skeleton-image" />

                    <div className="order-skeleton-info">
                        <Skeleton className="order-skeleton-product-name" />
                        <Skeleton className="order-skeleton-weight" />
                    </div>

                    <div className="order-skeleton-price">
                        <Skeleton className="order-skeleton-qty" />
                        <Skeleton className="order-skeleton-total" />
                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="order-skeleton-footer">

                <div>
                    <Skeleton className="order-skeleton-payment" />
                    <Skeleton className="order-skeleton-items" />
                </div>

                <div className="order-skeleton-grand-total">
                    <Skeleton className="order-skeleton-grand-label" />
                    <Skeleton className="order-skeleton-grand-price" />
                </div>

            </div>

            <Skeleton className="order-skeleton-button" />

        </div>
    );
};