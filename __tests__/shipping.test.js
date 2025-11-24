const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../index');
const { prisma } = require('../db/config');

chai.use(chaiHttp);

describe('Shipping Management API', () => {
  beforeEach(async () => {
    // Clear the database
    await prisma.shipping.deleteMany({});
  });

  after(async () => {
    // Close the connection
    await prisma.$disconnect();
  });

  const authKey = 'your_secret_api_key_here';

  // Test: should find the shipping table in db
  it('should find the shipping table in db', async () => {
    // This test just checks if we can query the table
    const count = await prisma.shipping.count();
    expect(count).to.equal(0);
  });

  // Test: check if userId, count, productId, id are integers and status is string and set to pending by default, and id is autoincremented
  it('check if userId, count, productId, id are integers and status is string and set to pending by default, and id is autoincremented', async () => {
    const shipping = await prisma.shipping.create({
      data: {
        userId: 1,
        productId: 2,
        count: 3
      }
    });

    expect(shipping.id).to.be.a('number');
    expect(shipping.userId).to.be.a('number');
    expect(shipping.productId).to.be.a('number');
    expect(shipping.count).to.be.a('number');
    expect(shipping.status).to.be.a('string');
    expect(shipping.status).to.equal('pending');
  });

  // [API test]: no SHIPPING_SECRET_KEY is provided in headers
  it('[API test]: no SHIPPING_SECRET_KEY is provided in headers', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .send({ userId: 1, productId: 2, count: 3 })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('SHIPPING_SECRET_KEY header is missing');
        done();
      });
  });

  // [API test]: invalid SHIPPING_SECRET_KEY is provided in headers
  it('[API test]: invalid SHIPPING_SECRET_KEY is provided in headers', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', 'invalid_key')
      .send({ userId: 1, productId: 2, count: 3 })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Invalid SHIPPING_SECRET_KEY');
        done();
      });
  });

  // [API test]: POST /api/shipping/create, when shipping body is missing/empty
  it('[API test]: POST /api/shipping/create, when shipping body is missing/empty', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('userId, productId, and count are required');
        done();
      });
  });

  // [API test]: POST /api/shipping/create, missing userId
  it('[API test]: POST /api/shipping/create, missing userId', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ productId: 2, count: 3 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('userId, productId, and count are required');
        done();
      });
  });

  // [API test]: POST /api/shipping/create, missing productId
  it('[API test]: POST /api/shipping/create, missing productId', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ userId: 1, count: 3 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('userId, productId, and count are required');
        done();
      });
  });

  // [API test]: POST /api/shipping/create, missing count
  it('[API test]: POST /api/shipping/create, missing count', (done) => {
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ userId: 1, productId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('userId, productId, and count are required');
        done();
      });
  });

  // [API test]: POST /api/shipping/create, when everything is provided
  it('[API test]: POST /api/shipping/create, when everything is provided', (done) => {
    const shippingData = {
      userId: 1,
      productId: 2,
      count: 3
    };

    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send(shippingData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.userId).to.equal(shippingData.userId);
        expect(res.body.productId).to.equal(shippingData.productId);
        expect(res.body.count).to.equal(shippingData.count);
        expect(res.body.status).to.equal('pending');
        done();
      });
  });

  // [API test]: PUT /api/shipping/cancel, shipping id is provided in request body
  it('[API test]: PUT /api/shipping/cancel, shipping id is provided in request body', (done) => {
    // First create a shipping
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ userId: 1, productId: 2, count: 3 })
      .end((err, res) => {
        const shippingId = res.body.id;

        chai.request(app)
          .put('/api/shipping/cancel')
          .set('shipping_secret_key', authKey)
          .send({ shippingId })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('cancelled');
            done();
          });
      });
  });

  // [API test]: PUT /api/shipping/cancel with missing shippingId
  it('[API test]: PUT /api/shipping/cancel with missing shippingId', (done) => {
    chai.request(app)
      .put('/api/shipping/cancel')
      .set('shipping_secret_key', authKey)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('shippingId is required');
        done();
      });
  });

  // [API test]: GET /api/shipping/get
  it('[API test]: GET /api/shipping/get', (done) => {
    // First create a record
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ userId: 1, productId: 2, count: 3 })
      .end(() => {
        chai.request(app)
          .get('/api/shipping/get')
          .set('shipping_secret_key', authKey)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            done();
          });
      });
  });

  // [API test]: GET /api/shipping/get?userId=1
  it('[API test]: GET /api/shipping/get?userId=1', (done) => {
    // Create records for different users
    chai.request(app)
      .post('/api/shipping/create')
      .set('shipping_secret_key', authKey)
      .send({ userId: 1, productId: 2, count: 3 })
      .end(() => {
        chai.request(app)
          .post('/api/shipping/create')
          .set('shipping_secret_key', authKey)
          .send({ userId: 2, productId: 3, count: 4 })
          .end(() => {
            chai.request(app)
              .get('/api/shipping/get?userId=1')
              .set('shipping_secret_key', authKey)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(1);
                expect(res.body[0].userId).to.equal(1);
                done();
              });
          });
      });
  });

  // [middleware test]: should return 403 if SHIPPING_SECRET_KEY header is missing
  it('[middleware test]: should return 403 if SHIPPING_SECRET_KEY header is missing', (done) => {
    chai.request(app)
      .get('/api/shipping/get')
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('SHIPPING_SECRET_KEY header is missing');
        done();
      });
  });

  // [middleware test]: should return 403 if SHIPPING_SECRET_KEY is invalid
  it('[middleware test]: should return 403 if SHIPPING_SECRET_KEY is invalid', (done) => {
    chai.request(app)
      .get('/api/shipping/get')
      .set('shipping_secret_key', 'invalid')
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Invalid SHIPPING_SECRET_KEY');
        done();
      });
  });

  // [middleware test]: should call next() if SHIPPING_SECRET_KEY is valid
  it('[middleware test]: should call next() if SHIPPING_SECRET_KEY is valid', (done) => {
    chai.request(app)
      .get('/api/shipping/get')
      .set('shipping_secret_key', authKey)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
