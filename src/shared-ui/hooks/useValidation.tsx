import { useCallback, useState } from 'react';
import * as yup from 'yup';

import { parseValidationError, ValidationErrors } from '../../core/ValidationUtils';

export type ValidationFunc<T> = (schema: yup.ObjectSchema<any>, data: T) => Promise<boolean>;

function useValidation<T>(): {
  validate: ValidationFunc<T>;
  errors?: ValidationErrors;
} {
  const [errors, setErrors] = useState<ValidationErrors | undefined>();
  const validate = useCallback(async (schema: yup.ObjectSchema<any>, data: T): Promise<boolean> => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors(undefined);
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const data = parseValidationError(error);
        setErrors(data);
        return false;
      } else {
        throw error;
      }
    }
  }, []);

  return {
    validate,
    errors
  };
}

export default useValidation;
