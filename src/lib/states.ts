export type StateEntry = {
  slug: string;
  name: string;
  abbr: string;
  exampleCities: string[];
};

export function cityNameToSlug(cityName: string) {
  return cityName
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const states: StateEntry[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", exampleCities: ["Birmingham", "Montgomery", "Mobile"] },
  { slug: "alaska", name: "Alaska", abbr: "AK", exampleCities: ["Anchorage", "Fairbanks", "Juneau"] },
  { slug: "arizona", name: "Arizona", abbr: "AZ", exampleCities: ["Phoenix", "Tucson", "Scottsdale"] },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", exampleCities: ["Little Rock", "Fort Smith", "Fayetteville"] },
  { slug: "california", name: "California", abbr: "CA", exampleCities: ["Los Angeles", "San Diego", "San Francisco"] },
  { slug: "colorado", name: "Colorado", abbr: "CO", exampleCities: ["Denver", "Colorado Springs", "Boulder"] },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", exampleCities: ["Hartford", "New Haven", "Stamford"] },
  { slug: "delaware", name: "Delaware", abbr: "DE", exampleCities: ["Wilmington", "Dover", "Newark"] },
  { slug: "florida", name: "Florida", abbr: "FL", exampleCities: ["Miami", "Orlando", "Tampa"] },
  { slug: "georgia", name: "Georgia", abbr: "GA", exampleCities: ["Atlanta", "Savannah", "Augusta"] },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", exampleCities: ["Honolulu", "Hilo", "Kailua"] },
  { slug: "idaho", name: "Idaho", abbr: "ID", exampleCities: ["Boise", "Idaho Falls", "Coeur d’Alene"] },
  { slug: "illinois", name: "Illinois", abbr: "IL", exampleCities: ["Chicago", "Naperville", "Springfield"] },
  { slug: "indiana", name: "Indiana", abbr: "IN", exampleCities: ["Indianapolis", "Fort Wayne", "Evansville"] },
  { slug: "iowa", name: "Iowa", abbr: "IA", exampleCities: ["Des Moines", "Cedar Rapids", "Davenport"] },
  { slug: "kansas", name: "Kansas", abbr: "KS", exampleCities: ["Wichita", "Overland Park", "Kansas City"] },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", exampleCities: ["Louisville", "Lexington", "Bowling Green"] },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", exampleCities: ["New Orleans", "Baton Rouge", "Shreveport"] },
  { slug: "maine", name: "Maine", abbr: "ME", exampleCities: ["Portland", "Bangor", "Augusta"] },
  { slug: "maryland", name: "Maryland", abbr: "MD", exampleCities: ["Baltimore", "Annapolis", "Frederick"] },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", exampleCities: ["Boston", "Worcester", "Springfield"] },
  { slug: "michigan", name: "Michigan", abbr: "MI", exampleCities: ["Detroit", "Grand Rapids", "Ann Arbor"] },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", exampleCities: ["Minneapolis", "Saint Paul", "Rochester"] },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", exampleCities: ["Jackson", "Gulfport", "Hattiesburg"] },
  { slug: "missouri", name: "Missouri", abbr: "MO", exampleCities: ["Kansas City", "St. Louis", "Springfield"] },
  { slug: "montana", name: "Montana", abbr: "MT", exampleCities: ["Billings", "Bozeman", "Missoula"] },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", exampleCities: ["Omaha", "Lincoln", "Grand Island"] },
  { slug: "nevada", name: "Nevada", abbr: "NV", exampleCities: ["Las Vegas", "Reno", "Henderson"] },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", exampleCities: ["Manchester", "Nashua", "Concord"] },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", exampleCities: ["Newark", "Jersey City", "Trenton"] },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", exampleCities: ["Albuquerque", "Santa Fe", "Las Cruces"] },
  { slug: "new-york", name: "New York", abbr: "NY", exampleCities: ["New York", "Buffalo", "Rochester"] },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", exampleCities: ["Charlotte", "Raleigh", "Durham"] },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", exampleCities: ["Fargo", "Bismarck", "Grand Forks"] },
  { slug: "ohio", name: "Ohio", abbr: "OH", exampleCities: ["Columbus", "Cleveland", "Cincinnati"] },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", exampleCities: ["Oklahoma City", "Tulsa", "Norman"] },
  { slug: "oregon", name: "Oregon", abbr: "OR", exampleCities: ["Portland", "Eugene", "Salem"] },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", exampleCities: ["Philadelphia", "Pittsburgh", "Harrisburg"] },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", exampleCities: ["Providence", "Warwick", "Cranston"] },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", exampleCities: ["Charleston", "Columbia", "Greenville"] },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", exampleCities: ["Sioux Falls", "Rapid City", "Aberdeen"] },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", exampleCities: ["Nashville", "Memphis", "Knoxville"] },
  { slug: "texas", name: "Texas", abbr: "TX", exampleCities: ["Houston", "Dallas", "Austin"] },
  { slug: "utah", name: "Utah", abbr: "UT", exampleCities: ["Salt Lake City", "Provo", "St. George"] },
  { slug: "vermont", name: "Vermont", abbr: "VT", exampleCities: ["Burlington", "Montpelier", "Rutland"] },
  { slug: "virginia", name: "Virginia", abbr: "VA", exampleCities: ["Virginia Beach", "Richmond", "Norfolk"] },
  { slug: "washington", name: "Washington", abbr: "WA", exampleCities: ["Seattle", "Spokane", "Tacoma"] },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", exampleCities: ["Charleston", "Huntington", "Morgantown"] },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", exampleCities: ["Milwaukee", "Madison", "Green Bay"] },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", exampleCities: ["Cheyenne", "Casper", "Jackson"] },
];

export function getStateBySlug(slug: string) {
  return states.find((s) => s.slug === slug);
}
