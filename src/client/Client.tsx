import React, { useState } from 'react';
import Text from '../components/text/Text';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';
import { useAppSelector } from '../store/hooks';
import { MailIcon } from 'lucide-react';
import { InputField } from '../components/InputField/InputField';

const Client: React.FC = () => {
  const activeModule = useAppSelector((state) => state.activeModule);

  const containerAnimations: AnimationObject = {
    entranceAnimation: 'animate__fadeIn',
    exitAnimation: 'animate__fadeOut',
    isEntering: activeModule.activeModuleIn,
  };

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    }

    // If form was already submitted, update errors live
    if (submitted) {
      validateField(name, value);
    }
  };

  const validateField = (name: string, value: string) => {
    if (name === 'email') {
      const isValid = /\S+@\S+\.\S+/.test(value);
      setErrors((prev) => ({
        ...prev,
        email: isValid ? '' : 'Please enter a valid email address',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    validateField('email', email);

    const hasErrors = !!errors.email || !email;
    if (!hasErrors) {
      console.log('Form submitted:', { email });
    }
  };

  return (
    <Container twClasses={['h-screen', 'bg-gray-50']} animationObject={containerAnimations}>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
        <Text text="Client" />

        <InputField
          label="Email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={submitted && !!errors.email}
          errorText={submitted ? errors.email : ''}
          required
          iconStart={<MailIcon className="w-5 h-5 text-gray-400" />}
          twClasses={['mb-4']}
          inputClasses={['bg-white', 'text-gray-900']}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </Container>
  );
};

export default Client;
