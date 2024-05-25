import Coord from "./coord";

export default class ZipCode {
	coord: Coord;
	constructor(
		readonly code: string,
		readonly street: string,
		readonly neighborhood: string,
		readonly lat: number,
		readonly long: number
	) {
		this.coord = new Coord(lat, long);
	}
}
