type TPropType = 'string' | 'boolean' | 'number' | 'object' | 'array' | any;

type TPropsInfo = {
  [key: string]: {
    type: TPropType;
    default: any;
  }
}

type TResultProps = {
  [key: string]: any;
}

export const coerceValue = (value: string, type: TPropType) => {
  switch (type) {
    case 'string':
      return value;
    case 'boolean':
      return value === 'true';
    case 'number':
      return Number(value);
    case 'object':
      return JSON.parse(value);
    case 'array':
      return JSON.parse(value);
    default:
      return value;
  }
};

export const matchProps = (metaString: string, propsInfo: TPropsInfo): TResultProps => {
  const dynamicRex = /(?<key>[^=]+)="(?<value>[^"]*)"/g;
  const props: any = {};
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = dynamicRex.exec(metaString)) !== null) {
    const { key, value } = match.groups as any;
    const keyName = key.trim();
    if (propsInfo[keyName]) {
      props[keyName] = coerceValue(value, propsInfo[keyName].type);
    }
  }

  Object.keys(propsInfo).forEach((key) => {
    if (props[key] === undefined) {
      props[key] = propsInfo[key].default;
    }
  });

  return props;
};
