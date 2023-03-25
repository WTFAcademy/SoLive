interface TProps {
  label: string;
}

const FormItemLabel = ({ label }: TProps) => {
  return (
    <div className="flex gap-[10px] items-center mb-3">
      <div className="border-l-2 border-lime-600 h-4" />
      <label className="text-lg">{label}</label>
    </div>
  );
};

export default FormItemLabel;
