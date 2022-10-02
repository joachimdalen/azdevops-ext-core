import { Button, IButtonProps } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import * as cx from 'classnames';

import { VersionDisplay, VersionDisplayProps } from '../component/VersionDisplay';

export interface PanelWrapperProps extends VersionDisplayProps {
  children: React.ReactNode;
  cancelButton?: IButtonProps;
  okButton?: IButtonProps;
  showVersion?: boolean;
  rootClassName?: string;
  contentClassName?: string;
}

export const PanelWrapper = ({
  children,
  cancelButton,
  okButton,
  showVersion = true,
  moduleVersion,
  showExtensionVersion,
  rootClassName,
  contentClassName
}: PanelWrapperProps): JSX.Element => {
  return (
    <div className={cx('flex-column flex-grow', rootClassName)}>
      <div className={cx('flex-grow', contentClassName)}>{children}</div>
      <ButtonGroup className="justify-space-between flex-center margin-bottom-16">
        {cancelButton && <Button {...cancelButton} />}
        {showVersion && (
          <VersionDisplay
            showExtensionVersion={showExtensionVersion}
            moduleVersion={moduleVersion}
          />
        )}
        {okButton && <Button {...okButton} />}
      </ButtonGroup>
    </div>
  );
};
