import axios from 'axios';

const API_BASE_URL = 'http://localhost/your-api-endpoint'; // Change this to your actual PHP API endpoint

export const fetchEquation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-equation.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equation:', error);
    throw error;
  }
};