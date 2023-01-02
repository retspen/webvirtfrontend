import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import type { Keypair, KeypairPayload } from '@/api/keypairs';
import { updateKeypair } from '@/api/keypairs';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';

type Props = {
  isOpen: boolean;
  keypair: Keypair | undefined;
  onToggle: (state: boolean) => void;
  onUpdate: (keypair: Keypair) => void;
};

const EditKeypairDialog = ({ isOpen, keypair, onToggle, onUpdate }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<KeypairPayload>();

  useEffect(() => {
    if (keypair) {
      reset(keypair);
    }
  }, [keypair]);

  const onSubmit = async (data: KeypairPayload) => {
    try {
      const keypair = await updateKeypair(data).then((response) => response.keypair);
      onUpdate(keypair);
      onToggle(false);
    } catch (error) {}
  };

  return (
    <Dialog title="Edit Keypair" isOpen={isOpen} onClose={() => onToggle(false)}>
      <form onSubmit={handleSubmit(onSubmit)} css={tw`space-y-4`}>
        <div>
          <Input
            id="name"
            {...register('name', { required: 'Name of Keypair is required.' })}
            label="Name"
            placeholder="My access key"
          />
          {errors.name && (
            <p css={tw`text-red-500`} role="alert">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <Textarea
            id="public_key"
            rows={10}
            spellCheck={false}
            {...register('public_key', { required: 'Public key is required.' })}
            label="Public key"
            placeholder="Your public key"
          ></Textarea>
          {errors.public_key && (
            <p css={tw`text-red-500`} role="alert">
              {errors.public_key?.message}
            </p>
          )}
        </div>
        <Button
          variant="primary"
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Dialog>
  );
};

export default EditKeypairDialog;
