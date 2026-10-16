// Fan origin airports/city codes per nation, and host-city IATA codes.
export const ORIGINS = { // one fan origin per nation (city/airport IATA)
  'South Africa':['JNB','CPT'], 'New Zealand':['AKL'], 'Chile':['SCL'], 'Hong Kong China':['HKG'],
  'Italy':['ROM'], 'Georgia':['TBS'], 'Romania':['BUH'], 'Argentina':['BUE'], 'Fiji':['NAN','SUV'],
  'Spain':['MAD'], 'Canada':['YTO'], 'Ireland':['DUB'], 'Scotland':['EDI'], 'Uruguay':['MVD'],
  'Portugal':['LIS'], 'France':['PAR'], 'Japan':['TYO'], 'USA':['LAX'], 'Samoa':['APW'],
  'England':['LON'], 'Wales':['CWL'], 'Tonga':['TBU'], 'Zimbabwe':['HRE'],
};
export const DESTS = ['PER','ADL','MEL','SYD','BNE','TSV','NTL'];
export const CITY_IATA = {perth:'PER',adelaide:'ADL',melbourne:'MEL',sydney:'SYD',brisbane:'BNE',townsville:'TSV',newcastle:'NTL'};
export const IATA_NAME = {JNB:'Johannesburg',CPT:'Cape Town',AKL:'Auckland',SCL:'Santiago',HKG:'Hong Kong',ROM:'Rome',TBS:'Tbilisi',BUH:'Bucharest',BUE:'Buenos Aires',NAN:'Nadi',SUV:'Suva',MAD:'Madrid',YTO:'Toronto',DUB:'Dublin',EDI:'Edinburgh',MVD:'Montevideo',LIS:'Lisbon',PAR:'Paris',TYO:'Tokyo',LAX:'Los Angeles',APW:'Apia',LON:'London',CWL:'Cardiff',TBU:"Nuku'alofa",HRE:'Harare',PER:'Perth',ADL:'Adelaide',MEL:'Melbourne',SYD:'Sydney',BNE:'Brisbane',TSV:'Townsville',NTL:'Newcastle'};
