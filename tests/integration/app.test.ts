import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";

import recommendationDataFactory from "../factories/recommendationDataFactory.js";
import createRecommendationFactory from "../factories/createRecommendationFactory.js";
import createRecommentationListFactory from "../factories/createRecommendationListFactory.js";

describe("POST /recommendations", () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

	it("should answer with status code 201, given a valid body", async () => {
		const body = recommendationDataFactory();

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

describe("GET /recommendations", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return the last 10 recommendations", async () => {
      await createRecommentationListFactory();

      const result = await supertest(app).get("/recommendations");

      expect(result.status).toEqual(200);
      expect(result.body.length).toBeLessThanOrEqual(10);
    });
});

describe("GET /recommendations/:id", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

	it("should answer with object, with the corresponding id", async () => {
		const recommendationData = await createRecommendationFactory();

		const result = await supertest(app).get(`/recommendations/${recommendationData.id}`);

		expect(result.status).toEqual(200);
		expect(result.body).not.toBeNull();
		expect(result.body.id).toEqual(recommendationData.id);

        console.log(result.body)
        console.log(result.body.id)
	});
});

describe("GET /recommendations/random", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

	it("should return 200 with a recommendation", async () => {
	    await createRecommentationListFactory();

		const result = await supertest(app).get('/recommendations/random');

		expect(result.status).toEqual(200);
		expect(result.body).not.toBeNull();
	});
});

describe("GET /recommendations/top/:amount", () => {
    beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
	});

    afterAll(async () => {
        await prisma.$disconnect();
    });

	it("should return 200 with top recommendation", async () => {
	    const recommendationData = await createRecommendationFactory();

        const amount = faker.datatype.number()

		const result = await supertest(app).get(`/recommendations/top/${amount}`);

        await prisma.recommendation.update({
			where: { id: recommendationData.id },
			data: { score: 25 },
		});

        expect(result.status).toEqual(200);
		expect(result.body.length).toBeGreaterThan(0);
	});
});