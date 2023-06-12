// import type { ABCookie } from './lib/labs';
// import lab, { experiment } from './lib/labs';

// export { ABCookie };
// export { experiment };
// export default lab;

import type { Experiments } from './lib/new';
import lab, { Laboratory, useLab, NextLab, labnotes } from './lib/new';

export type { Experiments };
export { Laboratory };
export { useLab };
export { NextLab };
export { labnotes };
export default lab;
