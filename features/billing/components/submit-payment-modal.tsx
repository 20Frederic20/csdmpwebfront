"use client";

import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom-select";
import { useSubmitPayment } from "../hooks/use-billing";
import { PaymentMethod } from "../types/billing.types";
import { Send } from "lucide-react";

const formSchema = z.object({
  payment_method: z.nativeEnum(PaymentMethod, {
    message: "Veuillez sélectionner un moyen de paiement",
  }),
  receipt_number: z.string().optional(),
}).refine((data) => {
  if (data.payment_method !== PaymentMethod.CASH && !data.receipt_number) {
    return false;
  }
  return true;
}, {
  message: "Le numéro de reçu est obligatoire pour ce moyen de paiement",
  path: ["receipt_number"],
});

type FormValues = z.infer<typeof formSchema>;

interface SubmitPaymentModalProps {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitPaymentModal({ invoiceId, isOpen, onClose }: SubmitPaymentModalProps) {
  const submitPayment = useSubmitPayment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: undefined,
      receipt_number: "",
    },
  });

  const paymentMethod = watch("payment_method");
  const isReceiptRequired = paymentMethod && paymentMethod !== PaymentMethod.CASH;

  const onSubmit = async (values: FormValues) => {
    try {
      await submitPayment.mutateAsync({
        id: invoiceId,
        payload: {
          payment_method: values.payment_method,
          receipt_number: values.receipt_number || undefined,
        },
      });
      onClose();
      reset();
    } catch (error) {
      // Error handled by the hook toast
    }
  };

  const paymentOptions = [
    { value: PaymentMethod.CASH, label: "Espèces (CASH)" },
    { value: PaymentMethod.MOMO, label: "Mobile Money (MOMO)" },
    { value: PaymentMethod.CARD, label: "Carte Bancaire (CARD)" },
    { value: PaymentMethod.INSURANCE, label: "Assurance (INSURANCE)" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Soumettre un paiement" size="md">
      <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
        <p className="text-xs text-blue-600">
          Votre paiement sera soumis et devra être confirmé par le personnel de l'établissement.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="payment_method">Moyen de paiement <span className="text-red-500">*</span></Label>
          <Controller
            control={control}
            name="payment_method"
            render={({ field }) => (
              <CustomSelect
                options={paymentOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner un moyen"
                isDisabled={submitPayment.isPending}
                className="w-full"
              />
            )}
          />
          {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="receipt_number">
            Numéro de reçu {isReceiptRequired && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="receipt_number"
            {...register("receipt_number")}
            placeholder={isReceiptRequired ? "N° de reçu (obligatoire)" : "N° de reçu (optionnel)"}
            disabled={submitPayment.isPending}
            className={errors.receipt_number ? "border-red-500" : ""}
          />
          {errors.receipt_number && <p className="text-sm text-red-500">{errors.receipt_number.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitPayment.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={submitPayment.isPending}>
            {submitPayment.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Soumettre le paiement
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
