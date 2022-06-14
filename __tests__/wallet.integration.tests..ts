import request from "supertest";

const baseUrl = "http://localhost/api/v1/Wallet";

describe("Wallet get endpoint", () => {
  it("should return a 200 status code", async () => {
    const response = await request(`${baseUrl}/9f465659-fd89-4ea4-a1b8-a7a4ab9cea3d`).get("");

    expect(response.statusCode).toBe(200);
  });
});

describe("Wallet get endpoint", () => {
  it("should return a 200 status code", async () => {
    const response = await request(`${baseUrl}/9f465659-fd89-4ea4-a1b8-a7a4ab9cea3d/gain`).get("");

    expect(response.statusCode).toBe(200);
  });
});

describe("Wallet create endpoint", () => {
  it("should return a 201 status code", async () => {
    const response = await request(`${baseUrl}`).post("");

    expect(response.statusCode).toBe(201);
  });
});
