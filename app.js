/**
 * LEXJURIS - Legal Case Intake & Court Scheduling Application Logic
 */

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
  adminSearchQuery: '',
  adminRoleFilter: 'all',
  currentAttachedDoc: null,
  targetEditUserId: null,
  targetResetUserId: null
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

  // Left Form (Intake)
  newCaseForm: document.getElementById('newCaseForm'),
  resetFormBtn: document.getElementById('resetFormBtn'),
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
  toastContainer: document.getElementById('toastContainer')
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
      if (!state.cases || !Array.isArray(state.cases) || state.cases.length === 0) {
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
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(state.cases));
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
      setDefaultFormDates();
      clearValidationErrors();
      showToast('Intake form cleared', 'info');
    });
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

  // Case Filter Pills Selection
  dom.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dom.filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.currentFilter = pill.getAttribute('data-filter');
      renderCasesList();
    });
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

  if (isTxt) {
    // Read actual text content
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const parsedData = parseRawLegalText(text, fileName);
      simulateDocumentScanAndExtraction(fileName, fileSize, parsedData);
    };
    reader.readAsText(file);
  } else {
    // Generate intelligent extraction based on document name and legal heuristics
    const extractedData = generateExtractedLegalData(fileName);
    simulateDocumentScanAndExtraction(fileName, fileSize, extractedData);
  }
}

function simulateDocumentScanAndExtraction(fileName, fileSize, extractedData) {
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
      finishExtraction(fileName, fileSize, extractedData);
    }
  }, 350);
}

