import jsPDF from "jspdf";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  doc.text("WebXShop Invoice", 20, 20);
  doc.text(`Order ID: ${order._id}`, 20, 30);
  doc.text(`Total: ₹${order.totalPrice}`, 20, 40);
  doc.text(`Status: ${order.status}`, 20, 50);

  let y = 70;
  doc.text("Items:", 20, 60);

  order.orderItems.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} × ${item.qty} = ₹${item.price * item.qty}`,
      20,
      y,
    );
    y += 10;
  });

  doc.save(`invoice_${order._id}.pdf`);
};
