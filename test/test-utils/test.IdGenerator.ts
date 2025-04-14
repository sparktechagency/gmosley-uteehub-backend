import IdGenerator from '../../src/utils/IdGenerator';

describe('IdGenerator Utility', () => {
  it('Should generate a 4-digit number ID as a string', () => {
    const id = IdGenerator.generateNumberId();
    expect(id).toMatch(/^\d{4}$/);
  });

  it('should generate a 6-character alphanumeric referral code', () => {
    const code = IdGenerator.generateReferralCode();
    expect(code).toHaveLength(6);
    expect(code).toMatch(/^[a-z0-9]{6}$/);
  });

  it('should generate a valid UUID', () => {
    const uuid = IdGenerator.generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });
});