function finishExtraction(fileName, fileSize, extractedData) {
  dom.dropzoneScanning.classList.add('hidden');
  dom.dropzoneAttached.classList.remove('hidden');
  dom.attachedFileName.textContent = fileName;
  dom.attachedFileSize.textContent = `${fileSize} • 100% Extracted`;

  state.currentAttachedDoc = {
    name: fileName,
    size: fileSize
  };

  populateIntakeFormWithExtractedData(extractedData);
  showToast(`⚡ Extracted all details from "${fileName}"!`, 'success');
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
// - Chambers Administrator: all cases
// - Group Head: all cases in their group & all updates regarding them
// - Subordinates: ONLY cases assigned directly to them!
function getAccessibleCases(user) {
  if (!user) return [];

  // 1. Chambers Administrator: Full firm-wide oversight
  if (user.role === 'Chambers Administrator') {
    return state.cases;
  }

  // 2. Head of Group: Full access to all cases in their group & all updates
  if (isUserGroupHead(user)) {
    const userGroup = (user.group || user.dept || 'Constitutional & Writ').toLowerCase().trim();
    return state.cases.filter(c => {
      const caseGrp = (c.group || c.caseCategory || '').toLowerCase().trim();
      return caseGrp === userGroup ||
             c.assignedTo === user.id ||
             (c.assignedToEmail && c.assignedToEmail.toLowerCase() === user.email.toLowerCase()) ||
             (c.assignedToName && c.assignedToName.toLowerCase() === user.name.toLowerCase());
    });
  }

  // 3. Subordinates (Associate Advocate, Paralegal, etc.):
  // Strictly visible ONLY to them if assigned to them!
  return state.cases.filter(c => {
    return c.assignedTo === user.id ||
           (c.assignedToEmail && c.assignedToEmail.toLowerCase() === user.email.toLowerCase()) ||
           (c.assignedToName && c.assignedToName.toLowerCase() === user.name.toLowerCase());
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
  const isHead = isUserGroupHead(user);
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
            Subordinate Counsel Workspace: ${escapeHTML(user.name)}
            <span class="scope-tag-pill">🔒 Confidential Access</span>
          </div>
          <div class="scope-banner-desc">Restricted docket security active: You have access exclusively to the <strong>${accessibleCases.length}</strong> docket(s) assigned directly to you.</div>
        </div>
      </div>
      <div class="badge-assignee my-assignment"><i class="fa-solid fa-user-check"></i> Assigned Cases Only</div>
    `;
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
        notes: `Docket formally instituted in "${caseGroup}" practice group and assigned to ${assignedUser.name}.`
      }
    ],
    attachedDoc: state.currentAttachedDoc ? { ...state.currentAttachedDoc } : null,
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  // Add to top of cases list
  state.cases.unshift(newCase);
  saveCasesToStorage();

  // Reset form, dropzone, and reset default date
  dom.newCaseForm.reset();
  resetDocumentUploadZone();
  setDefaultFormDates();
  populateAssigneeDropdowns();

  renderDashboard();
  showToast(`Case for "${clientName}" filed & assigned to ${assignedUser.name}!`, 'success');

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

  // 2. Filter by search query (Client name, case title, case number, court, assignee)
  if (state.searchQuery) {
    filtered = filtered.filter(c => 
      c.clientName.toLowerCase().includes(state.searchQuery) ||
      c.caseTitle.toLowerCase().includes(state.searchQuery) ||
      c.caseNumber.toLowerCase().includes(state.searchQuery) ||
      c.courtName.toLowerCase().includes(state.searchQuery) ||
      (c.assignedToName && c.assignedToName.toLowerCase().includes(state.searchQuery)) ||
      (c.group && c.group.toLowerCase().includes(state.searchQuery))
    );
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
    dom.emptyState.classList.remove('hidden');
    if (state.searchQuery) {
      dom.emptyStateMsg.textContent = `No active legal dockets matched "${state.searchQuery}". Try a different client name or clear the search.`;
    } else {
      const isSub = state.currentUser && !isUserGroupHead(state.currentUser) && state.currentUser.role !== 'Chambers Administrator';
      dom.emptyStateMsg.textContent = isSub 
        ? 'No cases currently assigned to you in this category. Any cases allocated by your Group Head will appear here.'
        : 'No cases found in this category. Register a fresh docket using the intake form on the left.';
    }
    return;
  }

  dom.emptyState.classList.add('hidden');

  // Render Case Cards
  dom.casesList.innerHTML = filtered.map(item => createCaseCardHTML(item, todayStr)).join('');

  // Attach dynamic button listeners for cards
  attachCardActionListeners();
}

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
  
  return `
    <div class="case-card ${borderClass}" data-case-id="${item.id}">
      
      <!-- Card Top: Client Info & Docket Tag -->
      <div class="card-header-row">
        <div class="client-identity">
          <div class="client-avatar-icon">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <div class="client-name-title">${escapeHTML(item.clientName)}</div>
            <div class="client-phone-sub">
              <i class="fa-solid fa-phone"></i> ${escapeHTML(item.clientPhone)} 
              ${item.opposingParty ? `• <span title="Opposing Party">vs. ${escapeHTML(item.opposingParty)}</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
          ${item.attachedDoc ? `
            <span class="card-doc-attachment" title="Legal brief attached: ${escapeHTML(item.attachedDoc.name)}">
              <i class="fa-solid fa-paperclip"></i> ${escapeHTML(item.attachedDoc.name.substring(0, 18))}...
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
          <div class="case-matter-title">${escapeHTML(item.caseTitle)}</div>
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
// 11. JURISAI PERSONAL CHATBOT ENGINE (LOCAL LLM & SMART BRAIN)
// ==========================================================================

const AI_STORAGE_KEYS = {
  ENGINE: 'jurisai_engine_type',
  OLLAMA_HOST: 'jurisai_ollama_host',
  OLLAMA_MODEL: 'jurisai_ollama_model',
  CLOUD_KEY: 'jurisai_cloud_key',
  PERSONA: 'jurisai_persona_type',
  NICKNAME: 'jurisai_user_nickname',
  VOICE_SPEAK: 'jurisai_voice_speak',
  SHARE_DATA: 'jurisai_share_data'
};

let aiState = {
  isOpen: false,
  isThinking: false,
  engine: localStorage.getItem(AI_STORAGE_KEYS.ENGINE) || 'local_ollama',
  ollamaHost: localStorage.getItem(AI_STORAGE_KEYS.OLLAMA_HOST) || 'http://localhost:11434',
  ollamaModel: localStorage.getItem(AI_STORAGE_KEYS.OLLAMA_MODEL) || 'llama3.2:1b',
  cloudKey: localStorage.getItem(AI_STORAGE_KEYS.CLOUD_KEY) || '',
  persona: localStorage.getItem(AI_STORAGE_KEYS.PERSONA) || 'co_counsel',
  nickname: localStorage.getItem(AI_STORAGE_KEYS.NICKNAME) || 'Counsel',
  voiceSpeak: localStorage.getItem(AI_STORAGE_KEYS.VOICE_SPEAK) === 'true',
  shareData: localStorage.getItem(AI_STORAGE_KEYS.SHARE_DATA) === 'true',
  messages: []
};

let speechRecognition = null;

function setupAiChatbot() {
  const toggleBtn = document.getElementById('toggleAiChatBtn');
  const chatPanel = document.getElementById('aiChatPanel');
  const closeBtn = document.getElementById('closeChatBtn');
  const clearBtn = document.getElementById('clearChatBtn');
  const settingsBtn = document.getElementById('aiSettingsBtn');
  const settingsDrawer = document.getElementById('aiSettingsDrawer');
  const closeSettingsBtn = document.getElementById('closeSettingsDrawerBtn');
  const saveSettingsBtn = document.getElementById('saveAiSettingsBtn');
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
  const ollamaSection = document.getElementById('ollamaConfigSection');
  const apiSection = document.getElementById('apiConfigSection');
  const enginePill = document.getElementById('enginePill');
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
  updateEngineDisplayPill();

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
          
          // Populate select
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
  engineSelect.addEventListener('change', () => {
    const selected = engineSelect.value;
    if (selected === 'local_ollama') {
      ollamaSection.classList.remove('hidden');
      apiSection.classList.add('hidden');
    } else if (selected === 'gemini_api') {
      ollamaSection.classList.add('hidden');
      apiSection.classList.remove('hidden');
    } else {
      ollamaSection.classList.add('hidden');
      apiSection.classList.add('hidden');
    }
  });

  // Save Settings
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      aiState.engine = engineSelect ? engineSelect.value : 'local_ollama';
      aiState.persona = personaSelect ? personaSelect.value : 'co_counsel';
      aiState.nickname = nicknameInput ? nicknameInput.value.trim() || 'Counsel' : 'Counsel';
      aiState.voiceSpeak = voiceSpeakCheckbox ? voiceSpeakCheckbox.checked : false;
      aiState.shareData = shareDataCheckbox ? shareDataCheckbox.checked : false;
      aiState.ollamaHost = ollamaHostInput ? ollamaHostInput.value.trim() : 'http://localhost:11434';
      aiState.ollamaModel = ollamaModelInput ? ollamaModelInput.value.trim() : 'llama3.2:1b';
      aiState.cloudKey = cloudKeyInput ? cloudKeyInput.value.trim() : '';

      localStorage.setItem(AI_STORAGE_KEYS.ENGINE, aiState.engine);
      localStorage.setItem(AI_STORAGE_KEYS.PERSONA, aiState.persona);
      localStorage.setItem(AI_STORAGE_KEYS.NICKNAME, aiState.nickname);
      localStorage.setItem(AI_STORAGE_KEYS.VOICE_SPEAK, aiState.voiceSpeak);
      localStorage.setItem(AI_STORAGE_KEYS.SHARE_DATA, aiState.shareData);
      localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_HOST, aiState.ollamaHost);
      localStorage.setItem(AI_STORAGE_KEYS.OLLAMA_MODEL, aiState.ollamaModel);
      localStorage.setItem(AI_STORAGE_KEYS.CLOUD_KEY, aiState.cloudKey);

      updateEngineDisplayPill();
      settingsDrawer.classList.add('hidden');
      showToast('JurisAI settings saved securely.', 'success');
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
  if (!pill) return;

  if (aiState.engine === 'local_ollama') {
    pill.className = 'engine-pill local';
    pill.textContent = `Local: ${aiState.ollamaModel}`;
  } else if (aiState.engine === 'gemini_api') {
    pill.className = 'engine-pill cloud';
    pill.textContent = `Cloud: Gemini API`;
  } else {
    pill.className = 'engine-pill local';
    pill.textContent = `Smart Legal Brain`;
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
  } else if (aiState.engine === 'gemini_api' && aiState.cloudKey) {
    typingLabel.textContent = `Connecting to Gemini Cloud...`;
    try {
      const responseText = await queryGeminiApi(userText);
      hideTypingAndRespond(responseText);
    } catch (err) {
      const fallbackResponse = generateSmartLegalResponse(userText, false);
      hideTypingAndRespond(fallbackResponse);
    }
  } else {
    typingLabel.textContent = `Analyzing chambers docket & legal knowledge...`;
    setTimeout(() => {
      const responseText = generateSmartLegalResponse(userText, false);
      hideTypingAndRespond(responseText);
    }, 500);
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
      ${formatAiMarkdown(text)}
      ${sender === 'bot' ? `
        <div class="bubble-actions-row">
          <button type="button" class="btn-bubble-speech" title="Read message aloud" onclick="speakTextAloud(\`${escapeHTML(text).replace(/`/g, '')}\`)">
            <i class="fa-solid fa-volume-high"></i> Listen
          </button>
          <button type="button" class="btn-bubble-copy" title="Copy to clipboard" onclick="navigator.clipboard.writeText(\`${escapeHTML(text).replace(/`/g, '')}\`); showToast('Copied to clipboard!', 'info');">
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

// Query Local Ollama Instance (With Personality System Prompt & Multi-turn context)
async function queryLocalOllama(userPrompt) {
  // Check if running on file:// protocol where browsers send Origin: null
  if (window.location.protocol === 'file:') {
    const fallbackMsg = generateSmartLegalResponse(userPrompt, false);
    return `> ⚠️ **Browser Notice:** You have opened the app via direct file (\`file://\`). Browsers block local network requests from \`file://\` to Ollama for security reasons.\n> \n> 💡 **To use your live Ollama model (\`${aiState.ollamaModel}\`):** Open this app via **\`http://localhost:8080/index.html\`** in your browser!\n\n---\n\n${fallbackMsg}`;
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
  
  // Dynamic Persona Prompting
  let personaInstruction = `You are JurisAI, the personal legal companion and AI co-counsel for ${aiState.nickname}. Address ${aiState.nickname} warmly and directly.`;
  if (aiState.persona === 'friendly') {
    personaInstruction = `You are JurisAI, a warm, friendly, and highly intelligent personal AI companion for ${aiState.nickname}. Chat naturally, be helpful, humorous when appropriate, and assist with work, general questions, and legal matters.`;
  } else if (aiState.persona === 'opposing') {
    personaInstruction = `You are ruthless Senior Opposing Counsel challenging ${aiState.nickname}'s arguments in court. Poke holes in their legal reasoning, cite statutory counter-arguments, and prepare them for tough judicial scrutiny.`;
  } else if (aiState.persona === 'researcher') {
    personaInstruction = `You are a meticulous Senior Legal Research Analyst for ${aiState.nickname}. Provide precise statutory citations (BNSS, BNS, BSA, CPC, CrPC, Constitution), ratio decidendi of landmark Supreme Court judgments, and structured legal analysis.`;
  }

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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiState.cloudKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `You are JurisAI, an elite legal assistant for an advocate. Chamber Context:\n${context}\n\nUser Request: ${userPrompt}`
      }]
    }]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const json = await res.json();
  return json.candidates[0].content.parts[0].text;
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

