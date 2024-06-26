# typescript api codegen tool, but limited
- supports openapi v2 only
- supports json only
- supports axios only
- templates not configurable
- handles Chinese

## Install
```
npm install limited-swagger-typescript-codegen --save-dev
```

## Cli Usage

```
$ apigen --help

  Options:
    -i, --input <value>       url used to fetch the json object (required)
    -d, --dest <value>        output directory (required)
    -c, --clientPath <value>  path of file that exports AxiosInstance (default: "@/client")
    -p --prefix <value>       url prefix, will be removed in outputs (default: "")

  Examples
    $ apigen -i http://path/to/json -d ./src/api/generated -c @/common/client -p /dev-api
```

## Function Usage
```typescript
import gen from 'limited-swagger-typescript-codegen'

gen({
  input: require('/path/to/json'),
  dest: './generated',
  clientPath: '@/client',
  prefix: '/dev-api',
})
```








