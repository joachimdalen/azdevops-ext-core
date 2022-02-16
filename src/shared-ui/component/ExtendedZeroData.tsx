import { Button, IButtonProps } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Icon, IIconProps } from 'azure-devops-ui/Icon';

export interface ExtendedZeroDataProps {
  title: string;
  description?: string;
  buttons: IButtonProps[];
  icon?: IIconProps;
}
export const ExtendedZeroData = ({
  buttons,
  icon,
  title,
  description
}: ExtendedZeroDataProps): JSX.Element => {
  return (
    <div className="flex-column flex-center margin-vertical-16">
      {icon && <Icon className="custom-zero-data-icon" {...icon} />}
      <div className="margin-horizontal-16 title-l">{title}</div>
      {description && <div className="margin-top-16">{description}</div>}
      <ButtonGroup className="margin-top-16">
        {buttons.map((button, index) => (
          <Button key={button.id || `button-${index}`} id={button.id} {...button} />
        ))}
      </ButtonGroup>
    </div>
  );
};
