export const eventSchema = list => ({"@context":"https://schema.org","@graph":list.map(m=>({"@type":"SportsEvent",name:m.title,startDate:m.utc,eventStatus:"https://schema.org/EventScheduled",
 location:{"@type":"StadiumOrArena",name:m.venueName,address:{"@type":"PostalAddress",addressLocality:m.cityName,addressCountry:"AU"}},
 ...(m.home?{competitor:[{"@type":"SportsTeam",name:m.home},{"@type":"SportsTeam",name:m.away}]}:{})}))});
