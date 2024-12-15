import {Router} from 'express';
import { fetchUsers } from '../controller/user.controller';

const router = Router();

router.get('/',fetchUsers)
export default router

