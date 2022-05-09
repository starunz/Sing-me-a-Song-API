import { faker } from "@faker-js/faker";
import createRecommendationFactory from "./createRecommendationFactory";

export default async function createRecommendationListFactory () {
	const createRecommendationQqt = faker.datatype.number({min:5, max:20})
	const recommendationList = []
    
	for (let i = 0; i < createRecommendationQqt; i++) {
		recommendationList.push(createRecommendationFactory())
	}

	await Promise.all(recommendationList);
}