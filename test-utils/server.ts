import { treatmentApis } from "@/modules/treatment/treatment-api";
import {
  type DefaultBodyType,
  http,
  HttpResponse,
  type HttpResponseResolver,
} from "msw";
import { setupServer } from "msw/node";
import { AssetGenerator } from "./assetGenerator";

const basePath = "http://localhost:3000/api";
const server = setupServer(
  http.get(`${basePath}${treatmentApis.treatmentApiPath}`, () => {
    const response = AssetGenerator.getMockTreatmentsResponse();
    return HttpResponse.json(response);
  }),
);

function isHttpResponseResolver(
  responseOrResolver: DefaultBodyType | HttpResponseResolver,
): responseOrResolver is HttpResponseResolver {
  return typeof responseOrResolver === "function";
}

export function mockRequest(
  method: "get" | "post" | "put" | "delete",
  pathname: string,
  responseOrResolver: DefaultBodyType | HttpResponseResolver,
): void {
  if (isHttpResponseResolver(responseOrResolver)) {
    server.use(http[method](`${basePath}${pathname}`, responseOrResolver));
  } else {
    server.use(
      http[method](`${basePath}${pathname}`, () => {
        return HttpResponse.json(responseOrResolver);
      }),
    );
  }
}

export default server;
