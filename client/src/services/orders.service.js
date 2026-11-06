import api from './api';

export async function submitOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data.data;
}

export async function fetchOrderByNumber(orderNumber) {
  const { data } = await api.get(`/orders/${orderNumber}`);
  return data.data;
}

export async function fetchDeliveryFees() {
  const { data } = await api.get('/delivery-fees');
  return data.data;
}
