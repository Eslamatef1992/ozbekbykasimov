// Shared branded print template used by Orders.jsx and Users.jsx. Opens a
// small popup window with the Ozbek logo, a set of label/value rows, an
// optional items table, and a bilingual footer, then triggers the browser
// print dialog on it.
export function openReceipt({ title, subtitle, rows = [], tableHtml = '', showThanks = true }) {
  const win = window.open('', '_blank', 'width=420,height=700');
  if (!win) return;

  const rowsHtml = rows
    .map(([label, value]) => `<div class="row"><span class="label">${label}</span><span class="value">${value ?? '—'}</span></div>`)
    .join('');

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 28px; color: #101614; }
          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }
          .brand img { height: 36px; width: auto; }
          .brand h1 { font-size: 17px; margin: 0; }
          .muted { color: #6B7A73; font-size: 12px; margin: 4px 0 18px; }
          .row { display: flex; justify-content: space-between; gap: 16px; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #eee; }
          .row .label { color: #6B7A73; }
          .row .value { text-align: right; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 14px; }
          table td { padding: 6px 0; border-bottom: 1px solid #eee; vertical-align: top; }
          table .total-row td { border-bottom: none; font-weight: 700; font-size: 14px; padding-top: 10px; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; text-align: center; }
          .footer .thanks-en { font-size: 13px; color: #1F3D33; font-weight: 600; }
          .footer .thanks-ar { font-size: 13px; color: #1F3D33; font-weight: 600; direction: rtl; margin-top: 3px; }
          .footer .powered { font-size: 11px; color: #6B7A73; margin-top: 12px; }
          @media print {
            body { padding: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="brand">
          <img src="${window.location.origin}/logo.svg" alt="Ozbek By Kasimov" />
          <h1>Ozbek By Kasimov</h1>
        </div>
        <div class="muted">${subtitle}</div>
        ${rowsHtml}
        ${tableHtml}
        <div class="footer">
          ${showThanks ? `
            <div class="thanks-en">Thank you for your order from Ozbek By Kasimov.</div>
            <div class="thanks-ar">شكراً لطلبكم من مطعم أوزبك باي كاسيموف.</div>
          ` : ''}
          <div class="powered">Powered by Teknulugy · بدعم من Teknulugy</div>
        </div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 250);
}
