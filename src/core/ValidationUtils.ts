import { ValidationError as YupValidationError } from 'yup';

import { capitalizeFirstLetter } from './StringUtils';
export type ValidationErrors = { [key: string]: string[] };

export const parseValidationError = (error: YupValidationError): ValidationErrors => {
  const data = error.inner
    .map((x: any) => {
      return {
        path: x.path,
        message: x.message
      };
    })
    .reduce((previousValue: any, currentValue: any) => {
      if (previousValue[currentValue.path] !== undefined) {
        return {
          ...previousValue,
          [currentValue.path]: [...previousValue[currentValue.path], currentValue.message]
        };
      }

      return {
        ...previousValue,
        [currentValue.path]: [currentValue.message]
      };
    }, {});

  return data;
};

export const getCombined = (
  errors: ValidationErrors | undefined,
  key: string,
  alternateKey?: string
): string | undefined => {
  if (errors === undefined) return undefined;
  if (errors[key] === undefined) return undefined;

  return errors[key]
    .map(r => {
      return capitalizeFirstLetter(alternateKey === undefined ? r : r.replace(key, alternateKey));
    })
    .join('. ');
};

export const hasError = (errors: { [key: string]: string[] } | undefined, key: string): boolean => {
  if (errors === undefined) return false;
  if (errors[key] === undefined) return false;

  return true;
};

export const getValidationCountByPattern = (
  errors: ValidationErrors | undefined,
  match: RegExp
): number | undefined => {
  if (errors === undefined) return undefined;
  const count = Object.keys(errors).filter(x => x.match(match)).length;

  if (count > 0) return count;
  return undefined;
};

export const getValidationCount = (
  errors: ValidationErrors | undefined,
  fields: string[]
): number | undefined => {
  if (errors === undefined) return undefined;
  const count = Object.keys(errors).filter(x => fields.includes(x)).length;

  if (count > 0) return count;
  return undefined;
};
