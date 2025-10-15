import {Router} from 'express';
import { allocateFunds, getFundAllocations, updateFundUtilization, getStateWiseAllocations, getSchemeWiseAllocations, getVillageAllocations } from '../controllers/funds.controller.js';
import { verifyToken } from '../middleware/verifytoken.middleware.js';
const router=Router();

router.post('/allocate',verifyToken, allocateFunds);
router.get('/allocations', verifyToken, getFundAllocations);
router.put('/utilization/:id', verifyToken, updateFundUtilization);
router.get('/state-wise', verifyToken, getStateWiseAllocations);
router.get('/scheme-wise', verifyToken, getSchemeWiseAllocations);
// Get allocations by village
router.get('/village/:villageID', verifyToken, getVillageAllocations);


export default router;
