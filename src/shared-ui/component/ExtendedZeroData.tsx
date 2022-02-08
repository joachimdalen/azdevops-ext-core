import { Button, IButtonProps } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Icon, IIconProps } from 'azure-devops-ui/Icon';

interface ExtendedZeroDataProps {
  buttons: IButtonProps[];
  icon?: IIconProps;
}
const ExtendedZeroData = ({ buttons, icon }: ExtendedZeroDataProps): JSX.Element => {
  return (
    <div className="flex-column flex-center margin-vertical-16">
      {icon && <Icon className="custom-zero-data-icon" {...icon} />}
      <div className="margin-horizontal-16 title-l">No rules added</div>
      <ButtonGroup className="margin-top-16">
        {buttons.map((button, index) => (
          <Button key={button.id || `button-${index}`} id={button.id} {...button} />
        ))}
      </ButtonGroup>
    </div>
  );
};

export default ExtendedZeroData;
