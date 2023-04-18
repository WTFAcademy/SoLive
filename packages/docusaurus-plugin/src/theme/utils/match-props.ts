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
  const dynamicRex = /(?<key>[^=\s]+)=(?:"(?<value1>[^"]*)"|'(?<value2>[^']*)'|(?<value3>[^\s]*))/g;
  const props: TResultProps = {};
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = dynamicRex.exec(metaString)) !== null) {
    const { groups } = match;
    if (groups) {
      const key = groups.key.trim();
      const value = groups.value1 || groups.value2 || groups.value3;
      if (propsInfo[key]) {
        props[key] = value;
      }
    }
  }

  Object.keys(propsInfo).forEach((key) => {
    if (props[key] === undefined) {
      props[key] = propsInfo[key].default;
    }
  });

  return props;
};
