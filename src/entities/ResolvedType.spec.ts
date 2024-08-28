import { ResolvedType } from "./ResolvedType"

describe('test basics', () => {

  it('defaults to any', () => {
    expect(ResolvedType.create().value).toBe('any')
  })

  it('represents null', () => {
    expect(ResolvedType.nullType().value).toBe('null')
  })

  it('represents undefined', () => {
    expect(ResolvedType.undefinedType().value).toBe('undefined')
  })

  it('represents void', () => {
    expect(ResolvedType.voidType().value).toBe('void')
  })

  it('represents string', () => {
    expect(ResolvedType.string().value).toBe('string')
  })

  it('represents number', () => {
    expect(ResolvedType.number().value).toBe('number')
  })

  it('represents boolean', () => {
    expect(ResolvedType.boolean().value).toBe('boolean')
  })

  it('represents blobs', () => {
    expect(ResolvedType.blob().value).toBe('Blob')
  })

  it('represents named types', () => {
    expect(ResolvedType.typeSymbol('AppUser').value).toBe('AppUser')
    expect(ResolvedType.typeSymbol(
      'List',
      { typeArguments: [ResolvedType.typeSymbol('AppUser')] },
    ).value).toBe('List<AppUser>')
  })

  it('represents Records', () => {
    expect(ResolvedType.record(
      ResolvedType.typeSymbol('number'),
    ).value).toBe('Record<string, number | undefined>')
    expect(ResolvedType.record(
      ResolvedType.typeSymbol('Cat'),
    ).value).toBe('Record<string, Cat | undefined>')
  })

  it('represents Maps', () => {
    expect(ResolvedType.map(
      ResolvedType.typeSymbol('Box'),
      ResolvedType.boolean(),
    ).value).toBe('Map<Box, boolean>')
  })

  it('representes "objects"', () => {
    expect(ResolvedType.object().value).toBe('object')
  })


  it('represents arrays', () => {
    expect(ResolvedType.arrayOf(ResolvedType.create()).value).toBe('any[]')
    expect(ResolvedType.arrayOf(ResolvedType.number()).value).toBe('number[]')
    expect(ResolvedType.arrayOf(ResolvedType.typeSymbol('Cat')).value).toBe('Cat[]')
  })

  it('represents unions', () => {
    expect(ResolvedType.union([
      ResolvedType.number(),
      ResolvedType.string(),
      ResolvedType.undefinedType(),
    ]).value).toBe('number | string | undefined')
  })

})





describe('test combinations', () => {

  it('represents Records of array of generic type', () => {
    expect(ResolvedType.record(
      ResolvedType.arrayOf(ResolvedType.typeSymbol(
        'Box',
        { typeArguments: [ResolvedType.typeSymbol('Cat')] },
      ))
    ).value).toBe('Record<string, Box<Cat>[] | undefined>')
  })

})



describe('test deps', () => {

  it('collects simple dep', () => {
    expect(ResolvedType.typeSymbol('Box').symbolDeps).toEqual(['Box'])
  })

  it('collects combined deps', () => {
    expect(ResolvedType.typeSymbol(
      'Box',
      { typeArguments: [ResolvedType.typeSymbol('Cat')] },
    ).symbolDeps).toEqual(['Box', 'Cat'])
    expect(ResolvedType.record(
      ResolvedType.arrayOf(
        ResolvedType.typeSymbol('Box', {
          typeArguments: [
            ResolvedType.typeSymbol('Cat'),
          ],
        }),
      ),
    ).symbolDeps).toEqual(['Box', 'Cat'])
    expect(ResolvedType.map(
        ResolvedType.typeSymbol('Box'),
        ResolvedType.typeSymbol('Cat'),
      ).symbolDeps).toEqual(['Box', 'Cat'])
  })

  it('ignores built-ins', () => {
    expect(
      ResolvedType.record(
        ResolvedType.boolean(),
      ).symbolDeps,
    ).toEqual([])
    expect(
      ResolvedType.map(
        ResolvedType.string(),
        ResolvedType.create(),
      ).symbolDeps,
    ).toEqual([])
  })

})










