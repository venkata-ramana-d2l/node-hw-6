const allEntities = require("./server/entities");

module.exports = {
  entities: allEntities,
  dbName: "node_gmp",
  type: "postgresql",
  clientUrl:
    "postgresql://postgres@127.0.0.1:5432",
};