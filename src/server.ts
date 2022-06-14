import ExpressConfig from "./middleware/express-config";
import startJsonServer from "./middleware/start-json-server";
import logger from "./middleware/logger";

startJsonServer();

const express = new ExpressConfig();
express.app.listen(80, "localhost", () => {
  logger.info(`
    
          ------------
    
          Server Started at ${new Date().toLocaleTimeString()}!
          Swagger Docs: http://localhost:80/docs
          Swagger Spec: http://localhost:80/docs-openapi/v1/swagger.json
          
          ------------
          
        `);
});
