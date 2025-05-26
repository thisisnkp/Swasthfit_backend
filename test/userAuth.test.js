const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Adjust path to your Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe("User Authentication", () => {
  let testTrainer = {
    user_name: "TestTrainer",
    user_mobile: "9999999999",
    user_email: "testtrainer@example.com",
    user_type: "trainer",
    user_height: 180,
    user_weight: 75,
    target_weight: 70,
    per_exp: ["none"],
    sickness: ["none"],
    physical_activity: ["cycling"],
    gender: "male",
    fit_goal: ["muscle gain"],
    user_aadhar: "987654321098",
    user_pan: "TEST1234X",
    user_bank: '"HDFC"',
    user_age: 30,
    password: "Test@2024",
    firstname: "Test",
    lastname: "Trainer",
    expertise: "Strength Training",
    experience: "5 years",
    address: "123 Test St",
    bank_account_no: "1234567890",
    ifsc_code: "HDFC0001234",
    time_slot: "9am-5pm",
    trainerType: "trainer",
  };

  describe("POST /user/site/apis/register", () => {
    it("should register a new trainer successfully", (done) => {
      chai
        .request(app)
        .post("/user/site/apis/register")
        .send(testTrainer)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should not register a trainer with missing required fields", (done) => {
      let invalidTrainer = { ...testTrainer };
      delete invalidTrainer.firstname;
      chai
        .request(app)
        .post("/user/site/apis/register")
        .send(invalidTrainer)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });

  describe("POST /user/site/apis/login", () => {
    it("should login a registered trainer successfully", (done) => {
      chai
        .request(app)
        .post("/user/site/apis/login")
        .send({
          email: testTrainer.user_email,
          password: testTrainer.password,
          user_type: "trainer",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should not login with incorrect password", (done) => {
      chai
        .request(app)
        .post("/user/site/apis/login")
        .send({
          email: testTrainer.user_email,
          password: "wrongpassword",
          user_type: "trainer",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success", false);
          done();
        });
    });
  });
});
