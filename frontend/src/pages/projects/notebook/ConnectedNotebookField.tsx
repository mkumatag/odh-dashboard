import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core/deprecated';
import { NotebookKind } from '~/k8sTypes';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';

type SelectNotebookFieldProps = {
  loaded: boolean;
  notebooks: NotebookKind[];
  isDisabled?: boolean;
  selectionHelperText?: string;
  placeholder?: string;
  /* Selections will be considered always an array -- but will only be of 1 item when you don't set isMultiSelect */
  selections: string[];
  onSelect: (selection: string[]) => void;
  isMultiSelect?: boolean;
};

const ConnectedNotebookField: React.FC<SelectNotebookFieldProps> = ({
  loaded,
  notebooks,
  selections,
  onSelect,
  isDisabled,
  selectionHelperText,
  isMultiSelect,
  placeholder = 'Select a workbench to connect',
}) => {
  const [notebookSelectOpen, setNotebookSelectOpen] = React.useState(false);

  const noNotebooks = notebooks.length === 0;
  const disabled = !!isDisabled || !loaded || noNotebooks;

  let placeholderText: string;
  if (!loaded) {
    placeholderText = 'Fetching workbenches...';
  } else if (noNotebooks) {
    placeholderText = 'No available workbenches';
  } else {
    placeholderText = placeholder;
  }

  return (
    <FormGroup
      label="Connected workbench"
      fieldId="connect-existing-workbench"
      data-testid="connect-existing-workbench-group"
    >
      <Select
        variant={isMultiSelect ? 'typeaheadmulti' : 'typeahead'}
        selections={selections}
        isOpen={notebookSelectOpen}
        isDisabled={disabled}
        aria-label="Notebook select"
        onClear={() => {
          onSelect([]);
          setNotebookSelectOpen(false);
        }}
        onSelect={(e, selection) => {
          if (typeof selection !== 'string') {
            return;
          }

          if (selections.includes(selection)) {
            onSelect(selections.filter((f) => f !== selection));
          } else if (isMultiSelect) {
            onSelect([...selections, selection]);
          } else {
            onSelect([selection]);
          }
          setNotebookSelectOpen(false);
        }}
        onToggle={(e, isOpen) => setNotebookSelectOpen(isOpen)}
        placeholderText={placeholderText}
        menuAppendTo="parent"
      >
        {notebooks.map((notebook) => (
          <SelectOption key={notebook.metadata.name} value={notebook.metadata.name}>
            {getDisplayNameFromK8sResource(notebook)}
          </SelectOption>
        ))}
      </Select>
      <FormHelperText>
        <HelperText>
          <HelperTextItem>{!noNotebooks && selectionHelperText}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default ConnectedNotebookField;
