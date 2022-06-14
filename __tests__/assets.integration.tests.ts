import request from "supertest";

const baseUrl = "http://localhost/api/v1/Asset";

describe("Asset endpoint", () => {
  it("should return a 200 status code", async () => {
    const response = await request(`${baseUrl}?search=binance`).get("");

    expect(response.statusCode).toBe(200);
  });
});

describe("Asset endpoint exceeding limit", () => {
  it("should return a 422 status code", async () => {
    const response = await request(`${baseUrl}?limit=2001`).get("");

    expect(response.statusCode).toBe(422);
  });
});

describe("Asset endpoint with sorting", () => {
  it("should return a sorted list", async () => {
    const response = await request(`${baseUrl}?sort=id`).get("");

    expect(response.statusCode).toBe(200);
  });
});

describe("Asset details endpoint", () => {
  it("should return one asset", async () => {
    const response = await request(`${baseUrl}/bitcoin`).get("");
    expect(response.statusCode).toBe(200);
  });
});

describe("Asset USD Value", () => {
  it("should return the value of the asset converted to USD", async () => {
    const response = await request(`${baseUrl}/bitcoin/USD`).get("");
    expect(response.body).toBeGreaterThanOrEqual(0);
  });
});
