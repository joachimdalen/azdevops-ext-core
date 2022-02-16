/* istanbul ignore file */

import { render } from 'react-dom';

export function showRootComponent(component: React.ReactElement<any>, target: string): void {
  render(component, document.getElementById(target));
}
