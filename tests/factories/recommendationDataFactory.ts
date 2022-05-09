import { CreateRecommendationData } from "../../src/services/recommendationsService.js";
import { faker } from "@faker-js/faker";

export default function recommendationDataFactory() {
  const data: CreateRecommendationData = {
    name: faker.name.firstName(),
    youtubeLink: "https://www.youtube.com/watch?v=q2QXg0zoZf8",
  };

  return data;
}