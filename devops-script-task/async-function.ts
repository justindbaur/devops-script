import * as tl from "azure-pipelines-task-lib";
import * as azdev from "azure-devops-node-api";

const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

type AsyncFunctionArguments = {
    taskLib: typeof tl
    webApi: azdev.WebApi
    require: NodeRequire
}

export function callAsyncFunction<T>(
    args: AsyncFunctionArguments,
    source: string
): Promise<T> {
    const fn = new AsyncFunction(...Object.keys(args), source);
    return fn(...Object.values(args));
}
