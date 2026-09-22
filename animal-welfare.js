/* ============================================================
   Animal Welfare Donation — Complete Frontend System v4
   Refined to match physical Gujarati donation receipt & form specs:
     - Shree Verai Mata Gau Seva Trust - Morvada
     - Full page layout below sticky navigation header
     - Left: Gujarati Donation Receipt Preview (Paper receipt style)
     - Right: Donor General Details + All 12 Donation Fields pre-rendered
     - Top-right 'સાફ કરો' reset button for donation amounts
     - Bottom Action Buttons: Cancel (Red), Print (Gray), Mark as Paid (Orange CTA)
   ============================================================ */
(function () {
  'use strict';

  var API_BASE = window.__BARCODE_API_BASE || 'https://my-backend-production-4e0a.up.railway.app/api/api';

  function getToken() {
    try { return localStorage.getItem('token'); } catch (e) { return null; }
  }
  function getUserRole() {
    try {
      var u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.role || '';
    } catch (e) { return ''; }
  }
  function authHeaders() {
    var t = getToken();
    return t ? { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }
             : { 'Content-Type': 'application/json' };
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function fmt(n) { return (Number(n) || 0).toFixed(2); }
  function fmtPlain(n) {
    n = Number(n) || 0;
    return (n % 1 === 0) ? String(n) : n.toFixed(2);
  }

  var CATEGORIES = [
    { key: 'nibhav_bhet',        label: 'શ્રી નિભાવ ભેટ ખાતે (ઘાસચારા માટે)' },
    { key: 'gaushala_makan',     label: 'શ્રી ગૌશાળા મકાન બાંધકામ ભેટ ખાતે' },
    { key: 'gaushala_vikas',     label: 'શ્રી ગૌશાળા વિકાસ યોજના ખાતે' },
    { key: 'panjhio_chan',       label: 'શ્રી પાંજિઓ ચાણ નિમિતે' },
    { key: 'dhota_yojna',        label: 'શ્રી ઢોતા યોજના ખાતે' },
    { key: 'dharmada_peti',      label: 'શ્રી ધર્માદા પેટી ઝોળી ફંડ ભેટ ખાતે' },
    { key: 'jiv_chodaman',       label: 'શ્રી જીવ છોડામણ ભેટ ખાતે' },
    { key: 'varshik_jiv_nibhav', label: 'શ્રી વાર્ષિક જીવ નિભાવ ભેટ યોજના ખાતે' },
    { key: 'pashu_sarvar',       label: 'શ્રી પશુ સારવાર ખાતે' },
    { key: 'prasang_bhet',       label: 'શ્રી પ્રસંગ ભેટ ખાતે' },
    { key: 'annakshetra',        label: 'શ્રી અન્નક્ષેત્ર ખાતે' },
    { key: 'verai_mandir_nibhav',label: 'શ્રી વેરાઈ મંદિર નિભાવ ખાતે' },
  ];

  /* ----------------------------------------------------------
     GUJARATI NUMBER-TO-WORDS (Amount in Words)
  ---------------------------------------------------------- */
  var GU_ONES = ['શૂન્ય','એક','બે','ત્રણ','ચાર','પાંચ','છ','સાત','આઠ','નવ','દસ',
    'અગિયાર','બાર','તેર','ચૌદ','પંદર','સોળ','સત્તર','અઢાર','ઓગણીસ',
    'વીસ','એકવીસ','બાવીસ','ત્રેવીસ','ચોવીસ','પચ્ચીસ','છવ્વીસ','સત્તાવીસ','અઠ્ઠાવીસ','ઓગણત્રીસ',
    'ત્રીસ','એકત્રીસ','બત્રીસ','તેત્રીસ','ચોત્રીસ','પાંત્રીસ','છત્રીસ','સાડત્રીસ','આડત્રીસ','ઓગણચાલીસ',
    'ચાલીસ','એકતાલીસ','બેતાલીસ','ત્રેતાલીસ','ચુમાલીસ','પિસ્તાલીસ','છેતાલીસ','સુડતાલીસ','અડતાલીસ','ઓગણપચાસ',
    'પચાસ','એકાવન','બાવન','ત્રેપન','ચોપન','પંચાવન','છપ્પન','સત્તાવન','અઠ્ઠાવન','ઓગણસાઠ',
    'સાઈઠ','એકસઠ','બાસઠ','ત્રેસઠ','ચોસઠ','પાંસઠ','છાસઠ','સડસઠ','અડસઠ','અગણોસિત્તેર',
    'સિત્તેર','એકોતેર','બોતેર','તોતેર','ચુમોતેર','પંચોતેર','છોતેર','સિત્યોતેર','ઇઠ્યોતેર','ઓગણ્યાએંસી',
    'એંસી','એક્યાસી','બ્યાસી','ત્યાસી','ચોર્યાસી','પંચ્યાસી','છ્યાસી','સત્યાસી','અઠ્યાસી','નેવ્યાસી',
    'નેવું','એકાણું','બાણું','ત્રાણું','ચોરાણું','પંચાણું','છન્નું','સત્તાણું','અઠ્ઠાણું','નવ્વાણું'];

  function guConvert(num) {
    if (num <= 0) return '';
    var parts = [];
    var crore = Math.floor(num / 10000000); num %= 10000000;
    var lakh = Math.floor(num / 100000); num %= 100000;
    var thousand = Math.floor(num / 1000); num %= 1000;
    var hundred = Math.floor(num / 100); num %= 100;
    if (crore) parts.push((crore < 100 ? GU_ONES[crore] : guConvert(crore)) + ' કરોડ');
    if (lakh) parts.push((lakh < 100 ? GU_ONES[lakh] : guConvert(lakh)) + ' લાખ');
    if (thousand) parts.push((thousand < 100 ? GU_ONES[thousand] : guConvert(thousand)) + ' હજાર');
    if (hundred) parts.push(GU_ONES[hundred] + ' સો');
    if (num) parts.push(GU_ONES[num]);
    return parts.join(' ');
  }

  function numToGujaratiWords(n) {
    var num = Math.floor(n);
    if (num <= 0) return 'શૂન્ય રૂપિયા પૂરા';
    return (guConvert(num) + ' રૂપિયા પૂરા').trim();
  }

  function fmtDateDisplay(d) {
    if (!d) return '--';
    try {
      var dt = new Date(d + 'T00:00:00');
      if (isNaN(dt.getTime())) return d;
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0');
      var yy = dt.getFullYear();
      return dd + '-' + mm + '-' + yy;
    } catch (e) { return d; }
  }

  /* ----------------------------------------------------------
     RECEIPT-ONLY CSS — shared by live preview AND print window
  ---------------------------------------------------------- */
  function receiptCSS() {
    return (
      '@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");' +

      '__.__awd-receipt{' +
        'background:#ffffff;' +
        'border:2.5px solid #8B0000;' +
        'border-radius:4px;' +
        'padding:12px 14px;' +
        'box-shadow:0 8px 30px rgba(139,0,0,.14), 0 2px 8px rgba(0,0,0,.06);' +
        'font-family:"Noto Sans Gujarati", "Plus Jakarta Sans", sans-serif;' +
        'color:#5B0000;' +
        'max-width:680px;' +
        'margin:0 auto;' +
        'box-sizing:border-box;' +
      '}' +

      /* ── Top 3-Column Mantra Row ── */
      '.__awd-rc-top-row{' +
        'display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:6px;' +
        'border-bottom:1.5px solid #8B0000;padding-bottom:5px;margin-bottom:6px;' +
      '}' +
      '.__awd-rc-top-col{color:#8B0000;line-height:1.35;}' +
      '.__awd-rc-top-col.left{text-align:left;}' +
      '.__awd-rc-top-col.center{text-align:center;}' +
      '.__awd-rc-top-col.right{text-align:right;}' +
      '.__awd-rc-top-main{font-size:9.5px;font-weight:800;}' +
      '.__awd-rc-top-sub{font-size:8.3px;font-weight:600;margin-top:1px;}' +

      /* ── Trust Name Block (no logos) ── */
      '.__awd-rc-trust-block{' +
        'text-align:center;padding-bottom:6px;margin-bottom:0;' +
        'border-bottom:1.5px solid #8B0000;' +
      '}' +
      '.__awd-rc-trust-name-guj{font-size:19px;font-weight:800;color:#8B0000;line-height:1.25;letter-spacing:-.2px;}' +
      '.__awd-rc-trust-name-eng{font-size:11px;font-weight:800;color:#8B0000;margin-top:3px;letter-spacing:.2px;}' +

      /* ── PAN / Registration Bar ── */
      '.__awd-rc-pan-reg-box{' +
        'display:flex;border:1.5px solid #8B0000;border-top:none;background:#FFF5F5;' +
      '}' +
      '.__awd-rc-pan-reg-cell{flex:1;padding:5px 10px;font-size:10.5px;font-weight:700;color:#8B0000;}' +
      '.__awd-rc-pan-reg-cell:first-child{border-right:1.5px solid #8B0000;}' +
      '.__awd-rc-pan-reg-cell.right{text-align:right;}' +

      /* ── Donor Details Section (fill-in-the-blank lines) ── */
      '.__awd-rc-donor-section{' +
        'border:1.5px solid #8B0000;border-top:none;' +
        'padding:8px 10px 6px;font-size:11.5px;color:#1a1a1a;line-height:1.7;' +
      '}' +
      '.__awd-rc-row{display:flex;align-items:baseline;gap:6px;margin-bottom:5px;flex-wrap:nowrap;}' +
      '.__awd-rc-row.between{justify-content:space-between;}' +
      '.__awd-rc-lbl{font-weight:700;color:#8B0000;white-space:nowrap;font-size:11px;}' +
      '.__awd-rc-fill{' +
        'border-bottom:1px solid #8B0000;font-weight:700;color:#1a1a1a;' +
        'padding:0 4px 1px;font-size:12px;min-width:40px;' +
      '}' +
      '.__awd-rc-fill.grow{flex:1;}' +
      '.__awd-rc-fill.short{min-width:64px;text-align:center;}' +
      '.__awd-rc-mode-row{margin-top:2px;font-weight:700;color:#8B0000;padding-top:4px;}' +
      '.__awd-rc-mode-row .v{color:#1a1a1a;margin-left:4px;}' +

      /* ── Category Table ── */
      '.__awd-rc-table{' +
        'width:100%;border-collapse:collapse;margin-top:4px;' +
        'border:1.5px solid #8B0000;font-size:10.5px;' +
      '}' +
      '.__awd-rc-table th{' +
        'background:#FFF5F5;color:#8B0000;' +
        'padding:5px 6px;text-align:left;font-weight:700;' +
        'font-size:10px;border-right:1px solid #8B0000;border-top:1.5px solid #8B0000;' +
      '}' +
      '.__awd-rc-table th.th-no{width:28px;text-align:center;}' +
      '.__awd-rc-table th.th-cat{width:auto;}' +
      '.__awd-rc-table th.th-rs{width:70px;text-align:right;}' +
      '.__awd-rc-table th.th-ps{width:40px;text-align:right;border-right:none;}' +
      '.__awd-rc-table td{' +
        'padding:4px 6px;' +
        'border-bottom:1px solid #8B0000;' +
        'border-top:1px solid #8B0000;' +
        'border-right:1px solid #8B0000;' +
        'color:#5B0000;vertical-align:middle;font-weight:600;' +
      '}' +
      '.__awd-rc-table td.td-no{text-align:center;font-weight:700;color:#8B0000;}' +
      '.__awd-rc-table td.td-cat{color:#2a0000;}' +
      '.__awd-rc-table td.td-rs{text-align:right;font-weight:700;color:#1a1a1a;}' +
      '.__awd-rc-table td.td-ps{text-align:right;color:#5B0000;}' +
      '.__awd-rc-table tbody tr.active-row td{background:#FFF5F5;}' +
      '.__awd-rc-table tfoot td, .__awd-rc-table tfoot td.td-cat, .__awd-rc-table tfoot td.td-rs, .__awd-rc-table tfoot td.td-ps{' +
        'background:#FFF5F5!important;color:#8B0000!important;' +
        'font-weight:800;padding:6px;font-size:11px;' +
        'border:1px solid #8B0000;' +
      '}' +

      /* ── Signature Section (Trust name / Remarks / Vasul Karnar) ── */
      '.__awd-rc-sign-section{' +
        'border:1.5px solid #8B0000;border-top:none;' +
        'padding:6px 10px 8px;' +
      '}' +
      '.__awd-rc-sign-title{' +
        'text-align:right;font-weight:700;color:#8B0000;' +
        'text-decoration:underline;font-size:10.5px;' +
      '}' +
      '.__awd-rc-remarks-line{' +
        'display:flex;align-items:baseline;gap:6px;margin:10px 0;' +
        'font-size:10.5px;color:#5B0000;font-weight:600;' +
      '}' +
      '.__awd-rc-sign-sub{text-align:right;font-weight:700;color:#8B0000;font-size:9.5px;}' +

      /* ── Bank Details (full width, below signature section) ── */
      '.__awd-rc-bank-box{' +
        'border:1.5px solid #8B0000;border-top:none;' +
        'padding:6px 10px;font-size:8.5px;color:#5B0000;line-height:1.5;' +
      '}' +
      '.__awd-rc-bank-title{font-weight:700;color:#8B0000;margin-bottom:2px;font-size:9px;text-decoration:underline;}'
    );
  }

  /* ----------------------------------------------------------
     STYLES — injected into <head>
  ---------------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById('__awd-styles')) return;
    var s = document.createElement('style');
    s.id = '__awd-styles';
    s.textContent =
      /* ── Active Donation Nav Item Style — White BG with Black Icon ── */
      '#nav-donation-btn.active, .nav-item.awd-nav-tab.active{' +
        'background:#ffffff!important;' +
        'color:#000000!important;' +
        'box-shadow:0 6px 16px rgba(0,0,0,0.12)!important;}' +
      '#nav-donation-btn.active mat-icon, #nav-donation-btn.active .material-icons, .nav-item.awd-nav-tab.active mat-icon, .nav-item.awd-nav-tab.active .material-icons{' +
        'color:#000000!important;}' +
      '#nav-donation-btn.active span, #nav-donation-btn.active .nav-label, .nav-item.awd-nav-tab.active span, .nav-item.awd-nav-tab.active .nav-label{' +
        'color:#000000!important;' +
        'max-width:120px!important;}' +
      /* ── Full Page container below sticky header ── */
      '.__awd-overlay{' +
        'position:fixed;' +
        'top:var(--awd-nav-h,0px);left:0;right:0;bottom:0;' +
        'background:#f8fafc;' +
        'z-index:900;' +
        'overflow:hidden;' +
        'display:flex;flex-direction:column;' +
        'font-family:"Plus Jakarta Sans", "Noto Sans Gujarati", Roboto, sans-serif;}' +
      '.__awd-modal{' +
        'background:transparent;width:100%;flex:1;min-height:0;' +
        'display:flex;flex-direction:column;overflow:hidden;}' +

      /* ── Main 2-column Grid ── */
      '.__awd-split{' +
        'display:grid;' +
        'grid-template-columns:1fr 1fr;' +
        'max-width:1440px;width:100%;margin:0 auto;' +
        'flex:1;min-height:0;' +
        'padding:16px 24px 20px;' +
        'gap:20px;' +
        'box-sizing:border-box;}' +

      '.__awd-receipt-col,.__awd-form-col{' +
        'overflow-y:auto;overflow-x:hidden;' +
        'padding-right:4px;}' +
      '.__awd-receipt-col::-webkit-scrollbar,.__awd-form-col::-webkit-scrollbar{width:5px;}' +
      '.__awd-receipt-col::-webkit-scrollbar-thumb,.__awd-form-col::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}' +

      /* ── Form Card ── */
      '.__awd-form-card{' +
        'background:#ffffff;' +
        'border-radius:12px;' +
        'border:1px solid #e2e8f0;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.04);' +
        'overflow:hidden;margin-bottom:16px;}' +

      '.__awd-card-section{' +
        'padding:16px 20px;' +
        'border-bottom:1px solid #f1f5f9;}' +
      '.__awd-card-section:last-child{border-bottom:none;}' +

      '.__awd-section-header{' +
        'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}' +
      '.__awd-accent-bar{' +
        'width:4px;height:22px;background:#ff6b00;border-radius:2px;flex-shrink:0;}' +
      '.__awd-section-header h3{' +
        'margin:0;font-size:15px;font-weight:700;color:#1e293b;}' +

      /* ── Clear Button ── */
      '.__awd-clear-btn{' +
        'display:inline-flex;align-items:center;gap:5px;' +
        'background:#fef2f2;color:#dc2626;border:1px solid #fecaca;' +
        'padding:6px 12px;border-radius:6px;font-size:12px;font-weight:700;' +
        'cursor:pointer;font-family:inherit;transition:background .15s;}' +
      '.__awd-clear-btn:hover{background:#fee2e2;}' +

      /* ── Inputs Layout ── */
      '.__awd-grid-2{' +
        'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}' +
      '.__awd-field{display:flex;flex-direction:column;gap:5px;margin-bottom:10px;}' +
      '.__awd-field label{' +
        'font-size:12px;font-weight:600;color:#475569;' +
        'display:flex;align-items:center;gap:4px;}' +
      '.__awd-field input,.__awd-field select,.__awd-field textarea{' +
        'border:1.5px solid #cbd5e1;border-radius:8px;padding:9px 12px;font-size:13px;' +
        'font-family:inherit;outline:none;transition:border-color .15s, box-shadow .15s;color:#0f172a;' +
        'background:#ffffff;box-sizing:border-box;width:100%;}' +
      '.__awd-field input:focus,.__awd-field select:focus,.__awd-field textarea:focus{' +
        'border-color:#ff6b00;box-shadow:0 0 0 3px rgba(255,107,0,.15);}' +

      /* ── Pre-rendered Category Rows in Form ── */
      '.__awd-cat-form-row{' +
        'display:flex;align-items:center;gap:10px;padding:7px 10px;' +
        'background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;' +
        'margin-bottom:8px;transition:border-color .15s, background .15s;}' +
      '.__awd-cat-form-row:hover{background:#ffffff;border-color:#cbd5e1;}' +
      '.__awd-cat-num{' +
        'width:22px;height:22px;border-radius:50%;background:#fff7ed;color:#ea580c;' +
        'font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;' +
        'flex-shrink:0;}' +
      '.__awd-cat-name{' +
        'flex:1;font-size:13px;font-weight:600;color:#1e293b;font-family:"Noto Sans Gujarati", sans-serif;}' +
      '.__awd-cat-input-group{display:flex;align-items:center;flex-shrink:0;}' +
      '.__awd-cat-amt-input{' +
        'width:100px;border:1.5px solid #cbd5e1;border-right:none;' +
        'border-radius:6px 0 0 6px;padding:6px 10px;font-size:13px;font-weight:700;' +
        'text-align:right;outline:none;color:#0f172a;background:#ffffff;font-family:inherit;}' +
      '.__awd-cat-amt-input:focus{border-color:#ff6b00;}' +
      '.__awd-cat-unit{' +
        'background:#f1f5f9;border:1.5px solid #cbd5e1;border-left:none;' +
        'border-radius:0 6px 6px 0;padding:6px 10px;font-size:12px;font-weight:700;' +
        'color:#475569;user-select:none;}' +

      /* ── Total Summary Bar ── */
      '.__awd-total-bar{' +
        'background:#fff7ed;border:1px solid #ffedd5;border-radius:10px;' +
        'padding:12px 18px;display:flex;justify-content:space-between;align-items:center;' +
        'margin-top:14px;}' +
      '.__awd-total-bar .lbl{font-weight:700;color:#9a3412;font-size:14px;}' +
      '.__awd-total-bar .val{font-weight:800;color:#ea580c;font-size:22px;}' +

      /* ── Bottom Action Buttons Bar (Sleek Small Buttons) ── */
      '.__awd-bottom-actions{' +
        'display:flex;gap:8px;justify-content:flex-end;align-items:center;flex-wrap:wrap;' +
        'padding:10px 20px;background:#ffffff;border-top:1px solid #e2e8f0;' +
        'flex-shrink:0;box-shadow:0 -4px 12px rgba(0,0,0,.03);}' +
      '.__awd-btn{' +
        'display:inline-flex;align-items:center;gap:6px;' +
        'padding:7px 14px;border-radius:6px;font-size:12px;font-weight:700;' +
        'cursor:pointer;border:none;font-family:inherit;transition:all .15s ease;' +
        'box-shadow:0 1px 3px rgba(0,0,0,.08);}' +
      '.__awd-btn-cancel{' +
        'background:#dc2626;color:#ffffff;}' +
      '.__awd-btn-cancel:hover{background:#b91c1c;}' +
      '.__awd-btn-print{' +
        'background:#4b5563;color:#ffffff;}' +
      '.__awd-btn-print:hover{background:#374151;}' +
      '.__awd-btn-download{' +
        'background:#0f766e;color:#ffffff;box-shadow:0 2px 8px rgba(15,118,110,.25);}' +
      '.__awd-btn-download:hover{background:#0d6460;}' +
      '.__awd-btn-pay{' +
        'background:#ff6b00;color:#ffffff;box-shadow:0 4px 12px rgba(255,107,0,.3);}' +
      '.__awd-btn-pay:hover{background:#e65c00;}' +
      '.__awd-btn-pay:disabled{background:#fdba74;cursor:not-allowed;box-shadow:none;}' +

      '.__awd-btn-icon{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;}' +

      /* ── Responsive Media Queries for All Screen Sizes ── */
      '@media(max-width:1280px){' +
        '.__awd-split{padding:14px 18px;gap:14px;}' +
      '}' +

      '@media(max-width:1024px){' +
        '.__awd-split{grid-template-columns:1fr;overflow-y:auto;padding:14px;gap:16px;}' +
        '.__awd-receipt-col,.__awd-form-col{overflow:visible;padding-right:0;}' +
        '.__awd-receipt{max-width:100%;}' +
      '}' +

      '@media(max-width:768px){' +
        '.__awd-overlay{padding-top:0;}' +
        '.__awd-split{padding:10px;gap:12px;}' +
        '.__awd-grid-2{grid-template-columns:1fr;gap:8px;}' +
        '.__awd-card-section{padding:12px 14px;}' +
        '.__awd-bottom-actions{padding:8px 12px;gap:6px;}' +
        '.__awd-btn{flex:1 1 45%;justify-content:center;padding:8px 10px;font-size:11.5px;}' +
        '.__awd-cat-form-row{padding:6px 8px;}' +
        '.__awd-cat-name{font-size:12px;}' +
        '.__awd-cat-amt-input{width:85px;font-size:12px;padding:5px 8px;}' +
      '}' +

      '@media(max-width:480px){' +
        '.__awd-receipt{padding:8px 10px;font-size:10px;}' +
        '.__awd-rc-trust-name-guj{font-size:14px;}' +
        '.__awd-rc-trust-name-eng{font-size:9px;}' +
        '.__awd-bottom-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;}' +
        '.__awd-btn{width:100%;padding:9px 6px;font-size:11px;gap:4px;}' +
        '.__awd-btn-icon{width:13px;height:13px;}' +
      '}' +
      receiptCSS();
    document.head.appendChild(s);
  }

  /* ----------------------------------------------------------
     GUJARATI RECEIPT HTML (LEFT SIDE PREVIEW)
  ---------------------------------------------------------- */
  function buildReceiptHTML() {
    var tableRows = CATEGORIES.map(function (c, i) {
      return '<tr id="__awd-rc-tr-' + c.key + '">' +
        '<td class="td-no" id="__awd-rc-no-' + c.key + '">' + (i + 1) + '</td>' +
        '<td class="td-cat">' + esc(c.label) + '</td>' +
        '<td class="td-rs" id="__awd-rc-rs-' + c.key + '">--</td>' +
        '<td class="td-ps" id="__awd-rc-ps-' + c.key + '">00</td>' +
      '</tr>';
    }).join('');

    return '<div class="__awd-receipt" id="__awd-receipt">' +

      /* ── Top 3-Column Mantra Row ── */
      '<div class="__awd-rc-top-row">' +
        '<div class="__awd-rc-top-col left">' +
          '<div class="__awd-rc-top-main">દાન આપનારને મળવા પાત્ર 80G લાભ...</div>' +
          '<div class="__awd-rc-top-sub">Donation Exempted U/s 80/G (5) Certi No. 334/09-10 Dt. 11-4-09</div>' +
        '</div>' +
        '<div class="__awd-rc-top-col center">' +
          '<div class="__awd-rc-top-main">શ્રી ગણેશાય નમઃ</div>' +
          '<div class="__awd-rc-top-sub">જીવો અને જીવવા દો</div>' +
        '</div>' +
        '<div class="__awd-rc-top-col right">' +
          '<div class="__awd-rc-top-main">શ્રી મહાવીરાય નમઃ</div>' +
          '<div class="__awd-rc-top-sub">ગુજરાત જીવદયાનું અમૃત છે</div>' +
        '</div>' +
      '</div>' +

      /* ── Trust Name Block ── */
      '<div class="__awd-rc-trust-block">' +
        '<div class="__awd-rc-trust-name-guj">શ્રી વેરાઈ માતા ગૌ સેવા ટ્રસ્ટ મોરવાડા, તા.સુઈગામ,જિ.બી.કે.-૩૮૫૩૨૦</div>' +
        '<div class="__awd-rc-trust-name-eng">SHREE VERAI MATA GAU SEVA TRUST-MORVADA, Dist.B.K.385320</div>' +
      '</div>' +

      /* ── PAN / Registration Bar ── */
      '<div class="__awd-rc-pan-reg-box">' +
        '<div class="__awd-rc-pan-reg-cell">PAN AAITS 4362 F</div>' +
        '<div class="__awd-rc-pan-reg-cell right">Trust ACT. REG No. E-1136</div>' +
      '</div>' +

      /* ── Donor Information Block ── */
      '<div class="__awd-rc-donor-section">' +
        '<div class="__awd-rc-row between">' +
          '<span class="__awd-rc-row" style="margin-bottom:0">' +
            '<span class="__awd-rc-lbl">પહોંચ નં.</span>' +
            '<span class="__awd-rc-fill short" id="__awd-rc-receipt-no">----</span>' +
          '</span>' +
          '<span class="__awd-rc-row" style="margin-bottom:0">' +
            '<span class="__awd-rc-lbl">તા.</span>' +
            '<span class="__awd-rc-fill short" id="__awd-rc-date">' + fmtDateDisplay(today()) + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="__awd-rc-row">' +
          '<span class="__awd-rc-lbl">શ્રીયુત</span>' +
          '<span class="__awd-rc-fill grow" id="__awd-rc-donor-name">&mdash;</span>' +
        '</div>' +
        '<div class="__awd-rc-row">' +
          '<span class="__awd-rc-lbl">પુરૂ સરનામું</span>' +
          '<span class="__awd-rc-fill grow" id="__awd-rc-address">&mdash;</span>' +
        '</div>' +
        '<div class="__awd-rc-row">' +
          '<span class="__awd-rc-lbl">આજ રોજ આપના તરફથી રૂ.</span>' +
          '<span class="__awd-rc-fill short" id="__awd-rc-amt-num">0</span>' +
          '<span class="__awd-rc-lbl">અંકે રૂ.</span>' +
          '<span class="__awd-rc-fill grow" id="__awd-rc-amt-words">&mdash;</span>' +
        '</div>' +
        '<div class="__awd-rc-row __awd-rc-mode-row" style="margin-bottom:0">' +
        '<span class="v" id="__awd-rc-payment-mode">રોકડ</span>' +
          '<span class="__awd-rc-lbl">મળેલ છે:</span>' +
        '</div>' +
      '</div>' +

      /* ── Category Table ── */
      '<table class="__awd-rc-table">' +
        '<thead>' +
          '<tr>' +
            '<th class="th-no">નં.</th>' +
            '<th class="th-cat">વિગત</th>' +
            '<th class="th-rs">રૂપિયા</th>' +
            '<th class="th-ps">પૈસા</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + tableRows + '</tbody>' +
        '<tfoot>' +
          '<tr>' +
            '<td class="td-no"></td>' +
            '<td class="td-cat" style="font-weight:800">ટોટલ....</td>' +
            '<td class="td-rs" id="__awd-rc-total-rs" style="font-weight:800;text-align:right">0</td>' +
            '<td class="td-ps" id="__awd-rc-total-ps" style="font-weight:800;text-align:right">00</td>' +
          '</tr>' +
        '</tfoot>' +
      '</table>' +

      /* ── Signature Section: Trust name / Remarks / Vasul Karnar ── */
      '<div class="__awd-rc-sign-section">' +
        '<div class="__awd-rc-sign-title">શ્રી વેરાઈ માતા ગૌશાળા સેવા ટ્રસ્ટ</div>' +
        '<div class="__awd-rc-remarks-line">' +
          '<span>વિગત:</span>' +
          '<span id="__awd-rc-remarks" style="flex:1;border-bottom:1px dotted #8B0000;color:#1a1a1a;font-weight:700;min-height:14px"></span>' +
        '</div>' +
        '<div class="__awd-rc-sign-sub">(વસુલ કરનાર)</div>' +
      '</div>' +

      /* ── Bank Details Box (full width) ── */
      '<div class="__awd-rc-bank-box">' +
        '<div class="__awd-rc-bank-title">Bank Account Details : Shree Veraimata Gau Seva Trust</div>' +
        '<div><b>Bank Name : Bank of Baroda</b> Branch - BHABHAR</div>' +
        '<div>A/c.No. 43870100037993 &nbsp; IFSC CODE : BARB0BHAMEH</div>' +
        '<div><b>Bank Name : The B.D.C.C. Bank (Banas Bank)</b> Branch - MORWADA</div>' +
        '<div>A/c.No. 618085023932 &nbsp; IFSC CODE : GSCB0BKD085</div>' +
      '</div>' +

    '</div>';
  }

  /* ----------------------------------------------------------
     RIGHT SIDE DONOR FORM HTML
  ---------------------------------------------------------- */
  function buildFormHTML(invoiceId) {
    /* Pre-render all 12 Gujarati Donation Category Rows */
    var donationCategoryRows = CATEGORIES.map(function (c, i) {
      return '<div class="__awd-cat-form-row">' +
        '<div class="__awd-cat-num">' + (i + 1) + '</div>' +
        '<div class="__awd-cat-name">' + esc(c.label) + '</div>' +
        '<div class="__awd-cat-input-group">' +
          '<input type="number" min="0" step="0.01" value="" placeholder="0.00" ' +
            'class="__awd-cat-amt-input" data-cat="' + c.key + '" />' +
          '<div class="__awd-cat-unit">રૂપિયા</div>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="__awd-form-card">' +

      /* ── Section 1: Donor General Details ── */
      '<div class="__awd-card-section">' +
        '<div class="__awd-section-header">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<div class="__awd-accent-bar"></div>' +
            '<div>' +
              '<h3>દાતાની સામાન્ય વિગતો</h3>' +
              '<div style="font-size:11px;color:#64748b;margin-top:1px">Donor General Details</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="__awd-grid-2">' +
          '<div class="__awd-field">' +
            '<label>પહોંચ નંબર (Receipt No.)</label>' +
            '<input type="text" id="__awd-receipt-no-input" value="----" readonly style="background:#f8fafc;font-weight:700;color:#334155" />' +
          '</div>' +
          '<div class="__awd-field">' +
            '<label>તારીખ (Date) *</label>' +
            '<input type="date" id="__awd-date" value="' + today() + '" />' +
          '</div>' +
        '</div>' +

        '<div class="__awd-field">' +
          '<label>દાતાનું નામ (Donor Name) *</label>' +
          '<input type="text" id="__awd-donor-name" placeholder="પૂરું નામ દાખલ કરો (e.g. શાંતીનાથ જૈન સંઘ)" />' +
        '</div>' +

        '<div class="__awd-field">' +
          '<label>સરનામું (Address)</label>' +
          '<textarea id="__awd-address" rows="2" placeholder="દાતાનું સરનામું (વૈકલ્પિક)" style="resize:vertical"></textarea>' +
        '</div>' +

        '<div class="__awd-grid-2">' +
          '<div class="__awd-field">' +
            '<label>ચુકવણી પદ્ધતિ (Payment Mode)</label>' +
            '<select id="__awd-payment-mode">' +
              '<option>રોકડ</option>' +
              '<option>ચેક</option>' +
              '<option>બેંક ટ્રાન્સફર</option>' +
              '<option>UPI</option>' +
              '<option>DD</option>' +
            '</select>' +
          '</div>' +
          '<div class="__awd-field">' +
            '<label>રકમ શબ્દોમાં (Amount in Words)</label>' +
            '<input type="text" id="__awd-amount-words" placeholder="દા.ત. પાંચ હજાર પૂરા" />' +
          '</div>' +
        '</div>' +

        '<div class="__awd-field" style="margin-bottom:0">' +
          '<label>નોંધ / વિગત (Remarks)</label>' +
          '<input type="text" id="__awd-remarks" placeholder="વૈકલ્પિક નોંધ અથવા વિગત" />' +
        '</div>' +
      '</div>' +

      /* ── Section 2: Donation Fields (Pre-rendered Categories + Reset Button) ── */
      '<div class="__awd-card-section">' +
        '<div class="__awd-section-header">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<div class="__awd-accent-bar"></div>' +
            '<div>' +
              '<h3>દાન વિગતો</h3>' +
              '<div style="font-size:11px;color:#64748b;margin-top:1px">Donation Fields</div>' +
            '</div>' +
          '</div>' +
          '<button type="button" id="__awd-clear-donations-btn" class="__awd-clear-btn" title="બધી રકમ સાફ કરો">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>' +
            '</svg>' +
            'સાફ કરો' +
          '</button>' +
        '</div>' +

        /* Pre-rendered list of 12 donation category rows */
        '<div class="__awd-cat-list">' +
          donationCategoryRows +
        '</div>' +

        '<div class="__awd-total-bar">' +
          '<span class="lbl">કુલ દાન રકમ (Total Amount):</span>' +
          '<span class="val" id="__awd-total-display">રૂ. 0.00</span>' +
        '</div>' +
      '</div>' +

      '<input type="hidden" id="__awd-invoice-id" value="' + esc(invoiceId || '') + '" />' +
    '</div>';
  }

  /* ----------------------------------------------------------
     SYNC RECEIPT PREVIEW WITH FORM DATA
  ---------------------------------------------------------- */
  function syncReceipt(modal) {
    function setText(id, value) {
      var el = modal.querySelector('#' + id);
      if (el) el.textContent = value;
    }
    function val(id) {
      var el = modal.querySelector('#' + id);
      return el ? (el.value || '').trim() : '';
    }

    /* Donor Details */
    setText('__awd-rc-donor-name', val('__awd-donor-name') || '\u2014');
    setText('__awd-rc-address', val('__awd-address') || '\u2014');
    setText('__awd-rc-date', val('__awd-date') ? fmtDateDisplay(val('__awd-date')) : '--');
    setText('__awd-rc-payment-mode', val('__awd-payment-mode') || 'રોકડ');
    setText('__awd-rc-remarks', val('__awd-remarks') || '');

    /* Sum category amounts from pre-rendered input fields */
    var catTotals = {};
    var totalSum = 0;

    CATEGORIES.forEach(function (c) {
      var inp = modal.querySelector('.__awd-cat-amt-input[data-cat="' + c.key + '"]');
      var amt = inp ? (parseFloat(inp.value) || 0) : 0;
      catTotals[c.key] = amt;
      totalSum += amt;
    });

    /* Update Table Rows on Left Receipt — all 12 fields are always shown
       pre-listed on the receipt; only the Rs./Paisa values update live */
    CATEGORIES.forEach(function (c) {
      var amt = catTotals[c.key];
      var rsEl = modal.querySelector('#__awd-rc-rs-' + c.key);
      var psEl = modal.querySelector('#__awd-rc-ps-' + c.key);
      var trEl = modal.querySelector('#__awd-rc-tr-' + c.key);

      if (rsEl && psEl) {
        if (amt > 0) {
          var rupees = Math.floor(amt);
          var paise = Math.round((amt - rupees) * 100);
          rsEl.textContent = rupees;
          psEl.textContent = String(paise).padStart(2, '0');
          if (trEl) trEl.classList.add('active-row');
        } else {
          rsEl.textContent = '--';
          psEl.textContent = '00';
          if (trEl) trEl.classList.remove('active-row');
        }
      }
    });

    /* Total Displays */
    var totalRs = Math.floor(totalSum);
    var totalPs = Math.round((totalSum - totalRs) * 100);

    setText('__awd-rc-amt-num', totalSum > 0 ? fmtPlain(totalSum) : '0');
    setText('__awd-rc-total-rs', String(totalRs));
    setText('__awd-rc-total-ps', String(totalPs).padStart(2, '0'));
    setText('__awd-total-display', 'રૂ. ' + fmt(totalSum));

    /* Amount in Words auto-suggest if blank */
    var wordsInput = modal.querySelector('#__awd-amount-words');
    if (wordsInput && (!wordsInput.value || wordsInput.dataset.autoFilled === '1')) {
      if (totalSum > 0) {
        wordsInput.value = numToGujaratiWords(totalSum);
        wordsInput.dataset.autoFilled = '1';
      } else {
        wordsInput.value = '';
      }
    }
    setText('__awd-rc-amt-words', val('__awd-amount-words') || (totalSum <= 0 ? 'શૂન્ય રૂપિયા પૂરા' : '\u2014'));

    return totalSum;
  }

  /* ----------------------------------------------------------
     DOWNLOAD RECEIPT AS PDF (direct instant file download)
  ---------------------------------------------------------- */
  function downloadReceipt(modal) {
    var receiptEl = modal.querySelector('#__awd-receipt');
    if (!receiptEl) { showToast('Receipt not found.', true); return; }

    function performDownload() {
      showToast('PDF ડાઉનલોડ થઈ રહ્યો છે… (Downloading PDF…)', false);

      /* Temporarily unclamp receipt for complete canvas capture */
      var origOverflow = receiptEl.style.overflow;
      var origMaxH = receiptEl.style.maxHeight;
      receiptEl.style.overflow = 'visible';
      receiptEl.style.maxHeight = 'none';

      var col = receiptEl.closest('.__awd-receipt-col');
      var colOrigOverflow = col ? col.style.overflow : null;
      var colOrigMaxH = col ? col.style.maxHeight : null;
      if (col) { col.style.overflow = 'visible'; col.style.maxHeight = 'none'; }

      var h2cFn = window.html2canvas || (typeof html2canvas !== 'undefined' ? html2canvas : null);
      if (!h2cFn) {
        showToast('PDF library loading failed. Please try again.', true);
        return;
      }

      h2cFn(receiptEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      }).then(function (canvas) {
        /* Restore original view constraints */
        receiptEl.style.overflow = origOverflow;
        receiptEl.style.maxHeight = origMaxH;
        if (col) { col.style.overflow = colOrigOverflow || ''; col.style.maxHeight = colOrigMaxH || ''; }

        var imgData = canvas.toDataURL('image/png', 1.0);
        var JS_PDF = (window.jspdf && window.jspdf.jsPDF) || (typeof jsPDF !== 'undefined' ? jsPDF : null);
        if (!JS_PDF) {
          showToast('jsPDF library missing.', true);
          return;
        }

        var doc = new JS_PDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        var pdfW = doc.internal.pageSize.getWidth();   /* 210mm */
        var pdfH = doc.internal.pageSize.getHeight();  /* 297mm */
        var margin = 8; /* mm */
        var usableW = pdfW - margin * 2;
        var imgW = canvas.width;
        var imgH = canvas.height;
        var ratio = imgH / imgW;
        var drawH = usableW * ratio;

        if (drawH > pdfH - margin * 2) {
          drawH = pdfH - margin * 2;
          usableW = drawH / ratio;
        }

        var xOff = (pdfW - usableW) / 2;
        doc.addImage(imgData, 'PNG', xOff, margin, usableW, drawH);

        /* Get receipt number for clean filename */
        var rcNoEl = modal.querySelector('#__awd-rc-receipt-no');
        var rcNoStr = rcNoEl ? rcNoEl.textContent.trim().replace(/[^A-Za-z0-9\-]/g, '') : 'receipt';
        var filename = 'Donation_Receipt_' + rcNoStr + '.pdf';

        /* Trigger direct instant file download in browser */
        doc.save(filename);
        showToast('PDF સફળતાપૂર્વક ડાઉનલોડ થઈ ગયું! (Downloaded successfully!)', false);
      }).catch(function (err) {
        receiptEl.style.overflow = origOverflow;
        receiptEl.style.maxHeight = origMaxH;
        if (col) { col.style.overflow = colOrigOverflow || ''; col.style.maxHeight = colOrigMaxH || ''; }
        console.error('PDF download error:', err);
        showToast('PDF ડાઉનલોડ કરવામાં ભૂલ આવી.', true);
      });
    }

    /* If libraries are preloaded, execute instantly; else fallback to dynamic script load */
    var hasH2C = !!(window.html2canvas || typeof html2canvas !== 'undefined');
    var hasPDF = !!(window.jspdf || typeof jsPDF !== 'undefined');

    if (hasH2C && hasPDF) {
      performDownload();
    } else {
      showToast('PDF લાઈબ્રેરી લોડ થઈ રહી છે…', false);
      var loadScript = function (src, cb) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = cb;
        document.head.appendChild(s);
      };
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function () {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', function () {
          performDownload();
        });
      });
    }
  }

  /* ----------------------------------------------------------
     PRINT RECEIPT PREVIEW
  ---------------------------------------------------------- */
  function printReceipt(modal) {
    var receiptEl = modal.querySelector('#__awd-receipt');
    if (!receiptEl) return;
    var w = window.open('', '_blank', 'width=860,height=1120');
    if (!w) { showToast('Please allow pop-ups to print receipt.', true); return; }
    w.document.open();
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8" />' +
      '<title>પ્રાણી કલ્યાણ દાન પહોંચ</title>' +
      '<style>' +
        'body{margin:0;padding:24px;background:#F8FAFC;' +
          'font-family:"Noto Sans Gujarati", sans-serif;}' +
        '.__awd-receipt{max-width:720px;margin:0 auto;}' +
        receiptCSS() +
        '@media print{body{padding:0;background:#ffffff;}}' +
      '</style></head><body>' +
      receiptEl.outerHTML +
      '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 350);
  }

  /* ----------------------------------------------------------
     TOAST NOTIFICATIONS
  ---------------------------------------------------------- */
  function showToast(message, isError) {
    var old = document.getElementById('__awd-toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.id = '__awd-toast';
    toast.style.cssText =
      'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
      'background:' + (isError ? '#ef4444' : '#16a34a') + ';color:#ffffff;' +
      'padding:12px 24px;border-radius:10px;font-size:13.5px;font-weight:700;' +
      'font-family:"Plus Jakarta Sans", sans-serif;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:99999;' +
      'pointer-events:none;white-space:nowrap;' +
      'opacity:0;transition:opacity .2s ease;';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.style.opacity = '1'; });
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 250);
    }, 3500);
  }

  var _realFetch = window.fetch;

  /* ----------------------------------------------------------
     OPEN FULL PAGE DONATION UI
  ---------------------------------------------------------- */
  window.__openAnimalWelfareDonation = function (invoiceId) {
    injectStyles();
    var old = document.getElementById('__awd-overlay');
    if (old) old.remove();

    var prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* ── Measure the Angular navbar height so overlay sits below it ── */
    var navbarEl = document.querySelector(
      'nav, .nav-wrapper, mat-toolbar, header, .premium-header, .header-container, app-header'
    );
    /* Walk up to the outermost fixed/sticky ancestor (the real header bar) */
    var navH = 0;
    if (navbarEl) {
      var el = navbarEl;
      while (el && el !== document.body) {
        var st = window.getComputedStyle(el);
        if (st.position === 'fixed' || st.position === 'sticky') {
          navH = el.offsetHeight;
          break;
        }
        el = el.parentElement;
      }
      if (!navH) navH = navbarEl.closest('header, [class*=header], [class*=navbar], mat-toolbar') ?
        (navbarEl.closest('header, [class*=header], [class*=navbar], mat-toolbar').offsetHeight) : navbarEl.offsetHeight;
    }
    /* Fallback: scan all fixed elements at top of page */
    if (!navH) {
      document.querySelectorAll('*').forEach(function(e) {
        var s = window.getComputedStyle(e);
        if ((s.position === 'fixed' || s.position === 'sticky') && parseInt(s.top || '0') <= 4 && e.offsetHeight > 40 && e.offsetHeight < 200) {
          if (e.offsetHeight > navH) navH = e.offsetHeight;
        }
      });
    }
    if (!navH) navH = 64; /* safe default */
    document.documentElement.style.setProperty('--awd-nav-h', navH + 'px');

    var prevUrl = window.location.href;
    try { window.history.pushState({ __awd: true }, '', '/donation'); } catch(e) {}

    var overlay = document.createElement('div');
    overlay.id = '__awd-overlay';
    overlay.className = '__awd-overlay';
    overlay.style.paddingTop = '0';

    var modal = document.createElement('div');
    modal.className = '__awd-modal';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    /* Manage active states across header tabs */
    var prevActiveItems = Array.from(document.querySelectorAll('.nav-wrapper .nav-item.active, .mobile-bottom-nav .mob-tab.active'));
    document.querySelectorAll('.nav-wrapper .nav-item, .mobile-bottom-nav .mob-tab').forEach(function(el) {
      el.classList.remove('active');
    });

    var dBtn = document.getElementById('nav-donation-btn') || document.querySelector('.nav-wrapper .awd-nav-tab');
    if (dBtn) dBtn.classList.add('active');
    var mBtn = document.getElementById('mob-donation-btn') || document.querySelector('.mobile-bottom-nav .awd-mob-tab');
    if (mBtn) mBtn.classList.add('active');

    function cleanup() {
      overlay.remove();
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.removeProperty('--awd-nav-h');
      if (dBtn) dBtn.classList.remove('active');
      if (mBtn) mBtn.classList.remove('active');

      prevActiveItems.forEach(function(el) {
        el.classList.add('active');
      });

      try {
        if (window.location.pathname === '/donation') {
          window.history.pushState({}, '', prevUrl);
        }
      } catch(e) {}
    }

    function onPopState(e) {
      if (e.state && e.state.__awd) return;
      overlay.remove();
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.removeProperty('--awd-nav-h');
      window.removeEventListener('popstate', onPopState);
    }
    window.addEventListener('popstate', onPopState);

    function renderPage() {
      modal.innerHTML =
        '<div class="__awd-split">' +
          /* LEFT: Gujarati Receipt Preview */
          '<div class="__awd-receipt-col">' +
            buildReceiptHTML() +
          '</div>' +

          /* RIGHT: Donor General Details + Pre-rendered Donation Fields Form */
          '<div class="__awd-form-col">' +
            buildFormHTML(invoiceId) +
            '<div id="__awd-error" style="display:none;color:#dc2626;background:#fef2f2;border:1px solid #fecaca;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px"></div>' +
          '</div>' +
        '</div>' +

        /* BOTTOM ACTION BUTTONS BAR */
        '<div class="__awd-bottom-actions">' +
          '<button type="button" class="__awd-btn __awd-btn-cancel" id="__awd-cancel-btn">' +
            '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>' +
            'Cancel Donation (રદ કરો)' +
          '</button>' +
          '<button type="button" class="__awd-btn __awd-btn-print" id="__awd-print-btn">' +
            '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>' +
            'Print (પ્રિન્ટ)' +
          '</button>' +
          '<button type="button" class="__awd-btn __awd-btn-download" id="__awd-download-btn">' +
            '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-7 2h14v2H5v-2z"/></svg>' +
            'Download PDF (ડાઉનલોડ)' +
          '</button>' +
          '<button type="button" class="__awd-btn __awd-btn-pay" id="__awd-submit-btn">' +
            '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' +
            'Mark as Paid (ચૂકવાયેલ તરીકે માર્ક કરો)' +
          '</button>' +
        '</div>';

      /* Wire Event Listeners for Pre-rendered Category Inputs */
      modal.querySelectorAll('.__awd-cat-amt-input').forEach(function (inp) {
        inp.addEventListener('input', function () { syncReceipt(modal); });
      });

      /* Top-Right Clear / Reset Button ('સાફ કરો') */
      var clearBtn = modal.querySelector('#__awd-clear-donations-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          modal.querySelectorAll('.__awd-cat-amt-input').forEach(function (inp) {
            inp.value = '';
          });
          syncReceipt(modal);
          showToast('બધી રકમ સાફ કરી દેવામાં આવી છે.', false);
        });
      }

      /* Wire General Fields to Receipt */
      ['__awd-donor-name', '__awd-date', '__awd-address', '__awd-payment-mode', '__awd-amount-words', '__awd-remarks'].forEach(function (id) {
        var el = modal.querySelector('#' + id);
        if (!el) return;
        var evt = (el.tagName === 'SELECT') ? 'change' : 'input';
        el.addEventListener(evt, function () {
          if (id === '__awd-amount-words') el.dataset.autoFilled = '0';
          syncReceipt(modal);
        });
      });

      syncReceipt(modal);

      /* ---- Receipt number: load latest AWD-XXXXXX from server on open ---- */
      (function loadNextReceiptNumber() {
        var token = getToken();
        if (!token) return;
        _realFetch(API_BASE + '/animal-welfare-donations', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (rows) {
            var nextNum = 1;
            if (Array.isArray(rows) && rows.length > 0) {
              var last = rows[0].receipt_number || '';
              var m = last.match(/AWD-0*(\d+)/);
              if (m) nextNum = parseInt(m[1], 10) + 1;
            }
            var nextStr = 'AWD-' + String(nextNum).padStart(6, '0');
            var rcEl = modal.querySelector('#__awd-rc-receipt-no');
            var rcInput = modal.querySelector('#__awd-receipt-no-input');
            if (rcEl) rcEl.textContent = nextStr;
            if (rcInput) rcInput.value = nextStr;
          })
          .catch(function () {});
      })();

      /* Action Buttons */
      modal.querySelector('#__awd-cancel-btn').onclick = function () {
        cleanup();
        window.removeEventListener('popstate', onPopState);
      };

      modal.querySelector('#__awd-print-btn').onclick = function () {
        printReceipt(modal);
      };

      /* Download: save to DB first to get sequential AWD-XXXXXX, then download PDF */
      modal.querySelector('#__awd-download-btn').onclick = function () {
        if (savedDonation) {
          downloadReceipt(modal);
        } else {
          doSave(function () {
            downloadReceipt(modal);
          });
        }
      };

      /* Save / Mark as Paid Button */
      var savedDonation = null;

      function doSave(onSuccess) {
        var errEl = modal.querySelector('#__awd-error');
        errEl.style.display = 'none';

        var donorName = (modal.querySelector('#__awd-donor-name').value || '').trim();
        var date = modal.querySelector('#__awd-date').value;
        var total = syncReceipt(modal);

        if (!donorName) {
          errEl.textContent = 'દાતાનું નામ જરૂરી છે (Donor Name is required).';
          errEl.style.display = 'block';
          modal.querySelector('#__awd-donor-name').focus();
          return;
        }
        if (!date) {
          errEl.textContent = 'કૃપા કરી તારીખ પસંદ કરો (Please select date).';
          errEl.style.display = 'block';
          return;
        }
        if (total <= 0) {
          errEl.textContent = 'ઓછામાં ઓછી એક શ્રેણીમાં રકમ દાખલ કરો (Enter amount in at least one category).';
          errEl.style.display = 'block';
          return;
        }

        var payload = {
          invoice_id: modal.querySelector('#__awd-invoice-id').value || null,
          donor_name: donorName,
          address: modal.querySelector('#__awd-address').value || '',
          date: date,
          amount: total,
          amount_in_words: modal.querySelector('#__awd-amount-words').value || '',
          payment_mode: modal.querySelector('#__awd-payment-mode').value,
          remarks: modal.querySelector('#__awd-remarks').value || '',
        };

        CATEGORIES.forEach(function (c) {
          var inp = modal.querySelector('.__awd-cat-amt-input[data-cat="' + c.key + '"]');
          payload[c.key] = inp ? (parseFloat(inp.value) || 0) : 0;
        });

        var saveBtn = modal.querySelector('#__awd-submit-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'સાચવી રહ્યા છે… (Saving)';

        _realFetch(API_BASE + '/animal-welfare-donations', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        })
          .then(function (r) {
            return r.json().then(function (d) {
              if (!r.ok) throw new Error(d.message || 'સાચવવામાં નિષ્ફળ');
              return d;
            });
          })
          .then(function (data) {
            savedDonation = data.donation;

            /* Update receipt number in UI with the real sequential DB number */
            if (savedDonation && savedDonation.receipt_number) {
              var rcEl = modal.querySelector('#__awd-rc-receipt-no');
              var rcInput = modal.querySelector('#__awd-receipt-no-input');
              if (rcEl) rcEl.textContent = savedDonation.receipt_number;
              if (rcInput) rcInput.value = savedDonation.receipt_number;
            }

            saveBtn.disabled = false;
            saveBtn.innerHTML =
              '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>' +
              'ચૂકવાયેલ (Paid) ✓';
            showToast('સફળ! ' + (savedDonation.receipt_number || '') + ' DB માં સાચવ્યું.', false);

            if (typeof onSuccess === 'function') onSuccess(savedDonation);
          })
          .catch(function (err) {
            saveBtn.disabled = false;
            saveBtn.innerHTML =
              '<svg class="__awd-btn-icon" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' +
              'Mark as Paid (ચૂકવાયેલ તરીકે માર્ક કરો)';
            var errEl2 = modal.querySelector('#__awd-error');
            if (errEl2) { errEl2.textContent = err.message || 'ભૂલ આવી. ફરી પ્રયાસ કરો.'; errEl2.style.display = 'block'; }
          });
      }

      modal.querySelector('#__awd-submit-btn').onclick = function () { doSave(); };
    }

    renderPage();
  };

  /* ----------------------------------------------------------
     INJECT "Donation" NAV ITEM INTO EXISTING HEADER
  ---------------------------------------------------------- */
  function copyNgAttributes(sourceEl, targetEl) {
    if (!sourceEl || !targetEl) return;
    for (var i = 0; i < sourceEl.attributes.length; i++) {
      var attr = sourceEl.attributes[i];
      if (attr.name.indexOf('_ngcontent') === 0) {
        targetEl.setAttribute(attr.name, attr.value);
        var children = targetEl.querySelectorAll('*');
        for (var j = 0; j < children.length; j++) {
          children[j].setAttribute(attr.name, attr.value);
        }
        break;
      }
    }
  }

  function injectHeaderButton() {
    // Superadmin does not have access to the Donation module — skip injection entirely.
    if (getUserRole() === 'superadmin') return;

    var role = getUserRole();

    // For admin: hide all non-Donation nav items so only Donation is visible.
    if (role === 'admin') {
      var navWrapper = document.querySelector('.nav-wrapper');
      if (navWrapper) {
        var allNavItems = navWrapper.querySelectorAll('.nav-item');
        allNavItems.forEach(function(item) {
          // Keep the donation button if it already exists; hide everything else.
          if (item.id !== 'nav-donation-btn' && !item.classList.contains('awd-nav-tab')) {
            item.style.display = 'none';
          }
        });
        // Also hide the injected Bulk Stock tab
        var bulkTab = navWrapper.querySelector('.bulk-stock-tab');
        if (bulkTab) bulkTab.style.display = 'none';
      }
      var mobileNav = document.querySelector('.mobile-bottom-nav');
      if (mobileNav) {
        var allMobTabs = mobileNav.querySelectorAll('.mob-tab');
        allMobTabs.forEach(function(tab) {
          if (tab.id !== 'mob-donation-btn' && !tab.classList.contains('awd-mob-tab')) {
            tab.style.display = 'none';
          }
        });
        var bulkMobTab = mobileNav.querySelector('.bulk-stock-mob');
        if (bulkMobTab) bulkMobTab.style.display = 'none';
      }
    }

    /* ── Desktop nav ── */
    var navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper && !document.getElementById('nav-donation-btn')) {
      /* Double check text content safety net */
      var alreadyHasText = false;
      var items = navWrapper.querySelectorAll('.nav-item');
      for (var k = 0; k < items.length; k++) {
        if ((items[k].textContent || '').indexOf('Donation') !== -1) {
          alreadyHasText = true;
          break;
        }
      }

      if (!alreadyHasText && items.length > 0) {
        var sibling = items[0];
        var isDonationActive = window.location.pathname === '/donation';
        if (isDonationActive) {
          items.forEach(function(it) { it.classList.remove('active'); });
        }
        var a = document.createElement('a');
        a.id = 'nav-donation-btn';
        a.className = 'nav-item awd-nav-tab' + (isDonationActive ? ' active' : '');
        a.style.cursor = 'pointer';
        a.setAttribute('href', '/donation');
        a.innerHTML = '<mat-icon class="mat-icon material-icons" role="img" aria-hidden="true">volunteer_activism</mat-icon><span>Donation</span>';
        
        copyNgAttributes(sibling, a);

        a.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.__openAnimalWelfareDonation(null);
        });
        navWrapper.appendChild(a);
      }
    }

    /* ── Mobile bottom nav ── */
    var mobileNav = document.querySelector('.mobile-bottom-nav');
    if (mobileNav && !document.getElementById('mob-donation-btn')) {
      var mobAlreadyHasText = false;
      var mobTabs = mobileNav.querySelectorAll('.mob-tab');
      for (var mk = 0; mk < mobTabs.length; mk++) {
        if ((mobTabs[mk].textContent || '').indexOf('Donation') !== -1) {
          mobAlreadyHasText = true;
          break;
        }
      }

      if (!mobAlreadyHasText && mobTabs.length > 0) {
        var mobSibling = mobTabs[0];
        var isMobDonationActive = window.location.pathname === '/donation';
        var m = document.createElement('a');
        m.id = 'mob-donation-btn';
        m.className = 'mob-tab awd-mob-tab' + (isMobDonationActive ? ' active' : '');
        m.style.cursor = 'pointer';
        m.setAttribute('href', '/donation');
        m.innerHTML = '<mat-icon class="mat-icon material-icons" role="img" aria-hidden="true">volunteer_activism</mat-icon><span>Donation</span>';

        copyNgAttributes(mobSibling, m);

        m.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.__openAnimalWelfareDonation(null);
        });

        var lastMob = mobTabs[mobTabs.length - 1];
        lastMob.parentNode.insertBefore(m, lastMob.nextSibling);
      }
    }
  }

  /* Auto-open if URL is /donation */
  function checkUrlNavigation() {
    var role = getUserRole();
    var path = window.location.pathname;

    // Admin is restricted to /donation only — redirect any other module URL.
    if (role === 'admin') {
      var blockedPaths = ['/dashboard', '/products', '/billing', '/invoices', '/bulk-stock', '/accounting'];
      for (var i = 0; i < blockedPaths.length; i++) {
        if (path === blockedPaths[i] || path.indexOf(blockedPaths[i] + '/') === 0) {
          window.location.replace('/donation');
          return;
        }
      }
    }

    if (path === '/donation') {
      // Superadmin is not allowed to access the Donation page — redirect to dashboard.
      if (role === 'superadmin') {
        window.location.replace('/dashboard');
        return;
      }
      if (!document.getElementById('__awd-overlay')) {
        window.__openAnimalWelfareDonation(null);
      }
    }
  }

  injectStyles();

  /* ── MutationObserver: re-inject whenever DOM changes ── */
  var observer = new MutationObserver(function () {
    injectHeaderButton();
    checkUrlNavigation();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /* ── Angular Router navigation detection ──
     Angular uses History API (pushState/replaceState) for SPA routing.
     We patch these so that every route change (including post-login
     redirect to /dashboard) triggers a fresh injection attempt.
     This fixes the race where Angular re-renders the nav after login
     before the Donation button has been injected.
  ── */
  (function patchHistoryForNavInjection() {
    function afterNavigation() {
      // Give Angular one tick to finish rendering the new nav, then inject.
      setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 0);
      setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 150);
      setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 400);
      setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 1000);
    }

    var _pushState = history.pushState.bind(history);
    history.pushState = function () {
      _pushState.apply(history, arguments);
      afterNavigation();
    };

    var _replaceState = history.replaceState.bind(history);
    history.replaceState = function () {
      _replaceState.apply(history, arguments);
      afterNavigation();
    };

    window.addEventListener('popstate', afterNavigation);
  })();

  /* ── Initial page load retries ── */
  injectHeaderButton();
  checkUrlNavigation();
  setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 300);
  setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 800);
  setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 2000);
  setTimeout(function () { injectHeaderButton(); checkUrlNavigation(); }, 4000);

})();
