const endpointsJson = require('../endpoints.json');
const request = require('supertest');
const app = require('../db/app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/topics', () => {
  test('200: Responds with an array of topic objects containing slug and description properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe.only('GET /api/articles/:article_id', () => {
  test('200: Responds with the article linked to :article_id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('400: Responds with an error message if article_id is not a number', () => {
    return request(app)
      .get('/api/articles/soup')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Article ID must be a number.`);
      });
  });
  // well-formed article id not in the database e.g. 99999
});

describe('404: Non-existent route query', () => {
  test('404: request to non-existent route', () => {
    return request(app)
      .get('/api/topisc')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Sorry, there's nothing here!`);
      });
  });
});
