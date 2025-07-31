import { faker } from '@faker-js/faker';
// import { BsThreeDotsVertical } from 'react-icons/bs';

// const ActivityIcon = () => <BsThreeDotsVertical />;

export type Data = {
  retentionPolicyName: string;
  retentionPolicyType: string;
  retentionPolicyStatus: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
  // activity: JSX.Element;
  subRows?: Data[];
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};



const newData = (): Data => {
  return {
    retentionPolicyName: faker.person.firstName(),
    retentionPolicyType: faker.person.lastName(),
    retentionPolicyStatus: faker.helpers.shuffle<Data['retentionPolicyStatus']>([
      'Active',
      'Inactive',
    ])[0]!,
    createdBy: faker.person.firstName(),
    createdDate: faker.date.recent().toISOString(),
    // activity: <ActivityIcon />,
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Data[] => {
    const len = lens[depth]!;
    return range(len).map((d): Data => {
      return {
        ...newData(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}