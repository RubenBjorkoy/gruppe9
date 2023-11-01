# gruppe9
Webutviklingoppgave for gruppe 9
# hallo 

// Tables

// Questions Table
// sporsmalid: Primary Key
// number: Number
// tittel: Title (text)
// innhold: Content (text)
// poeng: Points (number)
// dato: Date (date)
// sistendret: Last Modified Date (date)

// type Sporsmal = {
//   sporsmalid: number;
//   number: number;
//   tittel: string;
//   innhold: string;
//   poeng: number;
//   dato: Date;
//   sistendret: Date;
// };

// Answers Table
// svarid: Primary Key
// number: Number
// svartekst: Answer Text (text)
// poeng: Points (number)
// sporsmalid: Foreign Key referencing Sporsmal table
// erbest: Is Best Answer (bool)
// dato: Date (date)
// sistendret: Last Modified Date (date)
// ersvar: Is Response (bool)
// svarsvarid: Foreign Key referencing Svar table for response chaining

// type Svar = {
//   svarid: number;
//   number: number;
//   svartekst: string;
//   poeng: number;
//   sporsmalid: number;
//   erbest: boolean;
//   dato: Date;
//   sistendret: Date;
//   ersvar: boolean;
//   svarsvarid: number;
// };

// Favorites Table
// favorittid: Primary Key
// svarid: Foreign Key referencing Svar table

// type Favoritter = {
//   favorittid: number;
//   svarid: number;
// };

// Question Tags Table
// sporsmalid: Foreign Key referencing Sporsmal table
// tagid: Foreign Key referencing Tag table

// type SporsmalTag = {
//   sporsmalid: number;
//   tagid: number;
// };

// Tags Table
// tagid: Primary Key
// navn: Name (text)
// forklaring: Explanation (text)

// type Tag = {
//   tagid: number;
//   navn: string;
//   forklaring: string;
// };
