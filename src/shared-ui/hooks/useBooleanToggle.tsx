import { useState } from 'react';

export default function useBooleanToggle(
  initialValue = false
): readonly [boolean, (value?: React.SetStateAction<boolean> | undefined) => void] {
  const [state, setState] = useState(initialValue);

  const toggle = (value?: React.SetStateAction<boolean>) => {
    if (typeof value !== 'undefined') {
      setState(value);
    } else {
      setState(current => !current);
    }
  };

  return [state, toggle] as const;
}
