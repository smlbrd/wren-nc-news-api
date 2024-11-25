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
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api/articles', () => {
  test('200: Responds with an array of article objects containing correct properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test('200: Responds with an array sorted by date, in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('200: Returned objects do not contain article.body property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty('body');
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
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
        expect(body.msg).toBe(`Bad request!`);
      });
  });
  test('404: Responds with an error message if article_id does not exist', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`There's nothing here...`);
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  // 200 responds with all comments for a given article id
  test('200', () => {})
  // 200 each comment has the appropriate properties
  // 400 
})

describe('404: Non-existent route query', () => {
  test('404: request to non-existent route', () => {
    return request(app)
      .get('/api/grandma_s_perfect_autumn_strudel_recipe')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Sorry, there's nothing here!`);
      });
  });
});
