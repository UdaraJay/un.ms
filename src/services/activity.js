import api, { fetcher } from '@/lib/axios';
import useSWR, { mutate } from 'swr';

export const list = (page) => {
  const { data: activity = { data: [] }, error } = useSWR(
    `/api/activity/list?page=${page}`,
    fetcher
  );

  return activity;
};

export const create = async (data) => {
  const { data: result } = await api.post('/api/activity/create', {
    data: data,
  });

  await mutate('/api/activity/list?page=1');

  return result;
};

export const deleteActivity = (id) => {
  return api.post(`/api/activity/${id}/highlight/delete`);
};

export const toggleHighlight = (id) => {
  return api.post(`/api/activity/${id}/highlight/toggle`);
};
