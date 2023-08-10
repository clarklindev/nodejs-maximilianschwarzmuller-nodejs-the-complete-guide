import DateHelper from './DateHelper';

//takes in object
export const jsonApiSuccessResponseFromMongooseQuery = (object: Record<string, any>) => {
  const { _id, createdAt, updatedAt, ...attributes } = object;

  const attributeData: Record<string, any> = {
    ...attributes._doc,
  };

  // Include createdAt and updatedAt only if they exist on the object
  if (createdAt in object) {
    attributeData.timestamps = {
      created: DateHelper.unixEpochToUTCDate(createdAt),
    };
  }
  if (updatedAt in object) {
    attributeData.timestamps = {
      ...attributeData.timestamps,
      modified: DateHelper.unixEpochToUTCDate(updatedAt),
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
