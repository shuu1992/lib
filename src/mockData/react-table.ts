import { sub } from 'date-fns';
import { Chance } from 'chance';
import lodash from 'lodash';
const chance = new Chance();
const newPerson = (index: number) => {
  const tempData = mockData(index);
  const statusCode = tempData.number.status(0, 2);
  let status: string;
  switch (statusCode) {
    case 2:
      status = 'Complicated';
      break;
    case 1:
      status = 'Relationship';
      break;
    case 0:
    default:
      status = 'Single';
      break;
  }

  const orderStatusCode = tempData.number.status(0, 7);
  let orderStatus: string;
  switch (orderStatusCode) {
    case 7:
      orderStatus = 'Refunded';
      break;
    case 6:
      orderStatus = 'Completed';
      break;
    case 5:
      orderStatus = 'Delivered';
      break;
    case 4:
      orderStatus = 'Dispatched';
      break;
    case 3:
      orderStatus = 'Cancelled';
      break;
    case 2:
      orderStatus = 'Shipped';
      break;
    case 1:
      orderStatus = 'Processing';
      break;
    case 0:
    default:
      orderStatus = 'Pending';
      break;
  }

  return {
    id: index,
    firstName: tempData.name.first,
    lastName: tempData.name.last,
    email: tempData.email,
    age: tempData.number.age,
    role: tempData.role,
    visits: tempData.number.amount,
    progress: tempData.number.percentage,
    status,
    orderStatus,
    contact: tempData.contact,
    country: tempData.address.country,
    address: tempData.address.full,
    fatherName: tempData.name.full,
    about: tempData.text.sentence,
    avatar: tempData.number.status(1, 10),
    skills: tempData.skill,
    time: tempData.time,
  };
};
export const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

const skills = [
  'UI Design',
  'Mobile App',
  'Web App',
  'UX',
  'Wireframing',
  'Prototyping',
  'Backend',
  'React',
  'Angular',
  'Javascript',
  'HTML',
  'ES6',
  'Figma',
  'Codeigniter',
];

const time = [
  'just now',
  '1 day ago',
  '2 min ago',
  '2 days ago',
  '1 week ago',
  '1 year ago',
  '5 months ago',
  '3 hours ago',
  '1 hour ago',
];

function mockData(index: number) {
  return {
    id: (index: number) => `${chance.bb_pin()}${index}`,
    email: chance.email({ domain: 'gmail.com' }),
    contact: chance.phone(),
    datetime: sub(new Date(), {
      days: chance.integer({ min: 0, max: 30 }),
      hours: chance.integer({ min: 0, max: 23 }),
      minutes: chance.integer({ min: 0, max: 59 }),
    }),
    boolean: chance.bool(),
    role: chance.profession(),
    company: chance.company(),
    address: {
      full: `${chance.address()}, ${chance.city()}, ${chance.country({
        full: true,
      })} - ${chance.zip()}`,
      country: chance.country({ full: true }),
    },
    name: {
      first: chance.first(),
      last: chance.last(),
      full: chance.name(),
    },
    text: {
      title: chance.sentence({ words: chance.integer({ min: 4, max: 12 }) }),
      sentence: chance.sentence(),
      description: chance.paragraph,
    },
    number: {
      percentage: chance.integer({ min: 0, max: 100 }),
      rating: chance.floating({ min: 0, max: 5, fixed: 2 }),
      status: (min: number, max: number) => chance.integer({ min, max }),
      age: chance.age(),
      amount: chance.integer({ min: 1, max: 10000 }),
    },
    image: {
      product: (index: number) => `product_${index}`,
      avatar: (index: number) => `avatar_${index}`,
    },
    skill: lodash.sampleSize(skills, chance.integer({ min: 2, max: 6 })),
    time: lodash.sampleSize(time),
  };
}

export default function makeData(...lens: any[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d: any, index: number) => ({
      ...newPerson(index + 1),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}
