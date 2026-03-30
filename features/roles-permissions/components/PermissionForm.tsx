'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Action, CreatePermissionSchema, CreatePermissionRequest } from '../types/roles-permissions.types';
import { useCreatePermission } from '../hooks/use-roles-permissions';

interface PermissionFormProps {
  onSuccess?: () => void;
}

export function PermissionForm({ onSuccess }: PermissionFormProps) {
  const { mutate: createPermissions, isPending } = useCreatePermission();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionRequest>({
    resolver: zodResolver(CreatePermissionSchema),
    defaultValues: {
      resource: '',
      actions: [],
      description: '',
    },
  });

  const onSubmit = (data: CreatePermissionRequest) => {
    createPermissions(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  const actionList = Object.values(Action);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resource-name">Ressource (nom de la table, sera mis en minuscule)</Label>
        <Input
          id="resource-name"
          placeholder="Ex: patients, hospital_staffs..."
          {...register('resource')}
          className={errors.resource ? 'border-red-500' : ''}
        />
        {errors.resource && <p className="text-sm text-red-500">{errors.resource.message}</p>}
      </div>

      <div className="space-y-3">
        <Label>Actions</Label>
        <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/30">
          {actionList.map((action) => (
            <div key={action} className="flex items-center space-x-2">
              <Controller
                name="actions"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`action-${action}`}
                    checked={field.value.includes(action)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, action]
                        : field.value.filter((val) => val !== action);
                      field.onChange(newValue);
                    }}
                  />
                )}
              />
              <Label htmlFor={`action-${action}`} className="text-sm font-normal cursor-pointer capitalize">
                {action.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
        {errors.actions && <p className="text-sm text-red-500">{errors.actions.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="permission-description">Description (Optionnel)</Label>
        <Textarea
          id="permission-description"
          placeholder="Description des permissions..."
          {...register('description')}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Création...' : 'Créer les permissions'}
      </Button>
    </form>
  );
}
