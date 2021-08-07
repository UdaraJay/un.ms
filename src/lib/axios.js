import Axios from 'axios';

export const fetcher = (url) => {
  return axios.get(url).then((res) => {
    if (res && res.data) {
      return res.data;
    }

    return;
  });
};

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

export default axios;
