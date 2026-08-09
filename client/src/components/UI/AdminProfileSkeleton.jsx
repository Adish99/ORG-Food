import { Skeleton } from "./Skeleton";
import "./AdminProfileSkeleton.css";

export const AdminProfileSkeleton = () => {
    return (
        <div className="admin-profile-skeleton">

            {/* Profile information card */}
            <div className="admin-profile-skeleton-card">

                <div className="admin-profile-skeleton-header">

                    <Skeleton className="admin-profile-skeleton-avatar" />

                    <div className="admin-profile-skeleton-info">

                        <Skeleton className="admin-profile-skeleton-name" />

                        <Skeleton className="admin-profile-skeleton-email" />

                        <Skeleton className="admin-profile-skeleton-role" />

                        <Skeleton className="admin-profile-skeleton-message" />

                    </div>

                </div>


                {/* Profile form */}

                <div className="admin-profile-skeleton-form">

                    <div>
                        <Skeleton className="admin-profile-skeleton-label" />
                        <Skeleton className="admin-profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="admin-profile-skeleton-label" />
                        <Skeleton className="admin-profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="admin-profile-skeleton-label" />
                        <Skeleton className="admin-profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="admin-profile-skeleton-label" />
                        <Skeleton className="admin-profile-skeleton-textarea" />
                    </div>

                    <Skeleton className="admin-profile-skeleton-button" />

                </div>

            </div>


            {/* Change password card */}

            <div className="admin-profile-skeleton-card">

                <Skeleton className="admin-profile-skeleton-password-title" />

                <Skeleton className="admin-profile-skeleton-password-input" />

                <Skeleton className="admin-profile-skeleton-password-input" />

                <Skeleton className="admin-profile-skeleton-password-input" />

                <Skeleton className="admin-profile-skeleton-button" />

            </div>

        </div>
    );
};