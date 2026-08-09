import { Component } from "react";
import "./ErrorBoundary.css";

export class ErrorBoundary extends Component {

    constructor(props) {

        super(props);

        this.state = {
            hasError: false,
            error: null
        };

    }

    static getDerivedStateFromError(error) {

        return {
            hasError: true,
            error
        };

    }

    componentDidCatch(error, errorInfo) {

        console.error(
            "Error Boundary caught an error:",
            error,
            errorInfo
        );

    }

    handleReload = () => {

        window.location.reload();

    };

    handleGoHome = () => {

        window.location.href = "/";

    };

    render() {

        if (this.state.hasError) {

            return (

                <div className="error-boundary">

                    <div className="error-boundary-card">

                        <div className="error-icon">
                            ⚠️
                        </div>

                        <h1>
                            Something went wrong
                        </h1>

                        <p>
                            We are sorry, but something unexpected
                            happened. Please try again.
                        </p>

                        <div className="error-boundary-actions">

                            <button
                                onClick={this.handleReload}
                                className="error-reload-btn"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="error-home-btn"
                            >
                                Go Home
                            </button>

                        </div>

                    </div>

                </div>

            );

        }

        return this.props.children;

    }

}