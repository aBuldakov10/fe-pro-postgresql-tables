import {
  dropTables,
  createItems,
  initConnection,
  createStructure,
} from './index';

(async () => {
  console.log('start');
  await createStructure();
  await createItems();
  await dropTables();
  console.log('end');
})();
