import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/recipes';


export const fetchRecipes = async (params) => {

  const hasFilters = Object.values(params.filters || {}).some(v => v);

  try {
    if (hasFilters) {

      const response = await axios.get(`${API_BASE_URL}/search`, { params: params.filters });

      return { data: response.data.data, total: response.data.data.length };
    } else {

      const response = await axios.get(API_BASE_URL, {
        params: {
          page: params.pagination.current,
          limit: params.pagination.pageSize,
        },
      });
      return { data: response.data.data, total: response.data.total };
    }
  } catch (error) {
    console.error("Failed to fetch recipes:", error);

    return { data: [], total: 0 };
  }
};