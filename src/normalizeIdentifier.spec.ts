import { normalizeIdentifier } from "../src/normalizeIdentifier"

const f = normalizeIdentifier

describe('Parser.normalizeIdentifier', () => {
  it('handles normal strings', () => {
    expect(f('AreaItem')).toBe('AreaItem')
  })
  it('removes odd chars', () => {
    expect(f('  Di  ct-/  «Item»//  ')).toBe('DictItem')
  })
  it('handles empty string', () => {
    expect(f('')).toBe('')
  })
  it('handles "PageDTO"', () => {
    expect(f('PageDTO«TenantMemberItem»')).toBe('PageDTOTenantMemberItem')
  })
  it('handels CN names', () => {
    expect(f('加入企业记录')).toBe('JiaRuQiYeJiLu')
    expect(f('PageDTO«合作机构»')).toBe('PageDTOHeZuoJiGou')
    expect(f('企业/组织用户信息，当用户类型为组织时')).toBe('QiYeZuZhiYongHuXinXiDangYongHuLeiXingWeiZuZhiShi')
    expect(f('租户-成员ID，租户授权')).toBe('ZuHuChengYuanIDZuHuShouQuan')
  })
})



