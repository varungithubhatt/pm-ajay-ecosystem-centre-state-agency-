import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import schemeReducer from '../features/scheme/schemeSlice';
import fundReducer from '../features/fund/fundSlice';

import reportReducer from '../features/report/reportSlice';
import villageReducer from '../features/village/villageSlice';
// import villagefundReducer from '../features/villagefunds/villagefundSlice';
// import fundReducer from '../features/fundvillage/fundSlice';
import fundvillageReducer from '../features/fundvillage/fundvillageSlice';









export const store = configureStore({
  reducer: {
    auth: authReducer,
    scheme: schemeReducer,
    fund: fundReducer,
    report: reportReducer,
    village: villageReducer,
    // villagefund: villagefundReducer,
    // fundvillage: fundReducer,
      fundvillage: fundvillageReducer,
   
  },
});
