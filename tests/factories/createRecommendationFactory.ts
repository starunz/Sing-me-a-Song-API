import { prisma } from "../../src/database.js";
import recommendationDataFactory from "./recommendationDataFactory.js";

export default async function createRecommendationFactory() {
  return await prisma.recommendation.create({
    data: recommendationDataFactory(),
  });
}