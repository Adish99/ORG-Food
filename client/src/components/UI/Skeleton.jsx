import "./Skeleton.css";

export const Skeleton = ({ className = "" }) => {

    return (
        <div className={`skeleton ${className}`}></div>
    );

};