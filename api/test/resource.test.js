const request = require("supertest");
const app = require("../../server");

describe("GET /stations", () =>  {
  it("returns all stations", (done) => {
    request(app)
      .get("/stations")
      .expect(200)
      .end((_err, res) => {
        expect(res.body.stations.length).toBe(4);
        done();
      });
  });
});

describe("GET /spacecraft", () =>  {
  it("returns all spacecraft", (done) => {
    request(app)
      .get("/spacecrafts")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((_err, res) => {
        expect(res.body.spacecrafts.length).toBe(2);
        done();
      });
  });
});
