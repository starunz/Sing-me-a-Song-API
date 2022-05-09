import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import dotenv from "dotenv";
dotenv.config();

console.log("estou no banco ==", process.env.DATABASE_URL)

import recommendationDataFactory from "../factories/recommendationDataFactory.js";
import createRecommendationFactory from "../factories/createRecommendationFactory.js";

describe("POST /recommendations", () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

	it("should answer with status code 201, given a valid body", async () => {
		const body = recommendationDataFactory();
        console.log(body)

		const res = await supertest(app).post("/recommendations").send(body);
		const recommendations = await prisma.recommendation.findMany();

		expect(res.status).toEqual(201);
		expect(recommendations).not.toBeNull();
	});
});

describe("POST /recommendations/:id/upvote", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should answer with status code 200 and increment the song score, given a valid id", async () => {
      const recommendationData = await createRecommendationFactory();

      const result = await supertest(app).post(`/recommendations/${recommendationData.id}/upvote`);

      const recommendation = await prisma.recommendation.findUnique({
        where: {
          id: recommendationData.id,
        },
      });

      expect(result.status).toEqual(200);
      expect(recommendation).not.toBeNull();
      expect(recommendation.score).toEqual(1);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should answer with status code 200 and decrement the song score, given a valid id", async () => {
      const recommendationData = await createRecommendationFactory();

      const result = await supertest(app).post(`/recommendations/${recommendationData.id}/downvote`);

      const recommendation = await prisma.recommendation.findUnique({
        where: {
          id: recommendationData.id
        },
      });

      expect(result.status).toEqual(200);
      expect(recommendation).not.toBeNull();
      expect(recommendation.score).toEqual(-1);
    });
});