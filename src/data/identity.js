// Team identity, verified 16 Oct 2026 from each team's English Wikipedia infobox/article (sources below).
// nick: null where no well-established nickname is listed -> plain name used. Never invent.
const W = s => `https://en.wikipedia.org/wiki/${s}`;
export const identity = {
 'New Zealand':{nick:'All Blacks',colours:'Black',accent:'#000000',tradition:'Perform a haka before every match',src:W('New_Zealand_national_rugby_union_team'),src2:'https://www.allblacks.com/'},
 'Australia':{nick:'Wallabies',colours:'Gold',accent:'#FF8300',src:W('Australia_national_rugby_union_team')},
 'Chile':{nick:'Los Cóndores',meaning:'The Condors',colours:'Red',accent:'#D90000',src:W('Chile_national_rugby_union_team')},
 'Hong Kong China':{nick:null,colours:'Navy',accent:'#000080',src:W('Hong_Kong_national_rugby_union_team')},
 'South Africa':{nick:'Springboks',alt:'Boks / Bokke / Amabhokobhoko',colours:'Green and gold',accent:'#275237',src:W('South_Africa_national_rugby_union_team')},
 'Italy':{nick:'Azzurri',meaning:'The Blues',colours:'Blue',accent:'#0050BA',src:W('Italy_national_rugby_union_team')},
 'Georgia':{nick:'Lelos',colours:'Red',accent:'#E1224E',src:W('Georgia_national_rugby_union_team')},
 'Romania':{nick:'Stejarii',meaning:'The Oaks',colours:'Yellow',accent:'#B89B00',src:W('Romania_national_rugby_union_team')},
 'Argentina':{nick:'Los Pumas',meaning:'The Pumas',colours:'Sky blue and white',accent:'#2E8BC9',src:W('Argentina_national_rugby_union_team')},
 'Fiji':{nick:'Flying Fijians',colours:'White and black',accent:'#000000',tradition:'Perform the Cibi war dance before each Test',src:W('Fiji_national_rugby_union_team')},
 'Spain':{nick:'Los Leones',meaning:'The Lions',colours:'Red',accent:'#E30D22',src:W('Spain_national_rugby_union_team')},
 'Canada':{nick:null,alt:'Wikipedia lists Canucks, Les Rouges and Beavers (no single established name, so plain name used)',colours:'Red',accent:'#D00000',src:W("Canada_men's_national_rugby_union_team")},
 'Ireland':{nick:null,colours:'Green',accent:'#009900',song:'"Ireland\'s Call" is the team\'s anthem',src:W('Ireland_national_rugby_union_team')},
 'Scotland':{nick:null,colours:'Navy blue',accent:'#101D42',song:'"Flower of Scotland" is sung before matches',src:W('Scotland_national_rugby_union_team')},
 'Uruguay':{nick:'Los Teros',colours:'Sky blue',accent:'#1A9AD6',src:W('Uruguay_national_rugby_union_team')},
 'Portugal':{nick:'Os Lobos',meaning:'The Wolves',colours:'Red',accent:'#E11919',src:W('Portugal_national_rugby_union_team')},
 'France':{nick:'Les Bleus',meaning:'The Blues',colours:'Blue',accent:'#2F5DBF',src:W('France_national_rugby_union_team')},
 'Japan':{nick:'Brave Blossoms',colours:'Red and white',accent:'#C8102E',src:W('Japan_national_rugby_union_team')},
 'USA':{nick:'Eagles',colours:'White (with red and navy)',accent:'#1B2A4A',src:W("United_States_men's_national_rugby_union_team")},
 'Samoa':{nick:'Manu Samoa',colours:'Blue',accent:'#000099',tradition:'Perform the Siva Tau before each game',src:W('Samoa_national_rugby_union_team')},
 'England':{nick:null,colours:'White',accent:'#272B46',song:'"Swing Low, Sweet Chariot" is the fans\' anthem',src:W('England_national_rugby_union_team')},
 'Wales':{nick:null,colours:'Red',accent:'#ED1C24',song:'"Cwm Rhondda" is a popular song among Welsh fans',src:W('Wales_national_rugby_union_team')},
 'Tonga':{nick:'ʻIkale Tahi',meaning:'The Sea Eagles',colours:'Red',accent:'#F70E0E',tradition:'Perform the Sipi Tau before matches',src:W('Tonga_national_rugby_union_team')},
 'Zimbabwe':{nick:'Sables',colours:'Green',accent:'#226825',src:W('Zimbabwe_national_rugby_union_team')},
};
export const display = t => identity[t]?.nick || t;           // "All Blacks" or "Ireland"
export const fanLabel = t => identity[t]?.nick ? `${identity[t].nick}` : t;
