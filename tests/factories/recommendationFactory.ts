import { Recommendation } from "@prisma/client";
import { faker } from "@faker-js/faker";

export function recommendationFactory(score: number): Recommendation {
	return {
		id: faker.datatype.number(),
		name: faker.name.firstName(),
		youtubeLink: "https://www.youtube.com/watch?v=AepjLbcLrJE&list=RDMM&index=2&ab_channel=Scorpions",
		score,
	};
}