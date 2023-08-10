interface JsonApiResource {
  data: {
    type: string;
    attributes: Record<string, any>;
  };
}

export function formDataToJsonApi(formData: FormData, resourceType: string) {
  const jsonData: JsonApiResource = {
    data: {
      type: resourceType,
      attributes: {},
    },
  };

  for (const [name, value] of formData.entries()) {
    jsonData.data.attributes[name] = value;
  }

  return jsonData;
}
