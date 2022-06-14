import jsonServer from "json-server";
import logger from "./logger";

export default function startJsonServer() {
  const server = jsonServer.create();
  const router = jsonServer.router("./db/db.json");
  const middlewares = jsonServer.defaults();

  server.use(middlewares);
  server.use(router);
  server.listen(8080, () => {
    logger.info("JSON Server is running on port 8080");
  });
}
