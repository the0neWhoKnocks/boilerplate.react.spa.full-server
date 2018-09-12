import { TERMS } from 'CONSTANTS/routePaths';
import { DefaultView } from './shared/composedChunks';

export default {
  label: 'Terms of Service',
  url: TERMS,
  view: DefaultView,
  viewProps: {
    title: 'Terms of Service',
    data: [
      'Just some legal mumbo jumbo',
    ],
  },
};
