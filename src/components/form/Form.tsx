import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { InputField } from '../InputField/InputField';
import type { CMSForm, FormProps } from './formTypes';

const Form: React.FC<FormProps> = ({ formName, twClasses = [], ...rest }) => {
  const allForms = useAppSelector((state) => state.initialApp.forms) as CMSForm[];
  const form = allForms.find((f) => f.formName === formName);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    form?.formFields.forEach((field) => {
      if (field.formFieldRequired && !formValues[field.formFieldName]) {
        newErrors[field.formFieldName] = `${field.formFieldLabel} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formValues);
  };

  if (!form) return <p className="text-red-600">Form not found.</p>;

  return (
    <form className={`space-y-4 ${twClasses.join(' ')}`} onSubmit={handleSubmit} {...rest}>
      {form.formFields.map((field) => (
        <InputField
          key={field.formFieldName}
          name={field.formFieldName}
          label={field.formFieldLabel}
          type={field.formFieldType}
          rows={field.formFieldRows}
          multiline={field.formFieldType === "textarea"}
          placeholder={field.formFieldPlaceholder}
          required={field.formFieldRequired}
          value={formValues[field.formFieldName] || ''}
          onChange={handleChange}
          error={!!errors[field.formFieldName]}
          errorText={errors[field.formFieldName]}
        />
      ))}

      {form.requireCaptcha && (
        <div className="border p-4 rounded text-sm text-gray-500 bg-gray-50">
          CAPTCHA Placeholder (to be integrated)
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
