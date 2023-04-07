interface TProps {
  label: string;
}

const FormItemLabel = ({label}: TProps) => {
  return (
    <label className="text-primary-100 text-[14px]">{label}</label>
  );
};

export default FormItemLabel;
