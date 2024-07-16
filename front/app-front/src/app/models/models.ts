export class User {
  id?: number;
  name: string;
  identification: string;
  email: string;
  password?: string;

  constructor(name: string, identification: string, email: string, password?: string, id?: number) {
    this.name = name;
    this.identification = identification;
    this.email = email;
    this.password = password;
    this.id = id;
  }
}

export class Comic {
  id: number;
  title: string;
  image: string;
  description?: string;
  format?: string;
  pageCount?: number;
  series?: string;
  dates?: { type: string, date: string }[];
  prices?: { type: string, price: number }[];
  creators?: string[];
  characters?: string[];

  constructor(
    id: number,
    title: string,
    image: string,
    description?: string,
    format?: string,
    pageCount?: number,
    series?: string,
    dates?: { type: string, date: string }[],
    prices?: { type: string, price: number }[],
    creators?: string[],
    characters?: string[]
  ) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    this.format = format;
    this.pageCount = pageCount;
    this.series = series;
    this.dates = dates;
    this.prices = prices;
    this.creators = creators;
    this.characters = characters;
  }
}

export class Favorite {
  id?: number;
  comic_id: number;
  title: string;
  description: string;
  image: string;

  constructor(comic_id: number, title: string, description: string, image: string, id?: number) {
    this.comic_id = comic_id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.id = id;
  }
}