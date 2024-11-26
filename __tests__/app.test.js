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
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test('200: Responds with an array sorted by date, in descending order, with no body property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
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
        expect(body.msg).toBe(`Bad Request`);
      });
  });
  test('404: Responds with an error message if article_id does not exist', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Not Found`);
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('201: Responds with article including updated vote count for given article_id', () => {
    const testBody = {
      inc_votes: 1,
    };

    return request(app)
      .patch('/api/articles/2')
      .send(testBody)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(1);
      });
  });
  test('400: Responds with an error message if article_id is NaN', () => {
    const testBody = {
      inc_votes: 2,
    };

    return request(app)
      .patch(
        '/api/articles/lo-cost-scalding-hot-soups-to-burn-mouth-and-taste-nothing-to'
      )
      .send(testBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if request is empty object', () => {
    const testBody = {};

    return request(app)
      .patch('/api/articles/3')
      .send(testBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if request key is not inc_votes', () => {
    const testBody = {
      "that_key_ain't_right": 1,
    };

    return request(app)
      .patch('/api/articles/4')
      .send(testBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if request value is NaN', () => {
    const testBody = {
      inc_votes: 'one-hundred-thousand',
    };

    return request(app)
      .patch('/api/articles/5')
      .send(testBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test("404: Responds with an error message is article_id doesn't exist", () => {
    const testBody = {
      inc_votes: 10,
    };

    return request(app)
      .patch('/api/articles/99999')
      .send(testBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: Responds with all comments for a given article_id, containing correct properties', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test('200: Responds with comments ordered by most recent', () => {
    return request(app)
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('200: Responds with an empty array if article_id exists, but has no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test('400: Responds with an error message if article_id is not a number', () => {
    return request(app)
      .get('/api/articles/doctors-hate-this-one-weird-trick/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);
      });
  });
  test('404: Responds with an error message if article_id does not exist', () => {
    return request(app)
      .get('/api/articles/99999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Not Found`);
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Responds with a new comment created at a given article_id', () => {
    const testComment = {
      username: 'butter_bridge',
      body: "when are y'all gonna start posting recipes on this site?",
    };

    return request(app)
      .post('/api/articles/1/comments')
      .send(testComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          article_id: 1,
          author: 'butter_bridge',
          body: "when are y'all gonna start posting recipes on this site?",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test('400: Responds with an error message if article_id is NaN', () => {
    const testComment = {
      username: 'lurker',
      body: "i don't normally do this sort of thing",
    };

    return request(app)
      .post('/api/articles/scrambled-egg/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if username does not exist in users table', () => {
    const testComment = {
      username: 'broth-baby',
      body: 'i like soup',
    };

    return request(app)
      .post('/api/articles/3/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if body missing from request', () => {
    const testComment = {};

    return request(app)
      .post('/api/articles/5/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test('400: Responds with an error message if username missing from request', () => {
    const testComment = {
      body: "post this anywhere I don't mind",
    };

    return request(app)
      .post('/api/articles/4/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test("404: Responds with an error message if article_id doesn't exist", () => {
    const testComment = {
      username: 'lurker',
      body: 'posting is my new passion',
    };

    return request(app)
      .post('/api/articles/99999/comments')
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('DELETE /api/comments/comment_id', () => {
  test('204: Responds with status code after deleting given comment_id from table', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });
  test('400: Responds with an error message if comment_id is NaN', () => {
    return request(app)
      .delete('/api/comments/begone-comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  test("404: Responds with an error message if comment_id doesn't exist", () => {
    return request(app)
      .delete('/api/comments/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('GET /api/users', () => {
  test('200: Responds with an array of users containing correct properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('404: Non-existent route query', () => {
  test('404: Request to non-existent route', () => {
    return request(app)
      .get('/api/grandma_s_perfect_autumn_strudel_recipe')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Not Found`);
      });
  });
});
