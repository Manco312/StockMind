export const notificationTypeMap: Record<
  string,
  { message: string; getUrl: (n: any) => string }
> = {
  order_created: {
    message: "Responder a nuevo pedido",
    getUrl: (n) => `/orders/${n.orderId}/process`,
  },
  order_received: {
    message: "Ver tiendas aliadas",
    getUrl: (n) => `/dashboard/tiendas`,
  },
  order_accepted: {
    message: "Confirmar llegada del pedido",
    getUrl: (n) => `/orders/${n.orderId}/process`,
  },
  order_rejected: {
    message: "Ver mis pedidos",
    getUrl: (n) => `/orders/manage`,
  },
};
