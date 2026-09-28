/**
 * LEXJURIS - Official Legal Notice Studio & Drafter Engine
 * Bar Council of India compliant automated statutory notice generator
 * Structured according to the authentic Karnataka & Indian Court Legal Notice Formats:
 * - Legal Notice by R.P.A.D. title & postal dispatch mode
 * - Addressee structure (Name, s/o or w/o, Age, Residence, Village/Hobli/Taluk/District)
 * - Preamble instruction clause ("Under the Instructions of our client...")
 * - Numbered statutory paragraphs ("1. That...", "2. That...")
 * - Land / Property Schedule Table (Sl.no., Case/LAC No., Name, Survey No., Extent, and Territory Note)
 * - Requisition & Demand clause ("Therefore, you are hereby called upon...")
 * - Advocate notice fee charges clause ("You are further notified to pay...")
 * - Multi-page continuation markers (Contd..2, Page 2)
 * - Sign-off (Place, Date, Advocate Name & Title)
 * - Postscript postal delivery notice (RPAD & Certificate of Postings)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. NOTICE TEMPLATES REGISTRY (FORMAT PRESETS)
  // ==========================================================================
  const NOTICE_TEMPLATES = {
    // ------------------------------------------------------------------------
    // FORMAT 1: General Statutory Legal Notice (Universal Court RPAD Format)
    // ------------------------------------------------------------------------
    general_notice: {
      categoryName: 'General Legal Notice (By R.P.A.D.)',
      statute: 'Bar Council of India Statutory Standard & Applicable Civil/Criminal Law',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.2,000/-',
      subjectBuilder: (d) => ``, // Notice format uses pure "LEGAL NOTICE BY R.P.A.D:" header
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Main Court Road, Bangalore.',
        advocatePlace: 'Bangalore',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST A.D. AND COPY BY CERTIFICATE OF POSTINGS',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Smt. / Sri. [Client Name]',
        clientParentage: 'w/o / s/o [Father / Spouse Name]',
        clientAge: 'aged about 45 years',
        clientAddress: '1st Cross, Gandhi Nagar, Bangalore - 560009',
        recipientName: 'Sri. / Smt. [Opposite Party Name]',
        recipientParentage: 's/o [Father’s Name]',
        recipientAge: 'Aged about 50 years',
        recipientAddress: 'Door No. 14, 2nd Main Road, Jayanagar, Bangalore - 560011',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.2,000/- towards this notice charges.',
        facts: `That our client has entered into lawful transactions and mutual covenants with you, which you have failed and neglected to adhere to despite repeated verbal and written requests.\n\nThat by your willful omission, breach of trust, and failure to fulfill legal obligations, you have caused severe monetary loss, mental agony, and hardship to our client.\n\nThat you are legally, morally, and statutorily liable to rectify the default, clear the legitimate dues/obligations, and compensate our client for the losses suffered.`
      },
      paragraphsBuilder: (d) => {
        if (d.customFactsFormatted && d.customFactsFormatted.length > 0) {
          return d.customFactsFormatted;
        }
        return [
          `That our client has had lawful dealings and legal transactions with you as known to both parties.`,
          `That you the Noticee have failed, neglected, and defaulted in performing your obligations towards our client, despite several reminders.`,
          `That by your continued neglect and breach of covenants, you have caused substantial monetary loss and hardship to our client.`,
          `That you are legally liable to fulfill the demands of our client as requisitioned hereunder.`
        ];
      },
      demandClauseBuilder: (d) => `
        <p>Therefore, you are hereby called upon to comply with the requisitions of our client within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong> from the date of receipt of this notice, failing which we have specific Instructions to initiate both Civil and Criminal proceedings against you before the Competent Court of Law.</p>
      `,
      warningClauseBuilder: (d) => ``
    },

    // ------------------------------------------------------------------------
    // FORMAT 2: Matrimonial, Maintenance & Protection Notice
    // ------------------------------------------------------------------------
    matrimonial_maintenance: {
      categoryName: 'Maintenance & Matrimonial Notice',
      statute: 'Hindu Marriage Act, 1955 read with Section 125 Cr.P.C. / BNSS & Domestic Violence Act, 2005',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.2,000/-',
      subjectBuilder: (d) => ``,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST A.D. AND COPY BY CERTIFICATE OF POSTINGS',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Smt. [Client Wife Name]',
        clientParentage: 'w/o Sri. [Husband Name]',
        clientAge: 'aged about 45 years',
        clientAddress: 'No. 15, 1st Cross, Gandhi Nagar, Bengaluru - 560009',
        recipientName: 'Sri. [Opposite Party / Husband Name]',
        recipientParentage: 's/o [Father Name]',
        recipientAge: 'Aged about 50 years',
        recipientAddress: 'Door No. 24, 2nd Main Road, Jayanagar, Bengaluru - 560011',
        matrimonialMarriageDuration: 'about 15 years back',
        matrimonialMarriagePlace: 'as per Hindu Custom and Rites prevailed under Hindu Law at [City/Place]',
        matrimonialHusbandAssets: 'owning substantial agricultural properties, commercial assets, and business earning an annual income exceeding Rs.8,00,000/-',
        matrimonialMonthlyClaim: '15,000/- per month',
        matrimonialWifeCondition: 'having no independent means of income and unable to maintain herself due to ailments and age',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.2,000/- towards this notice charges.',
        facts: `That about 15 years back, you got married to our client as per Hindu Custom and Rites prevailed under Hindu Law. Yourself and our client lived as husband and wife.\n\nThat our client performed all her duties and matrimonial obligations, even though you and your family members subjected her to harassment, cruelty, deserted her, and neglected to provide maintenance.\n\nThat our client has no independent source of income and is unable to maintain herself.\n\nThat you are in possession of substantial properties and income, and you are legally and statutorily liable under Hindu Law and Section 125 Cr.P.C. to pay monthly maintenance of Rs.15,000/- per month to our client for food, clothing, shelter, and medical necessities.`
      },
      paragraphsBuilder: (d) => {
        if (d.customFactsFormatted && d.customFactsFormatted.length > 0) {
          return d.customFactsFormatted;
        }
        return [
          `That ${escapeHtml(d.matrimonialMarriageDuration || 'years back')}, you got married to our client ${escapeHtml(d.matrimonialMarriagePlace || 'as per Hindu Custom and Rites prevailed under Hindu Law')}. Yourself and our client lived as husband and wife.`,
          `That our client was performing all her duties and matrimonial obligations, even though you and your family members subjected her to cruelty, deserted her, and cast her out of the matrimonial home.`,
          `That our client is ${escapeHtml(d.matrimonialWifeCondition || 'having no independent means of livelihood and is unable to maintain herself')}.`,
          `That you are ${escapeHtml(d.matrimonialHusbandAssets || 'owning substantial assets and income')} and are legally bound to pay monthly maintenance of <strong>Rs.${escapeHtml(d.matrimonialMonthlyClaim || '15,000/- per month')}</strong> to our client for her food, clothing, shelter, and medical care.`
        ];
      },
      demandClauseBuilder: (d) => `
        <p>Therefore, you are hereby called upon to make arrangements for the above said maintenance amount towards our client within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong> from the date of receipt of this notice, failing which we have specific Instructions to initiate both Civil and Criminal proceedings against you before the Competent Court of Law.</p>
      `,
      warningClauseBuilder: (d) => ``
    },

    // ------------------------------------------------------------------------
    // FORMAT 3: Land / Property Representation & Particulars Schedule Table
    // ------------------------------------------------------------------------
    land_acquisition_claim: {
      categoryName: 'Land Schedule & Requisition Notice',
      statute: 'Section 18(1) Land Acquisition Act / Revenue & Property Law',
      letterheadStyle: 'classic_girish',
      demandWindow: 'Immediate',
      noticeFee: '',
      subjectBuilder: (d) => ``,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Our Clients (Claimants / Land Owners)',
        clientParentage: 'Represented by Special Counsel',
        clientAddress: '[Locality / Village], [Taluk], [District]',
        recipientName: 'Special Land Acquisition Officer / Competent Authority',
        recipientDesignation: 'Sub-Division Office, [District]',
        recipientAddress: 'Office of the Land Acquisition Officer / Assistant Commissioner, [District]',
        laoStatutorySection: 'Section 18(1) of the Land Acquisition Act',
        laoCourtReference: 'Hon’ble Civil Judge (Senior Division) Court',
        laoScheduleTerritoryNote: 'Note : Scheduled land parcels situated at [Village Name] Village, [Hobli Name] Hobli, [Taluk Name] Taluk.',
        facts: `That our clients filed petition under Section 18(1) of the Land Acquisition Act for referring the matter to the Hon’ble Civil Judge (Senior Division) Court for proper adjudication and enhancement of compensation amount, and the petitions have been allowed in favour of our clients.\n\nThat as requested by your office to furnish the specific schedule particulars with respect to village, survey numbers, measurements, and LAC reference numbers, we are furnishing the following particulars for verification and immediate disbursement.`
      },
      paragraphsBuilder: (d) => [
        `That our clients filed petition under <strong>${escapeHtml(d.laoStatutorySection || 'Section 18(1) of the Land Acquisition Act')}</strong>, referring the matter to the <strong>${escapeHtml(d.laoCourtReference || 'Hon’ble Civil Judge (Senior Division) Court')}</strong> for proper adjudication and enhancement of compensation amount, which has been allowed in favour of our clients.`,
        `That as requested by your office to furnish particulars regarding village, survey numbers, measurements, and L.A.C. reference numbers, we are furnishing the schedule particulars hereunder for your official verification and records:`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <p>Hence, you are requested to verify the said court records and disburse the enhanced statutory compensation along with all solatium and accrued interest to our clients at the earliest.</p>
      `,
      warningClauseBuilder: (d) => ``
    },

    // ------------------------------------------------------------------------
    // FORMAT 4: Cancellation of Registered GPA & Restraint on Sale
    // ------------------------------------------------------------------------
    gpa_cancellation: {
      categoryName: 'Cancellation of Registered GPA & Injunction',
      statute: 'Sections 201-208 Indian Contract Act, 1872 & Section 31 Specific Relief Act, 1963',
      letterheadStyle: 'firm_bss',
      demandWindow: 'Immediately upon receipt',
      noticeFee: 'Rs.2,000/-',
      subjectBuilder: (d) => ``,
      defaultDemo: {
        letterheadStyle: 'firm_bss',
        advocateFirmName: 'Sharma & Associates, Advocates',
        advocateName: 'Adv. S. Sharma, BAL, LLB',
        advocatePartner2: 'Adv. R. Verma, BALaw, LLB',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        advocatePhone2: '98450-67890',
        advocateLandline: '080-22345678',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Smt. / Sri. [Principal Client Name]',
        clientParentage: 'w/o / s/o [Father / Spouse Name], aged about 65 Years',
        clientAddress: 'Door No. 12, 3rd Cross, [Locality], Bengaluru - 560001',
        gpaCoExecutants: '& co-principals / legal heirs',
        recipientName: '1. Sri. [Agent / Attorney Holder 1], aged about 45 years, [Address]\n2. Sri. [Agent / Attorney Holder 2], aged about 48 years, [Address]',
        recipientAddress: 'Bengaluru, Karnataka',
        gpaExecutionDate: '15-04-2021',
        gpaRevocationDate: '10-02-2026',
        gpaPropertySchedule: 'Property bearing Survey No. [X], measuring [Y] acres/guntas situated at [Village/Locality], [Taluk], [District]',
        gpaRefusalNote: 'Noticee intentionally avoided prior communication; this notice is issued on client’s peremptory instructions.',
        demandCureWindow: 'Immediately upon receipt',
        noticeAdvocateFee: 'Rs.2,000/- towards this notice charges.',
        facts: `That our client executed a Registered General Power of Attorney in your favour on 15-04-2021 in order to manage the scheduled immovable property.\n\nThat our client states that she/he is not inclined to continue the General Power of Attorney and has revoked, cancelled, and rescinded the said Power of Attorney with immediate effect.\n\nWherefore, you are hereby directed not to transact, sell, mortgage, encumber, or alienate the scheduled property in any manner whatsoever under the cancelled power of attorney.`
      },
      paragraphsBuilder: (d) => {
        if (d.customFactsFormatted && d.customFactsFormatted.length > 0) {
          return d.customFactsFormatted;
        }
        return [
          `That our client executed a Registered General Power of Attorney to you on <strong>${escapeHtml(d.gpaExecutionDate || 'date')}</strong> in respect of the property bearing <strong>${escapeHtml(d.gpaPropertySchedule || 'Scheduled Property')}</strong>. Now our client states that she/he is not inclined to continue the General Power of Attorney and has revoked and cancelled the General Power of Attorney.`,
          `Wherefore, you should not transact with the above lands, and both of you are hereby directed not to proceed with the General Power of Attorney as our client has cancelled the General Power of Attorney with effect from <strong>${escapeHtml(d.gpaRevocationDate || 'date')}</strong>.`,
          `If you move any transaction related to our client’s property, our clients are ready to initiate both criminal and civil cases against you in a competent court of law, and you shall be held liable for all costs and consequences in the above matter. ${d.gpaRefusalNote ? escapeHtml(d.gpaRefusalNote) : ''}`
        ];
      },
      demandClauseBuilder: (d) => ``,
      warningClauseBuilder: (d) => ``
    },

    // ------------------------------------------------------------------------
    // FORMAT 5: Cheque Dishonour (Section 138 NI Act)
    // ------------------------------------------------------------------------
    ni_act_138: {
      categoryName: 'Section 138 NI Act (Cheque Dishonour)',
      statute: 'Section 138 of the Negotiable Instruments Act, 1881 read with Section 420 IPC',
      letterheadStyle: 'lexjuris_crest',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.5,000/-',
      subjectBuilder: (d) => `STATUTORY LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 FOR DISHONOUR OF CHEQUE NO. ${d.niChequeNumber || '[Cheque No]'} DATED ${formatDateStr(d.niChequeDate) || '[Date]'} FOR ₹${d.niChequeAmount || '[Amount]'}`,
      defaultDemo: {
        letterheadStyle: 'lexjuris_crest',
        advocateName: 'Adv. S. V. Rao',
        advocateDegrees: 'B.A. LL.B. (Hons.)',
        advocateChambersAddress: 'High Court Chamber Block, Bangalore.',
        advocatePlace: 'Bangalore',
        advocatePhone: '98450-44321',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Sri. [Client Name]',
        clientParentage: 's/o [Father Name]',
        clientAge: 'Aged about 42 years',
        clientAddress: 'No. 24, Industrial Layout, Peenya, Bangalore',
        recipientName: 'M/s [Noticee Company / Drawer Name]',
        recipientDesignation: 'Attention: The Managing Director / Authorized Signatory',
        recipientAddress: 'Plot No. 88, Electronic City Phase-1, Bangalore - 560100',
        niChequeNumber: '482019',
        niChequeDate: '2026-08-15',
        niChequeAmount: '5,50,000',
        niBankDetails: 'HDFC Bank Ltd, MG Road Branch, Bangalore',
        niMemoDate: '2026-08-28',
        niDishonourReason: 'Funds Insufficient',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.5,000/- towards notice drafting charges.',
        facts: `That you the Noticee towards discharge of your existing legally enforceable debt and liability issued the Cheque bearing No. 482019 dated 15-08-2026 for ₹5,50,000/- drawn on your banker.\n\nThat upon presentation by my client through their banker, the said cheque was returned unpaid vide Bank Return Memo with remarks "FUNDS INSUFFICIENT".\n\nThat you had full knowledge of your depleted bank balance at the time of issuing the cheque, demonstrating dishonest intention from inception.`
      },
      paragraphsBuilder: (d) => [
        `That you, the Noticee, towards discharge of your legally enforceable debt, had issued in favour of our Client the Cheque bearing No. <strong>${escapeHtml(d.niChequeNumber || '[Cheque No]')}</strong> dated <strong>${escapeHtml(formatDateStr(d.niChequeDate) || '[Cheque Date]')}</strong> for an amount of <strong>₹${escapeHtml(d.niChequeAmount || '[Amount]')}/-</strong> drawn on <strong>${escapeHtml(d.niBankDetails || '[Drawee Bank]')}</strong>.`,
        `That our Client presented the said Cheque for encashment through their banker in due course, however, the said Cheque was returned dishonoured and unpaid vide Cheque Return Memo dated <strong>${escapeHtml(formatDateStr(d.niMemoDate) || '[Memo Date]')}</strong> with reasons <strong>"${escapeHtml(d.niDishonourReason || 'Funds Insufficient')}"</strong>.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, I HEREBY CALL UPON YOU:</div>
        <p>To make the full payment of the cheque amount of <strong>₹${escapeHtml(d.niChequeAmount || '[Amount]')}/-</strong> along with interest @ 18% p.a. within <strong>${escapeHtml(d.demandCureWindow || '15 (Fifteen) days')}</strong> from the receipt of this statutory notice.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>PLEASE TAKE NOTICE</strong> that failing compliance within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>, our Client has given peremptory instructions to initiate criminal proceedings under <strong>Section 138 of the Negotiable Instruments Act, 1881</strong> and <strong>Section 420 IPC</strong> before the Competent Magistrate Court holding you liable for imprisonment upto 2 years and fine upto twice the cheque amount.</p>
      `
    },

    // ------------------------------------------------------------------------
    // FORMAT 6: Money Recovery & Commercial Debt
    // ------------------------------------------------------------------------
    money_recovery: {
      categoryName: 'Money Recovery & Debt Dues',
      statute: 'Order 37 of the Code of Civil Procedure, 1908 & The Indian Contract Act, 1872',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.3,000/-',
      subjectBuilder: (d) => `FINAL LEGAL NOTICE FOR RECOVERY OF OUTSTANDING DUES OF ₹${d.mrTotalDebt || '[Amount]'}/- ALONG WITH INTEREST @ ${d.mrInterestRate || '18% P.A.'}`,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Sri. [Client / Creditor Name]',
        clientParentage: 's/o [Father Name]',
        clientAddress: 'Commercial Street, Bengaluru - 560001',
        recipientName: 'M/s [Debtor / Opposite Party Name]',
        recipientDesignation: 'Attention: The Proprietor / Director',
        recipientAddress: 'Industrial Area, Bengaluru - 560058',
        mrTotalDebt: '8,50,000',
        mrInterestRate: '18% p.a.',
        mrInvoiceNumber: 'INV-2025/104',
        mrTransactionNature: 'Supply of Commercial Goods and Services',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.3,000/- towards notice fee.',
        facts: `That our client duly delivered commercial goods as agreed upon and raised invoice which was acknowledged by you.\n\nThat as per agreed terms, payment was due upon delivery, but despite multiple reminders you have failed to clear the overdue amount.\n\nThat you are unlawfully withholding our client's funds without any justifiable cause.`
      },
      paragraphsBuilder: (d) => [
        `That our Client entered into lawful commercial dealings with you for providing <strong>${escapeHtml(d.mrTransactionNature || 'goods and services')}</strong>.`,
        `That our Client fulfilled all commitments and raised Invoice bearing No. <strong>${escapeHtml(d.mrInvoiceNumber || '[Invoice No]')}</strong> for an admitted sum of <strong>₹${escapeHtml(d.mrTotalDebt || '[Amount]')}/-</strong>.`,
        `That despite admitting the liability, you have deliberately neglected to liquidate the outstanding payment, causing severe financial harassment.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, WE HEREBY REQUISITION UPON YOU:</div>
        <p>To forthwith remit the total principal outstanding amount of <strong>₹${escapeHtml(d.mrTotalDebt || '[Amount]')}/-</strong> along with interest @ <strong>${escapeHtml(d.mrInterestRate || '18% p.a.')}</strong> within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong> from receipt hereof.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>BE INFORMED</strong> that in default, our Client shall immediately institute a <strong>Summary Suit under Order XXXVII CPC</strong> before the competent Civil Court holding you liable for all interest, damages, and litigation expenses.</p>
      `
    },

    // ------------------------------------------------------------------------
    // FORMAT 7: Tenant Eviction & Rent Default
    // ------------------------------------------------------------------------
    tenant_eviction: {
      categoryName: 'Tenant Eviction & Rent Default',
      statute: 'Section 106 of the Transfer of Property Act, 1882',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.2,500/-',
      subjectBuilder: (d) => `NOTICE OF TERMINATION OF MONTHLY TENANCY UNDER SECTION 106 T.P. ACT FOR VACATING DEMISED PREMISES AND CLEARING ARREARS OF ₹${d.teArrearsAmount || '[Arrears]'}`,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Smt. [Landlady / Owner Name]',
        clientParentage: 'w/o [Husband Name]',
        clientAddress: 'Main Road, Malleshwaram, Bengaluru - 560003',
        recipientName: 'Sri. [Tenant Name]',
        recipientDesignation: 'Tenant / Occupant',
        recipientAddress: 'Shop No. 4, Ground Floor, Commercial Complex, Bengaluru - 560003',
        tePropertyAddress: 'Shop No. 4, Ground Floor, Commercial Complex, Bengaluru - 560003',
        teMonthlyRent: '25,000/- per month',
        teArrearsAmount: '1,00,000 (4 months overdue)',
        teVacateDays: '15 days',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.2,500/- towards notice drafting charges.',
        facts: `That you were inducted as a monthly tenant in the scheduled premises at an agreed rent of Rs. 25,000/- per month.\n\nThat you have continuously defaulted in paying the agreed monthly rent for the last 4 consecutive months.\n\nThat the tenanted premises is required by our client for personal use and occupation.`
      },
      paragraphsBuilder: (d) => [
        `That our Client is the absolute owner of the tenanted property situated at <strong>${escapeHtml(d.tePropertyAddress || '[Demised Premises]')}</strong>.`,
        `That you were inducted as a monthly tenant at an agreed rent of <strong>₹${escapeHtml(d.teMonthlyRent || '[Rent]')}/-</strong> per month.`,
        `That you have defaulted in payment and are currently in chronic arrears amounting to <strong>₹${escapeHtml(d.teArrearsAmount || '[Arrears]')}/-</strong>.`,
        `That our Client hereby unequivocally determines and terminates your monthly tenancy upon expiry of <strong>${escapeHtml(d.teVacateDays || '15 days')}</strong>.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, YOU ARE HEREBY CALLED UPON TO:</div>
        <p>1. Hand over peaceful, vacant, and physical possession of the demised premises to our Client within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.<br>
        2. Clear the rental arrears of <strong>₹${escapeHtml(d.teArrearsAmount || '[Arrears]')}/-</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>PLEASE NOTE</strong> that failing compliance, an <strong>Eviction Suit for Possession, Recovery of Rent & Mesne Profits</strong> shall be instituted against you before the Court of Law.</p>
      `
    },

    // ------------------------------------------------------------------------
    // FORMAT 8: Breach of Contract
    // ------------------------------------------------------------------------
    contract_breach: {
      categoryName: 'Breach of Contract & Specific Performance',
      statute: 'The Specific Relief Act, 1963 & The Indian Contract Act, 1872',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.3,000/-',
      subjectBuilder: (d) => `LEGAL NOTICE FOR MATERIAL BREACH OF AGREEMENT DATED ${formatDateStr(d.cbAgreementDate) || '[Date]'} TITLED "${d.cbAgreementTitle || '[Agreement]'}"`,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'M/s [Client Company / Individual]',
        clientParentage: 'Represented by Authorized Signatory',
        clientAddress: 'MG Road, Bengaluru - 560001',
        recipientName: 'M/s [Defaulting Party Name]',
        recipientDesignation: 'Attention: Managing Director',
        recipientAddress: 'Industrial Zone, Whitefield, Bengaluru - 560066',
        cbAgreementDate: '2026-01-10',
        cbAgreementTitle: 'Services & Development Agreement',
        cbClauseBreached: 'Clause 4 (Deliverable Deadlines) and Quality Standards',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.3,000/- towards notice fees.',
        facts: `That our Client entered into an executed contract with you and released all milestone advances.\n\nThat you failed to adhere to the deliverable timelines and committed material breach of covenants.\n\nThat time was explicitly of the essence of the contract and your breach has caused massive financial losses.`
      },
      paragraphsBuilder: (d) => [
        `That our Client entered into an agreement titled <strong>"${escapeHtml(d.cbAgreementTitle || 'Agreement')}"</strong> dated <strong>${escapeHtml(formatDateStr(d.cbAgreementDate) || '[Date]')}</strong> with you.`,
        `That our Client duly performed all reciprocal promises and payments.`,
        `That you committed willful, fundamental breach of <strong>${escapeHtml(d.cbClauseBreached || 'contractual covenants')}</strong> by failing to adhere to obligations.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, OUR CLIENT HEREBY CALLS UPON YOU:</div>
        <p>To cure the default, specifically perform your obligations, and compensate our Client for liquidated damages within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>TAKE NOTICE</strong> that failing compliance, our Client shall initiate a Civil Suit for Injunction and Damages in the competent Court.</p>
      `
    },

    // ------------------------------------------------------------------------
    // FORMAT 9: Statutory Representation / Public Authority Letter
    // ------------------------------------------------------------------------
    utility_disconnection: {
      categoryName: 'Public Authority Representation',
      statute: 'Administrative & Statutory Representation Law',
      letterheadStyle: 'direct_authority',
      demandWindow: 'Immediate',
      noticeFee: '',
      subjectBuilder: (d) => `Representation regarding ${d.utilConnectionNumber || 'Connection / File No. [Number]'}.`,
      defaultDemo: {
        letterheadStyle: 'direct_authority',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: '[Applicant / Citizen Name]',
        clientParentage: 'Resident / Consumer',
        clientAddress: 'Bengaluru',
        recipientName: 'The Competent Officer / Authority',
        recipientDesignation: 'The Executive Engineer / Competent Authority',
        recipientAddress: 'Sub-Division Office, Public Utility Department',
        utilConnectionNumber: 'Account / Connection No. [Number]',
        utilRelocationReason: 'The applicant has relocated and the connection/service is no longer required',
        facts: `I am having a connection/service bearing No. [Number] and now the said connection is not required as I have relocated. Hence, please disconnect the said connection and refund the deposit amount after adjusting pending dues, if any.`
      },
      paragraphsBuilder: (d) => [
        `I am having a connection/record bearing <strong>No. ${escapeHtml(d.utilConnectionNumber || '[Number]')}</strong> and now the said service is not required as I have relocated.`,
        `Hence, please disconnect/close the said account and refund the Deposit Amount after adjusting the balance dues.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => ``,
      warningClauseBuilder: (d) => ``
    },

    // ------------------------------------------------------------------------
    // FORMAT 10: Consumer Protection
    // ------------------------------------------------------------------------
    consumer_deficiency: {
      categoryName: 'Consumer Protection (Deficiency of Service)',
      statute: 'The Consumer Protection Act, 2019',
      letterheadStyle: 'classic_girish',
      demandWindow: '15 (Fifteen) days',
      noticeFee: 'Rs.2,500/-',
      subjectBuilder: (d) => `LEGAL NOTICE UNDER CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY OF SERVICE REGARDING "${d.cpProductService || '[PRODUCT / SERVICE]'}"`,
      defaultDemo: {
        letterheadStyle: 'classic_girish',
        advocateName: 'Adv. S. Sharma',
        advocateDegrees: 'B.A.Law L.L.B.',
        advocateChambersAddress: 'Law Chambers, Lawyers Block, District Court Complex',
        advocatePlace: 'Bengaluru',
        advocatePhone: '98450-12345',
        noticeDispatchMode: 'REGISTERED POST WITH ACKNOWLEDGEMENT DUE (R.P.A.D.)',
        noticeDate: new Date().toISOString().split('T')[0],
        clientName: 'Sri. [Consumer / Client Name]',
        clientParentage: 's/o [Father Name]',
        clientAddress: 'Indiranagar, Bengaluru - 560038',
        recipientName: 'M/s [Seller / Service Provider Name]',
        recipientDesignation: 'The Managing Director / Customer Care Head',
        recipientAddress: 'Industrial Area, Bengaluru - 560058',
        cpProductService: '[Product / Service Name]',
        cpPurchaseAmount: '75,000',
        cpDefectNature: 'Critical defect and failure to honor warranty',
        demandCureWindow: '15 (Fifteen) days',
        noticeAdvocateFee: 'Rs.2,500/- towards notice fees.',
        facts: `That our client purchased the product for valuable consideration.\n\nThat the product suffered from persistent inherent defects amounting to gross deficiency of service under the Consumer Protection Act, 2019.\n\nThat despite warranty, you failed to repair or replace the product.`
      },
      paragraphsBuilder: (d) => [
        `That our Client purchased <strong>${escapeHtml(d.cpProductService || '[Product / Service]')}</strong> from you for consideration of <strong>₹${escapeHtml(d.cpPurchaseAmount || '[Amount]')}/-</strong>.`,
        `That the product suffered from severe defects, namely <strong>"${escapeHtml(d.cpDefectNature || 'Deficiency of Service')}"</strong>, amounting to gross deficiency under Section 2(11) of the CPA, 2019.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, OUR CLIENT DEMANDS THAT YOU:</div>
        <p>1. Immediately refund the amount of <strong>₹${escapeHtml(d.cpPurchaseAmount || '[Amount]')}/-</strong> with interest.<br>
        2. Pay reasonable compensation for mental agony and harassment within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>TAKE NOTE</strong> that in default, a formal Consumer Complaint shall be filed before the Consumer Disputes Redressal Commission.</p>
      `
    }
  };

  // Sample Land Schedule Data (Clean generic layout for parcels table)
  let landScheduleData = [
    { sl: '1', lac: 'LAC No. 12/2024', name: 'Sri. [Claimant 1]', sy: '45/2', extent: '01 Acre 10 Guntas' },
    { sl: '2', lac: 'LAC No. 15/2024', name: 'Smt. [Claimant 2]', sy: '48/1', extent: '00 Acre 28 Guntas' },
    { sl: '3', lac: 'LAC No. 18/2024', name: 'Sri. [Claimant 3]', sy: '52/3', extent: '02 Acres 05 Guntas' }
  ];

  // ==========================================================================
  // 2. STATE & DOM CACHE
  // ==========================================================================
  let currentNoticeType = 'general_notice';
  let isSerifFont = true;
  let isDirectEditMode = false;

  const elements = {};

  function cacheDomElements() {
    // Top Nav / User
    elements.userInitials = document.getElementById('userInitials');
    elements.displayUserName = document.getElementById('displayUserName');
    elements.displayUserSubtitle = document.getElementById('displayUserSubtitle');
    elements.userRoleBadge = document.getElementById('userRoleBadge');
    elements.avatarRoleIndicator = document.getElementById('avatarRoleIndicator');
    elements.toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
    elements.toastContainer = document.getElementById('toastContainer');

    // Category Grid & Action Buttons
    elements.noticeTypesGrid = document.getElementById('noticeTypesGrid');
    elements.btnOpenAiDrafterTop = document.getElementById('btnOpenAiDrafterTop');
    elements.btnQuickDemoLoad = document.getElementById('btnQuickDemoLoad');
    elements.btnResetNoticeForm = document.getElementById('btnResetNoticeForm');
    elements.linkDocketSelect = document.getElementById('linkDocketSelect');
    elements.letterheadStyleSelect = document.getElementById('letterheadStyleSelect');

    // Form inputs
    elements.noticeDispatchMode = document.getElementById('noticeDispatchMode');
    elements.noticeRefNumber = document.getElementById('noticeRefNumber');
    elements.noticeDate = document.getElementById('noticeDate');
    elements.clientFullName = document.getElementById('clientFullName');
    elements.clientParentage = document.getElementById('clientParentage');
    elements.clientAge = document.getElementById('clientAge');
    elements.clientFullAddress = document.getElementById('clientFullAddress');
    elements.recipientFullName = document.getElementById('recipientFullName');
    elements.recipientParentage = document.getElementById('recipientParentage');
    elements.recipientAge = document.getElementById('recipientAge');
    elements.recipientDesignation = document.getElementById('recipientDesignation');
    elements.recipientFullAddress = document.getElementById('recipientFullAddress');
    elements.mainFactualGrounds = document.getElementById('mainFactualGrounds');
    elements.btnEnhanceNarrative = document.getElementById('btnEnhanceNarrative');
    elements.demandCureWindow = document.getElementById('demandCureWindow');
    elements.noticeAdvocateFee = document.getElementById('noticeAdvocateFee');

    // Advocate Letterhead Inputs
    elements.advocateFullName = document.getElementById('advocateFullName');
    elements.advocateDegrees = document.getElementById('advocateDegrees');
    elements.advocatePlace = document.getElementById('advocatePlace');
    elements.advocateFirmName = document.getElementById('advocateFirmName');
    elements.advocatePartner2 = document.getElementById('advocatePartner2');
    elements.advocateChambersAddress = document.getElementById('advocateChambersAddress');
    elements.advocatePhone = document.getElementById('advocatePhone');
    elements.advocatePhone2 = document.getElementById('advocatePhone2');
    elements.advocateLandline = document.getElementById('advocateLandline');
    elements.advocateBarReg = document.getElementById('advocateBarReg');
    elements.advocateEmail = document.getElementById('advocateEmail');

    // Dynamic Category Inputs
    elements.matrimonialMarriageDuration = document.getElementById('matrimonialMarriageDuration');
    elements.matrimonialMarriagePlace = document.getElementById('matrimonialMarriagePlace');
    elements.matrimonialHusbandAssets = document.getElementById('matrimonialHusbandAssets');
    elements.matrimonialMonthlyClaim = document.getElementById('matrimonialMonthlyClaim');
    elements.matrimonialWifeCondition = document.getElementById('matrimonialWifeCondition');

    elements.laoStatutorySection = document.getElementById('laoStatutorySection');
    elements.laoCourtReference = document.getElementById('laoCourtReference');
    elements.laoScheduleTerritoryNote = document.getElementById('laoScheduleTerritoryNote');
    elements.btnAddScheduleRow = document.getElementById('btnAddScheduleRow');
    elements.btnLoadSampleSchedule = document.getElementById('btnLoadSampleSchedule');
    elements.scheduleTableEditorBody = document.getElementById('scheduleTableEditorBody');

    elements.gpaExecutionDate = document.getElementById('gpaExecutionDate');
    elements.gpaRevocationDate = document.getElementById('gpaRevocationDate');
    elements.gpaPropertySchedule = document.getElementById('gpaPropertySchedule');
    elements.gpaCoExecutants = document.getElementById('gpaCoExecutants');
    elements.gpaRefusalNote = document.getElementById('gpaRefusalNote');

    elements.utilAuthorityTitle = document.getElementById('utilAuthorityTitle');
    elements.utilConnectionNumber = document.getElementById('utilConnectionNumber');
    elements.utilRelocationReason = document.getElementById('utilRelocationReason');

    elements.niChequeNumber = document.getElementById('niChequeNumber');
    elements.niChequeDate = document.getElementById('niChequeDate');
    elements.niChequeAmount = document.getElementById('niChequeAmount');
    elements.niBankDetails = document.getElementById('niBankDetails');
    elements.niMemoDate = document.getElementById('niMemoDate');
    elements.niDishonourReason = document.getElementById('niDishonourReason');

    elements.mrTotalDebt = document.getElementById('mrTotalDebt');
    elements.mrInterestRate = document.getElementById('mrInterestRate');
    elements.mrInvoiceNumber = document.getElementById('mrInvoiceNumber');
    elements.mrTransactionNature = document.getElementById('mrTransactionNature');

    elements.tePropertyAddress = document.getElementById('tePropertyAddress');
    elements.teMonthlyRent = document.getElementById('teMonthlyRent');
    elements.teArrearsAmount = document.getElementById('teArrearsAmount');
    elements.teVacateDays = document.getElementById('teVacateDays');

    elements.cbAgreementDate = document.getElementById('cbAgreementDate');
    elements.cbAgreementTitle = document.getElementById('cbAgreementTitle');
    elements.cbClauseBreached = document.getElementById('cbClauseBreached');

    elements.cpProductService = document.getElementById('cpProductService');
    elements.cpPurchaseAmount = document.getElementById('cpPurchaseAmount');
    elements.cpDefectNature = document.getElementById('cpDefectNature');

    // Preview Elements
    elements.legalPaperDocument = document.getElementById('legalPaperDocument');
    elements.docLetterheadContainer = document.getElementById('docLetterheadContainer');
    elements.docDispatchMode = document.getElementById('docDispatchMode');
    elements.docRefRow = document.getElementById('docRefRow');
    elements.docRefNo = document.getElementById('docRefNo');
    elements.docNoticeDate = document.getElementById('docNoticeDate');
    elements.docConfidentialBadge = document.getElementById('docConfidentialBadge');

    elements.docRecipientName = document.getElementById('docRecipientName');
    elements.docRecipientParentage = document.getElementById('docRecipientParentage');
    elements.docRecipientAge = document.getElementById('docRecipientAge');
    elements.docRecipientDesig = document.getElementById('docRecipientDesig');
    elements.docRecipientAddress = document.getElementById('docRecipientAddress');

    elements.docSubjectBanner = document.getElementById('docSubjectBanner');
    elements.docSubjectText = document.getElementById('docSubjectText');
    elements.docSalutationText = document.getElementById('docSalutationText');

    elements.docClientName = document.getElementById('docClientName');
    elements.docClientParentage = document.getElementById('docClientParentage');
    elements.docClientAge = document.getElementById('docClientAge');
    elements.docClientAddress = document.getElementById('docClientAddress');
    elements.docPreambleText = document.getElementById('docPreambleText');

    elements.docNumberedParagraphs = document.getElementById('docNumberedParagraphs');
    elements.docScheduleContainer = document.getElementById('docScheduleContainer');
    elements.docContdMarker = document.getElementById('docContdMarker');
    elements.docPage2Header = document.getElementById('docPage2Header');

    elements.docDemandClause = document.getElementById('docDemandClause');
    elements.docFeeClause = document.getElementById('docFeeClause');
    elements.docAdvFeeText = document.getElementById('docAdvFeeText');
    elements.docWarningClause = document.getElementById('docWarningClause');

    elements.docSignPlace = document.getElementById('docSignPlace');
    elements.docSignDate = document.getElementById('docSignDate');
    elements.docSignAdvocateName = document.getElementById('docSignAdvocateName');
    elements.docSignTitle = document.getElementById('docSignTitle');
    elements.docSignBarReg = document.getElementById('docSignBarReg');
    elements.docPostscriptNotice = document.getElementById('docPostscriptNotice');

    // Toolbar buttons
    elements.btnOpenAiStudioModal = document.getElementById('btnOpenAiStudioModal');
    elements.btnToggleDirectEdit = document.getElementById('btnToggleDirectEdit');
    elements.directEditLabel = document.getElementById('directEditLabel');
    elements.btnFontToggle = document.getElementById('btnFontToggle');
    elements.btnCopyNoticeText = document.getElementById('btnCopyNoticeText');
    elements.btnDownloadWord = document.getElementById('btnDownloadWord');
    elements.btnPrintNotice = document.getElementById('btnPrintNotice');

    // AI Modal Elements
    elements.aiNoticeStudioModal = document.getElementById('aiNoticeStudioModal');
    elements.btnCloseAiModal = document.getElementById('btnCloseAiModal');
    elements.btnCancelAiModal = document.getElementById('btnCancelAiModal');
    elements.btnGenerateWithAi = document.getElementById('btnGenerateWithAi');
    elements.aiPromptInput = document.getElementById('aiPromptInput');
    elements.aiGenerationStatus = document.getElementById('aiGenerationStatus');
    elements.aiStatusText = document.getElementById('aiStatusText');
    elements.aiPolishInput = document.getElementById('aiPolishInput');
    elements.btnExecutePolish = document.getElementById('btnExecutePolish');
    elements.activeAiEngineLabel = document.getElementById('activeAiEngineLabel');
  }

  // ==========================================================================
  // 3. INITIALIZATION
  // ==========================================================================
  function init() {
    cacheDomElements();
    initDateDefaults();
    initDocketSelector();
    initScheduleTable();
    bindEventListeners();
    bindAiModalEvents();
    
    // Start with clean General Legal Notice format
    loadNoticeCategory('general_notice', true);
  }

  function initDateDefaults() {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    if (elements.noticeDate) elements.noticeDate.value = isoDate;
    if (elements.niChequeDate) elements.niChequeDate.value = isoDate;
    if (elements.niMemoDate) elements.niMemoDate.value = isoDate;
    if (elements.cbAgreementDate) elements.cbAgreementDate.value = isoDate;
  }

  function initDocketSelector() {
    if (!elements.linkDocketSelect) return;
    try {
      const raw = localStorage.getItem('lexjuris_cases_data');
      if (raw) {
        const cases = JSON.parse(raw);
        if (Array.isArray(cases) && cases.length > 0) {
          cases.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.caseNumber || 'Brief'} - ${c.clientName} vs ${c.opposingParty}`;
            elements.linkDocketSelect.appendChild(opt);
          });
        }
      }
    } catch (e) {
      console.warn('Could not load cases', e);
    }
  }

  // ==========================================================================
  // 4. EVENT BINDING & INTERACTIVITY
  // ==========================================================================
  function bindEventListeners() {
    // Category pills click
    if (elements.noticeTypesGrid) {
      elements.noticeTypesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.notice-type-card');
        if (btn) {
          const type = btn.dataset.type;
          document.querySelectorAll('.notice-type-card').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          loadNoticeCategory(type, true);
        }
      });
    }

    // Quick demo reload button
    if (elements.btnQuickDemoLoad) {
      elements.btnQuickDemoLoad.addEventListener('click', () => {
        loadNoticeCategory(currentNoticeType, true);
        showToast(`Loaded format particulars for ${NOTICE_TEMPLATES[currentNoticeType]?.categoryName || 'Notice'}`, 'info');
      });
    }

    // Reset button
    if (elements.btnResetNoticeForm) {
      elements.btnResetNoticeForm.addEventListener('click', () => {
        if (confirm('Clear all fields to start drafting a new blank notice?')) {
          resetAllFields();
          renderPreview();
          showToast('Notice fields cleared. Ready for input or AI drafter.', 'info');
        }
      });
    }

    // Letterhead style switch
    if (elements.letterheadStyleSelect) {
      elements.letterheadStyleSelect.addEventListener('change', () => {
        renderPreview();
      });
    }

    // Docket select
    if (elements.linkDocketSelect) {
      elements.linkDocketSelect.addEventListener('change', (e) => {
        handleDocketSelected(e.target.value);
      });
    }

    // Enhance Narrative Button
    if (elements.btnEnhanceNarrative) {
      elements.btnEnhanceNarrative.addEventListener('click', handlePolishNarrative);
    }

    // Toolbar buttons
    if (elements.btnFontToggle) {
      elements.btnFontToggle.addEventListener('click', toggleFontFamily);
    }
    if (elements.btnPrintNotice) {
      elements.btnPrintNotice.addEventListener('click', () => window.print());
    }
    if (elements.btnCopyNoticeText) {
      elements.btnCopyNoticeText.addEventListener('click', handleCopyText);
    }
    if (elements.btnDownloadWord) {
      elements.btnDownloadWord.addEventListener('click', handleDownloadWord);
    }
    if (elements.btnToggleDirectEdit) {
      elements.btnToggleDirectEdit.addEventListener('click', toggleDirectEditMode);
    }

    // Land Schedule Table Actions
    if (elements.btnAddScheduleRow) {
      elements.btnAddScheduleRow.addEventListener('click', () => {
        addScheduleRow();
      });
    }
    if (elements.btnLoadSampleSchedule) {
      elements.btnLoadSampleSchedule.addEventListener('click', () => {
        resetSampleSchedule();
        showToast('Reset sample parcel schedule rows', 'info');
      });
    }

    // Live update on any input in the form
    const form = document.getElementById('noticeBuilderForm');
    if (form) {
      form.addEventListener('input', () => {
        renderPreview();
      });
      form.addEventListener('change', () => {
        renderPreview();
      });
    }
  }

  function setActiveCategoryCard(typeKey) {
    document.querySelectorAll('.notice-type-card').forEach(c => {
      if (c.dataset.type === typeKey) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // 5. LAND SCHEDULE TABLE BUILDER
  // ==========================================================================
  function initScheduleTable() {
    renderScheduleEditor();
  }

  function renderScheduleEditor() {
    const tbody = elements.scheduleTableEditorBody;
    if (!tbody) return;
    tbody.innerHTML = '';

    landScheduleData.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" data-field="sl" data-idx="${idx}" value="${escapeHtml(row.sl)}"></td>
        <td><input type="text" data-field="lac" data-idx="${idx}" value="${escapeHtml(row.lac)}"></td>
        <td><input type="text" data-field="name" data-idx="${idx}" value="${escapeHtml(row.name)}"></td>
        <td><input type="text" data-field="sy" data-idx="${idx}" value="${escapeHtml(row.sy)}"></td>
        <td><input type="text" data-field="extent" data-idx="${idx}" value="${escapeHtml(row.extent)}"></td>
        <td><button type="button" class="btn-remove-row" data-idx="${idx}" title="Remove Row"><i class="fa-solid fa-trash"></i></button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const fld = e.target.dataset.field;
        if (landScheduleData[idx]) {
          landScheduleData[idx][fld] = e.target.value;
          renderPreview();
        }
      });
    });

    tbody.querySelectorAll('.btn-remove-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnEl = e.target.closest('.btn-remove-row');
        const idx = parseInt(btnEl.dataset.idx, 10);
        landScheduleData.splice(idx, 1);
        renderScheduleEditor();
        renderPreview();
      });
    });
  }

  function addScheduleRow() {
    const nextSl = String(landScheduleData.length + 1);
    landScheduleData.push({
      sl: nextSl,
      lac: '',
      name: '',
      sy: '',
      extent: ''
    });
    renderScheduleEditor();
    renderPreview();
  }

  function resetSampleSchedule() {
    landScheduleData = [
      { sl: '1', lac: 'LAC No. 12/2024', name: 'Sri. [Claimant 1]', sy: '45/2', extent: '01 Acre 10 Guntas' },
      { sl: '2', lac: 'LAC No. 15/2024', name: 'Smt. [Claimant 2]', sy: '48/1', extent: '00 Acre 28 Guntas' },
      { sl: '3', lac: 'LAC No. 18/2024', name: 'Sri. [Claimant 3]', sy: '52/3', extent: '02 Acres 05 Guntas' }
    ];
    renderScheduleEditor();
    renderPreview();
  }

  // ==========================================================================
  // 6. CATEGORY SWITCHING & FORM POPULATION
  // ==========================================================================
  function loadNoticeCategory(typeKey, populateDemo = false) {
    if (!NOTICE_TEMPLATES[typeKey]) typeKey = 'general_notice';
    currentNoticeType = typeKey;

    const dynamicContainers = {
      matrimonial_maintenance: 'dynamicFields_matrimonial_maintenance',
      land_acquisition_claim: 'dynamicFields_land_acquisition_claim',
      gpa_cancellation: 'dynamicFields_gpa_cancellation',
      utility_disconnection: 'dynamicFields_utility_disconnection',
      ni_act_138: 'dynamicFields_ni_act',
      money_recovery: 'dynamicFields_money_recovery',
      tenant_eviction: 'dynamicFields_tenant_eviction',
      contract_breach: 'dynamicFields_contract_breach',
      consumer_deficiency: 'dynamicFields_consumer_deficiency'
    };

    Object.keys(dynamicContainers).forEach(k => {
      const el = document.getElementById(dynamicContainers[k]);
      if (el) {
        if (k === typeKey) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    const tmpl = NOTICE_TEMPLATES[typeKey];

    if (tmpl.letterheadStyle && elements.letterheadStyleSelect) {
      elements.letterheadStyleSelect.value = tmpl.letterheadStyle;
    }

    if (tmpl.demandWindow && elements.demandCureWindow) {
      elements.demandCureWindow.value = tmpl.demandWindow;
    }
    if (elements.noticeAdvocateFee) {
      elements.noticeAdvocateFee.value = tmpl.noticeFee ? `${tmpl.noticeFee} towards this notice charges.` : '';
    }

    if (populateDemo) {
      const d = tmpl.defaultDemo;
      if (d) {
        if (elements.clientFullName) elements.clientFullName.value = d.clientName || '';
        if (elements.clientParentage) elements.clientParentage.value = d.clientParentage || '';
        if (elements.clientAge) elements.clientAge.value = d.clientAge || '';
        if (elements.clientFullAddress) elements.clientFullAddress.value = d.clientAddress || '';

        if (elements.recipientFullName) elements.recipientFullName.value = d.recipientName || '';
        if (elements.recipientParentage) elements.recipientParentage.value = d.recipientParentage || '';
        if (elements.recipientAge) elements.recipientAge.value = d.recipientAge || '';
        if (elements.recipientDesignation) elements.recipientDesignation.value = d.recipientDesignation || '';
        if (elements.recipientFullAddress) elements.recipientFullAddress.value = d.recipientAddress || '';

        if (elements.mainFactualGrounds) elements.mainFactualGrounds.value = d.facts || '';
        if (elements.noticeDate && d.noticeDate) elements.noticeDate.value = d.noticeDate;
        if (elements.noticeDispatchMode && d.noticeDispatchMode) elements.noticeDispatchMode.value = d.noticeDispatchMode;

        if (d.advocateName && elements.advocateFullName) elements.advocateFullName.value = d.advocateName;
        if (d.advocateDegrees && elements.advocateDegrees) elements.advocateDegrees.value = d.advocateDegrees;
        if (d.advocatePlace && elements.advocatePlace) elements.advocatePlace.value = d.advocatePlace;
        if (d.advocateChambersAddress && elements.advocateChambersAddress) elements.advocateChambersAddress.value = d.advocateChambersAddress;
        if (d.advocatePhone && elements.advocatePhone) elements.advocatePhone.value = d.advocatePhone;
        if (d.advocatePhone2 && elements.advocatePhone2) elements.advocatePhone2.value = d.advocatePhone2;
        if (d.advocateLandline && elements.advocateLandline) elements.advocateLandline.value = d.advocateLandline;
        if (d.advocateFirmName && elements.advocateFirmName) elements.advocateFirmName.value = d.advocateFirmName;
        if (d.advocatePartner2 && elements.advocatePartner2) elements.advocatePartner2.value = d.advocatePartner2;

        if (typeKey === 'matrimonial_maintenance') {
          if (elements.matrimonialMarriageDuration) elements.matrimonialMarriageDuration.value = d.matrimonialMarriageDuration || '';
          if (elements.matrimonialMarriagePlace) elements.matrimonialMarriagePlace.value = d.matrimonialMarriagePlace || '';
          if (elements.matrimonialHusbandAssets) elements.matrimonialHusbandAssets.value = d.matrimonialHusbandAssets || '';
          if (elements.matrimonialMonthlyClaim) elements.matrimonialMonthlyClaim.value = d.matrimonialMonthlyClaim || '';
          if (elements.matrimonialWifeCondition) elements.matrimonialWifeCondition.value = d.matrimonialWifeCondition || '';
        } else if (typeKey === 'land_acquisition_claim') {
          if (elements.laoStatutorySection) elements.laoStatutorySection.value = d.laoStatutorySection || '';
          if (elements.laoCourtReference) elements.laoCourtReference.value = d.laoCourtReference || '';
          if (elements.laoScheduleTerritoryNote) elements.laoScheduleTerritoryNote.value = d.laoScheduleTerritoryNote || '';
        } else if (typeKey === 'gpa_cancellation') {
          if (elements.gpaExecutionDate) elements.gpaExecutionDate.value = d.gpaExecutionDate || '';
          if (elements.gpaRevocationDate) elements.gpaRevocationDate.value = d.gpaRevocationDate || '';
          if (elements.gpaPropertySchedule) elements.gpaPropertySchedule.value = d.gpaPropertySchedule || '';
          if (elements.gpaCoExecutants) elements.gpaCoExecutants.value = d.gpaCoExecutants || '';
          if (elements.gpaRefusalNote) elements.gpaRefusalNote.value = d.gpaRefusalNote || '';
        } else if (typeKey === 'utility_disconnection') {
          if (elements.utilAuthorityTitle) elements.utilAuthorityTitle.value = d.recipientName || '';
          if (elements.utilConnectionNumber) elements.utilConnectionNumber.value = d.utilConnectionNumber || '';
          if (elements.utilRelocationReason) elements.utilRelocationReason.value = d.utilRelocationReason || '';
        } else if (typeKey === 'ni_act_138') {
          if (elements.niChequeNumber) elements.niChequeNumber.value = d.niChequeNumber || '';
          if (elements.niChequeDate) elements.niChequeDate.value = d.niChequeDate || '';
          if (elements.niChequeAmount) elements.niChequeAmount.value = d.niChequeAmount || '';
          if (elements.niBankDetails) elements.niBankDetails.value = d.niBankDetails || '';
          if (elements.niMemoDate) elements.niMemoDate.value = d.niMemoDate || '';
          if (elements.niDishonourReason) elements.niDishonourReason.value = d.niDishonourReason || 'Funds Insufficient';
        } else if (typeKey === 'money_recovery') {
          if (elements.mrTotalDebt) elements.mrTotalDebt.value = d.mrTotalDebt || '';
          if (elements.mrInterestRate) elements.mrInterestRate.value = d.mrInterestRate || '';
          if (elements.mrInvoiceNumber) elements.mrInvoiceNumber.value = d.mrInvoiceNumber || '';
          if (elements.mrTransactionNature) elements.mrTransactionNature.value = d.mrTransactionNature || '';
        } else if (typeKey === 'tenant_eviction') {
          if (elements.tePropertyAddress) elements.tePropertyAddress.value = d.tePropertyAddress || '';
          if (elements.teMonthlyRent) elements.teMonthlyRent.value = d.teMonthlyRent || '';
          if (elements.teArrearsAmount) elements.teArrearsAmount.value = d.teArrearsAmount || '';
          if (elements.teVacateDays) elements.teVacateDays.value = d.teVacateDays || '15 days';
        } else if (typeKey === 'contract_breach') {
          if (elements.cbAgreementDate) elements.cbAgreementDate.value = d.cbAgreementDate || '';
          if (elements.cbAgreementTitle) elements.cbAgreementTitle.value = d.cbAgreementTitle || '';
          if (elements.cbClauseBreached) elements.cbClauseBreached.value = d.cbClauseBreached || '';
        } else if (typeKey === 'consumer_deficiency') {
          if (elements.cpProductService) elements.cpProductService.value = d.cpProductService || '';
          if (elements.cpPurchaseAmount) elements.cpPurchaseAmount.value = d.cpPurchaseAmount || '';
          if (elements.cpDefectNature) elements.cpDefectNature.value = d.cpDefectNature || '';
        }
      }
    }

    renderPreview();
  }

  function handleDocketSelected(caseId) {
    if (!caseId) return;
    try {
      const raw = localStorage.getItem('lexjuris_cases_data');
      if (raw) {
        const cases = JSON.parse(raw);
        const c = cases.find(x => x.id === caseId);
        if (c) {
          if (elements.clientFullName) elements.clientFullName.value = c.clientName || '';
          if (elements.recipientFullName) elements.recipientFullName.value = c.opposingParty || '';
          if (elements.noticeRefNumber) elements.noticeRefNumber.value = `LJ/NOT/${(c.caseNumber || '2026').replace(/[^a-zA-Z0-9]/g, '_')}`;
          if (c.notes && elements.mainFactualGrounds && !elements.mainFactualGrounds.value) {
            elements.mainFactualGrounds.value = c.notes;
          }
          showToast(`Linked Case Docket: ${c.caseTitle || c.caseNumber}`, 'success');
          renderPreview();
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function resetAllFields() {
    if (elements.clientFullName) elements.clientFullName.value = '';
    if (elements.clientParentage) elements.clientParentage.value = '';
    if (elements.clientAge) elements.clientAge.value = '';
    if (elements.clientFullAddress) elements.clientFullAddress.value = '';

    if (elements.recipientFullName) elements.recipientFullName.value = '';
    if (elements.recipientParentage) elements.recipientParentage.value = '';
    if (elements.recipientAge) elements.recipientAge.value = '';
    if (elements.recipientDesignation) elements.recipientDesignation.value = '';
    if (elements.recipientFullAddress) elements.recipientFullAddress.value = '';
    if (elements.mainFactualGrounds) elements.mainFactualGrounds.value = '';

    const dynInputs = document.querySelectorAll('.dynamic-category-fields input, .dynamic-category-fields select');
    dynInputs.forEach(inp => inp.value = '');
  }

  // ==========================================================================
  // 7. FORM DATA COLLECTION & LIVE COURT RENDERING
  // ==========================================================================
  function collectFormData() {
    const rawFacts = elements.mainFactualGrounds ? elements.mainFactualGrounds.value.trim() : '';
    let customFactsFormatted = [];
    if (rawFacts) {
      const rawParas = rawFacts.split(/\n+/).filter(p => p.trim().length > 0);
      customFactsFormatted = rawParas.map(p => {
        let clean = p.replace(/^(\d+[\.\)]|\-|\*|\•)\s*/, '').trim();
        return escapeHtml(clean);
      });
    }

    return {
      letterheadStyle: elements.letterheadStyleSelect ? elements.letterheadStyleSelect.value : 'classic_girish',
      advocateName: elements.advocateFullName ? elements.advocateFullName.value : 'Adv. S. Sharma',
      advocateDegrees: elements.advocateDegrees ? elements.advocateDegrees.value : 'B.A.Law L.L.B.',
      advocatePlace: elements.advocatePlace ? elements.advocatePlace.value : 'Bengaluru',
      advocateFirmName: elements.advocateFirmName ? elements.advocateFirmName.value : '',
      advocatePartner2: elements.advocatePartner2 ? elements.advocatePartner2.value : '',
      advocateChambersAddress: elements.advocateChambersAddress ? elements.advocateChambersAddress.value : 'Law Chambers, Lawyers Block, District Court Complex',
      advocatePhone: elements.advocatePhone ? elements.advocatePhone.value : '98450-12345',
      advocatePhone2: elements.advocatePhone2 ? elements.advocatePhone2.value : '',
      advocateLandline: elements.advocateLandline ? elements.advocateLandline.value : '',
      advocateBar: elements.advocateBarReg ? elements.advocateBarReg.value : '',
      advocateEmail: elements.advocateEmail ? elements.advocateEmail.value : '',

      dispatchMode: elements.noticeDispatchMode ? elements.noticeDispatchMode.value : 'REGISTERED POST A.D. AND COPY BY CERTIFICATE OF POSTINGS',
      refNo: elements.noticeRefNumber ? elements.noticeRefNumber.value : '',
      noticeDate: elements.noticeDate ? elements.noticeDate.value : new Date().toISOString().split('T')[0],

      clientName: elements.clientFullName ? elements.clientFullName.value : '[Client Name]',
      clientParentage: elements.clientParentage ? elements.clientParentage.value : '',
      clientAge: elements.clientAge ? elements.clientAge.value : '',
      clientAddress: elements.clientFullAddress ? elements.clientFullAddress.value : '[Client Address]',

      recipientName: elements.recipientFullName ? elements.recipientFullName.value : '[Recipient Name]',
      recipientParentage: elements.recipientParentage ? elements.recipientParentage.value : '',
      recipientAge: elements.recipientAge ? elements.recipientAge.value : '',
      recipientDesignation: elements.recipientDesignation ? elements.recipientDesignation.value : '',
      recipientAddress: elements.recipientFullAddress ? elements.recipientFullAddress.value : '[Recipient Postal Address]',

      demandCureWindow: elements.demandCureWindow ? elements.demandCureWindow.value : '15 (Fifteen) days',
      noticeAdvocateFee: elements.noticeAdvocateFee ? elements.noticeAdvocateFee.value : 'Rs.2,000/- towards this notice charges.',

      matrimonialMarriageDuration: elements.matrimonialMarriageDuration ? elements.matrimonialMarriageDuration.value : '',
      matrimonialMarriagePlace: elements.matrimonialMarriagePlace ? elements.matrimonialMarriagePlace.value : '',
      matrimonialHusbandAssets: elements.matrimonialHusbandAssets ? elements.matrimonialHusbandAssets.value : '',
      matrimonialMonthlyClaim: elements.matrimonialMonthlyClaim ? elements.matrimonialMonthlyClaim.value : '',
      matrimonialWifeCondition: elements.matrimonialWifeCondition ? elements.matrimonialWifeCondition.value : '',

      laoStatutorySection: elements.laoStatutorySection ? elements.laoStatutorySection.value : '',
      laoCourtReference: elements.laoCourtReference ? elements.laoCourtReference.value : '',
      laoScheduleTerritoryNote: elements.laoScheduleTerritoryNote ? elements.laoScheduleTerritoryNote.value : '',

      gpaExecutionDate: elements.gpaExecutionDate ? elements.gpaExecutionDate.value : '',
      gpaRevocationDate: elements.gpaRevocationDate ? elements.gpaRevocationDate.value : '',
      gpaPropertySchedule: elements.gpaPropertySchedule ? elements.gpaPropertySchedule.value : '',
      gpaCoExecutants: elements.gpaCoExecutants ? elements.gpaCoExecutants.value : '',
      gpaRefusalNote: elements.gpaRefusalNote ? elements.gpaRefusalNote.value : '',

      utilAuthorityTitle: elements.utilAuthorityTitle ? elements.utilAuthorityTitle.value : '',
      utilConnectionNumber: elements.utilConnectionNumber ? elements.utilConnectionNumber.value : '',
      utilRelocationReason: elements.utilRelocationReason ? elements.utilRelocationReason.value : '',

      niChequeNumber: elements.niChequeNumber ? elements.niChequeNumber.value : '',
      niChequeDate: elements.niChequeDate ? elements.niChequeDate.value : '',
      niChequeAmount: elements.niChequeAmount ? elements.niChequeAmount.value : '',
      niBankDetails: elements.niBankDetails ? elements.niBankDetails.value : '',
      niMemoDate: elements.niMemoDate ? elements.niMemoDate.value : '',
      niDishonourReason: elements.niDishonourReason ? elements.niDishonourReason.value : '',

      mrTotalDebt: elements.mrTotalDebt ? elements.mrTotalDebt.value : '',
      mrInterestRate: elements.mrInterestRate ? elements.mrInterestRate.value : '',
      mrInvoiceNumber: elements.mrInvoiceNumber ? elements.mrInvoiceNumber.value : '',
      mrTransactionNature: elements.mrTransactionNature ? elements.mrTransactionNature.value : '',

      tePropertyAddress: elements.tePropertyAddress ? elements.tePropertyAddress.value : '',
      teMonthlyRent: elements.teMonthlyRent ? elements.teMonthlyRent.value : '',
      teArrearsAmount: elements.teArrearsAmount ? elements.teArrearsAmount.value : '',
      teVacateDays: elements.teVacateDays ? elements.teVacateDays.value : '',

      cbAgreementDate: elements.cbAgreementDate ? elements.cbAgreementDate.value : '',
      cbAgreementTitle: elements.cbAgreementTitle ? elements.cbAgreementTitle.value : '',
      cbClauseBreached: elements.cbClauseBreached ? elements.cbClauseBreached.value : '',

      cpProductService: elements.cpProductService ? elements.cpProductService.value : '',
      cpPurchaseAmount: elements.cpPurchaseAmount ? elements.cpPurchaseAmount.value : '',
      cpDefectNature: elements.cpDefectNature ? elements.cpDefectNature.value : '',

      customFactsFormatted: customFactsFormatted
    };
  }

  function renderPreview() {
    const tmpl = NOTICE_TEMPLATES[currentNoticeType] || NOTICE_TEMPLATES.general_notice;
    const d = collectFormData();

    // 1. Dynamic Letterhead
    renderLetterhead(d);

    // 2. Dispatch Meta & Date
    const formattedDate = formatDateIndian(d.noticeDate);
    if (elements.docNoticeDate) elements.docNoticeDate.textContent = formattedDate;

    if (elements.docDispatchMode) {
      if (currentNoticeType === 'utility_disconnection') {
        elements.docDispatchMode.textContent = '';
      } else {
        elements.docDispatchMode.textContent = 'LEGAL NOTICE BY R.P.A.D:';
      }
    }

    if (elements.docRefRow) {
      if (d.refNo && d.refNo.trim() !== '') {
        elements.docRefRow.style.display = 'block';
        if (elements.docRefNo) elements.docRefNo.textContent = d.refNo;
      } else {
        elements.docRefRow.style.display = 'none';
      }
    }

    if (elements.docConfidentialBadge) {
      if (currentNoticeType === 'utility_disconnection') {
        elements.docConfidentialBadge.style.display = 'none';
      } else {
        elements.docConfidentialBadge.style.display = 'block';
      }
    }

    // 3. Addressee
    renderAddressee(d);

    // 4. Subject Line
    const subjectContent = tmpl.subjectBuilder(d);
    if (elements.docSubjectBanner && elements.docSubjectText) {
      if (subjectContent && subjectContent.trim() !== '') {
        elements.docSubjectBanner.style.display = 'block';
        elements.docSubjectText.innerHTML = subjectContent;
      } else {
        elements.docSubjectBanner.style.display = 'none';
      }
    }

    // 5. Salutation & Preamble
    if (elements.docSalutationText) {
      if (currentNoticeType === 'utility_disconnection') {
        elements.docSalutationText.textContent = 'Dear Sir,';
        elements.docSalutationText.style.display = 'block';
      } else {
        elements.docSalutationText.style.display = 'none';
      }
    }

    renderPreamble(d);

    // 6. Numbered Paragraphs
    if (elements.docNumberedParagraphs) {
      const paras = tmpl.paragraphsBuilder(d);
      let html = '';
      paras.forEach((p, idx) => {
        if (currentNoticeType === 'utility_disconnection') {
          html += `<div class="legal-para-row"><div class="para-text">${p}</div></div>`;
        } else {
          html += `
            <div class="legal-para-row">
              <span class="para-num">${idx + 1}.</span>
              <div class="para-text">${p}</div>
            </div>
          `;
        }
      });
      elements.docNumberedParagraphs.innerHTML = html;
    }

    // 7. Schedule Table (For Land / Property Particulars)
    renderScheduleInParchment(d);

    // 8. Demand & Warning Clauses
    if (elements.docDemandClause) {
      const demandHtml = tmpl.demandClauseBuilder(d);
      if (demandHtml && demandHtml.trim() !== '') {
        elements.docDemandClause.style.display = 'block';
        elements.docDemandClause.innerHTML = demandHtml;
      } else {
        elements.docDemandClause.style.display = 'none';
      }
    }

    if (elements.docFeeClause && elements.docAdvFeeText) {
      if (d.noticeAdvocateFee && d.noticeAdvocateFee.trim() !== '' && currentNoticeType !== 'utility_disconnection' && currentNoticeType !== 'land_acquisition_claim') {
        elements.docFeeClause.style.display = 'block';
        elements.docAdvFeeText.textContent = d.noticeAdvocateFee.startsWith('pay') ? d.noticeAdvocateFee : `pay ${d.noticeAdvocateFee}`;
      } else {
        elements.docFeeClause.style.display = 'none';
      }
    }

    if (elements.docWarningClause) {
      const warningHtml = tmpl.warningClauseBuilder(d);
      if (warningHtml && warningHtml.trim() !== '') {
        elements.docWarningClause.style.display = 'block';
        elements.docWarningClause.innerHTML = warningHtml;
      } else {
        elements.docWarningClause.style.display = 'none';
      }
    }

    // 9. Sign-off & Signatures
    renderSignatureBlock(d);

    // 10. Postscript Notice
    if (elements.docPostscriptNotice) {
      if (currentNoticeType === 'utility_disconnection') {
        elements.docPostscriptNotice.style.display = 'none';
      } else {
        elements.docPostscriptNotice.style.display = 'block';
        elements.docPostscriptNotice.textContent = 'Notice is sent by registered post Acknowledgement due and a copy by Certificate of postings also.';
      }
    }

    // 11. Pagination / Contd Markers
    if (elements.docContdMarker && elements.docPage2Header) {
      if (currentNoticeType === 'utility_disconnection') {
        elements.docContdMarker.style.display = 'none';
        elements.docPage2Header.style.display = 'none';
      } else {
        elements.docContdMarker.style.display = 'block';
        elements.docPage2Header.style.display = 'block';
      }
    }

    if (isDirectEditMode) {
      enableParchmentDirectEdit();
    }
  }

  function renderLetterhead(d) {
    const container = elements.docLetterheadContainer;
    if (!container) return;

    if (d.letterheadStyle === 'classic_girish') {
      container.innerHTML = `
        <div class="letterhead-classic-girish">
          <div class="classic-girish-left">
            <div class="classic-adv-name">${escapeHtml(d.advocateName || 'ADVOCATE NAME')} <span class="classic-adv-degree">${escapeHtml(d.advocateDegrees || 'B.A.Law L.L.B.')}</span></div>
            <div class="classic-adv-chambers">${escapeHtml(d.advocateChambersAddress || 'Advocate Chambers, Court Road')}</div>
          </div>
          <div class="classic-girish-right">
            <div>Ph : ${escapeHtml(d.advocatePhone || '98450-12345')}</div>
            <div style="font-size:0.75rem; margin-top:0.2rem;">Dt : ${formatDateIndian(d.noticeDate)}</div>
          </div>
        </div>
      `;
    } else if (d.letterheadStyle === 'firm_bss') {
      container.innerHTML = `
        <div class="letterhead-firm-bss">
          <div class="firm-bss-top">${escapeHtml(d.advocateFirmName || 'LAW CHAMBERS & ASSOCIATES')}</div>
          <div class="firm-bss-body">
            <div class="firm-bss-left">
              <strong>${escapeHtml(d.advocateName || 'ADVOCATE 1, BAL, LLB')}</strong>
              <strong>${escapeHtml(d.advocatePartner2 || 'ADVOCATE 2, BALaw, LLb')}</strong>
              <div style="margin-top:0.35rem; font-weight:700;">ADVOCATES,</div>
              <div>${escapeHtml(d.advocateChambersAddress || 'CHAMBERS ADDRESS')}</div>
            </div>
            <div class="firm-bss-right">
              ${d.advocateLandline ? `<div>Phone.No: ${escapeHtml(d.advocateLandline)}</div>` : ''}
              <div>Mobile.No: ${escapeHtml(d.advocatePhone || '98450-12345')}</div>
              ${d.advocatePhone2 ? `<div>: ${escapeHtml(d.advocatePhone2)}</div>` : ''}
              <div style="margin-top:0.3rem;">Place: ${escapeHtml(d.advocatePlace || 'BENGALURU')}</div>
              <div>Date: ${formatDateIndian(d.noticeDate)}</div>
            </div>
          </div>
          <div class="firm-bss-divider"></div>
        </div>
      `;
    } else if (d.letterheadStyle === 'lexjuris_crest') {
      container.innerHTML = `
        <header class="legal-paper-header">
          <div class="letterhead-crest">
            <i class="fa-solid fa-scale-balanced crest-icon"></i>
          </div>
          <h1 class="advocate-heading-name">${escapeHtml((d.advocateName || 'ADV. COUNSEL').toUpperCase())}</h1>
          <div class="advocate-court-qualifications">${escapeHtml(d.advocateDegrees || 'B.A. LL.B. (Hons.), LL.M.')} • ADVOCATE ON RECORD / SENIOR COUNSEL</div>
          ${d.advocateBar ? `<div class="advocate-bar-council">Bar Council Enrollment No.: ${escapeHtml(d.advocateBar)}</div>` : ''}
          <div class="advocate-address-line">Chambers: ${escapeHtml(d.advocateChambersAddress || 'Lawyers Chambers Block')}</div>
          <div class="advocate-contact-line">Phone: ${escapeHtml(d.advocatePhone || '+91 98442 92690')} ${d.advocateEmail ? `• Email: ${escapeHtml(d.advocateEmail)}` : ''}</div>
        </header>
        <div class="legal-divider-double"></div>
      `;
    } else if (d.letterheadStyle === 'direct_authority') {
      container.innerHTML = `
        <div class="letterhead-direct-authority">
          <span>${formatDateIndian(d.noticeDate)}</span>
        </div>
      `;
    }
  }

  function renderAddressee(d) {
    const container = document.getElementById('docRecipientContainer');
    if (!container) return;

    if (currentNoticeType === 'gpa_cancellation' || (d.recipientName && d.recipientName.includes('\n'))) {
      const lines = d.recipientName.split('\n').filter(l => l.trim().length > 0);
      let html = '';
      lines.forEach(l => {
        html += `<div class="addressee-name" style="margin-bottom:0.35rem;">${escapeHtml(l)}</div>`;
      });
      if (d.recipientAddress && !d.recipientName.includes(d.recipientAddress)) {
        html += `<div class="addressee-address">${escapeHtml(d.recipientAddress)}</div>`;
      }
      container.innerHTML = html;
    } else {
      let html = `<div class="addressee-name">${escapeHtml(d.recipientName)}</div>`;
      if (d.recipientParentage) {
        html += `<div class="addressee-parentage">${escapeHtml(d.recipientParentage)},</div>`;
      }
      if (d.recipientAge) {
        html += `<div class="addressee-age">${escapeHtml(d.recipientAge)},</div>`;
      }
      if (d.recipientDesignation) {
        html += `<div class="addressee-desig">${escapeHtml(d.recipientDesignation)}</div>`;
      }
      if (d.recipientAddress) {
        html += `<div class="addressee-address">${escapeHtml(d.recipientAddress)}</div>`;
      }
      container.innerHTML = html;
    }
  }

  function renderPreamble(d) {
    const preambleEl = elements.docPreambleText;
    if (!preambleEl) return;

    if (currentNoticeType === 'utility_disconnection') {
      preambleEl.style.display = 'none';
      return;
    }

    preambleEl.style.display = 'block';

    if (currentNoticeType === 'land_acquisition_claim') {
      preambleEl.style.display = 'none';
    } else if (currentNoticeType === 'gpa_cancellation') {
      preambleEl.innerHTML = `
        Under the Instructions of our client <strong>${escapeHtml(d.clientName)}</strong> ${escapeHtml(d.clientParentage || '')} ${escapeHtml(d.gpaCoExecutants || '')}, residing at ${escapeHtml(d.clientAddress)}, we do hereby issue this notice to you as follows.
      `;
    } else {
      let clientDesc = `<strong>${escapeHtml(d.clientName)}</strong>`;
      if (d.clientParentage) clientDesc += ` ${escapeHtml(d.clientParentage)}`;
      if (d.clientAge) clientDesc += `, ${escapeHtml(d.clientAge)}`;
      if (d.clientAddress) clientDesc += `, R/at ${escapeHtml(d.clientAddress)}`;

      preambleEl.innerHTML = `
        Under the Instructions of our client ${clientDesc}, we do hereby issue this notice to you as follows.
      `;
    }
  }

  function renderScheduleInParchment(d) {
    const container = elements.docScheduleContainer;
    if (!container) return;

    if (currentNoticeType === 'land_acquisition_claim') {
      container.style.display = 'block';
      let tableRows = '';
      landScheduleData.forEach(r => {
        tableRows += `
          <tr>
            <td style="font-weight:700;">${escapeHtml(r.sl)}</td>
            <td>${escapeHtml(r.lac)}</td>
            <td>${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.sy)}</td>
            <td>${escapeHtml(r.extent)}</td>
          </tr>
        `;
      });

      container.innerHTML = `
        <table class="doc-schedule-table">
          <thead>
            <tr>
              <th style="width: 40px;">Sl.no.</th>
              <th>L.A.C.(Mis).No.</th>
              <th>Name</th>
              <th>Survey No</th>
              <th>Extent</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="doc-schedule-note">
          ${escapeHtml(d.laoScheduleTerritoryNote || 'Note : Furnished for court verification and records.')}
        </div>
      `;
    } else {
      container.style.display = 'none';
      container.innerHTML = '';
    }
  }

  function renderSignatureBlock(d) {
    if (elements.docSignPlace) elements.docSignPlace.textContent = `${d.advocatePlace || 'Place'}.`;
    if (elements.docSignDate) elements.docSignDate.textContent = `Date: ${formatDateIndian(d.noticeDate)}.`;

    if (currentNoticeType === 'utility_disconnection') {
      if (elements.docSignPlace) elements.docSignPlace.textContent = 'Thanking You,';
      if (elements.docSignDate) elements.docSignDate.textContent = '';
      if (elements.docSignPlaceholder) elements.docSignPlaceholder.textContent = "Your's Faithfully.";
      if (elements.docSignAdvocateName) elements.docSignAdvocateName.textContent = `[ ${escapeHtml(d.clientName || 'Applicant Name')} ]`;
      if (elements.docSignTitle) elements.docSignTitle.textContent = '';
    } else {
      if (elements.docSignPlaceholder) elements.docSignPlaceholder.textContent = '';
      if (elements.docSignAdvocateName) elements.docSignAdvocateName.textContent = `( ${escapeHtml(d.advocateName || 'Advocate Name')} )`;
      if (elements.docSignTitle) elements.docSignTitle.textContent = 'Advocate.';
    }
  }

  // ==========================================================================
  // 8. DIRECT PARCHMENT CLICK-TO-EDIT MODE
  // ==========================================================================
  function toggleDirectEditMode() {
    isDirectEditMode = !isDirectEditMode;
    const paper = elements.legalPaperDocument;
    const label = elements.directEditLabel;
    const btn = elements.btnToggleDirectEdit;

    if (!paper) return;

    if (isDirectEditMode) {
      paper.classList.add('editable-active');
      if (label) label.textContent = 'Direct Edit: ON';
      if (btn) btn.classList.add('active');
      enableParchmentDirectEdit();
      showToast('✏️ Direct Edit ON: Click anywhere on the paper notice to type or edit text!', 'info');
    } else {
      paper.classList.remove('editable-active');
      if (label) label.textContent = 'Direct Edit: Off';
      if (btn) btn.classList.remove('active');
      disableParchmentDirectEdit();
      showToast('Direct Edit Mode closed.', 'info');
    }
  }

  function enableParchmentDirectEdit() {
    const editableTargets = elements.legalPaperDocument.querySelectorAll(
      '.para-text, .addressee-name, .addressee-address, .doc-preamble, .doc-demand-clause p, .doc-fee-clause, .doc-subject-banner span'
    );
    editableTargets.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'true');
    });
  }

  function disableParchmentDirectEdit() {
    const editableTargets = elements.legalPaperDocument.querySelectorAll('[contenteditable="true"]');
    editableTargets.forEach(el => {
      el.removeAttribute('contenteditable');
    });
  }

  // ==========================================================================
  // 9. AI NOTICE DRAFTER ENGINE ("Take help from AI to type that notices")
  // ==========================================================================
  function bindAiModalEvents() {
    if (elements.btnOpenAiDrafterTop) {
      elements.btnOpenAiDrafterTop.addEventListener('click', openAiModal);
    }
    if (elements.btnOpenAiStudioModal) {
      elements.btnOpenAiStudioModal.addEventListener('click', openAiModal);
    }
    if (elements.btnCloseAiModal) {
      elements.btnCloseAiModal.addEventListener('click', closeAiModal);
    }
    if (elements.btnCancelAiModal) {
      elements.btnCancelAiModal.addEventListener('click', closeAiModal);
    }

    const tabs = document.querySelectorAll('.ai-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.ai-tab-pane').forEach(pane => {
          pane.style.display = (pane.id === targetTab) ? 'block' : 'none';
        });
      });
    });

    const chips = document.querySelectorAll('.ai-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const scenario = chip.dataset.scenario;
        if (elements.aiPromptInput) {
          elements.aiPromptInput.value = getScenarioPrompt(scenario);
        }
      });
    });

    if (elements.btnGenerateWithAi) {
      elements.btnGenerateWithAi.addEventListener('click', handleGenerateNoticeWithAi);
    }

    if (elements.btnExecutePolish) {
      elements.btnExecutePolish.addEventListener('click', handleExecuteAiPolish);
    }

    bindClauseInserter('insertClauseMaintenance', `It is further stated that you the Noticee are in possession of substantial agricultural lands, orchards, and independent businesses earning substantial income, and you are legally and morally liable to pay monthly maintenance of ₹15,000/- to our client for her food, clothing, shelter, and medical care under Hindu Law and Section 125 Cr.P.C.`);
    bindClauseInserter('insertClauseGpaCancel', `Wherefore, you are hereby unequivocally notified that the General Power of Attorney executed in your favour stands cancelled, revoked, and rescinded with immediate effect, and you are strictly restrained from alienating, encumbering, or executing any registered sale deeds in respect of the scheduled property.`);
    bindClauseInserter('insertClauseNoticeFee', `You are further notified to pay Rs.2,000/- towards counsel drafting expenses and statutory notice charges.`);
    bindClauseInserter('insertClausePenalWarning', `Failing compliance within the stipulated notice window, our client has given peremptory instructions to institute both Civil Suits for injunction and damages, and Criminal Complaints under Section 420, 406 & 498A IPC / BNS before the Competent Court of Law holding you entirely responsible for costs and consequences.`);
    bindClauseInserter('insertClausePostalDispatch', `Notice is sent by registered post Acknowledgement due (R.P.A.D.) and a copy by Certificate of postings also.`);
  }

  function openAiModal() {
    if (elements.aiNoticeStudioModal) {
      elements.aiNoticeStudioModal.classList.add('active');
    }
  }

  function closeAiModal() {
    if (elements.aiNoticeStudioModal) {
      elements.aiNoticeStudioModal.classList.remove('active');
    }
  }

  function getScenarioPrompt(scenario) {
    switch (scenario) {
      case 'matrimonial':
        return `Wife married 15 years ago, husband deserted her and refuses maintenance. Husband owns 5 acres irrigated lands earning 8 lakhs annually. Client has no income. Demand 15,000 per month maintenance within 15 days, failing which criminal proceedings u/s 125 CrPC and civil court case with Rs. 1,000 notice fee.`;
      case 'land_acq':
        return `Land Acquisition officer. Clients filed petition under Section 18(1) Land Acquisition Act referred to Civil Judge Senior Division for enhancement of compensation. Petitions allowed. Furnishing schedule of land parcels with LAC numbers and extents.`;
      case 'gpa_cancel':
        return `Client executed registered GPA in favour of agent for commercial land in Survey No. 45. Client now revokes and cancels the GPA immediately, directs agent not to transact, sell, or alienate the property, warns of civil and criminal cases with Rs. 2,000 notice fee.`;
      case 'cheque_bounce':
        return `Opposite party issued cheque no 482019 for ₹6,50,000/- drawn on bank which was returned dishonoured due to Funds Insufficient. Demand full payment within 15 days under Section 138 NI Act with 5,000 drafting charges.`;
      case 'tenant_evict':
        return `Tenant defaulted in paying monthly rent of 30,000 for 4 months (arrears 1,20,000). Tenancy terminated under Section 106 Transfer of Property Act. Demanding vacation of premises within 15 days and clearance of arrears.`;
      case 'debt_recovery':
        return `Client supplied commercial goods against invoice for ₹4,20,000. Debtor accepted goods but failed to clear invoice for 90 days. Demand full payment with 18% interest within 15 days failing which Order 37 CPC summary suit.`;
      default:
        return '';
    }
  }

  function bindClauseInserter(btnId, clauseText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const textarea = elements.mainFactualGrounds;
      if (textarea) {
        const cur = textarea.value.trim();
        textarea.value = cur ? `${cur}\n\n${clauseText}` : clauseText;
        renderPreview();
        showToast('✨ Statutory Clause inserted into Notice grounds!', 'success');
        closeAiModal();
      }
    });
  }

  async function handleGenerateNoticeWithAi() {
    const prompt = elements.aiPromptInput ? elements.aiPromptInput.value.trim() : '';
    if (!prompt) {
      showToast('Please type your case facts or select a scenario first.', 'warning');
      return;
    }

    if (elements.aiGenerationStatus) elements.aiGenerationStatus.style.display = 'block';
    if (elements.btnGenerateWithAi) elements.btnGenerateWithAi.disabled = true;

    let aiApiKey = '';
    try {
      const keysRaw = localStorage.getItem('jurisai_api_keys');
      if (keysRaw) {
        const keys = JSON.parse(keysRaw);
        aiApiKey = keys.gemini_api || keys.openai_api || keys.groq_api || '';
      }
    } catch (e) {}

    setTimeout(async () => {
      try {
        if (aiApiKey && typeof window.queryGeminiApi === 'function') {
          try {
            await runCloudAiDrafting(prompt);
            finishAiDrafting();
            return;
          } catch (err) {
            console.warn('Cloud API fallback to built-in legal engine', err);
          }
        }

        runBuiltInLegalAiDrafting(prompt);
        finishAiDrafting();
      } catch (err) {
        console.error(err);
        finishAiDrafting();
      }
    }, 600);
  }

  function finishAiDrafting() {
    if (elements.aiGenerationStatus) elements.aiGenerationStatus.style.display = 'none';
    if (elements.btnGenerateWithAi) elements.btnGenerateWithAi.disabled = false;
    closeAiModal();
    renderPreview();
    showToast('✨ Notice formatted into official court RPAD structure!', 'success');
  }

  function runBuiltInLegalAiDrafting(prompt) {
    const lower = prompt.toLowerCase();

    let detectedType = 'general_notice';
    if (lower.includes('cheque') || lower.includes('dishonour') || lower.includes('138') || lower.includes('bounce')) {
      detectedType = 'ni_act_138';
    } else if (lower.includes('gpa') || lower.includes('power of attorney') || lower.includes('revoc') || lower.includes('cancel gpa')) {
      detectedType = 'gpa_cancellation';
    } else if (lower.includes('marriage') || lower.includes('maintenance') || lower.includes('wife') || lower.includes('husband') || lower.includes('desert') || lower.includes('125')) {
      detectedType = 'matrimonial_maintenance';
    } else if (lower.includes('land acquisition') || lower.includes('18(1)') || lower.includes('parcels') || lower.includes('survey no')) {
      detectedType = 'land_acquisition_claim';
    } else if (lower.includes('tenant') || lower.includes('rent') || lower.includes('vacate') || lower.includes('evict')) {
      detectedType = 'tenant_eviction';
    } else if (lower.includes('recover') || lower.includes('invoice') || lower.includes('debt') || lower.includes('dues')) {
      detectedType = 'money_recovery';
    }

    setActiveCategoryCard(detectedType);
    loadNoticeCategory(detectedType, false);

    // Amounts
    const amountMatch = prompt.match(/(?:rs\.?|₹|\binr\b)\s*([\d,]+)/i) || prompt.match(/(\d+[\d,]*)\s*(?:per month|p\.m\.|maintenance|rupees)/i);
    if (amountMatch) {
      if (detectedType === 'matrimonial_maintenance' && elements.matrimonialMonthlyClaim) {
        elements.matrimonialMonthlyClaim.value = `${amountMatch[1]}/- per month`;
      } else if (detectedType === 'ni_act_138' && elements.niChequeAmount) {
        elements.niChequeAmount.value = amountMatch[1];
      } else if (detectedType === 'money_recovery' && elements.mrTotalDebt) {
        elements.mrTotalDebt.value = amountMatch[1];
      }
    }

    // Notice Fee
    const feeMatch = prompt.match(/(\d+[\d,]*)\s*(?:notice fee|notice charges|costs)/i);
    if (feeMatch && elements.noticeAdvocateFee) {
      elements.noticeAdvocateFee.value = `Rs.${feeMatch[1]}/- towards this notice charges.`;
    }

    // Cure Days
    const daysMatch = prompt.match(/(\d+)\s*(?:days|day)/i);
    if (daysMatch && elements.demandCureWindow) {
      elements.demandCureWindow.value = `${daysMatch[1]} days`;
    }

    // Numbered grounds formatted into "That..."
    if (elements.mainFactualGrounds) {
      const sentences = prompt.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 5);
      const formattedGrounds = sentences.map(s => {
        let clean = s.charAt(0).toUpperCase() + s.slice(1);
        if (!clean.toLowerCase().startsWith('that ')) clean = 'That ' + clean;
        if (!clean.endsWith('.')) clean += '.';
        return clean;
      }).join('\n\n');

      elements.mainFactualGrounds.value = formattedGrounds;
    }
  }

  async function runCloudAiDrafting(prompt) {
    const systemPrompt = `You are a Senior Legal Drafter practicing before Indian Courts. Draft a formal legal notice by RPAD from these facts. Return a JSON object with:
    {
      "category": "general_notice|matrimonial_maintenance|land_acquisition_claim|gpa_cancellation|ni_act_138|money_recovery|tenant_eviction",
      "clientName": "...",
      "recipientName": "...",
      "clientAddress": "...",
      "recipientAddress": "...",
      "paragraphs": ["That ...", "That ..."],
      "demandPeriod": "15 days",
      "noticeFee": "Rs.2,000/-"
    }`;

    const resText = await window.queryGeminiApi(`${systemPrompt}\n\nClient facts:\n${prompt}`);
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (data.category) {
        setActiveCategoryCard(data.category);
        loadNoticeCategory(data.category, false);
      }
      if (data.clientName && elements.clientFullName) elements.clientFullName.value = data.clientName;
      if (data.recipientName && elements.recipientFullName) elements.recipientFullName.value = data.recipientName;
      if (data.paragraphs && Array.isArray(data.paragraphs) && elements.mainFactualGrounds) {
        elements.mainFactualGrounds.value = data.paragraphs.join('\n\n');
      }
    }
  }

  function handleExecuteAiPolish() {
    const input = elements.aiPolishInput ? elements.aiPolishInput.value.trim() : '';
    if (!input) {
      showToast('Please paste some text into the Polish box.', 'warning');
      return;
    }

    const lines = input.split(/\n+/).filter(l => l.trim().length > 0);
    const polished = lines.map(line => {
      let clean = line.replace(/^(\d+[\.\)]|\-|\*|\•)\s*/, '').trim();
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (!clean.endsWith('.')) clean += '.';
      return `That ${clean.replace(/^(that\s+)/i, '')}`;
    }).join('\n\n');

    if (elements.mainFactualGrounds) {
      elements.mainFactualGrounds.value = polished;
      renderPreview();
      closeAiModal();
      showToast('✨ Formatted into numbered legal grounds on court parchment!', 'success');
    }
  }

  function handlePolishNarrative() {
    const textarea = elements.mainFactualGrounds;
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) {
      showToast('Please type some rough points first to polish.', 'warning');
      return;
    }

    const lines = text.split(/\n+/).filter(l => l.trim().length > 0);
    const polished = lines.map(line => {
      let clean = line.replace(/^(\d+[\.\)]|\-|\*|\•)\s*/, '').trim();
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (!clean.endsWith('.')) clean += '.';
      return `That ${clean.replace(/^(that\s+)/i, '')}`;
    }).join('\n\n');

    textarea.value = polished;
    renderPreview();
    showToast('✨ Formatted into court-admissible numbered legal grounds!', 'success');
  }

  // ==========================================================================
  // 10. EXPORT ACTIONS: PRINT, WORD (.DOC), COPY
  // ==========================================================================
  function toggleFontFamily() {
    isSerifFont = !isSerifFont;
    if (elements.legalPaperDocument) {
      if (isSerifFont) {
        elements.legalPaperDocument.classList.remove('sans-mode');
        if (elements.btnFontToggle) elements.btnFontToggle.innerHTML = '<i class="fa-solid fa-font"></i> <span>Font: Serif</span>';
      } else {
        elements.legalPaperDocument.classList.add('sans-mode');
        if (elements.btnFontToggle) elements.btnFontToggle.innerHTML = '<i class="fa-solid fa-font"></i> <span>Font: Modern Sans</span>';
      }
    }
  }

  function handleCopyText() {
    const docEl = elements.legalPaperDocument;
    if (!docEl) return;
    const text = docEl.innerText || docEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Official Legal Notice copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy text', 'error');
    });
  }

  function handleDownloadWord() {
    const d = collectFormData();
    const docEl = elements.legalPaperDocument;
    if (!docEl) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Legal Notice - ${d.clientName} vs ${d.recipientName}</title>
        <style>
          body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 1in; }
          h1 { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 2pt; }
          .center { text-align: center; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .justify { text-align: justify; }
          table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
          th, td { border: 1pt solid #000; padding: 6pt; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .para-row { margin-bottom: 8pt; text-align: justify; }
        </style>
      </head>
      <body>
        ${docEl.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Notice_${(d.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_vs_${(d.recipientName || 'Noticee').replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📄 Downloaded official editable Word (.doc) Notice!', 'success');
  }

  // ==========================================================================
  // 11. HELPERS & TOAST
  // ==========================================================================
  function showToast(message, type = 'info') {
    const container = elements.toastContainer || document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDateStr(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  function formatDateIndian(dateStr) {
    if (!dateStr) {
      const today = new Date();
      return `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.`;
    }
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parseInt(parts[2], 10)}-${parseInt(parts[1], 10)}-${parts[0]}.`;
      }
    }
    return dateStr.endsWith('.') ? dateStr : `${dateStr}.`;
  }

  // Start initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
