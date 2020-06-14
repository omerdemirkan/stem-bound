function add(n1: number, n2: number): number {
  return n1 + n2;
}

describe("add", () => {
  it("should correctly add positive numbers", () => {
    expect(add(1, 1)).toBe(2);
  });
});
