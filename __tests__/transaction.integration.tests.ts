import request from "supertest";

const baseUrl = "http://localhost/api/v1/Transaction";

describe("Transaction get endpoint", () => {
  it("should return a 200 status code", async () => {
    const response = await request(`${baseUrl}/9f6651dc-fea7-466b-99a3-e23964e9d275`).get("");

    expect(response.statusCode).toBe(200);
  });
});

describe("Transaction create endpoint", () => {
  it("should return a 201 status code", async () => {
    const response = await request(`${baseUrl}`)
      .post("")
      .set("Content-type", "application/json")
      .send({
        purchased: {
          assetId: "ethereum",
          quantity: 5,
        },
        mediumOfExchange: {
          assetId: "bitcoin",
          quantity: 1,
        },
        walletTo: "573850f3-934f-485d-bff3-fef440204fe6",
        walletFrom: "9f465659-fd89-4ea4-a1b8-a7a4ab9cea3d",
      });

    expect(response.statusCode).toBe(201);
  });
});
