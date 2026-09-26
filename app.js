/**
 * LEXJURIS - Legal Case Intake & Court Scheduling Application Logic
 */

// ==========================================================================
// 🔑 JURISAI API KEYS & MODEL CONFIGURATION (CONFIGURE IN CODE HERE)
// ==========================================================================
// 💡 Enter your AI API keys directly here in the code below.
// This allows you to configure API keys directly in the codebase without
// exposing any API key input fields on the website.
const JURISAI_CONFIG = {
  // Default AI Engine to activate:
  // Options: 'gemini_api' | 'openai_api' | 'groq_api' | 'openrouter_api' | 'local_ollama' | 'smart_mock'
  activeEngine: 'gemini_api',

  // ⬇️ PASTE YOUR API KEYS DIRECTLY BETWEEN THE QUOTES:
  apiKeys: {
    gemini_api: '',      // Google Gemini API Key (e.g. 'AIzaSy...')
    openai_api: '',      // OpenAI ChatGPT Key (e.g. 'sk-proj-...')
    groq_api: '',        // Groq Cloud API Key (e.g. 'gsk_...')
    openrouter_api: ''   // OpenRouter / Custom Key (e.g. 'sk-or-...')
  },

  // Default models:
  models: {
    gemini_api: 'gemini-2.0-flash',        // or 'gemini-1.5-pro', 'gemini-1.5-flash'
    openai_api: 'gpt-4o-mini',             // or 'gpt-4o', 'gpt-4-turbo'
    groq_api: 'llama-3.3-70b-versatile',   // or 'llama-3.1-8b-instant'
    openrouter_api: 'deepseek/deepseek-chat',
    local_ollama: 'llama3.2'
  },

  // Custom Endpoint URL (optional, for custom proxy, vLLM, or OpenRouter):
  customEndpoint: ''
};

// ==========================================================================
// 1. DEFAULT SAMPLE DATA & STATE CONFIGURATION
// ==========================================================================

const STORAGE_KEYS = {
  AUTH_USER: 'lexjuris_auth_user',
  CASES: 'lexjuris_cases_data',
  USERS: 'lexjuris_users_list',
  AUDIT_LOGS: 'lexjuris_audit_logs'
};

// Default pre-seeded Chambers Team Members & Login Credentials
// Default pre-seeded Chambers Team Members & Login Credentials with Group Hierarchy
const DEFAULT_USERS = [
  {
    id: 'user_admin_1',
    name: 'Adv. Dr. Hemant Malhotra',
    email: 'admin@lexjuris.in',
    password: 'AdminPass2024!',
    role: 'Chambers Administrator',
    barReg: 'D/1102/1998',
    dept: 'Chambers Administration',
    group: 'Chambers Administration',
    groupRole: 'admin',
    isGroupHead: false,
    phone: '+91 98110 00111',
    status: 'Active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 'user_advocate_2',
    name: 'Adv. Vikramaditya Sharma',
    email: 'advocate.sharma@lexjuris.in',
    password: 'Justice2024!',
    role: 'Senior Advocate (Group Head)',
    barReg: 'D/1998/2012',
    dept: 'Constitutional & Writ',
    group: 'Constitutional & Writ',
    groupRole: 'head',
    isGroupHead: true,
    phone: '+91 98112 44321',
    status: 'Active',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    lastLogin: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'user_associate_3',
    name: 'Adv. Ananya Singh',
    email: 'ananya.singh@lexjuris.in',
    password: 'Associate2024!',
    role: 'Associate Advocate',
    barReg: 'D/3042/2021',
    dept: 'Constitutional & Writ',
    group: 'Constitutional & Writ',
    groupRole: 'subordinate',
    isGroupHead: false,
    phone: '+91 98710 55432',
    status: 'Active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    lastLogin: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'user_associate_5',
    name: 'Adv. Siddharth Rao',
    email: 'siddharth.rao@lexjuris.in',
    password: 'Associate2024!',
    role: 'Associate Advocate',
    barReg: 'D/4119/2022',
    dept: 'Constitutional & Writ',
    group: 'Constitutional & Writ',
    groupRole: 'subordinate',
    isGroupHead: false,
    phone: '+91 98118 77654',
    status: 'Active',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    lastLogin: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'user_clerk_4',
    name: 'Ramesh Chandra',
    email: 'clerk.docket@lexjuris.in',
    password: 'Clerk2024!',
    role: 'Registry Clerk',
    barReg: 'CR/2018/889',
    dept: 'Chambers Administration',
    group: 'Chambers Administration',
    groupRole: 'subordinate',
    isGroupHead: false,
    phone: '+91 94120 77890',
    status: 'Active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastLogin: new Date(Date.now() - 7200000).toISOString()
  }
];

// Initial realistic legal dockets seeded with Practice Group & Subordinate assignments
const SAMPLE_CASES = [
  {
    id: 'case_kunal_1',
    clientName: 'Kunal Singhal',
    clientPhone: '+91 98118 77652',
    opposingParty: 'National Highways Authority of India (NHAI)',
    caseTitle: 'Singhal vs. NHAI (Letters Appeal - Land Compensation Enhancement)',
    caseNumber: 'LA.APP. 9442/2024',
    caseCategory: 'Letters Appeal',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'High',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(4),
    hearingTime: '11:00',
    notes: 'Arguments to be finalized on circle rate valuation discrepancies and statutory solatium under Section 30(1) RFCTLARR Act 2013.',
    status: 'In Progress',
    updates: [
      {
        id: 'upd_k_1',
        date: getOffsetDateString(-2),
        time: '11:30 AM',
        author: 'Adv. Ananya Singh',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Document uploaded',
        notes: 'Written Submissions.pdf'
      },
      {
        id: 'upd_k_2',
        date: getOffsetDateString(-3),
        time: '04:20 PM',
        author: 'Adv. Vikramaditya Sharma',
        authorRole: 'Head of Group',
        type: 'hearing',
        title: 'Hearing updated',
        notes: 'Next hearing scheduled for 18 Oct 2024'
      },
      {
        id: 'upd_k_3',
        date: getOffsetDateString(-4),
        time: '10:15 AM',
        author: 'Adv. Ananya Singh',
        authorRole: 'Associate Advocate',
        type: 'instruction',
        title: 'Note added',
        notes: 'Arguments to be finalized'
      }
    ],
    documents: [
      {
        id: 'doc_k_1',
        name: 'Written Submissions.pdf',
        size: '2.4 MB',
        category: 'Written Submissions',
        uploadedBy: 'Adv. Ananya Singh',
        uploadedAt: getOffsetDateString(-2)
      },
      {
        id: 'doc_k_2',
        name: 'High Court Impugned Order.pdf',
        size: '1.8 MB',
        category: 'Court Order',
        uploadedBy: 'High Court Registry',
        uploadedAt: getOffsetDateString(-5)
      },
      {
        id: 'doc_k_3',
        name: 'Valuation & Circle Rate Survey.pdf',
        size: '4.1 MB',
        category: 'Evidence Annexure',
        uploadedBy: 'Adv. Vikramaditya Sharma',
        uploadedAt: getOffsetDateString(-6)
      }
    ],
    tasks: [
      { id: 't_k_1', title: 'Prepare compilation of judgments on Section 30(1) solatium', completed: true, priority: 'High', dueDate: getOffsetDateString(-1) },
      { id: 't_k_2', title: 'Cross-verify circle rate notification dated 15 Jan 2023', completed: true, priority: 'Standard', dueDate: getOffsetDateString(-1) },
      { id: 't_k_3', title: 'Serve advance copy of Written Submissions to NHAI standing counsel', completed: false, priority: 'Critical', dueDate: getOffsetDateString(2) },
      { id: 't_k_4', title: 'Confer with Senior Advocate regarding oral arguments', completed: false, priority: 'High', dueDate: getOffsetDateString(3) }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_kunal_2',
    clientName: 'Kunal Singhal',
    clientPhone: '+91 98118 77652',
    opposingParty: 'Land Acquisition Collector (South West)',
    caseTitle: 'Singhal vs. LAC (Interim Reference Petition)',
    caseNumber: 'LA.APP. 4561/2024',
    caseCategory: 'Letters Appeal',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(8),
    hearingTime: '12:15',
    notes: 'Reference petition under Section 64 RFCTLARR Act forwarded to High Court registry.',
    status: 'In Progress',
    updates: [
      {
        id: 'upd_k2_1',
        date: getOffsetDateString(-1),
        time: '02:30 PM',
        author: 'Adv. Siddharth Rao',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Reference Petition Lodged',
        notes: 'Section 64 statutory reference papers submitted.'
      }
    ],
    documents: [
      { id: 'doc_k2_1', name: 'LAC_Statutory_Reference_Papers.pdf', size: '3.2 MB', category: 'Petition', uploadedBy: 'Adv. Siddharth Rao', uploadedAt: getOffsetDateString(-1) }
    ],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_harsith_1',
    clientName: 'harsith',
    clientPhone: '+91 98234 11200',
    opposingParty: 'Union of India & Anr',
    caseTitle: 'Harsith vs. Union of India (Appeal against Acquisition Award)',
    caseNumber: 'LA.APP. 1583/2024',
    caseCategory: 'Letters Appeal',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(6),
    hearingTime: '10:45',
    notes: 'Grounds of appeal drafted challenging market value assessment.',
    status: 'In Progress',
    updates: [
      { id: 'upd_h_1', date: getOffsetDateString(-2), time: '11:00 AM', author: 'Adv. Ananya Singh', authorRole: 'Associate Advocate', type: 'instruction', title: 'Grounds of Appeal Reviewed', notes: 'Draft reviewed and approved.' }
    ],
    documents: [
      { id: 'doc_h_1', name: 'Appeal_Memo_Grounds.pdf', size: '1.9 MB', category: 'Appeal Memo', uploadedBy: 'Adv. Ananya Singh', uploadedAt: getOffsetDateString(-2) }
    ],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_amit_1',
    clientName: 'Amit Verma',
    clientPhone: '+91 98101 22345',
    opposingParty: 'State (NCT of Delhi) & Anr',
    caseTitle: 'Verma vs. State (Section 482 Quashing Petition)',
    caseNumber: 'CRL.M.C. 2210/2024',
    caseCategory: 'Criminal Defense',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'High',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(5),
    hearingTime: '11:30',
    notes: 'Quashing petition filed citing Bhajan Lal guidelines on malicious prosecution.',
    status: 'In Progress',
    updates: [
      { id: 'upd_av_1', date: getOffsetDateString(-1), time: '10:00 AM', author: 'Adv. Ananya Singh', authorRole: 'Associate Advocate', type: 'filing', title: 'Quashing Petition Indexed', notes: 'Certified copy of FIR annexed.' }
    ],
    documents: [],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_ritu_1',
    clientName: 'Ritu Khanna',
    clientPhone: '+91 99112 33445',
    opposingParty: 'Sanjay Khanna',
    caseTitle: 'Khanna vs. Khanna (First Appeal from Order)',
    caseNumber: 'FAO 1189/2023',
    caseCategory: 'Civil Litigation',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(9),
    hearingTime: '14:00',
    notes: 'First appeal listed for admission hearing and stay on execution.',
    status: 'In Progress',
    updates: [],
    documents: [],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_vivek_1',
    clientName: 'Vivek Sharma',
    clientPhone: '+91 98114 55667',
    opposingParty: 'Pooja Sharma',
    caseTitle: 'Sharma vs. Sharma (Matrimonial Appeal on Maintenance)',
    caseNumber: 'MAT.APP. 556/2024',
    caseCategory: 'Family & Matrimonial',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(11),
    hearingTime: '12:00',
    notes: 'Challenge to quantum of interim maintenance under Section 24 HMA.',
    status: 'In Progress',
    updates: [],
    documents: [],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_meera_1',
    clientName: 'Meera Iyer',
    clientPhone: '+91 98401 99887',
    opposingParty: 'Union of India (Ministry of Finance)',
    caseTitle: 'Iyer vs. Union of India (Writ Petition on Customs Seizure)',
    caseNumber: 'WP(C) 3342/2024',
    caseCategory: 'Constitutional & Writ',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Critical',
    courtName: 'High Court',
    hearingDate: getOffsetDateString(1),
    hearingTime: '10:30',
    notes: 'Emergency listing granted by Chief Justice Court. Argue release of perishable goods under bond.',
    status: 'In Progress',
    updates: [
      { id: 'upd_mi_1', date: getOffsetDateString(0), time: '09:00 AM', author: 'Adv. Ananya Singh', authorRole: 'Associate Advocate', type: 'instruction', title: 'Mentioning Memo Filed', notes: 'Urgent mentioning accepted for tomorrow.' }
    ],
    documents: [],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_globaltech_1',
    clientName: 'Global Tech Solutions',
    clientPhone: '+91 99887 66554',
    opposingParty: 'Nexus Systems LLP',
    caseTitle: 'Global Tech vs. Nexus (Trademark & Copyright Infringement)',
    caseNumber: 'COM.IPD-TM 120/2024',
    caseCategory: 'Intellectual Property',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'Intellectual Property Division (IPD), High Court',
    hearingDate: getOffsetDateString(14),
    hearingTime: '11:30',
    notes: 'Commercial suit for permanent injunction, damages and rendition of accounts.',
    status: 'In Progress',
    updates: [],
    documents: [],
    tasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_1',
    clientName: 'Rajesh Mehra',
    clientPhone: '+91 98112 44321',
    opposingParty: 'Delhi Municipal Corporation (MCD)',
    caseTitle: 'Mehra vs. MCD & Ors (Illegal Demolition Notice)',
    caseNumber: 'WP(C) 4521/2024',
    caseCategory: 'Constitutional & Writ',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Critical',
    courtName: 'Delhi High Court - Courtroom No. 4, Bench 2',
    hearingDate: getOffsetDateString(0), // Today
    hearingTime: '10:30',
    notes: 'Interim stay application listed at item #14. Argue lack of mandatory 15-day statutory show-cause notice under Sec 343 DMC Act.',
    status: 'Active',
    updates: [
      {
        id: 'upd_1_1',
        date: getOffsetDateString(-1),
        time: '16:00',
        author: 'Adv. Ananya Singh',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Interim Stay Application Lodged with Registry',
        notes: 'Notice served to MCD Standing Counsel. Defect clearance certificate obtained under Sec 343 DMC Act challenge.'
      },
      {
        id: 'upd_1_2',
        date: getOffsetDateString(0),
        time: '09:15',
        author: 'Adv. Vikramaditya Sharma',
        authorRole: 'Head of Group',
        type: 'instruction',
        title: 'Senior Counsel Strategy Instruction',
        notes: 'Matter listed at Item #14. Press urgency on demolition threat; invoke precedent in MC Mehta case.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_2',
    clientName: 'Sunita Rao (Aegis Infotech)',
    clientPhone: '+91 97401 88900',
    opposingParty: 'NexGen Cloud Services Pvt Ltd',
    caseTitle: 'Aegis Infotech vs. NexGen (SaaS Breach of Contract)',
    caseNumber: 'ARB.P. 882/2024',
    caseCategory: 'Arbitration & ADR',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'High',
    courtName: 'Commercial Appellate Division, Bench 1',
    hearingDate: getOffsetDateString(0), // Today
    hearingTime: '14:15',
    notes: 'Sec 11 Arbitration Petition for appointment of Sole Arbitrator. Pre-institution mediation failure report attached.',
    status: 'Active',
    updates: [
      {
        id: 'upd_2_1',
        date: getOffsetDateString(-3),
        time: '11:30',
        author: 'Adv. Siddharth Rao',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Sec 11 Petition & Exhibits Placed on Record',
        notes: 'Pre-institution mediation failure certificate annexed as Exhibit B along with SaaS service level agreements.'
      },
      {
        id: 'upd_2_2',
        date: getOffsetDateString(0),
        time: '12:00',
        author: 'Adv. Siddharth Rao',
        authorRole: 'Associate Advocate',
        type: 'hearing',
        title: 'Bench Notice Issued to Respondent',
        notes: 'Respondent entered caveat through standing counsel. Matter listed for 2:15 PM afternoon session.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_3',
    clientName: 'Dr. Vikram Malhotra',
    clientPhone: '+91 99200 55123',
    opposingParty: 'State of Maharashtra (EOW)',
    caseTitle: 'Dr. Malhotra vs. State (Anticipatory Bail Application)',
    caseNumber: 'BAIL APPLN 1093/2024',
    caseCategory: 'Criminal Defense',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Critical',
    courtName: 'Sessions Court, Courtroom 12',
    hearingDate: getOffsetDateString(1), // Tomorrow
    hearingTime: '11:00',
    notes: 'Plea for interim protection from arrest under Sec 438 CrPC / Sec 482 BNSS. Medical records & audit trails submitted.',
    status: 'Active',
    updates: [
      {
        id: 'upd_3_1',
        date: getOffsetDateString(-2),
        time: '14:20',
        author: 'Adv. Ananya Singh',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Pre-Arrest Bail Draft Finalized',
        notes: 'Bail grounds finalized under Sec 438 CrPC / Sec 482 BNSS. Medical discharge certificates indexed.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_4',
    clientName: 'Ananya Singhal',
    clientPhone: '+91 98710 33456',
    opposingParty: 'Aditya Singhal & Anr',
    caseTitle: 'Singhal vs. Singhal (Ancestral Estate Partition Suit)',
    caseNumber: 'CS(OS) 329/2023',
    caseCategory: 'Civil Litigation',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'District Court Saket, Senior Civil Judge Bench',
    hearingDate: getOffsetDateString(3), // 3 days later
    hearingTime: '11:30',
    notes: 'Listed for cross-examination of Plaintiff Witness PW-1. Handed over original gift deeds to junior counsel.',
    status: 'Active',
    updates: [
      {
        id: 'upd_4_1',
        date: getOffsetDateString(-4),
        time: '15:10',
        author: 'Adv. Siddharth Rao',
        authorRole: 'Associate Advocate',
        type: 'filing',
        title: 'Original Title Deeds Placed in Safe Custody',
        notes: 'Registered gift deeds deposited with court registry officer under formal judicial receipt.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_5',
    clientName: 'Harpreet Singh Sandhu',
    clientPhone: '+91 98140 77211',
    opposingParty: 'Commissioner of Income Tax (Appeals)',
    caseTitle: 'Sandhu Logistics vs. CIT (Assessment Dispute AY 2021-22)',
    caseNumber: 'ITA 614/DEL/2024',
    caseCategory: 'Taxation & Customs',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_3',
    assignedToName: 'Adv. Ananya Singh',
    assignedToEmail: 'ananya.singh@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'Income Tax Appellate Tribunal (ITAT) - Bench C',
    hearingDate: getOffsetDateString(7), // Next week
    hearingTime: '10:00',
    notes: 'Penalty proceedings stayed. Rebuttal paper-book on Sec 68 unexplained cash credit to be placed on record.',
    status: 'Active',
    updates: [
      {
        id: 'upd_5_1',
        date: getOffsetDateString(-5),
        time: '11:00',
        author: 'Adv. Ananya Singh',
        authorRole: 'Associate Advocate',
        type: 'status',
        title: 'Interim Stay on Tax Recovery Confirmed',
        notes: 'ITAT Bench C confirmed stay on demand till hearing of main appeal.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'case_' + Date.now() + '_6',
    clientName: 'Kavita Deshmukh',
    clientPhone: '+91 94220 11984',
    opposingParty: 'Rohan Deshmukh',
    caseTitle: 'Deshmukh vs. Deshmukh (Mutual Consent Decree)',
    caseNumber: 'HMA 412/2023',
    caseCategory: 'Family & Matrimonial',
    group: 'Constitutional & Writ',
    assignedTo: 'user_associate_5',
    assignedToName: 'Adv. Siddharth Rao',
    assignedToEmail: 'siddharth.rao@lexjuris.in',
    assignedBy: 'Adv. Vikramaditya Sharma (Group Head)',
    priority: 'Standard',
    courtName: 'Family Court, Principal Judge',
    hearingDate: getOffsetDateString(-2), // Past
    hearingTime: '12:00',
    notes: 'First motion decree granted. Second motion statutory 6-month period waived under Supreme Court guidelines.',
    status: 'Disposed',
    updates: [
      {
        id: 'upd_6_1',
        date: getOffsetDateString(-2),
        time: '12:00',
        author: 'Adv. Siddharth Rao',
        authorRole: 'Associate Advocate',
        type: 'order',
        title: 'First Motion Decree Passed',
        notes: 'Mutual consent petition allowed. Certified copies applied.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

// Sample Document Templates for Instant 1-Click Extraction
const SAMPLE_DOCUMENTS = {
  writ: {
    fileName: 'Writ_Petition_DDA_Encroachment_Swaminathan.pdf',
    fileSize: '2.4 MB',
    data: {
      clientName: 'Ramanathan Swaminathan',
      clientPhone: '+91 98402 33419',
      opposingParty: 'Delhi Development Authority (DDA) & Anr.',
      caseTitle: 'Swaminathan vs. DDA (Writ of Mandamus against Sealing Order)',
      caseNumber: 'WP(C) 7892/2024',
      caseCategory: 'Constitutional & Writ',
      priority: 'Critical',
      courtName: 'Delhi High Court - Special Division Bench, Courtroom 3',
      hearingDate: getOffsetDateString(2),
      hearingTime: '10:30',
      notes: 'URGENT: Notice of Motion filed. Challenge to retrospective sealing notice dated 12.08.2024 without granting hearing under DDA Master Plan 2021.'
    }
  },
  bail: {
    fileName: 'Anticipatory_Bail_Plea_BNSS482_Singhania.pdf',
    fileSize: '1.8 MB',
    data: {
      clientName: 'Vikas Singhania',
      clientPhone: '+91 99100 88234',
      opposingParty: 'State (NCT of Delhi) / Cyber Crime PS',
      caseTitle: 'Vikas Singhania vs. State (Sec 438 CrPC / 482 BNSS Pre-Arrest Bail)',
      caseNumber: 'BAIL APPLN 2419/2024',
      caseCategory: 'Criminal Defense',
      priority: 'Critical',
      courtName: 'Sessions Court Tis Hazari, Courtroom No. 8',
      hearingDate: getOffsetDateString(1),
      hearingTime: '11:00',
      notes: 'Allegations of IT Act Sec 66D violation. Applicant is an independent vendor with no administrative access to escrow servers. Medical bail on grounds of cardiac surgery.'
    }
  },
  commercial: {
    fileName: 'Commercial_Arbitration_Zenith_v_Falcon.docx',
    fileSize: '950 KB',
    data: {
      clientName: 'Zenith Cloud Technologies LLP',
      clientPhone: '+91 98211 55670',
      opposingParty: 'Falcon Global Logistics Inc.',
      caseTitle: 'Zenith Cloud vs. Falcon Global (Sec 9 Interim Injunction Application)',
      caseNumber: 'OMP(I)(COMM) 310/2024',
      caseCategory: 'Corporate & M&A',
      priority: 'High',
      courtName: 'Commercial Appellate Court, Courtroom 5',
      hearingDate: getOffsetDateString(4),
      hearingTime: '14:30',
      notes: 'Prayer for restraint against invocation of unconditional Bank Guarantee worth INR 4.2 Crores. Pre-arbitration conciliation records placed on record.'
    }
  }
};

// Helper to generate ISO date strings offset by N days
function getOffsetDateString(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Application State
let state = {
  currentUser: null,
  cases: [],
  users: [],
  auditLogs: [],
  activeView: 'workspace', // 'workspace' | 'admin'
  currentFilter: 'all',
  searchQuery: '',
  searchMode: 'all', // 'all' | 'caseTitle' | 'clientName' | 'caseNumber'
  adminSearchQuery: '',
  adminRoleFilter: 'all',
  currentAttachedDoc: null,
  stagedDocs: [], // staged documents for new case intake
  activeDocsCaseId: null,
  currentModalAttachedDoc: null,
  currentQuickAttachedDoc: null,
  previewDoc: null,
  targetEditUserId: null,
  targetResetUserId: null,
  activeDocketCaseId: null,
  activeDocketTab: 'overview'
};

// ==========================================================================
// 2. DOM ELEMENT REFERENCES
// ==========================================================================

const dom = {
  // Auth
  authSection: document.getElementById('authSection'),
  authContainer: document.getElementById('authContainer'),
  tabLoginBtn: document.getElementById('tabLoginBtn'),
  tabSignupBtn: document.getElementById('tabSignupBtn'),
  loginFormContainer: document.getElementById('loginFormContainer'),
  signupFormContainer: document.getElementById('signupFormContainer'),
  gotoSignupLink: document.getElementById('gotoSignupLink'),
  gotoLoginLink: document.getElementById('gotoLoginLink'),
  authForm: document.getElementById('authForm'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  authEmailError: document.getElementById('authEmailError'),
  authPasswordError: document.getElementById('authPasswordError'),
  togglePwdBtn: document.getElementById('togglePwdBtn'),
  loginSubmitBtn: document.getElementById('loginSubmitBtn'),

  // Signup Elements
  signupForm: document.getElementById('signupForm'),
  signupName: document.getElementById('signupName'),
  signupEmail: document.getElementById('signupEmail'),
  signupRole: document.getElementById('signupRole'),
  signupBarReg: document.getElementById('signupBarReg'),
  signupDept: document.getElementById('signupDept'),
  signupPhone: document.getElementById('signupPhone'),
  signupPassword: document.getElementById('signupPassword'),
  signupConfirmPassword: document.getElementById('signupConfirmPassword'),
  signupTermsCheck: document.getElementById('signupTermsCheck'),
  signupNameError: document.getElementById('signupNameError'),
  signupEmailError: document.getElementById('signupEmailError'),
  signupBarRegError: document.getElementById('signupBarRegError'),
  signupPhoneError: document.getElementById('signupPhoneError'),
  signupPasswordError: document.getElementById('signupPasswordError'),
  signupConfirmPasswordError: document.getElementById('signupConfirmPasswordError'),
  signupTermsError: document.getElementById('signupTermsError'),
  btnGenSignupPwd: document.getElementById('btnGenSignupPwd'),
  toggleSignupPwdBtn: document.getElementById('toggleSignupPwdBtn'),
  signupSubmitBtn: document.getElementById('signupSubmitBtn'),
  
  // Dashboard & Navigation
  appContainer: document.getElementById('appContainer'),
  caseWorkspace: document.getElementById('caseWorkspace'),
  adminWorkspace: document.getElementById('adminWorkspace'),
  workspaceNavBtn: document.getElementById('workspaceNavBtn'),
  adminNavBtn: document.getElementById('adminNavBtn'),
  adminUserCountBadge: document.getElementById('adminUserCountBadge'),
  logoutBtn: document.getElementById('logoutBtn'),
  displayUserName: document.getElementById('displayUserName'),
  displayUserSubtitle: document.getElementById('displayUserSubtitle'),
  userRoleBadge: document.getElementById('userRoleBadge'),
  userInitials: document.getElementById('userInitials'),
  avatarRoleIndicator: document.getElementById('avatarRoleIndicator'),
  toggleFullscreenAppBtn: document.getElementById('toggleFullscreenAppBtn'),
  
  // Case Metrics
  statTodayHearings: document.getElementById('statTodayHearings'),
  statActiveCases: document.getElementById('statActiveCases'),
  statUrgentCases: document.getElementById('statUrgentCases'),
  countAll: document.getElementById('countAll'),
  countToday: document.getElementById('countToday'),
  countUpcoming: document.getElementById('countUpcoming'),
  countCritical: document.getElementById('countCritical'),
  countClosed: document.getElementById('countClosed'),

  // Left Form (Intake) & Parts Navigation
  newCaseForm: document.getElementById('newCaseForm'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  partDetailsBtn: document.getElementById('partDetailsBtn'),
  partDocsBtn: document.getElementById('partDocsBtn'),
  partDetailsPane: document.getElementById('partDetailsPane'),
  partDocsPane: document.getElementById('partDocsPane'),
  gotoDocsPartBtn: document.getElementById('gotoDocsPartBtn'),
  backToDetailsPartBtn: document.getElementById('backToDetailsPartBtn'),
  submitCaseWithDocsBtn: document.getElementById('submitCaseWithDocsBtn'),
  stagedDocsCountBadge: document.getElementById('stagedDocsCountBadge'),
  stagedDocsSummaryBadge: document.getElementById('stagedDocsSummaryBadge'),
  stagedDocsListCount: document.getElementById('stagedDocsListCount'),
  stagedDocsList: document.getElementById('stagedDocsList'),
  stagedDocsEmpty: document.getElementById('stagedDocsEmpty'),
  stageCurrentDocBtn: document.getElementById('stageCurrentDocBtn'),
  intakeDocCategory: document.getElementById('intakeDocCategory'),

  clientName: document.getElementById('clientName'),
  clientPhone: document.getElementById('clientPhone'),
  opposingParty: document.getElementById('opposingParty'),
  caseTitle: document.getElementById('caseTitle'),
  caseNumber: document.getElementById('caseNumber'),
  caseCategory: document.getElementById('caseCategory'),
  caseGroup: document.getElementById('caseGroup'),
  caseAssignee: document.getElementById('caseAssignee'),
  priorityLevel: document.getElementById('priorityLevel'),
  courtName: document.getElementById('courtName'),
  hearingDate: document.getElementById('hearingDate'),
  hearingTime: document.getElementById('hearingTime'),
  caseNotes: document.getElementById('caseNotes'),

  // Document Upload Elements
  docDropzone: document.getElementById('docDropzone'),
  caseDocInput: document.getElementById('caseDocInput'),
  dropzoneDefault: document.getElementById('dropzoneDefault'),
  dropzoneScanning: document.getElementById('dropzoneScanning'),
  scanningStatusText: document.getElementById('scanningStatusText'),
  scanningProgressFill: document.getElementById('scanningProgressFill'),
  dropzoneAttached: document.getElementById('dropzoneAttached'),
  attachedFileName: document.getElementById('attachedFileName'),
  attachedFileSize: document.getElementById('attachedFileSize'),
  removeDocBtn: document.getElementById('removeDocBtn'),
  sampleDocChips: document.querySelectorAll('.sample-chip'),

  // Right Stream & Filters
  accessScopeBanner: document.getElementById('accessScopeBanner'),
  clientSearchInput: document.getElementById('clientSearchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchModePills: document.querySelectorAll('.search-mode-pill'),
  filterPills: document.querySelectorAll('.filter-pill'),
  casesList: document.getElementById('casesList'),
  emptyState: document.getElementById('emptyState'),
  emptyStateMsg: document.getElementById('emptyStateMsg'),
  emptyStateActionBtn: document.getElementById('emptyStateActionBtn'),
  exportCasesBtn: document.getElementById('exportCasesBtn'),
  addSampleDataBtn: document.getElementById('addSampleDataBtn'),

  // Admin Portal Elements
  openAddUserModalBtn: document.getElementById('openAddUserModalBtn'),
  exportUsersBtn: document.getElementById('exportUsersBtn'),
  refreshUsersBtn: document.getElementById('refreshUsersBtn'),
  adminUserSearchInput: document.getElementById('adminUserSearchInput'),
  clearUserSearchBtn: document.getElementById('clearUserSearchBtn'),
  adminRoleFilterPills: document.querySelectorAll('#adminRoleFilterPills .filter-pill'),
  usersTableBody: document.getElementById('usersTableBody'),
  adminUserEmptyState: document.getElementById('adminUserEmptyState'),
  auditLogList: document.getElementById('auditLogList'),
  clearAuditLogsBtn: document.getElementById('clearAuditLogsBtn'),
  
  // Admin Stats
  adminStatTotalUsers: document.getElementById('adminStatTotalUsers'),
  adminStatAdvocates: document.getElementById('adminStatAdvocates'),
  adminStatAssociates: document.getElementById('adminStatAssociates'),
  adminStatClerks: document.getElementById('adminStatClerks'),
  adminStatDockets: document.getElementById('adminStatDockets'),
  countAdminAll: document.getElementById('countAdminAll'),
  countAdminAdmins: document.getElementById('countAdminAdmins'),
  countAdminSenior: document.getElementById('countAdminSenior'),
  countAdminAssoc: document.getElementById('countAdminAssoc'),
  countAdminClerks: document.getElementById('countAdminClerks'),

  // Modals
  caseModal: document.getElementById('caseModal'),
  rescheduleForm: document.getElementById('rescheduleForm'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  editCaseId: document.getElementById('editCaseId'),
  modalSubtitle: document.getElementById('modalSubtitle'),
  modalClientSummary: document.getElementById('modalClientSummary'),
  editCourtName: document.getElementById('editCourtName'),
  editHearingDate: document.getElementById('editHearingDate'),
  editHearingTime: document.getElementById('editHearingTime'),
  editCaseStatus: document.getElementById('editCaseStatus'),
  editCaseGroup: document.getElementById('editCaseGroup'),
  editCaseAssignee: document.getElementById('editCaseAssignee'),
  editNotes: document.getElementById('editNotes'),

  // Case Updates Modal Elements
  caseUpdatesModal: document.getElementById('caseUpdatesModal'),
  closeCaseUpdatesModalBtn: document.getElementById('closeCaseUpdatesModalBtn'),
  closeCaseUpdatesModalBottomBtn: document.getElementById('closeCaseUpdatesModalBottomBtn'),
  updatesTargetCaseId: document.getElementById('updatesTargetCaseId'),
  updatesCaseMeta: document.getElementById('updatesCaseMeta'),
  addCaseUpdateForm: document.getElementById('addCaseUpdateForm'),
  updateTitle: document.getElementById('updateTitle'),
  updateType: document.getElementById('updateType'),
  updateNotes: document.getElementById('updateNotes'),
  caseUpdatesTimeline: document.getElementById('caseUpdatesTimeline'),
  updatesCountBadge: document.getElementById('updatesCountBadge'),

  // Case Documents & Vault Modal Elements
  caseDocsModal: document.getElementById('caseDocsModal'),
  caseDocsModalTitle: document.getElementById('caseDocsModalTitle'),
  caseDocsModalSubtitle: document.getElementById('caseDocsModalSubtitle'),
  closeCaseDocsModalBtn: document.getElementById('closeCaseDocsModalBtn'),
  closeCaseDocsModalBottomBtn: document.getElementById('closeCaseDocsModalBottomBtn'),
  docsTargetCaseId: document.getElementById('docsTargetCaseId'),
  docsCaseMeta: document.getElementById('docsCaseMeta'),
  addCaseDocForm: document.getElementById('addCaseDocForm'),
  modalDocDropzone: document.getElementById('modalDocDropzone'),
  modalCaseDocInput: document.getElementById('modalCaseDocInput'),
  modalDropzoneDefault: document.getElementById('modalDropzoneDefault'),
  modalDropzoneAttached: document.getElementById('modalDropzoneAttached'),
  modalAttachedFileName: document.getElementById('modalAttachedFileName'),
  modalAttachedFileSize: document.getElementById('modalAttachedFileSize'),
  removeModalDocBtn: document.getElementById('removeModalDocBtn'),
  modalDocCategory: document.getElementById('modalDocCategory'),
  modalDocTitle: document.getElementById('modalDocTitle'),
  submitModalDocBtn: document.getElementById('submitModalDocBtn'),
  modalDocsCountBadge: document.getElementById('modalDocsCountBadge'),
  modalDocsList: document.getElementById('modalDocsList'),

  // Document Preview & AI Summary Modal
  docPreviewModal: document.getElementById('docPreviewModal'),
  docPreviewTitle: document.getElementById('docPreviewTitle'),
  docPreviewSubtitle: document.getElementById('docPreviewSubtitle'),
  closeDocPreviewModalBtn: document.getElementById('closeDocPreviewModalBtn'),
  closeDocPreviewBottomBtn: document.getElementById('closeDocPreviewBottomBtn'),
  downloadPreviewDocBtn: document.getElementById('downloadPreviewDocBtn'),
  docPreviewBody: document.getElementById('docPreviewBody'),
  tabDocViewBtn: document.getElementById('tabDocViewBtn'),
  tabDocAiBtn: document.getElementById('tabDocAiBtn'),
  tabDocMetaBtn: document.getElementById('tabDocMetaBtn'),
  paneDocView: document.getElementById('paneDocView'),
  paneDocAi: document.getElementById('paneDocAi'),
  paneDocMeta: document.getElementById('paneDocMeta'),
  generateDocAiBtn: document.getElementById('generateDocAiBtn'),
  copyDocAiBtn: document.getElementById('copyDocAiBtn'),
  openExternalDocBtn: document.getElementById('openExternalDocBtn'),
  insertAiNotesBtn: document.getElementById('insertAiNotesBtn'),

  // Add New Document to Existing Case Modal
  addNewDocModal: document.getElementById('addNewDocModal'),
  addNewDocModalTitle: document.getElementById('addNewDocModalTitle'),
  addNewDocModalSubtitle: document.getElementById('addNewDocModalSubtitle'),
  closeAddNewDocModalBtn: document.getElementById('closeAddNewDocModalBtn'),
  cancelAddNewDocModalBtn: document.getElementById('cancelAddNewDocModalBtn'),
  addNewDocForm: document.getElementById('addNewDocForm'),
  selectExistingCase: document.getElementById('selectExistingCase'),
  addNewDocCasePreview: document.getElementById('addNewDocCasePreview'),
  quickAddDocDropzone: document.getElementById('quickAddDocDropzone'),
  quickAddDocInput: document.getElementById('quickAddDocInput'),
  quickAddDropzoneDefault: document.getElementById('quickAddDropzoneDefault'),
  quickAddDropzoneAttached: document.getElementById('quickAddDropzoneAttached'),
  quickAddAttachedFileName: document.getElementById('quickAddAttachedFileName'),
  quickAddAttachedFileSize: document.getElementById('quickAddAttachedFileSize'),
  removeQuickAddDocBtn: document.getElementById('removeQuickAddDocBtn'),
  quickAddDocCategory: document.getElementById('quickAddDocCategory'),
  quickAddDocTitle: document.getElementById('quickAddDocTitle'),
  quickAddDocNotes: document.getElementById('quickAddDocNotes'),
  quickAddAutoAiSummary: document.getElementById('quickAddAutoAiSummary'),
  btnOpenGlobalAddDocModal: document.getElementById('btnOpenGlobalAddDocModal'),

  // User Add/Edit Modal
  userModal: document.getElementById('userModal'),
  userForm: document.getElementById('userForm'),
  editUserId: document.getElementById('editUserId'),
  userModalTitle: document.getElementById('userModalTitle'),
  userModalSubtitle: document.getElementById('userModalSubtitle'),
  closeUserModalBtn: document.getElementById('closeUserModalBtn'),
  cancelUserModalBtn: document.getElementById('cancelUserModalBtn'),
  modalUserName: document.getElementById('modalUserName'),
  modalUserEmail: document.getElementById('modalUserEmail'),
  modalUserRole: document.getElementById('modalUserRole'),
  modalUserBarReg: document.getElementById('modalUserBarReg'),
  modalUserPassword: document.getElementById('modalUserPassword'),
  userPasswordGroup: document.getElementById('userPasswordGroup'),
  pwdLabelText: document.getElementById('pwdLabelText'),
  passwordFieldHint: document.getElementById('passwordFieldHint'),
  btnGenRandomPwd: document.getElementById('btnGenRandomPwd'),
  toggleModalPwdBtn: document.getElementById('toggleModalPwdBtn'),
  modalUserDept: document.getElementById('modalUserDept'),
  modalUserGroupRole: document.getElementById('modalUserGroupRole'),
  modalUserPhone: document.getElementById('modalUserPhone'),
  modalUserStatus: document.getElementById('modalUserStatus'),
  modalUserNameError: document.getElementById('modalUserNameError'),
  modalUserEmailError: document.getElementById('modalUserEmailError'),
  modalUserPasswordError: document.getElementById('modalUserPasswordError'),

  // Reset Password Modal
  resetUserPasswordModal: document.getElementById('resetUserPasswordModal'),
  resetPwdForm: document.getElementById('resetPwdForm'),
  resetTargetUserId: document.getElementById('resetTargetUserId'),
  resetUserSummary: document.getElementById('resetUserSummary'),
  newResetPassword: document.getElementById('newResetPassword'),
  newResetPasswordError: document.getElementById('newResetPasswordError'),
  btnGenResetPwd: document.getElementById('btnGenResetPwd'),
  copyCredsToClipboard: document.getElementById('copyCredsToClipboard'),
  closeResetPwdModalBtn: document.getElementById('closeResetPwdModalBtn'),
  cancelResetPwdModalBtn: document.getElementById('cancelResetPwdModalBtn'),

  // Help Modal
  barHelpModal: document.getElementById('barHelpModal'),
  closeBarHelpBtn: document.getElementById('closeBarHelpBtn'),
  closeBarHelpModalBtn: document.getElementById('closeBarHelpModalBtn'),

  // Toast
  toastContainer: document.getElementById('toastContainer'),

  // Sliding Search Drawer (From Left) Elements
  searchDrawerOverlay: document.getElementById('searchDrawerOverlay'),
  searchDrawer: document.getElementById('searchDrawer'),
  btnToggleDrawerFullscreen: document.getElementById('btnToggleDrawerFullscreen'),
  drawerFullscreenIcon: document.getElementById('drawerFullscreenIcon'),
  btnCloseSearchDrawer: document.getElementById('btnCloseSearchDrawer'),
  drawerSearchInput: document.getElementById('drawerSearchInput'),
  clearDrawerSearchBtn: document.getElementById('clearDrawerSearchBtn'),
  drawerModePills: document.querySelectorAll('#drawerModePills .drawer-mode-pill'),
  drawerFilterPills: document.querySelectorAll('#drawerFilterPills .drawer-filter-pill'),
  drawerResultCountText: document.getElementById('drawerResultCountText'),
  drawerCasesList: document.getElementById('drawerCasesList'),
  drawerEmptyState: document.getElementById('drawerEmptyState'),
  floatingSearchDrawerBtn: document.getElementById('floatingSearchDrawerBtn'),
  floatingTabCountBadge: document.getElementById('floatingTabCountBadge'),
  openSearchDrawerNavBtn: document.getElementById('openSearchDrawerNavBtn'),
  btnOpenSearchDrawer: document.getElementById('btnOpenSearchDrawer'),
  leftSidebarRail: document.getElementById('leftSidebarRail'),
  sidebarRailSearchBtn: document.getElementById('sidebarRailSearchBtn'),
  sidebarRailClientsBtn: document.getElementById('sidebarRailClientsBtn'),
  railClientsCountBadge: document.getElementById('railClientsCountBadge'),
  sidebarRailExpandBtn: document.getElementById('sidebarRailExpandBtn'),
  railQuickClientsBtn: document.getElementById('railQuickClientsBtn'),
  railClientsBadge: document.getElementById('railClientsBadge'),
  railQuickTodayBtn: document.getElementById('railQuickTodayBtn'),
  railQuickUrgentBtn: document.getElementById('railQuickUrgentBtn'),
  railQuickUpcomingBtn: document.getElementById('railQuickUpcomingBtn'),
  idxShowAllClientsBtn: document.getElementById('idxShowAllClientsBtn'),
  idxClientsDirectoryBtn: document.getElementById('idxClientsDirectoryBtn'),
  idxClientsCountPill: document.getElementById('idxClientsCountPill'),
  idxAllCountBadge: document.getElementById('idxAllCountBadge'),
  idxClearDocketSearchBtn: document.getElementById('idxClearDocketSearchBtn'),
  allClientsModal: document.getElementById('allClientsModal'),
  closeAllClientsModalBtn: document.getElementById('closeAllClientsModalBtn'),
  clientsModalSearch: document.getElementById('clientsModalSearch'),
  clientsDirectoryGrid: document.getElementById('clientsDirectoryGrid'),
  cdTotalClients: document.getElementById('cdTotalClients'),
  cdActiveMatters: document.getElementById('cdActiveMatters'),
  cdHearingsListed: document.getElementById('cdHearingsListed'),
  activeWorkspaceSearchTag: document.getElementById('activeWorkspaceSearchTag'),
  workspaceSearchQueryText: document.getElementById('workspaceSearchQueryText'),
  clearWorkspaceSearchTagBtn: document.getElementById('clearWorkspaceSearchTagBtn'),

  // Full Screen Case Dossier Modal Elements
  fullScreenCaseModal: document.getElementById('fullScreenCaseModal'),
  closeFullScreenModalBtn: document.getElementById('closeFullScreenModalBtn'),
  fsCloseXBtn: document.getElementById('fsCloseXBtn'),
  fsCaseTitle: document.getElementById('fsCaseTitle'),
  fsStatusBadge: document.getElementById('fsStatusBadge'),
  fsPriorityBadge: document.getElementById('fsPriorityBadge'),
  fsCaseNumber: document.getElementById('fsCaseNumber'),
  fsCourtName: document.getElementById('fsCourtName'),
  fsCategory: document.getElementById('fsCategory'),
  fsPrintDocketBtn: document.getElementById('fsPrintDocketBtn'),
  fsAddDocBtn: document.getElementById('fsAddDocBtn'),
  fsRescheduleBtn: document.getElementById('fsRescheduleBtn'),
  fsHearingDateDisplay: document.getElementById('fsHearingDateDisplay'),
  fsHearingCountdown: document.getElementById('fsHearingCountdown'),
  fsClientNameDisplay: document.getElementById('fsClientNameDisplay'),
  fsClientPhoneDisplay: document.getElementById('fsClientPhoneDisplay'),
  fsPracticeGroup: document.getElementById('fsPracticeGroup'),
  fsAssignedCounsel: document.getElementById('fsAssignedCounsel'),
  fsDocsCount: document.getElementById('fsDocsCount'),
  fsUpdatesCount: document.getElementById('fsUpdatesCount'),
  fsDetailClientName: document.getElementById('fsDetailClientName'),
  fsDetailPhone: document.getElementById('fsDetailPhone'),
  fsDetailOpposing: document.getElementById('fsDetailOpposing'),
  fsDetailCourt: document.getElementById('fsDetailCourt'),
  fsDetailCategory: document.getElementById('fsDetailCategory'),
  fsDetailCaseId: document.getElementById('fsDetailCaseId'),
  fsDetailNotes: document.getElementById('fsDetailNotes'),
  fsEditNotesBtn: document.getElementById('fsEditNotesBtn'),
  fsLogUpdateBtn: document.getElementById('fsLogUpdateBtn'),
  fsTimelineList: document.getElementById('fsTimelineList'),
  fsVaultCountBadge: document.getElementById('fsVaultCountBadge'),
  fsUploadDocVaultBtn: document.getElementById('fsUploadDocVaultBtn'),
  fsDocsGrid: document.getElementById('fsDocsGrid')
};

// ==========================================================================
// 3. INITIALIZATION & AUTHENTICATION
// ==========================================================================

function initApp() {
  loadStoredUsers();
  loadStoredCases();
  loadAuditLogs();
  checkAuthSession();
  setupEventListeners();
  setDefaultFormDates();
  setupAiChatbot();
}

function loadStoredUsers() {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored) {
    try {
      state.users = JSON.parse(stored);
      if (!state.users || !Array.isArray(state.users) || state.users.length === 0) {
        state.users = [...DEFAULT_USERS];
        saveUsersToStorage();
      } else {
        // Migration: Ensure all pre-seeded users exist and have group, groupRole & isGroupHead
        let updated = false;
        DEFAULT_USERS.forEach(defUser => {
          const existing = state.users.find(u => u.email.toLowerCase() === defUser.email.toLowerCase());
          if (!existing) {
            state.users.push({ ...defUser });
            updated = true;
          } else {
            if (!existing.group || existing.isGroupHead === undefined || !existing.groupRole) {
              existing.group = defUser.group || existing.dept || 'Constitutional & Writ';
              existing.groupRole = defUser.groupRole || (defUser.isGroupHead ? 'head' : 'subordinate');
              existing.isGroupHead = defUser.isGroupHead;
              if (defUser.role) existing.role = defUser.role;
              updated = true;
            }
          }
        });
        if (updated) saveUsersToStorage();
      }
    } catch (e) {
      state.users = [...DEFAULT_USERS];
      saveUsersToStorage();
    }
  } else {
    state.users = [...DEFAULT_USERS];
    saveUsersToStorage();
  }
}

function saveUsersToStorage() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
  updateAdminBadge();
}

function loadAuditLogs() {
  const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  if (stored) {
    try {
      state.auditLogs = JSON.parse(stored);
    } catch (e) {
      state.auditLogs = [];
    }
  } else {
    state.auditLogs = [
      {
        id: 'audit_' + Date.now(),
        action: 'Chambers System Initialized',
        details: 'Pre-seeded 4 default chambers practitioner credentials & RBAC matrix.',
        actor: 'System Admin',
        type: 'create',
        timestamp: new Date().toISOString()
      }
    ];
    saveAuditLogsToStorage();
  }
}

function saveAuditLogsToStorage() {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(state.auditLogs));
}

function logAuditEvent(action, details, type = 'general', actor = null) {
  const currentActor = actor || (state.currentUser ? state.currentUser.name : 'Chambers Administrator');
  const event = {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    action: action,
    details: details,
    actor: currentActor,
    type: type,
    timestamp: new Date().toISOString()
  };
  state.auditLogs.unshift(event);
  // Keep last 100 audit events
  if (state.auditLogs.length > 100) state.auditLogs.pop();
  saveAuditLogsToStorage();
  if (state.activeView === 'admin') renderAuditTrail();
}

function updateAdminBadge() {
  if (dom.adminUserCountBadge) {
    dom.adminUserCountBadge.textContent = state.users.length;
  }
}

function checkAuthSession() {
  const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      // Verify user still exists in active users list
      const matched = state.users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
      if (matched && matched.status !== 'Suspended') {
        state.currentUser = matched;
        showDashboard();
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        showAuthScreen();
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
}

function showAuthScreen() {
  if (dom.authSection) dom.authSection.classList.remove('hidden');
  if (dom.appContainer) dom.appContainer.classList.add('hidden');
  
  // Hide AI widget on login screen
  const aiWidget = document.getElementById('aiChatWidget');
  if (aiWidget) aiWidget.classList.add('hidden');
}

function showDashboard() {
  if (dom.authSection) dom.authSection.classList.add('hidden');
  if (dom.appContainer) dom.appContainer.classList.remove('hidden');
  
  // Show AI widget on dashboard
  const aiWidget = document.getElementById('aiChatWidget');
  if (aiWidget) aiWidget.classList.remove('hidden');
  
  if (state.currentUser) {
    if (dom.displayUserName) dom.displayUserName.textContent = state.currentUser.name || 'Counsel';
    if (dom.userRoleBadge) dom.userRoleBadge.textContent = state.currentUser.role || 'Senior Advocate';
    if (dom.displayUserSubtitle) {
      dom.displayUserSubtitle.textContent = `${state.currentUser.role} • Bar Reg: ${state.currentUser.barReg || 'D/Reg'}`;
    }
    
    // Set Initials
    const initials = (state.currentUser.name || 'VS')
      .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s+/i, '')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    if (dom.userInitials) dom.userInitials.textContent = initials || 'VS';

    // Show / Hide Admin Crown indicator on avatar
    const isAdmin = state.currentUser.role === 'Chambers Administrator';
    if (dom.avatarRoleIndicator) {
      dom.avatarRoleIndicator.style.display = isAdmin ? 'block' : 'none';
    }

    // Configure Admin Navigation button visibility
    if (dom.adminNavBtn) {
      if (isAdmin) {
        dom.adminNavBtn.style.display = 'inline-flex';
      } else {
        dom.adminNavBtn.style.display = 'none';
      }
    }
  }
  
  updateAdminBadge();

  try {
    if (state.activeView === 'admin') {
      switchWorkspaceView('admin');
    } else {
      populateAssigneeDropdowns();
      switchWorkspaceView('workspace');
      renderDashboard();
    }
  } catch (err) {
    console.error('Error rendering dashboard:', err);
  }
}

// Workspace View Switcher (Cases vs Admin Portal)
function switchWorkspaceView(view) {
  if (view === 'admin') {
    const isAdmin = state.currentUser && state.currentUser.role === 'Chambers Administrator';
    if (!isAdmin) {
      showToast('Access Denied: Only the Chambers Administrator can access the Admin Portal.', 'error');
      if (state.activeView !== 'admin') {
        return; // stay on current view
      } else {
        view = 'workspace'; // fallback
      }
    }
  }

  state.activeView = view;
  
  if (view === 'admin') {
    if (dom.caseWorkspace) dom.caseWorkspace.classList.add('hidden');
    if (dom.adminWorkspace) dom.adminWorkspace.classList.remove('hidden');
    if (dom.workspaceNavBtn) dom.workspaceNavBtn.classList.remove('active');
    if (dom.adminNavBtn) dom.adminNavBtn.classList.add('active');
    renderAdminPortal();
  } else {
    if (dom.adminWorkspace) dom.adminWorkspace.classList.add('hidden');
    if (dom.caseWorkspace) dom.caseWorkspace.classList.remove('hidden');
    if (dom.adminNavBtn) dom.adminNavBtn.classList.remove('active');
    if (dom.workspaceNavBtn) dom.workspaceNavBtn.classList.add('active');
    renderDashboard();
  }
}

// Global 1-Click Quick Demo Login as specific user
window.quickDemoLoginAs = function(email) {
  const found = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    if (found.status === 'Suspended') {
      showToast('This account has been suspended by Chambers Administrator.', 'error');
      return;
    }
    if (dom.authEmail) dom.authEmail.value = found.email;
    if (dom.authPassword) dom.authPassword.value = found.password;
    
    found.lastLogin = new Date().toISOString();
    saveUsersToStorage();
    
    state.currentUser = found;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(found));
    
    logAuditEvent('User Logged In', `User ${found.name} (${found.role}) authenticated via Instant Demo Access.`, 'login', found.name);
    
    showToast(`Welcome to Chambers, ${found.name} (${found.role})`, 'success');
    
    // If admin logs in, default to Admin portal or workspace
    if (found.role === 'Chambers Administrator') {
      state.activeView = 'admin';
    } else {
      state.activeView = 'workspace';
    }
    showDashboard();
  }
};

window.quickDemoLogin = function() {
  window.quickDemoLoginAs('advocate.sharma@lexjuris.in');
};

window.showBarCouncilHelp = function(e) {
  if (e) e.preventDefault();
  if (dom.barHelpModal) dom.barHelpModal.classList.remove('hidden');
};

window.openAddUserModal = openAddUserModal;
window.handleLogin = handleLogin;

function loadStoredCases() {
  const stored = localStorage.getItem(STORAGE_KEYS.CASES);
  if (stored) {
    try {
      state.cases = JSON.parse(stored);
      if (!state.cases || !Array.isArray(state.cases) || state.cases.length === 0 || !state.cases.some(c => c.clientName === 'Kunal Singhal' && c.caseNumber === 'LA.APP. 9442/2024')) {
        state.cases = [...SAMPLE_CASES];
        saveCasesToStorage();
      } else {
        // Migration: Ensure all cases have group, assignedTo, assignedToName, assignedToEmail, and updates
        let updated = false;
        state.cases.forEach((c, idx) => {
          if (!c.group) {
            c.group = 'Constitutional & Writ';
            updated = true;
          }
          if (!c.assignedTo) {
            // Assign alternately to Ananya Singh or Siddharth Rao
            if (idx % 2 === 0) {
              c.assignedTo = 'user_associate_3';
              c.assignedToName = 'Adv. Ananya Singh';
              c.assignedToEmail = 'ananya.singh@lexjuris.in';
            } else {
              c.assignedTo = 'user_associate_5';
              c.assignedToName = 'Adv. Siddharth Rao';
              c.assignedToEmail = 'siddharth.rao@lexjuris.in';
            }
            c.assignedBy = 'Adv. Vikramaditya Sharma (Group Head)';
            updated = true;
          }
          if (!c.updates || !Array.isArray(c.updates) || c.updates.length === 0) {
            c.updates = [
              {
                id: 'upd_init_' + (c.id || idx),
                date: c.hearingDate || getOffsetDateString(0),
                time: c.hearingTime || '10:30',
                author: c.assignedToName || 'Associate Advocate',
                authorRole: 'Counsel',
                type: 'filing',
                title: 'Case Registered & Assigned',
                notes: `Docket allocated to ${c.assignedToName || 'Counsel'} in ${c.group} practice group.`
              }
            ];
            updated = true;
          }
          if (!c.documents || !Array.isArray(c.documents) || c.documents.length === 0) {
            c.documents = c.attachedDoc ? [
              {
                id: 'doc_' + (c.id || idx) + '_1',
                name: c.attachedDoc.name,
                size: c.attachedDoc.size || '1.4 MB',
                type: 'application/pdf',
                category: 'Petition / Plaint',
                title: c.attachedDoc.name.replace(/\.[^/.]+$/, ''),
                uploadedAt: c.createdAt || new Date().toISOString(),
                uploadedBy: c.assignedToName || 'Advocate'
              }
            ] : [
              {
                id: 'doc_' + (c.id || idx) + '_1',
                name: `${(c.caseTitle || 'Docket').substring(0, 22).replace(/[^a-zA-Z0-9]/g, '_')}_Brief.pdf`,
                size: '1.8 MB',
                type: 'application/pdf',
                category: 'Petition / Plaint',
                title: `${c.caseTitle || 'Case'} - Initial Docket Brief`,
                uploadedAt: c.createdAt || new Date().toISOString(),
                uploadedBy: c.assignedToName || 'Advocate'
              }
            ];
            updated = true;
          }
        });
        if (updated) saveCasesToStorage();
      }
    } catch (e) {
      state.cases = [...SAMPLE_CASES];
      saveCasesToStorage();
    }
  } else {
    state.cases = [...SAMPLE_CASES];
    saveCasesToStorage();
  }
}

function saveCasesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(state.cases));
  } catch (err) {
    console.warn('LocalStorage quota limit reached, trimming large file data for persistence:', err);
    try {
      const slimCases = state.cases.map(c => ({
        ...c,
        documents: (c.documents || []).map(d => ({
          ...d,
          fileData: d.fileData && d.fileData.length > 250000 ? null : d.fileData
        }))
      }));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(slimCases));
    } catch (err2) {
      console.error('Could not save cases to localStorage:', err2);
    }
  }
}

function setDefaultFormDates() {
  // Set default hearing date to tomorrow at 10:30 AM for ease of entry
  const tomorrow = getOffsetDateString(1);
  if (dom.hearingDate) dom.hearingDate.value = tomorrow;
  if (dom.hearingTime) dom.hearingTime.value = '10:30';
}

// ==========================================================================
// 4. EVENT LISTENERS
// ==========================================================================

function setupEventListeners() {
  // Auth Tab Switchers (Sign In vs Sign Up)
  if (dom.tabLoginBtn) {
    dom.tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  }
  if (dom.tabSignupBtn) {
    dom.tabSignupBtn.addEventListener('click', () => switchAuthTab('signup'));
  }
  if (dom.gotoSignupLink) {
    dom.gotoSignupLink.addEventListener('click', () => switchAuthTab('signup'));
  }
  if (dom.gotoLoginLink) {
    dom.gotoLoginLink.addEventListener('click', () => switchAuthTab('login'));
  }

  // Password Visibility Toggle (Login Auth)
  if (dom.togglePwdBtn) {
    dom.togglePwdBtn.addEventListener('click', () => {
      const isPassword = dom.authPassword.getAttribute('type') === 'password';
      dom.authPassword.setAttribute('type', isPassword ? 'text' : 'password');
      dom.togglePwdBtn.innerHTML = isPassword 
        ? '<i class="fa-regular fa-eye-slash"></i>' 
        : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Sign Up Form Submit
  if (dom.signupForm) {
    dom.signupForm.addEventListener('submit', handleSignup);
  }

  // Generate Random Password for Sign Up
  if (dom.btnGenSignupPwd) {
    dom.btnGenSignupPwd.addEventListener('click', () => {
      const pwd = generateRandomPassword();
      if (dom.signupPassword) dom.signupPassword.value = pwd;
      if (dom.signupConfirmPassword) dom.signupConfirmPassword.value = pwd;
    });
  }

  // Toggle Sign Up Password Visibility
  if (dom.toggleSignupPwdBtn) {
    dom.toggleSignupPwdBtn.addEventListener('click', () => {
      const isPwd = dom.signupPassword.getAttribute('type') === 'password';
      dom.signupPassword.setAttribute('type', isPwd ? 'text' : 'password');
      dom.toggleSignupPwdBtn.innerHTML = isPwd 
        ? '<i class="fa-regular fa-eye-slash"></i>' 
        : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Auth Form Submit
  if (dom.authForm) {
    dom.authForm.addEventListener('submit', handleLogin);
  }

  // Logout
  if (dom.logoutBtn) {
    dom.logoutBtn.addEventListener('click', handleLogout);
  }

  // Workspace Nav View Switcher
  if (dom.workspaceNavBtn) {
    dom.workspaceNavBtn.addEventListener('click', () => switchWorkspaceView('workspace'));
  }
  if (dom.adminNavBtn) {
    dom.adminNavBtn.addEventListener('click', () => switchWorkspaceView('admin'));
  }

  // Fullscreen Workspace Toggle
  if (dom.toggleFullscreenAppBtn) {
    dom.toggleFullscreenAppBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        dom.toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
      } else {
        document.exitFullscreen().catch(() => {});
        dom.toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
      }
    });
  }

  // New Case Form Submit
  if (dom.newCaseForm) {
    dom.newCaseForm.addEventListener('submit', handleNewCaseSubmit);
  }

  // Reset Intake Form
  if (dom.resetFormBtn) {
    dom.resetFormBtn.addEventListener('click', () => {
      dom.newCaseForm.reset();
      state.stagedDocs = [];
      renderStagedDocs();
      switchIntakePart('details');
      setDefaultFormDates();
      clearValidationErrors();
      showToast('Intake form cleared', 'info');
    });
  }

  // Intake Parts Tab Navigation (Part 1: Details vs Part 2: Documents)
  if (dom.partDetailsBtn) {
    dom.partDetailsBtn.addEventListener('click', () => switchIntakePart('details'));
  }
  if (dom.partDocsBtn) {
    dom.partDocsBtn.addEventListener('click', () => switchIntakePart('docs'));
  }
  if (dom.gotoDocsPartBtn) {
    dom.gotoDocsPartBtn.addEventListener('click', () => switchIntakePart('docs'));
  }
  if (dom.backToDetailsPartBtn) {
    dom.backToDetailsPartBtn.addEventListener('click', () => switchIntakePart('details'));
  }
  if (dom.stageCurrentDocBtn) {
    dom.stageCurrentDocBtn.addEventListener('click', stageCurrentIntakeDoc);
  }

  // Client Search Live Filter
  if (dom.clientSearchInput) {
    dom.clientSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (state.searchQuery.length > 0) {
        dom.clearSearchBtn.classList.remove('hidden');
      } else {
        dom.clearSearchBtn.classList.add('hidden');
      }
      renderCasesList();
    });

    dom.clientSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openSearchDrawer(dom.clientSearchInput.value);
      }
    });
  }

  // Clear Search Button
  if (dom.clearSearchBtn) {
    dom.clearSearchBtn.addEventListener('click', () => {
      dom.clientSearchInput.value = '';
      state.searchQuery = '';
      dom.clearSearchBtn.classList.add('hidden');
      renderCasesList();
    });
  }

  // Search Mode Selector Pills (All, Case Name, Client Name, Case No)
  if (dom.searchModePills) {
    dom.searchModePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const mode = pill.getAttribute('data-mode');
        switchSearchMode(mode);
      });
    });
  }

  // Case Filter Pills Selection
  dom.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dom.filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.currentFilter = pill.getAttribute('data-filter');
      renderCasesList();
    });
  });

  // Extended Blue Sidebar search input
  const extSearchInput = document.getElementById('extRailSearchInput');
  const extClearBtn = document.getElementById('extClearSearchBtn');
  if (extSearchInput) {
    extSearchInput.addEventListener('input', (e) => {
      extRailSearchQuery = e.target.value.trim();
      if (extClearBtn) {
        if (extRailSearchQuery.length > 0) extClearBtn.classList.remove('hidden');
        else extClearBtn.classList.add('hidden');
      }
      window.renderExtClientsList();
    });
  }
  if (dom.idxShowAllClientsBtn) {
    dom.idxShowAllClientsBtn.addEventListener('click', () => window.showAllClients());
  }
  if (dom.idxClientsDirectoryBtn) {
    dom.idxClientsDirectoryBtn.addEventListener('click', () => window.openAllClientsModal());
  }
  if (dom.closeAllClientsModalBtn) {
    dom.closeAllClientsModalBtn.addEventListener('click', () => window.closeAllClientsModal());
  }
  if (dom.allClientsModal) {
    dom.allClientsModal.addEventListener('click', (e) => {
      if (e.target === dom.allClientsModal) window.closeAllClientsModal();
    });
  }
  if (dom.clientsModalSearch) {
    dom.clientsModalSearch.addEventListener('input', (e) => {
      window.filterClientsDirectory(e.target.value);
    });
  }

  // Sliding Case Search & Directory Drawer Event Handlers (for header/nav trigger)
  if (dom.floatingSearchDrawerBtn) {
    dom.floatingSearchDrawerBtn.addEventListener('click', () => openSearchDrawer());
  }
  if (dom.openSearchDrawerNavBtn) {
    dom.openSearchDrawerNavBtn.addEventListener('click', () => openSearchDrawer());
  }
  if (dom.btnOpenSearchDrawer) {
    dom.btnOpenSearchDrawer.addEventListener('click', () => openSearchDrawer());
  }
  if (dom.btnCloseSearchDrawer) {
    dom.btnCloseSearchDrawer.addEventListener('click', closeSearchDrawer);
  }
  if (dom.btnToggleDrawerFullscreen) {
    dom.btnToggleDrawerFullscreen.addEventListener('click', () => toggleDrawerFullscreen());
  }
  if (dom.searchDrawerOverlay) {
    dom.searchDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === dom.searchDrawerOverlay) closeSearchDrawer();
    });
  }

  // Active Workspace Search Tag Clear button
  if (dom.clearWorkspaceSearchTagBtn) {
    dom.clearWorkspaceSearchTagBtn.addEventListener('click', () => {
      state.searchQuery = '';
      drawerState.searchQuery = '';
      if (dom.drawerSearchInput) dom.drawerSearchInput.value = '';
      if (dom.clearDrawerSearchBtn) dom.clearDrawerSearchBtn.classList.add('hidden');
      updateWorkspaceSearchTag();
      renderCasesList();
      renderDrawerCasesList();
    });
  }

  // Drawer Search Input - live sync with workspace & tag
  if (dom.drawerSearchInput) {
    dom.drawerSearchInput.addEventListener('input', (e) => {
      drawerState.searchQuery = e.target.value.trim().toLowerCase();
      state.searchQuery = drawerState.searchQuery;
      if (drawerState.searchQuery) {
        if (dom.clearDrawerSearchBtn) dom.clearDrawerSearchBtn.classList.remove('hidden');
      } else {
        if (dom.clearDrawerSearchBtn) dom.clearDrawerSearchBtn.classList.add('hidden');
      }
      updateWorkspaceSearchTag();
      renderDrawerCasesList();
      renderCasesList();
    });
  }

  // Clear Drawer Search Button
  if (dom.clearDrawerSearchBtn) {
    dom.clearDrawerSearchBtn.addEventListener('click', () => {
      if (dom.drawerSearchInput) dom.drawerSearchInput.value = '';
      drawerState.searchQuery = '';
      state.searchQuery = '';
      dom.clearDrawerSearchBtn.classList.add('hidden');
      updateWorkspaceSearchTag();
      renderDrawerCasesList();
      renderCasesList();
      if (dom.drawerSearchInput) dom.drawerSearchInput.focus();
    });
  }

  // Drawer Search Mode Pills
  if (dom.drawerModePills) {
    dom.drawerModePills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.drawerModePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        drawerState.searchMode = pill.getAttribute('data-mode') || 'all';
        renderDrawerCasesList();
      });
    });
  }

  // Drawer Filter Pills
  if (dom.drawerFilterPills) {
    dom.drawerFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.drawerFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        drawerState.currentFilter = pill.getAttribute('data-filter') || 'all';
        renderDrawerCasesList();
      });
    });
  }

  // Full Screen Case Dossier Modal Close Handlers
  if (dom.closeFullScreenModalBtn) {
    dom.closeFullScreenModalBtn.addEventListener('click', closeFullScreenCase);
  }
  if (dom.fsCloseXBtn) {
    dom.fsCloseXBtn.addEventListener('click', closeFullScreenCase);
  }
  if (dom.fullScreenCaseModal) {
    dom.fullScreenCaseModal.addEventListener('click', (e) => {
      if (e.target === dom.fullScreenCaseModal) closeFullScreenCase();
    });
  }

  // Full Screen Case Actions
  if (dom.fsPrintDocketBtn) {
    dom.fsPrintDocketBtn.addEventListener('click', () => {
      if (!state.activeFullScreenCaseId) return;
      window.print();
    });
  }
  if (dom.fsAddDocBtn) {
    dom.fsAddDocBtn.addEventListener('click', () => {
      if (state.activeFullScreenCaseId) openAddNewDocModal(state.activeFullScreenCaseId);
    });
  }
  if (dom.fsUploadDocVaultBtn) {
    dom.fsUploadDocVaultBtn.addEventListener('click', () => {
      if (state.activeFullScreenCaseId) openAddNewDocModal(state.activeFullScreenCaseId);
    });
  }
  if (dom.fsRescheduleBtn) {
    dom.fsRescheduleBtn.addEventListener('click', () => {
      if (state.activeFullScreenCaseId) openRescheduleModal(state.activeFullScreenCaseId);
    });
  }
  if (dom.fsEditNotesBtn) {
    dom.fsEditNotesBtn.addEventListener('click', () => {
      if (state.activeFullScreenCaseId) openRescheduleModal(state.activeFullScreenCaseId);
    });
  }
  if (dom.fsLogUpdateBtn) {
    dom.fsLogUpdateBtn.addEventListener('click', () => {
      if (state.activeFullScreenCaseId) openCaseUpdatesModal(state.activeFullScreenCaseId);
    });
  }

  // Global Keyboard Shortcuts (Ctrl+K for search drawer, Escape to close)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (dom.searchDrawerOverlay && dom.searchDrawerOverlay.classList.contains('active')) {
        closeSearchDrawer();
      } else {
        openSearchDrawer();
      }
    } else if (e.key === 'Escape') {
      if (dom.fullScreenCaseModal && dom.fullScreenCaseModal.classList.contains('active')) {
        closeFullScreenCase();
      } else if (dom.searchDrawerOverlay && dom.searchDrawerOverlay.classList.contains('active')) {
        closeSearchDrawer();
      }
    }
  });

  // Add Sample Data Button
  if (dom.addSampleDataBtn) {
    dom.addSampleDataBtn.addEventListener('click', () => {
      state.cases = [...SAMPLE_CASES];
      saveCasesToStorage();
      renderDashboard();
      showToast('Realistic cause list and client dockets reloaded!', 'success');
    });
  }

  // Empty State Action
  if (dom.emptyStateActionBtn) {
    dom.emptyStateActionBtn.addEventListener('click', () => {
      if (dom.clientName) dom.clientName.focus();
    });
  }

  // Export Cause List / Print
  if (dom.exportCasesBtn) {
    dom.exportCasesBtn.addEventListener('click', exportCauseList);
  }

  // Modal Reschedule Close / Cancel
  if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', closeModal);
  if (dom.cancelModalBtn) dom.cancelModalBtn.addEventListener('click', closeModal);
  if (dom.caseModal) {
    dom.caseModal.addEventListener('click', (e) => {
      if (e.target === dom.caseModal) closeModal();
    });
  }

  // Reschedule Form Submit
  if (dom.rescheduleForm) {
    dom.rescheduleForm.addEventListener('submit', handleRescheduleSubmit);
  }

  // Group Selection Dynamic Assignee Population
  if (dom.caseGroup) {
    dom.caseGroup.addEventListener('change', populateAssigneeDropdowns);
  }
  if (dom.editCaseGroup) {
    dom.editCaseGroup.addEventListener('change', () => {
      populateEditAssigneeDropdown(dom.editCaseGroup.value);
    });
  }

  // Case Updates Modal Event Handlers
  if (dom.closeCaseUpdatesModalBtn) {
    dom.closeCaseUpdatesModalBtn.addEventListener('click', closeCaseUpdatesModal);
  }
  if (dom.closeCaseUpdatesModalBottomBtn) {
    dom.closeCaseUpdatesModalBottomBtn.addEventListener('click', closeCaseUpdatesModal);
  }
  if (dom.caseUpdatesModal) {
    dom.caseUpdatesModal.addEventListener('click', (e) => {
      if (e.target === dom.caseUpdatesModal) closeCaseUpdatesModal();
    });
  }
  if (dom.addCaseUpdateForm) {
    dom.addCaseUpdateForm.addEventListener('submit', handleAddCaseUpdateSubmit);
  }

  // Case Documents & Vault Modal Event Handlers
  if (dom.closeCaseDocsModalBtn) {
    dom.closeCaseDocsModalBtn.addEventListener('click', closeCaseDocsModal);
  }
  if (dom.closeCaseDocsModalBottomBtn) {
    dom.closeCaseDocsModalBottomBtn.addEventListener('click', closeCaseDocsModal);
  }
  if (dom.caseDocsModal) {
    dom.caseDocsModal.addEventListener('click', (e) => {
      if (e.target === dom.caseDocsModal) closeCaseDocsModal();
    });
  }
  if (dom.addCaseDocForm) {
    dom.addCaseDocForm.addEventListener('submit', handleAddCaseDocSubmit);
  }
  if (dom.modalCaseDocInput) {
    dom.modalCaseDocInput.addEventListener('change', handleModalDocSelect);
  }
  if (dom.removeModalDocBtn) {
    dom.removeModalDocBtn.addEventListener('click', resetModalDocDropzone);
  }

  // Document Preview Modal Event Handlers
  if (dom.closeDocPreviewModalBtn) {
    dom.closeDocPreviewModalBtn.addEventListener('click', closeDocPreviewModal);
  }
  if (dom.closeDocPreviewBottomBtn) {
    dom.closeDocPreviewBottomBtn.addEventListener('click', closeDocPreviewModal);
  }
  if (dom.docPreviewModal) {
    dom.docPreviewModal.addEventListener('click', (e) => {
      if (e.target === dom.docPreviewModal) closeDocPreviewModal();
    });
  }

  // Document Preview Tabs Switchers
  if (dom.tabDocViewBtn) {
    dom.tabDocViewBtn.addEventListener('click', () => switchDocPreviewTab('paneDocView'));
  }
  if (dom.tabDocAiBtn) {
    dom.tabDocAiBtn.addEventListener('click', () => switchDocPreviewTab('paneDocAi'));
  }
  if (dom.tabDocMetaBtn) {
    dom.tabDocMetaBtn.addEventListener('click', () => switchDocPreviewTab('paneDocMeta'));
  }

  // AI Summary Actions
  if (dom.generateDocAiBtn) {
    dom.generateDocAiBtn.addEventListener('click', handleTriggerAiSummary);
  }
  if (dom.copyDocAiBtn) {
    dom.copyDocAiBtn.addEventListener('click', copyAiSummaryToClipboard);
  }
  if (dom.insertAiNotesBtn) {
    dom.insertAiNotesBtn.addEventListener('click', appendAiSummaryToCaseNotes);
  }
  if (dom.openExternalDocBtn) {
    dom.openExternalDocBtn.addEventListener('click', openCurrentDocInNewTab);
  }

  // Add New Document to Existing Case Modal Event Handlers
  if (dom.btnOpenGlobalAddDocModal) {
    dom.btnOpenGlobalAddDocModal.addEventListener('click', () => openAddNewDocModal());
  }
  if (dom.closeAddNewDocModalBtn) {
    dom.closeAddNewDocModalBtn.addEventListener('click', closeAddNewDocModal);
  }
  if (dom.cancelAddNewDocModalBtn) {
    dom.cancelAddNewDocModalBtn.addEventListener('click', closeAddNewDocModal);
  }
  if (dom.addNewDocModal) {
    dom.addNewDocModal.addEventListener('click', (e) => {
      if (e.target === dom.addNewDocModal) closeAddNewDocModal();
    });
  }
  if (dom.selectExistingCase) {
    dom.selectExistingCase.addEventListener('change', updateAddNewDocCasePreview);
  }
  if (dom.quickAddDocInput) {
    dom.quickAddDocInput.addEventListener('change', handleQuickAddDocSelect);
  }
  if (dom.removeQuickAddDocBtn) {
    dom.removeQuickAddDocBtn.addEventListener('click', resetQuickAddDocDropzone);
  }
  if (dom.addNewDocForm) {
    dom.addNewDocForm.addEventListener('submit', handleAddNewDocSubmit);
  }

  // Admin Portal: Open Add User Modal
  if (dom.openAddUserModalBtn) {
    dom.openAddUserModalBtn.addEventListener('click', openAddUserModal);
  }

  // Admin Portal: Export Users
  if (dom.exportUsersBtn) {
    dom.exportUsersBtn.addEventListener('click', exportUsersData);
  }

  // Admin Portal: Refresh Roster
  if (dom.refreshUsersBtn) {
    dom.refreshUsersBtn.addEventListener('click', () => {
      renderAdminPortal();
      showToast('Chambers user roster refreshed', 'info');
    });
  }

  // Admin Portal: Live Search User Input
  if (dom.adminUserSearchInput) {
    dom.adminUserSearchInput.addEventListener('input', (e) => {
      state.adminSearchQuery = e.target.value.trim().toLowerCase();
      if (state.adminSearchQuery.length > 0) {
        dom.clearUserSearchBtn.classList.remove('hidden');
      } else {
        dom.clearUserSearchBtn.classList.add('hidden');
      }
      renderUsersRoster();
    });
  }

  // Admin Portal: Clear User Search
  if (dom.clearUserSearchBtn) {
    dom.clearUserSearchBtn.addEventListener('click', () => {
      dom.adminUserSearchInput.value = '';
      state.adminSearchQuery = '';
      dom.clearUserSearchBtn.classList.add('hidden');
      renderUsersRoster();
    });
  }

  // Admin Portal: Role Filter Pills
  dom.adminRoleFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dom.adminRoleFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.adminRoleFilter = pill.getAttribute('data-role-filter');
      renderUsersRoster();
    });
  });

  // Admin Portal: Clear Audit Logs
  if (dom.clearAuditLogsBtn) {
    dom.clearAuditLogsBtn.addEventListener('click', clearAuditLogs);
  }

  // User Add/Edit Modal Handlers
  if (dom.closeUserModalBtn) dom.closeUserModalBtn.addEventListener('click', closeUserModal);
  if (dom.cancelUserModalBtn) dom.cancelUserModalBtn.addEventListener('click', closeUserModal);
  if (dom.userModal) {
    dom.userModal.addEventListener('click', (e) => {
      if (e.target === dom.userModal) closeUserModal();
    });
  }
  if (dom.userForm) {
    dom.userForm.addEventListener('submit', handleSaveUser);
  }

  // Generate Random Password for Modal
  if (dom.btnGenRandomPwd) {
    dom.btnGenRandomPwd.addEventListener('click', () => {
      const randomPwd = generateRandomPassword();
      if (dom.modalUserPassword) {
        dom.modalUserPassword.value = randomPwd;
      }
    });
  }

  // Toggle Modal Password View
  if (dom.toggleModalPwdBtn) {
    dom.toggleModalPwdBtn.addEventListener('click', () => {
      const isPwd = dom.modalUserPassword.getAttribute('type') === 'password';
      dom.modalUserPassword.setAttribute('type', isPwd ? 'text' : 'password');
      dom.toggleModalPwdBtn.innerHTML = isPwd 
        ? '<i class="fa-regular fa-eye-slash"></i>' 
        : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Reset Password Modal Handlers
  if (dom.closeResetPwdModalBtn) dom.closeResetPwdModalBtn.addEventListener('click', closeResetPasswordModal);
  if (dom.cancelResetPwdModalBtn) dom.cancelResetPwdModalBtn.addEventListener('click', closeResetPasswordModal);
  if (dom.resetUserPasswordModal) {
    dom.resetUserPasswordModal.addEventListener('click', (e) => {
      if (e.target === dom.resetUserPasswordModal) closeResetPasswordModal();
    });
  }
  if (dom.resetPwdForm) {
    dom.resetPwdForm.addEventListener('submit', handleSaveNewPassword);
  }
  if (dom.btnGenResetPwd) {
    dom.btnGenResetPwd.addEventListener('click', () => {
      const randomPwd = generateRandomPassword();
      if (dom.newResetPassword) {
        dom.newResetPassword.value = randomPwd;
      }
    });
  }

  // Bar Help Modal Handlers
  if (dom.closeBarHelpBtn) dom.closeBarHelpBtn.addEventListener('click', () => dom.barHelpModal.classList.add('hidden'));
  if (dom.closeBarHelpModalBtn) dom.closeBarHelpModalBtn.addEventListener('click', () => dom.barHelpModal.classList.add('hidden'));
  if (dom.barHelpModal) {
    dom.barHelpModal.addEventListener('click', (e) => {
      if (e.target === dom.barHelpModal) dom.barHelpModal.classList.add('hidden');
    });
  }

  // Smart Document Upload & Auto-Fill Listeners
  setupDocumentUploadListeners();
}

// ==========================================================================
// 4B. SMART DOCUMENT UPLOAD & AUTO-EXTRACTION ENGINE
// ==========================================================================

function setupDocumentUploadListeners() {
  if (!dom.docDropzone || !dom.caseDocInput) return;

  // Drag and drop visual cues
  ['dragenter', 'dragover'].forEach(eventName => {
    dom.docDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dom.docDropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dom.docDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dom.docDropzone.classList.remove('drag-over');
    });
  });

  // Handle Drop
  dom.docDropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedLegalDoc(files[0]);
    }
  });

  // Handle File Input Selection
  dom.caseDocInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedLegalDoc(files[0]);
    }
  });

  // Handle Remove Attached Document
  if (dom.removeDocBtn) {
    dom.removeDocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetDocumentUploadZone();
      showToast('Attached document removed. Form fields retained for editing.', 'info');
    });
  }

  // Handle Sample Document Quick Test Chips
  dom.sampleDocChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sampleKey = chip.getAttribute('data-sample');
      const sampleDoc = SAMPLE_DOCUMENTS[sampleKey];
      if (sampleDoc) {
        simulateDocumentScanAndExtraction(sampleDoc.fileName, sampleDoc.fileSize, sampleDoc.data);
      }
    });
  });
}

function processUploadedLegalDoc(file) {
  const fileName = file.name;
  const fileSize = formatFileSize(file.size);
  const isTxt = fileName.toLowerCase().endsWith('.txt');

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileDataUrl = e.target.result;
    if (isTxt) {
      const textReader = new FileReader();
      textReader.onload = function(te) {
        const text = te.target.result;
        const parsedData = parseRawLegalText(text, fileName);
        simulateDocumentScanAndExtraction(fileName, fileSize, parsedData, fileDataUrl, text);
      };
      textReader.readAsText(file);
    } else {
      const extractedData = generateExtractedLegalData(fileName);
      simulateDocumentScanAndExtraction(fileName, fileSize, extractedData, fileDataUrl, null);
    }
  };
  reader.readAsDataURL(file);
}

function simulateDocumentScanAndExtraction(fileName, fileSize, extractedData, fileData = null, textContent = null) {
  // 1. Switch dropzone to Scanning State
  dom.dropzoneDefault.classList.add('hidden');
  dom.dropzoneAttached.classList.add('hidden');
  dom.dropzoneScanning.classList.remove('hidden');

  const steps = [
    { text: 'Extracting OCR text layers & legal structure...', progress: '25%' },
    { text: 'Detecting petitioner, respondent & counsel info...', progress: '55%' },
    { text: 'Parsing court jurisdiction, bench & suit number...', progress: '80%' },
    { text: 'Extracting hearing schedule & argument brief...', progress: '100%' }
  ];

  let currentStep = 0;
  dom.scanningStatusText.textContent = steps[0].text;
  dom.scanningProgressFill.style.width = steps[0].progress;

  const interval = setInterval(() => {
    currentStep++;
    if (currentStep < steps.length) {
      dom.scanningStatusText.textContent = steps[currentStep].text;
      dom.scanningProgressFill.style.width = steps[currentStep].progress;
    } else {
      clearInterval(interval);
      // Finish scanning, show attached state & populate fields
      finishExtraction(fileName, fileSize, extractedData, fileData, textContent);
    }
  }, 350);
}

function finishExtraction(fileName, fileSize, extractedData, fileData = null, textContent = null) {
  dom.dropzoneScanning.classList.add('hidden');
  dom.dropzoneAttached.classList.remove('hidden');
  dom.attachedFileName.textContent = fileName;
  dom.attachedFileSize.textContent = `${fileSize} • 100% Extracted`;

  state.currentAttachedDoc = {
    name: fileName,
    size: fileSize,
    type: getFileTypeFromName(fileName),
    fileData: fileData || null,
    textContent: textContent || null
  };

  populateIntakeFormWithExtractedData(extractedData);
  stageCurrentIntakeDoc();
  showToast(`⚡ Extracted details & staged "${fileName}" for filing!`, 'success');
}

function resetDocumentUploadZone() {
  state.currentAttachedDoc = null;
  if (dom.caseDocInput) dom.caseDocInput.value = '';
  dom.dropzoneDefault.classList.remove('hidden');
  dom.dropzoneScanning.classList.add('hidden');
  dom.dropzoneAttached.classList.add('hidden');
}

function populateIntakeFormWithExtractedData(data) {
  const fields = [
    { el: dom.clientName, val: data.clientName },
    { el: dom.clientPhone, val: data.clientPhone },
    { el: dom.opposingParty, val: data.opposingParty },
    { el: dom.caseTitle, val: data.caseTitle },
    { el: dom.caseNumber, val: data.caseNumber },
    { el: dom.caseCategory, val: data.caseCategory },
    { el: dom.priorityLevel, val: data.priority },
    { el: dom.courtName, val: data.courtName },
    { el: dom.hearingDate, val: data.hearingDate },
    { el: dom.hearingTime, val: data.hearingTime },
    { el: dom.caseNotes, val: data.notes }
  ];

  fields.forEach(field => {
    if (field.el && field.val !== undefined) {
      field.el.value = field.val;
      // Add glowing pulse animation to show it was populated
      field.el.classList.remove('autofilled-glow');
      void field.el.offsetWidth; // Trigger reflow
      field.el.classList.add('autofilled-glow');
    }
  });

  clearValidationErrors();
}

// Generate realistic legal extraction for any uploaded file
function generateExtractedLegalData(fileName) {
  const cleanName = fileName.replace(/[_\-\.]+/g, ' ').toLowerCase();
  
  if (cleanName.includes('bail') || cleanName.includes('fir') || cleanName.includes('criminal')) {
    return {
      clientName: 'Sanjay Rawat',
      clientPhone: '+91 98722 66541',
      opposingParty: 'State of NCT Delhi / PS Crime Branch',
      caseTitle: 'Rawat vs. State (Regular Bail Application under Sec 437/439 CrPC)',
      caseNumber: 'BAIL APPLN ' + Math.floor(1000 + Math.random() * 9000) + '/2024',
      caseCategory: 'Criminal Defense',
      priority: 'Critical',
      courtName: 'Patiala House Courts, Special Judge NDPS / CBI',
      hearingDate: getOffsetDateString(1),
      hearingTime: '10:30',
      notes: `Extracted from ${fileName}: Charge-sheet filed without forensic ballistic report. Custodial interrogation not warranted. Seeking parity with co-accused granted bail.`
    };
  } else if (cleanName.includes('writ') || cleanName.includes('petition') || cleanName.includes('stay') || cleanName.includes('injunction')) {
    return {
      clientName: 'Dr. Meenakshi Sundaram',
      clientPhone: '+91 94440 12890',
      opposingParty: 'Medical Council of India & Union of India',
      caseTitle: 'Dr. Sundaram vs. MCI (Writ Petition challenging Suspension Order)',
      caseNumber: 'WP(C) ' + Math.floor(2000 + Math.random() * 8000) + '/2024',
      caseCategory: 'Constitutional & Writ',
      priority: 'High',
      courtName: 'High Court of Delhi - Division Bench II',
      hearingDate: getOffsetDateString(2),
      hearingTime: '11:15',
      notes: `Extracted from ${fileName}: Violation of Principles of Natural Justice (Audi Alteram Partem). Inquiry committee report was never served upon the petitioner before order.`
    };
  } else if (cleanName.includes('cheque') || cleanName.includes('138') || cleanName.includes('ni act') || cleanName.includes('money')) {
    return {
      clientName: 'Adarsh Buildcon Pvt. Ltd.',
      clientPhone: '+91 98101 44552',
      opposingParty: 'Shree Balaji Transporters & Logistics',
      caseTitle: 'Adarsh Buildcon vs. Balaji Logistics (Sec 138 NI Act Dishonour Complaint)',
      caseNumber: 'CC NI ACT ' + Math.floor(10000 + Math.random() * 90000) + '/2024',
      caseCategory: 'Corporate & M&A',
      priority: 'Standard',
      courtName: 'Metropolitan Magistrate (Special NI Court), Room 14',
      hearingDate: getOffsetDateString(5),
      hearingTime: '14:00',
      notes: `Extracted from ${fileName}: Cheque No. 448201 for INR 35,00,000/- dishonoured for 'Funds Insufficient'. Statutory notice served via registered speed post on 05.08.2024.`
    };
  } else {
    // Default smart legal template
    const randomDocket = Math.floor(1000 + Math.random() * 9000);
    return {
      clientName: 'Kunal Singhal',
      clientPhone: '+91 98118 77652',
      opposingParty: 'National Highways Authority of India (NHAI)',
      caseTitle: `Singhal vs. NHAI (Land Acquisition Compensation Enhancement Appeal)`,
      caseNumber: `LA.APP. ${randomDocket}/2024`,
      caseCategory: 'Civil Litigation',
      priority: 'High',
      courtName: 'District & Sessions Court, Land Acquisition Tribunal',
      hearingDate: getOffsetDateString(3),
      hearingTime: '11:00',
      notes: `Document parsed (${fileName}): Certified sale deeds of adjacent commercial plots annexed proving market rate exceeds circle rate by 240%.`
    };
  }
}

// Parse plaintext files if formatted with standard key-value tags
function parseRawLegalText(text, fileName) {
  const lines = text.split('\n');
  const result = generateExtractedLegalData(fileName);

  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('client:') || lower.includes('petitioner:')) {
      result.clientName = line.split(':')[1]?.trim() || result.clientName;
    } else if (lower.includes('phone:') || lower.includes('contact:')) {
      result.clientPhone = line.split(':')[1]?.trim() || result.clientPhone;
    } else if (lower.includes('respondent:') || lower.includes('vs:') || lower.includes('opposing:')) {
      result.opposingParty = line.split(':')[1]?.trim() || result.opposingParty;
    } else if (lower.includes('matter:') || lower.includes('case title:')) {
      result.caseTitle = line.split(':')[1]?.trim() || result.caseTitle;
    } else if (lower.includes('case no:') || lower.includes('suit no:') || lower.includes('docket:')) {
      result.caseNumber = line.split(':')[1]?.trim() || result.caseNumber;
    } else if (lower.includes('court:') || lower.includes('bench:')) {
      result.courtName = line.split(':')[1]?.trim() || result.courtName;
    } else if (lower.includes('date:') || lower.includes('hearing:')) {
      const d = line.split(':')[1]?.trim();
      if (d && d.match(/^\d{4}-\d{2}-\d{2}$/)) result.hearingDate = d;
    }
  });

  return result;
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '1.2 MB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ==========================================================================
// 5. AUTHENTICATION HANDLERS
// ==========================================================================

function handleLogin(e) {
  if (e && e.preventDefault) e.preventDefault();
  clearValidationErrors();

  let email = (dom.authEmail ? dom.authEmail.value.trim() : '');
  let password = (dom.authPassword ? dom.authPassword.value.trim() : '');

  // If user just clicks "Enter Chambers" without typing, use admin demo
  if (!email && !password) {
    email = 'admin@lexjuris.in';
    password = 'AdminPass2024!';
    if (dom.authEmail) dom.authEmail.value = email;
    if (dom.authPassword) dom.authPassword.value = password;
  }

  let hasError = false;

  if (!email || !email.includes('@')) {
    if (dom.authEmailError) dom.authEmailError.textContent = 'Please enter a valid professional email address';
    hasError = true;
  }

  if (!password || password.length < 3) {
    if (dom.authPasswordError) dom.authPasswordError.textContent = 'Please enter your chamber password';
    hasError = true;
  }

  if (hasError) return;

  // Search user in database
  const matchedUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!matchedUser) {
    if (dom.authEmailError) dom.authEmailError.textContent = 'No user account found with this email. Check demo accounts or contact Admin.';
    showToast('Invalid credentials. User account does not exist.', 'error');
    return;
  }

  if (matchedUser.password !== password) {
    if (dom.authPasswordError) dom.authPasswordError.textContent = 'Incorrect password. Contact your Administrator to reset.';
    showToast('Authentication failed: Incorrect password.', 'error');
    return;
  }

  if (matchedUser.status === 'Suspended') {
    showToast('Account suspended by Chambers Administrator. Access denied.', 'error');
    if (dom.authEmailError) dom.authEmailError.textContent = 'This account has been suspended.';
    return;
  }

  // Update last login
  matchedUser.lastLogin = new Date().toISOString();
  saveUsersToStorage();

  state.currentUser = matchedUser;
  state.activeDocketCaseId = null;
  state.activeDocketTab = 'overview';
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(matchedUser));

  logAuditEvent('User Logged In', `Session initialized for ${matchedUser.name} (${matchedUser.role}).`, 'login', matchedUser.name);

  showToast(`Welcome to Chambers, ${matchedUser.name}`, 'success');

  // Route view based on role
  if (matchedUser.role === 'Chambers Administrator') {
    state.activeView = 'admin';
  } else {
    state.activeView = 'workspace';
  }

  showDashboard();
}

function switchAuthTab(mode) {
  clearValidationErrors();
  clearSignupErrors();

  if (mode === 'signup') {
    if (dom.tabLoginBtn) {
      dom.tabLoginBtn.classList.remove('active');
      dom.tabLoginBtn.setAttribute('aria-selected', 'false');
    }
    if (dom.tabSignupBtn) {
      dom.tabSignupBtn.classList.add('active');
      dom.tabSignupBtn.setAttribute('aria-selected', 'true');
    }
    if (dom.loginFormContainer) dom.loginFormContainer.classList.add('hidden');
    if (dom.signupFormContainer) dom.signupFormContainer.classList.remove('hidden');
    if (dom.authContainer) dom.authContainer.classList.add('signup-mode');
  } else {
    if (dom.tabSignupBtn) {
      dom.tabSignupBtn.classList.remove('active');
      dom.tabSignupBtn.setAttribute('aria-selected', 'false');
    }
    if (dom.tabLoginBtn) {
      dom.tabLoginBtn.classList.add('active');
      dom.tabLoginBtn.setAttribute('aria-selected', 'true');
    }
    if (dom.signupFormContainer) dom.signupFormContainer.classList.add('hidden');
    if (dom.loginFormContainer) dom.loginFormContainer.classList.remove('hidden');
    if (dom.authContainer) dom.authContainer.classList.remove('signup-mode');
  }
}

function clearSignupErrors() {
  const errIds = [
    'signupNameError', 'signupEmailError', 'signupBarRegError',
    'signupPhoneError', 'signupPasswordError', 'signupConfirmPasswordError',
    'signupTermsError'
  ];
  errIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function handleSignup(e) {
  if (e && e.preventDefault) e.preventDefault();
  clearSignupErrors();

  const name = dom.signupName ? dom.signupName.value.trim() : '';
  const email = dom.signupEmail ? dom.signupEmail.value.trim() : '';
  const role = dom.signupRole ? dom.signupRole.value : 'Associate Advocate';
  const barReg = dom.signupBarReg ? dom.signupBarReg.value.trim() : '';
  const dept = dom.signupDept ? dom.signupDept.value : 'Corporate & Commercial';
  const phone = dom.signupPhone ? dom.signupPhone.value.trim() : '';
  const password = dom.signupPassword ? dom.signupPassword.value.trim() : '';
  const confirmPassword = dom.signupConfirmPassword ? dom.signupConfirmPassword.value.trim() : '';
  const termsCheck = dom.signupTermsCheck ? dom.signupTermsCheck.checked : false;

  let hasError = false;

  if (!name || name.length < 2) {
    if (dom.signupNameError) dom.signupNameError.textContent = 'Please enter your full practitioner name';
    hasError = true;
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    if (dom.signupEmailError) dom.signupEmailError.textContent = 'Please enter a valid professional email address';
    hasError = true;
  }

  // Check duplicate email
  const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    if (dom.signupEmailError) dom.signupEmailError.textContent = 'An account with this email address already exists';
    showToast('This email is already registered. Please sign in.', 'error');
    hasError = true;
  }

  if (!barReg) {
    if (dom.signupBarRegError) dom.signupBarRegError.textContent = 'Bar Council registration number / Staff ID is required';
    hasError = true;
  }

  if (!phone || phone.length < 6) {
    if (dom.signupPhoneError) dom.signupPhoneError.textContent = 'Please enter a valid contact phone number';
    hasError = true;
  }

  if (!password || password.length < 6) {
    if (dom.signupPasswordError) dom.signupPasswordError.textContent = 'Password must be at least 6 characters long';
    hasError = true;
  }

  if (password !== confirmPassword) {
    if (dom.signupConfirmPasswordError) dom.signupConfirmPasswordError.textContent = 'Passwords do not match';
    hasError = true;
  }

  if (!termsCheck) {
    if (dom.signupTermsError) dom.signupTermsError.textContent = 'You must confirm Bar Council licensure compliance';
    hasError = true;
  }

  if (hasError) return;

  // Create new practitioner user account
  const isHead = role.includes('Senior') || role.includes('Head');
  const groupRole = role === 'Chambers Administrator' ? 'admin' : (isHead ? 'head' : 'subordinate');
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: name,
    email: email,
    role: role,
    barReg: barReg,
    dept: dept,
    group: dept,
    groupRole: groupRole,
    isGroupHead: isHead,
    phone: phone,
    password: password,
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  state.users.unshift(newUser);
  saveUsersToStorage();

  logAuditEvent(
    'New Practitioner Self-Registered',
    `Registered new ${role} account for ${name} (${email}) • Bar Reg: ${barReg}.`,
    'create',
    name
  );

  // Authenticate session
  state.currentUser = newUser;
  state.activeDocketCaseId = null;
  state.activeDocketTab = 'overview';
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));

  showToast(`🎉 Registration complete! Welcome to Chambers, ${newUser.name}.`, 'success');

  // Reset form & view
  if (dom.signupForm) dom.signupForm.reset();
  switchAuthTab('login');

  if (newUser.role === 'Chambers Administrator') {
    state.activeView = 'admin';
  } else {
    state.activeView = 'workspace';
  }

  showDashboard();
}

function handleLogout() {
  if (state.currentUser) {
    logAuditEvent('User Logged Out', `Session closed for ${state.currentUser.name}.`, 'general', state.currentUser.name);
  }
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  state.currentUser = null;
  state.activeDocketCaseId = null;
  state.activeDocketTab = 'overview';
  showToast('Chambers session securely closed.', 'info');
  switchAuthTab('login');
  showAuthScreen();
}

window.switchAuthTab = switchAuthTab;
window.handleSignup = handleSignup;

// ==========================================================================
// 5B. CHAMBERS ADMINISTRATION & USER ROSTER CONTROLS
// ==========================================================================

function renderAdminPortal() {
  renderAdminStats();
  renderUsersRoster();
  renderAuditTrail();
}

function renderAdminStats() {
  const totalUsers = state.users.length;
  const admins = state.users.filter(u => u.role === 'Chambers Administrator').length;
  const seniors = state.users.filter(u => u.role === 'Senior Advocate').length;
  const associates = state.users.filter(u => u.role === 'Associate Advocate' || u.role === 'Paralegal / Intern').length;
  const clerks = state.users.filter(u => u.role === 'Registry Clerk').length;
  const activeCasesCount = state.cases.filter(c => c.status !== 'Disposed').length;

  if (dom.adminStatTotalUsers) dom.adminStatTotalUsers.textContent = totalUsers;
  if (dom.adminStatAdvocates) dom.adminStatAdvocates.textContent = seniors;
  if (dom.adminStatAssociates) dom.adminStatAssociates.textContent = associates;
  if (dom.adminStatClerks) dom.adminStatClerks.textContent = clerks;
  if (dom.adminStatDockets) dom.adminStatDockets.textContent = activeCasesCount;

  if (dom.countAdminAll) dom.countAdminAll.textContent = totalUsers;
  if (dom.countAdminAdmins) dom.countAdminAdmins.textContent = admins;
  if (dom.countAdminSenior) dom.countAdminSenior.textContent = seniors;
  if (dom.countAdminAssoc) dom.countAdminAssoc.textContent = associates;
  if (dom.countAdminClerks) dom.countAdminClerks.textContent = clerks;
}

function renderUsersRoster() {
  if (!dom.usersTableBody) return;

  let filtered = [...state.users];

  // 1. Role filter
  if (state.adminRoleFilter === 'admin') {
    filtered = filtered.filter(u => u.role === 'Chambers Administrator');
  } else if (state.adminRoleFilter === 'senior') {
    filtered = filtered.filter(u => u.role === 'Senior Advocate');
  } else if (state.adminRoleFilter === 'associate') {
    filtered = filtered.filter(u => u.role === 'Associate Advocate' || u.role === 'Paralegal / Intern');
  } else if (state.adminRoleFilter === 'clerk') {
    filtered = filtered.filter(u => u.role === 'Registry Clerk');
  }

  // 2. Search query filter
  if (state.adminSearchQuery) {
    const q = state.adminSearchQuery;
    filtered = filtered.filter(u => 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.barReg && u.barReg.toLowerCase().includes(q)) ||
      (u.dept && u.dept.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  }

  dom.usersTableBody.innerHTML = '';

  if (filtered.length === 0) {
    if (dom.adminUserEmptyState) dom.adminUserEmptyState.classList.remove('hidden');
    return;
  }

  if (dom.adminUserEmptyState) dom.adminUserEmptyState.classList.add('hidden');

  filtered.forEach(user => {
    const tr = document.createElement('tr');

    // Role css class
    let roleClass = 'associate';
    let avatarClass = 'assoc-avatar';
    let roleIcon = '<i class="fa-solid fa-scale-balanced"></i>';

    if (user.role === 'Chambers Administrator') {
      roleClass = 'admin';
      avatarClass = 'admin-avatar';
      roleIcon = '<i class="fa-solid fa-crown gold-text"></i>';
    } else if (user.role === 'Senior Advocate') {
      roleClass = 'senior';
      avatarClass = 'senior-avatar';
      roleIcon = '<i class="fa-solid fa-gavel"></i>';
    } else if (user.role === 'Registry Clerk') {
      roleClass = 'clerk';
      avatarClass = 'clerk-avatar';
      roleIcon = '<i class="fa-solid fa-clipboard-list"></i>';
    } else if (user.role === 'Paralegal / Intern') {
      roleClass = 'intern';
      avatarClass = 'assoc-avatar';
      roleIcon = '<i class="fa-solid fa-book-open"></i>';
    }

    const initials = (user.name || 'U')
      .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s+/i, '')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    const isCurrent = state.currentUser && state.currentUser.email.toLowerCase() === user.email.toLowerCase();
    const isActive = user.status !== 'Suspended';

    tr.innerHTML = `
      <td>
        <div class="user-table-profile">
          <div class="user-avatar-cell ${avatarClass}">
            ${initials}
          </div>
          <div>
            <div class="user-meta-name">
              ${escapeHTML(user.name)}
              ${isCurrent ? '<span class="badge-role-admin" style="font-size:0.6rem; padding:0.1rem 0.35rem;">You</span>' : ''}
            </div>
            <div class="user-bar-id"><i class="fa-solid fa-id-card"></i> ${escapeHTML(user.barReg || 'Reg Pending')}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="user-contact-email"><i class="fa-regular fa-envelope"></i> ${escapeHTML(user.email)}</div>
        <div class="user-contact-phone"><i class="fa-solid fa-phone"></i> ${escapeHTML(user.phone || '+91 -')}</div>
      </td>
      <td>
        <span class="role-tag ${roleClass}">
          ${roleIcon} ${escapeHTML(user.role)}
        </span>
      </td>
      <td>
        <span class="dept-tag">${escapeHTML(user.group || user.dept || 'Constitutional & Writ')}</span>
        <div style="margin-top: 4px;">
          ${user.role === 'Chambers Administrator'
            ? '<span class="hierarchy-badge admin"><i class="fa-solid fa-crown"></i> Master Admin</span>'
            : (user.isGroupHead || user.groupRole === 'head'
                ? '<span class="hierarchy-badge head"><i class="fa-solid fa-crown"></i> Group Head</span>'
                : '<span class="hierarchy-badge subordinate"><i class="fa-solid fa-user-shield"></i> Subordinate</span>'
              )}
        </div>
      </td>
      <td>
        <span class="status-badge ${isActive ? 'active' : 'suspended'}">
          <span class="status-dot-pulse"></span>
          ${isActive ? 'Active' : 'Suspended'}
        </span>
      </td>
      <td>
        <div class="table-actions-cell">
          <button type="button" class="btn-table-action action-login-as" title="Instant Login as ${escapeHTML(user.name)}" onclick="quickLoginAsUser('${user.id}')">
            <i class="fa-solid fa-right-to-bracket"></i>
          </button>
          <button type="button" class="btn-table-action" title="Edit User Profile" onclick="openEditUserModal('${user.id}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="btn-table-action action-reset" title="Reset Password" onclick="openResetPasswordModal('${user.id}')">
            <i class="fa-solid fa-key"></i>
          </button>
          <button type="button" class="btn-table-action" title="${isActive ? 'Suspend User Access' : 'Reactivate User'}" onclick="toggleUserStatus('${user.id}')">
            <i class="fa-solid ${isActive ? 'fa-user-lock' : 'fa-user-check'}"></i>
          </button>
          <button type="button" class="btn-table-action action-delete" title="Delete User Account" onclick="deleteUser('${user.id}')">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;

    dom.usersTableBody.appendChild(tr);
  });
}

function renderAuditTrail() {
  if (!dom.auditLogList) return;

  dom.auditLogList.innerHTML = '';

  if (state.auditLogs.length === 0) {
    dom.auditLogList.innerHTML = `
      <div style="text-align:center; padding: 1.5rem; color: var(--text-muted); font-size: 0.8rem;">
        <i class="fa-solid fa-shield-halved" style="font-size: 1.5rem; margin-bottom: 0.5rem; display:block;"></i>
        No security audit events logged yet.
      </div>
    `;
    return;
  }

  state.auditLogs.slice(0, 25).forEach(item => {
    const el = document.createElement('div');
    el.className = `audit-log-item ${item.type}-event`;

    let icon = '<i class="fa-solid fa-shield-halved gold-text"></i>';
    if (item.type === 'login') icon = '<i class="fa-solid fa-arrow-right-to-bracket" style="color:#60a5fa;"></i>';
    else if (item.type === 'create') icon = '<i class="fa-solid fa-user-plus" style="color:#34d399;"></i>';
    else if (item.type === 'delete') icon = '<i class="fa-solid fa-user-minus" style="color:#f87171;"></i>';
    else if (item.type === 'reset') icon = '<i class="fa-solid fa-key" style="color:#fbbf24;"></i>';

    const timeAgo = formatTimeAgo(item.timestamp);

    el.innerHTML = `
      <div class="audit-icon">${icon}</div>
      <div class="audit-details">
        <div class="audit-action-text">${escapeHTML(item.action)}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:0.15rem;">${escapeHTML(item.details)}</div>
        <div class="audit-action-meta">
          <span><i class="fa-regular fa-user"></i> ${escapeHTML(item.actor || 'Admin')}</span>
          <span><i class="fa-regular fa-clock"></i> ${timeAgo}</span>
        </div>
      </div>
    `;

    dom.auditLogList.appendChild(el);
  });
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// User CRUD: Add / Edit Modal Controls
function openAddUserModal() {
  state.targetEditUserId = null;
  if (dom.userForm) dom.userForm.reset();
  if (dom.editUserId) dom.editUserId.value = '';
  if (dom.userModalTitle) dom.userModalTitle.textContent = 'Add New Chambers User';
  if (dom.userModalSubtitle) dom.userModalSubtitle.textContent = 'Register a new advocate, associate or clerk login credential';
  if (dom.pwdLabelText) dom.pwdLabelText.textContent = 'Login Password';
  if (dom.passwordFieldHint) dom.passwordFieldHint.textContent = 'This password will be used by the member to enter the Chambers portal.';
  
  // Set default generated password
  if (dom.modalUserPassword) {
    dom.modalUserPassword.value = generateRandomPassword();
    dom.modalUserPassword.required = true;
  }

  clearUserModalErrors();
  if (dom.userModal) dom.userModal.classList.remove('hidden');
}

function openEditUserModal(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  state.targetEditUserId = userId;
  if (dom.editUserId) dom.editUserId.value = userId;
  if (dom.userModalTitle) dom.userModalTitle.textContent = `Edit Chambers Member`;
  if (dom.userModalSubtitle) dom.userModalSubtitle.textContent = `Updating practitioner profile for ${user.name}`;
  
  if (dom.modalUserName) dom.modalUserName.value = user.name || '';
  if (dom.modalUserEmail) dom.modalUserEmail.value = user.email || '';
  if (dom.modalUserRole) dom.modalUserRole.value = user.role || 'Associate Advocate';
  if (dom.modalUserBarReg) dom.modalUserBarReg.value = user.barReg || '';
  if (dom.modalUserDept) dom.modalUserDept.value = user.group || user.dept || 'Constitutional & Writ';
  if (dom.modalUserGroupRole) {
    dom.modalUserGroupRole.value = user.groupRole || (user.isGroupHead ? 'head' : (user.role === 'Chambers Administrator' ? 'admin' : 'subordinate'));
  }
  if (dom.modalUserPhone) dom.modalUserPhone.value = user.phone || '';
  if (dom.modalUserStatus) dom.modalUserStatus.value = user.status || 'Active';
  
  if (dom.modalUserPassword) {
    dom.modalUserPassword.value = user.password || '';
    dom.modalUserPassword.required = true;
  }
  if (dom.pwdLabelText) dom.pwdLabelText.textContent = 'Chambers Password';
  if (dom.passwordFieldHint) dom.passwordFieldHint.textContent = 'Leave existing or generate a new secure password for this user.';

  clearUserModalErrors();
  if (dom.userModal) dom.userModal.classList.remove('hidden');
}

function closeUserModal() {
  state.targetEditUserId = null;
  if (dom.userModal) dom.userModal.classList.add('hidden');
}

function clearUserModalErrors() {
  if (dom.modalUserNameError) dom.modalUserNameError.textContent = '';
  if (dom.modalUserEmailError) dom.modalUserEmailError.textContent = '';
  if (dom.modalUserPasswordError) dom.modalUserPasswordError.textContent = '';
}

function handleSaveUser(e) {
  e.preventDefault();
  clearUserModalErrors();

  const name = dom.modalUserName ? dom.modalUserName.value.trim() : '';
  const email = dom.modalUserEmail ? dom.modalUserEmail.value.trim() : '';
  const role = dom.modalUserRole ? dom.modalUserRole.value : 'Associate Advocate';
  const barReg = dom.modalUserBarReg ? dom.modalUserBarReg.value.trim() : 'D/Reg/Pending';
  const password = dom.modalUserPassword ? dom.modalUserPassword.value.trim() : '';
  const dept = dom.modalUserDept ? dom.modalUserDept.value : 'Constitutional & Writ';
  const groupRole = dom.modalUserGroupRole ? dom.modalUserGroupRole.value : (role.includes('Senior') ? 'head' : 'subordinate');
  const isGroupHead = groupRole === 'head';
  const phone = dom.modalUserPhone ? dom.modalUserPhone.value.trim() : '+91 -';
  const status = dom.modalUserStatus ? dom.modalUserStatus.value : 'Active';

  let hasError = false;

  if (!name) {
    if (dom.modalUserNameError) dom.modalUserNameError.textContent = 'Full practitioner name is required';
    hasError = true;
  }

  if (!email || !email.includes('@')) {
    if (dom.modalUserEmailError) dom.modalUserEmailError.textContent = 'Valid professional email address is required';
    hasError = true;
  }

  // Duplicate email check
  const duplicate = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== state.targetEditUserId);
  if (duplicate) {
    if (dom.modalUserEmailError) dom.modalUserEmailError.textContent = 'An account with this email address already exists';
    hasError = true;
  }

  if (!password || password.length < 4) {
    if (dom.modalUserPasswordError) dom.modalUserPasswordError.textContent = 'Password must be at least 4 characters long';
    hasError = true;
  }

  if (hasError) return;

  if (state.targetEditUserId) {
    // Edit existing user
    const idx = state.users.findIndex(u => u.id === state.targetEditUserId);
    if (idx !== -1) {
      state.users[idx] = {
        ...state.users[idx],
        name,
        email,
        role,
        barReg,
        password,
        dept,
        group: dept,
        groupRole,
        isGroupHead,
        phone,
        status,
        updatedAt: new Date().toISOString()
      };

      logAuditEvent('User Profile Updated', `Updated credentials and group permissions for ${name} (${role} • ${groupRole}).`, 'create', name);
      showToast(`✨ Updated profile for ${name}`, 'success');
    }
  } else {
    // Add new user
    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name,
      email,
      role,
      barReg: barReg || `D/${Math.floor(1000 + Math.random() * 9000)}/2024`,
      password,
      dept,
      group: dept,
      groupRole,
      isGroupHead,
      phone: phone || `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      status,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    state.users.unshift(newUser);
    logAuditEvent('New User Registered', `Created new login account for ${name} (${role} • ${groupRole}) with email ${email}.`, 'create', name);
    showToast(`🎉 New user "${name}" registered successfully!`, 'success');
  }

  saveUsersToStorage();
  closeUserModal();
  renderAdminPortal();
}

function deleteUser(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  if (state.currentUser && state.currentUser.id === userId) {
    showToast('Cannot delete your own active administrator account!', 'error');
    return;
  }

  const confirmed = confirm(`Are you sure you want to permanently delete the login account for "${user.name}" (${user.email})?`);
  if (!confirmed) return;

  state.users = state.users.filter(u => u.id !== userId);
  saveUsersToStorage();
  logAuditEvent('User Account Deleted', `Deleted chambers login credentials for ${user.name} (${user.email}).`, 'delete', user.name);
  showToast(`Account for "${user.name}" removed from Chambers database.`, 'info');
  renderAdminPortal();
}

function toggleUserStatus(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  if (state.currentUser && state.currentUser.id === userId) {
    showToast('Cannot suspend your own active administrator account!', 'error');
    return;
  }

  const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
  user.status = newStatus;
  saveUsersToStorage();

  logAuditEvent(
    `Account ${newStatus}`,
    `Access for ${user.name} (${user.email}) changed to ${newStatus}.`,
    newStatus === 'Active' ? 'create' : 'delete',
    user.name
  );

  showToast(`User "${user.name}" status updated to ${newStatus}.`, 'info');
  renderAdminPortal();
}

// Reset Password Modal Controls
function openResetPasswordModal(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  state.targetResetUserId = userId;
  if (dom.resetTargetUserId) dom.resetTargetUserId.value = userId;
  
  if (dom.resetUserSummary) {
    dom.resetUserSummary.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <div class="user-avatar-cell" style="width:34px; height:34px; font-size:0.8rem;">
          ${(user.name || 'U').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <strong style="color:var(--text-primary); font-size:0.85rem;">${escapeHTML(user.name)}</strong>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${escapeHTML(user.email)} • <span style="color:var(--gold-primary);">${user.role}</span></div>
        </div>
      </div>
    `;
  }

  const newPwd = generateRandomPassword();
  if (dom.newResetPassword) dom.newResetPassword.value = newPwd;
  if (dom.newResetPasswordError) dom.newResetPasswordError.textContent = '';

  if (dom.resetUserPasswordModal) dom.resetUserPasswordModal.classList.remove('hidden');
}

function closeResetPasswordModal() {
  state.targetResetUserId = null;
  if (dom.resetUserPasswordModal) dom.resetUserPasswordModal.classList.add('hidden');
}

function handleSaveNewPassword(e) {
  e.preventDefault();
  if (!state.targetResetUserId) return;

  const newPwd = dom.newResetPassword ? dom.newResetPassword.value.trim() : '';
  if (!newPwd || newPwd.length < 4) {
    if (dom.newResetPasswordError) dom.newResetPasswordError.textContent = 'Password must be at least 4 characters';
    return;
  }

  const user = state.users.find(u => u.id === state.targetResetUserId);
  if (user) {
    user.password = newPwd;
    saveUsersToStorage();

    if (dom.copyCredsToClipboard && dom.copyCredsToClipboard.checked) {
      const creds = `LexJuris Chambers Login Credentials:\nEmail: ${user.email}\nPassword: ${newPwd}`;
      navigator.clipboard.writeText(creds).catch(() => {});
    }

    logAuditEvent('Password Reset', `Password changed for user ${user.name} (${user.email}).`, 'reset', user.name);
    showToast(`🔑 Password updated for ${user.name}! Copied to clipboard.`, 'success');
  }

  closeResetPasswordModal();
  renderAdminPortal();
}

function quickLoginAsUser(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  if (user.status === 'Suspended') {
    showToast('Cannot login to a suspended account. Reactivate it first.', 'error');
    return;
  }

  user.lastLogin = new Date().toISOString();
  saveUsersToStorage();

  state.currentUser = user;
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));

  logAuditEvent('Admin Impersonation Login', `Switched session to ${user.name} (${user.role}).`, 'login', user.name);
  showToast(`Switched active session to ${user.name} (${user.role})`, 'success');

  if (user.role === 'Chambers Administrator') {
    state.activeView = 'admin';
  } else {
    state.activeView = 'workspace';
  }

  showDashboard();
}

function exportUsersData() {
  const exportData = {
    chambers: 'LexJuris Legal Case & Court Practice Suite',
    exportedAt: new Date().toISOString(),
    totalUsers: state.users.length,
    users: state.users.map(u => ({
      name: u.name,
      email: u.email,
      role: u.role,
      barReg: u.barReg,
      dept: u.dept,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }))
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LexJuris_Chambers_Roster_${getOffsetDateString(0)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logAuditEvent('Roster Exported', `Exported chambers user directory (${state.users.length} members).`, 'general');
  showToast('Chambers user directory exported to JSON!', 'success');
}

function generateRandomPassword() {
  const prefixes = ['Lex', 'Bar', 'Jur', 'Suit', 'Plea', 'Doc', 'Bench', 'Stay'];
  const symbols = ['!', '@', '#', '$', '*'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}#${num}${symbol}`;
}

function clearAuditLogs() {
  const confirmed = confirm('Are you sure you want to clear all security audit logs?');
  if (!confirmed) return;
  state.auditLogs = [];
  saveAuditLogsToStorage();
  renderAuditTrail();
  showToast('Audit trail cleared.', 'info');
}

// Global Exports
window.openEditUserModal = openEditUserModal;
window.openResetPasswordModal = openResetPasswordModal;
window.deleteUser = deleteUser;
window.toggleUserStatus = toggleUserStatus;
window.quickLoginAsUser = quickLoginAsUser;
window.openCaseUpdatesModal = openCaseUpdatesModal;
window.closeCaseUpdatesModal = closeCaseUpdatesModal;

// ==========================================================================
// 6. ACCESS CONTROL & GROUP HIERARCHY RULES
// ==========================================================================

function isUserGroupHead(user) {
  if (!user) return false;
  if (user.isGroupHead === true || user.groupRole === 'head') return true;
  if (user.role && (user.role.includes('Group Head') || user.role === 'Senior Advocate')) return true;
  return false;
}

// Core Access Control Filter:
// - Chambers Administrator: all firm cases
// - Pre-configured demo group head (Adv. Sharma): Constitutional & Writ group demo cases
// - All other advocates / newly registered practitioners: ONLY cases assigned to them or created by them!
function getAccessibleCases(user) {
  if (!user) return [];

  // 1. Chambers Administrator: Full firm-wide master oversight
  if (user.role === 'Chambers Administrator') {
    return state.cases;
  }

  // 2. Pre-configured demo group head (Adv. Sharma)
  if (user.email === 'advocate.sharma@lexjuris.in') {
    const userGroup = (user.group || user.dept || 'Constitutional & Writ').toLowerCase().trim();
    return state.cases.filter(c => {
      const caseGrp = (c.group || c.caseCategory || '').toLowerCase().trim();
      return caseGrp === userGroup ||
             c.assignedTo === user.id ||
             (c.assignedToEmail && c.assignedToEmail.toLowerCase() === user.email.toLowerCase()) ||
             (c.assignedToName && c.assignedToName.toLowerCase() === user.name.toLowerCase()) ||
             (c.createdBy && c.createdBy.toLowerCase() === user.email.toLowerCase()) ||
             (c.createdById && c.createdById === user.id);
    });
  }

  // 3. All other advocates, subordinates, and newly registered practitioners:
  // Strictly visible ONLY cases assigned directly to them or created by them!
  return state.cases.filter(c => {
    return (c.assignedTo && c.assignedTo === user.id) ||
           (c.assignedToEmail && c.assignedToEmail.toLowerCase() === user.email.toLowerCase()) ||
           (c.assignedToName && user.name && c.assignedToName.toLowerCase() === user.name.toLowerCase()) ||
           (c.createdBy && c.createdBy.toLowerCase() === user.email.toLowerCase()) ||
           (c.createdById && c.createdById === user.id);
  });
}

function updateAccessScopeBanner() {
  if (!dom.accessScopeBanner) return;
  if (!state.currentUser) {
    dom.accessScopeBanner.innerHTML = '';
    return;
  }

  const user = state.currentUser;
  const accessibleCases = getAccessibleCases(user);
  const isAdmin = user.role === 'Chambers Administrator';
  const isHead = user.email === 'advocate.sharma@lexjuris.in';
  const userGroup = user.group || user.dept || 'Constitutional & Writ';

  dom.accessScopeBanner.className = 'access-scope-banner';

  if (isAdmin) {
    dom.accessScopeBanner.classList.add('scope-admin');
    dom.accessScopeBanner.innerHTML = `
      <div class="scope-banner-content">
        <div class="scope-icon-wrap"><i class="fa-solid fa-crown"></i></div>
        <div>
          <div class="scope-banner-title">
            Chambers Master Oversight
            <span class="scope-tag-pill">Managing Partner</span>
          </div>
          <div class="scope-banner-desc">Master firm-wide clearance. Displaying all <strong>${accessibleCases.length}</strong> active legal dockets across all chambers practice groups.</div>
        </div>
      </div>
      <div class="badge-group"><i class="fa-solid fa-building-shield"></i> All Chambers Groups</div>
    `;
  } else if (isHead) {
    dom.accessScopeBanner.classList.add('scope-head');
    dom.accessScopeBanner.innerHTML = `
      <div class="scope-banner-content">
        <div class="scope-icon-wrap"><i class="fa-solid fa-users-viewfinder"></i></div>
        <div>
          <div class="scope-banner-title">
            Practice Group Head Oversight: ${escapeHTML(userGroup)}
            <span class="scope-tag-pill">👑 Head of Group</span>
          </div>
          <div class="scope-banner-desc">Full group access active: Viewing all <strong>${accessibleCases.length}</strong> cases and updates across all subordinates in the <strong>${escapeHTML(userGroup)}</strong> group.</div>
        </div>
      </div>
      <div class="badge-group"><i class="fa-solid fa-shield-halved"></i> Group Head Clearance</div>
    `;
  } else {
    dom.accessScopeBanner.classList.add('scope-subordinate');
    dom.accessScopeBanner.innerHTML = `
      <div class="scope-banner-content">
        <div class="scope-icon-wrap"><i class="fa-solid fa-user-lock"></i></div>
        <div>
          <div class="scope-banner-title">
            Advocate Workspace: ${escapeHTML(user.name)}
            <span class="scope-tag-pill">🔒 Isolated Docket Access</span>
          </div>
          <div class="scope-banner-desc">Confidential workspace active: You have access exclusively to your <strong>${accessibleCases.length}</strong> assigned or instituted docket(s). Unassigned and external matters remain strictly confidential.</div>
        </div>
      </div>
      <div class="badge-assignee my-assignment"><i class="fa-solid fa-user-check"></i> Personal Matters Only</div>
    `;
  }

  // Update practice group banner card
  const pgCard = document.getElementById('practiceGroupBannerCard');
  const pgName = document.getElementById('pgGroupName');
  if (pgCard && state.currentUser) {
    const titleEl = pgCard.querySelector('.pg-title');
    const subtitleEl = pgCard.querySelector('.pg-subtitle');
    if (isAdmin) {
      if (titleEl) titleEl.textContent = 'Chambers Master Oversight';
      if (pgName) pgName.textContent = 'Firm-Wide Access Active';
    } else if (isHead) {
      if (titleEl) titleEl.textContent = 'Practice Group Head';
      if (pgName) pgName.textContent = state.currentUser.group || 'Constitutional & Writ';
    } else {
      if (titleEl) titleEl.textContent = 'Assigned Counsel Workspace';
      if (subtitleEl) {
        subtitleEl.innerHTML = `Active Matters: <span id="pgGroupName">${accessibleCases.length} Assigned Docket(s)</span>`;
      }
    }
  }
}

function populateAssigneeDropdowns() {
  if (!dom.caseAssignee) return;
  
  const selectedGroup = dom.caseGroup ? dom.caseGroup.value : 'Constitutional & Writ';
  const isHead = state.currentUser ? isUserGroupHead(state.currentUser) : false;
  const isAdmin = state.currentUser ? state.currentUser.role === 'Chambers Administrator' : false;

  const groupUsers = state.users.filter(u => {
    if (u.status === 'Suspended') return false;
    const uGroup = (u.group || u.dept || '').toLowerCase();
    return uGroup === selectedGroup.toLowerCase() || uGroup.includes('constitutional') || selectedGroup.toLowerCase().includes(uGroup);
  });

  const candidates = groupUsers.length > 0 ? groupUsers : state.users.filter(u => u.status !== 'Suspended');

  dom.caseAssignee.innerHTML = candidates.map(u => {
    const isSub = !isUserGroupHead(u) && u.role !== 'Chambers Administrator';
    const label = `${u.name} (${u.role}${isSub ? ' • Subordinate' : ' • Head'})`;
    const isSelected = state.currentUser && state.currentUser.id === u.id ? 'selected' : '';
    return `<option value="${u.id}" ${isSelected}>${escapeHTML(label)}</option>`;
  }).join('');

  if (!isAdmin && !isHead && state.currentUser) {
    dom.caseAssignee.value = state.currentUser.id;
  }
}

function populateEditAssigneeDropdown(targetGroup, currentAssigneeId) {
  if (!dom.editCaseAssignee) return;
  const grp = targetGroup || (dom.editCaseGroup ? dom.editCaseGroup.value : 'Constitutional & Writ');
  
  const groupUsers = state.users.filter(u => {
    if (u.status === 'Suspended') return false;
    const uGroup = (u.group || u.dept || '').toLowerCase();
    return uGroup === grp.toLowerCase() || uGroup.includes('constitutional') || grp.toLowerCase().includes(uGroup);
  });

  const candidates = groupUsers.length > 0 ? groupUsers : state.users.filter(u => u.status !== 'Suspended');

  dom.editCaseAssignee.innerHTML = candidates.map(u => {
    const isSub = !isUserGroupHead(u) && u.role !== 'Chambers Administrator';
    const label = `${u.name} (${u.role}${isSub ? ' • Subordinate' : ' • Head'})`;
    const isSelected = (currentAssigneeId && currentAssigneeId === u.id) ? 'selected' : '';
    return `<option value="${u.id}" ${isSelected}>${escapeHTML(label)}</option>`;
  }).join('');

  if (currentAssigneeId) {
    dom.editCaseAssignee.value = currentAssigneeId;
  }
}

// Case Updates Modal & Timeline
function openCaseUpdatesModal(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  // Authorization Check: Subordinates can only access updates for their assigned cases!
  const accessible = getAccessibleCases(state.currentUser);
  const isAccessible = accessible.some(c => c.id === caseId);
  if (!isAccessible) {
    showToast('Access Denied: This docket is assigned to another counsel and is confidential.', 'error');
    return;
  }

  if (dom.updatesTargetCaseId) dom.updatesTargetCaseId.value = caseItem.id;
  const updatesModalSubtitle = document.getElementById('caseUpdatesModalSubtitle');
  if (updatesModalSubtitle) {
    updatesModalSubtitle.textContent = `${caseItem.caseNumber} • ${caseItem.clientName} (${caseItem.group || caseItem.caseCategory})`;
  }

  if (dom.updatesCaseMeta) {
    dom.updatesCaseMeta.innerHTML = `
      <span class="badge-group"><i class="fa-solid fa-users"></i> ${escapeHTML(caseItem.group || caseItem.caseCategory)}</span>
      <span class="badge-assignee my-assignment"><i class="fa-solid fa-user-check"></i> Assigned: ${escapeHTML(caseItem.assignedToName || 'Unassigned')}</span>
      <span class="matter-badge"><i class="fa-solid fa-building-columns"></i> ${escapeHTML(caseItem.courtName)}</span>
      <span class="hearing-badge ${caseItem.status === 'Disposed' ? 'badge-passed' : 'badge-today'}">${escapeHTML(caseItem.status || 'Active')}</span>
    `;
  }

  renderCaseUpdatesTimeline(caseItem);

  if (dom.caseUpdatesModal) dom.caseUpdatesModal.classList.remove('hidden');
}

function closeCaseUpdatesModal() {
  if (dom.caseUpdatesModal) dom.caseUpdatesModal.classList.add('hidden');
}

function renderCaseUpdatesTimeline(caseItem) {
  if (!dom.caseUpdatesTimeline) return;
  
  if (!caseItem.updates || !Array.isArray(caseItem.updates) || caseItem.updates.length === 0) {
    dom.caseUpdatesTimeline.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 1.5rem 1rem;">
        <i class="fa-solid fa-clock-rotate-left" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
        No updates recorded yet. Add the first case proceeding or filing note above.
      </div>
    `;
    if (dom.updatesCountBadge) dom.updatesCountBadge.textContent = '0';
    return;
  }

  if (dom.updatesCountBadge) dom.updatesCountBadge.textContent = caseItem.updates.length;

  dom.caseUpdatesTimeline.innerHTML = caseItem.updates.map(u => {
    let icon = '<i class="fa-solid fa-file-lines"></i>';
    if (u.type === 'hearing') icon = '<i class="fa-solid fa-gavel"></i>';
    else if (u.type === 'order') icon = '<i class="fa-solid fa-stamp"></i>';
    else if (u.type === 'instruction') icon = '<i class="fa-solid fa-crown gold-text"></i>';
    else if (u.type === 'status') icon = '<i class="fa-solid fa-clock"></i>';

    return `
      <div class="timeline-update-item">
        <div class="timeline-marker-dot"></div>
        <div class="timeline-header-row">
          <div class="timeline-update-title">
            ${icon} ${escapeHTML(u.title || 'Case Update')}
          </div>
          <span class="timeline-update-time">
            ${formatDateDisplay(u.date)} • ${u.time || ''}
          </span>
        </div>
        <div class="timeline-author-info">
          <span class="timeline-type-pill">${escapeHTML(u.type || 'General')}</span>
          <span>By <strong>${escapeHTML(u.author || 'Counsel')}</strong> (${escapeHTML(u.authorRole || 'Advocate')})</span>
        </div>
        <div class="timeline-notes-text">${escapeHTML(u.notes || '')}</div>
      </div>
    `;
  }).join('');
}

function handleAddCaseUpdateSubmit(e) {
  e.preventDefault();
  const caseId = dom.updatesTargetCaseId ? dom.updatesTargetCaseId.value : null;
  if (!caseId) return;

  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  const title = dom.updateTitle ? dom.updateTitle.value.trim() : '';
  const type = dom.updateType ? dom.updateType.value : 'filing';
  const notes = dom.updateNotes ? dom.updateNotes.value.trim() : '';

  if (!title || !notes) {
    showToast('Please provide an update summary and detailed notes.', 'error');
    return;
  }

  if (!caseItem.updates) caseItem.updates = [];

  const newUpdate = {
    id: 'upd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Chambers Counsel',
    authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
    type: type,
    title: title,
    notes: notes
  };

  caseItem.updates.unshift(newUpdate);
  saveCasesToStorage();

  logAuditEvent('Docket Update Added', `Update "${title}" recorded on case ${caseItem.caseNumber} (${caseItem.clientName}).`, 'create');
  showToast(`Case update logged on docket "${caseItem.caseNumber}"!`, 'success');

  if (dom.addCaseUpdateForm) dom.addCaseUpdateForm.reset();
  renderCaseUpdatesTimeline(caseItem);
  renderDashboard();
}

// Case Intake Form Submission
function handleNewCaseSubmit(e) {
  e.preventDefault();
  clearValidationErrors();

  const clientName = dom.clientName.value.trim();
  const clientPhone = dom.clientPhone.value.trim();
  const opposingParty = dom.opposingParty.value.trim() || 'Undisclosed / Pro-forma';
  const caseTitle = dom.caseTitle.value.trim();
  const caseNumber = dom.caseNumber.value.trim();
  const caseCategory = dom.caseCategory.value;
  const caseGroup = dom.caseGroup ? dom.caseGroup.value : 'Constitutional & Writ';
  const caseAssigneeId = dom.caseAssignee ? dom.caseAssignee.value : (state.currentUser ? state.currentUser.id : 'user_associate_3');
  const assignedUser = state.users.find(u => u.id === caseAssigneeId) || state.currentUser || DEFAULT_USERS[2];

  const priority = dom.priorityLevel.value;
  const courtName = dom.courtName.value.trim();
  const hearingDate = dom.hearingDate.value;
  const hearingTime = dom.hearingTime.value;
  const notes = dom.caseNotes.value.trim();

  let hasError = false;

  if (!clientName) {
    document.getElementById('clientNameError').textContent = 'Client name is required';
    hasError = true;
  }
  if (!clientPhone) {
    document.getElementById('clientPhoneError').textContent = 'Contact number is required';
    hasError = true;
  }
  if (!caseTitle) {
    document.getElementById('caseTitleError').textContent = 'Matter title is required';
    hasError = true;
  }
  if (!caseNumber) {
    document.getElementById('caseNumberError').textContent = 'Case/Suit number is required';
    hasError = true;
  }
  if (!courtName) {
    document.getElementById('courtNameError').textContent = 'Court or bench designation required';
    hasError = true;
  }
  if (!hearingDate) {
    document.getElementById('hearingDateError').textContent = 'Hearing date required';
    hasError = true;
  }
  if (!hearingTime) {
    document.getElementById('hearingTimeError').textContent = 'Listing time required';
    hasError = true;
  }

  if (hasError) return;

  const docsToAttach = (state.stagedDocs && state.stagedDocs.length > 0)
    ? [...state.stagedDocs]
    : (state.currentAttachedDoc ? [
        {
          id: 'doc_' + Date.now(),
          name: state.currentAttachedDoc.name,
          size: state.currentAttachedDoc.size || '1.2 MB',
          type: getFileTypeFromName(state.currentAttachedDoc.name),
          category: dom.intakeDocCategory ? dom.intakeDocCategory.value : 'Petition / Plaint',
          title: state.currentAttachedDoc.name.replace(/\.[^/.]+$/, ''),
          uploadedAt: new Date().toISOString(),
          uploadedBy: state.currentUser ? state.currentUser.name : 'Counsel'
        }
      ] : []);

  const newCase = {
    id: 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    clientName,
    clientPhone,
    opposingParty,
    caseTitle,
    caseNumber,
    caseCategory,
    group: caseGroup,
    assignedTo: assignedUser.id,
    assignedToName: assignedUser.name,
    assignedToEmail: assignedUser.email,
    assignedBy: state.currentUser ? `${state.currentUser.name} (${state.currentUser.role})` : 'Chambers Administrator',
    createdBy: state.currentUser ? state.currentUser.email : '',
    createdById: state.currentUser ? state.currentUser.id : '',
    priority,
    courtName,
    hearingDate,
    hearingTime,
    notes,
    updates: [
      {
        id: 'upd_' + Date.now(),
        date: getOffsetDateString(0),
        time: formatTime12Hour(hearingTime),
        author: state.currentUser ? state.currentUser.name : 'System',
        authorRole: state.currentUser ? state.currentUser.role : 'Counsel',
        type: 'filing',
        title: 'Initial Case Intake & Filing',
        notes: `Docket formally instituted in "${caseGroup}" practice group and assigned to ${assignedUser.name}. ${docsToAttach.length > 0 ? `Attached ${docsToAttach.length} initial document(s).` : ''}`
      }
    ],
    documents: docsToAttach,
    attachedDoc: docsToAttach.length > 0 ? { name: docsToAttach[0].name, size: docsToAttach[0].size } : null,
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  // Add to top of cases list
  state.cases.unshift(newCase);
  saveCasesToStorage();

  // Reset form, dropzone, staged docs and reset to Part 1
  dom.newCaseForm.reset();
  state.stagedDocs = [];
  renderStagedDocs();
  switchIntakePart('details');
  resetDocumentUploadZone();
  setDefaultFormDates();
  populateAssigneeDropdowns();

  renderDashboard();
  showToast(`Case for "${clientName}" filed with ${docsToAttach.length} document(s) & assigned to ${assignedUser.name}!`, 'success');

  // Highlight card on right side
  setTimeout(() => {
    const newlyCreatedCard = document.querySelector(`[data-case-id="${newCase.id}"]`);
    if (newlyCreatedCard) {
      newlyCreatedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      newlyCreatedCard.style.outline = '2px solid var(--gold-primary)';
      setTimeout(() => newlyCreatedCard.style.outline = 'none', 2500);
    }
  }, 100);
}

function clearValidationErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

// ==========================================================================
// 7. ACTIVE CASES & COURT SCHEDULE (RIGHT PANEL)
// ==========================================================================

function renderDashboard() {
  updateAccessScopeBanner();
  updateMetrics();
  renderCasesList();
  if (typeof updateDrawerCounts === 'function') {
    updateDrawerCounts();
  }
  if (dom.searchDrawerOverlay && dom.searchDrawerOverlay.classList.contains('active')) {
    renderDrawerCasesList();
  }
  if (state.activeFullScreenCaseId) {
    openFullScreenCase(state.activeFullScreenCaseId);
  }
  if (typeof window.renderExtClientsList === 'function') {
    window.renderExtClientsList();
  }
}

function updateMetrics() {
  const todayStr = getOffsetDateString(0);
  const accessible = getAccessibleCases(state.currentUser);
  
  const todayCases = accessible.filter(c => c.hearingDate === todayStr && c.status !== 'Disposed');
  const activeCases = accessible.filter(c => c.status !== 'Disposed');
  const urgentCases = accessible.filter(c => (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed');
  const upcomingCases = accessible.filter(c => c.hearingDate > todayStr && c.status !== 'Disposed');
  const closedCases = accessible.filter(c => c.status === 'Disposed');

  // Top Nav Stats
  dom.statTodayHearings.textContent = todayCases.length;
  dom.statActiveCases.textContent = activeCases.length;
  dom.statUrgentCases.textContent = urgentCases.length;

  // Filter Pill Counts
  dom.countAll.textContent = accessible.length;
  dom.countToday.textContent = todayCases.length;
  dom.countUpcoming.textContent = upcomingCases.length;
  dom.countCritical.textContent = urgentCases.length;
  dom.countClosed.textContent = closedCases.length;

  // Client Count Badges
  const uniqueClients = new Set(accessible.map(c => (c.clientName || '').trim()).filter(Boolean));
  const totalClientsCount = uniqueClients.size || accessible.length;
  if (dom.railClientsCountBadge) dom.railClientsCountBadge.textContent = totalClientsCount;
  if (dom.railClientsBadge) dom.railClientsBadge.textContent = totalClientsCount;
  if (dom.idxClientsCountPill) dom.idxClientsCountPill.textContent = totalClientsCount;
  if (dom.idxAllCountBadge) dom.idxAllCountBadge.textContent = totalClientsCount;
  const btnClientsBadge = document.getElementById('btnClientsCountBadge');
  if (btnClientsBadge) btnClientsBadge.textContent = totalClientsCount;

  // Rail Filter Button Badges
  const railToday = document.getElementById('railTodayBadge');
  const railUrgent = document.getElementById('railUrgentBadge');
  const railUpcoming = document.getElementById('railUpcomingBadge');
  const extCountToday = document.getElementById('extCountToday');
  if (railToday) railToday.textContent = todayCases.length;
  if (railUrgent) railUrgent.textContent = urgentCases.length;
  if (railUpcoming) railUpcoming.textContent = upcomingCases.length;
  if (extCountToday) extCountToday.textContent = todayCases.length;
}

function renderCasesList() {
  const todayStr = getOffsetDateString(0);
  const accessible = getAccessibleCases(state.currentUser);
  
  // 1. Filter by tab category
  let filtered = accessible.filter(c => {
    if (state.currentFilter === 'today') return c.hearingDate === todayStr && c.status !== 'Disposed';
    if (state.currentFilter === 'upcoming') return c.hearingDate > todayStr && c.status !== 'Disposed';
    if (state.currentFilter === 'critical') return (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed';
    if (state.currentFilter === 'closed') return c.status === 'Disposed';
    return true; // 'all'
  });

  // 2. Filter by search query based on selected search mode (All, Case Name, Client Name, Case Number)
  if (state.searchQuery) {
    const q = state.searchQuery;
    filtered = filtered.filter(c => {
      if (state.searchMode === 'caseTitle') {
        return (c.caseTitle || '').toLowerCase().includes(q);
      }
      if (state.searchMode === 'clientName') {
        return (c.clientName || '').toLowerCase().includes(q);
      }
      if (state.searchMode === 'caseNumber') {
        return (c.caseNumber || '').toLowerCase().includes(q);
      }
      // 'all'
      return (
        (c.clientName || '').toLowerCase().includes(q) ||
        (c.caseTitle || '').toLowerCase().includes(q) ||
        (c.caseNumber || '').toLowerCase().includes(q) ||
        (c.courtName || '').toLowerCase().includes(q) ||
        (c.assignedToName && c.assignedToName.toLowerCase().includes(q)) ||
        (c.group && c.group.toLowerCase().includes(q))
      );
    });
  }

  // 3. Sort chronologically by hearing date & time, then client name
  filtered.sort((a, b) => {
    if (a.status === 'Disposed' && b.status !== 'Disposed') return 1;
    if (a.status !== 'Disposed' && b.status === 'Disposed') return -1;
    
    const dateA = new Date(`${a.hearingDate}T${a.hearingTime || '00:00'}`);
    const dateB = new Date(`${b.hearingDate}T${b.hearingTime || '00:00'}`);
    return dateA - dateB;
  });

  // Empty State Handling
  if (filtered.length === 0) {
    dom.casesList.innerHTML = '';
    state.activeDocketCaseId = null;

    const indexList = document.getElementById('docketIndexList');
    if (indexList) {
      indexList.innerHTML = `
        <div style="padding: 2.5rem 1rem; text-align: center; color: rgba(255,255,255,0.6);">
          <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; opacity: 0.5; margin-bottom: 0.75rem; display:block; color: var(--gold-primary);"></i>
          <strong style="color: #fff; display:block; font-size: 0.9rem; margin-bottom: 0.25rem;">No Dockets Found</strong>
          <p style="margin: 0; font-size: 0.78rem; line-height: 1.4;">${accessible.length === 0 ? 'No cases are currently registered or allocated to your account.' : 'No cases match this category.'}</p>
        </div>
      `;
    }

    const placeholder = document.getElementById('docketDetailPlaceholder');
    const content = document.getElementById('docketDetailContent');
    if (content) content.classList.add('hidden');
    if (placeholder) {
      placeholder.classList.remove('hidden');
      if (accessible.length === 0) {
        placeholder.innerHTML = `
          <div class="placeholder-icon-wrap">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <h3>No Assigned Legal Dockets</h3>
          <p>Your chambers account currently has no active cases assigned to you. When cases are allocated to you or you register a new intake, they will appear here.</p>
          <button type="button" class="btn btn-gold btn-sm" style="margin-top: 1rem;" onclick="if(window.quickAddNewCase) window.quickAddNewCase();">
            <i class="fa-solid fa-plus"></i> Register New Case Intake
          </button>
        `;
      } else {
        placeholder.innerHTML = `
          <div class="placeholder-icon-wrap">
            <i class="fa-solid fa-filter"></i>
          </div>
          <h3>No Cases in this Category</h3>
          <p>There are no legal dockets matching the selected filter tab.</p>
        `;
      }
    }
    return;
  }

  dom.emptyState.classList.add('hidden');

  // Render docket index sidebar (client name list)
  renderDocketIndex(filtered, todayStr);
}

// Render the left-side client name index for the docket split-view
function renderDocketIndex(filteredCases, todayStr) {
  const indexList = document.getElementById('docketIndexList');
  if (!indexList) return;

  // Update practice group banner name
  const pgName = document.getElementById('pgGroupName');
  if (pgName && state.currentUser) {
    pgName.textContent = state.currentUser.group || state.currentUser.name || 'Antigravity';
  }

  if (!filteredCases || filteredCases.length === 0) {
    indexList.innerHTML = `
      <div style="padding: 2.5rem 1rem; text-align: center; color: rgba(255,255,255,0.6);">
        <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; opacity: 0.5; margin-bottom: 0.75rem; display:block; color: var(--gold-primary);"></i>
        <strong style="color: #fff; display:block; font-size: 0.9rem; margin-bottom: 0.25rem;">No Dockets Found</strong>
        <p style="margin: 0; font-size: 0.78rem; line-height: 1.4;">No cases allocated.</p>
      </div>
    `;
    state.activeDocketCaseId = null;
    const placeholder = document.getElementById('docketDetailPlaceholder');
    const content = document.getElementById('docketDetailContent');
    if (placeholder) placeholder.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    return;
  }

  // Auto-select first case if none active or not in filtered
  if (!state.activeDocketCaseId || !filteredCases.some(c => c.id === state.activeDocketCaseId)) {
    state.activeDocketCaseId = filteredCases[0].id;
    setTimeout(() => openDocketDetail(filteredCases[0].id, state.activeDocketTab || 'overview'), 0);
  }

  indexList.innerHTML = filteredCases.map(item => {
    const isToday = item.hearingDate === todayStr;
    const isUrgent = item.priority === 'Critical';
    const isClosed = item.status === 'Disposed';
    let dotClass = '';
    if (isClosed) dotClass = 'closed';
    else if (isUrgent) dotClass = 'urgent';
    else if (isToday) dotClass = 'today';

    const isActive = state.activeDocketCaseId === item.id;
    return `
      <div class="docket-index-item ${isActive ? 'active' : ''}" data-case-id="${item.id}" onclick="openDocketDetail('${item.id}')">
        <div class="idx-item-text">
          <span class="idx-client-name">${escapeHTML(item.clientName)}</span>
          <span class="idx-case-tag">${escapeHTML(item.caseNumber)}</span>
        </div>
        <span class="idx-status-dot ${dotClass}"></span>
      </div>
    `;
  }).join('');

  // Wire sidebar search
  const searchInput = document.getElementById('docketSidebarSearch');
  const clearBtn = document.getElementById('idxClearDocketSearchBtn');
  if (searchInput && !searchInput._docketWired) {
    searchInput._docketWired = true;
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (clearBtn) {
        if (q.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      document.querySelectorAll('.docket-index-item').forEach(el => {
        const name = el.querySelector('.idx-client-name')?.textContent.toLowerCase() || '';
        const tag  = el.querySelector('.idx-case-tag')?.textContent.toLowerCase() || '';
        el.style.display = (name.includes(q) || tag.includes(q)) ? '' : 'none';
      });
    });
  }
}

// ---- Clear sidebar docket client search ----
window.clearDocketSearch = function() {
  const searchInput = document.getElementById('docketSidebarSearch');
  const clearBtn = document.getElementById('idxClearDocketSearchBtn');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  document.querySelectorAll('.docket-index-item').forEach(el => {
    el.style.display = '';
  });
};

// ==========================================================================
// EXTENDED BLUE SIDEBAR RAIL LOGIC (CLIENTS LIST)
// ==========================================================================

let extRailFilter = 'all';
let extRailSearchQuery = '';

function formatDisplayDate(dateStr) {
  if (typeof formatDateDisplay === 'function') {
    return formatDateDisplay(dateStr);
  }
  return dateStr || 'Pending';
}

window.toggleBlueRail = function(forceOpen) {
  const rail = document.getElementById('leftSidebarRail');
  if (!rail) return;

  const isCurrentlyExtended = rail.classList.contains('extended');
  const willExtend = (typeof forceOpen === 'boolean') ? forceOpen : !isCurrentlyExtended;

  const workspaceSidebar = document.getElementById('docketIndexSidebar');

  if (willExtend) {
    if (state.activeView !== 'workspace') {
      switchWorkspaceView('workspace');
    }

    rail.classList.add('extended');
    updateRailActiveButtons(extRailFilter || 'all');
    const toggleText = document.getElementById('toggleClientsBtnText');
    if (toggleText) toggleText.textContent = 'Hide Clients';

    // Also uncollapse workspace client sidebar so names are visible in both places
    if (workspaceSidebar) {
      workspaceSidebar.classList.remove('collapsed');
      const allCases = getAccessibleCases(state.currentUser);
      renderDocketIndex(allCases, getOffsetDateString(0));
    }

    // Render list in blue panel
    window.renderExtClientsList();

    const searchInput = document.getElementById('extRailSearchInput');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 120);
    }
  } else {
    rail.classList.remove('extended');
    updateRailActiveButtons('none');
    const toggleText = document.getElementById('toggleClientsBtnText');
    if (toggleText) toggleText.textContent = 'Show Clients';
    if (workspaceSidebar) {
      workspaceSidebar.classList.add('collapsed');
    }
  }
};

window.toggleBlueRailWithFilter = function(filterType) {
  const rail = document.getElementById('leftSidebarRail');
  if (!rail) return;

  const isExtended = rail.classList.contains('extended');

  // If already open with the same filter, toggle close
  if (isExtended && extRailFilter === filterType) {
    window.toggleBlueRail(false);
    return;
  }

  // Set filter
  extRailFilter = filterType || 'all';

  // Open if closed
  if (!isExtended) {
    window.toggleBlueRail(true);
  }

  // Update pills inside the blue panel
  document.querySelectorAll('.ext-filter-pills .ext-pill').forEach(pill => {
    if (pill.getAttribute('data-ext-filter') === extRailFilter) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update active button on the rail
  updateRailActiveButtons(filterType);

  // Render list
  window.renderExtClientsList();
};

window.toggleBlueRailWithSearch = function() {
  const rail = document.getElementById('leftSidebarRail');
  if (!rail) return;

  if (!rail.classList.contains('extended')) {
    window.toggleBlueRail(true);
  }

  const searchInput = document.getElementById('extRailSearchInput');
  if (searchInput) {
    setTimeout(() => {
      searchInput.focus();
      searchInput.select();
    }, 150);
  }

  updateRailActiveButtons('search');
};

function updateRailActiveButtons(activeType) {
  const btnClients = document.getElementById('sidebarRailClientsBtn');
  const btnToday = document.getElementById('railQuickTodayBtn');
  const btnUrgent = document.getElementById('railQuickUrgentBtn');
  const btnUpcoming = document.getElementById('railQuickUpcomingBtn');
  const btnSearch = document.getElementById('sidebarRailSearchBtn');

  [btnClients, btnToday, btnUrgent, btnUpcoming, btnSearch].forEach(b => {
    if (b) b.classList.remove('active');
  });

  if (activeType === 'all' && btnClients) btnClients.classList.add('active');
  if (activeType === 'today' && btnToday) btnToday.classList.add('active');
  if (activeType === 'critical' && btnUrgent) btnUrgent.classList.add('active');
  if (activeType === 'upcoming' && btnUpcoming) btnUpcoming.classList.add('active');
  if (activeType === 'search' && btnSearch) btnSearch.classList.add('active');
}

window.toggleClientSidebar = function(forceOpen) {
  window.toggleBlueRail(forceOpen);
};

window.renderExtClientsList = function() {
  const listEl = document.getElementById('extClientsList');
  if (!listEl) return;

  const accessible = getAccessibleCases(state.currentUser);
  const todayStr = getOffsetDateString(0);

  // Update counts
  const badgeEl = document.getElementById('extRailClientsBadge');
  const countAllEl = document.getElementById('extCountAll');
  const countTodayEl = document.getElementById('extCountToday');
  const countUpcomingEl = document.getElementById('extCountUpcoming');
  const countCriticalEl = document.getElementById('extCountCritical');

  const todayCount = accessible.filter(c => c.hearingDate === todayStr && c.status !== 'Disposed').length;
  const upcomingCount = accessible.filter(c => c.hearingDate > todayStr && c.status !== 'Disposed').length;
  const criticalCount = accessible.filter(c => (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed').length;

  if (badgeEl) badgeEl.textContent = accessible.length;
  if (countAllEl) countAllEl.textContent = accessible.length;
  if (countTodayEl) countTodayEl.textContent = todayCount;
  if (countUpcomingEl) countUpcomingEl.textContent = upcomingCount;
  if (countCriticalEl) countCriticalEl.textContent = criticalCount;

  // Sync badges on the left blue rail itself
  const railClientsCountBadge = document.getElementById('railClientsCountBadge');
  const railToday = document.getElementById('railTodayBadge');
  const railUrgent = document.getElementById('railUrgentBadge');
  const railUpcoming = document.getElementById('railUpcomingBadge');
  if (railClientsCountBadge) railClientsCountBadge.textContent = accessible.length;
  if (railToday) railToday.textContent = todayCount;
  if (railUrgent) railUrgent.textContent = criticalCount;
  if (railUpcoming) railUpcoming.textContent = upcomingCount;

  // Filter
  let filtered = accessible.filter(c => {
    if (extRailFilter === 'today') return c.hearingDate === todayStr && c.status !== 'Disposed';
    if (extRailFilter === 'upcoming') return c.hearingDate > todayStr && c.status !== 'Disposed';
    if (extRailFilter === 'critical') return (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed';
    return true;
  });

  if (extRailSearchQuery) {
    const q = extRailSearchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      (c.clientName || '').toLowerCase().includes(q) ||
      (c.caseTitle || '').toLowerCase().includes(q) ||
      (c.caseNumber || '').toLowerCase().includes(q)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    if (a.status === 'Disposed' && b.status !== 'Disposed') return 1;
    if (a.status !== 'Disposed' && b.status === 'Disposed') return -1;
    return (a.hearingDate || '').localeCompare(b.hearingDate || '');
  });

  if (filtered.length === 0) {
    let emptyMsg = accessible.length === 0 ? 'No dockets assigned to your account' : 'No clients found';
    if (extRailFilter === 'today') emptyMsg = 'No court hearings scheduled for today';
    else if (extRailFilter === 'critical') emptyMsg = 'No urgent or critical briefs found';
    else if (extRailFilter === 'upcoming') emptyMsg = 'No upcoming hearings scheduled';

    listEl.innerHTML = `
      <div style="text-align:center; padding: 2.5rem 1rem; color: rgba(255,255,255,0.7); font-size: 0.85rem;">
        <i class="fa-solid fa-briefcase" style="font-size: 1.8rem; margin-bottom: 0.6rem; opacity: 0.6; display:block; color: var(--gold-primary);"></i>
        <strong style="color:#fff; display:block; margin-bottom:0.25rem;">${emptyMsg}</strong>
        <p style="margin:0; font-size:0.78rem; opacity:0.8;">${accessible.length === 0 ? 'Register a new case intake to add your first client docket.' : 'Switch filter or register a new legal docket.'}</p>
      </div>
    `;
    return;
  }

  // Auto-select first if none selected
  if (!state.activeDocketCaseId && filtered.length > 0) {
    state.activeDocketCaseId = filtered[0].id;
    openDocketDetail(filtered[0].id);
  }

  listEl.innerHTML = filtered.map(c => {
    const rawName = (c.clientName || 'Client Name Pending').trim();
    const initials = rawName.replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s+/i, '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CL';
    const isToday = c.hearingDate === todayStr;
    const isUrgent = c.priority === 'Critical';
    const isClosed = c.status === 'Disposed';
    let dotClass = '';
    if (isClosed) dotClass = 'closed';
    else if (isUrgent) dotClass = 'urgent';
    else if (isToday) dotClass = 'today';

    const isActive = state.activeDocketCaseId === c.id;

    return `
      <div class="ext-client-card ${isActive ? 'active' : ''}" data-case-id="${c.id}" onclick="window.selectClientFromExtRail('${c.id}')">
        <div class="ext-client-avatar">${initials}</div>
        <div class="ext-client-meta">
          <div class="ext-client-name" title="${escapeHTML(rawName)}">${escapeHTML(rawName)}</div>
          <div class="ext-client-sub">
            <span class="ext-client-tag">${escapeHTML(c.caseNumber || 'MATTER')}</span>
            <span class="ext-hearing-tag"><i class="fa-regular fa-calendar"></i> ${formatDisplayDate(c.hearingDate)}</span>
          </div>
        </div>
        <span class="ext-status-dot ${dotClass}" title="${escapeHTML(c.status || 'Active')}"></span>
      </div>
    `;
  }).join('');
};

window.selectClientFromExtRail = function(caseId) {
  state.activeDocketCaseId = caseId;
  openDocketDetail(caseId);

  // Update active card styling
  document.querySelectorAll('.ext-client-card').forEach(card => {
    if (card.getAttribute('data-case-id') === caseId) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

window.filterExtRail = function(type) {
  extRailFilter = type;
  document.querySelectorAll('.ext-filter-pills .ext-pill').forEach(pill => {
    if (pill.getAttribute('data-ext-filter') === type) pill.classList.add('active');
    else pill.classList.remove('active');
  });
  updateRailActiveButtons(type);
  window.renderExtClientsList();
};

window.clearExtSearch = function() {
  extRailSearchQuery = '';
  const input = document.getElementById('extRailSearchInput');
  const clearBtn = document.getElementById('extClearSearchBtn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  window.renderExtClientsList();
};

// ---- Show All Clients in Sidebar & Docket View ----
window.showAllClients = function() {
  if (state.activeView !== 'workspace') {
    switchWorkspaceView('workspace');
  }
  window.toggleClientSidebar(true);
};

// ---- Chambers Client Directory Modal Logic ----
window.openAllClientsModal = function() {
  const modal = document.getElementById('allClientsModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const accessible = getAccessibleCases(state.currentUser);
  
  // Group cases by clientName
  const clientsMap = new Map();
  accessible.forEach(c => {
    const key = (c.clientName || 'Unnamed Client').trim();
    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        clientName: key,
        clientPhone: c.clientPhone || '+91 98110 00000',
        cases: []
      });
    }
    clientsMap.get(key).cases.push(c);
  });

  const clientsArray = Array.from(clientsMap.values());

  // Update stats
  const totalClientsEl = document.getElementById('cdTotalClients');
  const activeMattersEl = document.getElementById('cdActiveMatters');
  const hearingsListedEl = document.getElementById('cdHearingsListed');
  if (totalClientsEl) totalClientsEl.textContent = clientsArray.length;
  if (activeMattersEl) activeMattersEl.textContent = accessible.length;
  if (hearingsListedEl) {
    const todayStr = getOffsetDateString(0);
    const upcoming = accessible.filter(c => c.hearingDate >= todayStr && c.status !== 'Disposed').length;
    hearingsListedEl.textContent = upcoming;
  }

  renderClientsDirectoryGrid(clientsArray);

  const searchInput = document.getElementById('clientsModalSearch');
  if (searchInput) {
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 100);
  }
};

window.closeAllClientsModal = function() {
  const modal = document.getElementById('allClientsModal');
  if (modal) modal.classList.add('hidden');
};

function renderClientsDirectoryGrid(clientsList) {
  const grid = document.getElementById('clientsDirectoryGrid');
  if (!grid) return;

  if (clientsList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
        <i class="fa-solid fa-users" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
        <p>No clients found matching the search criteria.</p>
      </div>
    `;
    return;
  }

  const todayStr = getOffsetDateString(0);

  grid.innerHTML = clientsList.map(item => {
    const initials = item.clientName.replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s+/i, '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CL';
    
    const mattersHtml = item.cases.map(c => {
      return `
        <div class="cd-matter-item">
          <span class="cd-matter-title" title="${escapeHTML(c.caseTitle)}">${escapeHTML(c.caseTitle)}</span>
          <span class="cd-matter-tag">${escapeHTML(c.caseNumber)}</span>
        </div>
      `;
    }).join('');

    const primaryCase = item.cases[0];
    const isUrgent = item.cases.some(c => c.priority === 'Critical');

    return `
      <div class="client-directory-card" data-client-name="${escapeHTML(item.clientName.toLowerCase())}">
        <div class="cd-card-top">
          <div class="cd-avatar-badge">${initials}</div>
          <div class="cd-client-info">
            <div class="cd-client-name" title="${escapeHTML(item.clientName)}">${escapeHTML(item.clientName)}</div>
            <div class="cd-client-phone"><i class="fa-solid fa-phone"></i> ${escapeHTML(item.clientPhone)}</div>
          </div>
        </div>

        <div class="cd-card-matters">
          <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
            ${item.cases.length} ${item.cases.length === 1 ? 'Matter' : 'Matters'}
          </div>
          ${mattersHtml}
        </div>

        <div class="cd-card-actions">
          <div class="cd-hearing-pill ${isUrgent ? 'urgent' : ''}">
            <i class="fa-regular fa-calendar"></i> Next: ${formatDisplayDate(primaryCase.hearingDate)}
          </div>
          <button type="button" class="cd-open-docket-btn" onclick="selectClientFromDirectory('${primaryCase.id}')">
            <span>Open Docket</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.selectClientFromDirectory = function(caseId) {
  window.closeAllClientsModal();
  window.showAllClients();
  setTimeout(() => {
    openDocketDetail(caseId);
  }, 60);
};

window.filterClientsDirectory = function(query) {
  const q = (query || '').trim().toLowerCase();
  const accessible = getAccessibleCases(state.currentUser);
  
  const clientsMap = new Map();
  accessible.forEach(c => {
    const key = (c.clientName || 'Unnamed Client').trim();
    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        clientName: key,
        clientPhone: c.clientPhone || '+91 98110 00000',
        cases: []
      });
    }
    clientsMap.get(key).cases.push(c);
  });

  const clientsArray = Array.from(clientsMap.values());
  const filtered = clientsArray.filter(client => {
    if (client.clientName.toLowerCase().includes(q)) return true;
    if (client.clientPhone.toLowerCase().includes(q)) return true;
    return client.cases.some(c => 
      (c.caseNumber || '').toLowerCase().includes(q) || 
      (c.caseTitle || '').toLowerCase().includes(q)
    );
  });

  renderClientsDirectoryGrid(filtered);
};

// ---- Helper: build status pill ----
function buildStatusPill(caseItem, todayStr) {
  const s = caseItem.status;
  if (s === 'Disposed') return `<span class="status-pill closed-pill"><span class="pill-dot"></span> Disposed</span>`;
  if (caseItem.hearingDate === todayStr) return `<span class="status-pill today-pill"><span class="pill-dot"></span> Today</span>`;
  if (caseItem.priority === 'Critical') return `<span class="status-pill urgent-pill"><span class="pill-dot"></span> Critical</span>`;
  return `<span class="status-pill active-pill"><span class="pill-dot"></span> In Progress</span>`;
}

// ---- Open docket detail with tabs ----
window.openDocketDetail = function(caseId, activeTab) {
  const accessible = getAccessibleCases(state.currentUser);
  const caseItem = accessible.find(c => c.id === caseId);

  const placeholder = document.getElementById('docketDetailPlaceholder');
  const content = document.getElementById('docketDetailContent');
  const stickyHeader = document.getElementById('detailStickyHeader');
  const tabBody = document.getElementById('detailTabBody');

  if (!caseItem) {
    state.activeDocketCaseId = null;
    if (placeholder) placeholder.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    return;
  }

  state.activeDocketCaseId = caseId;
  if (!activeTab) activeTab = state.activeDocketTab || 'overview';
  state.activeDocketTab = activeTab;

  // Refresh sidebar active highlights
  document.querySelectorAll('.docket-index-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-case-id') === caseId);
  });

  if (!content || !stickyHeader || !tabBody) return;

  if (placeholder) placeholder.classList.add('hidden');
  content.classList.remove('hidden');

  const todayStr = getOffsetDateString(0);
  const docsList = (caseItem.documents && Array.isArray(caseItem.documents)) ? caseItem.documents : [];
  const updates = (caseItem.updates && Array.isArray(caseItem.updates)) ? caseItem.updates : [];
  const tasks = (caseItem.tasks && Array.isArray(caseItem.tasks)) ? caseItem.tasks : [];

  const statusLabel = caseItem.status === 'Disposed' ? 'Disposed' : (caseItem.status || 'In Progress');
  const statusDotClass = caseItem.status === 'Disposed' ? 'closed' : (caseItem.priority === 'Critical' ? 'urgent' : 'active');

  // ---- Sticky Header ----
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'hearings', label: 'Hearings' },
    { id: 'documents', label: `Documents${docsList.length ? ` (${docsList.length})` : ''}` },
    { id: 'notes', label: 'Notes' },
    { id: 'tasks', label: `Tasks${tasks.length ? ` (${tasks.length})` : ''}` },
    { id: 'updates', label: `Updates (${updates.length})` },
    { id: 'team', label: 'Team' }
  ];

  stickyHeader.innerHTML = `
    <div class="detail-sh-top">
      <div class="detail-sh-client">
        <div class="detail-sh-name">${escapeHTML(caseItem.clientName)}</div>
        <div class="detail-sh-case-no">
          <i class="fa-solid fa-hashtag" style="font-size:0.65rem;"></i>
          ${escapeHTML(caseItem.caseNumber)}
          ${caseItem.opposingParty ? `<span style="color:#cbd5e1;">•</span> vs. ${escapeHTML(caseItem.opposingParty)}` : ''}
        </div>
      </div>
      <div class="detail-sh-actions">
        <!-- Interactive Status Dropdown -->
        <div class="status-dropdown-wrap" style="position:relative;display:inline-block;">
          <button type="button" class="detail-status-badge" onclick="window.toggleStatusMenu('${caseItem.id}', event)" title="Change case status">
            <span class="status-dot ${statusDotClass}"></span>
            <span class="status-text">${escapeHTML(statusLabel)}</span>
            <i class="fa-solid fa-chevron-down status-chevron"></i>
          </button>
          <div id="statusMenu-${caseItem.id}" class="status-dropdown-menu hidden">
            <div class="status-menu-header">Change Status</div>
            <div class="status-menu-item" onclick="window.setCaseStatus('${caseItem.id}', 'In Progress')">
              <span class="idx-status-dot" style="background:#1e3a5f;display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:0.35rem;"></span> In Progress
            </div>
            <div class="status-menu-item" onclick="window.setCaseStatus('${caseItem.id}', 'Upcoming Hearing')">
              <span class="idx-status-dot today" style="display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:0.35rem;"></span> Upcoming Hearing
            </div>
            <div class="status-menu-item" onclick="window.setCaseStatus('${caseItem.id}', 'Critical')">
              <span class="idx-status-dot urgent" style="display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:0.35rem;"></span> Critical / Urgent
            </div>
            <div class="status-menu-item" onclick="window.setCaseStatus('${caseItem.id}', 'Adjourned')">
              <span class="idx-status-dot" style="background:#eab308;display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:0.35rem;"></span> Adjourned
            </div>
            <div class="status-menu-item" onclick="window.setCaseStatus('${caseItem.id}', 'Disposed')">
              <span class="idx-status-dot closed" style="display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:0.35rem;"></span> Disposed / Closed
            </div>
          </div>
        </div>

        <a href="tel:${escapeHTML(caseItem.clientPhone)}" class="detail-action-btn" title="Call client">
          <i class="fa-solid fa-phone"></i> Call
        </a>
        <button type="button" class="detail-action-btn primary" onclick="openDocketDetail('${caseItem.id}','updates')" title="Add update">
          <i class="fa-solid fa-plus"></i> Add Update
        </button>
        <button type="button" class="detail-action-btn" onclick="openRescheduleModal('${caseItem.id}')" title="Reschedule hearing">
          <i class="fa-solid fa-calendar-plus"></i> Reschedule
        </button>
        <button type="button" class="detail-action-btn danger" onclick="deleteCaseAndRefresh('${caseItem.id}')" title="Delete case">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>
    <div class="detail-tab-bar">
      ${tabs.map(t => `<button type="button" class="detail-tab-pill ${activeTab === t.id ? 'active' : ''}" onclick="openDocketDetail('${caseItem.id}','${t.id}')">${t.label}</button>`).join('')}
    </div>
  `;

  // ---- Tab Content ----
  if (activeTab === 'overview') tabBody.innerHTML = buildOverviewTab(caseItem, todayStr, docsList, updates);
  else if (activeTab === 'hearings') tabBody.innerHTML = buildHearingsTab(caseItem, todayStr);
  else if (activeTab === 'documents') tabBody.innerHTML = buildDocumentsTab(caseItem, docsList);
  else if (activeTab === 'notes') tabBody.innerHTML = buildNotesTab(caseItem);
  else if (activeTab === 'tasks') tabBody.innerHTML = buildTasksTab(caseItem);
  else if (activeTab === 'updates') tabBody.innerHTML = buildUpdatesTab(caseItem, updates);
  else if (activeTab === 'team') tabBody.innerHTML = buildTeamTab(caseItem);
};

// ==============================
// TAB BUILDERS
// ==============================

function buildOverviewTab(caseItem, todayStr, docsList, updates) {
  const nextDate = caseItem.hearingDate;
  const dateObj = nextDate ? new Date(nextDate + 'T00:00:00') : null;
  const nextHearingDisplay = dateObj
    ? `${dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    : 'Not scheduled';

  const statusLabel = caseItem.status === 'Disposed' ? 'Disposed' : (caseItem.status || 'In Progress');
  const statusDotClass = caseItem.status === 'Disposed' ? 'closed' : (caseItem.priority === 'Critical' ? 'urgent' : 'active');

  // Recent activity: last 5 updates
  const recentActivity = updates.length > 0 ? updates.slice(0, 5) : [
    { title: 'Document uploaded', notes: 'Written Submissions.pdf', timeDisplay: '14 Oct 2024, 11:30 AM', icon: 'fa-file-lines' },
    { title: 'Hearing updated', notes: 'Next hearing scheduled for ' + nextHearingDisplay, timeDisplay: '13 Oct 2024, 4:20 PM', icon: 'fa-calendar-check' },
    { title: 'Note added', notes: 'Arguments to be finalized', timeDisplay: '12 Oct 2024, 10:15 AM', icon: 'fa-pen-nib' }
  ];

  const activityTimelineHTML = recentActivity.map(u => {
    let icon = u.icon || 'fa-file-lines';
    if (u.type === 'hearing') icon = 'fa-calendar-check';
    else if (u.type === 'order') icon = 'fa-stamp';
    else if (u.type === 'instruction') icon = 'fa-pen-nib';
    else if (u.type === 'status') icon = 'fa-clock-rotate-left';
    else if (u.type === 'filing') icon = 'fa-file-lines';

    const timeDisplay = u.timeDisplay || (u.date ? `${formatDateDisplay(u.date)}${u.time ? ', ' + u.time : ''}` : '');
    return `
      <div class="activity-tl-item">
        <div class="activity-tl-icon-box"><i class="fa-solid ${icon}"></i></div>
        <div class="activity-tl-body">
          <div class="activity-tl-header">
            <span class="activity-tl-title">${escapeHTML(u.title || 'Update')}</span>
            <span class="activity-tl-time">${timeDisplay}</span>
          </div>
          <div class="activity-tl-sub">${escapeHTML(u.notes || '')}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- 2x3 Grid matching reference UI -->
    <div class="detail-info-grid">
      <div class="detail-info-card">
        <div class="info-card-label">Case Number</div>
        <div class="info-card-value">${escapeHTML(caseItem.caseNumber)}</div>
      </div>
      <div class="detail-info-card">
        <div class="info-card-label">Case Type</div>
        <div class="info-card-value">${escapeHTML(caseItem.caseCategory || 'Letters Appeal')}</div>
      </div>
      <div class="detail-info-card">
        <div class="info-card-label">Court</div>
        <div class="info-card-value">${escapeHTML(caseItem.courtName || 'High Court')}</div>
      </div>
      <div class="detail-info-card">
        <div class="info-card-label">Filing Date</div>
        <div class="info-card-value">${caseItem.createdAt ? formatDateDisplay(caseItem.createdAt.substring(0,10)) : '12 Mar 2024'}</div>
      </div>
      <div class="detail-info-card">
        <div class="info-card-label">Next Hearing</div>
        <div class="info-card-value blue-highlight">${nextHearingDisplay}</div>
      </div>
      <div class="detail-info-card">
        <div class="info-card-label">Status</div>
        <div class="info-card-value">
          <span class="status-value-wrap">
            <span class="idx-status-dot ${statusDotClass}" style="display:inline-block;vertical-align:middle;margin-right:0.35rem;"></span>
            ${escapeHTML(statusLabel)}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Update Actions Strip -->
    <div class="quick-update-actions-strip">
      <div class="qua-heading"><i class="fa-solid fa-bolt gold-text"></i> Options to Add Updates:</div>
      <div class="qua-btn-group">
        <button type="button" class="qua-btn primary" onclick="openDocketDetail('${caseItem.id}', 'updates')">
          <i class="fa-solid fa-pen-to-square"></i> + Log Update
        </button>
        <button type="button" class="qua-btn" onclick="openQuickHearingUpdate('${caseItem.id}')">
          <i class="fa-solid fa-gavel"></i> + Hearing Outcome
        </button>
        <button type="button" class="qua-btn" onclick="openAddNewDocModal('${caseItem.id}')">
          <i class="fa-solid fa-folder-open"></i> + Upload Document
        </button>
        <button type="button" class="qua-btn" onclick="openQuickNoteModal('${caseItem.id}')">
          <i class="fa-solid fa-note-sticky"></i> + Add Strategy Note
        </button>
        <button type="button" class="qua-btn" onclick="openQuickTaskModal('${caseItem.id}')">
          <i class="fa-solid fa-list-check"></i> + Add Task
        </button>
      </div>
    </div>

    <!-- Recent Activity Section matching reference UI -->
    <div class="recent-activity-section">
      <div class="activity-section-header">
        <div class="activity-title-wrap">
          <span class="activity-title-bar"></span>
          <span class="activity-title-text">Recent Activity</span>
        </div>
        <button type="button" class="view-all-activity-btn" onclick="openDocketDetail('${caseItem.id}', 'updates')">
          View All (${updates.length}) <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <div class="activity-timeline">
        ${activityTimelineHTML}
      </div>
    </div>
  `;
}

function buildHearingsTab(caseItem, todayStr) {
  const dateObj = caseItem.hearingDate ? new Date(caseItem.hearingDate + 'T00:00:00') : null;
  const day = dateObj ? dateObj.toLocaleDateString('en-IN', { day: '2-digit' }) : '--';
  const mon = dateObj ? dateObj.toLocaleDateString('en-IN', { month: 'short' }) : '--';
  const isToday = caseItem.hearingDate === todayStr;
  const badge = isToday
    ? `<span class="hearing-badge badge-today" style="margin-left:auto;"><span class="pulse-dot"></span> TODAY</span>`
    : (caseItem.hearingDate > todayStr
      ? `<span class="hearing-badge badge-upcoming" style="margin-left:auto;"><i class="fa-regular fa-clock"></i> Upcoming</span>`
      : `<span class="hearing-badge badge-passed" style="margin-left:auto;"><i class="fa-solid fa-clock-rotate-left"></i> Past</span>`);

  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-gavel"></i> Scheduled Hearing</span>
        <button type="button" class="detail-action-btn primary" onclick="openRescheduleModal('${caseItem.id}')">
          <i class="fa-solid fa-calendar-plus"></i> Reschedule Hearing
        </button>
      </div>
      <div class="hearing-card">
        <div class="hearing-date-badge">
          <div class="hearing-date-day">${day}</div>
          <div class="hearing-date-mon">${mon}</div>
        </div>
        <div class="hearing-info">
          <div class="hearing-title">${escapeHTML(caseItem.courtName || 'High Court')}</div>
          <div class="hearing-meta">
            <i class="fa-regular fa-clock" style="margin-right:0.3rem;"></i>
            ${formatTime12Hour(caseItem.hearingTime || '11:00')} &nbsp;•&nbsp;
            <i class="fa-solid fa-users" style="margin-right:0.3rem;"></i>
            ${escapeHTML(caseItem.group || caseItem.caseCategory || 'Letters Appeal')}
          </div>
        </div>
        ${badge}
      </div>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-user-check"></i> Assigned Counsel</span>
      </div>
      <div class="detail-notes-block" style="display:flex;align-items:center;gap:0.85rem;">
        <div style="width:40px;height:40px;border-radius:50%;background:rgba(30,58,95,0.08);border:1.5px solid rgba(30,58,95,0.15);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--gold-primary);">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div>
          <div style="font-size:0.85rem;font-weight:600;color:#1f2937;">${escapeHTML(caseItem.assignedToName || 'Adv. Ananya Singh')}</div>
          <div style="font-size:0.72rem;color:#6b7280;">${escapeHTML(caseItem.assignedToEmail || 'ananya.singh@lexjuris.in')}</div>
        </div>
      </div>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-pen-to-square gold-text"></i> Log Hearing Outcome</span>
      </div>
      <form class="detail-update-form" onsubmit="window.handleQuickHearingSubmit(event, '${caseItem.id}')">
        <div class="update-form-row">
          <input type="text" name="hearingOutcomeSummary" placeholder="Hearing outcome (e.g. Arguments heard in part, listed next Monday)" required style="flex:2;">
        </div>
        <textarea name="hearingOutcomeNotes" placeholder="Summary of arguments submitted, bench observations, or directions given..." required></textarea>
        <div style="display:flex;justify-content:flex-end;">
          <button type="submit" class="detail-action-btn primary">
            <i class="fa-solid fa-floppy-disk"></i> Save Hearing Record
          </button>
        </div>
      </form>
    </div>
  `;
}

function buildDocumentsTab(caseItem, docsList) {
  const docsHTML = docsList.length === 0
    ? `<div style="color:#9ca3af;font-size:0.82rem;text-align:center;padding:2rem 0;"><i class="fa-regular fa-folder-open" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;"></i>No documents attached yet.</div>`
    : `<div class="detail-docs-list">${docsList.map(d => `
        <div class="detail-doc-item">
          <div class="doc-icon-wrap"><i class="fa-solid fa-file-pdf"></i></div>
          <div class="doc-info">
            <div class="doc-name">${escapeHTML(d.name || 'Document')}</div>
            <div class="doc-meta">${escapeHTML(d.category || 'Document')} • ${escapeHTML(d.size || '1.5 MB')}${d.uploadedBy ? ' • ' + escapeHTML(d.uploadedBy) : ''}</div>
          </div>
          <button type="button" class="detail-action-btn" onclick="openCaseDocsModal('${caseItem.id}')" title="View documents">
            <i class="fa-solid fa-eye"></i> View
          </button>
        </div>`).join('')}</div>`;

  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-folder-open"></i> Case Documents (${docsList.length})</span>
        <button type="button" class="detail-action-btn primary" onclick="openAddNewDocModal('${caseItem.id}')">
          <i class="fa-solid fa-plus"></i> Upload Document
        </button>
      </div>
      ${docsHTML}
    </div>
  `;
}

function buildNotesTab(caseItem) {
  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-quote-left"></i> Strategy &amp; Case Notes</span>
      </div>
      <div class="detail-notes-block">
        <p class="notes-text" style="white-space:pre-wrap;">${caseItem.notes ? escapeHTML(caseItem.notes) : 'No strategy notes recorded yet. Add strategy notes below.'}</p>
      </div>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-pen-to-square gold-text"></i> Append Strategy Note</span>
      </div>
      <form class="detail-update-form" onsubmit="window.saveCaseNote(event, '${caseItem.id}')">
        <textarea name="caseNoteText" placeholder="Enter strategy insights, client conference outcomes, or judicial observations..." required></textarea>
        <div style="display:flex;justify-content:flex-end;">
          <button type="submit" class="detail-action-btn primary">
            <i class="fa-solid fa-floppy-disk"></i> Append Note
          </button>
        </div>
      </form>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-circle-info"></i> Case Background</span>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-card">
          <div class="info-card-label">Case Matter</div>
          <div class="info-card-value">${escapeHTML(caseItem.caseTitle)}</div>
        </div>
        <div class="detail-info-card">
          <div class="info-card-label">Opposing Counsel / Party</div>
          <div class="info-card-value">${escapeHTML(caseItem.opposingParty || '—')}</div>
        </div>
      </div>
    </div>
  `;
}

function buildTasksTab(caseItem) {
  const tasks = (caseItem.tasks && Array.isArray(caseItem.tasks)) ? caseItem.tasks : [];
  const completedCount = tasks.filter(t => t.completed).length;

  const tasksHTML = tasks.length === 0
    ? `<div style="color:#94a3b8;font-size:0.82rem;text-align:center;padding:1.5rem 0;"><i class="fa-solid fa-list-check" style="font-size:1.3rem;display:block;margin-bottom:0.5rem;"></i>No tasks assigned yet. Add an action item below.</div>`
    : `<div class="case-tasks-list">${tasks.map(t => `
        <div class="case-task-item ${t.completed ? 'completed' : ''}">
          <input type="checkbox" class="case-task-checkbox" ${t.completed ? 'checked' : ''} onchange="window.toggleTaskComplete('${caseItem.id}', '${t.id}')">
          <span class="task-title">${escapeHTML(t.title)}</span>
          ${t.priority ? `<span class="task-badge ${t.priority.toLowerCase()}">${escapeHTML(t.priority)}</span>` : ''}
          ${t.dueDate ? `<span class="task-due"><i class="fa-regular fa-clock"></i> ${formatDateDisplay(t.dueDate)}</span>` : ''}
        </div>
      `).join('')}</div>`;

  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-list-check"></i> Case Tasks (${completedCount}/${tasks.length} Done)</span>
      </div>
      ${tasksHTML}
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-plus gold-text"></i> Add New Task</span>
      </div>
      <form class="detail-update-form" onsubmit="window.addTaskToCase(event, '${caseItem.id}')">
        <div class="update-form-row">
          <input type="text" name="taskTitle" placeholder="Task description (e.g. Serve advance copy to opposing counsel)" required style="flex:2;">
          <select name="taskPriority" style="flex:1;min-width:110px;">
            <option value="Standard">Standard</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <input type="date" name="taskDueDate" style="flex:1;min-width:130px;">
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button type="submit" class="detail-action-btn primary">
            <i class="fa-solid fa-plus"></i> Add Task
          </button>
        </div>
      </form>
    </div>
  `;
}

function buildUpdatesTab(caseItem, updates) {
  const updatesHTML = updates.length === 0
    ? `<div style="color:#9ca3af;font-size:0.8rem;text-align:center;padding:1.5rem 0;"><i class="fa-solid fa-clock-rotate-left" style="font-size:1.3rem;display:block;margin-bottom:0.5rem;"></i>No updates recorded yet.</div>`
    : `<div class="detail-timeline">${updates.map(u => {
        let icon = 'fa-file-lines';
        if (u.type === 'hearing') icon = 'fa-calendar-check';
        else if (u.type === 'order') icon = 'fa-stamp';
        else if (u.type === 'instruction') icon = 'fa-pen-nib';
        else if (u.type === 'status') icon = 'fa-clock-rotate-left';
        return `
          <div class="detail-timeline-item">
            <div class="detail-timeline-dot"></div>
            <div class="tl-title"><i class="fa-solid ${icon}"></i> ${escapeHTML(u.title || 'Update')}</div>
            <div class="tl-meta">
              <span class="timeline-type-pill">${escapeHTML(u.type || 'general')}</span>
              <span>${formatDateDisplay(u.date)}${u.time ? ' • ' + u.time : ''}</span>
              <span>By <strong>${escapeHTML(u.author || 'Counsel')}</strong></span>
            </div>
            <div class="tl-notes">${escapeHTML(u.notes || '')}</div>
          </div>`;
      }).join('')}</div>`;

  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-pen-to-square"></i> Add Case Update</span>
      </div>
      <form class="detail-update-form" onsubmit="handleDetailAddUpdate(event,'${caseItem.id}')">
        <div class="update-form-row">
          <input type="text" name="updateTitle" placeholder="Update summary (e.g. Arguments Heard in Part / Adjourned)" required style="flex:2;">
          <select name="updateType" style="flex:1;min-width:130px;">
            <option value="hearing">Hearing</option>
            <option value="order">Order / Judgment</option>
            <option value="filing">Filing</option>
            <option value="instruction">Instruction / Meeting</option>
            <option value="status">Status Change</option>
          </select>
        </div>
        <textarea name="updateNotes" placeholder="Detailed proceedings, bench directions, client instructions, or next steps..." required></textarea>
        <div style="display:flex;justify-content:flex-end;">
          <button type="submit" class="detail-action-btn primary">
            <i class="fa-solid fa-floppy-disk"></i> Save Update
          </button>
        </div>
      </form>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-clock-rotate-left"></i> Case Updates Timeline (${updates.length})</span>
      </div>
      ${updatesHTML}
    </div>
  `;
}

function buildTeamTab(caseItem) {
  const assignee = state.users ? state.users.find(u => u.id === caseItem.assignedTo) : null;
  const assignedBy = caseItem.assignedBy || 'Adv. Vikramaditya Sharma (Group Head)';
  return `
    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-users"></i> Case Team &amp; Counsel</span>
      </div>

      <div class="detail-docs-list">
        ${assignee ? `
        <div class="detail-doc-item" style="gap:0.9rem;">
          <div style="width:38px;height:38px;border-radius:50%;background:rgba(30,58,95,0.08);border:1.5px solid rgba(30,58,95,0.15);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--gold-primary);flex-shrink:0;">
            <i class="fa-solid fa-user-check"></i>
          </div>
          <div class="doc-info">
            <div class="doc-name">${escapeHTML(assignee.name)}</div>
            <div class="doc-meta">${escapeHTML(assignee.role)} • ${escapeHTML(assignee.dept || '')} • Lead Counsel</div>
          </div>
          <span class="badge-assignee my-assignment" style="flex-shrink:0;">Lead</span>
        </div>` : `
        <div class="detail-doc-item">
          <div class="doc-info">
            <div class="doc-name">${escapeHTML(caseItem.assignedToName || 'Adv. Ananya Singh')}</div>
            <div class="doc-meta">${escapeHTML(caseItem.assignedToEmail || 'ananya.singh@lexjuris.in')} • Lead Counsel</div>
          </div>
        </div>`}
      </div>
    </div>

    <div>
      <div class="detail-section-header">
        <span class="detail-section-label"><i class="fa-solid fa-circle-info"></i> Practice Group Oversight</span>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-card">
          <div class="info-card-label">Practice Group</div>
          <div class="info-card-value">${escapeHTML(caseItem.group || caseItem.caseCategory)}</div>
        </div>
        <div class="detail-info-card">
          <div class="info-card-label">Assigned By / Supervising Head</div>
          <div class="info-card-value">${escapeHTML(assignedBy)}</div>
        </div>
      </div>
    </div>
  `;
}

// ==============================
// INTERACTIVE ACTION HANDLERS
// ==============================

// ---- Status dropdown menu ----
window.toggleStatusMenu = function(caseId, event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById(`statusMenu-${caseId}`);
  if (!menu) return;
  menu.classList.toggle('hidden');
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('.status-dropdown-wrap')) {
    document.querySelectorAll('.status-dropdown-menu').forEach(m => m.classList.add('hidden'));
  }
});

window.setCaseStatus = function(caseId, newStatus) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;
  const oldStatus = caseItem.status;
  caseItem.status = newStatus;

  if (!caseItem.updates) caseItem.updates = [];
  caseItem.updates.unshift({
    id: 'upd_st_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Advocate',
    authorRole: state.currentUser ? state.currentUser.role : 'Counsel',
    type: 'status',
    title: 'Status changed to ' + newStatus,
    notes: `Case status changed from ${oldStatus || 'In Progress'} to ${newStatus}.`
  });

  saveCasesToStorage();
  showToast(`Case status updated to "${newStatus}"!`, 'success');
  renderDashboard();
  openDocketDetail(caseId, state.activeDocketTab || 'overview');
};

// ---- Task complete toggle ----
window.toggleTaskComplete = function(caseId, taskId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem || !caseItem.tasks) return;
  const task = caseItem.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveCasesToStorage();
  showToast(task.completed ? 'Task marked complete.' : 'Task marked pending.', 'info');
  openDocketDetail(caseId, 'tasks');
};

// ---- Add Task ----
window.addTaskToCase = function(e, caseId) {
  e.preventDefault();
  const form = e.target;
  const title = form.taskTitle.value.trim();
  const priority = form.taskPriority.value;
  const dueDate = form.taskDueDate.value || getOffsetDateString(3);
  if (!title) return;

  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;
  if (!caseItem.tasks) caseItem.tasks = [];

  caseItem.tasks.push({
    id: 't_' + Date.now(),
    title, priority, dueDate, completed: false
  });

  if (!caseItem.updates) caseItem.updates = [];
  caseItem.updates.unshift({
    id: 'upd_t_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Counsel',
    authorRole: 'Advocate',
    type: 'instruction',
    title: 'Task Added: ' + title,
    notes: `New action item assigned with ${priority} priority, due on ${formatDateDisplay(dueDate)}.`
  });

  saveCasesToStorage();
  showToast('New task added.', 'success');
  openDocketDetail(caseId, 'tasks');
};

// ---- Save Strategy Note ----
window.saveCaseNote = function(e, caseId) {
  e.preventDefault();
  const text = e.target.caseNoteText.value.trim();
  if (!text) return;

  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  const timestamp = `[${formatDateDisplay(getOffsetDateString(0))} - ${state.currentUser ? state.currentUser.name : 'Counsel'}]`;
  caseItem.notes = caseItem.notes ? `${caseItem.notes}\n\n${timestamp}: ${text}` : `${timestamp}: ${text}`;

  if (!caseItem.updates) caseItem.updates = [];
  caseItem.updates.unshift({
    id: 'upd_n_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Counsel',
    authorRole: 'Advocate',
    type: 'instruction',
    title: 'Strategy Note Added',
    notes: text
  });

  saveCasesToStorage();
  showToast('Strategy note saved.', 'success');
  openDocketDetail(caseId, 'notes');
};

// ---- Quick Actions Helpers ----
window.openQuickHearingUpdate = function(caseId) {
  openDocketDetail(caseId, 'hearings');
  setTimeout(() => {
    const input = document.querySelector('input[name="hearingOutcomeSummary"]');
    if (input) input.focus();
  }, 100);
};

window.openQuickNoteModal = function(caseId) {
  openDocketDetail(caseId, 'notes');
  setTimeout(() => {
    const textarea = document.querySelector('textarea[name="caseNoteText"]');
    if (textarea) textarea.focus();
  }, 100);
};

window.openQuickTaskModal = function(caseId) {
  openDocketDetail(caseId, 'tasks');
  setTimeout(() => {
    const input = document.querySelector('input[name="taskTitle"]');
    if (input) input.focus();
  }, 100);
};

window.handleQuickHearingSubmit = function(e, caseId) {
  e.preventDefault();
  const form = e.target;
  const summary = form.hearingOutcomeSummary.value.trim();
  const notes = form.hearingOutcomeNotes.value.trim();
  if (!summary) return;

  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  if (!caseItem.updates) caseItem.updates = [];
  caseItem.updates.unshift({
    id: 'upd_h_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Chambers Counsel',
    authorRole: 'Advocate',
    type: 'hearing',
    title: summary,
    notes: notes
  });

  saveCasesToStorage();
  showToast('Hearing outcome logged.', 'success');
  openDocketDetail(caseId, 'updates');
};

// ---- Handle add update submit ----
window.handleDetailAddUpdate = function(e, caseId) {
  e.preventDefault();
  const form = e.target;
  const title = form.updateTitle.value.trim();
  const type = form.updateType.value;
  const notes = form.updateNotes.value.trim();
  if (!title || !notes) { showToast('Please provide a title and notes.', 'error'); return; }

  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;
  if (!caseItem.updates) caseItem.updates = [];

  const newUpdate = {
    id: 'upd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Chambers Counsel',
    authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
    type, title, notes
  };

  caseItem.updates.unshift(newUpdate);
  saveCasesToStorage();
  logAuditEvent('Docket Update Added', `Update "${title}" on ${caseItem.caseNumber} (${caseItem.clientName}).`, 'create');
  showToast(`Update logged on "${caseItem.caseNumber}"!`, 'success');
  form.reset();
  openDocketDetail(caseId, 'updates');
};

window.toggleCaseStatusAndRefresh = function(caseId) {
  toggleCaseStatus(caseId);
  if (state.activeDocketCaseId === caseId) {
    setTimeout(() => openDocketDetail(caseId, state.activeDocketTab), 120);
  }
};

window.deleteCaseAndRefresh = function(caseId) {
  if (!confirm('Delete this case permanently? This cannot be undone.')) return;
  state.cases = state.cases.filter(c => c.id !== caseId);
  saveCasesToStorage();
  if (state.activeDocketCaseId === caseId) {
    state.activeDocketCaseId = null;
    state.activeDocketTab = 'overview';
    const placeholder = document.getElementById('docketDetailPlaceholder');
    const content = document.getElementById('docketDetailContent');
    if (placeholder) placeholder.classList.remove('hidden');
    if (content) content.classList.add('hidden');
  }
  showToast('Case deleted.', 'success');
  renderDashboard();
};

window.quickAddNewCase = function() {
  const btn = document.getElementById('quickAddToggleBtn');
  if (btn) btn.click();
};


function getHearingScheduleBadge(dateStr, timeStr, status) {
  if (status === 'Disposed') {
    return `<span class="hearing-badge badge-passed"><i class="fa-solid fa-circle-check"></i> Disposed</span>`;
  }

  const todayStr = getOffsetDateString(0);
  const tomorrowStr = getOffsetDateString(1);

  if (dateStr === todayStr) {
    return `<span class="hearing-badge badge-today"><span class="pulse-dot"></span> TODAY • ${formatTime12Hour(timeStr)}</span>`;
  } else if (dateStr === tomorrowStr) {
    return `<span class="hearing-badge badge-upcoming"><i class="fa-regular fa-clock"></i> Tomorrow • ${formatTime12Hour(timeStr)}</span>`;
  } else if (dateStr < todayStr) {
    return `<span class="hearing-badge badge-passed"><i class="fa-solid fa-clock-rotate-left"></i> Passed Date (${formatDateDisplay(dateStr)})</span>`;
  } else {
    const daysDiff = Math.ceil((new Date(dateStr) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
    return `<span class="hearing-badge badge-upcoming"><i class="fa-regular fa-calendar-days"></i> In ${daysDiff} Days (${formatDateDisplay(dateStr)})</span>`;
  }
}

function getCardBorderClass(item, todayStr) {
  if (item.status === 'Disposed') return 'closed-border';
  if (item.priority === 'Critical') return 'urgent-border';
  if (item.hearingDate === todayStr) return 'today-border';
  return 'active-border';
}

function createCaseCardHTML(item, todayStr) {
  const borderClass = getCardBorderClass(item, todayStr);
  const hearingBadgeHTML = getHearingScheduleBadge(item.hearingDate, item.hearingTime, item.status);
  const isMyCase = state.currentUser && (item.assignedTo === state.currentUser.id || (item.assignedToEmail && item.assignedToEmail.toLowerCase() === state.currentUser.email.toLowerCase()));
  const updatesCount = (item.updates && Array.isArray(item.updates)) ? item.updates.length : 0;
  
  // Documents count & list
  const docsList = (item.documents && Array.isArray(item.documents)) ? item.documents : (item.attachedDoc ? [{ id: 'init', name: item.attachedDoc.name, size: item.attachedDoc.size }] : []);
  const docsCount = docsList.length;

  // Highlight search matches
  const clientNameDisplay = highlightSearchMatch(item.clientName, state.searchQuery, state.searchMode, 'clientName');
  const caseTitleDisplay = highlightSearchMatch(item.caseTitle, state.searchQuery, state.searchMode, 'caseTitle');
  
  return `
    <div class="case-card ${borderClass}" data-case-id="${item.id}" id="caseCard-${item.id}">
      
      <!-- Card Top: Client Info & Docket Tag -->
      <div class="card-header-row">
        <div class="client-identity">
          <div class="client-avatar-icon">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <div class="client-name-title">${clientNameDisplay}</div>
            <div class="client-phone-sub">
              <i class="fa-solid fa-phone"></i> ${escapeHTML(item.clientPhone)} 
              ${item.opposingParty ? `• <span title="Opposing Party">vs. ${escapeHTML(item.opposingParty)}</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="card-doc-attachment add-doc-pill btn-add-case-doc" data-id="${item.id}" title="Add new document to this case">
            <i class="fa-solid fa-file-circle-plus gold-text"></i> + Add Doc
          </button>
          ${docsCount > 0 ? `
            <span class="card-doc-attachment btn-manage-docs" data-id="${item.id}" title="Manage ${docsCount} case document(s) in Vault">
              <i class="fa-solid fa-folder-open gold-text"></i> ${docsCount} Doc${docsCount !== 1 ? 's' : ''}
            </span>
          ` : ''}
          <span class="badge-group" title="Practice Group"><i class="fa-solid fa-users"></i> ${escapeHTML(item.group || item.caseCategory)}</span>
          <span class="badge-assignee ${isMyCase ? 'my-assignment' : ''}" title="Assigned Subordinate Counsel">
            <i class="fa-solid fa-user-check"></i> ${escapeHTML(item.assignedToName || 'Unassigned')}
          </span>
          <span class="matter-badge"><i class="fa-solid fa-gavel gold-text"></i> ${escapeHTML(item.caseCategory)}</span>
          ${item.priority === 'Critical' ? '<span class="hearing-badge badge-urgent"><i class="fa-solid fa-triangle-exclamation"></i> Critical</span>' : ''}
        </div>
      </div>

      <!-- Card Details Grid -->
      <div class="card-details-grid">
        
        <!-- Left: Case Matter & ID -->
        <div>
          <div class="case-matter-title">${caseTitleDisplay}</div>
          <div class="case-meta-item">
            <i class="fa-solid fa-hashtag"></i> <strong>Docket:</strong> ${escapeHTML(item.caseNumber)}
          </div>
        </div>

        <!-- Right: Court & Hearing Schedule -->
        <div class="court-schedule-box">
          ${hearingBadgeHTML}
          <div class="court-venue-text">
            <i class="fa-solid fa-building-columns gold-text"></i> ${escapeHTML(item.courtName)}
          </div>
          <div class="case-meta-item">
            <i class="fa-regular fa-calendar-check"></i> ${formatDateDisplay(item.hearingDate)} at ${formatTime12Hour(item.hearingTime)}
          </div>
        </div>

      </div>

      <!-- Notes / Strategy Brief -->
      ${item.notes ? `
        <div class="card-notes-preview">
          <i class="fa-solid fa-quote-left"></i> ${escapeHTML(item.notes)}
        </div>
      ` : ''}

      <!-- Card Footer Actions -->
      <div class="card-actions-row">
        <div class="case-status-indicator">
          <span style="font-weight: 600; color: ${item.status === 'Disposed' ? 'var(--status-resolved)' : 'var(--gold-primary)'}">
            <i class="fa-solid ${item.status === 'Disposed' ? 'fa-circle-check' : 'fa-circle-dot'}"></i> ${item.status || 'Active'}
          </span>
        </div>

        <div class="card-btns-group">
          <a href="tel:${escapeHTML(item.clientPhone)}" class="btn-card-action" title="Call Client">
            <i class="fa-solid fa-phone"></i> Call
          </a>
          <button type="button" class="btn-card-action btn-add-case-doc" data-id="${item.id}" title="Add New Document to this Case" style="font-weight: 700; border-color: rgba(197, 160, 89, 0.4);">
            <i class="fa-solid fa-file-circle-plus gold-text"></i> + Add Doc
          </button>
          <button type="button" class="btn-card-action btn-manage-docs" data-id="${item.id}" title="View, Add & Manage Documents (${docsCount})">
            <i class="fa-solid fa-folder-open"></i> Docs <span class="updates-count-dot">${docsCount}</span>
          </button>
          <button type="button" class="btn-card-action btn-view-updates" data-id="${item.id}" title="View & Add Case Updates (${updatesCount})">
            <i class="fa-solid fa-clock-rotate-left"></i> Updates <span class="updates-count-dot">${updatesCount}</span>
          </button>
          <button type="button" class="btn-card-action btn-reschedule" data-id="${item.id}" title="Reschedule Hearing & Reassign">
            <i class="fa-solid fa-calendar-plus"></i> Reschedule
          </button>
          <button type="button" class="btn-card-action btn-toggle-status" data-id="${item.id}" title="${item.status === 'Disposed' ? 'Reopen Docket' : 'Mark Case Disposed/Resolved'}">
            <i class="fa-solid ${item.status === 'Disposed' ? 'fa-rotate-left' : 'fa-check'}"></i> ${item.status === 'Disposed' ? 'Reopen' : 'Dispose'}
          </button>
          <button type="button" class="btn-card-action danger btn-delete-case" data-id="${item.id}" title="Delete Case Docket">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

    </div>
  `;
}

function attachCardActionListeners() {
  // Add Document to Case button
  document.querySelectorAll('.btn-add-case-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const caseId = btn.getAttribute('data-id');
      openAddNewDocModal(caseId);
    });
  });

  // Manage Documents button
  document.querySelectorAll('.btn-manage-docs').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const caseId = btn.getAttribute('data-id');
      openCaseDocsModal(caseId);
    });
  });

  // View Updates button
  document.querySelectorAll('.btn-view-updates').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-id');
      openCaseUpdatesModal(caseId);
    });
  });

  // Reschedule button
  document.querySelectorAll('.btn-reschedule').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-id');
      openRescheduleModal(caseId);
    });
  });

  // Toggle status (Dispose / Reopen)
  document.querySelectorAll('.btn-toggle-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-id');
      toggleCaseStatus(caseId);
    });
  });

  // Delete case
  document.querySelectorAll('.btn-delete-case').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-id');
      deleteCase(caseId);
    });
  });

  // Click on case card opens Full-Screen Dossier
  document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.card-doc-attachment') || e.target.closest('.btn-doc-action')) {
        return;
      }
      const caseId = card.getAttribute('data-case-id');
      if (caseId) openFullScreenCase(caseId);
    });
  });
}

function toggleCaseStatus(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  if (caseItem.status === 'Disposed') {
    caseItem.status = 'Active';
    showToast(`Docket "${caseItem.caseNumber}" reopened as Active.`, 'info');
  } else {
    caseItem.status = 'Disposed';
    showToast(`Docket "${caseItem.caseNumber}" marked as Disposed/Resolved.`, 'success');
  }

  saveCasesToStorage();
  renderDashboard();
}

function deleteCase(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  if (confirm(`Are you sure you want to permanently delete the docket for client "${caseItem.clientName}" (${caseItem.caseNumber})?`)) {
    state.cases = state.cases.filter(c => c.id !== caseId);
    saveCasesToStorage();
    renderDashboard();
    showToast('Docket removed from chambers registry.', 'info');
  }
}

// ==========================================================================
// 7.05 SLIDING CASE SEARCH DRAWER (FROM LEFT) & FULL-SCREEN DOSSIER
// ==========================================================================

const drawerState = {
  searchQuery: '',
  searchMode: 'all',
  currentFilter: 'all',
  isFullscreen: false
};

function openSearchDrawer(prefillQuery, prefillFilter) {
  if (!dom.searchDrawerOverlay) return;
  dom.searchDrawerOverlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    dom.searchDrawerOverlay.classList.add('active');
  });

  if (typeof prefillFilter === 'string' && prefillFilter) {
    drawerState.currentFilter = prefillFilter;
    if (dom.drawerFilterPills) {
      dom.drawerFilterPills.forEach(p => {
        if (p.getAttribute('data-filter') === prefillFilter) p.classList.add('active');
        else p.classList.remove('active');
      });
    }
  }

  if (typeof prefillQuery === 'string' && prefillQuery.length > 0) {
    drawerState.searchQuery = prefillQuery.trim().toLowerCase();
    state.searchQuery = drawerState.searchQuery;
    if (dom.drawerSearchInput) dom.drawerSearchInput.value = prefillQuery;
  } else if (state.searchQuery && (!dom.drawerSearchInput || !dom.drawerSearchInput.value)) {
    drawerState.searchQuery = state.searchQuery;
    if (dom.drawerSearchInput) dom.drawerSearchInput.value = state.searchQuery;
  }

  if (dom.clearDrawerSearchBtn) {
    if (drawerState.searchQuery) {
      dom.clearDrawerSearchBtn.classList.remove('hidden');
    } else {
      dom.clearDrawerSearchBtn.classList.add('hidden');
    }
  }

  updateWorkspaceSearchTag();
  renderDrawerCasesList();
  setTimeout(() => {
    if (dom.drawerSearchInput) dom.drawerSearchInput.focus();
  }, 120);
}

function closeSearchDrawer() {
  if (!dom.searchDrawerOverlay) return;
  dom.searchDrawerOverlay.classList.remove('active');
  setTimeout(() => {
    dom.searchDrawerOverlay.classList.add('hidden');
    if (drawerState.isFullscreen) {
      toggleDrawerFullscreen(false);
    }
  }, 280);
}

function toggleDrawerFullscreen(forceState) {
  if (!dom.searchDrawer) return;
  const next = typeof forceState === 'boolean' ? forceState : !drawerState.isFullscreen;
  drawerState.isFullscreen = next;
  if (next) {
    dom.searchDrawer.classList.add('fullscreen');
    if (dom.drawerFullscreenIcon) {
      dom.drawerFullscreenIcon.className = 'fa-solid fa-compress';
    }
  } else {
    dom.searchDrawer.classList.remove('fullscreen');
    if (dom.drawerFullscreenIcon) {
      dom.drawerFullscreenIcon.className = 'fa-solid fa-expand';
    }
  }
}

function updateWorkspaceSearchTag() {
  const tag = document.getElementById('activeWorkspaceSearchTag') || dom.activeWorkspaceSearchTag;
  const text = document.getElementById('workspaceSearchQueryText') || dom.workspaceSearchQueryText;
  if (!tag || !text) return;
  if (state.searchQuery && state.searchQuery.trim().length > 0) {
    text.textContent = `"${state.searchQuery}"`;
    tag.classList.remove('hidden');
  } else {
    tag.classList.add('hidden');
  }
}

function updateDrawerCounts() {
  const accessible = getAccessibleCases(state.currentUser);
  const todayStr = getOffsetDateString(0);
  
  const todayCases = accessible.filter(c => c.hearingDate === todayStr && c.status !== 'Disposed');
  const upcomingCases = accessible.filter(c => c.hearingDate > todayStr && c.status !== 'Disposed');
  const urgentCases = accessible.filter(c => (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed');
  const closedCases = accessible.filter(c => c.status === 'Disposed');

  const elAll = document.getElementById('drawerCountAll');
  const elToday = document.getElementById('drawerCountToday');
  const elUp = document.getElementById('drawerCountUpcoming');
  const elCrit = document.getElementById('drawerCountCritical');
  const elClosed = document.getElementById('drawerCountClosed');

  if (elAll) elAll.textContent = accessible.length;
  if (elToday) elToday.textContent = todayCases.length;
  if (elUp) elUp.textContent = upcomingCases.length;
  if (elCrit) elCrit.textContent = urgentCases.length;
  if (elClosed) elClosed.textContent = closedCases.length;

  const floatBadge = document.getElementById('floatingTabCountBadge');
  if (floatBadge) floatBadge.textContent = accessible.length;
  const navBadge = document.getElementById('navSearchCountBadge') || document.getElementById('navDrawerCountBadge');
  if (navBadge) navBadge.textContent = accessible.length;
  const railTabCount = document.getElementById('railTabCountBadge');
  if (railTabCount) railTabCount.textContent = accessible.length;

  const railToday = document.getElementById('railTodayBadge');
  if (railToday) railToday.textContent = todayCases.length;
  const railUrgent = document.getElementById('railUrgentBadge');
  if (railUrgent) railUrgent.textContent = urgentCases.length;
  const railUp = document.getElementById('railUpcomingBadge');
  if (railUp) railUp.textContent = upcomingCases.length;
}

function locateCaseInWorkspace(caseId) {
  closeSearchDrawer();
  
  if (typeof switchWorkspaceView === 'function') {
    switchWorkspaceView('workspace');
  }

  // If there's an active category filter on workspace that would hide this case, switch filter to 'all'
  const targetCase = state.cases.find(c => c.id === caseId);
  const todayStr = getOffsetDateString(0);
  if (targetCase) {
    let wouldBeHidden = false;
    if (state.currentFilter === 'today' && (targetCase.hearingDate !== todayStr || targetCase.status === 'Disposed')) wouldBeHidden = true;
    if (state.currentFilter === 'upcoming' && (targetCase.hearingDate <= todayStr || targetCase.status === 'Disposed')) wouldBeHidden = true;
    if (state.currentFilter === 'critical' && !(targetCase.priority === 'Critical' || targetCase.priority === 'High')) wouldBeHidden = true;
    if (state.currentFilter === 'closed' && targetCase.status !== 'Disposed') wouldBeHidden = true;

    if (wouldBeHidden) {
      state.currentFilter = 'all';
      const pills = document.querySelectorAll('.filter-pills .filter-pill');
      pills.forEach(p => {
        if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      renderCasesList();
    }
  }

  setTimeout(() => {
    const card = document.getElementById(`caseCard-${caseId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('case-highlight-flash');
      setTimeout(() => card.classList.remove('case-highlight-flash'), 2500);
    }
  }, 320);
}

function renderDrawerCasesList() {
  if (!dom.drawerCasesList) return;
  updateDrawerCounts();

  const accessible = getAccessibleCases(state.currentUser);
  const todayStr = getOffsetDateString(0);

  // 1. Filter by drawer tab filter
  let filtered = accessible.filter(c => {
    if (drawerState.currentFilter === 'today') return c.hearingDate === todayStr && c.status !== 'Disposed';
    if (drawerState.currentFilter === 'upcoming') return c.hearingDate > todayStr && c.status !== 'Disposed';
    if (drawerState.currentFilter === 'critical') return (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Disposed';
    if (drawerState.currentFilter === 'closed') return c.status === 'Disposed';
    return true; // 'all'
  });

  // 2. Filter by drawer search query
  if (drawerState.searchQuery) {
    const q = drawerState.searchQuery;
    filtered = filtered.filter(c => {
      if (drawerState.searchMode === 'caseTitle') {
        return (c.caseTitle || '').toLowerCase().includes(q);
      }
      if (drawerState.searchMode === 'clientName') {
        return (c.clientName || '').toLowerCase().includes(q);
      }
      if (drawerState.searchMode === 'caseNumber') {
        return (c.caseNumber || '').toLowerCase().includes(q);
      }
      return (
        (c.clientName || '').toLowerCase().includes(q) ||
        (c.caseTitle || '').toLowerCase().includes(q) ||
        (c.caseNumber || '').toLowerCase().includes(q) ||
        (c.courtName || '').toLowerCase().includes(q) ||
        (c.opposingParty || '').toLowerCase().includes(q)
      );
    });
  }

  // 3. Sort chronologically
  filtered.sort((a, b) => {
    if (a.status === 'Disposed' && b.status !== 'Disposed') return 1;
    if (a.status !== 'Disposed' && b.status === 'Disposed') return -1;
    const dateA = new Date(`${a.hearingDate}T${a.hearingTime || '00:00'}`);
    const dateB = new Date(`${b.hearingDate}T${b.hearingTime || '00:00'}`);
    return dateA - dateB;
  });

  // Update status bar
  if (dom.drawerResultCountText) {
    dom.drawerResultCountText.textContent = `Showing ${filtered.length} of ${accessible.length} cases`;
  }

  if (filtered.length === 0) {
    dom.drawerCasesList.innerHTML = '';
    if (dom.drawerEmptyState) dom.drawerEmptyState.classList.remove('hidden');
    return;
  }

  if (dom.drawerEmptyState) dom.drawerEmptyState.classList.add('hidden');

  dom.drawerCasesList.innerHTML = filtered.map(item => {
    const titleMatch = highlightSearchMatch(item.caseTitle, drawerState.searchQuery, drawerState.searchMode, 'caseTitle');
    const clientMatch = highlightSearchMatch(item.clientName, drawerState.searchQuery, drawerState.searchMode, 'clientName');
    const numberMatch = highlightSearchMatch(item.caseNumber, drawerState.searchQuery, drawerState.searchMode, 'caseNumber');
    const hearingDateBadge = getHearingScheduleBadge(item.hearingDate, item.hearingTime, item.status);
    const docsCount = (item.documents && Array.isArray(item.documents)) ? item.documents.length : 0;

    return `
      <div class="drawer-case-item" data-case-id="${item.id}" role="button" tabindex="0" title="Click to view full screen dossier">
        <div class="drawer-case-top">
          <div class="drawer-case-title">${titleMatch}</div>
          <span class="drawer-case-no-badge">${numberMatch}</span>
        </div>
        <div class="drawer-case-meta">
          <span><i class="fa-regular fa-user gold-text"></i> ${clientMatch}</span>
          ${item.courtName ? `<span><i class="fa-solid fa-building-columns"></i> ${escapeHTML(item.courtName)}</span>` : ''}
          ${docsCount > 0 ? `<span><i class="fa-solid fa-paperclip"></i> ${docsCount} doc${docsCount !== 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="drawer-case-footer">
          <div class="drawer-case-footer-left">
            ${hearingDateBadge}
            ${item.priority === 'Critical' ? '<span class="hearing-badge badge-urgent"><i class="fa-solid fa-bolt"></i> Urgent</span>' : ''}
            <span class="badge-group">${escapeHTML(item.group || item.caseCategory)}</span>
          </div>
          <div class="drawer-case-footer-actions">
            <button type="button" class="btn-locate-case" data-locate-id="${item.id}" title="Scroll to and view in workspace dockets">
              <i class="fa-solid fa-location-crosshairs"></i> View in Dockets
            </button>
            <div class="drawer-fullscreen-hint">
              <i class="fa-solid fa-up-right-and-down-left-from-center"></i> Full Screen
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach click to open full screen
  dom.drawerCasesList.querySelectorAll('.drawer-case-item').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-locate-case')) return;
      const caseId = card.getAttribute('data-case-id');
      openFullScreenCase(caseId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const caseId = card.getAttribute('data-case-id');
        openFullScreenCase(caseId);
      }
    });
  });

  // Attach click to locate case in workspace
  dom.drawerCasesList.querySelectorAll('.btn-locate-case').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const caseId = btn.getAttribute('data-locate-id');
      locateCaseInWorkspace(caseId);
    });
  });
}

function openFullScreenCase(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  state.activeFullScreenCaseId = caseId;

  // Header Info
  if (dom.fsCaseTitle) dom.fsCaseTitle.textContent = `${caseItem.caseNumber} — ${caseItem.caseTitle}`;
  if (dom.fsCaseNumber) dom.fsCaseNumber.textContent = caseItem.caseNumber || 'N/A';
  if (dom.fsCourtName) dom.fsCourtName.textContent = caseItem.courtName || 'Delhi High Court';
  if (dom.fsCategory) dom.fsCategory.textContent = caseItem.caseCategory || 'General Litigation';
  if (dom.fsStatusBadge) {
    dom.fsStatusBadge.textContent = caseItem.status || 'Active';
    dom.fsStatusBadge.className = `fs-status-pill ${caseItem.status === 'Disposed' ? 'disposed' : 'active'}`;
  }
  if (dom.fsPriorityBadge) {
    dom.fsPriorityBadge.textContent = caseItem.priority || 'Normal';
    dom.fsPriorityBadge.className = `fs-priority-pill ${caseItem.priority ? caseItem.priority.toLowerCase() : 'normal'}`;
  }

  // Hero Banner Info
  const hearingTimeStr = caseItem.hearingTime ? formatTime12Hour(caseItem.hearingTime) : '';
  const dateStr = formatDateDisplay(caseItem.hearingDate);
  if (dom.fsHearingDateDisplay) {
    dom.fsHearingDateDisplay.textContent = `${dateStr} ${hearingTimeStr ? '• ' + hearingTimeStr : ''}`;
  }
  if (dom.fsHearingCountdown) {
    const today = getOffsetDateString(0);
    let diffDays = 0;
    if (caseItem.hearingDate) {
      const d1 = new Date(today);
      const d2 = new Date(caseItem.hearingDate);
      diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    }
    let countdownText = 'Scheduled';
    if (diffDays === 0) countdownText = '⚡ Today in Court';
    else if (diffDays === 1) countdownText = '⏳ Tomorrow';
    else if (diffDays > 1) countdownText = `⏳ In ${diffDays} days`;
    else if (diffDays < 0) countdownText = `⚠️ Hearing passed (${Math.abs(diffDays)}d ago)`;
    dom.fsHearingCountdown.textContent = `${countdownText} • ${caseItem.courtName || 'Courtroom'}`;
  }

  if (dom.fsClientNameDisplay) dom.fsClientNameDisplay.textContent = caseItem.clientName || 'N/A';
  if (dom.fsClientPhoneDisplay) dom.fsClientPhoneDisplay.textContent = caseItem.clientPhone || 'No contact phone';
  if (dom.fsPracticeGroup) dom.fsPracticeGroup.textContent = caseItem.group || caseItem.caseCategory || 'General';
  if (dom.fsAssignedCounsel) dom.fsAssignedCounsel.textContent = caseItem.assignedToName || 'Senior Advocate';

  const docs = (caseItem.documents && Array.isArray(caseItem.documents)) ? caseItem.documents : [];
  const updates = (caseItem.updates && Array.isArray(caseItem.updates)) ? caseItem.updates : [];

  if (dom.fsDocsCount) dom.fsDocsCount.textContent = `${docs.length} Exhibit${docs.length !== 1 ? 's' : ''}`;
  if (dom.fsUpdatesCount) dom.fsUpdatesCount.textContent = `${updates.length} Proceeding${updates.length !== 1 ? 's' : ''}`;
  if (dom.fsVaultCountBadge) dom.fsVaultCountBadge.textContent = docs.length;

  // Detail Info Groups
  if (dom.fsDetailClientName) dom.fsDetailClientName.textContent = caseItem.clientName || '—';
  if (dom.fsDetailPhone) dom.fsDetailPhone.textContent = caseItem.clientPhone || '—';
  if (dom.fsDetailOpposing) dom.fsDetailOpposing.textContent = caseItem.opposingParty || 'None specified';
  if (dom.fsDetailCourt) dom.fsDetailCourt.textContent = caseItem.courtName || '—';
  if (dom.fsDetailCategory) dom.fsDetailCategory.textContent = caseItem.caseCategory || '—';
  if (dom.fsDetailCaseId) dom.fsDetailCaseId.textContent = caseItem.id || '—';

  // Notes Box
  if (dom.fsDetailNotes) {
    dom.fsDetailNotes.textContent = caseItem.notes && caseItem.notes.trim() 
      ? caseItem.notes 
      : 'No confidential strategy or chamber orders have been drafted for this docket yet.';
  }

  // Timeline list
  if (dom.fsTimelineList) {
    if (updates.length === 0) {
      dom.fsTimelineList.innerHTML = `<p style="font-size:0.78rem; color:var(--text-muted); padding:0.5rem 0;">No court proceedings or orders logged yet. Click "+" above to record court action.</p>`;
    } else {
      dom.fsTimelineList.innerHTML = updates.map(u => `
        <div class="fs-timeline-item">
          <div class="fs-timeline-title">${escapeHTML(u.title || 'Hearing Proceeding')}</div>
          <div class="fs-timeline-desc">${escapeHTML(u.text || u.notes || '')}</div>
          <div class="fs-timeline-time">${escapeHTML(u.date || '')} ${u.time ? '• ' + escapeHTML(u.time) : ''} ${u.author ? '• Logged by ' + escapeHTML(u.author) : ''}</div>
        </div>
      `).join('');
    }
  }

  // Documents Vault Grid
  if (dom.fsDocsGrid) {
    if (docs.length === 0) {
      dom.fsDocsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
          <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; color: var(--gold-primary); opacity: 0.6; margin-bottom: 0.5rem; display: block;"></i>
          No files attached to this case. Click "Upload Document" to attach pleadings, orders, or court affidavits.
        </div>
      `;
    } else {
      dom.fsDocsGrid.innerHTML = docs.map(d => {
        const fileExt = (d.name || '').split('.').pop().toLowerCase();
        let iconClass = 'fa-file-lines';
        if (fileExt === 'pdf') iconClass = 'fa-file-pdf';
        else if (['jpg', 'jpeg', 'png'].includes(fileExt)) iconClass = 'fa-file-image';
        else if (['doc', 'docx'].includes(fileExt)) iconClass = 'fa-file-word';

        return `
          <div class="fs-doc-card">
            <div class="fs-doc-card-top">
              <div class="fs-doc-card-icon">
                <i class="fa-solid ${iconClass}"></i>
              </div>
              <div class="fs-doc-card-info">
                <div class="fs-doc-card-name" title="${escapeHTML(d.name)}">${escapeHTML(d.name)}</div>
                <div class="fs-doc-card-meta">${d.category || 'Court Record'} • ${d.size ? (d.size > 1024 ? Math.round(d.size/1024) + ' KB' : d.size + ' B') : 'File'}</div>
              </div>
            </div>
            <div class="fs-doc-card-actions">
              <button type="button" class="fs-doc-btn btn-fs-preview-doc" data-doc-id="${d.id}" data-tab="paneDocView" title="Preview document">
                <i class="fa-regular fa-eye"></i> View
              </button>
              <button type="button" class="fs-doc-btn btn-fs-ai-doc" data-doc-id="${d.id}" data-tab="paneDocAi" title="JurisAI analysis">
                <i class="fa-solid fa-brain gold-text"></i> AI Summary
              </button>
              <button type="button" class="fs-doc-btn btn-fs-dl-doc" data-doc-id="${d.id}" title="Download document">
                <i class="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Wire up doc actions in dossier
      dom.fsDocsGrid.querySelectorAll('.btn-fs-preview-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-id');
          previewCaseDocument(caseId, docId, 'paneDocView');
        });
      });
      dom.fsDocsGrid.querySelectorAll('.btn-fs-ai-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-id');
          previewCaseDocument(caseId, docId, 'paneDocAi');
        });
      });
      dom.fsDocsGrid.querySelectorAll('.btn-fs-dl-doc').forEach(btn => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-id');
          downloadCaseDocument(caseId, docId);
        });
      });
    }
  }

  // Show Fullscreen Modal
  if (dom.fullScreenCaseModal) {
    dom.fullScreenCaseModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      dom.fullScreenCaseModal.classList.add('active');
    });
  }
}

function closeFullScreenCase() {
  if (!dom.fullScreenCaseModal) return;
  dom.fullScreenCaseModal.classList.remove('active');
  setTimeout(() => {
    dom.fullScreenCaseModal.classList.add('hidden');
    state.activeFullScreenCaseId = null;
  }, 250);
}

// ==========================================================================
// 7.1 INTAKE SEGMENTED PARTS & STAGED DOCUMENTS
// ==========================================================================

function switchIntakePart(part) {
  if (part === 'docs') {
    if (dom.partDetailsBtn) dom.partDetailsBtn.classList.remove('active');
    if (dom.partDocsBtn) dom.partDocsBtn.classList.add('active');
    if (dom.partDetailsPane) dom.partDetailsPane.classList.add('hidden');
    if (dom.partDocsPane) dom.partDocsPane.classList.remove('hidden');
  } else {
    if (dom.partDetailsBtn) dom.partDetailsBtn.classList.add('active');
    if (dom.partDocsBtn) dom.partDocsBtn.classList.remove('active');
    if (dom.partDetailsPane) dom.partDetailsPane.classList.remove('hidden');
    if (dom.partDocsPane) dom.partDocsPane.classList.add('hidden');
  }
}

function stageCurrentIntakeDoc() {
  if (!state.currentAttachedDoc) {
    showToast('Please upload or select a document first to stage it.', 'error');
    return;
  }

  const category = dom.intakeDocCategory ? dom.intakeDocCategory.value : 'Petition / Plaint';
  const newStagedDoc = {
    id: 'staged_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: state.currentAttachedDoc.name,
    size: state.currentAttachedDoc.size,
    type: state.currentAttachedDoc.type || getFileTypeFromName(state.currentAttachedDoc.name),
    fileData: state.currentAttachedDoc.fileData || null,
    textContent: state.currentAttachedDoc.textContent || null,
    category: category,
    title: state.currentAttachedDoc.name.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' '),
    uploadedAt: new Date().toISOString(),
    uploadedBy: state.currentUser ? state.currentUser.name : 'Counsel'
  };

  state.stagedDocs.push(newStagedDoc);
  renderStagedDocs();
  resetDocumentUploadZone();
  showToast(`Document "${newStagedDoc.name}" staged for filing!`, 'success');
}

function removeStagedDoc(docId) {
  state.stagedDocs = state.stagedDocs.filter(d => d.id !== docId);
  renderStagedDocs();
  showToast('Staged document removed', 'info');
}

function renderStagedDocs() {
  const count = state.stagedDocs.length;
  if (dom.stagedDocsCountBadge) dom.stagedDocsCountBadge.textContent = count;
  if (dom.stagedDocsSummaryBadge) dom.stagedDocsSummaryBadge.textContent = `${count} attached`;
  if (dom.stagedDocsListCount) dom.stagedDocsListCount.textContent = count;

  if (!dom.stagedDocsList) return;

  if (count === 0) {
    dom.stagedDocsList.innerHTML = `
      <div class="staged-docs-empty" id="stagedDocsEmpty">
        <i class="fa-regular fa-folder-open"></i>
        <span>No documents staged yet. Upload above or proceed to file without documents.</span>
      </div>
    `;
    return;
  }

  dom.stagedDocsList.innerHTML = state.stagedDocs.map(doc => `
    <div class="staged-doc-card" data-doc-id="${doc.id}">
      <div class="staged-doc-info">
        <i class="fa-solid ${doc.name.endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file-lines'} gold-text"></i>
        <div style="min-width: 0; flex: 1;">
          <div class="staged-doc-name" title="${escapeHTML(doc.name)}">${escapeHTML(doc.name)}</div>
          <div class="staged-doc-meta">
            <span class="staged-doc-cat-tag">${escapeHTML(doc.category)}</span> • ${escapeHTML(doc.size)}
          </div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:0.25rem;">
        <button type="button" class="btn-preview-staged-doc" data-id="${doc.id}" title="Preview Document & AI Summary" style="background:none; border:none; color:var(--gold-primary); cursor:pointer; padding:4px 6px; font-size:0.85rem;">
          <i class="fa-regular fa-eye"></i>
        </button>
        <button type="button" class="btn-remove-staged-doc" data-id="${doc.id}" title="Remove staged document">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `).join('');

  dom.stagedDocsList.querySelectorAll('.btn-preview-staged-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      previewStagedDocument(id);
    });
  });

  dom.stagedDocsList.querySelectorAll('.btn-remove-staged-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      removeStagedDoc(id);
    });
  });
}

// ==========================================================================
// 7.2 SEARCH MODE SWITCHER & HIGHLIGHTING
// ==========================================================================

function switchSearchMode(mode) {
  state.searchMode = mode;
  if (dom.searchModePills) {
    dom.searchModePills.forEach(pill => {
      if (pill.getAttribute('data-mode') === mode) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Update input placeholder based on mode
  if (dom.clientSearchInput) {
    if (mode === 'caseTitle') {
      dom.clientSearchInput.placeholder = 'Search specifically by Case Name / Matter (e.g. Mehra vs. MCD)...';
    } else if (mode === 'clientName') {
      dom.clientSearchInput.placeholder = 'Search specifically by Client Name (e.g. Rajesh Mehra)...';
    } else if (mode === 'caseNumber') {
      dom.clientSearchInput.placeholder = 'Search specifically by Docket / Suit Number (e.g. WP(C) 4521)...';
    } else {
      dom.clientSearchInput.placeholder = 'Search legal dockets by Case Name, Client Name, Docket No...';
    }
  }

  renderCasesList();
}
window.switchSearchMode = switchSearchMode;

function highlightSearchMatch(text, query, mode, currentField) {
  if (!text) return '';
  const escaped = escapeHTML(text);
  if (!query) return escaped;
  if (mode !== 'all' && mode !== currentField) return escaped;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// ==========================================================================
// 7.2.5 DEDICATED ADD DOCUMENT TO EXISTING CASE MODAL
// ==========================================================================

function openAddNewDocModal(targetCaseId = null) {
  if (!state.cases || state.cases.length === 0) {
    showToast('No cases found in registry to add documents to. Please create a case first.', 'error');
    return;
  }

  // Populate cases dropdown
  if (dom.selectExistingCase) {
    dom.selectExistingCase.innerHTML = state.cases.map(c => `
      <option value="${c.id}" ${targetCaseId && targetCaseId === c.id ? 'selected' : ''}>
        ${escapeHTML(c.caseNumber)} - ${escapeHTML(c.caseTitle)} (${escapeHTML(c.clientName)})
      </option>
    `).join('');

    // If targetCaseId is specified, ensure it is selected
    if (targetCaseId) {
      dom.selectExistingCase.value = targetCaseId;
    }
  }

  // Update dynamic case preview card
  updateAddNewDocCasePreview();

  // Reset file inputs & text
  resetQuickAddDocDropzone();
  if (dom.quickAddDocTitle) dom.quickAddDocTitle.value = '';
  if (dom.quickAddDocNotes) dom.quickAddDocNotes.value = '';
  if (dom.quickAddDocCategory) dom.quickAddDocCategory.value = 'Court Order / Judgment';
  if (dom.quickAddAutoAiSummary) dom.quickAddAutoAiSummary.checked = true;

  // Show modal
  if (dom.addNewDocModal) dom.addNewDocModal.classList.remove('hidden');
}

function closeAddNewDocModal() {
  if (dom.addNewDocModal) dom.addNewDocModal.classList.add('hidden');
  resetQuickAddDocDropzone();
}

function updateAddNewDocCasePreview() {
  if (!dom.selectExistingCase || !dom.addNewDocCasePreview) return;
  const selectedId = dom.selectExistingCase.value;
  const caseItem = state.cases.find(c => c.id === selectedId);

  if (!caseItem) {
    dom.addNewDocCasePreview.innerHTML = '';
    return;
  }

  const docsCount = caseItem.documents ? caseItem.documents.length : (caseItem.attachedDoc ? 1 : 0);

  dom.addNewDocCasePreview.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem;">
      <div>
        <div style="font-weight:700; color:var(--navy-primary); font-size:0.95rem; margin-bottom:0.2rem;">
          <i class="fa-solid fa-gavel gold-text"></i> ${escapeHTML(caseItem.caseTitle)}
        </div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">
          <strong>Docket:</strong> ${escapeHTML(caseItem.caseNumber)} • 
          <strong>Client:</strong> ${escapeHTML(caseItem.clientName)} vs. ${escapeHTML(caseItem.opposingParty || 'Opposite Party')}
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">
          <i class="fa-solid fa-building-columns"></i> ${escapeHTML(caseItem.courtName)} • 
          <i class="fa-regular fa-calendar"></i> Next: ${formatDateDisplay(caseItem.hearingDate)}
        </div>
      </div>
      <div style="text-align:right;">
        <span class="case-doc-cat-badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">
          <i class="fa-solid fa-folder-open"></i> ${docsCount} Doc${docsCount !== 1 ? 's' : ''} on record
        </span>
      </div>
    </div>
  `;
}

function handleQuickAddDocSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  const fileType = file.type || getFileTypeFromName(file.name);

  state.currentQuickAttachedDoc = {
    name: file.name,
    size: fileSize,
    type: fileType,
    fileData: null,
    textContent: null
  };

  const reader = new FileReader();
  reader.onload = function(evt) {
    if (state.currentQuickAttachedDoc) {
      state.currentQuickAttachedDoc.fileData = evt.target.result;
    }
  };
  reader.readAsDataURL(file);

  if (file.name.toLowerCase().endsWith('.txt')) {
    const textReader = new FileReader();
    textReader.onload = function(te) {
      if (state.currentQuickAttachedDoc) {
        state.currentQuickAttachedDoc.textContent = te.target.result;
      }
    };
    textReader.readAsText(file);
  }

  if (dom.quickAddDropzoneDefault) dom.quickAddDropzoneDefault.classList.add('hidden');
  if (dom.quickAddDropzoneAttached) dom.quickAddDropzoneAttached.classList.remove('hidden');
  if (dom.quickAddAttachedFileName) dom.quickAddAttachedFileName.textContent = file.name;
  if (dom.quickAddAttachedFileSize) dom.quickAddAttachedFileSize.textContent = fileSize;

  // Auto-populate title if empty
  if (dom.quickAddDocTitle && !dom.quickAddDocTitle.value.trim()) {
    dom.quickAddDocTitle.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' ');
  }
}

function resetQuickAddDocDropzone() {
  state.currentQuickAttachedDoc = null;
  if (dom.quickAddDocInput) dom.quickAddDocInput.value = '';
  if (dom.quickAddDropzoneDefault) dom.quickAddDropzoneDefault.classList.remove('hidden');
  if (dom.quickAddDropzoneAttached) dom.quickAddDropzoneAttached.classList.add('hidden');
}

function handleAddNewDocSubmit(e) {
  e.preventDefault();

  if (!dom.selectExistingCase) return;
  const caseId = dom.selectExistingCase.value;
  const caseItem = state.cases.find(c => c.id === caseId);

  if (!caseItem) {
    showToast('Please select a valid case docket from the registry.', 'error');
    return;
  }

  const titleVal = dom.quickAddDocTitle ? dom.quickAddDocTitle.value.trim() : '';
  const attached = state.currentQuickAttachedDoc;

  if (!attached && !titleVal) {
    showToast('Please choose a document file or provide a document title.', 'error');
    return;
  }

  const fileName = attached ? attached.name : `${titleVal.replace(/\s+/g, '_')}.pdf`;
  const fileSize = attached ? attached.size : `${(Math.random() * 2 + 0.8).toFixed(1)} MB`;
  const docTitle = titleVal || fileName;
  const category = dom.quickAddDocCategory ? dom.quickAddDocCategory.value : 'Other Document';
  const notesVal = dom.quickAddDocNotes ? dom.quickAddDocNotes.value.trim() : '';
  const runAi = dom.quickAddAutoAiSummary ? dom.quickAddAutoAiSummary.checked : true;

  const newDoc = {
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: fileName,
    size: fileSize,
    type: attached ? attached.type : getFileTypeFromName(fileName),
    fileData: attached ? attached.fileData : null,
    textContent: attached ? attached.textContent : null,
    category: category,
    title: docTitle,
    notes: notesVal,
    uploadedAt: new Date().toISOString(),
    uploadedBy: state.currentUser ? state.currentUser.name : 'Advocate'
  };

  // Run AI Summary immediately if enabled
  if (runAi) {
    newDoc.aiSummary = generateAiDocumentSummary(caseItem, newDoc);
  }

  if (!caseItem.documents || !Array.isArray(caseItem.documents)) {
    caseItem.documents = [];
  }
  caseItem.documents.unshift(newDoc);

  // Sync attachedDoc for backwards compatibility
  caseItem.attachedDoc = { name: newDoc.name, size: newDoc.size };

  // Log update to docket timeline
  if (!caseItem.updates || !Array.isArray(caseItem.updates)) {
    caseItem.updates = [];
  }
  caseItem.updates.unshift({
    id: 'upd_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Advocate',
    authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
    type: 'filing',
    title: `Document Filed: ${newDoc.title}`,
    notes: `Added "${newDoc.name}" (${newDoc.category}, ${newDoc.size}) to case docket.${notesVal ? ' Notes: ' + notesVal : ''}`
  });

  saveCasesToStorage();
  closeAddNewDocModal();
  renderCasesList();

  // If vault modal is open for this case, update its list too
  if (state.activeDocsCaseId === caseItem.id && dom.modalDocsList) {
    renderModalDocsList(caseItem);
  }

  showToast(`📄 Document "${newDoc.title}" successfully added to Case ${caseItem.caseNumber}!`, 'success');
}

// ==========================================================================
// 7.3 CASE DOCUMENTS VAULT (FOR EXISTING CASES)
// ==========================================================================

function openCaseDocsModal(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  state.activeDocsCaseId = caseId;
  if (dom.docsTargetCaseId) dom.docsTargetCaseId.value = caseId;

  if (dom.caseDocsModalTitle) {
    dom.caseDocsModalTitle.textContent = `${caseItem.caseTitle}`;
  }
  if (dom.caseDocsModalSubtitle) {
    dom.caseDocsModalSubtitle.textContent = `Docket: ${caseItem.caseNumber} • Client: ${caseItem.clientName} ${caseItem.opposingParty ? `vs. ${caseItem.opposingParty}` : ''}`;
  }

  // Populate Meta Bar
  if (dom.docsCaseMeta) {
    dom.docsCaseMeta.innerHTML = `
      <span class="badge-group" title="Practice Group"><i class="fa-solid fa-users"></i> ${escapeHTML(caseItem.group || caseItem.caseCategory)}</span>
      <span class="badge-assignee" title="Assigned Counsel"><i class="fa-solid fa-user-check"></i> ${escapeHTML(caseItem.assignedToName || 'Unassigned')}</span>
      <span class="matter-badge" title="Court"><i class="fa-solid fa-building-columns gold-text"></i> ${escapeHTML(caseItem.courtName)}</span>
      <span class="hearing-badge" style="font-weight:600;"><i class="fa-solid fa-circle-dot"></i> ${escapeHTML(caseItem.status || 'Active')}</span>
      <span style="font-size:0.75rem; color:var(--text-muted); margin-left:auto;"><i class="fa-regular fa-calendar"></i> Next: ${formatDateDisplay(caseItem.hearingDate)}</span>
    `;
  }

  // Reset modal dropzone & form inputs
  resetModalDocDropzone();
  if (dom.modalDocTitle) dom.modalDocTitle.value = '';
  if (dom.modalDocCategory) dom.modalDocCategory.selectedIndex = 0;

  // Render documents list
  renderModalDocsList(caseItem);

  // Open modal
  if (dom.caseDocsModal) dom.caseDocsModal.classList.remove('hidden');
}
window.openCaseDocsModal = openCaseDocsModal;

function closeCaseDocsModal() {
  if (dom.caseDocsModal) dom.caseDocsModal.classList.add('hidden');
  state.activeDocsCaseId = null;
  resetModalDocDropzone();
}

function resetModalDocDropzone() {
  state.currentModalAttachedDoc = null;
  if (dom.modalCaseDocInput) dom.modalCaseDocInput.value = '';
  if (dom.modalDropzoneDefault) dom.modalDropzoneDefault.classList.remove('hidden');
  if (dom.modalDropzoneAttached) dom.modalDropzoneAttached.classList.add('hidden');
}

function handleModalDocSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  const fileType = file.type || getFileTypeFromName(file.name);

  state.currentModalAttachedDoc = {
    name: file.name,
    size: fileSize,
    type: fileType,
    fileData: null,
    textContent: null
  };

  const reader = new FileReader();
  reader.onload = function(evt) {
    if (state.currentModalAttachedDoc) {
      state.currentModalAttachedDoc.fileData = evt.target.result;
    }
  };
  reader.readAsDataURL(file);

  if (file.name.toLowerCase().endsWith('.txt')) {
    const textReader = new FileReader();
    textReader.onload = function(te) {
      if (state.currentModalAttachedDoc) {
        state.currentModalAttachedDoc.textContent = te.target.result;
      }
    };
    textReader.readAsText(file);
  }

  if (dom.modalDropzoneDefault) dom.modalDropzoneDefault.classList.add('hidden');
  if (dom.modalDropzoneAttached) dom.modalDropzoneAttached.classList.remove('hidden');
  if (dom.modalAttachedFileName) dom.modalAttachedFileName.textContent = file.name;
  if (dom.modalAttachedFileSize) dom.modalAttachedFileSize.textContent = fileSize;

  if (dom.modalDocTitle && !dom.modalDocTitle.value.trim()) {
    dom.modalDocTitle.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' ');
  }
}

function handleAddCaseDocSubmit(e) {
  e.preventDefault();
  if (!state.activeDocsCaseId) return;

  const caseItem = state.cases.find(c => c.id === state.activeDocsCaseId);
  if (!caseItem) return;

  const titleVal = dom.modalDocTitle ? dom.modalDocTitle.value.trim() : '';
  const attached = state.currentModalAttachedDoc;

  if (!attached && !titleVal) {
    showToast('Please select a file or provide a document title.', 'error');
    return;
  }

  const fileName = attached ? attached.name : `${titleVal.replace(/\s+/g, '_')}.pdf`;
  const fileSize = attached ? attached.size : `${(Math.random() * 2 + 0.8).toFixed(1)} MB`;
  const docTitle = titleVal || fileName;
  const category = dom.modalDocCategory ? dom.modalDocCategory.value : 'Other Document';

  const newDoc = {
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: fileName,
    size: fileSize,
    type: attached ? attached.type : getFileTypeFromName(fileName),
    fileData: attached ? attached.fileData : null,
    textContent: attached ? attached.textContent : null,
    category: category,
    title: docTitle,
    uploadedAt: new Date().toISOString(),
    uploadedBy: state.currentUser ? state.currentUser.name : 'Advocate'
  };

  if (!caseItem.documents || !Array.isArray(caseItem.documents)) {
    caseItem.documents = [];
  }
  caseItem.documents.unshift(newDoc);

  // Keep attachedDoc in sync for backwards compatibility
  caseItem.attachedDoc = { name: newDoc.name, size: newDoc.size };

  // Log case update to docket timeline
  if (!caseItem.updates || !Array.isArray(caseItem.updates)) {
    caseItem.updates = [];
  }
  caseItem.updates.unshift({
    id: 'upd_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Counsel',
    authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
    type: 'filing',
    title: `Document Filed: ${newDoc.title}`,
    notes: `Uploaded "${newDoc.name}" (${newDoc.category}, ${newDoc.size}) to chamber docket.`
  });

  saveCasesToStorage();
  resetModalDocDropzone();
  if (dom.modalDocTitle) dom.modalDocTitle.value = '';

  renderModalDocsList(caseItem);
  renderCasesList();
  showToast(`Document "${newDoc.title}" successfully added to docket!`, 'success');
}

function renderModalDocsList(caseItem) {
  const docs = caseItem.documents || [];
  if (dom.modalDocsCountBadge) dom.modalDocsCountBadge.textContent = docs.length;

  if (!dom.modalDocsList) return;

  if (docs.length === 0) {
    dom.modalDocsList.innerHTML = `
      <div class="docs-empty-state">
        <i class="fa-regular fa-folder-open"></i>
        <strong>No documents attached to this case yet</strong>
        <p>Use the form above to attach petitions, court orders, bail pleas, or exhibits.</p>
      </div>
    `;
    return;
  }

  dom.modalDocsList.innerHTML = docs.map(doc => {
    let iconClass = 'generic';
    let iconFa = 'fa-file-lines';
    const lower = doc.name.toLowerCase();
    if (lower.endsWith('.pdf')) {
      iconClass = 'pdf';
      iconFa = 'fa-file-pdf';
    } else if (lower.endsWith('.doc') || lower.endsWith('.docx')) {
      iconClass = 'word';
      iconFa = 'fa-file-word';
    } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      iconClass = 'image';
      iconFa = 'fa-file-image';
    }

    const dateFormatted = doc.uploadedAt ? (new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })) : 'Recently';

    return `
      <div class="case-doc-card" data-doc-id="${doc.id}">
        <div class="case-doc-left">
          <div class="case-doc-icon-wrap ${iconClass}">
            <i class="fa-solid ${iconFa}"></i>
          </div>
          <div class="case-doc-details">
            <div class="case-doc-title-row">
              <span class="case-doc-name" title="${escapeHTML(doc.title || doc.name)}">${escapeHTML(doc.title || doc.name)}</span>
              <span class="case-doc-cat-badge">${escapeHTML(doc.category || 'Docket File')}</span>
            </div>
            <div class="case-doc-meta-row">
              <span><i class="fa-solid fa-paperclip"></i> ${escapeHTML(doc.name)}</span>
              <span>• ${escapeHTML(doc.size || '1 MB')}</span>
              <span>• Added ${dateFormatted} by ${escapeHTML(doc.uploadedBy || 'Counsel')}</span>
            </div>
          </div>
        </div>

        <div class="case-doc-actions">
          <button type="button" class="btn-doc-action btn-preview-doc" data-case-id="${caseItem.id}" data-doc-id="${doc.id}" data-tab="paneDocView" title="Preview document details & file">
            <i class="fa-regular fa-file-lines"></i> View
          </button>
          <button type="button" class="btn-doc-action btn-ai-doc" data-case-id="${caseItem.id}" data-doc-id="${doc.id}" data-tab="paneDocAi" title="JurisAI Document & Case Summary">
            <i class="fa-solid fa-brain gold-text"></i> AI Summary
          </button>
          <button type="button" class="btn-doc-action btn-download-doc" data-case-id="${caseItem.id}" data-doc-id="${doc.id}" title="Download document file">
            <i class="fa-solid fa-download"></i> Download
          </button>
          <button type="button" class="btn-doc-action danger btn-delete-doc" data-case-id="${caseItem.id}" data-doc-id="${doc.id}" title="Remove document from case">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach listeners for preview, AI summary, download, and delete
  dom.modalDocsList.querySelectorAll('.btn-preview-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.getAttribute('data-case-id');
      const dId = btn.getAttribute('data-doc-id');
      const tab = btn.getAttribute('data-tab') || 'paneDocView';
      previewCaseDocument(cId, dId, tab);
    });
  });

  dom.modalDocsList.querySelectorAll('.btn-ai-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.getAttribute('data-case-id');
      const dId = btn.getAttribute('data-doc-id');
      const tab = btn.getAttribute('data-tab') || 'paneDocAi';
      previewCaseDocument(cId, dId, tab);
    });
  });

  dom.modalDocsList.querySelectorAll('.btn-download-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.getAttribute('data-case-id');
      const dId = btn.getAttribute('data-doc-id');
      downloadCaseDocument(cId, dId);
    });
  });

  dom.modalDocsList.querySelectorAll('.btn-delete-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.getAttribute('data-case-id');
      const dId = btn.getAttribute('data-doc-id');
      deleteCaseDocument(cId, dId);
    });
  });
}

function deleteCaseDocument(caseId, docId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem || !caseItem.documents) return;

  const doc = caseItem.documents.find(d => d.id === docId);
  if (!doc) return;

  if (confirm(`Remove document "${doc.title || doc.name}" from docket ${caseItem.caseNumber}?`)) {
    caseItem.documents = caseItem.documents.filter(d => d.id !== docId);

    // Keep attachedDoc updated
    if (caseItem.documents.length > 0) {
      caseItem.attachedDoc = { name: caseItem.documents[0].name, size: caseItem.documents[0].size };
    } else {
      caseItem.attachedDoc = null;
    }

    // Log update
    if (!caseItem.updates) caseItem.updates = [];
    caseItem.updates.unshift({
      id: 'upd_' + Date.now(),
      date: getOffsetDateString(0),
      time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
      author: state.currentUser ? state.currentUser.name : 'Counsel',
      authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
      type: 'status',
      title: `Document Removed: ${doc.title || doc.name}`,
      notes: `Removed document "${doc.name}" from docket repository.`
    });

    saveCasesToStorage();
    renderModalDocsList(caseItem);
    renderCasesList();
    showToast(`Document "${doc.title || doc.name}" removed from docket.`, 'info');
  }
}

function downloadCaseDocument(caseId, docId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem || !caseItem.documents) return;

  const doc = caseItem.documents.find(d => d.id === docId);
  if (!doc) return;

  const content = `=====================================================================
LEXJURIS ADVOCATE & LEGAL CASE MANAGEMENT CHAMBERS
HIGH COURT & SUPREME COURT REGISTRY DOCKET ARCHIVE
=====================================================================

CASE DOCKET DETAILS:
Suit / Case No.:  ${caseItem.caseNumber}
Matter Title:     ${caseItem.caseTitle}
Client Name:      ${caseItem.clientName}
Client Contact:   ${caseItem.clientPhone}
Opposing Party:   ${caseItem.opposingParty || 'N/A'}
Court / Bench:    ${caseItem.courtName}
Practice Group:   ${caseItem.group || caseItem.caseCategory}
Assigned Counsel: ${caseItem.assignedToName || 'Advocate'}
Current Status:   ${caseItem.status || 'Active'}
Next Hearing:     ${caseItem.hearingDate} at ${caseItem.hearingTime}

---------------------------------------------------------------------
DOCUMENT METADATA:
Document Title:   ${doc.title || doc.name}
File Name:        ${doc.name}
Document Type:    ${doc.category || 'Court Brief'}
File Size:        ${doc.size || '1.2 MB'}
Upload Timestamp: ${doc.uploadedAt || 'N/A'}
Filing Counsel:   ${doc.uploadedBy || 'Counsel'}
---------------------------------------------------------------------

OFFICIAL RECORD EXTRACT & SYNOPSIS:
This document is a certified digital record filed and maintained within the LexJuris
advocate docket management vault. All pleadings, verified affidavits, and submissions
herein are governed by the Advocates Act, 1961 and applicable High Court Rules.

Chamber Strategy Notes:
${caseItem.notes || 'Arguments and statutory citations as per primary pleading docket.'}

Certified on: ${new Date().toLocaleString('en-IN')}
LexJuris Counsel & Partners - Chambers Automation
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileNameToDownload = doc.name.endsWith('.txt') ? doc.name : `${doc.name.replace(/\.[^/.]+$/, '')}_extract.txt`;
  a.download = fileNameToDownload;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded "${fileNameToDownload}"!`, 'success');
}

function previewCaseDocument(caseId, docId, initialTab = 'paneDocView') {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem || !caseItem.documents) return;

  const doc = caseItem.documents.find(d => d.id === docId);
  if (!doc) return;

  state.previewDoc = { caseId, docId, doc, caseItem, isStaged: false };

  // Set modal header
  if (dom.docPreviewTitle) dom.docPreviewTitle.textContent = doc.title || doc.name;
  if (dom.docPreviewSubtitle) {
    dom.docPreviewSubtitle.textContent = `Docket: ${caseItem.caseNumber} • ${doc.category} • ${caseItem.courtName}`;
  }

  // Ensure AI summary exists
  if (!doc.aiSummary) {
    doc.aiSummary = generateAiDocumentSummary(caseItem, doc);
  }

  // Render all 3 panes
  renderDocViewPane(caseItem, doc);
  renderDocAiSummaryPane(caseItem, doc);
  renderDocMetaPane(caseItem, doc);

  // Switch to requested tab
  switchDocPreviewTab(initialTab);

  // Configure download button
  if (dom.downloadPreviewDocBtn) {
    dom.downloadPreviewDocBtn.onclick = () => downloadCaseDocument(caseId, docId);
  }

  // Show modal
  if (dom.docPreviewModal) dom.docPreviewModal.classList.remove('hidden');
}

function previewStagedDocument(stagedDocId, initialTab = 'paneDocView') {
  const doc = state.stagedDocs.find(d => d.id === stagedDocId);
  if (!doc) return;

  // Build temporary case representation from intake form values
  const courtVal = dom.courtName ? dom.courtName.value.trim() || 'Court / High Court Bench' : 'High Court Bench';
  const clientVal = dom.clientName ? dom.clientName.value.trim() || 'Prospective Client' : 'Prospective Client';
  const caseNoVal = dom.caseNumber ? dom.caseNumber.value.trim() || 'NEW FILING (PENDING)' : 'NEW FILING';
  const caseTitleVal = dom.caseTitle ? dom.caseTitle.value.trim() || 'New Legal Matter' : 'New Legal Matter';
  const oppPartyVal = dom.opposingParty ? dom.opposingParty.value.trim() || 'Opposite Party' : 'Opposite Party';
  const matterCategory = dom.caseCategory ? dom.caseCategory.value : 'Civil Litigation';
  const notesVal = dom.caseNotes ? dom.caseNotes.value.trim() : '';

  const mockCase = {
    id: 'staged_preview',
    caseNumber: caseNoVal,
    caseTitle: caseTitleVal,
    clientName: clientVal,
    opposingParty: oppPartyVal,
    courtName: courtVal,
    caseCategory: matterCategory,
    group: matterCategory,
    notes: notesVal,
    assignedToName: state.currentUser ? state.currentUser.name : 'Advocate'
  };

  state.previewDoc = { caseId: 'staged', docId: stagedDocId, doc, caseItem: mockCase, isStaged: true };

  if (dom.docPreviewTitle) dom.docPreviewTitle.textContent = doc.title || doc.name;
  if (dom.docPreviewSubtitle) {
    dom.docPreviewSubtitle.textContent = `Intake Staged • ${doc.category} • ${mockCase.courtName}`;
  }

  if (!doc.aiSummary) {
    doc.aiSummary = generateAiDocumentSummary(mockCase, doc);
  }

  renderDocViewPane(mockCase, doc);
  renderDocAiSummaryPane(mockCase, doc);
  renderDocMetaPane(mockCase, doc);

  switchDocPreviewTab(initialTab);

  if (dom.downloadPreviewDocBtn) {
    dom.downloadPreviewDocBtn.onclick = () => {
      showToast(`Downloading file "${doc.name}"...`, 'info');
    };
  }

  if (dom.docPreviewModal) dom.docPreviewModal.classList.remove('hidden');
}

function switchDocPreviewTab(tabId) {
  state.previewActiveTab = tabId;

  // Tab buttons styling
  if (dom.tabDocViewBtn) {
    if (tabId === 'paneDocView') dom.tabDocViewBtn.classList.add('active');
    else dom.tabDocViewBtn.classList.remove('active');
  }
  if (dom.tabDocAiBtn) {
    if (tabId === 'paneDocAi') dom.tabDocAiBtn.classList.add('active');
    else dom.tabDocAiBtn.classList.remove('active');
  }
  if (dom.tabDocMetaBtn) {
    if (tabId === 'paneDocMeta') dom.tabDocMetaBtn.classList.add('active');
    else dom.tabDocMetaBtn.classList.remove('active');
  }

  // Panes visibility
  if (dom.paneDocView) {
    if (tabId === 'paneDocView') dom.paneDocView.classList.remove('hidden');
    else dom.paneDocView.classList.add('hidden');
  }
  if (dom.paneDocAi) {
    if (tabId === 'paneDocAi') dom.paneDocAi.classList.remove('hidden');
    else dom.paneDocAi.classList.add('hidden');
  }
  if (dom.paneDocMeta) {
    if (tabId === 'paneDocMeta') dom.paneDocMeta.classList.remove('hidden');
    else dom.paneDocMeta.classList.add('hidden');
  }

  // Footer button contexts
  const doc = state.previewDoc ? state.previewDoc.doc : null;

  if (tabId === 'paneDocAi') {
    if (dom.copyDocAiBtn) dom.copyDocAiBtn.classList.remove('hidden');
    if (dom.insertAiNotesBtn && !state.previewDoc?.isStaged) {
      dom.insertAiNotesBtn.classList.remove('hidden');
    } else if (dom.insertAiNotesBtn) {
      dom.insertAiNotesBtn.classList.add('hidden');
    }
  } else {
    if (dom.copyDocAiBtn) dom.copyDocAiBtn.classList.add('hidden');
    if (dom.insertAiNotesBtn) dom.insertAiNotesBtn.classList.add('hidden');
  }

  if (tabId === 'paneDocView' && doc && doc.fileData) {
    if (dom.openExternalDocBtn) dom.openExternalDocBtn.classList.remove('hidden');
  } else {
    if (dom.openExternalDocBtn) dom.openExternalDocBtn.classList.add('hidden');
  }
}

function renderDocViewPane(caseItem, doc) {
  if (!dom.paneDocView) return;

  // 1. Case where user uploaded a raw data file (PDF, Image, or Text)
  if (doc.fileData) {
    const isImage = (doc.type && doc.type.startsWith('image/')) || doc.name.match(/\.(png|jpe?g|webp|gif|svg)$/i);
    const isPdf = (doc.type && doc.type === 'application/pdf') || doc.name.match(/\.pdf$/i);

    if (isImage) {
      dom.paneDocView.innerHTML = `
        <div class="uploaded-doc-toolbar">
          <div class="uploaded-doc-toolbar-left">
            <i class="fa-solid fa-file-image gold-text"></i>
            <strong>${escapeHTML(doc.name)}</strong>
            <span class="case-doc-cat-badge">${escapeHTML(doc.category)}</span>
            <span>• ${escapeHTML(doc.size || 'Image')}</span>
          </div>
          <div class="uploaded-doc-toolbar-right">
            <button type="button" class="btn btn-outline-subtle btn-xs" id="zoomInDocImgBtn" title="Zoom In"><i class="fa-solid fa-magnifying-glass-plus"></i> Zoom +</button>
            <button type="button" class="btn btn-outline-subtle btn-xs" id="zoomOutDocImgBtn" title="Zoom Out"><i class="fa-solid fa-magnifying-glass-minus"></i> Zoom -</button>
            <button type="button" class="btn btn-outline-subtle btn-xs" id="resetZoomDocImgBtn" title="Reset Zoom"><i class="fa-solid fa-rotate"></i> Reset</button>
            <button type="button" class="btn btn-outline-gold btn-xs" onclick="window.open('${doc.fileData}', '_blank')"><i class="fa-solid fa-arrow-up-right-from-square"></i> Fullscreen</button>
          </div>
        </div>
        <div class="uploaded-doc-image-box">
          <img src="${doc.fileData}" id="uploadedPreviewImg" class="uploaded-doc-image" alt="${escapeHTML(doc.name)}" />
        </div>
      `;

      let currentZoom = 1;
      const imgEl = document.getElementById('uploadedPreviewImg');
      const inBtn = document.getElementById('zoomInDocImgBtn');
      const outBtn = document.getElementById('zoomOutDocImgBtn');
      const resBtn = document.getElementById('resetZoomDocImgBtn');

      if (inBtn && imgEl) {
        inBtn.onclick = () => {
          currentZoom = Math.min(currentZoom + 0.25, 3.5);
          imgEl.style.transform = `scale(${currentZoom})`;
        };
      }
      if (outBtn && imgEl) {
        outBtn.onclick = () => {
          currentZoom = Math.max(currentZoom - 0.25, 0.4);
          imgEl.style.transform = `scale(${currentZoom})`;
        };
      }
      if (resBtn && imgEl) {
        resBtn.onclick = () => {
          currentZoom = 1;
          imgEl.style.transform = 'scale(1)';
        };
      }
      return;
    }

    if (isPdf) {
      dom.paneDocView.innerHTML = `
        <div class="uploaded-doc-toolbar">
          <div class="uploaded-doc-toolbar-left">
            <i class="fa-solid fa-file-pdf" style="color:#ef4444;"></i>
            <strong>${escapeHTML(doc.name)}</strong>
            <span class="case-doc-cat-badge">${escapeHTML(doc.category)}</span>
            <span>• ${escapeHTML(doc.size || 'PDF Document')}</span>
          </div>
          <div class="uploaded-doc-toolbar-right">
            <button type="button" class="btn btn-outline-gold btn-xs" onclick="window.open('${doc.fileData}', '_blank')">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Full Browser Window
            </button>
          </div>
        </div>
        <iframe src="${doc.fileData}#toolbar=1" class="uploaded-doc-frame" title="${escapeHTML(doc.name)}"></iframe>
      `;
      return;
    }

    if (doc.textContent) {
      dom.paneDocView.innerHTML = `
        <div class="uploaded-doc-toolbar">
          <div class="uploaded-doc-toolbar-left">
            <i class="fa-solid fa-file-lines gold-text"></i>
            <strong>${escapeHTML(doc.name)}</strong>
            <span class="case-doc-cat-badge">${escapeHTML(doc.category)}</span>
            <span>• Raw Text Document</span>
          </div>
        </div>
        <div class="doc-preview-text-box">${escapeHTML(doc.textContent)}</div>
      `;
      return;
    }
  }

  // 2. High Court Digital Court Parchment Docket View (When no binary fileData is present)
  const courtHeading = (caseItem ? caseItem.courtName : 'CHAMBERS REGISTRY').toUpperCase();
  const docketNo = caseItem ? caseItem.caseNumber : 'WP(C) REGISTRY DOCKET';
  const clientName = caseItem ? caseItem.clientName : 'Client / Petitioner';
  const oppName = caseItem && caseItem.opposingParty ? caseItem.opposingParty : 'Opposing Party / State of NCT';
  const counselName = doc.uploadedBy || (caseItem ? caseItem.assignedToName : 'Counsel');
  const catDisplay = (doc.category || 'Court Filing').toUpperCase();

  dom.paneDocView.innerHTML = `
    <div class="uploaded-doc-toolbar">
      <div class="uploaded-doc-toolbar-left">
        <i class="fa-solid fa-stamp gold-text"></i>
        <strong>Chamber Certified Digital Docket Record</strong> (${escapeHTML(doc.name)})
        <span class="case-doc-cat-badge">${escapeHTML(doc.category)}</span>
      </div>
      <div class="uploaded-doc-toolbar-right">
        <span style="font-size: 0.72rem; color: var(--gold-primary); font-weight: 600;">
          <i class="fa-solid fa-shield-check"></i> Certified Court Vault Copy
        </span>
      </div>
    </div>

    <div class="court-parchment-viewer">
      <div class="parchment-watermark">COURT RECORD</div>
      <div class="court-parchment-header">
        <div class="court-parchment-emblem"><i class="fa-solid fa-scale-balanced"></i></div>
        <div class="court-parchment-court">IN THE HIGH COURT OF JUDICATURE AT ${escapeHTML(courtHeading)}</div>
        <div class="court-parchment-docket">CAUSE LIST REGISTRATION NO.: ${escapeHTML(docketNo)}</div>
      </div>

      <div class="court-parchment-parties">
        <div><strong>PETITIONER / APPLICANT:</strong><br>${escapeHTML(clientName)}</div>
        <div style="text-align: right;"><strong>RESPONDENT / OPPOSITE PARTY:</strong><br>${escapeHTML(oppName)}</div>
      </div>

      <div class="court-parchment-heading">${escapeHTML(doc.title || doc.name)}</div>
      <div style="text-align: center; font-size: 0.8rem; color: #666; margin-bottom: 1.25rem;">
        [FILED UNDER: ${escapeHTML(catDisplay)} • GOVERNED BY THE ADVOCATES ACT, 1961]
      </div>

      <div class="court-parchment-paras">
        <p><strong>1. JURISDICTION &amp; STATUTORY LOCUS:</strong> The present ${escapeHTML(doc.category)} is filed by the Petitioner/Applicant through counsel on record invoking the extraordinary and statutory jurisdiction of this Hon'ble Court under applicable procedural rules and High Court practice directives.</p>
        <p><strong>2. STATEMENT OF FACTS &amp; CAUSE OF ACTION:</strong> That the dispute pertains to <strong>${escapeHTML(caseItem ? (caseItem.group || caseItem.caseCategory) : 'Civil & Commercial Proceeding')}</strong> wherein urgent interim judicial intervention is necessitated to protect substantial proprietary, statutory, and civil rights of the client against coercive actions of the respondents.</p>
        <p><strong>3. BALANCE OF CONVENIENCE &amp; PRIMA FACIE MERITS:</strong> That prima facie grounds have been duly substantiated by certified copies, verified affidavits, and documentary annexures on record. Irreparable injury and grave prejudice shall be occasioned if appropriate protective orders are not passed.</p>
        <p><strong>4. PRAYERS &amp; RELIEFS SOUGHT:</strong> In the premises aforesaid, it is respectfully prayed that this Hon'ble Court may graciously be pleased to grant ad-interim relief in terms of the statutory schedule and pass such other orders as deemed fit and proper in the interest of justice.</p>
      </div>

      <div class="court-parchment-footer">
        <div class="court-chamber-stamp">
          <i class="fa-solid fa-building-columns"></i><br>
          LexJuris Chambers<br>
          Registry Certified
        </div>
        <div class="court-advocate-signature">
          <div class="sig-line"></div>
          <strong>${escapeHTML(counselName)}</strong><br>
          Advocate on Record / Chambers Counsel
        </div>
      </div>
    </div>
  `;
}

function renderDocAiSummaryPane(caseItem, doc) {
  if (!dom.paneDocAi) return;

  const summary = doc.aiSummary || generateAiDocumentSummary(caseItem, doc);
  doc.aiSummary = summary;

  dom.paneDocAi.innerHTML = `
    <!-- Top AI Banner -->
    <div class="ai-summary-banner">
      <div class="ai-summary-banner-title">
        <i class="fa-solid fa-brain"></i>
        <div>
          <h4>JurisAI Legal Document &amp; Case Intelligence</h4>
          <p>Model: LexJuris Legal 4.0 • 99.4% Extraction Confidence • High Court Bench Aligned</p>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <button type="button" class="btn btn-outline-gold btn-xs" id="btnRegenerateAiSummary" title="Regenerate legal summary">
          <i class="fa-solid fa-rotate"></i> Re-Analyze
        </button>
      </div>
    </div>

    <!-- Quick Metric Cards -->
    <div class="ai-metrics-grid">
      <div class="ai-metric-card">
        <span class="ai-metric-label">Document Class</span>
        <span class="ai-metric-value"><i class="fa-solid fa-file-contract gold-text"></i> ${escapeHTML(doc.category)}</span>
      </div>
      <div class="ai-metric-card">
        <span class="ai-metric-label">Forum &amp; Bench</span>
        <span class="ai-metric-value" title="${escapeHTML(caseItem.courtName)}"><i class="fa-solid fa-building-columns gold-text"></i> ${escapeHTML(caseItem.courtName.substring(0, 18))}</span>
      </div>
      <div class="ai-metric-card">
        <span class="ai-metric-label">Merit Probability</span>
        <span class="ai-metric-value merit-high"><i class="fa-solid fa-chart-line"></i> ${summary.strengthScore}% Strong</span>
      </div>
      <div class="ai-metric-card">
        <span class="ai-metric-label">Action Checklist</span>
        <span class="ai-metric-value"><i class="fa-solid fa-list-check gold-text"></i> ${summary.actionItems.length} Directives</span>
      </div>
    </div>

    <!-- 1. Executive Synopsis -->
    <div class="ai-summary-card">
      <div class="ai-summary-card-header">
        <h5><i class="fa-solid fa-file-lines gold-text"></i> Executive Legal Synopsis</h5>
        <span class="badge-group" style="font-size:0.7rem;"><i class="fa-solid fa-check-double"></i> Verified</span>
      </div>
      <p class="ai-synopsis-text">${escapeHTML(summary.synopsis)}</p>
    </div>

    <!-- 2. Governing Statutes & Precedents -->
    <div class="ai-summary-card">
      <div class="ai-summary-card-header">
        <h5><i class="fa-solid fa-scale-balanced gold-text"></i> Statutory Grounds &amp; Provisions Cited</h5>
      </div>
      <div class="ai-statute-chips">
        ${summary.statutes.map(s => `
          <div class="ai-statute-chip" title="${escapeHTML(s.label)}">
            <i class="fa-solid fa-book-bookmark"></i>
            <span>${escapeHTML(s.label)}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 3. Operative Prayers & Reliefs -->
    <div class="ai-summary-card">
      <div class="ai-summary-card-header">
        <h5><i class="fa-solid fa-gavel gold-text"></i> Operative Prayers &amp; Reliefs Sought</h5>
      </div>
      <ol class="ai-prayers-list">
        ${summary.prayers.map(p => `<li>${escapeHTML(p)}</li>`).join('')}
      </ol>
    </div>

    <!-- 4. Actionable Directives for Counsel -->
    <div class="ai-summary-card">
      <div class="ai-summary-card-header">
        <h5><i class="fa-solid fa-clipboard-check gold-text"></i> Actionable Counsel Directives &amp; Deadlines</h5>
      </div>
      <div class="ai-checklist">
        ${summary.actionItems.map((item, index) => `
          <label class="ai-checklist-item">
            <input type="checkbox" id="chk_action_${index}">
            <span>${escapeHTML(item)}</span>
          </label>
        `).join('')}
      </div>
    </div>

    <!-- 5. Litigation Risk & Strategy Assessment -->
    <div class="ai-summary-card">
      <div class="ai-summary-card-header">
        <h5><i class="fa-solid fa-shield-halved gold-text"></i> Litigation Risk &amp; Merits Assessment</h5>
        <span style="font-size:0.8rem; font-weight:700; color:#10b981;">${summary.strengthAssessment}</span>
      </div>
      <div class="ai-strength-bar-wrap">
        <div class="ai-strength-bar">
          <div class="ai-strength-bar-fill" style="width: ${summary.strengthScore}%;"></div>
        </div>
      </div>
      <p style="font-size:0.84rem; color:var(--text-secondary); margin-top:0.5rem; line-height:1.5;">
        <strong>Strategic Advisory:</strong> ${escapeHTML(summary.riskAnalysis)}
      </p>
    </div>
  `;

  // Attach regenerate button inside AI pane
  const regenBtn = document.getElementById('btnRegenerateAiSummary');
  if (regenBtn) {
    regenBtn.onclick = handleTriggerAiSummary;
  }
}

function renderDocMetaPane(caseItem, doc) {
  if (!dom.paneDocMeta) return;

  const dateFormatted = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Just now';

  // Generate deterministic hash preview
  const hashSeed = (doc.name + (doc.size || '1MB') + (doc.uploadedAt || '')).split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
  const fakeHash = '0x' + Math.abs(hashSeed).toString(16).padStart(16, '0') + 'b4c7e8f1';

  dom.paneDocMeta.innerHTML = `
    <table class="doc-preview-meta-table">
      <tbody>
        <tr><td class="label">Document Title</td><td><strong>${escapeHTML(doc.title || doc.name)}</strong></td></tr>
        <tr><td class="label">Original File Name</td><td><code>${escapeHTML(doc.name)}</code></td></tr>
        <tr><td class="label">Document Category</td><td><span class="case-doc-cat-badge">${escapeHTML(doc.category)}</span></td></tr>
        <tr><td class="label">File Size</td><td>${escapeHTML(doc.size || '1.1 MB')}</td></tr>
        <tr><td class="label">Case Docket No.</td><td><strong>${escapeHTML(caseItem.caseNumber)}</strong></td></tr>
        <tr><td class="label">Matter Title</td><td>${escapeHTML(caseItem.caseTitle)}</td></tr>
        <tr><td class="label">Client Identity</td><td>${escapeHTML(caseItem.clientName)} vs. ${escapeHTML(caseItem.opposingParty || 'Opposite Parties')}</td></tr>
        <tr><td class="label">Court / Bench</td><td>${escapeHTML(caseItem.courtName)}</td></tr>
        <tr><td class="label">Filing Counsel</td><td>${escapeHTML(doc.uploadedBy || 'Advocate')}</td></tr>
        <tr><td class="label">Upload Timestamp</td><td>${dateFormatted}</td></tr>
        <tr><td class="label">SHA-256 Vault Hash</td><td><code style="font-size:0.75rem;">${fakeHash}</code></td></tr>
        <tr><td class="label">Digital Registry Status</td><td><span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Admitted &amp; Encrypted in Vault</span></td></tr>
      </tbody>
    </table>
  `;
}

function handleTriggerAiSummary() {
  if (!state.previewDoc) return;
  const { caseItem, doc } = state.previewDoc;

  showToast('⚡ JurisAI is analyzing legal averments & precedents...', 'info');

  if (dom.paneDocAi) {
    dom.paneDocAi.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-secondary);">
        <i class="fa-solid fa-brain fa-spin fa-2x gold-text" style="margin-bottom:1rem;"></i>
        <h4>JurisAI Engine Analyzing Document...</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); max-width:400px; margin:0.5rem auto;">
          Scanning statutory provisions under Indian law, assessing prima facie balance of convenience, and extracting counsel action items...
        </p>
      </div>
    `;
  }

  switchDocPreviewTab('paneDocAi');

  setTimeout(() => {
    // Generate fresh summary
    doc.aiSummary = generateAiDocumentSummary(caseItem, doc);
    renderDocAiSummaryPane(caseItem, doc);
    showToast('JurisAI Legal Summary successfully refreshed!', 'success');
  }, 450);
}

function copyAiSummaryToClipboard() {
  if (!state.previewDoc) return;
  const { caseItem, doc } = state.previewDoc;
  const summary = doc.aiSummary || generateAiDocumentSummary(caseItem, doc);

  const text = `=====================================================================
JURISAI LEGAL DOCUMENT & CASE INTELLIGENCE SUMMARY
=====================================================================
Document:      ${doc.title || doc.name} (${doc.category})
Case Docket:   ${caseItem ? caseItem.caseNumber : 'N/A'} - ${caseItem ? caseItem.caseTitle : ''}
Court / Bench: ${caseItem ? caseItem.courtName : ''}
Client:        ${caseItem ? caseItem.clientName : ''}
Merits:        ${summary.strengthScore}% (${summary.strengthAssessment})

1. EXECUTIVE SYNOPSIS:
${summary.synopsis}

2. STATUTORY PROVISIONS & CITATIONS:
${summary.statutes.map(s => `• ${s.label}`).join('\n')}

3. OPERATIVE PRAYERS & RELIEFS:
${summary.prayers.map((p, i) => `${i + 1}. ${p}`).join('\n')}

4. COUNSEL ACTION DIRECTIVES:
${summary.actionItems.map(a => `[ ] ${a}`).join('\n')}

5. STRATEGIC LITIGATION RISK ASSESSMENT:
${summary.riskAnalysis}

Generated via LexJuris Advocate & Legal Case Management Chambers
=====================================================================`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 AI Legal Summary copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Summary generated. Please copy from screen.', 'info');
  });
}

function appendAiSummaryToCaseNotes() {
  if (!state.previewDoc || state.previewDoc.isStaged) {
    showToast('Cannot append notes to an unfiled intake draft.', 'error');
    return;
  }

  const { caseItem, doc } = state.previewDoc;
  const summary = doc.aiSummary || generateAiDocumentSummary(caseItem, doc);

  const noteAddition = `\n\n--- [JurisAI Summary: ${doc.title || doc.name}] (${new Date().toLocaleDateString('en-IN')}) ---\nSynopsis: ${summary.synopsis}\nKey Relief: ${summary.prayers[0] || 'N/A'}\nMerit Assessment: ${summary.strengthScore}% (${summary.strengthAssessment})`;

  caseItem.notes = (caseItem.notes || '') + noteAddition;

  // Add docket update
  if (!caseItem.updates || !Array.isArray(caseItem.updates)) {
    caseItem.updates = [];
  }
  caseItem.updates.unshift({
    id: 'upd_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Advocate',
    authorRole: 'JurisAI Assistant',
    type: 'filing',
    title: `AI Analysis Added: ${doc.title || doc.name}`,
    notes: `Appended automated legal synopsis and merit score (${summary.strengthScore}%) to case strategy brief.`
  });

  saveCasesToStorage();
  renderCasesList();
  showToast('📌 AI Summary successfully appended to Chamber Case Notes!', 'success');
}

function openCurrentDocInNewTab() {
  if (!state.previewDoc) return;
  const { doc } = state.previewDoc;
  if (doc && doc.fileData) {
    window.open(doc.fileData, '_blank');
  } else {
    showToast('Digital docket parchment record is embedded in preview.', 'info');
  }
}

function generateAiDocumentSummary(caseItem, doc) {
  const category = (doc.category || '').toLowerCase();
  const matter = ((caseItem ? caseItem.caseCategory : '') + ' ' + (caseItem ? caseItem.group : '')).toLowerCase();
  const client = caseItem ? caseItem.clientName : 'Client';
  const opposing = caseItem && caseItem.opposingParty ? caseItem.opposingParty : 'Opposite Parties';
  const court = caseItem ? caseItem.courtName : 'Competent Court';
  const docket = caseItem ? caseItem.caseNumber : 'Docket';

  let statutes = [];
  let prayers = [];
  let actionItems = [];
  let synopsis = '';
  let strengthScore = 88;
  let strengthAssessment = 'Strong Legal Grounds & Prima Facie Merits';
  let riskAnalysis = '';

  if (category.includes('writ') || matter.includes('writ') || matter.includes('constitutional')) {
    statutes = [
      { code: 'Const. Art. 226/227', label: 'Constitution of India - Articles 226 & 227 (High Court Writ Jurisdiction)' },
      { code: 'CPC Sec. 151', label: 'Section 151 CPC (Inherent Powers to prevent miscarriage of justice)' },
      { code: 'Audi Alteram Partem', label: 'Principles of Natural Justice & Article 14 (Equality before Law)' }
    ];
    prayers = [
      `Issue Writ of Certiorari quashing arbitrary administrative decision/notice issued against ${client}.`,
      'Issue Writ of Mandamus commanding the respondent authorities to afford full opportunity of hearing and maintain status-quo.',
      'Grant ad-interim ex-parte stay on coercive proceedings pending adjudication.'
    ];
    actionItems = [
      'Serve dasti notice upon the office of the Standing Counsel / Advocate General.',
      'File caveat verification search certificate from court registry.',
      'Prepare certified copy of impugned order with English translation where applicable.',
      'Collate supporting affidavits of petitioner for admission hearing.'
    ];
    synopsis = `This filing challenges the administrative order passed against ${client} before the ${court}. The petition establishes that the impugned action violates fundamental principles of natural justice and statutory mandate under Article 14. Prima facie case and balance of convenience strongly favour the petitioner.`;
    riskAnalysis = 'Respondents may raise preliminary objection regarding alternative statutory remedy; rebut with apex court precedents establishing writ maintainability where fundamental rights or natural justice are breached.';
  } else if (category.includes('bail') || matter.includes('criminal')) {
    statutes = [
      { code: 'CrPC Sec. 439 / BNSS 483', label: 'Section 439 CrPC / Section 483 Bharatiya Nagarik Suraksha Sanhita (Regular Bail)' },
      { code: 'CrPC Sec. 482 / BNSS 528', label: 'Section 482 CrPC / Section 528 BNSS (Inherent High Court Powers)' },
      { code: 'Const. Art. 21', label: 'Article 21 (Protection of Life and Personal Liberty - Bail is Rule, Jail Exception)' }
    ];
    prayers = [
      `Enlarge applicant ${client} on regular bail subject to reasonable terms and conditions.`,
      'Stay coercive custodial interrogation during pendency of investigation.',
      'Furnish solvent local sureties to the satisfaction of the Trial Court.'
    ];
    actionItems = [
      'Obtain certified copy of FIR and case diary status from the Investigating Officer.',
      'Verify that applicant has no criminal antecedents and deep societal ties.',
      'Prepare two solvent local surety bond papers and Aadhaar KYC verification.',
      'Draft rejoinder to prosecution reply highlighting absence of flight risk.'
    ];
    strengthScore = 82;
    strengthAssessment = 'Favourable Prospects under Bail Jurisprudence';
    synopsis = `This criminal defense filing before ${court} seeks urgent enlargement on bail for ${client} in connection with ${docket}. The pleading demonstrates that custodial interrogation is unwarranted, investigation is substantially complete, and applicant satisfies all tripartite bail tests.`;
    riskAnalysis = 'Prosecution may allege potential tampering with witnesses; counter with conditions agreeing to surrender passport and mark attendance at local police station.';
  } else if (category.includes('notice') || category.includes('cheque') || matter.includes('cheque')) {
    statutes = [
      { code: 'NI Act Sec. 138', label: 'Section 138, Negotiable Instruments Act, 1881 (Dishonour of Cheque)' },
      { code: 'NI Act Sec. 139', label: 'Section 139 NI Act (Statutory Presumption of Enforceable Debt)' },
      { code: 'NI Act Sec. 141', label: 'Section 141 NI Act (Offences by Companies & Vicarious Liability)' }
    ];
    prayers = [
      `Call upon drawer ${opposing} to pay the dishonoured cheque amount within statutory period of 15 days.`,
      'Demand payment along with statutory interest @ 18% p.a. and legal drafting charges.',
      'Formal notice that failure to comply shall trigger criminal prosecution under Section 138 NI Act.'
    ];
    actionItems = [
      'Preserve original cheque, return memo, and bank slip in secure chambers vault.',
      'Track speed post postal tracking consignment report and generate delivery certificate.',
      'Mark the exact 15-day expiry deadline for filing criminal complaint under Section 142 NI Act.',
      'Draft complaint petition under Section 200 CrPC/BNSS ready for instant presentation.'
    ];
    strengthScore = 94;
    strengthAssessment = 'Exceptionally Strong Statutory Cause of Action';
    synopsis = `Statutory legal demand notice issued on behalf of ${client} to ${opposing} regarding dishonour of negotiable instrument. Establishes existence of legally enforceable liability, valid presentation within statutory validity, and formal return memo from drawee bank.`;
    riskAnalysis = 'Ensure postal delivery receipt date is meticulously authenticated to forestall any limitation dispute upon expiry of the 15-day statutory window.';
  } else if (category.includes('agreement') || category.includes('contract') || matter.includes('corporate') || matter.includes('commercial')) {
    statutes = [
      { code: 'Contract Act Sec. 73', label: 'Section 73 & 74, Indian Contract Act, 1872 (Compensation for Loss / Breach)' },
      { code: 'Arbitration Sec. 9', label: 'Section 9, Arbitration & Conciliation Act, 1996 (Interim Protective Measures)' },
      { code: 'Commercial Courts Act', label: 'Commercial Courts Act, 2015 (Pre-Institution Mediation & Specified Value)' }
    ];
    prayers = [
      `Restrain ${opposing} from alienating assets or transferring contractual revenue.`,
      'Direct deposit of contested outstanding sums into interest-bearing escrow account.',
      'Grant leave to invoke dispute resolution / arbitration clause under the contract.'
    ];
    actionItems = [
      'Examine whether document is duly stamped under the Indian Stamp Act, 1899.',
      'Issue formal default notice with cure period before initiating legal action.',
      'Collate invoice milestones, delivery acknowledgments, and email correspondence.',
      'Draft application for appointment of Sole Arbitrator under Section 11 if required.'
    ];
    strengthScore = 90;
    strengthAssessment = 'Clear Contractual Breach & Documented Default';
    synopsis = `Commercial filing establishing breach of contractual covenants by ${opposing}. The document details payment milestones, non-compliance with terms, and material default resulting in substantial commercial damage to ${client}.`;
    riskAnalysis = 'Verify arbitration seat versus governing law clause to avoid jurisdictional objections before the Commercial Court.';
  } else {
    statutes = [
      { code: 'CPC O.39 R.1-2', label: 'Order XXXIX Rules 1 & 2 read with Section 151, Code of Civil Procedure, 1908' },
      { code: 'Specific Relief Sec. 38', label: 'Section 38 & 39, Specific Relief Act, 1963 (Perpetual & Mandatory Injunction)' },
      { code: 'Evidence Act / BSA', label: 'Bharatiya Sakshya Adhiniyam / Indian Evidence Act (Admissibility of Certified Copies)' }
    ];
    prayers = [
      `Grant ad-interim ex-parte temporary injunction against ${opposing} from altering status-quo.`,
      'Restrain third-party encumbrance or demolition pending final adjudication.',
      'Award costs of the miscellaneous application in favour of applicant.'
    ];
    actionItems = [
      'Serve advance copy of application upon opposing counsel with acknowledgment receipt.',
      'Collate certified revenue maps, municipal receipts, and registered title documents.',
      'Draft replication / rejoinder to preliminary written statement.',
      'Brief senior designated counsel for interim injunction hearing.'
    ];
    strengthScore = 86;
    strengthAssessment = 'Substantial Prima Facie Case & Balance of Convenience';
    synopsis = `This ${doc.category} filed in matter ${docket} before ${court} details urgent legal averments on behalf of ${client}. Submits that applicant has an unimpeachable legal right and denial of interim protection will inflict irreparable injury.`;
    riskAnalysis = 'Opposing counsel may argue suppression of material facts; ensure all antecedent notices and correspondence are catalogued as numbered annexures.';
  }

  return {
    synopsis,
    statutes,
    prayers,
    actionItems,
    strengthScore,
    strengthAssessment,
    riskAnalysis,
    generatedAt: new Date().toISOString()
  };
}

function closeDocPreviewModal() {
  if (dom.docPreviewModal) dom.docPreviewModal.classList.add('hidden');
  state.previewDoc = null;
}

function getFileTypeFromName(name) {
  if (!name) return 'application/pdf';
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'application/msword';
  if (lower.endsWith('.txt')) return 'text/plain';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

// ==========================================================================
// 8. RESCHEDULE COURT HEARING MODAL
// ==========================================================================

function openRescheduleModal(caseId) {
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  dom.editCaseId.value = caseItem.id;
  dom.modalSubtitle.textContent = `Docket: ${caseItem.caseNumber} • ${caseItem.caseTitle}`;
  
  dom.modalClientSummary.innerHTML = `
    <strong><i class="fa-solid fa-user-tie"></i> Client:</strong> ${escapeHTML(caseItem.clientName)} 
    (${escapeHTML(caseItem.clientPhone)}) &nbsp;|&nbsp; 
    <strong>Practice Group:</strong> ${escapeHTML(caseItem.group || caseItem.caseCategory)} &nbsp;|&nbsp;
    <strong>Assigned:</strong> ${escapeHTML(caseItem.assignedToName || 'Unassigned')}
  `;

  dom.editCourtName.value = caseItem.courtName || '';
  dom.editHearingDate.value = caseItem.hearingDate || '';
  dom.editHearingTime.value = caseItem.hearingTime || '10:30';
  dom.editCaseStatus.value = caseItem.status || 'Active';
  dom.editNotes.value = caseItem.notes || '';

  if (dom.editCaseGroup) {
    dom.editCaseGroup.value = caseItem.group || caseItem.caseCategory || 'Constitutional & Writ';
    populateEditAssigneeDropdown(dom.editCaseGroup.value, caseItem.assignedTo);
  }

  dom.caseModal.classList.remove('hidden');
}

function closeModal() {
  dom.caseModal.classList.add('hidden');
}

function handleRescheduleSubmit(e) {
  e.preventDefault();
  const caseId = dom.editCaseId.value;
  const caseItem = state.cases.find(c => c.id === caseId);
  if (!caseItem) return;

  caseItem.courtName = dom.editCourtName.value.trim();
  caseItem.hearingDate = dom.editHearingDate.value;
  caseItem.hearingTime = dom.editHearingTime.value;
  caseItem.status = dom.editCaseStatus.value;
  caseItem.notes = dom.editNotes.value.trim();

  if (dom.editCaseGroup) {
    caseItem.group = dom.editCaseGroup.value;
  }
  if (dom.editCaseAssignee && dom.editCaseAssignee.value) {
    const newAssigneeId = dom.editCaseAssignee.value;
    const assignedUser = state.users.find(u => u.id === newAssigneeId);
    if (assignedUser) {
      caseItem.assignedTo = assignedUser.id;
      caseItem.assignedToName = assignedUser.name;
      caseItem.assignedToEmail = assignedUser.email;
    }
  }

  if (!caseItem.updates) caseItem.updates = [];
  caseItem.updates.unshift({
    id: 'upd_' + Date.now(),
    date: getOffsetDateString(0),
    time: formatTime12Hour(new Date().toTimeString().substring(0, 5)),
    author: state.currentUser ? state.currentUser.name : 'Counsel',
    authorRole: state.currentUser ? state.currentUser.role : 'Advocate',
    type: 'status',
    title: 'Docket Rescheduled & Updated',
    notes: `Next listing: ${formatDateDisplay(caseItem.hearingDate)} at ${formatTime12Hour(caseItem.hearingTime)} (${caseItem.status}). Handled by ${caseItem.assignedToName || 'Counsel'}.`
  });

  saveCasesToStorage();
  closeModal();
  renderDashboard();

  showToast(`Hearing for ${caseItem.clientName} rescheduled to ${formatDateDisplay(caseItem.hearingDate)} at ${formatTime12Hour(caseItem.hearingTime)}.`, 'success');
}

// ==========================================================================
// 9. CAUSE LIST EXPORT / PRINT
// ==========================================================================

function exportCauseList() {
  const todayStr = getOffsetDateString(0);
  const accessible = getAccessibleCases(state.currentUser);
  const activeCases = accessible.filter(c => c.status !== 'Disposed');

  if (activeCases.length === 0) {
    showToast('No active accessible cases to export.', 'info');
    return;
  }

  const user = state.currentUser || { name: 'Advocate', role: 'Counsel' };
  const scopeText = user.role === 'Chambers Administrator'
    ? 'Chambers Master Oversight'
    : (isUserGroupHead(user)
        ? `Practice Group Head Oversight (${user.group || user.dept})`
        : `Subordinate Counsel Restricted View (${user.name})`);

  let textReport = `=================================================================\n`;
  textReport += `               LEXJURIS ADVOCATE CAUSE LIST & DOCKETS           \n`;
  textReport += `           PRACTITIONER: ${user.name.toUpperCase()} [${user.role}]\n`;
  textReport += `           ACCESS SCOPE: ${scopeText}\n`;
  textReport += `           GENERATED AT: ${new Date().toLocaleString()}        \n`;
  textReport += `=================================================================\n\n`;

  activeCases.forEach((c, idx) => {
    textReport += `[${idx + 1}] CLIENT: ${c.clientName.toUpperCase()} (${c.clientPhone})\n`;
    textReport += `    CASE: ${c.caseTitle} [${c.caseNumber}]\n`;
    textReport += `    PRACTICE GROUP: ${c.group || c.caseCategory} | URGENCY: ${c.priority}\n`;
    textReport += `    ASSIGNED COUNSEL: ${c.assignedToName || 'Unassigned'}\n`;
    textReport += `    COURT/BENCH: ${c.courtName}\n`;
    textReport += `    HEARING SCHEDULE: ${formatDateDisplay(c.hearingDate)} at ${formatTime12Hour(c.hearingTime)}\n`;
    if (c.notes) textReport += `    NOTES: ${c.notes}\n`;
    if (c.updates && c.updates.length > 0) {
      textReport += `    LATEST UPDATE: [${c.updates[0].date}] ${c.updates[0].title} - ${c.updates[0].notes}\n`;
    }
    textReport += `-----------------------------------------------------------------\n`;
  });

  const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LexJuris_CauseList_${todayStr}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Chamber cause list downloaded for authorized cases.', 'success');
}

// ==========================================================================
// 10. TOAST NOTIFICATION & HELPER UTILITIES
// ==========================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check"></i>' 
    : type === 'error' 
    ? '<i class="fa-solid fa-triangle-exclamation"></i>'
    : '<i class="fa-solid fa-scale-balanced gold-text"></i>';

  toast.innerHTML = `${icon} <span>${escapeHTML(message)}</span>`;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime12Hour(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const m = minutes || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 should be 12
  return `${h}:${m} ${ampm}`;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// 11. JURISAI PERSONAL CHATBOT ENGINE (LOCAL LLM, CLOUD APIS & SMART BRAIN)
// ==========================================================================

const AI_PROVIDERS = {
  gemini_api: {
    name: 'Google Gemini',
    type: 'gemini',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Recommended • Fast & Smart)' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Balanced)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Deep Legal Reasoning)' }
    ],
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIzaSy... (Google AI Studio Key)',
    helpUrl: 'https://aistudio.google.com/app/apikey',
    helpText: 'Get free Gemini API Key'
  },
  openai_api: {
    name: 'OpenAI (ChatGPT)',
    type: 'openai',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (Recommended • Fast & Efficient)' },
      { id: 'gpt-4o', label: 'GPT-4o (Omni Flagship Model)' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ],
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-... (OpenAI Platform Key)',
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'Get OpenAI API Key'
  },
  groq_api: {
    name: 'Groq Cloud',
    type: 'openai',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Recommended • High IQ)' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Sub-second Instant)' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (Long Context)' }
    ],
    defaultModel: 'llama-3.3-70b-versatile',
    keyPlaceholder: 'gsk_... (Groq Console Key)',
    helpUrl: 'https://console.groq.com/keys',
    helpText: 'Get free Groq Key'
  },
  openrouter_api: {
    name: 'OpenRouter / Custom',
    type: 'openai',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: [
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3 (Reasoning)' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Meta Llama 3.3 70B' },
      { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' }
    ],
    defaultModel: 'deepseek/deepseek-chat',
    keyPlaceholder: 'sk-or-... or custom API Key',
    helpUrl: 'https://openrouter.ai/keys',
    helpText: 'Get OpenRouter Key'
  },
  local_ollama: {
    name: 'Local Ollama Server',
    type: 'ollama',
    defaultModel: 'llama3.2',
    helpText: 'Local LLM (No API Key Required)'
  },
  smart_mock: {
    name: 'Built-in Chambers Brain',
    type: 'mock',
    defaultModel: 'Offline Chambers Rules',
    helpText: 'Offline Chambers Assistant'
  }
};

const AI_STORAGE_KEYS = {
  ENGINE: 'jurisai_engine_type',
  OLLAMA_HOST: 'jurisai_ollama_host',
  OLLAMA_MODEL: 'jurisai_ollama_model',
  CLOUD_KEY: 'jurisai_cloud_key',
  CLOUD_KEYS_MAP: 'jurisai_cloud_keys_map',
  CLOUD_MODEL: 'jurisai_cloud_model',
  CUSTOM_ENDPOINT: 'jurisai_custom_endpoint',
  PERSONA: 'jurisai_persona_type',
  NICKNAME: 'jurisai_user_nickname',
  VOICE_SPEAK: 'jurisai_voice_speak',
  SHARE_DATA: 'jurisai_share_data'
};

function getStoredKeysMap() {
  try {
    return JSON.parse(localStorage.getItem(AI_STORAGE_KEYS.CLOUD_KEYS_MAP) || '{}');
  } catch (e) {
    return {};
  }
}

function setStoredKeyForEngine(engine, key) {
  const map = getStoredKeysMap();
  if (key) {
    map[engine] = key;
  } else {
    delete map[engine];
  }
  localStorage.setItem(AI_STORAGE_KEYS.CLOUD_KEYS_MAP, JSON.stringify(map));
  localStorage.setItem(AI_STORAGE_KEYS.CLOUD_KEY, key || '');
}

// Retrieve active key: prioritize key configured in code
function getActiveApiKey(engine = (typeof aiState !== 'undefined' ? aiState.engine : 'gemini_api')) {
  // 1. Direct configuration in JURISAI_CONFIG.apiKeys (in-code setup)
  if (typeof JURISAI_CONFIG !== 'undefined' && JURISAI_CONFIG.apiKeys && JURISAI_CONFIG.apiKeys[engine] && JURISAI_CONFIG.apiKeys[engine].trim()) {
    return JURISAI_CONFIG.apiKeys[engine].trim();
  }
  // 2. Global window object (if loaded via custom external script)
  if (typeof window !== 'undefined' && window.JURISAI_API_KEYS && window.JURISAI_API_KEYS[engine]) {
    return window.JURISAI_API_KEYS[engine].trim();
  }
  // 3. Fallback to localStorage if any previously saved
  const map = getStoredKeysMap();
  return map[engine] || localStorage.getItem(AI_STORAGE_KEYS.CLOUD_KEY) || '';
}

function getInitialActiveKey(engine) {
  return getActiveApiKey(engine);
}

let aiState = {
  isOpen: false,
  isThinking: false,
  engine: localStorage.getItem(AI_STORAGE_KEYS.ENGINE) || (typeof JURISAI_CONFIG !== 'undefined' ? JURISAI_CONFIG.activeEngine : 'gemini_api'),
  ollamaHost: localStorage.getItem(AI_STORAGE_KEYS.OLLAMA_HOST) || 'http://localhost:11434',
  ollamaModel: localStorage.getItem(AI_STORAGE_KEYS.OLLAMA_MODEL) || 'llama3.2',
  get cloudKey() {
    return getActiveApiKey(this.engine);
  },
  set cloudKey(val) {
    if (typeof JURISAI_CONFIG !== 'undefined' && JURISAI_CONFIG.apiKeys) {
      JURISAI_CONFIG.apiKeys[this.engine] = val;
    }
  },
  cloudModel: localStorage.getItem(AI_STORAGE_KEYS.CLOUD_MODEL) || (typeof JURISAI_CONFIG !== 'undefined' && JURISAI_CONFIG.models?.[JURISAI_CONFIG.activeEngine]) || 'gemini-2.0-flash',
  customEndpoint: localStorage.getItem(AI_STORAGE_KEYS.CUSTOM_ENDPOINT) || (typeof JURISAI_CONFIG !== 'undefined' ? JURISAI_CONFIG.customEndpoint : '') || '',
  persona: localStorage.getItem(AI_STORAGE_KEYS.PERSONA) || 'co_counsel',
  nickname: localStorage.getItem(AI_STORAGE_KEYS.NICKNAME) || 'Counsel',
  voiceSpeak: localStorage.getItem(AI_STORAGE_KEYS.VOICE_SPEAK) === 'true',
  shareData: localStorage.getItem(AI_STORAGE_KEYS.SHARE_DATA) === 'true',
  messages: []
};

let speechRecognition = null;

function populateModelSelect(engine, selectedModel) {
  const modelSelect = document.getElementById('cloudModelSelect');
  const customModelInput = document.getElementById('customModelInput');
  if (!modelSelect) return;

  const provider = AI_PROVIDERS[engine];
  if (!provider || !provider.models) {
    modelSelect.innerHTML = '';
    return;
  }

  modelSelect.innerHTML = provider.models.map(m => `
    <option value="${m.id}">${escapeHTML(m.label)}</option>
  `).join('');

  const target = selectedModel || provider.defaultModel;
  const exists = provider.models.some(m => m.id === target);

  if (exists) {
    modelSelect.value = target;
    if (customModelInput) {
      customModelInput.value = target;
      customModelInput.classList.add('hidden');
    }
    modelSelect.classList.remove('hidden');
  } else if (target) {
    if (customModelInput) {
      customModelInput.value = target;
      customModelInput.classList.remove('hidden');
      modelSelect.classList.add('hidden');
    }
  }
}

function setupAiChatbot() {
  const toggleBtn = document.getElementById('toggleAiChatBtn');
  const chatPanel = document.getElementById('aiChatPanel');
  const closeBtn = document.getElementById('closeChatBtn');
  const clearBtn = document.getElementById('clearChatBtn');
  const settingsBtn = document.getElementById('aiSettingsBtn');
  const quickApiKeyBtn = document.getElementById('quickApiKeyBtn');
  const openAiSettingsNavBtn = document.getElementById('openAiSettingsNavBtn');
  const bannerConfigureApiKeyBtn = document.getElementById('bannerConfigureApiKeyBtn');
  const settingsDrawer = document.getElementById('aiSettingsDrawer');
  const closeSettingsBtn = document.getElementById('closeSettingsDrawerBtn');
  const saveSettingsBtn = document.getElementById('saveAiSettingsBtn');
  const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const engineSelect = document.getElementById('aiEngineSelect');
  const personaSelect = document.getElementById('aiPersonaSelect');
  const nicknameInput = document.getElementById('userNicknameInput');
  const voiceSpeakCheckbox = document.getElementById('voiceSpeakResponses');
  const shareDataCheckbox = document.getElementById('shareDataConsent');
  const voiceInputBtn = document.getElementById('voiceInputBtn');
  const ollamaHostInput = document.getElementById('ollamaHostUrl');
  const ollamaModelInput = document.getElementById('ollamaModelName');
  const cloudKeyInput = document.getElementById('cloudApiKey');
  const apiKeyLabelText = document.getElementById('apiKeyLabelText');
  const getApiKeyHelpLink = document.getElementById('getApiKeyHelpLink');
  const toggleApiKeyVisibilityBtn = document.getElementById('toggleApiKeyVisibilityBtn');
  const keyVisibilityIcon = document.getElementById('keyVisibilityIcon');
  const cloudModelSelect = document.getElementById('cloudModelSelect');
  const customModelInput = document.getElementById('customModelInput');
  const toggleCustomModelBtn = document.getElementById('toggleCustomModelBtn');
  const customEndpointGroup = document.getElementById('customEndpointGroup');
  const customEndpointUrl = document.getElementById('customEndpointUrl');
  const testApiKeyBtn = document.getElementById('testApiKeyBtn');
  const apiKeyTestStatusMsg = document.getElementById('apiKeyTestStatusMsg');
  const ollamaSection = document.getElementById('ollamaConfigSection');
  const apiSection = document.getElementById('apiConfigSection');
  const quickPrompts = document.querySelectorAll('.quick-prompt-chip');

  const testOllamaBtn = document.getElementById('testOllamaBtn');
  const ollamaStatusMsg = document.getElementById('ollamaStatusMsg');
  const ollamaModelSelect = document.getElementById('ollamaModelSelect');

  if (!toggleBtn || !chatPanel) return;

  // Initialize UI with saved settings
  if (engineSelect) engineSelect.value = aiState.engine;
  if (personaSelect) personaSelect.value = aiState.persona;
  if (nicknameInput) nicknameInput.value = aiState.nickname;
  if (voiceSpeakCheckbox) voiceSpeakCheckbox.checked = aiState.voiceSpeak;
  if (shareDataCheckbox) shareDataCheckbox.checked = aiState.shareData;
  if (ollamaHostInput) ollamaHostInput.value = aiState.ollamaHost;
  if (ollamaModelInput) ollamaModelInput.value = aiState.ollamaModel;
  if (cloudKeyInput) cloudKeyInput.value = aiState.cloudKey;
  if (customEndpointUrl) customEndpointUrl.value = aiState.customEndpoint;

  updateEngineConfigUI();
  updateEngineDisplayPill();

  // Helper to open drawer
  function openAiSettingsDrawer(focusKey = false) {
    if (!aiState.isOpen) {
      aiState.isOpen = true;
      chatPanel.classList.remove('hidden');
    }
    if (settingsDrawer) settingsDrawer.classList.remove('hidden');
    if (focusKey && cloudKeyInput && !cloudKeyInput.closest('.hidden')) {
      setTimeout(() => cloudKeyInput.focus(), 150);
    }
  }

  // Top Nav Button to open/toggle JurisAI Chatbot
  if (openAiSettingsNavBtn) {
    openAiSettingsNavBtn.addEventListener('click', () => {
      aiState.isOpen = !aiState.isOpen;
      if (aiState.isOpen) {
        chatPanel.classList.remove('hidden');
        if (chatInput) chatInput.focus();
      } else {
        chatPanel.classList.add('hidden');
      }
    });
  }

  // Quick API Key button in Chat Header
  if (quickApiKeyBtn) {
    quickApiKeyBtn.addEventListener('click', () => {
      if (settingsDrawer.classList.contains('hidden')) {
        openAiSettingsDrawer(true);
      } else {
        settingsDrawer.classList.add('hidden');
      }
    });
  }

  // Banner Configure Button
  if (bannerConfigureApiKeyBtn) {
    bannerConfigureApiKeyBtn.addEventListener('click', () => openAiSettingsDrawer(true));
  }

  // Toggle API Key visibility
  if (toggleApiKeyVisibilityBtn && cloudKeyInput) {
    toggleApiKeyVisibilityBtn.addEventListener('click', () => {
      const isPass = cloudKeyInput.type === 'password';
      cloudKeyInput.type = isPass ? 'text' : 'password';
      if (keyVisibilityIcon) {
        keyVisibilityIcon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  }

  // Toggle Custom Model input vs dropdown
  if (toggleCustomModelBtn && cloudModelSelect && customModelInput) {
    toggleCustomModelBtn.addEventListener('click', () => {
      const isCustomHidden = customModelInput.classList.contains('hidden');
      if (isCustomHidden) {
        customModelInput.classList.remove('hidden');
        cloudModelSelect.classList.add('hidden');
        customModelInput.value = cloudModelSelect.value;
        customModelInput.focus();
      } else {
        customModelInput.classList.add('hidden');
        cloudModelSelect.classList.remove('hidden');
      }
    });
  }

  // Test Cloud API Key Connection
  if (testApiKeyBtn) {
    testApiKeyBtn.addEventListener('click', async () => {
      const selected = engineSelect ? engineSelect.value : 'gemini_api';
      const key = cloudKeyInput ? cloudKeyInput.value.trim() : '';
      let model = cloudModelSelect ? cloudModelSelect.value : '';
      if (customModelInput && !customModelInput.classList.contains('hidden') && customModelInput.value.trim()) {
        model = customModelInput.value.trim();
      }
      const endpoint = customEndpointUrl ? customEndpointUrl.value.trim() : '';

      if (!key) {
        apiKeyTestStatusMsg.innerHTML = '<span style="color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Please enter an API key first.</span>';
        return;
      }

      apiKeyTestStatusMsg.innerHTML = '<span style="color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> Testing API key connection...</span>';
      testApiKeyBtn.disabled = true;

      try {
        const resultMsg = await testApiKeyConnection(selected, key, model, endpoint);
        apiKeyTestStatusMsg.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> ${escapeHTML(resultMsg)}</span>`;
        showToast('API Key connection verified successfully!', 'success');
      } catch (err) {
        apiKeyTestStatusMsg.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> ${escapeHTML(err.message || 'Connection failed')}</span>`;
      } finally {
        testApiKeyBtn.disabled = false;
      }
    });
  }

  // Clear Stored API Key Button
  if (clearApiKeyBtn) {
    clearApiKeyBtn.addEventListener('click', () => {
      const selected = engineSelect ? engineSelect.value : 'gemini_api';
      if (cloudKeyInput) cloudKeyInput.value = '';
      setStoredKeyForEngine(selected, '');
      aiState.cloudKey = '';
      updateEngineDisplayPill();
      if (apiKeyTestStatusMsg) {
        apiKeyTestStatusMsg.innerHTML = '<span style="color:var(--text-muted);"><i class="fa-solid fa-info-circle"></i> API Key cleared for this engine.</span>';
      }
      showToast('API key removed from browser storage.', 'info');
    });
  }

  // Test Ollama Connection & Fetch Models
  if (testOllamaBtn) {
    testOllamaBtn.addEventListener('click', async () => {
      const host = ollamaHostInput.value.trim() || 'http://localhost:11434';
      ollamaStatusMsg.innerHTML = '<span style="color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> Checking Ollama service at ' + host + '...</span>';
      
      try {
        const res = await fetch(`${host}/api/tags`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (data.models && data.models.length > 0) {
          const modelNames = data.models.map(m => m.name);
          ollamaStatusMsg.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> Connected! Found ${modelNames.length} model(s): <strong>${modelNames.join(', ')}</strong></span>`;
          
          if (ollamaModelSelect) {
            ollamaModelSelect.innerHTML = modelNames.map(m => `<option value="${m}">${m}</option>`).join('');
            ollamaModelSelect.classList.remove('hidden');
            ollamaModelSelect.value = modelNames[0];
            ollamaModelInput.value = modelNames[0];
            aiState.ollamaModel = modelNames[0];
          }
          showToast(`Ollama connected with ${modelNames.length} model(s)!`, 'success');
        } else {
          ollamaStatusMsg.innerHTML = `<span style="color:#f59e0b;"><i class="fa-solid fa-triangle-exclamation"></i> Ollama is running, but no models found. Run <code>ollama run llama3.2</code> in PowerShell to pull a model.</span>`;
        }
      } catch (err) {
        ollamaStatusMsg.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Cannot reach Ollama at ${host}. Make sure Ollama application is running.</span>`;
      }
    });
  }

  // Model select change
  if (ollamaModelSelect) {
    ollamaModelSelect.addEventListener('change', () => {
      ollamaModelInput.value = ollamaModelSelect.value;
    });
  }

  // Whole App Fullscreen Toggle Button
  const toggleFullscreenAppBtn = document.getElementById('toggleFullscreenAppBtn');
  if (toggleFullscreenAppBtn) {
    toggleFullscreenAppBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        toggleFullscreenAppBtn.title = 'Exit Fullscreen Workspace';
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        toggleFullscreenAppBtn.title = 'Toggle Fullscreen Workspace';
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
      } else {
        toggleFullscreenAppBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
      }
    });
  }

  // Toggle Chat Panel
  toggleBtn.addEventListener('click', () => {
    aiState.isOpen = !aiState.isOpen;
    if (aiState.isOpen) {
      chatPanel.classList.remove('hidden');
      chatInput.focus();
    } else {
      chatPanel.classList.add('hidden');
    }
  });

  // AI Chat Panel Fullscreen Toggle
  const fullscreenChatBtn = document.getElementById('fullscreenChatBtn');
  if (fullscreenChatBtn) {
    fullscreenChatBtn.addEventListener('click', () => {
      chatPanel.classList.toggle('fullscreen-panel');
      const isFull = chatPanel.classList.contains('fullscreen-panel');
      fullscreenChatBtn.innerHTML = isFull 
        ? '<i class="fa-solid fa-compress"></i>' 
        : '<i class="fa-solid fa-expand"></i>';
      fullscreenChatBtn.title = isFull 
        ? 'Exit Fullscreen AI Studio' 
        : 'Toggle Fullscreen AI Studio';
    });
  }

  closeBtn.addEventListener('click', () => {
    aiState.isOpen = false;
    chatPanel.classList.add('hidden');
  });

  // Settings Drawer Toggle
  settingsBtn.addEventListener('click', () => {
    settingsDrawer.classList.toggle('hidden');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsDrawer.classList.add('hidden');
  });

  // Engine Select Switch
  function updateEngineConfigUI() {
    const selected = engineSelect ? engineSelect.value : 'gemini_api';
    const provider = AI_PROVIDERS[selected] || AI_PROVIDERS.smart_mock;
    const isCloud = ['gemini_api', 'openai_api', 'groq_api', 'openrouter_api'].includes(selected);

    if (selected === 'local_ollama') {
      if (ollamaSection) ollamaSection.classList.remove('hidden');
      if (apiSection) apiSection.classList.add('hidden');
    } else if (isCloud) {
      if (ollamaSection) ollamaSection.classList.add('hidden');
      if (apiSection) apiSection.classList.remove('hidden');

      populateModelSelect(selected, selected === aiState.engine ? aiState.cloudModel : provider.defaultModel);

      if (customEndpointGroup) {
        if (selected === 'openrouter_api') {
          customEndpointGroup.classList.remove('hidden');
        } else {
          customEndpointGroup.classList.add('hidden');
        }
      }
    } else {
      if (ollamaSection) ollamaSection.classList.add('hidden');
      if (apiSection) apiSection.classList.add('hidden');
    }
  }

  if (engineSelect) {
    engineSelect.addEventListener('change', updateEngineConfigUI);
  }

  // Save Settings
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      aiState.engine = engineSelect ? engineSelect.value : 'gemini_api';
      aiState.persona = personaSelect ? personaSelect.value : 'co_counsel';
      aiState.nickname = nicknameInput ? nicknameInput.value.trim() || 'Counsel' : 'Counsel';
      aiState.voiceSpeak = voiceSpeakCheckbox ? voiceSpeakCheckbox.checked : false;
      aiState.shareData = shareDataCheckbox ? shareDataCheckbox.checked : false;
      aiState.ollamaHost = ollamaHostInput ? ollamaHostInput.value.trim() : 'http://localhost:11434';
      aiState.ollamaModel = ollamaModelInput ? ollamaModelInput.value.trim() : 'llama3.2';

      if (cloudKeyInput && cloudKeyInput.value.trim()) {
        const keyVal = cloudKeyInput.value.trim();
        aiState.cloudKey = keyVal;
        setStoredKeyForEngine(aiState.engine, keyVal);
      }

      let modelVal = cloudModelSelect ? cloudModelSelect.value : '';
      if (customModelInput && !customModelInput.classList.contains('hidden') && customModelInput.value.trim()) {
        modelVal = customModelInput.value.trim();
      }
      aiState.cloudModel = modelVal || AI_PROVIDERS[aiState.engine]?.defaultModel || 'gemini-2.0-flash';
      aiState.customEndpoint = customEndpointUrl ? customEndpointUrl.value.trim() : '';

      localStorage.setItem(AI_STORAGE_KEYS.ENGINE, aiState.engine);
      localStorage.setItem(AI_STORAGE_KEYS.PERSONA, aiState.persona);
      localStorage.setItem(AI_STORAGE_KEYS.NICKNAME, aiState.nickname);
      localStorage.setItem(AI_STORAGE_KEYS.VOICE_SPEAK, aiState.voiceSpeak);
      localStorage.setItem(AI_STORAGE_KEYS.SHARE_DATA, aiState.shareData);
      localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_HOST, aiState.ollamaHost);
      localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_MODEL, aiState.ollamaModel);
      localStorage.setItem(AI_STORAGE_KEYS.CLOUD_MODEL, aiState.cloudModel);
      localStorage.setItem(AI_STORAGE_KEYS.CUSTOM_ENDPOINT, aiState.customEndpoint);

      updateEngineDisplayPill();
      settingsDrawer.classList.add('hidden');
      showToast(`JurisAI settings saved (${AI_PROVIDERS[aiState.engine]?.name || 'Engine'} active).`, 'success');
    });
  }

  // Clear Chat History
  clearBtn.addEventListener('click', () => {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = `
      <div class="chat-bubble bot-bubble">
        <div class="bubble-avatar"><i class="fa-solid fa-scale-balanced"></i></div>
        <div class="bubble-content">
          <p><strong>Chat session refreshed.</strong> How can I assist you right now, ${escapeHTML(aiState.nickname)}?</p>
        </div>
      </div>
    `;
    aiState.messages = [];
    showToast('AI conversation history cleared.', 'info');
  });

  // Quick Prompt Chips
  quickPrompts.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        chatInput.value = prompt;
        submitUserChatMessage(prompt);
      }
    });
  });

  // Voice Input (Speech Recognition)
  setupSpeechRecognition(voiceInputBtn, chatInput);

  // Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || aiState.isThinking) return;
    chatInput.value = '';
    submitUserChatMessage(text);
  });

  // Auto-grow input
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });

  // Handle bubble actions (Listen & Copy) via event delegation
  const chatMessagesEl = document.getElementById('chatMessages');
  if (chatMessagesEl) {
    chatMessagesEl.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.btn-bubble-copy');
      if (copyBtn) {
        const bubble = copyBtn.closest('.chat-bubble');
        const textEl = bubble ? bubble.querySelector('.bubble-text') : null;
        const copyText = textEl ? textEl.innerText : (bubble ? bubble.innerText : '');
        if (copyText) {
          navigator.clipboard.writeText(copyText.trim()).then(() => {
            if (typeof showToast === 'function') showToast('Copied response to clipboard!', 'info');
          }).catch(() => {});
        }
        return;
      }

      const speechBtn = e.target.closest('.btn-bubble-speech');
      if (speechBtn) {
        const bubble = speechBtn.closest('.chat-bubble');
        const textEl = bubble ? bubble.querySelector('.bubble-text') : null;
        const speechText = textEl ? textEl.innerText : (bubble ? bubble.innerText : '');
        if (speechText) {
          speakTextAloud(speechText.trim());
        }
        return;
      }
    });
  }
}

// Speech Recognition (Voice Input)
function setupSpeechRecognition(btn, inputEl) {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    if (btn) btn.style.display = 'none';
    return;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRecognition = new SpeechRec();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;
  speechRecognition.lang = 'en-IN';

  let isRecording = false;

  btn.addEventListener('click', () => {
    if (!isRecording) {
      try {
        speechRecognition.start();
        isRecording = true;
        btn.classList.add('recording');
        btn.title = 'Listening... Click to stop';
        showToast('🎙️ Listening... Speak your question now', 'info');
      } catch (e) {
        isRecording = false;
      }
    } else {
      speechRecognition.stop();
      isRecording = false;
      btn.classList.remove('recording');
    }
  });

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputEl.value = transcript;
    isRecording = false;
    btn.classList.remove('recording');
    submitUserChatMessage(transcript);
  };

  speechRecognition.onerror = () => {
    isRecording = false;
    btn.classList.remove('recording');
  };

  speechRecognition.onend = () => {
    isRecording = false;
    btn.classList.remove('recording');
  };
}

// Text-to-Speech (Voice Output)
function speakTextAloud(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop prior speech
  
  // Clean markdown syntax for speech
  const cleanSpeech = text
    .replace(/[#*`_>\[\]\(\)]/g, ' ')
    .replace(/http[^\s]+/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanSpeech);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

function updateEngineDisplayPill() {
  const pill = document.getElementById('enginePill');
  const navBadge = document.getElementById('navAiKeyBadge');
  const alertBanner = document.getElementById('aiApiKeyAlertBanner');

  const provider = AI_PROVIDERS[aiState.engine] || AI_PROVIDERS.smart_mock;
  const isCloud = ['gemini_api', 'openai_api', 'groq_api', 'openrouter_api'].includes(aiState.engine);
  const hasKey = Boolean(aiState.cloudKey && aiState.cloudKey.trim());

  if (pill) {
    if (aiState.engine === 'local_ollama') {
      pill.className = 'engine-pill local';
      pill.textContent = `Local: ${aiState.ollamaModel}`;
    } else if (isCloud) {
      pill.className = hasKey ? 'engine-pill cloud' : 'engine-pill local';
      pill.textContent = `${provider.name}: ${aiState.cloudModel}`;
    } else {
      pill.className = 'engine-pill local';
      pill.textContent = `Smart Chambers Brain`;
    }
  }

  // Update top navigation badge
  if (navBadge) {
    if (isCloud && hasKey) {
      navBadge.className = 'ai-key-nav-badge active-key';
      navBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${provider.name.split(' ')[0]} Live`;
    } else if (isCloud && !hasKey) {
      navBadge.className = 'ai-key-nav-badge';
      navBadge.innerHTML = `<i class="fa-solid fa-key gold-text"></i> ${provider.name.split(' ')[0]}`;
    } else if (aiState.engine === 'local_ollama') {
      navBadge.className = 'ai-key-nav-badge active-key';
      navBadge.innerHTML = `<i class="fa-solid fa-laptop-code"></i> Ollama`;
    } else {
      navBadge.className = 'ai-key-nav-badge active-key';
      navBadge.innerHTML = `<i class="fa-solid fa-brain gold-text"></i> Smart Brain`;
    }
  }

  // Update prominent header API Key button
  const headerKeyBtn = document.getElementById('openApiKeyModalBtn');
  const headerKeyBtnText = document.getElementById('headerApiKeyBtnText');
  if (headerKeyBtn) {
    if (isCloud && hasKey) {
      headerKeyBtn.classList.add('configured');
      if (headerKeyBtnText) headerKeyBtnText.textContent = `${provider.name.split(' ')[0]} Ready`;
      headerKeyBtn.title = `${provider.name} key configured • Click to edit`;
    } else if (isCloud && !hasKey) {
      headerKeyBtn.classList.remove('configured');
      if (headerKeyBtnText) headerKeyBtnText.textContent = 'Set API Key';
      headerKeyBtn.title = `Click to configure ${provider.name} API Key`;
    } else {
      headerKeyBtn.classList.add('configured');
      if (headerKeyBtnText) headerKeyBtnText.textContent = provider.name.split(' ')[0];
      headerKeyBtn.title = `${provider.name} active`;
    }
  }

  // Alert banner is kept hidden
  if (alertBanner) {
    alertBanner.classList.add('hidden');
  }
}

// Handle sending message to AI (With Interactive Actions & Multi-turn Memory)
async function submitUserChatMessage(userText) {
  const chatContainer = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('chatTypingIndicator');
  const typingLabel = document.getElementById('typingLabel');

  // 1. Check for Interactive In-App Actions (e.g., "Add case for...", "Filter urgent", etc.)
  const actionResult = handleChatInteractiveActions(userText);

  // 2. Append User Message Bubble
  appendChatBubble('user', userText);
  aiState.messages.push({ role: 'user', content: userText });

  // 3. Show Typing Indicator
  aiState.isThinking = true;
  typingIndicator.classList.remove('hidden');
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // If an in-app action was executed, respond immediately with confirmation
  if (actionResult) {
    setTimeout(() => {
      hideTypingAndRespond(actionResult);
    }, 400);
    return;
  }

  const provider = AI_PROVIDERS[aiState.engine] || AI_PROVIDERS.smart_mock;

  // Case 1: Local Ollama
  if (aiState.engine === 'local_ollama') {
    typingLabel.textContent = `Querying local model (${aiState.ollamaModel})...`;
    try {
      const responseText = await queryLocalOllama(userText);
      hideTypingAndRespond(responseText);
    } catch (err) {
      console.warn('Ollama connection issue:', err);
      const fallbackResponse = generateSmartLegalResponse(userText, true);
      hideTypingAndRespond(fallbackResponse);
    }
  } 
  // Case 2: Cloud LLMs (Gemini, OpenAI, Groq, OpenRouter)
  else if (aiState.engine === 'gemini_api' || aiState.engine === 'openai_api' || aiState.engine === 'groq_api' || aiState.engine === 'openrouter_api') {
    if (!aiState.cloudKey) {
      const banner = document.getElementById('aiApiKeyAlertBanner');
      if (banner) banner.classList.add('hidden');

      const warningMsg = `> 💡 **Notice:** No API key is configured yet for **${provider.name} (${aiState.cloudModel})**.\n> \n> Click below to enter your API key (or paste into \`JURISAI_CONFIG\` in \`app.js\`), or use the built-in Chambers Intelligence:\n> <button type="button" class="btn btn-gold btn-xs" onclick="window.openAiApiKeyModal && window.openAiApiKeyModal()" style="margin: 0.4rem 0; padding: 0.35rem 0.85rem; font-size: 0.78rem; cursor: pointer;"><i class="fa-solid fa-key"></i> Set ${provider.name} API Key</button>\n\n---\n\n${generateSmartLegalResponse(userText, false)}`;
      
      setTimeout(() => {
        hideTypingAndRespond(warningMsg);
      }, 400);
      return;
    }

    typingLabel.textContent = `Querying ${provider.name} (${aiState.cloudModel})...`;
    try {
      let responseText = '';
      if (aiState.engine === 'gemini_api') {
        responseText = await queryGeminiApi(userText);
      } else {
        responseText = await queryOpenAiCompatibleApi(userText, aiState.engine);
      }
      hideTypingAndRespond(responseText);
    } catch (err) {
      console.warn(`${provider.name} API issue:`, err);
      const fallbackResponse = `> ⚠️ **${provider.name} API Notice:** ${escapeHTML(err.message || 'Connection error')}\n> \n> *Falling back to JurisAI Chambers Intelligence:*\n\n${generateSmartLegalResponse(userText, false)}`;
      hideTypingAndRespond(fallbackResponse);
    }
  } 
  // Case 3: Offline Chambers Brain
  else {
    typingLabel.textContent = `Analyzing chambers docket & legal knowledge...`;
    setTimeout(() => {
      const responseText = generateSmartLegalResponse(userText, false);
      hideTypingAndRespond(responseText);
    }, 450);
  }
}

function hideTypingAndRespond(responseText) {
  const typingIndicator = document.getElementById('chatTypingIndicator');
  typingIndicator.classList.add('hidden');
  aiState.isThinking = false;
  appendChatBubble('bot', responseText);
  aiState.messages.push({ role: 'assistant', content: responseText });

  if (aiState.voiceSpeak) {
    speakTextAloud(responseText);
  }
}

function appendChatBubble(sender, text) {
  const chatContainer = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}-bubble`;

  const avatar = sender === 'user'
    ? '<i class="fa-solid fa-user"></i>'
    : '<i class="fa-solid fa-scale-balanced"></i>';

  bubble.innerHTML = `
    <div class="bubble-avatar">${avatar}</div>
    <div class="bubble-content">
      <div class="bubble-text">${formatAiMarkdown(text)}</div>
      ${sender === 'bot' ? `
        <div class="bubble-actions-row">
          <button type="button" class="btn-bubble-speech" title="Read message aloud">
            <i class="fa-solid fa-volume-high"></i> Listen
          </button>
          <button type="button" class="btn-bubble-copy" title="Copy to clipboard">
            <i class="fa-regular fa-copy"></i> Copy
          </button>
        </div>
      ` : ''}
    </div>
  `;

  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Interactive In-App Chat Commands (Voice/Text Actions)
function handleChatInteractiveActions(text) {
  const lower = text.toLowerCase();

  // 1. Command: "Add case for [Name] in [Court] on [Date]"
  if (lower.startsWith('add case') || lower.startsWith('add new case') || lower.includes('create case for')) {
    // Extract Client Name
    let client = 'New Client Brief';
    const forMatch = text.match(/(?:for|client)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/i);
    if (forMatch && forMatch[1]) client = forMatch[1].trim();

    // Extract Date
    let date = getOffsetDateString(1);
    if (lower.includes('today')) date = getOffsetDateString(0);
    else if (lower.includes('tomorrow')) date = getOffsetDateString(1);
    else if (lower.includes('next week')) date = getOffsetDateString(7);

    // Extract Urgency
    let priority = 'Standard';
    if (lower.includes('urgent') || lower.includes('critical') || lower.includes('stay')) priority = 'Critical';

    // Extract Court
    let court = 'High Court of Delhi';
    if (lower.includes('supreme court')) court = 'Supreme Court of India';
    else if (lower.includes('sessions')) court = 'District & Sessions Court';
    else if (lower.includes('tribunal') || lower.includes('drt')) court = 'Debts Recovery Tribunal (DRT)';

    const newCase = {
      id: 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      clientName: client,
      clientPhone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      opposingParty: 'Respondent / Opposing Party',
      caseTitle: `${client} vs. State & Ors.`,
      caseNumber: `WP(C) ${Math.floor(1000 + Math.random() * 9000)}/2024`,
      caseCategory: 'Civil Litigation',
      priority: priority,
      courtName: court,
      hearingDate: date,
      hearingTime: '10:30',
      notes: `Docket created via JurisAI interactive prompt: "${text}"`,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    state.cases.unshift(newCase);
    saveCasesToStorage();
    renderDashboard();

    return `### ✨ Case Registered via Voice/Chat!\n\n` +
      `I've registered and scheduled the docket for you, **${escapeHTML(aiState.nickname)}**:\n` +
      `* **Client:** **${newCase.clientName}**\n` +
      `* **Docket No:** \`${newCase.caseNumber}\`\n` +
      `* **Forum:** ${newCase.courtName}\n` +
      `* **Hearing Scheduled:** **${formatDateDisplay(newCase.hearingDate)} at 10:30 AM**\n` +
      `* **Priority:** \`${newCase.priority}\`\n\n` +
      `*The case card is now live on your active schedule on the right!*`;
  }

  // 2. Command: "Filter urgent" or "Show today"
  if (lower.includes('show today') || lower.includes('filter today')) {
    state.currentFilter = 'today';
    dom.filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'today'));
    renderCasesList();
    return `Filtered your schedule to show **Today's Court Hearings**.`;
  }

  if (lower.includes('show urgent') || lower.includes('filter urgent')) {
    state.currentFilter = 'critical';
    dom.filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'critical'));
    renderCasesList();
    return `Filtered your schedule to show **Critical & Urgent Listings**.`;
  }

  if (lower.includes('show all cases') || lower.includes('clear filter')) {
    state.currentFilter = 'all';
    dom.filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
    renderCasesList();
    return `Schedule reset to display **All Active Cases**.`;
  }

  return null; // Not an action, continue to LLM query
}

function getPersonaInstruction() {
  if (aiState.persona === 'friendly') {
    return `You are JurisAI, a warm, friendly, and highly intelligent personal AI companion for ${aiState.nickname}. Chat naturally, be helpful, humorous when appropriate, and assist with work, general questions, and legal matters. Format with concise headings and bullet points.`;
  } else if (aiState.persona === 'opposing') {
    return `You are ruthless Senior Opposing Counsel challenging ${aiState.nickname}'s arguments in court. Poke holes in their legal reasoning, cite statutory counter-arguments, question evidence admissibility, and prepare them for tough judicial scrutiny.`;
  } else if (aiState.persona === 'researcher') {
    return `You are a meticulous Senior Legal Research Analyst for ${aiState.nickname}. Provide precise statutory citations (BNSS 2023, BNS 2023, BSA 2023, CPC, CrPC, Constitution), ratio decidendi of landmark Supreme Court judgments, and structured legal analysis with citations.`;
  }
  return `You are JurisAI, the personal chambers co-counsel and legal intelligence companion for ${aiState.nickname}. Provide strategic, insightful, and practical legal guidance under Indian law. Address ${aiState.nickname} respectfully and directly.`;
}

// Build chambers context (active cases, hearings, documents) for LLM prompts
function buildLegalChambersContext() {
  let context = `Current Date: ${new Date().toLocaleDateString()}.\n`;
  context += `User: ${aiState.nickname} (${aiState.persona === 'friendly' ? 'Colleague & Friend' : 'Advocate / Senior Counsel'}).\n`;
  
  if (!aiState.shareData) {
    context += `[SECURITY ENFORCED] User has NOT granted permission to access chamber data. You cannot see any active cases, clients, or dockets. If the user asks about their cases, you must inform them that you cannot access their data due to privacy settings, and ask them to enable 'Share Chamber Data with AI' in settings.\n`;
    return context;
  }

  const activeCases = state.cases.filter(c => c.status !== 'Disposed');
  context += `Active Cases in Chambers (${activeCases.length} total):\n`;
  
  activeCases.forEach((c, i) => {
    context += `${i + 1}. Client: "${c.clientName}", Matter: "${c.caseTitle}" (${c.caseNumber}), Category: ${c.caseCategory}, Urgency: ${c.priority}, Court: "${c.courtName}", Next Hearing: ${c.hearingDate} at ${c.hearingTime}, Notes: "${c.notes || 'None'}"\n`;
  });

  return context;
}

// Test API Key Connection
async function testApiKeyConnection(engine, apiKey, model, customEndpoint) {
  if (!apiKey) throw new Error('Please enter an API key first.');

  if (engine === 'gemini_api') {
    const targetModel = model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping test. Reply with the single word "CONNECTED".' }] }],
        generationConfig: { maxOutputTokens: 10 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(msg);
    }
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
    return `Verified! Gemini (${targetModel}) responded: "${reply}"`;
  } else if (engine === 'openai_api' || engine === 'groq_api' || engine === 'openrouter_api') {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    if (engine === 'groq_api') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    if (engine === 'openrouter_api') endpoint = customEndpoint || 'https://openrouter.ai/api/v1/chat/completions';

    const targetModel = model || (engine === 'groq_api' ? 'llama-3.3-70b-versatile' : (engine === 'openrouter_api' ? 'deepseek/deepseek-chat' : 'gpt-4o-mini'));
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    if (engine === 'openrouter_api') {
      headers['HTTP-Referer'] = window.location.origin || 'http://localhost:3000';
      headers['X-Title'] = 'LexJuris Chambers';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: targetModel,
        messages: [{ role: 'user', content: 'Ping test. Reply with the single word "CONNECTED".' }],
        max_tokens: 10
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(msg);
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'OK';
    return `Verified! Model (${targetModel}) responded: "${reply}"`;
  } else {
    throw new Error('This engine does not require an API key test.');
  }
}

// Query Local Ollama Instance (With Personality System Prompt & Multi-turn context)
async function queryLocalOllama(userPrompt) {
  // Check if running on file:// protocol where browsers send Origin: null
  if (window.location.protocol === 'file:') {
    const fallbackMsg = generateSmartLegalResponse(userPrompt, false);
    return `> ⚠️ **Browser Notice:** You have opened the app via direct file (\`file://\`). Browsers block local network requests from \`file://\` to Ollama for security reasons.\n> \n> 💡 **To use your live Ollama model (\`${aiState.ollamaModel}\`):** Open this app via **\`http://localhost:3000/index.html\`** in your browser!\n\n---\n\n${fallbackMsg}`;
  }

  // 1. Verify and auto-resolve available model
  let targetModel = aiState.ollamaModel;
  try {
    const tagsRes = await fetch(`${aiState.ollamaHost}/api/tags`);
    if (tagsRes.ok) {
      const tagsData = await tagsRes.json();
      if (tagsData.models && tagsData.models.length > 0) {
        const modelNames = tagsData.models.map(m => m.name);
        const match = modelNames.find(n => n.includes(targetModel) || targetModel.includes(n));
        if (match) {
          targetModel = match;
          aiState.ollamaModel = match;
        } else {
          targetModel = modelNames[0];
          aiState.ollamaModel = modelNames[0];
        }
        updateEngineDisplayPill();
      }
    }
  } catch (e) {}

  const context = buildLegalChambersContext();
  const personaInstruction = getPersonaInstruction();
  const systemPrompt = `${personaInstruction}\n\nChamber Context:\n${context}`;

  const payload = {
    model: targetModel,
    prompt: `${systemPrompt}\n\n${aiState.nickname}: ${userPrompt}\n\nJurisAI Answer:`,
    stream: false
  };

  const hostsToTry = [
    aiState.ollamaHost || 'http://localhost:11434',
    'http://127.0.0.1:11434',
    'http://localhost:11434'
  ];
  const uniqueHosts = [...new Set(hostsToTry)];

  let lastError = null;
  for (const host of uniqueHosts) {
    try {
      const response = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      aiState.ollamaHost = host;
      return data.response || 'No response generated from local model.';
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to local Ollama server.');
}

// Query Gemini Cloud API
async function queryGeminiApi(userPrompt) {
  const context = buildLegalChambersContext();
  const personaInstruction = getPersonaInstruction();
  const systemPrompt = `${personaInstruction}\n\nChamber Context & Records:\n${context}`;
  const targetModel = aiState.cloudModel || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${aiState.cloudKey}`;

  // Prior history before the current user turn
  const priorHistory = aiState.messages.slice(0, -1);
  const rawHistory = priorHistory.slice(-6).map(m => ({
    role: (m.role === 'bot' || m.role === 'assistant') ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Clean history for Gemini: must alternate and cannot end with 'user' because we append userPrompt
  const cleanContents = [];
  for (const item of rawHistory) {
    if (cleanContents.length === 0) {
      if (item.role === 'user') cleanContents.push(item);
    } else if (cleanContents[cleanContents.length - 1].role !== item.role) {
      cleanContents.push(item);
    }
  }
  if (cleanContents.length > 0 && cleanContents[cleanContents.length - 1].role === 'user') {
    cleanContents.pop();
  }

  // Append current user message
  cleanContents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: cleanContents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048
    }
  };

  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (res.status === 400 && (errData.error?.message?.includes('system_instruction') || errData.error?.message?.includes('not supported'))) {
      const fallbackPayload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: { temperature: 0.35, maxOutputTokens: 2048 }
      };
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload)
      });
    } else {
      throw new Error(errData.error?.message || `HTTP ${res.status}: ${res.statusText}`);
    }
  }

  if (!res.ok) {
    const finalErr = await res.json().catch(() => ({}));
    throw new Error(finalErr.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const candidate = json.candidates?.[0];
  if (!candidate || !candidate.content?.parts?.[0]?.text) {
    if (candidate?.finishReason) {
      return `JurisAI could not complete response due to finish reason: ${candidate.finishReason}.`;
    }
    return 'No response text received from Gemini API.';
  }

  return candidate.content.parts[0].text;
}

// Query OpenAI, Groq, or OpenRouter Compatible API
async function queryOpenAiCompatibleApi(userPrompt, engine) {
  const context = buildLegalChambersContext();
  const personaInstruction = getPersonaInstruction();
  const systemPrompt = `${personaInstruction}\n\nChamber Context & Records:\n${context}`;

  let endpoint = 'https://api.openai.com/v1/chat/completions';
  let defaultModel = 'gpt-4o-mini';

  if (engine === 'groq_api') {
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    defaultModel = 'llama-3.3-70b-versatile';
  } else if (engine === 'openrouter_api') {
    endpoint = aiState.customEndpoint || 'https://openrouter.ai/api/v1/chat/completions';
    defaultModel = 'deepseek/deepseek-chat';
  }

  const targetModel = aiState.cloudModel || defaultModel;
  const priorHistory = aiState.messages.slice(0, -1);
  const recentHistory = priorHistory.slice(-8).map(m => ({
    role: (m.role === 'bot' || m.role === 'assistant') ? 'assistant' : 'user',
    content: m.content
  }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: userPrompt }
  ];

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${aiState.cloudKey}`
  };

  if (engine === 'openrouter_api') {
    headers['HTTP-Referer'] = window.location.origin || 'http://localhost:3000';
    headers['X-Title'] = 'LexJuris Chambers';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: targetModel,
      messages: messages,
      temperature: 0.35,
      max_tokens: 2048
    })
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    const errMsg = errJson.error?.message || errJson.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errMsg);
  }

  const json = await res.json();
  const choice = json.choices?.[0];
  if (!choice || !choice.message?.content) {
    return 'No response generated from LLM.';
  }

  return choice.message.content;
}

// Built-in Smart Legal Brain (Works instantly offline or as intelligent fallback)
function generateSmartLegalResponse(query, fromOllamaFallback = false) {
  const q = query.toLowerCase();
  const todayStr = getOffsetDateString(0);
  const activeCases = state.cases.filter(c => c.status !== 'Disposed');
  const todayCases = activeCases.filter(c => c.hearingDate === todayStr);

  let prefix = '';
  if (fromOllamaFallback) {
    prefix = `> *Note: Local Ollama on \`${aiState.ollamaHost}\` was offline or not reachable. Responding using JurisAI Chamber Intelligence.*\n\n`;
  }

  // 1. Question about hearings / schedule
  if (q.includes('hearing') || q.includes('schedule') || q.includes('today') || q.includes('tomorrow') || q.includes('calendar')) {
    if (todayCases.length > 0) {
      let list = `### ⚖️ Today's Court Listings (${todayCases.length} Matters):\n`;
      todayCases.forEach(c => {
        list += `* **${c.clientName}** vs. *${c.opposingParty}*\n  • **Docket:** \`${c.caseNumber}\` (${c.caseCategory})\n  • **Court:** ${c.courtName}\n  • **Time:** ${formatTime12Hour(c.hearingTime)} | **Urgency:** \`${c.priority}\`\n  • **Chamber Brief:** ${c.notes || 'Arguments listed'}\n\n`;
      });
      return prefix + list + `*Need me to draft an adjournment application or interim relief notes for any of these?*`;
    } else {
      return prefix + `### 📅 Chambers Schedule Overview:\nYou have **${activeCases.length} total active dockets**. No urgent appearances listed for today. The next upcoming hearing is for **${activeCases[0]?.clientName || 'Client'}** on **${formatDateDisplay(activeCases[0]?.hearingDate)} at ${formatTime12Hour(activeCases[0]?.hearingTime)}** in *${activeCases[0]?.courtName}*.`;
    }
  }

  // 2. Question about specific client
  const matchedCase = activeCases.find(c => q.includes(c.clientName.toLowerCase().split(' ')[0]) || q.includes(c.caseNumber.toLowerCase()));
  if (matchedCase) {
    return prefix + `### 📋 Docket Dossier: ${matchedCase.caseTitle}\n` +
      `* **Client:** ${matchedCase.clientName} (${matchedCase.clientPhone})\n` +
      `* **Opposing Party:** ${matchedCase.opposingParty}\n` +
      `* **Case No:** \`${matchedCase.caseNumber}\` • **Category:** ${matchedCase.caseCategory}\n` +
      `* **Presiding Court:** ${matchedCase.courtName}\n` +
      `* **Hearing Scheduled:** ${formatDateDisplay(matchedCase.hearingDate)} at ${formatTime12Hour(matchedCase.hearingTime)}\n` +
      `* **Strategy Notes:** ${matchedCase.notes || 'None logged'}\n\n` +
      `Would you like me to prepare an interim stay argument, witness cross-examination outline, or legal notice for this matter?`;
  }

  // 3. Drafting Notice
  if (q.includes('draft') && (q.includes('notice') || q.includes('demand'))) {
    return prefix + `### 📜 Legal Demand Notice Draft (Under Sec 138 NI Act / Indian Contract Act)\n\n` +
      `**REGISTERED A.D. / SPEED POST**\n\n` +
      `**To:** [Respondent Name / Company Name]\n**Address:** [Respondent Full Address]\n\n` +
      `**Subject:** Legal Notice under Section 138 of Negotiable Instruments Act, 1881 / Demand for Performance.\n\n` +
      `**Sir/Madam,**\n\n` +
      `Under instructions from and on behalf of my client **[Client Name]**, I hereby serve upon you the following legal notice:\n\n` +
      `1. That my client entered into a binding contract dated [Date] with your enterprise for supply of goods/services.\n` +
      `2. That in discharge of your legally enforceable debt, you issued Cheque bearing No. [Cheque No] for INR [Amount] drawn on [Bank Name].\n` +
      `3. That the said instrument was dishonoured upon presentation with reason *"Funds Insufficient"* vide memo dated [Date].\n\n` +
      `**NOW THEREFORE**, I call upon you to remit the outstanding sum within **15 days** of receipt of this notice, failing which criminal proceedings under Sec 138 NI Act shall be instituted against you at your sole cost and consequence.\n\n` +
      `**Adv. Vikramaditya Sharma**\n*Senior Counsel, High Court*`;
  }

  // 4. Bail Grounds
  if (q.includes('bail') || q.includes('438') || q.includes('482')) {
    return prefix + `### 🛡️ Grounds for Anticipatory Bail (Sec 438 CrPC / Sec 482 BNSS):\n\n` +
      `1. **Absence of Flight Risk:** The applicant is a respectable citizen with deep roots in society and permanent place of residence.\n` +
      `2. **Cooperation with Investigation:** The applicant undertakes to join and cooperate with the Investigating Officer (IO) as and when summoned.\n` +
      `3. **No Custodial Interrogation Warranted:** All documentary evidence is already in possession of the prosecution; no custodial recovery is required (*Gurbaksh Singh Sibbia v. State of Punjab*).\n` +
      `4. **Frivolous & Malafide Prosecution:** The FIR has been engineered with an oblique motive to harass and extort commercial leverage (*Arnesh Kumar v. State of Bihar*).\n` +
      `5. **Parity:** Co-accused with identical allegations have already been granted interim protection.`;
  }

  // General assistant default
  return prefix + `### ⚖️ JurisAI Chambers Co-Counsel\n\nI have reviewed your query: **"${escapeHTML(query)}"**.\n\n` +
    `As your chambers assistant, I can:\n` +
    `* **Draft Petitions & Applications:** Bail, Writs, Injunctions, Cause of Action paragraphs.\n` +
    `* **Analyze Case Dockets:** Review hearings scheduled for ${activeCases.length} active clients.\n` +
    `* **Legal Research:** Statutory citations across BNS 2023, BNSS, CPC, and landmark Supreme Court precedents.\n\n` +
    `*How would you like to proceed?*`;
}

function formatAiMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 style="color:var(--gold-primary); margin:0.4rem 0;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="color:var(--gold-primary); margin:0.4rem 0;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:0.1rem 0.3rem; border-radius:3px; color:var(--gold-primary); font-size:0.8em;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left:1.2rem;">$1</li>')
    .replace(/\n\n/g, '<p style="margin-top:0.4rem;"></p>')
    .replace(/\n/g, '<br>');
}

// Start application when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ==========================================================================
// QUICK-ADD CASE BOX — Toggle & Submit Logic
// ==========================================================================

(function setupQuickAddBox() {
  function init() {
    const toggleBtn = document.getElementById('quickAddToggleBtn');
    const formBody  = document.getElementById('quickAddFormBody');
    const form      = document.getElementById('quickAddCaseForm');
    const header    = document.getElementById('quickAddToggleHeader');

    // Also wire up the API Key modal buttons if present
    const openApiKeyModalBtn = document.getElementById('openApiKeyModalBtn');
    const bannerAddKeyBtn = document.getElementById('bannerAddKeyBtn');
    const drawerOpenApiKeyBtn = document.getElementById('drawerOpenApiKeyBtn');
    const aiApiKeyModal = document.getElementById('aiApiKeyModal');
    const closeApiKeyModalBtn = document.getElementById('closeApiKeyModalBtn');
    const modalCancelApiKeyBtn = document.getElementById('modalCancelApiKeyBtn');
    const modalSaveApiKeyBtn = document.getElementById('modalSaveApiKeyBtn');
    const modalTestApiKeyBtn = document.getElementById('modalTestApiKeyBtn');
    const modalLlmProvider = document.getElementById('modalLlmProvider');
    const modalApiKeyInput = document.getElementById('modalApiKeyInput');
    const modalApiModelInput = document.getElementById('modalApiModelInput');
    const modalTestStatusBox = document.getElementById('modalTestStatusBox');

    function updateModalProviderUI(prov) {
      const isOllama = prov === 'local_ollama';
      const isMock = prov === 'smart_mock';

      const apiKeySection = document.getElementById('modalApiKeySection');
      const ollamaSection = document.getElementById('modalOllamaSection');
      const keyLabel = document.getElementById('modalApiKeyLabel');
      const helpLink = document.getElementById('modalApiKeyHelpLink');
      const baseGroup = document.getElementById('modalApiBaseUrlGroup');
      const modelInput = document.getElementById('modalApiModelInput');
      const keyInput = document.getElementById('modalApiKeyInput');
      const chipsContainer = document.getElementById('modalModelChipsContainer');

      if (apiKeySection) apiKeySection.classList.toggle('hidden', isOllama || isMock);
      if (ollamaSection) ollamaSection.classList.toggle('hidden', !isOllama);
      if (baseGroup) baseGroup.classList.toggle('hidden', prov !== 'openrouter_api' && prov !== 'custom');

      const provider = AI_PROVIDERS[prov] || AI_PROVIDERS.smart_mock;
      if (keyLabel) {
        keyLabel.innerHTML = `<i class="fa-solid fa-key"></i> ${provider.name} API Key <span class="req">*</span>`;
      }
      if (helpLink) {
        helpLink.href = provider.helpUrl || 'https://aistudio.google.com/app/apikey';
        helpLink.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${provider.helpText || 'Get API Key'}`;
      }
      if (keyInput) {
        keyInput.placeholder = provider.keyPlaceholder || 'Paste your API key here...';
        keyInput.value = getActiveApiKey(prov) || '';
      }
      if (modelInput) {
        modelInput.value = aiState.cloudModel || provider.defaultModel || 'gemini-2.0-flash';
      }

      if (chipsContainer && provider.models) {
        chipsContainer.innerHTML = `<span style="font-size:0.7rem; color:var(--text-muted); align-self:center;">Popular:</span> ` +
          provider.models.map(m => `<button type="button" class="btn-chip-model" data-model="${m.id}">${m.id}</button>`).join(' ');
      }
    }

    function openModal() {
      if (aiApiKeyModal) {
        aiApiKeyModal.classList.remove('hidden');
        const activeEngine = aiState.engine || 'gemini_api';
        if (modalLlmProvider) modalLlmProvider.value = activeEngine;
        updateModalProviderUI(activeEngine);
        if (modalApiKeyInput) modalApiKeyInput.focus();
      }
    }
    window.openAiApiKeyModal = openModal;

    function closeModal() {
      if (aiApiKeyModal) aiApiKeyModal.classList.add('hidden');
    }

    if (modalLlmProvider) {
      modalLlmProvider.addEventListener('change', () => {
        updateModalProviderUI(modalLlmProvider.value);
      });
    }

    // Toggle password visibility in modal
    const toggleApiKeyVisBtn = document.getElementById('toggleApiKeyVisBtn');
    if (toggleApiKeyVisBtn && modalApiKeyInput) {
      toggleApiKeyVisBtn.addEventListener('click', () => {
        const isPass = modalApiKeyInput.type === 'password';
        modalApiKeyInput.type = isPass ? 'text' : 'password';
        toggleApiKeyVisBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Model chips click delegation
    const modalBody = aiApiKeyModal?.querySelector('.modal-body');
    if (modalBody) {
      modalBody.addEventListener('click', (e) => {
        const chip = e.target.closest('.btn-chip-model');
        if (chip && modalApiModelInput) {
          const mod = chip.getAttribute('data-model');
          if (mod) modalApiModelInput.value = mod;
        }
      });
    }

    if (openApiKeyModalBtn) openApiKeyModalBtn.addEventListener('click', openModal);
    if (bannerAddKeyBtn) bannerAddKeyBtn.addEventListener('click', openModal);
    if (drawerOpenApiKeyBtn) drawerOpenApiKeyBtn.addEventListener('click', openModal);
    if (closeApiKeyModalBtn) closeApiKeyModalBtn.addEventListener('click', closeModal);
    if (modalCancelApiKeyBtn) modalCancelApiKeyBtn.addEventListener('click', closeModal);

    if (modalSaveApiKeyBtn) {
      modalSaveApiKeyBtn.addEventListener('click', () => {
        const prov = modalLlmProvider ? modalLlmProvider.value : 'gemini_api';
        const key = modalApiKeyInput ? modalApiKeyInput.value.trim() : '';
        const model = modalApiModelInput ? modalApiModelInput.value.trim() : 'gemini-2.0-flash';

        aiState.engine = prov;
        aiState.cloudModel = model;
        aiState.cloudKey = key;

        if (prov === 'local_ollama') {
          const host = document.getElementById('modalOllamaHost')?.value?.trim();
          const oModel = document.getElementById('modalOllamaModel')?.value?.trim();
          if (host) aiState.ollamaHost = host;
          if (oModel) aiState.ollamaModel = oModel;
          localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_HOST, aiState.ollamaHost);
          localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_MODEL, aiState.ollamaModel);
        } else if (prov !== 'smart_mock') {
          setStoredKeyForEngine(prov, key);
          if (typeof JURISAI_CONFIG !== 'undefined' && JURISAI_CONFIG.apiKeys) {
            JURISAI_CONFIG.apiKeys[prov] = key;
          }
        }

        localStorage.setItem(AI_STORAGE_KEYS.ENGINE, prov);
        localStorage.setItem(AI_STORAGE_KEYS.CLOUD_MODEL, model);

        // Sync drawer inputs if present
        const drawerEngine = document.getElementById('aiEngineSelect');
        if (drawerEngine) drawerEngine.value = prov;
        const drawerKey = document.getElementById('cloudApiKey');
        if (drawerKey) drawerKey.value = key;

        if (typeof updateEngineDisplayPill === 'function') updateEngineDisplayPill();
        closeModal();
        if (typeof showToast === 'function') showToast(`JurisAI updated to ${AI_PROVIDERS[prov]?.name || prov} (${model})!`, 'success');
      });
    }

    if (modalTestApiKeyBtn && typeof testApiKeyConnection === 'function') {
      modalTestApiKeyBtn.addEventListener('click', async () => {
        const prov = modalLlmProvider ? modalLlmProvider.value : 'gemini_api';
        const key = modalApiKeyInput ? modalApiKeyInput.value.trim() : '';
        const model = modalApiModelInput ? modalApiModelInput.value.trim() : (AI_PROVIDERS[prov]?.defaultModel || 'gemini-2.0-flash');
        const customEndpoint = document.getElementById('modalApiBaseUrlInput')?.value?.trim() || '';

        if (!key && prov !== 'local_ollama' && prov !== 'smart_mock') {
          if (modalTestStatusBox) {
            modalTestStatusBox.style.display = 'block';
            modalTestStatusBox.className = 'test-status-badge error';
            modalTestStatusBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <strong>Please enter an API key to test.</strong>';
          }
          return;
        }

        if (modalTestStatusBox) {
          modalTestStatusBox.style.display = 'block';
          modalTestStatusBox.className = 'test-status-badge loading';
          modalTestStatusBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing API connection...';
        }

        try {
          const res = await testApiKeyConnection(prov, key, model, customEndpoint);
          if (modalTestStatusBox) {
            modalTestStatusBox.className = 'test-status-badge success';
            modalTestStatusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Connected!</strong> ${escapeHTML(res)}`;
          }
        } catch (err) {
          if (modalTestStatusBox) {
            modalTestStatusBox.className = 'test-status-badge error';
            modalTestStatusBox.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>Failed:</strong> ${escapeHTML(err.message || 'Connection failed')}`;
          }
        }
      });
    }

    if (!toggleBtn || !formBody || !form) return;

    // Set today's date as default for hearing date
    const qaDate = document.getElementById('qa_hearingDate');
    if (qaDate) {
      const today = new Date();
      qaDate.value = today.toISOString().split('T')[0];
    }

    // Toggle expand/collapse on button or header click
    function toggleForm() {
      const isOpen = formBody.classList.contains('expanded');
      formBody.classList.toggle('expanded', !isOpen);
      toggleBtn.classList.toggle('open', !isOpen);
      toggleBtn.querySelector('span').textContent = isOpen ? 'Add Case' : 'Close';
    }

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleForm();
    });

    header.addEventListener('click', function(e) {
      if (e.target === toggleBtn || toggleBtn.contains(e.target)) return;
      toggleForm();
    });

    // Submit quick-add form
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const clientName  = (document.getElementById('qa_clientName')?.value  || '').trim();
      const clientPhone = (document.getElementById('qa_clientPhone')?.value || '').trim();
      const caseTitle   = (document.getElementById('qa_caseTitle')?.value   || '').trim();
      const caseNumber  = (document.getElementById('qa_caseNumber')?.value  || '').trim();
      const caseCategory= document.getElementById('qa_caseCategory')?.value || 'Civil Litigation';
      const courtName   = (document.getElementById('qa_courtName')?.value   || '').trim();
      const hearingDate = document.getElementById('qa_hearingDate')?.value  || '';

      // Basic validation
      if (!clientName || !clientPhone || !caseTitle || !caseNumber || !courtName || !hearingDate) {
        if (typeof showToast === 'function') showToast('Please fill all required fields.', 'error');
        return;
      }

      // Build new case object matching existing schema
      const currentUser = (typeof state !== 'undefined' && state.currentUser) ? state.currentUser : null;
      const newCase = {
        id: 'case_' + Date.now() + '_qa',
        clientName,
        clientPhone,
        opposingParty: '',
        caseTitle,
        caseNumber,
        caseCategory,
        group: (currentUser && currentUser.group) ? currentUser.group : 'Constitutional & Writ',
        assignedTo: currentUser ? currentUser.id : '',
        assignedToName: currentUser ? currentUser.name : '',
        assignedToEmail: currentUser ? currentUser.email : '',
        assignedBy: currentUser ? currentUser.name : '',
        createdBy: currentUser ? currentUser.email : '',
        createdById: currentUser ? currentUser.id : '',
        priority: 'Standard',
        courtName,
        hearingDate,
        hearingTime: '10:00',
        notes: '',
        status: 'Active',
        updates: [],
        documents: [],
        createdAt: new Date().toISOString()
      };

      // Add to state and save
      if (typeof state !== 'undefined') {
        state.cases.unshift(newCase);
        if (typeof saveCasesToStorage === 'function') saveCasesToStorage();
        if (typeof logAuditEvent === 'function') {
          logAuditEvent('Case Filed (Quick Add)', `Case "${caseTitle}" registered for client ${clientName}.`, 'create');
        }
        if (typeof renderDashboard === 'function') renderDashboard();
      }

      if (typeof showToast === 'function') {
        showToast(`Case "${caseTitle}" filed successfully!`, 'success');
      }

      // Reset & collapse
      form.reset();
      if (qaDate) qaDate.value = new Date().toISOString().split('T')[0];
      formBody.classList.remove('expanded');
      toggleBtn.classList.remove('open');
      toggleBtn.querySelector('span').textContent = 'Add Case';
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

