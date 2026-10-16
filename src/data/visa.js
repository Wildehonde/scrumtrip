// Sourced from immi.homeaffairs.gov.au pages fetched 16 Oct 2026. Not legal advice.
export const LAST_CHECKED = '16 October 2026';
const B='https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/';
export const visas = {
 eta:{code:'ETA (subclass 601)',url:B+'electronic-travel-authority-601',cost:'No visa application charge; AUD20 service charge to use the Australian ETA app.',apply:'Apply in the Australian ETA app (Apple App Store / Google Play) while outside Australia.',processing:'In most cases you are told the result immediately (longer if more information is needed).',stay:'Up to 3 months at a time.'},
 evisitor:{code:'eVisitor (subclass 651)',url:B+'evisitor-651',cost:'Free.',apply:'Apply online (ImmiAccount) while outside Australia. Do not travel until granted in writing.',processing:'Shown on the official page / processing time guide tool. Check before applying.',stay:'Up to 3 months at a time.'},
 visitor:{code:'Visitor visa (subclass 600), Tourist stream',url:B+'visitor-600/tourist-stream-overseas',cost:'Fee varies; use the official Visa Pricing Estimator. Extra costs may apply (health checks, police certificates, biometrics).',apply:'Apply online in ImmiAccount while outside Australia and attach documents. Do not travel until granted in writing.',processing:'Use the official visa processing time guide tool. Apply well ahead of the tournament.',stay:'Up to 12 months (as granted).'},
};
// Which options a passport holder of each nation typically has (verified against official eligibility lists, 16 Oct 2026).
export const byTeam = {
 'Australia':{note:'Australian citizens do not need a visa to enter Australia.',options:[]},
 'New Zealand':{note:'New Zealand citizens have separate entry arrangements; see the official "New Zealand citizens" page on immi.homeaffairs.gov.au. (Not verified by ScrumTrip.)',options:[],unverified:true},
 'Chile':{options:['visitor']},'Hong Kong China':{options:['eta'],note:'ETA eligibility applies to Hong Kong (SAR of China) passports.'},
 'South Africa':{options:['visitor']},'Italy':{options:['evisitor','eta']},'Georgia':{options:['visitor']},'Romania':{options:['evisitor']},
 'Argentina':{options:['visitor']},'Fiji':{options:['visitor'],concession:true},'Spain':{options:['evisitor','eta']},'Canada':{options:['eta']},
 'Ireland':{options:['evisitor','eta']},'Scotland':{options:['evisitor','eta'],note:'Applies to United Kingdom (British Citizen) passports.'},'Uruguay':{options:['visitor']},'Portugal':{options:['evisitor','eta']},
 'France':{options:['evisitor','eta']},'Japan':{options:['eta']},'USA':{options:['eta']},'Samoa':{options:['visitor'],concession:true},
 'England':{options:['evisitor','eta'],note:'Applies to United Kingdom (British Citizen) passports.'},'Wales':{options:['evisitor','eta'],note:'Applies to United Kingdom (British Citizen) passports.'},'Tonga':{options:['visitor'],concession:true},'Zimbabwe':{options:['visitor']},
};
export const checklist = [
 ['Check your passport','Official pages require a valid passport. The ETA is linked to the passport you apply with: a new passport means a new ETA. Many travellers keep 6+ months validity as a precaution (ScrumTrip guidance, not an official rule).'],
 ['Confirm which visa you need','Use your passport nationality, not your team. Fans with other passports should check their own eligibility.'],
 ['Apply from outside Australia','All three options require you to be outside Australia when you apply and when the visa is decided.'],
 ['Wait for the grant before booking','Official guidance: do not arrange travel until you are told, in writing, the visa is granted.'],
 ['Show you have enough money','Visitor 600 applicants should provide proof of funds, e.g. itemised personal bank statements for 3 months, pay slips, tax records or credit card statements.'],
 ['Show you are a genuine visitor','You must intend to stay temporarily and follow your visa conditions. Match tickets and a return flight booking can support this (ScrumTrip guidance).'],
 ['Get health/travel insurance','Home Affairs strongly recommends adequate health insurance; you are liable for your own healthcare costs.'],
 ['Apply separately for each person','Each family member must lodge their own application.'],
 ['Have your match tickets ready','Buy only through official RWC 2027 channels.'],
 ['Complete the Incoming Passenger Card on arrival','Required for everyone arriving in Australia.'],
];
