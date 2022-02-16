import * as DevOps from 'azure-devops-extension-sdk';
import { useEffect } from 'react';

export function useResizeTimeout(interval: number): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      DevOps.resize();
    }, interval);
    return () => clearTimeout(timer);
  }, []);
}
