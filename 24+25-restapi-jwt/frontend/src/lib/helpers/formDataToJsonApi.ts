interface JsonApiResource {
  data: {
    type: string;
    attributes: Record<string, any>;
  };
}

export function formDataToJsonApi(formData: FormData, resourceType: string) {
  //convert formData
  const transformedData = [...formData.entries()].map((entry) => {
    const [key, value] = entry;
    return { key, value };
  });

  const jsonData: JsonApiResource = {
    data: {
      type: resourceType,
      attributes: transformedData,
    },
  };

  return jsonData;
}
