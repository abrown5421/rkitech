import { seedDatabase } from '../base/base.seed';
import { Elements } from './elements.model';
import { IElements } from './elements.types';

const defaultElements = [
  {
    _seedKey: '404-heading',
    name: '404-heading',
    component: "typography",
    props: { variant: "h1", color: "#FE9A00" },
    childText: "404",
  },
  {
    _seedKey: '404-text',
    name: '404-text',
    component: "typography",
    props: { variant: "h6", color: "#1A1D27" },
    childText: "Not all who wander are lost but you sure are.",
  },
  {
    _seedKey: '404-root',
    name: '404-root',
    component: "box",
    props: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    _relationFields: {
      children: ['404-heading', '404-text'] 
    }
  }
];

export default async () => {
  await seedDatabase<IElements>({
    modelName: 'elements',
    model: Elements,
    data: [], 
    dataWithKeys: defaultElements,
    uniqueField: 'name', 
    displayField: 'name', 
  });
};

if (require.main === module) {
  (async () => {
    const { disconnectDatabase } = await import('../base/base.seed');
    await seedDatabase<IElements>({
      modelName: 'elements',
      model: Elements,
      data: [], 
      dataWithKeys: defaultElements,
      uniqueField: 'name', 
      displayField: 'name', 
    });
    await disconnectDatabase();
  })();
}