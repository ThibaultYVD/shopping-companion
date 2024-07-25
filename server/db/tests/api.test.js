const request = require('supertest');
const app = require('../index');
const db = require('../model/Models')

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


  it('should return an error if retrieving groups fails', async () => {
    jest.spyOn(db.Group, 'findAll').mockImplementation(() => {
        throw new Error('Simulated error');
    });

    const response = await request(app).get('/admin/groups');

    expect(response.status).toBe(500);

    db.Group.findAll.mockRestore();
  })
});

describe('GET /admin/groups/:groupId', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/admin/groups/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
  it('should return an error if retrieving groups fails', async () => {
    jest.spyOn(db.Group, 'findByPk').mockImplementation(() => {
        throw new Error('Simulated error');
    });

    const response = await request(app).get('/admin/groups/9999');

    expect(response.status).toBe(500);

    db.Group.findByPk.mockRestore();
  })
  it('should return 404 if the group is not found', async () => {
    const response = await request(app)
        .get('/admin/groups/9999') // Utilisez un ID qui n'existe pas
  
    expect(response.status).toBe(404);
  
  });

  
});

describe('POST /admin/groups', () => {

  it('should create a new group', async () => {
      const groupData = {
          group_name: 'Test Group',
          creator_id: 30
      };

      const res = await request(app)
          .post('/admin/groups')
          .send(groupData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('group_name', 'Test Group');
      expect(res.body).toHaveProperty('user_id', 30);

      const createdGroup = await db.Group.findOne({ where: { group_name: 'Test Group' } });
      expect(createdGroup).not.toBeNull();

  });

});



describe('PATCH /admin/groups/:groupId', () => {
  let group;

  beforeAll(async () => {
      // Créez un groupe pour les tests
      
        group = await db.Group.create({
          group_name: 'Initial Group',
          creation_date: new Date(),
          user_id: 30,
          is_open: "FALSE"
      });
  });

  afterAll(async () => {
      await group.destroy();
  });

  it('should update the group name', async () => {
      const updatedData = {
          group_id: group.group_id,
          group_name: 'Updated Group'
      };

      const res = await request(app)
          .patch(`/admin/groups/${group.group_id}`)
          .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([1]);

      // Vérifiez que le groupe a été mis à jour dans la base de données
      const updatedGroup = await db.Group.findByPk(group.group_id);
      expect(updatedGroup.group_name).toBe('Updated Group');
  });
});





describe('DELETE /admin/groups/:groupId', () => {
  let group;

  beforeAll(async () => {
      // Créez un groupe pour les tests
      
        group = await db.Group.create({
          group_name: 'Initial Group',
          creation_date: new Date(),
          user_id: 30,
          is_open: "FALSE"
      });

  });

  afterAll(async () => {
      // Supprimez le groupe de test et fermez la connexion à la base de données
      if (group) {
        await group.destroy();
    }
  });

  it('should delete the group', async () => {
    const response = await request(app)
        .delete(`/admin/groups/${group.group_id}`)

    expect(response.status).toBe(204);

    // Vérifiez que le groupe a été supprimé de la base de données
    const deletedGroup = await db.Group.findByPk(group.group_id);
    expect(deletedGroup).toBeNull();

    // Mettez la variable group à null pour éviter une tentative de suppression dans afterAll
    group = null;
});
it('should return 404 if the group is not found', async () => {
  const response = await request(app)
      .delete('/admin/groups/9999') // Utilisez un ID qui n'existe pas

  expect(response.status).toBe(404);

});

it('should return an error if deletion fails', async () => {
  jest.spyOn(db.Group, 'destroy').mockImplementation(() => {
      throw new Error('Simulated error');
  });

  const response = await request(app)
      .delete(`/admin/groups/${group.group_id}`)

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('error', 'Error dans suppression du groupe');

  db.Group.destroy.mockRestore();
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






