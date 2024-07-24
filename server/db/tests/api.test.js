const request = require('supertest');
const app = require('../index');


describe('GET /', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'DB Server' });
  });
});

describe('GET /non-existent-route', () => {
  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
  });
});


/* GROUPS ADMIN */
describe('GET /admin/groups', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/admin/groups');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /admin/groups/:groupId', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/admin/groups/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});



/* GROUPS USER */
describe('GET /user/groups', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/user/groups');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /user/groups/:groupId', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/user/groups/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});



/* LISTS ADMIN*/
describe('GET /admin/lists/', () => {
  it('should return 200 and shopping lists in json', async () => {
    const res = await request(app).get('/admin/lists/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /user/lists/:listId', () => {
  it('should return 200 and shopping lists in json', async () => {
    const res = await request(app).get('/admin/lists/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});




/* LISTS USERS*/
describe('GET /user/lists/:groupId', () => {
  it('should return 200 and shopping lists in json', async () => {
    const res = await request(app).get('/user/lists/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /user/lists/:groupId/:listId', () => {
  it('should return 200 and shopping lists in json', async () => {
    const res = await request(app).get('/user/lists/1/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* PRODUCTS ADMIN*/
describe('GET /admin/products', () => {
  it('should return 200 and a list of products in json', async () => {
    const res = await request(app).get('/admin/products');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /admin/products/:productId', () => {
  it('should return 200 and a list of products in json', async () => {
    const res = await request(app).get('/admin/products/4');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});



/* PRODUCTS USERS*/
describe('GET /user/products/getall/:listId', () => {
  it('should return 200 and a list of products in json', async () => {
    const res = await request(app).get('/user/products/getall/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /user/products/:listId', () => {
  it('should return 200 and a list of products in json', async () => {
    const res = await request(app).get('/user/products/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* ROLES ADMIN */
describe('GET /admin/roles/', () => {
  it('should return 200 and a list of roles in json', async () => {
    const res = await request(app).get('/admin/roles/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /admin/roles/:roleId', () => {
  it('should return 200 and a role info in json', async () => {
    const res = await request(app).get('/admin/roles/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* SHELVES ADMIN */
describe('GET /admin/shelves/', () => {
  it('should return 200 and a list of shelves in json', async () => {
    const res = await request(app).get('/admin/shelves/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /admin/shelves/:shelfId', () => {
  it('should return 200 and a role info in json', async () => {
    const res = await request(app).get('/admin/shelves/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* SUPERMARKET ADMIN */
describe('GET /admin/supermarkets/', () => {
  it('should return 200 and a list of supermarket in json', async () => {
    const res = await request(app).get('/admin/supermarkets/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});

describe('GET /admin/supermarkets/:supermarketId', () => {
  it('should return 200 and a supermarket info in json', async () => {
    const res = await request(app).get('/admin/supermarkets/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* USERS */
describe('GET /user/users', () => {
  it('should return 200 and a list of info of a user in json', async () => {
    const res = await request(app).get('/user/products/getall/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});


/* DIJKSTRA */
describe('GET /dijkstra', () => {
  it('should return 200 and a list of shelves in json', async () => {
    const res = await request(app).get('/dijkstra/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});




