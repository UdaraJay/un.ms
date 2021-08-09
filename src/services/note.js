import api, { fetcher } from '@/lib/axios';
import useSWR, { mutate } from 'swr';

export const list = (page) => {
  const { data: notes, error } = useSWR(`/api/note/list?page=${page}`, fetcher);

  return notes;
};

export const create = async (data) => {
  const { data: slug } = await api.post('/api/note/create', {
    data: data,
  });

  mutate(`/api/note/${slug}`);

  return slug;
};

export const getNote = (slug) => {
  const { data: note, error } = useSWR(
    slug ? `/api/note/${slug}` : null,
    fetcher
  );

  return note;
};

export const updateNote = async (slug, data) => {
  const { data: note } = await api.post(`/api/note/${slug}`, data);

  return note;
};

export const deleteNote = (id) => {
  return api.post(`/api/note/${id}`);
};

export const togglePublic = (slug) => {
  return api.post(`/api/note/${slug}/public/toggle`);
};
