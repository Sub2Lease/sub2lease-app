export const addressesAreEqual = (address1?: string, address2?: string) => {
  if (!address1 || !address2) return false;

  return address1.toLowerCase() === address2.toLowerCase();
};

export const filterTokensExcluding = <T extends { address: string }>(tokens: T[], excludeAddress?: string): T[] => {
  if (!excludeAddress) return tokens;
  return tokens.filter((token) => !addressesAreEqual(token.address, excludeAddress));
};

export const findFirstTokenNotMatching = <T extends { address: string }>(
  tokens: T[],
  excludeAddress?: string,
): T | undefined => {
  if (!excludeAddress) return tokens[0];
  return tokens.find((token) => !addressesAreEqual(token.address, excludeAddress));
};
