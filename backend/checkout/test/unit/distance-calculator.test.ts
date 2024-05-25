import Coord from "../../src/domain/entities/coord";
import DistanceCalculator from "../../src/domain/entities/distance-calculator";

describe("Distance Calculator", () => {
	test("Deve calcular a distancia entre dois pontos", () => {
		const from = new Coord(-27.5945, -48.5477);
		const to = new Coord(-22.9129, -43.2003);
		const distance = DistanceCalculator.calculate(from, to);
		expect(distance).toBe(748.2217780081631);
	});
});
