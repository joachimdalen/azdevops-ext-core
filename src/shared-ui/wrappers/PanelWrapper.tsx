import { Button, IButtonProps } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';

import { VersionDisplay, VersionDisplayProps } from '../component/VersionDisplay';


export interface PanelWrapperProps extends VersionDisplayProps {
  children: React.ReactNode;
  cancelButton?: IButtonProps;
  okButton?: IButtonProps;
  showVersion?: boolean;
}

export const PanelWrapper = ({
  children,
  cancelButton,
  okButton,
  showVersion = true,
  moduleVersion,
  showExtensionVersion
}: PanelWrapperProps): JSX.Element => {
  return (
    <div className="flex-column flex-grow">
      <div className="flex-grow">{children}</div>
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
