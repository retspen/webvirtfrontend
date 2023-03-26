import { resetPassword } from '@/entities/auth';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from 'ui/components/button';
import { Error } from 'ui/components/error';
import { Input } from 'ui/components/input';

interface IFormInputs {
  password: string;
}

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IFormInputs>();

  function onSubmit(data: IFormInputs) {
    try {
      resetPassword(data);
    } catch (error) {}
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            id="new_password"
            type="password"
            placeholder="Enter new secure password"
            {...register('password', {
              minLength: {
                value: 6,
                message: 'Password should be at least 6 characters.',
              },
              required: 'Password is required.',
            })}
            error={!!errors.password}
          />
          {errors.password && <Error className="mt-1">{errors.password.message}</Error>}
        </div>
        <Button className="w-full" disabled={isSubmitting}>
          Change password
        </Button>
      </form>
      <p className="mt-4 text-center text-neutral-500">
        Or try to{' '}
        <Link className="font-medium text-sky-500" to="/sign-in">
          Sign in
        </Link>{' '}
        again
      </p>
    </>
  );
}
