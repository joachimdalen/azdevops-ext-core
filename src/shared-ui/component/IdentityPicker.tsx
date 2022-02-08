import { PeoplePickerProvider } from 'azure-devops-extension-api/Identities';
import {
  IdentityPickerDropdown,
  IIdentity,
  IIdentityPickerDropdownProps
} from 'azure-devops-ui/IdentityPicker';
import { useEffect, useMemo, useState } from 'react';

import { IInternalIdentity, IInternalIdentityType } from '../..';
interface IdentityPickerProps
  extends Omit<IIdentityPickerDropdownProps, 'pickerProvider' | 'value' | 'onChange'> {
  identity?: IInternalIdentity;
  onChange: (item?: IInternalIdentity) => boolean | void;
}

const IdentityPicker = ({ onChange, identity, ...rest }: IdentityPickerProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const identityProvider = useMemo(() => {
    return new PeoplePickerProvider();
  }, []);

  useEffect(() => {
    async function loadIdentity() {
      if (identity === undefined) return;
      if ((intId === undefined || intId.entityId !== identity.entityId) && !loading) {
        setLoading(true);

        const identityResult = (await identityProvider.getEntityFromUniqueAttribute(
          identity.entityId
        )) as IIdentity;
        setIntId(identityResult);
        setLoading(false);
      }
    }

    loadIdentity();
  }, [identity]);

  const [intId, setIntId] = useState<IIdentity | undefined>();

  return (
    <IdentityPickerDropdown
      pickerProvider={identityProvider}
      value={intId}
      onChange={identity => {
        if (identity) {
          setIntId(identity);
          const id: IInternalIdentity = {
            id: identity.localId || identity.entityId,
            descriptor: identity.subjectDescriptor,
            entityId: identity.entityId,
            displayName: identity.displayName || 'Unknown User',
            image: identity.image,
            entityType: identity.entityType as IInternalIdentityType
          };
          onChange(id);
        }
      }}
      {...rest}
    />
  );
};

export default IdentityPicker;
