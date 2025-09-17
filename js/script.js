// Simple client-side cart + form integration
const cart = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product').forEach(prod => {
    prod.querySelector('.add-to-cart').addEventListener('click', () => {
      const name = prod.dataset.name;
      const sel = prod.querySelector('.size-select');
      const selectedOpt = sel.options[sel.selectedIndex];
      const size = selectedOpt.dataset.size || selectedOpt.text;
      const price = parseFloat(selectedOpt.dataset.price);
      const qty = parseInt(prod.querySelector('.qty').value) || 1;
      addToCart({ name, size, price, qty });
    });
  });

  document.getElementById('clear-cart').addEventListener('click', () => {
    cart.length = 0; updateCart();
  });

  document.getElementById('bookingForm').addEventListener('submit', function(e){
    // Make sure order_summary is filled before sending
    if (cart.length === 0) {
      // allow booking requests with empty cart, but confirm
      if (!confirm('Your cart is empty. Send a booking request without items?')) {
        e.preventDefault();
        return;
      }
    }
    document.getElementById('order_summary').value = generateOrderSummary();
    // allow form to submit normally to Formspree
  });

  updateCart();
});

function addToCart(item) {
  cart.push(item);
  updateCart();
}

function updateCart() {
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((it, i) => {
    const subtotal = it.price * it.qty;
    total += subtotal;
    const li = document.createElement('li');
    li.innerHTML = `<span>${it.qty} × ${it.size} ${it.name}</span><span>$${subtotal.toFixed(2)} <button data-idx="${i}" class="remove">Remove</button></span>`;
    list.appendChild(li);
  });
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;

  list.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      cart.splice(idx, 1);
      updateCart();
    });
  });
}

function generateOrderSummary() {
  if (cart.length === 0) return 'No items (booking request only)';
  const lines = cart.map(it => `${it.qty} x ${it.size} ${it.name} @ $${it.price.toFixed(2)} = $${(it.qty * it.price).toFixed(2)}`);
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  lines.push(`TOTAL: $${total.toFixed(2)}`);
  return lines.join('\n');
}
