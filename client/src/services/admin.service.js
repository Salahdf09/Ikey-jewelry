import api from './api';

export async function adminLogin(email, password) {
  const { data } = await api.post('/admin/login', { email, password });
  return data.data;
}

export async function adminLogout() {
  await api.post('/admin/logout');
}

export async function adminMe() {
  const { data } = await api.get('/admin/me');
  return data.data;
}

export async function adminFetchStats() {
  const { data } = await api.get('/admin/dashboard/stats');
  return data.data;
}

export async function adminFetchProducts(params = {}) {
  const { data } = await api.get('/admin/products', { params });
  return data.data;
}

export async function adminFetchProduct(id) {
  const { data } = await api.get(`/admin/products/${id}`);
  return data.data;
}

export async function adminCreateProduct(payload) {
  const { data } = await api.post('/admin/products', payload);
  return data.data;
}

export async function adminUpdateProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data.data;
}

export async function adminDeleteProduct(id) {
  await api.delete(`/admin/products/${id}`);
}

export async function adminFetchOrders(params = {}) {
  const { data } = await api.get('/admin/orders', { params });
  return data.data;
}

export async function adminFetchOrder(id) {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.data;
}

export async function adminUpdateOrderStatus(id, status) {
  const { data } = await api.patch(`/admin/orders/${id}/status`, { status });
  return data.data;
}

export async function adminUploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
