interface JsonApiResource<T> {
  data: {
    type: string;
    attributes: T;
  };
}

export function formDataToJsonApi<T>(
  formData: FormData,
  resourceType: string
): JsonApiResource<T> {
  const jsonData: JsonApiResource<T> = {
    data: {
      type: resourceType,
      attributes: {} as T,
    },
  };

  for (const [name, value] of formData.entries()) {
    jsonData.data.attributes[name] = value as T[keyof T];
  }

  return jsonData;
}
