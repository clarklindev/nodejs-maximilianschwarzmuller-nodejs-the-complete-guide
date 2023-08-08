import DateHelper from './DateHelper';

export const makeJsonapiDataResponse = (object: any) => {
  const { _id, createdAt, updatedAt, ...attributes } = object;

  const attributeData: Record<string, any> = {
    ...attributes._doc,
  };

  // Include createdAt and updatedAt only if they exist on the object
  if (createdAt in object) {
    attributeData.timestamps = {
      created: DateHelper.unixEpochToRFC3339_ISO8601(createdAt),
    };
  }
  if (updatedAt in object) {
    attributeData.timestamps = {
      ...attributeData.timestamps,
      modified: DateHelper.unixEpochToRFC3339_ISO8601(updatedAt),
    };
  }

  return {
    id: _id.toString(),
    type: typeof object,
    attributes: {
      ...attributeData,
    },
  };
};
