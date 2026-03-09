export interface ICommand<TParams = void, TResult = any> {
    execute(params: TParams): Promise<TResult>;
    validate(params: TParams): Promise<boolean>;
    getDescription(params: TParams): string;
}
