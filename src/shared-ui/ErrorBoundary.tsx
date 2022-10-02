import { IIconProps } from 'azure-devops-ui/Icon';
import { ZeroData } from 'azure-devops-ui/ZeroData';
import * as css from 'classnames';
import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  iconProps?: IIconProps;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
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
        <div className={css('flex-row flex-grow', this.props.className)}>
          <ZeroData
            imageAltText={''}
            className="flex-grow"
            iconProps={this.props.iconProps}
            primaryText={this.props.title || 'Error'}
            secondaryText={this.props.description || 'An error occurred when showing this section'}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
