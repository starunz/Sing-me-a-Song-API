import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationFactory } from "../factories/recommendationFactory.js"

describe("POST recommendation/downvote & recommendation/upvote", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

	it("should answer with throw not_found", async () => {
		jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

		expect(async () => {
			await recommendationService.upvote(1);
		}).rejects.toEqual({
			message: "",
			type: "not_found",
		});
	});

	it("should remove the recommendation", async () => {
		const recommendation = recommendationFactory(-6);

		jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
			recommendation
		);
		jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(
			recommendation
		);

		const removeRecommendation = jest
			.spyOn(recommendationRepository, "remove")
			.mockResolvedValueOnce(null);

		await recommendationService.downvote(100);

		expect(removeRecommendation).toBeCalled();
	});

    it("should answer with throw not_found", async () => {
		jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

		expect(async () => {
			await recommendationService.downvote(1);
		}).rejects.toEqual({
			message: "",
			type: "not_found",
		});
	});
});

describe("GET /recommendations/random", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

	it("should answer with throw error not_found", async () => {
		const random = 0.6;

		jest.spyOn(global.Math, "random").mockReturnValue(random);
		jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
		
		expect(async () => {
			await recommendationService.getRandom();
		}).rejects.toEqual({
			message: "",
			type: "not_found",
		});
	});
});

describe("testing getByScore()", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

	it("should answer with not null array", async () => {
		const recommendation = recommendationFactory(11);
		const recommendation2 = recommendationFactory(3);

		jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
			recommendation,
		]);

		jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
			recommendation,
			recommendation2,
		]);

		const result = await recommendationService.getByScore("gt");

		expect(result).toEqual([recommendation]);
	});
});

describe("testing getScoreFilter()", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

	it("should call getByScore with parameter 'gt'", async () => {
		const random = 0.6;

		jest.spyOn(global.Math, "random").mockReturnValueOnce(random);
		const result = recommendationService.getScoreFilter(random);

		expect(result).toEqual("gt");
	});

	it("should call getByScore with parameter 'lte'", async () => {
		const random = 0.8;

		jest.spyOn(global.Math, "random").mockReturnValueOnce(random);
		const result = recommendationService.getScoreFilter(random);

		expect(result).toEqual("lte");
	});
});