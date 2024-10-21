import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/';

const getCv = () => {
  return axios.get(API_URL + 'cv', { headers: authHeader() });
};

const saveCv = (content) => {
  return axios.post(API_URL + 'cv', { content }, { headers: authHeader() });
};

const CvService = {
  getCv,
  saveCv,
};

export default CvService;