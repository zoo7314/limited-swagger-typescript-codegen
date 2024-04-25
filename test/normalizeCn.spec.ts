import { normalizeCN } from "../src/utils"

const f = normalizeCN

describe('normalizeCN', () => {
  it('converts CN strings', () => {
    expect(f('标签')).toBe('biao qian')
    expect(f('审核加入企业申请的参数')).toBe('shen he jia ru qi ye shen qing de can shu')
  })
  it('converts CN to correct pinyin', () => {
    expect(f('租户的角色')).toBe('zu hu de jue se')
    expect(f('合同模板')).toBe('he tong mu ban')
    expect(f('合同模板数据模型')).toBe('he tong mu ban shu ju mo xing')
  })
  it('keeps letters and english punctuations', () => {
    expect(f('PageDTO加入企业记录')).toBe('PageDTO jia ru qi ye ji lu')
    expect(f('加入企业记录PageDTO')).toBe('jia ru qi ye ji lu PageDTO')
    expect(f('加入Xxx企业xxx记,x,.录')).toBe('jia ru Xxx qi ye xxx ji ,x,. lu')
    expect(f('abc sdfsf')).toBe('abc sdfsf')
    expect(f('..,,')).toBe('..,,')
  })
  it('removes CN punctuations', () => {
    expect(f('「」【】标，。￥签”“：？！《》')).toBe('biao qian')
    expect(f('《《《')).toBe('')
  })
  it('returns empty string from empty string', () => {
    expect(f('')).toBe('')
  })
})

