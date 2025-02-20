import React from "react";

interface Props {
    children: React.ReactNode
    errorNode?: React.ReactNode
}
interface State {
    hasError: boolean
}
class ErrorBoundary extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.errorNode) {
                return this.props.errorNode
            }
            return <h1>Something went wrong.</h1>
        }
        return this.props.children;
    }
}
export default ErrorBoundary