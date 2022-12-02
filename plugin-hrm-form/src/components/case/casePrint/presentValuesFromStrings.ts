import { presentValue } from '../../../utils';

export const presentValueFromStrings = (strings: Record<string, string>) =>
  presentValue(
    code => strings[code],
    codes => codes.join('\n'),
  );
