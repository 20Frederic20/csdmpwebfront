'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateRoleSchema, CreateRoleRequest } from '../types/roles-permissions.types';
import { useCreateRole } from '../hooks/use-roles-permissions';

interface RoleFormProps {
  onSuccess?: () => void;
}

export function RoleForm({ onSuccess }: RoleFormProps) {
  const { mutate: createRole, isPending } = useCreateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleRequest>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: CreateRoleRequest) => {
    createRole(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-name">Nom du rôle (sera mis en majuscules)</Label>
        <Input
          id="role-name"
          placeholder="Ex: ADMINISTRATEUR, DOCTEUR..."
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-description">Description</Label>
        <Textarea
          id="role-description"
          placeholder="Description du rôle..."
          {...register('description')}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Création...' : 'Créer le rôle'}
      </Button>
    </form>
  );
}
