document.addEventListener('DOMContentLoaded', () => {
    const quoteItemsBody = document.getElementById('quote-items-body');
    const addItemBtn = document.getElementById('add-item-btn');
    const subtotalAmountEl = document.getElementById('subtotal-amount');
    const totalAmountEl = document.getElementById('total-amount');
    const taxRateEl = document.getElementById('tax-rate');
    const saveQuoteBtn = document.getElementById('save-quote-btn');
    const printQuoteBtn = document.getElementById('print-quote-btn');
    const savedQuotesList = document.getElementById('saved-quotes-list');
    const customerNameEl = document.getElementById('customer-name');
    const projectNameEl = document.getElementById('project-name');

    let currentQuoteId = null;

    const createNewLineItem = () => {
        const row = document.createElement('tr');
        row.className = 'quote-item';
        row.innerHTML = `
            <td><input type="text" class="item-description" placeholder="Item description"></td>
            <td><input type="number" class="item-quantity" value="1" min="0"></td>
            <td><input type="number" class="item-price" placeholder="0.00" min="0" step="0.01"></td>
            <td class="line-total">$0.00</td>
            <td><button class="remove-item-btn">X</button></td>
        `;
        quoteItemsBody.appendChild(row);
    };

    const updateTotals = () => {
        let subtotal = 0;
        document.querySelectorAll('.quote-item').forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const lineTotal = quantity * price;
            row.querySelector('.line-total').textContent = `$${lineTotal.toFixed(2)}`;
            subtotal += lineTotal;
        });

        const taxRate = parseFloat(taxRateEl.value) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        subtotalAmountEl.textContent = `$${subtotal.toFixed(2)}`;
        totalAmountEl.textContent = `$${total.toFixed(2)}`;
    };

    const saveQuote = () => {
        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const quoteData = {
            id: currentQuoteId || `quote_${new Date().getTime()}`,
            customerName: customerNameEl.value,
            projectName: projectNameEl.value,
            taxRate: taxRateEl.value,
            items: [],
            createdAt: new Date().toISOString()
        };

        document.querySelectorAll('.quote-item').forEach(row => {
            quoteData.items.push({
                description: row.querySelector('.item-description').value,
                quantity: row.querySelector('.item-quantity').value,
                price: row.querySelector('.item-price').value
            });
        });

        const existingIndex = quotes.findIndex(q => q.id === quoteData.id);
        if (existingIndex > -1) {
            quotes[existingIndex] = quoteData;
        } else {
            quotes.push(quoteData);
        }

        localStorage.setItem('quotes', JSON.stringify(quotes));
        currentQuoteId = quoteData.id; // Ensure we keep the same ID for subsequent saves
        alert('Quote saved!');
        loadSavedQuotes();
    };

    const loadQuote = (quoteId) => {
        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const quote = quotes.find(q => q.id === quoteId);
        if (!quote) return;

        currentQuoteId = quote.id;
        customerNameEl.value = quote.customerName;
        projectNameEl.value = quote.projectName;
        taxRateEl.value = quote.taxRate;
        quoteItemsBody.innerHTML = '';
        quote.items.forEach(item => {
            createNewLineItem();
            const newRow = quoteItemsBody.lastChild;
            newRow.querySelector('.item-description').value = item.description;
            newRow.querySelector('.item-quantity').value = item.quantity;
            newRow.querySelector('.item-price').value = item.price;
        });
        updateTotals();
    };

    const deleteQuote = (quoteId) => {
        let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        quotes = quotes.filter(q => q.id !== quoteId);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        loadSavedQuotes();
    };

    const loadSavedQuotes = () => {
        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        savedQuotesList.innerHTML = '';
        if (quotes.length === 0) {
            savedQuotesList.innerHTML = '<p>No quotes saved yet.</p>';
            return;
        }
        
        quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        quotes.forEach(quote => {
            const quoteEl = document.createElement('div');
            quoteEl.className = 'saved-quote-item';
            quoteEl.innerHTML = `
                <span><strong>${quote.projectName || 'Untitled'}</strong> for ${quote.customerName || 'N/A'}</span>
                <div>
                    <button class="load-btn">Load</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            quoteEl.querySelector('.load-btn').addEventListener('click', () => loadQuote(quote.id));
            quoteEl.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this quote?')) {
                    deleteQuote(quote.id);
                }
            });
            savedQuotesList.appendChild(quoteEl);
        });
    };

    const printQuote = () => {
        const printableContent = `
            <html>
            <head>
                <title>Quote for ${projectNameEl.value || 'Project'}</title>
                <style>
                    body { font-family: sans-serif; margin: 2em; }
                    h1, h2 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total-summary { float: right; width: 250px; margin-top: 20px; }
                    .total-summary div { display: flex; justify-content: space-between; padding: 5px 0; }
                    .total-summary .total { font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>Quote</h1>
                <h2>For: ${customerNameEl.value}</h2>
                <h3>Project: ${projectNameEl.value}</h3>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <table>
                    <thead><tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Line Total</th></tr></thead>
                    <tbody>
                        ${Array.from(document.querySelectorAll('.quote-item')).map(row => `
                            <tr>
                                <td>${row.querySelector('.item-description').value}</td>
                                <td>${row.querySelector('.item-quantity').value}</td>
                                <td>$${parseFloat(row.querySelector('.item-price').value || 0).toFixed(2)}</td>
                                <td>${row.querySelector('.line-total').textContent}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total-summary">
                    <div><span>Subtotal:</span><span>${subtotalAmountEl.textContent}</span></div>
                    <div><span>Tax (${taxRateEl.value}%):</span><span>$${(parseFloat(subtotalAmountEl.textContent.slice(1)) * (parseFloat(taxRateEl.value)/100)).toFixed(2)}</span></div>
                    <div class="total"><span>Total:</span><span>${totalAmountEl.textContent}</span></div>
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printableContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 250);
    };

    // Event Listeners
    addItemBtn.addEventListener('click', createNewLineItem);
    quoteItemsBody.addEventListener('change', updateTotals);
    quoteItemsBody.addEventListener('keyup', updateTotals);
    taxRateEl.addEventListener('change', updateTotals);
    taxRateEl.addEventListener('keyup', updateTotals);
    saveQuoteBtn.addEventListener('click', saveQuote);
    printQuoteBtn.addEventListener('click', printQuote);
    quoteItemsBody.addEventListener('click', e => {
        if (e.target.classList.contains('remove-item-btn')) {
            e.target.closest('.quote-item').remove();
            updateTotals();
        }
    });

    // Initial setup
    createNewLineItem();
    loadSavedQuotes();
});
