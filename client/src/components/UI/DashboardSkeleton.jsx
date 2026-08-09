import { Skeleton } from "./Skeleton";
import "./DashboardSkeleton.css";

export const DashboardSkeleton = () => {

    return (

        <div className="dashboard-skeleton">

            <Skeleton className="dashboard-skeleton-heading" />

            {/* Statistic Cards */}

            <div className="dashboard-skeleton-cards">

                {Array.from({ length: 5 }).map((_, index) => (

                    <div
                        className="dashboard-skeleton-card"
                        key={index}
                    >

                        <Skeleton className="dashboard-skeleton-card-title" />

                        <Skeleton className="dashboard-skeleton-card-value" />

                    </div>

                ))}

            </div>

            {/* Recent Orders */}

            <div className="dashboard-skeleton-section">

                <Skeleton className="dashboard-skeleton-section-title" />

                <div className="dashboard-skeleton-table">

                    {Array.from({ length: 5 }).map((_, index) => (

                        <div
                            className="dashboard-skeleton-row"
                            key={index}
                        >

                            <Skeleton className="dashboard-skeleton-cell short" />

                            <Skeleton className="dashboard-skeleton-cell medium" />

                            <Skeleton className="dashboard-skeleton-cell small" />

                            <Skeleton className="dashboard-skeleton-cell price" />

                        </div>

                    ))}

                </div>

            </div>

            {/* Recent Users */}

            <div className="dashboard-skeleton-section">

                <Skeleton className="dashboard-skeleton-section-title" />

                <div className="dashboard-skeleton-table">

                    {Array.from({ length: 5 }).map((_, index) => (

                        <div
                            className="dashboard-skeleton-user-row"
                            key={index}
                        >

                            <Skeleton className="dashboard-skeleton-user" />

                            <Skeleton className="dashboard-skeleton-email" />

                            <Skeleton className="dashboard-skeleton-date" />

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

};