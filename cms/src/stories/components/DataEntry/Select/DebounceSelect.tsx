import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<
    SelectProps<ValueType | ValueType[] | string>,
    "options" | "children"
  > {
  fetchOptions: (search: string, value?: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  maxItems?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  maxItems,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const value: any = props.value;
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (search: string, value?: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(search, value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    if (typeof value === "string") {
      return debounceFetcher("", value);
    }
    debounceFetcher("", value);
  }, [value, debounceFetcher]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={(search) => debounceFetcher(search, props.value as string)}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

export { DebounceSelect };
