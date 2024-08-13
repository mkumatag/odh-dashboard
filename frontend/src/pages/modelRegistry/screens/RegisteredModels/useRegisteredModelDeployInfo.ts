import React from 'react';
import useModelArtifactsByVersionId from '~/concepts/modelRegistry/apiHooks/useModelArtifactsByVersionId';
import useRegisteredModelById from '~/concepts/modelRegistry/apiHooks/useRegisteredModelById';
import { ModelVersion } from '~/concepts/modelRegistry/types';

export type RegisteredModelDeployInfo = {
  modelName: string;
  modelFormat?: string;
  modelArtifactUri?: string;
  modelArtifactStorageKey?: string;
};

const useRegisteredModelDeployInfo = (
  modelVersion: ModelVersion,
): {
  registeredModelDeployInfo: RegisteredModelDeployInfo;
  loaded: boolean;
  error: Error | undefined;
} => {
  const [registeredModel, registeredModelLoaded, registeredModelError] = useRegisteredModelById(
    modelVersion.registeredModelId,
  );
  const [modelArtifactList, modelArtifactListLoaded, modelArtifactListError] =
    useModelArtifactsByVersionId(modelVersion.id);

  const registeredModelDeployInfo = React.useMemo(() => {
    const dateString = new Date().toISOString();
    const modelName = `${registeredModel?.name} - ${modelVersion.name} - ${dateString}`;
    if (modelArtifactList.size === 0) {
      return {
        registeredModelDeployInfo: {
          modelName,
        },
        loaded: registeredModelLoaded && modelArtifactListLoaded,
        error: registeredModelError || modelArtifactListError,
      };
    }
    const modelArtifact = modelArtifactList.items[0];
    return {
      registeredModelDeployInfo: {
        modelName,
        modelFormat: modelArtifact.modelFormatName
          ? `${modelArtifact.modelFormatName} - ${modelArtifact.modelFormatVersion}`
          : undefined,
        modelArtifactUri: modelArtifact.uri,
        modelArtifactStorageKey: modelArtifact.storageKey,
      },
      loaded: registeredModelLoaded && modelArtifactListLoaded,
      error: registeredModelError || modelArtifactListError,
    };
  }, [
    modelArtifactList.items,
    modelArtifactList.size,
    modelArtifactListError,
    modelArtifactListLoaded,
    modelVersion.name,
    registeredModel?.name,
    registeredModelError,
    registeredModelLoaded,
  ]);

  return registeredModelDeployInfo;
};

export default useRegisteredModelDeployInfo;
