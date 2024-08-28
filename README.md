# typescript api codegen tool, but limited
- supports openapi v2 only
- supports json only
- templates not configurable
- handles Chinese

## Node Version Requirement
Node >= 18

## Install
```
npm install limited-swagger-typescript-codegen --save-dev
```

## Usage
```typescript
import { gen } from 'limited-swagger-typescript-codegen'
import { resolve } from 'path'

gen({
  /**
   * swagger json object
   * or url that fetches it
   * */
  input: await import('/path/to/json.json'),
  /** output directory */
  output: resolve(import.meta.__dirname, './generated'),
  /**
   * path of client.ts file that exports an instance who sends requests
   * it wraps an AxiosInstance
   * */
  clientPath: '@/client',
  /** url prefix, will be removed in outputs */
  prefix: '/dev-api',
})
```


