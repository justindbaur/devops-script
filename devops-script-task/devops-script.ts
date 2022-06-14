import * as tl from "azure-pipelines-task-lib";
import * as azdev from "azure-devops-node-api";
import { callAsyncFunction } from "./async-function";

main().catch(err => {
  var errString = JSON.stringify(err);
  tl.error(errString);
  tl.setResult(tl.TaskResult.Failed, err.message || errString);
});

async function main() {
  const endpoint = tl.getVariable("System.TeamFoundationCollectionUri");

  if (!endpoint) {
    throw new Error("'System.TeamFoundationCollectionUri' is not set, please file an issue.");
  }

  const token = tl.getEndpointAuthorizationParameterRequired("SystemVssConnection", "AccessToken");

  const handler = azdev.getHandlerFromToken(token);
  const api = new azdev.WebApi(endpoint, handler);

  const script = tl.getInputRequired("script");

  const result = await callAsyncFunction({
    taskLib: tl,
    webApi: api,
    require: require
  },
  script);

  const encoding = tl.getInputRequired("resultEncoding");

  let output: string;

  switch (encoding) {
    case "json":
      output = JSON.stringify(result);
      break;
    case "string":
      output = String(result);
      break;
    default:
      throw new Error(`Unknown encoding: ${encoding}`);
  }

  tl.setVariable("result", output);
}
