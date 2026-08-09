import "./EmptyState.css";

export const EmptyState = ({
    icon = "📭",
    title = "Nothing here yet",
    message = "There is nothing to display right now.",
    buttonText,
    onButtonClick
}) => {

    return (
        <div className="empty-state">

            <div className="empty-state-icon">
                {icon}
            </div>

            <h2>
                {title}
            </h2>

            <p>
                {message}
            </p>

            {buttonText && onButtonClick && (

                <button
                    className="empty-state-btn"
                    onClick={onButtonClick}
                >
                    {buttonText}
                </button>

            )}

        </div>
    );

};