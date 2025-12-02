import { seedDatabase } from '../base/base.seed';
import { Elements } from './elements.model';
import { IElements } from './elements.types';

const defaultElements: Partial<IElements>[] = [
  {
    component: "typography",
    props: { variant: "h4" },
    childText: "Hello world!",
  }
];

seedDatabase<IElements>({
  modelName: 'elements',
  model: Elements,
  data: defaultElements,
  uniqueField: 'component', 
  displayField: 'component', 
});
