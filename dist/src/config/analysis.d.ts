declare function startAnalysis(
  userId: string
): Promise<
  | {
      artists: string[];
      cities: string[];
    }
  | undefined
>;
export { startAnalysis };
