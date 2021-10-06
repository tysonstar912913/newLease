/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
    { id: "en", name: "English - LTR", direction: "ltr" },
    { id: "es", name: "Español", direction: "ltr" },
    { id: "enrtl", name: "English - RTL", direction: "rtl" }
];

export const firebaseConfig = {
    apiKey: "AIzaSyBBksq-Asxq2M4Ot-75X19IyrEYJqNBPcg",
    authDomain: "gogo-react-login.firebaseapp.com",
    databaseURL: "https://gogo-react-login.firebaseio.com",
    projectId: "gogo-react-login",
    storageBucket: "gogo-react-login.appspot.com",
    messagingSenderId: "216495999563"
};

export const searchPath = "/app/pages/search";
export const servicePath = "https://api.coloredstrategies.com";

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const themeColorStorageKey = "__theme_color"
export const isMultiColorActive = true;
export const defaultColor = "light.purple";
export const isDarkSwitchActive = true;
export const defaultDirection = "ltr";

/** *** Client *****/
export const client_type = [
    { value: 1, label: "Government" },
    { value: 2, label: "Private" },
    { value: 3, label: "Individual" }
];
export const client_status = [
    { value: 1, label: "Client" },
    { value: 2, label: "Prospect" }
];

/** *** Unit *****/
export const unit_type = [
    { value: 1, label: "Office" },
    { value: 2, label: "Residental" },
    { value: 3, label: "Retail" },
];
export const unit_status = [
    { value: 1, label: "Available" },
    { value: 2, label: "Not Available" },
    { value: 3, label: "Pending Proposal" },
    { value: 4, label: "Pending Lease" },
    { value: 5, label: "Leased" },
];
export const unit_buildings = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
];
export const unit_floor = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
];

/** *** Admin *****/
export const user_status = [
    { value: 0, label: "User" },
    { value: 1, label: "Admin" },
];
export const default_user_password = '1234567890';

/** *** PROPOSAL *****/
export const rent_free_period = [
    { value: 0, label: "0 Months" },
    { value: 1, label: "1 Months" },
    { value: 2, label: "2 Months" },
    { value: 3, label: "3 Months" },
    { value: 4, label: "4 Months" },
    { value: 5, label: "5 Months" },
    { value: 6, label: "6 Months" },
    { value: 12, label: "12 Months" },
    { value: 18, label: "18 Months" },
];
export const payment_frequency = [
    { value: 0, label: "Monthly" },
    { value: 1, label: "Biyearly" },
    { value: 2, label: "Yearly" },
];
export const proposal_status = [
    { value: 1, label: "Draft", theme_option: "badge-light" },
    { value: 2, label: "Pending", theme_option: "badge-secondary" },
    { value: 3, label: "Signed", theme_option: "badge-success" },
    { value: 4, label: "Canceled", theme_option: "badge-danger" },
];

/** *** LEASE *****/
export const reinstatement_condition = [
    { value: 0, label: "Shell and Core" },
    { value: 1, label: "Fit-out To Remain" },
    { value: 2, label: "Condition on Commencement" },
];
export const lease_status = [
    { value: 1, label: "Draft", theme_option: "badge-light" },
    { value: 2, label: "Pending", theme_option: "badge-secondary" },
    { value: 3, label: "Signed", theme_option: "badge-success" },
    { value: 4, label: "Canceled", theme_option: "badge-danger" },
];

/** Lease type */
export const proposal_types = [
    { value: 0, label: 'Government' },
    { value: 1, label: 'Private' },
    { value: 2, label: 'Individual' }
];

export const unit_types = proposal_types;

/** *** LOG *****/
export const log_action_description = {
    CLIENT_CREATE: 'Created a client',
    CLIENT_UPDATE: 'Updated a client',
    UNIT_CREATE: 'Created a unit',
    UNIT_UPDATE: 'Updated a unit',
    PROPOSAL_SUBMIT: 'Submited a proposal',
    PROPOSAL_SIGN: 'Signed a proposal',
    PROPOSAL_CANCEL: 'Canceled a proposal',
    LEASE_SUBMIT: 'Submited a lease',
    LEASE_SIGN: 'Signed a lease',
    LEASE_CANCEL: 'Canceled a lease'
};