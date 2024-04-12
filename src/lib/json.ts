const b64_regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

function decodeBase64Strings(obj: any): any {
  // Base case: if obj is not an object or array, return obj
  if (typeof obj !== 'object' || obj === null || obj instanceof Date || obj instanceof RegExp) {
    if (typeof obj === 'string' && b64_regex.test(obj)) {
      try {
        // Try to decode the string from base64
        const decodedString = window.atob(obj);
        return decodedString;
      } catch (error) {
        // If decoding fails, return the original string
        return obj;
      }
    } else {
      return obj;
    }
  }

  // If obj is an array, recursively call decodeBase64Strings on each element
  if (Array.isArray(obj)) {
    return obj.map((element) => decodeBase64Strings(element));
  }

  // If obj is an object, recursively call decodeBase64Strings on each value
  const decodedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      decodedObj[key] = decodeBase64Strings(obj[key]);
    }
  }
  return decodedObj;
}

export function getBase64StringObjectPaths(obj: any): string[] {
  const paths: string[] = [];

  function traverse(obj: any, path: string) {
    if (typeof obj !== 'object' || obj === null || obj instanceof Date || obj instanceof RegExp) {
      if (typeof obj === 'string' && b64_regex.test(obj)) {
        paths.push(path);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((element, index) => traverse(element, `${path}[${index}]`));
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          traverse(obj[key], `${path ? `${path}.` : ''}${key}`);
        }
      }
    }
  }

  traverse(obj, '');
  return paths;
}

export function hasBase64Strings(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || obj instanceof Date || obj instanceof RegExp) {
    return typeof obj === 'string' && b64_regex.test(obj);
  }

  if (Array.isArray(obj)) {
    return obj.some((element) => hasBase64Strings(element));
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBase64Strings(obj[key])) {
      return true;
    }
  }

  return false;
}

export function formatJSONString(jsonString: string, decode?: boolean) {
  let returnValue = jsonString;

  try {
    const parsed = JSON.parse(jsonString);
    returnValue = JSON.stringify(decode ? decodeBase64Strings(parsed) : parsed, null, 2);
  } catch {}

  return returnValue;
}
