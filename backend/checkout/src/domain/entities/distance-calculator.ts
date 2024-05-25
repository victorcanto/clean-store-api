import Coord from "./coord";

export default class DistanceCalculator {
	static calculate(from: Coord, to: Coord): number {
		if (from.lat === to.lat && from.long === to.long) return 0;
		const radLat1 = (Math.PI * from.lat) / 180;
		const radLat2 = (Math.PI * to.lat) / 180;
		const theta = from.long - to.long;
		const radTheta = (Math.PI * theta) / 180;
		let dist =
			Math.sin(radLat1) * Math.sin(radLat2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		return dist;
	}
}
