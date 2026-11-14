import { Language } from '@/types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brandName: 'Bharathi Foundation',
    tagline: 'WE LOVE TO SERVE',
    motto: 'One Mother\'s Dream, Countless Lives Touched.',
    
    // Nav
    navHome: 'Home',
    navAbout: 'About Us',
    navServices: 'Our Services',
    navFoodDonation: 'Food Donation',
    navBloodDonation: 'Blood Donation',
    navCamps: 'Camp Meetings',
    navGallery: 'Gallery',
    navContact: 'Contact',
    navLogin: 'Login',
    navRegister: 'Register',
    navDonateNow: 'Donate Now',
    navDashboard: 'Dashboard',
    
    // Stats
    statLives: 'Lives Directly Impacted',
    statVolunteers: 'Active Ground Volunteers',
    statCamps: 'Medical & Blood Camps',
    statWelfare: 'Direct Welfare Raised',
    
    // Sections
    missionTitle: 'Our Mission',
    visionTitle: 'Our Vision',
    coreServicesTitle: 'Our Core Services',
    campsTitle: 'Upcoming Camp Meetings',
    galleryTitle: 'Moments of Service',
    storiesTitle: 'Stories of Compassion',
    donateSectionTitle: 'Transparent Direct Giving',
    
    // Status
    statusApproved: 'Approved',
    statusPending: 'Pending Review',
    statusRejected: 'Rejected',
    statusSuspended: 'Suspended',
    statusVerified: 'Verified',
    
    // Actions
    btnApprove: 'Approve',
    btnReject: 'Reject',
    btnSuspend: 'Suspend',
    btnViewDetails: 'View Details',
    btnExportPDF: 'Export PDF',
    btnExportExcel: 'Export Excel',
    btnSave: 'Save Changes',
    btnCancel: 'Cancel',
    btnScanQR: 'Scan Event QR',
    btnDownloadIdCard: 'Download Volunteer ID Card',
    btnDownloadCertificate: 'Download Certificate',
    btnVerifyUTR: 'Verify UTR',
    
    // Messages
    pendingVolunteerMsg: 'Your account is awaiting Admin approval.',
    rejectedVolunteerMsg: 'Your registration has been rejected. Please contact the foundation.',
    suspendedMsg: 'Your account has been suspended. Please contact the foundation administrator.',
    approvedMsg: 'Your account has been verified and approved.',
  },
  te: {
    // Brand
    brandName: 'భారతి ఫౌండేషన్',
    tagline: 'సేవ చేయడమే మా పరమావధి',
    motto: 'ఒక తల్లి కల, అసంఖ్యాక జీవితాల్లో వెలుగు.',
    
    // Nav
    navHome: 'హోమ్',
    navAbout: 'మా గురించి',
    navServices: 'మా సేవలు',
    navFoodDonation: 'అన్నదానం',
    navBloodDonation: 'రక్తదానం',
    navCamps: 'సేవా శిబిరాలు',
    navGallery: 'చిత్రమాలిక',
    navContact: 'సంప్రదించండి',
    navLogin: 'లాగిన్',
    navRegister: 'నమోదు',
    navDonateNow: 'విరాళం ఇవ్వండి',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    
    // Stats
    statLives: 'సహాయం పొందిన జీవితాలు',
    statVolunteers: 'క్రియాశీల వాలంటీర్లు',
    statCamps: 'వైద్య & రక్తదాన శిబిరాలు',
    statWelfare: 'సేకరించిన సంక్షేమ నిధులు',
    
    // Sections
    missionTitle: 'మా ధ్యేయం',
    visionTitle: 'మా సంకల్పం',
    coreServicesTitle: 'మా ముఖ్య సేవలు',
    campsTitle: 'రాబోయే సేవా శిబిరాలు',
    galleryTitle: 'సేవా క్షణాలు',
    storiesTitle: 'కరుణా గాథలు',
    donateSectionTitle: 'పారదర్శక ప్రత్యక్ష విరాళాలు',
    
    // Status
    statusApproved: 'ఆమోదించబడింది',
    statusPending: 'పరిశీలనలో ఉంది',
    statusRejected: 'తిరస్కరించబడింది',
    statusSuspended: 'తాత్కాలికంగా నిలిపివేయబడింది',
    statusVerified: 'ధృవీకరించబడింది',
    
    // Actions
    btnApprove: 'ఆమోదించండి',
    btnReject: 'తిరస్కరించండి',
    btnSuspend: 'నిలిపివేయండి',
    btnViewDetails: 'వివరాలు చూడండి',
    btnExportPDF: 'PDF డౌన్‌లోడ్',
    btnExportExcel: 'Excel డౌన్‌లోడ్',
    btnSave: 'మార్పులను భద్రపరచండి',
    btnCancel: 'రద్దు చేయండి',
    btnScanQR: 'ఈవెంట్ QR స్కాన్ చేయండి',
    btnDownloadIdCard: 'వాలంటీర్ ఐడీ కార్డ్',
    btnDownloadCertificate: 'ప్రశంసా పత్రం',
    btnVerifyUTR: 'UTR ధృవీకరించండి',
    
    // Messages
    pendingVolunteerMsg: 'మీ ఖాతా నిర్వాహకుల (Admin) ఆమోదం కోసం వేచి ఉంది.',
    rejectedVolunteerMsg: 'మీ నమోదు తిరస్కరించబడింది. దయచేసి ఫౌండేషన్‌ను సంప్రదించండి.',
    suspendedMsg: 'మీ ఖాతా తాత్కాలికంగా నిలిపివేయబడింది. దయచేసి నిర్వాహకులను సంప్రదించండి.',
    approvedMsg: 'మీ ఖాతా విజయవంతంగా ఆమోదించబడింది.',
  },
};

export function getTranslation(lang: Language, key: string, fallback?: string): string {
  return TRANSLATIONS[lang]?.[key] || fallback || key;
}
