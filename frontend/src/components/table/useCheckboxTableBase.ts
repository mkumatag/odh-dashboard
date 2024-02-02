import * as React from 'react';
import { intersection, xor } from 'lodash';
import type Table from './Table';

type UseCheckboxTableBase<DataType> = {
  selections: DataType[];
  tableProps: Required<Pick<React.ComponentProps<typeof Table>, 'selectAll'>>;
  toggleSelection: (selection: DataType) => void;
  isSelected: (selection: DataType) => boolean;
  disableCheck: (item: DataType, enabled: boolean) => void;
};

const useCheckboxTableBase = <T>(
  data: T[],
  selectedData: T[],
  setSelectedData: React.Dispatch<React.SetStateAction<T[]>>,
  dataMappingHelper: (selectData: T) => string,
  selectAll?: { selected?: boolean; disabled?: boolean },
): UseCheckboxTableBase<T> => {
  const dataIds = React.useMemo(() => data.map(dataMappingHelper), [data, dataMappingHelper]);

  const [disabledData, setDisabledData] = React.useState<T[]>([]);

  const selectedDataIds = React.useMemo(
    () => selectedData.map(dataMappingHelper),
    [selectedData, dataMappingHelper],
  );

  // remove selected ids that are no longer present in the provided dataIds
  React.useEffect(() => {
    const newSelectedIds = intersection(selectedDataIds, dataIds);
    const newSelectedData = newSelectedIds
      .map((id) => data.find((d) => dataMappingHelper(d) === id))
      .filter((v): v is T => !!v);
    if (selectedData.length !== newSelectedData.length) {
      setSelectedData(newSelectedData);
    }
  }, [data, dataIds, dataMappingHelper, selectedData, selectedDataIds, setSelectedData]);

  const disableCheck = React.useCallback<UseCheckboxTableBase<T>['disableCheck']>(
    (item, disabled) =>
      setDisabledData((prevData) =>
        disabled
          ? prevData.some(
              (selectedData) => dataMappingHelper(selectedData) === dataMappingHelper(item),
            )
            ? prevData
            : [...prevData, item]
          : prevData.filter(
              (selectedData) => dataMappingHelper(selectedData) !== dataMappingHelper(item),
            ),
      ),
    [dataMappingHelper],
  );

  return React.useMemo(() => {
    // Header is selected if all selections and all ids are equal
    // This will allow for checking of the header to "reset" to provided ids during a trim/filter
    const checkable = data.filter(
      (data) => !disabledData.some((item) => dataMappingHelper(item) === dataMappingHelper(data)),
    );

    const headerSelected =
      selectedDataIds.length > 0 &&
      xor(selectedDataIds, checkable.map(dataMappingHelper)).length === 0;

    const allDisabled = selectedData.length === 0 && disabledData.length === data.length;

    return {
      selections: selectedData,
      tableProps: {
        selectAll: {
          disabled: allDisabled,
          tooltip: allDisabled ? 'No selectable rows' : undefined,
          onSelect: (value) => {
            setSelectedData(value ? checkable : []);
          },
          selected: headerSelected,
          ...selectAll,
        },
      },
      disableCheck,
      isSelected: (selection) => selectedDataIds.includes(dataMappingHelper(selection)),
      toggleSelection: (selection) => {
        const id = dataMappingHelper(selection);
        setSelectedData((prevData) =>
          prevData.map(dataMappingHelper).includes(id)
            ? prevData.filter((selectedData) => dataMappingHelper(selectedData) !== id)
            : [...prevData, selection],
        );
      },
    };
  }, [
    data,
    selectedDataIds,
    dataMappingHelper,
    selectedData,
    selectAll,
    disableCheck,
    disabledData,
    setSelectedData,
  ]);
};

export default useCheckboxTableBase;
