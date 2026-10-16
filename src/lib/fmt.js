export const dayFmt = d => new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
export const aff = (kind, q) => `#affiliate-${kind}-${encodeURIComponent(q)}`; // placeholder until Travelpayouts/Booking IDs exist
