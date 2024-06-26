import { Api } from "./types";

export function addApiDeps(api: Api, deps: string[]) {
  for (const dep of deps) {
    if (
      dep &&
      !api.deps.find(e => e === dep)
    ) {
      api.deps.push(dep)
    }
  }
}
