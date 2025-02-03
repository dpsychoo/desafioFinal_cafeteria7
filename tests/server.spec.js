const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

  test("GET /cafes debe devolver status 200 y un arreglo con al menos 1 objeto", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("DELETE /cafes con un id inexistente debe devolver status 404", async () => {
    const response = await request(server).delete("/cafes/9999").set("Authorization", "Bearer token");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
  });

  test("POST /cafes debe agregar un nuevo café y devolver status 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Café Expreso" };
    const response = await request(server)
      .post("/cafes")
      .send(nuevoCafe);

    expect(response.status).toBe(201);
    expect(response.body.some(c => c.id === nuevoCafe.id && c.nombre === nuevoCafe.nombre)).toBe(true);
  });

  test("PUT /cafes debe devolver status 400 si los ids no coinciden", async () => {
    const cafeActualizado = { id: 3, nombre: "Café Mocha" };
    const response = await request(server)
      .put("/cafes/4")
      .send(cafeActualizado);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
  });

});
