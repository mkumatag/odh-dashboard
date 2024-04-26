import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { useGetExecutionsList } from '~/concepts/pipelines/apiHooks/mlmd/useGetExecutionsList';
import ExecutionsTable from '~/pages/pipelines/global/experiments/executions/ExecutionsTable';
import { useMlmdListContext } from '~/concepts/pipelines/context';

const ExecutionsList: React.FC = () => {
  const { filterQuery } = useMlmdListContext();
  const [executionsResponse, isExecutionsLoaded, executionsError] = useGetExecutionsList();
  const { executions, nextPageToken } = executionsResponse || { executions: [] };
  const filterQueryRef = React.useRef(filterQuery);

  if (executionsError) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateHeader
            titleText="There was an issue loading executions"
            icon={<EmptyStateIcon icon={ExclamationCircleIcon} />}
            headingLevel="h2"
          />
          <EmptyStateBody>{executionsError.message}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  if (!isExecutionsLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!executions.length && !filterQuery && filterQueryRef.current === filterQuery) {
    return (
      <EmptyState data-testid="global-no-executions">
        <EmptyStateHeader
          titleText="No executions"
          icon={<EmptyStateIcon icon={PlusCircleIcon} />}
          headingLevel="h4"
        />
        <EmptyStateBody>
          No experiments have been executed within this project. Select a different project, or
          execute an experiment from the <b>Experiments and runs</b> page.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <ExecutionsTable
      executions={executions}
      nextPageToken={nextPageToken}
      isLoaded={isExecutionsLoaded}
    />
  );
};
export default ExecutionsList;
