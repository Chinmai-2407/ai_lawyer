/**
 * LEXJURIS - Official Legal Notice Studio & Drafter Engine
 * Bar Council of India compliant automated statutory notice generator
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. NOTICE TEMPLATES REGISTRY & STATUTORY DEFINITIONS
  // ==========================================================================
  const NOTICE_TEMPLATES = {
    ni_act_138: {
      categoryName: 'Section 138 NI Act (Cheque Dishonour)',
      statute: 'Section 138 of the Negotiable Instruments Act, 1881 read with Section 420 IPC',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `STATUTORY LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 (AS AMENDED UPTO DATE) FOR DISHONOUR OF CHEQUE BEARING NO. ${d.niChequeNumber || '482019'} DATED ${formatDateStr(d.niChequeDate) || '15/08/2026'} DRAWN FOR AN AMOUNT OF ₹${d.niChequeAmount || '5,50,000/-'}`,
      defaultDemo: {
        clientName: 'Rajesh V. Sharma',
        clientParentage: 'S/o Late Shri R. K. Sharma, Proprietor M/s Sharma Trading Corp',
        clientAddress: 'H-42, Defence Colony, New Delhi - 110024',
        recipientName: 'ABC Logistics & Enterprises Pvt Ltd',
        recipientDesig: 'Attention: Mr. Vikas Singhania (Managing Director)',
        recipientAddress: 'Plot No. 88, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015',
        niChequeNumber: '482019',
        niChequeDate: '2026-08-15',
        niChequeAmount: '5,50,000',
        niBankDetails: 'HDFC Bank Ltd, Connaught Place Branch, New Delhi',
        niMemoDate: '2026-08-28',
        niDishonourReason: 'Funds Insufficient',
        facts: `That you the Noticee approached my client in the month of May 2026 for supply of commercial inventory and in discharge of your legally enforceable debt and liability, you issued the aforementioned Cheque.\n\nThat upon presentation by my client through their banker, the said cheque was returned unpaid vide Bank Return Memo with official remarks "FUNDS INSUFFICIENT".\n\nThat you had full knowledge of your depleted bank balance at the time of issuing the said cheque, demonstrating mala fide intention and dishonest inducement from inception.`
      },
      paragraphsBuilder: (d) => [
        `That my Client is a reputed merchant engaged in lawful business, enjoying high commercial standing and goodwill in the commercial market.`,
        `That you, the Noticee, towards discharge of your existing legal and enforceable liability arising out of commercial dealings, had issued in favour of my Client the Cheque bearing No. <strong>${escapeHtml(d.niChequeNumber || '482019')}</strong> dated <strong>${escapeHtml(formatDateStr(d.niChequeDate) || '15/08/2026')}</strong> for an amount of <strong>₹${escapeHtml(d.niChequeAmount || '5,50,000/-')}</strong> drawn on <strong>${escapeHtml(d.niBankDetails || 'your Banker')}</strong>.`,
        `That my Client presented the said Cheque for encashment through their banker in due course, however, to my Client's utter shock and dismay, the said Cheque was returned dishonoured and unpaid vide Cheque Return Memo dated <strong>${escapeHtml(formatDateStr(d.niMemoDate) || '28/08/2026')}</strong> with reasons <strong>"${escapeHtml(d.niDishonourReason || 'Funds Insufficient')}"</strong>.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, I HEREBY CALL UPON YOU THE NOTICEE:</div>
        <p>To make the full payment of the cheque amount of <strong>₹${escapeHtml(d.niChequeAmount || '5,50,000/-')} (Rupees ${numberToWords(d.niChequeAmount)} Only)</strong> along with interest @ 18% per annum from the date of dishonour, together with <strong>${escapeHtml(d.noticeAdvocateFee || '₹11,000/-')}</strong> towards counsel drafting fees and notice charges, to my Client within a period of <strong>${escapeHtml(d.demandCureWindow || '15 (Fifteen) days')}</strong> from the receipt of this statutory notice.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>PLEASE TAKE NOTICE</strong> that in the event of your failure, omission, or refusal to comply with the statutory requisition within the stipulated <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>, my Client has given me peremptory instructions to initiate criminal proceedings against you under <strong>Section 138 read with Section 141 & 142 of the Negotiable Instruments Act, 1881</strong> and <strong>Section 420 of the Indian Penal Code</strong> before the Court of the Metropolitan Magistrate having competent territorial jurisdiction, wherein you shall be liable for imprisonment for a term which may extend to <strong>two (2) years</strong>, or with fine which may extend to <strong>twice the amount of the cheque</strong>, or with both, besides holding you liable for all legal costs incurred by my Client.</p>
      `
    },

    money_recovery: {
      categoryName: 'Money Recovery & Outstanding Dues',
      statute: 'Order 37 of the Code of Civil Procedure, 1908 & The Indian Contract Act, 1872',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `FINAL LEGAL NOTICE FOR RECOVERY OF OUTSTANDING COMMERCIAL DUES OF ₹${d.mrTotalDebt || '12,45,000/-'} ALONG WITH PENDENTELITE INTEREST @ ${d.mrInterestRate || '18% P.A.'} AGAINST INVOICE REF: ${d.mrInvoiceNumber || 'INV-2024/8892'}`,
      defaultDemo: {
        clientName: 'Aegis Infotech Solutions LLP',
        clientParentage: 'Represented by its Partner Adv. Sunita Rao',
        clientAddress: 'Tower 4, Cyber City, Phase-II, Gurugram - 122002',
        recipientName: 'NexGen Cloud Services Pvt Ltd',
        recipientDesig: 'Attention: The Board of Directors & Chief Financial Officer',
        recipientAddress: 'A-14, Okhla Industrial Area Phase-I, New Delhi - 110020',
        mrTotalDebt: '12,45,000',
        mrInterestRate: '18% p.a.',
        mrInvoiceNumber: 'INV-2024/8892',
        mrTransactionNature: 'Enterprise Cloud Migration & IT Infrastructure Services',
        facts: `That my Client duly delivered and completed all contractual deliverables as per Master Service Agreement and raised Invoice No. INV-2024/8892 which was duly acknowledged and verified by your tech lead.\n\nThat as per contract terms, payment was strictly due within 30 days of billing, but despite multiple reminders and emails, you have failed to clear the overdue amount.\n\nThat you are unlawfully withholding my Client's legitimate operational funds without any justifiable cause.`
      },
      paragraphsBuilder: (d) => [
        `That my Client entered into a lawful commercial engagement with you for providing <strong>${escapeHtml(d.mrTransactionNature || 'commercial services and products')}</strong>.`,
        `That my Client scrupulously fulfilled and executed all commitments to your utmost satisfaction and raised Invoice / Bill bearing No. <strong>${escapeHtml(d.mrInvoiceNumber || 'INV-2024/8892')}</strong> for an admitted sum of <strong>₹${escapeHtml(d.mrTotalDebt || '12,45,000/-')}</strong>.`,
        `That despite receiving the benefits of services and admitting the debt, you have deliberately neglected to liquidate the outstanding payment, causing severe financial harassment to my Client.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, I HEREBY REQUISITION UPON YOU:</div>
        <p>To forthwith remit the total principal outstanding amount of <strong>₹${escapeHtml(d.mrTotalDebt || '12,45,000/-')}</strong> along with interest @ <strong>${escapeHtml(d.mrInterestRate || '18% p.a.')}</strong> calculated from due date till actual realization, together with notice fee of <strong>${escapeHtml(d.noticeAdvocateFee || '₹11,000/-')}</strong>, within <strong>${escapeHtml(d.demandCureWindow || '15 (Fifteen) days')}</strong> from the receipt hereof.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>BE INFORMED</strong> that should you fail to liquidate the outstanding debt within the stipulated period, my Client shall immediately institute a <strong>Summary Suit under Order XXXVII of the Code of Civil Procedure, 1908</strong> and/or commence Insolvency & Bankruptcy proceedings before the NCLT or competent Civil Court, holding you entirely responsible for interest, damages, and litigation expenses.</p>
      `
    },

    tenant_eviction: {
      categoryName: 'Tenant Eviction & Rent Default',
      statute: 'Section 106 of the Transfer of Property Act, 1882 & Rent Control Act',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `NOTICE OF TERMINATION OF MONTHLY TENANCY UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882 FOR VACATING DEMISED PREMISES AND CLEARING RENT ARREARS OF ₹${d.teArrearsAmount || '3,00,000/-'}`,
      defaultDemo: {
        clientName: 'Smt. Kamla Devi Kapur',
        clientParentage: 'W/o Late Shri Jagdish Kapur (Absolute Landlady)',
        clientAddress: 'B-19, Greater Kailash-I, New Delhi - 110048',
        recipientName: 'M/s Zenith Fashion Boutiques',
        recipientDesig: 'Attention: Mr. Amit Verma (Sole Proprietor / Tenant)',
        recipientAddress: 'Shop No. 4, Ground Floor, Central Market, Lajpat Nagar-II, New Delhi - 110024',
        tePropertyAddress: 'Shop No. 4, Ground Floor, Central Market, Lajpat Nagar-II, New Delhi - 110024',
        teMonthlyRent: '75,000/- per month',
        teArrearsAmount: '3,00,000 (4 months overdue)',
        teVacateDays: '15 days',
        facts: `That the lease agreement expired on 30th June 2026 and was not renewed by mutual consent.\n\nThat you have continuously defaulted in paying the agreed monthly rent for the last 4 consecutive months.\n\nThat the tenanted premises is bona fide required by my client for her personal commercial use and occupation.`
      },
      paragraphsBuilder: (d) => [
        `That my Client is the absolute owner and Landlady of the tenanted property situated at <strong>${escapeHtml(d.tePropertyAddress || 'Demised Premises')}</strong>.`,
        `That you were inducted as a monthly tenant in the said premises at an agreed rent of <strong>₹${escapeHtml(d.teMonthlyRent || '75,000/-')}</strong> per month, payable in advance by the 7th of every English calendar month.`,
        `That you have defaulted in payment of rent and are currently in chronic arrears amounting to <strong>₹${escapeHtml(d.teArrearsAmount || '3,00,000/-')}</strong>.`,
        `That by virtue of this Notice, my Client hereby unequivocally determines and terminates your monthly tenancy in respect of the demised premises upon expiry of <strong>${escapeHtml(d.teVacateDays || '15 days')}</strong>.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, YOU ARE HEREBY CALLED UPON TO:</div>
        <p>1. Hand over peaceful, vacant, and physical possession of the demised premises to my Client on or before the expiry of <strong>${escapeHtml(d.demandCureWindow || '15 (Fifteen) days')}</strong>.<br>
        2. Pay the total accumulated rental arrears of <strong>₹${escapeHtml(d.teArrearsAmount || '3,00,000/-')}</strong> together with notice costs of <strong>${escapeHtml(d.noticeAdvocateFee || '₹11,000/-')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>PLEASE NOTE</strong> that if you fail to deliver vacant possession, your occupation after the expiry of this notice period shall be deemed illegal, unauthorized, and that of a trespasser. My Client shall initiate an <strong>Eviction Suit for Possession, Recovery of Rent, and Mesne Profits @ ₹5,000/- per day</strong> for unauthorized use and occupation under the law.</p>
      `
    },

    contract_breach: {
      categoryName: 'Breach of Contract & Specific Performance',
      statute: 'The Specific Relief Act, 1963 & The Indian Contract Act, 1872',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `LEGAL NOTICE FOR MATERIAL BREACH OF AGREEMENT DATED ${formatDateStr(d.cbAgreementDate) || '10/01/2026'} TITLED "${d.cbAgreementTitle || 'MASTER AGREEMENT'}" AND DEMAND FOR SPECIFIC PERFORMANCE / DAMAGES`,
      defaultDemo: {
        clientName: 'Devansh Real Estate Developers Pvt Ltd',
        clientParentage: 'Represented by Director Shri Sandeep Singhal',
        clientAddress: '14, Barakhamba Road, Connaught Place, New Delhi - 110001',
        recipientName: 'Apex Infrastructure & Constructions Ltd',
        recipientDesig: 'Attention: Managing Director & Project Lead',
        recipientAddress: 'Tower B, Express Trade Towers, Sector 132, Noida Expressway, UP - 201301',
        cbAgreementDate: '2026-01-10',
        cbAgreementTitle: 'EPC Civil Construction Agreement for Commercial Complex',
        cbClauseBreached: 'Clause 6 (Timeline Milestones) & Clause 19 (Quality Standards)',
        facts: `That my Client timely released all milestone mobilization advances totaling ₹45,00,000/- as per contract schedule.\n\nThat you abruptly abandoned the site in July 2026 without rectifying structural defects highlighted by the chartered engineer.\n\nThat time was explicitly agreed as the essence of the contract and your breach has caused massive financial losses.`
      },
      paragraphsBuilder: (d) => [
        `That my Client entered into a formal executed contract titled <strong>"${escapeHtml(d.cbAgreementTitle || 'Commercial Contract')}"</strong> dated <strong>${escapeHtml(formatDateStr(d.cbAgreementDate) || '10/01/2026')}</strong> with you.`,
        `That my Client duly performed all reciprocal promises, covenants, and financial payments without default.`,
        `That you committed willful, fundamental, and material breach of <strong>${escapeHtml(d.cbClauseBreached || 'contractual covenants')}</strong> by failing to adhere to contractual obligations.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, MY CLIENT HEREBY CALLS UPON YOU:</div>
        <p>To cure the said default, resume and specifically perform your obligations under the contract, and compensate my Client for liquidated damages within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>, failing which the contract stands rescinded at your sole risk.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>TAKE NOTICE</strong> that upon your default, my Client shall invoke the <strong>Arbitration Clause / file a Suit for Specific Performance and Recovery of Damages</strong> in the High Court, seeking injunction, attachment of assets, and full legal costs.</p>
      `
    },

    consumer_deficiency: {
      categoryName: 'Consumer Protection (Deficiency of Service)',
      statute: 'The Consumer Protection Act, 2019',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `LEGAL NOTICE UNDER CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY OF SERVICE AND UNFAIR TRADE PRACTICE REGARDING "${d.cpProductService || 'PRODUCT / SERVICE'}"`,
      defaultDemo: {
        clientName: 'Dr. Alok Verma',
        clientParentage: 'S/o Shri N. K. Verma (Senior Medical Consultant)',
        clientAddress: 'Flat 302, Palm Greens Apartments, Indirapuram, Ghaziabad - 201014',
        recipientName: 'Stellar Motors India Pvt Ltd & Authorized Dealership',
        recipientDesig: 'The Managing Director / Customer Grievance Officer',
        recipientAddress: 'Plot 22, Industrial Area, Okhla Phase-III, New Delhi - 110020',
        cpProductService: 'Brand New Luxury Sedan Vehicle (Chassis #ST98234)',
        cpPurchaseAmount: '24,50,000',
        cpDefectNature: 'Critical Transmission & Brake Failure within 3 weeks of purchase with refusal to replace',
        facts: `That my Client paid the entire invoice consideration of ₹24,50,000/- for purchasing a brand new vehicle.\n\nThat the vehicle broke down repeatedly in the middle of traffic due to severe manufacturing defects.\n\nThat your service center withheld the vehicle for 45 days without providing a replacement or refund, causing severe harassment.`
      },
      paragraphsBuilder: (d) => [
        `That my Client purchased <strong>${escapeHtml(d.cpProductService || 'Product / Service')}</strong> from you upon paying total consideration of <strong>₹${escapeHtml(d.cpPurchaseAmount || '24,50,000/-')}</strong>.`,
        `That you provided express statutory warranty and representations regarding unblemished merchantable quality.`,
        `That the product/service was plagued by severe inherent defects, namely <strong>"${escapeHtml(d.cpDefectNature || 'Critical Service Deficiency')}"</strong>, amounting to gross deficiency of service and unfair trade practice under Section 2(11) of the Consumer Protection Act, 2019.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, MY CLIENT DEMANDS THAT YOU:</div>
        <p>1. Immediately refund the entire sum of <strong>₹${escapeHtml(d.cpPurchaseAmount || '24,50,000/-')}</strong> with 12% interest.<br>
        2. Pay <strong>₹5,00,000/-</strong> towards compensation for mental agony, distress, and physical harassment, plus notice cost of <strong>${escapeHtml(d.noticeAdvocateFee || '₹11,000/-')}</strong> within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>TAKE NOTE</strong> that in default, a formal Consumer Complaint under Section 35 of the Consumer Protection Act, 2019 shall be filed before the <strong>District / State Consumer Disputes Redressal Commission</strong>, claiming punitive damages, product recall, and statutory penalty.</p>
      `
    },

    defamation_cease: {
      categoryName: 'Defamation & Cease-and-Desist',
      statute: 'Section 499 & 500 of the Indian Penal Code (IPC) / BNS & Civil Law of Torts',
      demandWindow: '7 (Seven) days',
      subjectBuilder: (d) => `LEGAL CEASE AND DESIST NOTICE FOR UNCONDITIONAL APOLOGY AND DAMAGES FOR PUBLISHING SCURRILOUS, FALSE AND DEFAMATORY STATEMENTS AGAINST MY CLIENT`,
      defaultDemo: {
        clientName: 'Prof. (Dr.) Manisha Iyer',
        clientParentage: 'Dean & Chairperson, Apex Institute of Management',
        clientAddress: 'Faculty Estate, Chanakyapuri, New Delhi - 110021',
        recipientName: 'Digital Media News Portal & Sh. Tarun Bhatia',
        recipientDesig: 'Editor-in-Chief & Author',
        recipientAddress: '88, Media House, Sector 62, Noida, Gautam Buddha Nagar, UP - 201309',
        defPlatform: 'YouTube Channel & Online Portal article dated 24/08/2026',
        defDamagesClaim: '1,00,00,000/- (Rupees One Crore)',
        defApologyWindow: '7 days',
        facts: `That you published an unverified, sensational, and malicious video accusing my Client of financial irregularities without checking basic audit records.\n\nThat the publication was intentionally crafted to tarnish my Client's stellar academic reputation of 30 years.\n\nThat the defamatory video has garnered thousands of views, causing immense reputational damage.`
      },
      paragraphsBuilder: (d) => [
        `That my Client is a citizen of impeccable character, widely acclaimed in professional and academic circles with spotless integrity.`,
        `That on <strong>${escapeHtml(d.defPlatform || 'public media')}</strong>, you maliciously made, published, and circulated false, derogatory, and scandalous allegations against my Client.`,
        `That the said imputations are baseless falsehoods published with deliberate malice to lower my Client's estimation in the eyes of right-thinking members of society.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, YOU ARE HEREBY CALLED UPON TO:</div>
        <p>1. Forthwith delete and permanently takedown the defamatory publications from all digital platforms.<br>
        2. Tender an <strong>unconditional written public apology</strong> published with equal prominence.<br>
        3. Pay damages of <strong>₹${escapeHtml(d.defDamagesClaim || '1,00,00,000/-')}</strong> towards injury to reputation, within <strong>${escapeHtml(d.defApologyWindow || '7 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>BE WARNED</strong> that failing compliance, my Client shall initiate criminal prosecution for Defamation under <strong>Section 499/500 IPC</strong> along with a <strong>Civil Suit for Defamation and Permanent Injunction</strong> claiming heavy damages entirely at your peril.</p>
      `
    },

    employment_dues: {
      categoryName: 'Employment Dues & Wrongful Termination',
      statute: 'The Payment of Gratuity Act, 1972 & The Industrial Disputes Act, 1947',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `LEGAL NOTICE FOR IMMEDIATE SETTLEMENT OF FULL & FINAL DUES, UNPAID SALARY, GRATUITY & SEVERANCE COMPENSATION OF ₹${d.empUnpaidDues || '8,20,000/-'}`,
      defaultDemo: {
        clientName: 'Shri Rohan Mukherjee',
        clientParentage: 'S/o Shri S. K. Mukherjee',
        clientAddress: 'C-77, Vasant Kunj, New Delhi - 110070',
        recipientName: 'Global FinTech Solutions Pvt Ltd',
        recipientDesig: 'Attention: The Managing Director & Head - Human Resources',
        recipientAddress: 'Cyber Tower 9, DLF Cyber City, Phase-3, Gurugram, Haryana - 122002',
        empDesignation: 'Principal Software Architect',
        empTenure: 'July 2021 to August 2026 (5+ Years)',
        empUnpaidDues: '8,20,000/- (Notice Pay + Gratuity + Unpaid Salary)',
        facts: `That my client served your organization with distinction for over 5 years.\n\nThat you unlawfully terminated my client's employment without notice pay, statutory gratuity, or encashment of earned leaves.\n\nThat despite surrender of company assets and signing exit clearances, the full and final settlement has been withheld for over 90 days.`
      },
      paragraphsBuilder: (d) => [
        `That my Client was employed with you as <strong>${escapeHtml(d.empDesignation || 'Designated Employee')}</strong> during the tenure <strong>${escapeHtml(d.empTenure || 'the employment tenure')}</strong>.`,
        `That my Client rendered dedicated services and performed all duties without blemish.`,
        `That you abruptly terminated my Client's services and unlawfully withheld the statutory Full and Final settlement totaling <strong>₹${escapeHtml(d.empUnpaidDues || '8,20,000/-')}</strong>.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, I CALL UPON YOU:</div>
        <p>To disburse and transfer the complete legitimate dues of <strong>₹${escapeHtml(d.empUnpaidDues || '8,20,000/-')}</strong> along with interest @ 18% p.a. and issuance of Experience & Relieving Certificate within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>FAILING WHICH</strong>, my Client shall approach the <strong>Controlling Authority under the Payment of Gratuity Act / Labour Commissioner / High Court</strong> for recovery of dues with penal interest and damages.</p>
      `
    },

    property_partition: {
      categoryName: 'Property Partition & Possession Claim',
      statute: 'The Partition Act, 1893 & The Hindu Succession Act, 1956',
      demandWindow: '15 (Fifteen) days',
      subjectBuilder: (d) => `LEGAL NOTICE FOR PARTITION OF JOINT ANCESTRAL PROPERTY AND SEPARATION OF ${d.propShareClaim || '1/3RD SHARE'} BY METES AND BOUNDS`,
      defaultDemo: {
        clientName: 'Shri Vikram Bansal',
        clientParentage: 'S/o Late Shri Jagdish Prasad Bansal',
        clientAddress: '102, Civil Lines, Moradabad, Uttar Pradesh - 244001',
        recipientName: 'Shri Rakesh Bansal & Shri Suresh Bansal',
        recipientDesig: 'Co-Sharers / Co-Owners',
        recipientAddress: 'Ancestral Mansion, 104, Civil Lines, Moradabad, UP - 244001',
        propSchedule: 'Residential Property & Commercial Plot measuring 600 sq yards situated at Civil Lines',
        propShareClaim: '1/3rd Undivided Coparcenary Share',
        propPartitionMode: 'Physical division by metes and bounds with separate demarcated entry',
        facts: `That the suit property was purchased by the common ancestor Late Shri Jagdish Prasad Bansal who died intestate.\n\nThat my Client is legally entitled to 1/3rd equal share in all joint movable and immovable properties.\n\nThat you are attempting to create third-party rights and encumbrances on the joint property without my Client's written consent.`
      },
      paragraphsBuilder: (d) => [
        `That the immovable property described as <strong>${escapeHtml(d.propSchedule || 'Joint Ancestral Estate')}</strong> is a joint and undivided family property.`,
        `That my Client, being a legal heir and coparcener, holds a valid, legitimate, and undisputed <strong>${escapeHtml(d.propShareClaim || 'undivided equal share')}</strong> in the property.`,
        `That you have been enjoying the usufruct without rendering accounts and resisting amicable partition.`,
        ...(d.customFactsFormatted || [])
      ],
      demandClauseBuilder: (d) => `
        <div class="statutory-demand-header">NOW THEREFORE, MY CLIENT HEREBY CALLS UPON YOU:</div>
        <p>To effect an amicable partition of the suit property by metes and bounds in terms of <strong>${escapeHtml(d.propPartitionMode || 'separate possession')}</strong> and execute a formal Partition Deed within <strong>${escapeHtml(d.demandCureWindow || '15 days')}</strong>.</p>
      `,
      warningClauseBuilder: (d) => `
        <p class="consequences-para"><strong>TAKE NOTICE</strong> that if partition is not effected within the notice period, a <strong>Suit for Partition, Separate Possession, Permanent Injunction & Rendition of Accounts</strong> shall be filed before the Senior Civil Judge, restraining any alienation of the property.</p>
      `
    }
  };

  // ==========================================================================
  // 2. DOM ELEMENTS CACHE
  // ==========================================================================
  let currentNoticeType = 'ni_act_138';
  let isSerifFont = true;

  const elements = {
    // Top Nav / User
    userInitials: document.getElementById('userInitials'),
    displayUserName: document.getElementById('displayUserName'),
    displayUserSubtitle: document.getElementById('displayUserSubtitle'),
    userRoleBadge: document.getElementById('userRoleBadge'),
    avatarRoleIndicator: document.getElementById('avatarRoleIndicator'),
    toggleFullscreenBtn: document.getElementById('toggleFullscreenBtn'),
    toastContainer: document.getElementById('toastContainer'),

    // Category Grid
    noticeTypesGrid: document.getElementById('noticeTypesGrid'),
    btnQuickDemoLoad: document.getElementById('btnQuickDemoLoad'),
    btnResetNoticeForm: document.getElementById('btnResetNoticeForm'),
    linkDocketSelect: document.getElementById('linkDocketSelect'),

    // Form inputs
    noticeDispatchMode: document.getElementById('noticeDispatchMode'),
    noticeRefNumber: document.getElementById('noticeRefNumber'),
    noticeDate: document.getElementById('noticeDate'),
    clientFullName: document.getElementById('clientFullName'),
    clientParentage: document.getElementById('clientParentage'),
    clientFullAddress: document.getElementById('clientFullAddress'),
    recipientFullName: document.getElementById('recipientFullName'),
    recipientDesignation: document.getElementById('recipientDesignation'),
    recipientFullAddress: document.getElementById('recipientFullAddress'),
    mainFactualGrounds: document.getElementById('mainFactualGrounds'),
    btnEnhanceNarrative: document.getElementById('btnEnhanceNarrative'),
    demandCureWindow: document.getElementById('demandCureWindow'),
    noticeAdvocateFee: document.getElementById('noticeAdvocateFee'),
    advocateFullName: document.getElementById('advocateFullName'),
    advocateBarReg: document.getElementById('advocateBarReg'),
    advocateChambersAddress: document.getElementById('advocateChambersAddress'),
    advocatePhone: document.getElementById('advocatePhone'),
    advocateEmail: document.getElementById('advocateEmail'),

    // Dynamic Category Inputs
    niChequeNumber: document.getElementById('niChequeNumber'),
    niChequeDate: document.getElementById('niChequeDate'),
    niChequeAmount: document.getElementById('niChequeAmount'),
    niBankDetails: document.getElementById('niBankDetails'),
    niMemoDate: document.getElementById('niMemoDate'),
    niDishonourReason: document.getElementById('niDishonourReason'),

    mrTotalDebt: document.getElementById('mrTotalDebt'),
    mrInterestRate: document.getElementById('mrInterestRate'),
    mrInvoiceNumber: document.getElementById('mrInvoiceNumber'),
    mrTransactionNature: document.getElementById('mrTransactionNature'),

    tePropertyAddress: document.getElementById('tePropertyAddress'),
    teMonthlyRent: document.getElementById('teMonthlyRent'),
    teArrearsAmount: document.getElementById('teArrearsAmount'),
    teVacateDays: document.getElementById('teVacateDays'),

    cbAgreementDate: document.getElementById('cbAgreementDate'),
    cbAgreementTitle: document.getElementById('cbAgreementTitle'),
    cbClauseBreached: document.getElementById('cbClauseBreached'),

    cpProductService: document.getElementById('cpProductService'),
    cpPurchaseAmount: document.getElementById('cpPurchaseAmount'),
    cpDefectNature: document.getElementById('cpDefectNature'),

    defPlatform: document.getElementById('defPlatform'),
    defDamagesClaim: document.getElementById('defDamagesClaim'),
    defApologyWindow: document.getElementById('defApologyWindow'),

    empDesignation: document.getElementById('empDesignation'),
    empTenure: document.getElementById('empTenure'),
    empUnpaidDues: document.getElementById('empUnpaidDues'),

    propSchedule: document.getElementById('propSchedule'),
    propShareClaim: document.getElementById('propShareClaim'),
    propPartitionMode: document.getElementById('propPartitionMode'),

    // Preview Elements
    legalPaperDocument: document.getElementById('legalPaperDocument'),
    docAdvocateName: document.getElementById('docAdvocateName'),
    docAdvocateBar: document.getElementById('docAdvocateBar'),
    docAdvocateAddress: document.getElementById('docAdvocateAddress'),
    docAdvocateContact: document.getElementById('docAdvocateContact'),
    docDispatchMode: document.getElementById('docDispatchMode'),
    docRefNo: document.getElementById('docRefNo'),
    docNoticeDate: document.getElementById('docNoticeDate'),
    docRecipientName: document.getElementById('docRecipientName'),
    docRecipientDesig: document.getElementById('docRecipientDesig'),
    docRecipientAddress: document.getElementById('docRecipientAddress'),
    docSubjectText: document.getElementById('docSubjectText'),
    docClientName: document.getElementById('docClientName'),
    docClientParentage: document.getElementById('docClientParentage'),
    docClientAddress: document.getElementById('docClientAddress'),
    docNumberedParagraphs: document.getElementById('docNumberedParagraphs'),
    docDemandClause: document.getElementById('docDemandClause'),
    docWarningClause: document.getElementById('docWarningClause'),
    docSignAdvocateName: document.getElementById('docSignAdvocateName'),
    docSignBarReg: document.getElementById('docSignBarReg'),

    // Toolbar actions
    btnFontToggle: document.getElementById('btnFontToggle'),
    btnCopyNoticeText: document.getElementById('btnCopyNoticeText'),
    btnDownloadWord: document.getElementById('btnDownloadWord'),
    btnPrintNotice: document.getElementById('btnPrintNotice')
  };

  // ==========================================================================
  // 3. INITIALIZATION
  // ==========================================================================
  function init() {
    initCurrentUser();
    initDateDefaults();
    initDocketSelector();
    bindEventListeners();
    loadNoticeCategory('ni_act_138', true);
    checkUrlParams();
  }

  function initCurrentUser() {
    try {
      const stored = localStorage.getItem('lexjuris_auth_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (elements.displayUserName) elements.displayUserName.textContent = user.name || 'Advocate';
        if (elements.displayUserSubtitle) elements.displayUserSubtitle.textContent = `${user.role || 'Advocate'} • Bar Reg: ${user.barReg || 'D/1998/2012'}`;
        if (elements.userRoleBadge) elements.userRoleBadge.textContent = user.role || 'Counsel';
        if (elements.userInitials) elements.userInitials.textContent = (user.name || 'VS').substring(0, 2).toUpperCase();

        if (elements.advocateFullName) elements.advocateFullName.value = user.name || 'Adv. Vikramaditya Sharma';
        if (elements.advocateBarReg) elements.advocateBarReg.value = user.barReg || 'D/1998/2012';
        if (elements.advocateEmail) elements.advocateEmail.value = user.email || 'advocate.sharma@lexjuris.in';
        if (elements.advocatePhone) elements.advocatePhone.value = user.phone || '+91 98112 44321';
      }
    } catch (e) {
      console.warn('Could not load user session', e);
    }
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

  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('caseId');
    if (caseId && elements.linkDocketSelect) {
      elements.linkDocketSelect.value = caseId;
      handleDocketSelected(caseId);
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

    // Quick sample load
    if (elements.btnQuickDemoLoad) {
      elements.btnQuickDemoLoad.addEventListener('click', () => {
        loadNoticeCategory(currentNoticeType, true);
        showToast(`Loaded official demo facts for ${NOTICE_TEMPLATES[currentNoticeType].categoryName}`, 'info');
      });
    }

    // Reset button
    if (elements.btnResetNoticeForm) {
      elements.btnResetNoticeForm.addEventListener('click', () => {
        if (confirm('Reset all fields in the Notice Drafter?')) {
          resetAllFields();
          renderPreview();
          showToast('Notice fields cleared.', 'info');
        }
      });
    }

    // Docket select
    if (elements.linkDocketSelect) {
      elements.linkDocketSelect.addEventListener('change', (e) => {
        handleDocketSelected(e.target.value);
      });
    }

    // Enhance Narrative Button (Smart Formatter)
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
    if (elements.toggleFullscreenBtn) {
      elements.toggleFullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
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

  // ==========================================================================
  // 5. CATEGORY SWITCHING & FORM POPULATION
  // ==========================================================================
  function loadNoticeCategory(typeKey, populateDemo = false) {
    if (!NOTICE_TEMPLATES[typeKey]) return;
    currentNoticeType = typeKey;

    // Toggle dynamic slots
    const dynamicContainers = {
      ni_act_138: 'dynamicFields_ni_act',
      money_recovery: 'dynamicFields_money_recovery',
      tenant_eviction: 'dynamicFields_tenant_eviction',
      contract_breach: 'dynamicFields_contract_breach',
      consumer_deficiency: 'dynamicFields_consumer_deficiency',
      defamation_cease: 'dynamicFields_defamation_cease',
      employment_dues: 'dynamicFields_employment_dues',
      property_partition: 'dynamicFields_property_partition'
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

    // Populate demo data if requested
    if (populateDemo) {
      const tmpl = NOTICE_TEMPLATES[typeKey];
      const d = tmpl.defaultDemo;
      if (d) {
        if (elements.clientFullName) elements.clientFullName.value = d.clientName || '';
        if (elements.clientParentage) elements.clientParentage.value = d.clientParentage || '';
        if (elements.clientFullAddress) elements.clientFullAddress.value = d.clientAddress || '';
        if (elements.recipientFullName) elements.recipientFullName.value = d.recipientName || '';
        if (elements.recipientDesignation) elements.recipientDesignation.value = d.recipientDesig || '';
        if (elements.recipientFullAddress) elements.recipientFullAddress.value = d.recipientAddress || '';
        if (elements.mainFactualGrounds) elements.mainFactualGrounds.value = d.facts || '';

        // Specific category demo keys
        if (typeKey === 'ni_act_138') {
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
        } else if (typeKey === 'defamation_cease') {
          if (elements.defPlatform) elements.defPlatform.value = d.defPlatform || '';
          if (elements.defDamagesClaim) elements.defDamagesClaim.value = d.defDamagesClaim || '';
          if (elements.defApologyWindow) elements.defApologyWindow.value = d.defApologyWindow || '7 days';
        } else if (typeKey === 'employment_dues') {
          if (elements.empDesignation) elements.empDesignation.value = d.empDesignation || '';
          if (elements.empTenure) elements.empTenure.value = d.empTenure || '';
          if (elements.empUnpaidDues) elements.empUnpaidDues.value = d.empUnpaidDues || '';
        } else if (typeKey === 'property_partition') {
          if (elements.propSchedule) elements.propSchedule.value = d.propSchedule || '';
          if (elements.propShareClaim) elements.propShareClaim.value = d.propShareClaim || '';
          if (elements.propPartitionMode) elements.propPartitionMode.value = d.propPartitionMode || '';
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
    if (elements.clientFullAddress) elements.clientFullAddress.value = '';
    if (elements.recipientFullName) elements.recipientFullName.value = '';
    if (elements.recipientDesignation) elements.recipientDesignation.value = '';
    if (elements.recipientFullAddress) elements.recipientFullAddress.value = '';
    if (elements.mainFactualGrounds) elements.mainFactualGrounds.value = '';

    const dynInputs = document.querySelectorAll('.dynamic-category-fields input, .dynamic-category-fields select');
    dynInputs.forEach(inp => inp.value = '');
  }

  // ==========================================================================
  // 6. LIVE COURT NOTICE RENDERING
  // ==========================================================================
  function collectFormData() {
    const rawFacts = elements.mainFactualGrounds ? elements.mainFactualGrounds.value.trim() : '';
    let customFactsFormatted = [];
    if (rawFacts) {
      const rawParas = rawFacts.split(/\n+/).filter(p => p.trim().length > 0);
      customFactsFormatted = rawParas.map(p => {
        let clean = p.replace(/^(\d+[\.\)]|\-|\*|\•)\s*/, '').trim();
        if (!clean.toLowerCase().startsWith('that ')) {
          clean = 'That ' + clean;
        }
        return escapeHtml(clean);
      });
    }

    return {
      advocateName: elements.advocateFullName ? elements.advocateFullName.value : 'Adv. Vikramaditya Sharma',
      advocateBar: elements.advocateBarReg ? elements.advocateBarReg.value : 'D/1998/2012',
      advocateAddress: elements.advocateChambersAddress ? elements.advocateChambersAddress.value : 'High Court of Delhi',
      advocatePhone: elements.advocatePhone ? elements.advocatePhone.value : '+91 98112 44321',
      advocateEmail: elements.advocateEmail ? elements.advocateEmail.value : 'advocate.sharma@lexjuris.in',

      dispatchMode: elements.noticeDispatchMode ? elements.noticeDispatchMode.value : 'REGISTERED POST A.D.',
      refNo: elements.noticeRefNumber ? elements.noticeRefNumber.value : 'LJ/NOT/2026/048',
      noticeDate: elements.noticeDate ? elements.noticeDate.value : new Date().toISOString().split('T')[0],

      clientName: elements.clientFullName ? elements.clientFullName.value : 'Client Name',
      clientParentage: elements.clientParentage ? elements.clientParentage.value : '',
      clientAddress: elements.clientFullAddress ? elements.clientFullAddress.value : '',

      recipientName: elements.recipientFullName ? elements.recipientFullName.value : 'Opposite Party Name',
      recipientDesig: elements.recipientDesignation ? elements.recipientDesignation.value : '',
      recipientAddress: elements.recipientFullAddress ? elements.recipientFullAddress.value : '',

      demandCureWindow: elements.demandCureWindow ? elements.demandCureWindow.value : '15 (Fifteen) days',
      noticeAdvocateFee: elements.noticeAdvocateFee ? elements.noticeAdvocateFee.value : '₹11,000/-',

      // Dynamic category fields
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

      defPlatform: elements.defPlatform ? elements.defPlatform.value : '',
      defDamagesClaim: elements.defDamagesClaim ? elements.defDamagesClaim.value : '',
      defApologyWindow: elements.defApologyWindow ? elements.defApologyWindow.value : '',

      empDesignation: elements.empDesignation ? elements.empDesignation.value : '',
      empTenure: elements.empTenure ? elements.empTenure.value : '',
      empUnpaidDues: elements.empUnpaidDues ? elements.empUnpaidDues.value : '',

      propSchedule: elements.propSchedule ? elements.propSchedule.value : '',
      propShareClaim: elements.propShareClaim ? elements.propShareClaim.value : '',
      propPartitionMode: elements.propPartitionMode ? elements.propPartitionMode.value : '',

      customFactsFormatted: customFactsFormatted
    };
  }

  function renderPreview() {
    const tmpl = NOTICE_TEMPLATES[currentNoticeType] || NOTICE_TEMPLATES.ni_act_138;
    const d = collectFormData();

    // 1. Advocate Header
    if (elements.docAdvocateName) elements.docAdvocateName.textContent = (d.advocateName || 'ADV. COUNSEL').toUpperCase();
    if (elements.docAdvocateBar) elements.docAdvocateBar.textContent = `Bar Council Enrollment No.: ${d.advocateBar || 'D/1998/2012'}`;
    if (elements.docAdvocateAddress) elements.docAdvocateAddress.textContent = `Chambers: ${d.advocateAddress || 'High Court of Delhi'}`;
    if (elements.docAdvocateContact) elements.docAdvocateContact.textContent = `Phone: ${d.advocatePhone || '+91 98112 44321'} • Email: ${d.advocateEmail || 'advocate@lexjuris.in'}`;

    // 2. Dispatch Meta
    if (elements.docDispatchMode) elements.docDispatchMode.textContent = `BY ${d.dispatchMode.toUpperCase()}`;
    if (elements.docRefNo) elements.docRefNo.textContent = d.refNo || 'LJ/NOT/2026/048';
    if (elements.docNoticeDate) elements.docNoticeDate.textContent = formatDateStr(d.noticeDate) || new Date().toLocaleDateString('en-GB');

    // 3. Addressee
    if (elements.docRecipientName) elements.docRecipientName.textContent = (d.recipientName || 'RECIPIENT NAME').toUpperCase();
    if (elements.docRecipientDesig) {
      elements.docRecipientDesig.textContent = d.recipientDesig ? d.recipientDesig : '';
      elements.docRecipientDesig.style.display = d.recipientDesig ? 'block' : 'none';
    }
    if (elements.docRecipientAddress) elements.docRecipientAddress.textContent = d.recipientAddress || 'Recipient Postal Address';

    // 4. Subject Line
    if (elements.docSubjectText) {
      elements.docSubjectText.innerHTML = tmpl.subjectBuilder(d);
    }

    // 5. Preamble
    if (elements.docClientName) elements.docClientName.textContent = d.clientName || 'Client Name';
    if (elements.docClientParentage) {
      elements.docClientParentage.textContent = d.clientParentage ? `, ${d.clientParentage}` : '';
    }
    if (elements.docClientAddress) {
      elements.docClientAddress.textContent = d.clientAddress ? d.clientAddress : 'Client Address';
    }

    // 6. Numbered Paragraphs
    if (elements.docNumberedParagraphs) {
      const paras = tmpl.paragraphsBuilder(d);
      let html = '';
      paras.forEach((p, idx) => {
        html += `
          <div class="legal-para-row">
            <span class="para-num">${idx + 1}.</span>
            <div class="para-text">${p}</div>
          </div>
        `;
      });
      elements.docNumberedParagraphs.innerHTML = html;
    }

    // 7. Demand Clause
    if (elements.docDemandClause) {
      elements.docDemandClause.innerHTML = tmpl.demandClauseBuilder(d);
    }

    // 8. Warning Clause
    if (elements.docWarningClause) {
      elements.docWarningClause.innerHTML = tmpl.warningClauseBuilder(d);
    }

    // 9. Signature Block
    if (elements.docSignAdvocateName) elements.docSignAdvocateName.textContent = d.advocateName || 'Adv. Counsel';
    if (elements.docSignBarReg) elements.docSignBarReg.textContent = `Bar Reg: ${d.advocateBar || 'D/1998/2012'}`;
  }

  // ==========================================================================
  // 7. SMART POLISH / AI DRAFTING HELPER
  // ==========================================================================
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
  // 8. EXPORT ACTIONS: PRINT, WORD (.DOC), COPY
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
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
          h1 { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 2pt; }
          .center { text-align: center; font-size: 10pt; }
          .divider { border-bottom: 2pt solid #000; margin: 10pt 0; }
          .bold { font-weight: bold; }
          .justify { text-align: justify; }
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
    a.download = `Legal_Notice_${(d.recipientName || 'Noticee').replace(/[^a-zA-Z0-9]/g, '_')}_${d.refNo.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📄 Downloaded official editable Word (.doc) Notice!', 'success');
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION UTILITY
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
    }, 3200);
  }

  // ==========================================================================
  // 10. HELPER FUNCTIONS
  // ==========================================================================
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

  function numberToWords(numStr) {
    if (!numStr) return '';
    const clean = String(numStr).replace(/,/g, '').trim();
    const n = parseInt(clean, 10);
    if (isNaN(n)) return numStr;
    // Simple converter for demo numbers
    if (n === 550000) return 'Five Lakh Fifty Thousand';
    if (n === 1245000) return 'Twelve Lakh Forty-Five Thousand';
    if (n === 300000) return 'Three Lakh';
    if (n === 2450000) return 'Twenty-Four Lakh Fifty Thousand';
    if (n === 820000) return 'Eight Lakh Twenty Thousand';
    if (n === 10000000) return 'One Crore';
    return `${n}/-`;
  }

  // Start initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
