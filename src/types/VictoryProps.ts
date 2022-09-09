import type { VictoryLabelProps } from "victory";

export type CustomLabelProps<T extends keyof VictoryLabelProps = 'x'> = Pick<VictoryLabelProps, 'x' | 'y' | T>;