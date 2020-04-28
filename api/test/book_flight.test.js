const request = require("supertest");
const app = require("../../server");

describe("POST /users", () => {
  it("Creates new user", (done) => {
    request(app)
      .post("/users")
      .send({
        name: "john"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end( (_err, res) =>  {
        expect(res.body.name).toBe('john');
        done();
      });
  });

  it("throws an error when the name specified exists in the DB (case insensitive)", (done) =>  {
    request(app)
      .post("/users")
      .send({ name: "JohN"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe("Request could not be completed");
        expect(res.body.error).toBe("Key (name)=(john) already exists.");
        done();
      });
  });

  it("throws an error when a name isn't specified", (done) =>  {
    request(app)
      .post("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.description).toBe("name must be alphanumeric - not having special characters");
        expect(res.body.error).toBe("Invalid name");
        done();
      });
  });

  it("throws an error when a name isn't contains special characters", (done) =>  {
    request(app)
      .post("/users")
      .send({ name: "JohN.!"})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.description).toBe("name must be alphanumeric - not having special characters");
        expect(res.body.error).toBe("Invalid name");
        done();
      });
  });
});

describe("POST /fund-account", () => {
  it("funds the target account", (done) =>  {
    request(app)
      .post("/users/john/fund-account")
      .send({
        value: 351
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end( (_err, res) =>  {
        expect(res.body.balance).toBe('351 BTC');
        expect(res.body.info).toBe('User account john was credited successfully');
        done();
      });
  });

  it("unsuccessful when the value is negative", (done) =>  {
    request(app)
      .post("/users/john/fund-account")
      .send({
        value: -351
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe('Request could not be completed');
        expect(res.body.error).toBe('Invalid number');
        expect(res.body.description).toBe('You must specify a value greater than 0');
        done();
      });
  });

  it("unsuccessful when the user name doesn't exist", (done) =>  {
    request(app)
      .post("/users/joe/fund-account")
      .send({ value: 351})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe('Request could not be completed');
        expect(res.body.error).toBe('User does not exist');
        done();
      });
  });
});

describe("POST /balance", () => {
  it("returns the users account balance", (done) =>  {
    request(app)
      .get("/users/john/balance")
      .expect(200)
      .end( (_err, res) =>  {
        expect(res.body.balance).toBe('351 BTC');
        expect(res.body.info).toBe('Available balance for john');
        done();
      });
  });
  it("unsuccessful when the user name doesn't exist", (done) =>  {
    request(app)
      .get("/users/joe/balance")
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe('Request could not be completed');
        expect(res.body.error).toBe('User does not exist');
        done();
      });
  });
});

describe("POST /book-flight", () => {
  it("fails when origin and destination are the same", (done) =>  {
    request(app)
      .post("/users/john/book-flight")
      .send({ spacecraft: 'Falcon 9', origin: "Abuja", destination: "Abuja" })
      .expect(200)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe('Request could not be completed');
        expect(res.body.error).toBe('Your origin and destination should not be the same');
        expect(res.body.description).toBe('Select a different destination');
        done();
      });
  });

  it("successfully books a flight", (done) =>  {
    request(app)
      .post("/users/john/book-flight")
      .send({ spacecraft: 'Falcon 1', origin: "Spock", destination: "Moon" })
      .expect(200)
      .end( (_err, res) =>  {
        expect(res.body.info).toBe('Your flight was successfully booked, see flight details below');
        expect(res.body.details.fare).toBe(250);
        done();
      });
  });

  it("unsuccessful when user does not have sufficient fund", (done) =>  {
    request(app)
      .post("/users/john/book-flight")
      .send({ spacecraft: 'Falcon 1', origin: "Spock", destination: "Moon"})
      .expect(200)
      .end((_err, res) => {
        expect(res.body.error).toBe('Your account balance is low - You do not have enough funds to complete this transcation');
        expect(res.body.message).toBe('You need at least 250 BTC to complete this transcation');
        done();
      });
  });

  it("unsuccessful when the user name doesn't exist", (done) =>  {
    request(app)
      .post("/users/joe/book-flight")
      .send({ spacecraft: 'Falcon 9', origin: "Abuja", destination: "Moon" })
      .expect(400)
      .end( (_err, res) =>  {
        expect(res.body.message).toBe('Request could not be completed');
        expect(res.body.error).toBe('User does not exist');
        done();
      });
  });
});
