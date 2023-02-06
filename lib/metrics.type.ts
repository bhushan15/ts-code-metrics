export interface IMaintainabilityIndexParams {
    halsteadVolume: number,
    cyclomaticComplexity: number,
    loc: number,
}

export interface ICodeMetrics extends IMaintainabilityIndexParams {
    maintainabilityIndex: number
}