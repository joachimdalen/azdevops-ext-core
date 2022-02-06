import { ZeroData } from 'azure-devops-ui/ZeroData';
import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-row flex-center">
          <ZeroData
            imageAltText={''}
            primaryText="Error"
            secondaryText="An error occurred when showing this section"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
