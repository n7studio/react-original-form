import { useEffect } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";

export default function useOnWatchForm<T extends FieldValues = FieldValues>(
  watch: UseFormWatch<FieldValues>,
  onChange: (values: any[] | T) => void,
  fields?: string[],
) {
  const values = fields ? watch(fields) : watch();
  useEffect(() => {
    values && onChange(values as any[] | T);
  }, [values]);
}
