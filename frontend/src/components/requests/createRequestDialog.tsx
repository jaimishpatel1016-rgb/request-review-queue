"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { REQUEST_PRIORITY_VALUES } from "@/enums/enums";
import { OWNERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const createRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  submitter: z.string().min(1, "Submitter is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().min(1, "Due date is required"),
  owner: z.string().optional(),
});

type CreateRequestForm = z.infer<typeof createRequestSchema>;

export default function CreateRequestDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateRequestForm>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: "",
      submitter: "",
      priority: "MEDIUM",
      dueDate: "",
      owner: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRequestForm) =>
      apiClient.post("/requests", {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
        owner: data.owner || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      reset();
      setOpen(false);
      toast.success("Request created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateRequestForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>New Request</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" {...register("title")} />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="submitter">Submitter</FieldLabel>
            <Input id="submitter" {...register("submitter")} />
            {errors.submitter && (
              <FieldError>{errors.submitter.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Priority</FieldLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_PRIORITY_VALUES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <FieldError>{errors.priority.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Owner</FieldLabel>
            <Controller
              control={control}
              name="owner"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {OWNERS.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
            <Input id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <FieldError>{errors.dueDate.message}</FieldError>
            )}
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
