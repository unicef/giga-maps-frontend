import { useState, useCallback, FormEvent, ChangeEvent, FocusEvent, useEffect, useMemo } from 'react';
interface FormValues {
  [key: string]: string; // Generic type for form field values
}

interface TouchValues {
  [key: string]: boolean;
}

interface ValidationRule {
  required?: boolean | string;
  validate?: (value: string) => boolean;
  message: string;
}

interface FormErrors {
  [key: string]: string; // Errors for each field
}
function useForm(
  initialValues: FormValues = {},
  validationRules: Record<string, ValidationRule[]> = {}
) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchValues>({});
  const isError = useMemo(() => {
    return Object.keys(errors).length > 0
  }, [errors])


  const validate = useCallback(() => {
    let newErrors = {} as FormValues;
    // Apply validation rules to each field
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName];
      const rules = validationRules[fieldName];
      rules.forEach(rule => {
        if (rule.required) {
          if (!value) {
            newErrors[fieldName] = rule.message || 'This field is required';
            return;
          }
        }
        if (rule.validate && !rule.validate(value)) {
          newErrors[fieldName] = rule.message || 'Invalid field value';
          return;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True if valid
  }, [values, validationRules]);

  useEffect(() => {
    validate();
  }, [values])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }, [values]);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string } }) => {
    const { name } = event.target;
    setTouched({ ...touched, [name]: true });
  }, [touched]);

  const reset = useCallback(() => {
    setValues({ ...initialValues });
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleBlur,
    isError,
    handleChange,
    reset,
    handleSubmit: (onSubmitCallback: (_: FormValues) => void) => (event: FormEvent) => {
      event.preventDefault();
      if (validate()) {
        onSubmitCallback(values);
      }
    }
  };
}

export default useForm;