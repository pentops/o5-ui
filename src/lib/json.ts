export function formatJSONString(jsonString: string) {
  let returnValue = jsonString;

  try {
    returnValue = JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {}

  return returnValue;
}
