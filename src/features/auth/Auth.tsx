import React, { useState } from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Icon from '../../shared/components/icon/Icon';
import Input from '../../shared/components/input/Input';
import Button from '../../shared/components/button/Button';

const Auth: React.FC = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formValues, setFormValues] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
      
    const handleSubmit = () => {
        console.log('sub')
    }

    return (
        <Container width='w-full' height='h-full' justifyContent='center' alignItems='center'>
            <Container width='w-11/12 md:w-1/3' height='h-1/2' padding='md' bgColor='bg-white' className='rounded-xl' flexDirection='col' justifyContent='between'>
                <Text text='Login' size='xl' />
                <Input
                    label="Email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    endAdornment={
                        <Icon
                            className='relative z-50'
                            name={showPassword ? 'EyeOff' : 'Eye'}
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    }
                />
                <Button padding='sm' onClick={handleSubmit}>
                    {isSignup ? 'Create Account' : 'Login'}
                </Button>
            </Container>
        </Container>
    );
};

export default Auth;
