import { seedDatabase } from '../base/base.seed';
import { Elements } from './elements.model';
import { IElements } from './elements.types';

const defaultElementss = [
  {
    type: "typography",
    data: {
      text: "Hello World",
      variant: "h1",
    },
    styles: {
      color: "#1976d2",
      marginBottom: "16px",
    },
    className: "welcome-text",
    props: {
      align: "center",
      gutterBottom: true,
    },
    order: 0,
  }
];

seedDatabase<IElements>({
  modelName: 'elements',
  model: Elements,
  data: defaultElementss,
  uniqueField: 'type',
  displayField: 'type',
});