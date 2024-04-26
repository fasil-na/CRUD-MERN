import axios from 'axios';
import { bookAPI } from '../Constants/API';
const bookInstance = axios.create({
    baseURL: bookAPI,
});
export default bookInstance;