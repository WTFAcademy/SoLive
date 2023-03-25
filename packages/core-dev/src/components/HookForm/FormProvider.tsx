import { ReactNode } from "react";
// form
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

// ----------------------------------------------------------------------

interface Props {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
}

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <Form {...methods}>
      <form className="w-full" onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
}
